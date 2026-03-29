import { AgentBrain, Action, Goal, Perception } from './brain';

export interface Tool {
  name: string;
  description: string;
  execute: (input: Record<string, any>) => Promise<any>;
  requiredCapabilities: string[];
}

export class AgentLoop {
  private brain: AgentBrain;
  private tools: Map<string, Tool> = new Map();
  private running = false;
  private tickInterval: number = 5000;
  private intervalId?: NodeJS.Timeout;

  constructor(brain: AgentBrain) {
    this.brain = brain;
  }

  registerTool(tool: Tool): void {
    this.tools.set(tool.name, tool);
    this.brain.think(`Registered tool: ${tool.name}`);
  }

  async executeAction(action: Action): Promise<Action> {
    const tool = this.tools.get(action.tool);
    if (!tool) {
      action.error = `Tool not found: ${action.tool}`;
      action.status = 'failed';
      return action;
    }

    try {
      action.output = await tool.execute(action.input);
      action.status = 'completed';
      action.completedAt = new Date();
      this.brain.think(`Action completed: ${action.type}`, 'action');
    } catch (error: any) {
      action.error = error.message;
      action.status = 'failed';
      action.retryCount++;
      
      if (action.retryCount < action.maxRetries) {
        this.brain.think(`Retrying action (${action.retryCount}/${action.maxRetries}): ${action.type}`, 'reasoning');
        return this.executeAction(action);
      }
      
      this.brain.think(`Action failed after ${action.maxRetries} retries: ${action.type}`, 'action');
    }

    return action;
  }

  async think(): Promise<void> {
    const state = this.brain.getState();
    const pendingPerceptions = this.brain.getPendingPerceptions();
    
    if (pendingPerceptions.length > 0) {
      for (const perception of pendingPerceptions) {
        await this.handlePerception(perception);
      }
    }

    const goal = this.brain.decide(state.goals);
    if (goal) {
      await this.executeGoal(goal);
    }
  }

  async handlePerception(perception: Perception): Promise<void> {
    this.brain.think(
      `Processing perception from ${perception.source}: ${perception.type}`,
      'perception',
      perception.importance
    );

    switch (perception.source) {
      case 'email':
        await this.handleEmail(perception);
        break;
      case 'webhook':
        await this.handleWebhook(perception);
        break;
      case 'social':
        await this.handleSocial(perception);
        break;
      case 'timer':
        await this.handleTimer(perception);
        break;
      default:
        this.brain.think(`No handler for perception type: ${perception.type}`);
    }
  }

  async handleEmail(perception: Perception): Promise<void> {
    const { data } = perception;
    
    if (data.isPayment) {
      this.brain.addGoal({
        description: `Process payment for ${data.customerEmail}`,
        priority: 'critical',
        status: 'pending',
      });
    } else if (data.isSupport) {
      this.brain.addGoal({
        description: `Respond to customer: ${data.subject}`,
        priority: 'high',
        status: 'pending',
      });
    } else {
      this.brain.addGoal({
        description: `Review email: ${data.subject}`,
        priority: 'medium',
        status: 'pending',
      });
    }
  }

  async handleWebhook(perception: Perception): Promise<void> {
    const { data } = perception;
    
    if (data.type === 'payment_success') {
      this.brain.addGoal({
        description: `Deliver product to ${data.customerEmail}`,
        priority: 'critical',
        status: 'pending',
      });
    }
  }

  async handleSocial(perception: Perception): Promise<void> {
    const { data } = perception;
    
    if (data.type === 'mention' || data.type === 'reply') {
      this.brain.addGoal({
        description: `Engage on social: ${data.content?.substring(0, 50)}...`,
        priority: 'medium',
        status: 'pending',
      });
    }
  }

  async handleTimer(perception: Perception): Promise<void> {
    const { data } = perception;
    
    if (data.type === 'daily_check') {
      this.brain.addGoal({
        description: 'Daily system check',
        priority: 'low',
        status: 'pending',
      });
    }
  }

  async executeGoal(goal: Goal): Promise<void> {
    this.brain.think(`Executing goal: ${goal.description}`, 'action');

    const actions = this.planActions(goal);
    
    for (const actionPlan of actions) {
      const action = this.brain.act({
        type: actionPlan.type,
        tool: actionPlan.tool,
        input: actionPlan.input,
        status: 'planned',
        retryCount: 0,
        maxRetries: 3,
      });

      const result = await this.executeAction(action);
      
      if (result.status === 'failed') {
        this.brain.completeGoal(goal.id, false);
        this.brain.learn(`Failed to complete goal: ${goal.description}. Error: ${result.error}`);
        return;
      }
    }

    this.brain.completeGoal(goal.id, true);
    this.brain.learn(`Successfully completed: ${goal.description}`);
  }

  planActions(goal: Goal): Array<{type: string; tool: string; input: Record<string, any>}> {
    const actions: Array<{type: string; tool: string; input: Record<string, any>}> = [];

    if (goal.description.toLowerCase().includes('deliver')) {
      actions.push({ type: 'send_email', tool: 'email', input: { template: 'delivery' } });
    } else if (goal.description.toLowerCase().includes('respond')) {
      actions.push({ type: 'send_email', tool: 'email', input: { template: 'response' } });
    } else if (goal.description.toLowerCase().includes('engage')) {
      actions.push({ type: 'post_social', tool: 'social', input: {} });
    } else if (goal.description.toLowerCase().includes('check')) {
      actions.push({ type: 'check_metrics', tool: 'monitoring', input: {} });
    }

    return actions;
  }

  start(): void {
    if (this.running) return;
    
    this.running = true;
    this.brain.think('Agent loop started');
    
    this.intervalId = setInterval(async () => {
      if (this.running) {
        await this.think();
      }
    }, this.tickInterval);
  }

  stop(): void {
    this.running = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    this.brain.think('Agent loop stopped');
  }

  isRunning(): boolean {
    return this.running;
  }

  getBrain(): AgentBrain {
    return this.brain;
  }
}
