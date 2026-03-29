import { AgentBrain } from './core/brain';
import { AgentLoop } from './core/loop';
import { AutonomousExecutor } from './core/executor';
import { LearningLoop } from './loops/learning';
import { twitterTool } from './tools/twitter';
import { monitoringTool } from './tools/monitoring';
import { emailTool } from './tools/email';

export class SamAtlasAgent {
  private brain: AgentBrain;
  private loop: AgentLoop;
  private executor: AutonomousExecutor;
  private learning: LearningLoop;
  private initialized = false;

  constructor() {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.brain = new AgentBrain(sessionId);
    this.loop = new AgentLoop(this.brain);
    this.executor = new AutonomousExecutor();
    this.learning = new LearningLoop(this.brain);
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    this.loop.registerTool(twitterTool);
    this.loop.registerTool(monitoringTool);
    this.loop.registerTool(emailTool);

    this.brain.think('Sam Atlas Agent initialized');
    this.brain.think('All tools registered');
    this.brain.think('Ready for autonomous operation');

    this.initialized = true;
  }

  start(): void {
    this.loop.start();
    this.executor.processQueue();
    this.brain.think('Agent started - operating autonomously');
  }

  stop(): void {
    this.loop.stop();
    this.brain.think('Agent stopped');
  }

  perceive(perception: {
    source: 'email' | 'webhook' | 'timer' | 'user' | 'system' | 'social';
    type: string;
    data: any;
    importance?: number;
  }): void {
    this.brain.perceive({
      ...perception,
      importance: perception.importance || 0.5,
    });
  }

  addGoal(description: string, priority: 'critical' | 'high' | 'medium' | 'low' = 'medium'): void {
    this.brain.addGoal({
      description,
      priority,
      status: 'pending',
    });
  }

  executeTask(task: {
    type: 'script' | 'api' | 'file';
    command?: string;
    script?: string;
    priority?: 'critical' | 'high' | 'medium' | 'low';
  }): void {
    this.executor.queueTask({
      type: task.type,
      command: task.command,
      script: task.script,
      priority: task.priority || 'medium',
    });
  }

  think(prompt: string): string {
    const state = this.brain.getState();
    const thoughts = this.brain.getRecentThoughts(5);
    
    let response = `Current goals: ${state.goals.length}\n`;
    response += `Pending perceptions: ${state.pendingPerceptions.length}\n`;
    response += `Metrics: ${state.metrics.actionsCompleted} actions, ${state.metrics.errorsEncountered} errors\n`;
    response += `\nRecent thoughts:\n`;
    thoughts.forEach(t => {
      response += `- [${t.type}] ${t.content}\n`;
    });
    
    return response;
  }

  learn(type: 'success' | 'failure' | 'feedback', content: string, context: Record<string, any> = {}): void {
    this.learning.logLearning({ type, content, context });
  }

  getStatus(): any {
    return {
      initialized: this.initialized,
      loop: this.loop.isRunning(),
      executor: this.executor.getStatus(),
      brain: {
        goals: this.brain.getState().goals.length,
        recentThoughts: this.brain.getRecentThoughts(5).length,
        metrics: this.brain.getState().metrics,
      },
      learning: this.learning.getMetrics(),
    };
  }

  getSuggestions(): string[] {
    return this.learning.getSuggestions();
  }

  weeklyReview(): void {
    this.learning.weeklyReview();
  }
}

let agentInstance: SamAtlasAgent | null = null;

export function getAgent(): SamAtlasAgent {
  if (!agentInstance) {
    agentInstance = new SamAtlasAgent();
    agentInstance.initialize();
  }
  return agentInstance;
}
