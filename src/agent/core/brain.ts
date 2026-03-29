export interface Thought {
  id: string;
  timestamp: Date;
  type: 'perception' | 'reasoning' | 'decision' | 'action' | 'learning';
  content: string;
  confidence: number;
  context: Record<string, any>;
  result?: any;
  error?: string;
}

export interface Goal {
  id: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
  parentGoal?: string;
  subGoals: string[];
  progress: number;
}

export interface Action {
  id: string;
  type: string;
  tool: string;
  input: Record<string, any>;
  output?: any;
  error?: string;
  status: 'planned' | 'executing' | 'completed' | 'failed';
  startedAt?: Date;
  completedAt?: Date;
  retryCount: number;
  maxRetries: number;
}

export interface Perception {
  source: 'email' | 'webhook' | 'timer' | 'user' | 'system' | 'social';
  type: string;
  data: any;
  timestamp: Date;
  importance: number;
  processed: boolean;
}

export interface AgentState {
  sessionId: string;
  startedAt: Date;
  lastActionAt: Date;
  goals: Goal[];
  currentGoal?: string;
  recentThoughts: Thought[];
  pendingPerceptions: Perception[];
  metrics: {
    actionsCompleted: number;
    actionsFailed: number;
    goalsCompleted: number;
    errorsEncountered: number;
    learningsRecorded: number;
  };
}

export class AgentBrain {
  private state: AgentState;
  private memory: Map<string, any> = new Map();
  
  constructor(sessionId: string) {
    this.state = {
      sessionId,
      startedAt: new Date(),
      lastActionAt: new Date(),
      goals: [],
      currentGoal: undefined,
      recentThoughts: [],
      pendingPerceptions: [],
      metrics: {
        actionsCompleted: 0,
        actionsFailed: 0,
        goalsCompleted: 0,
        errorsEncountered: 0,
        learningsRecorded: 0,
      },
    };
  }

  perceive(perception: Perception): void {
    this.state.pendingPerceptions.push({
      ...perception,
      timestamp: new Date(),
      processed: false,
    });
    this.think(`Perceived ${perception.type} from ${perception.source}`);
  }

  think(content: string, type: Thought['type'] = 'reasoning', confidence = 0.8): Thought {
    const thought: Thought = {
      id: `thought_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      type,
      content,
      confidence,
      context: { sessionId: this.state.sessionId },
    };
    
    this.state.recentThoughts.push(thought);
    if (this.state.recentThoughts.length > 100) {
      this.state.recentThoughts.shift();
    }
    
    return thought;
  }

  decide(goals: Goal[]): Goal | null {
    const pendingGoals = goals.filter(g => g.status === 'pending');
    if (pendingGoals.length === 0) return null;
    
    const priorityOrder = ['critical', 'high', 'medium', 'low'];
    pendingGoals.sort((a, b) => 
      priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority)
    );
    
    const goal = pendingGoals[0];
    this.state.currentGoal = goal.id;
    goal.status = 'in_progress';
    
    this.think(`Decided to work on: ${goal.description}`, 'decision', 0.95);
    return goal;
  }

  act(action: Omit<Action, 'id' | 'startedAt' | 'completedAt'>): Action {
    const fullAction: Action = {
      ...action,
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      startedAt: new Date(),
      completedAt: undefined,
    };
    
    this.think(`Executing: ${action.type} using ${action.tool}`, 'action');
    this.state.lastActionAt = new Date();
    
    return fullAction;
  }

  learn(lesson: string, context: Record<string, any> = {}): void {
    const thought = this.think(`Learned: ${lesson}`, 'learning', 1.0);
    thought.context = { ...thought.context, ...context };
    this.state.metrics.learningsRecorded++;
    
    this.memory.set(`learn_${Date.now()}`, { lesson, context, timestamp: new Date() });
  }

  completeGoal(goalId: string, success = true): void {
    const goal = this.state.goals.find(g => g.id === goalId);
    if (goal) {
      goal.status = success ? 'completed' : 'failed';
      goal.completedAt = new Date();
      if (success) {
        goal.progress = 100;
        this.state.metrics.goalsCompleted++;
      }
      this.think(`Goal ${success ? 'completed' : 'failed'}: ${goal.description}`);
    }
  }

  getState(): AgentState {
    return this.state;
  }

  addGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'subGoals' | 'progress'>): Goal {
    const fullGoal: Goal = {
      ...goal,
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      subGoals: [],
      progress: 0,
    };
    this.state.goals.push(fullGoal);
    this.think(`New goal added: ${goal.description}`, 'perception');
    return fullGoal;
  }

  getRecentThoughts(count = 10): Thought[] {
    return this.state.recentThoughts.slice(-count);
  }

  getPendingPerceptions(): Perception[] {
    return this.state.pendingPerceptions.filter(p => !p.processed);
  }

  markPerceptionProcessed(perceptionId: number): void {
    if (this.state.pendingPerceptions[perceptionId]) {
      this.state.pendingPerceptions[perceptionId].processed = true;
    }
  }
}
