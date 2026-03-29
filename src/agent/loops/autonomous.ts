import { getAgent } from '../index';

export interface AutonomousLoopConfig {
  enabled: boolean;
  intervalMs: number;
  maxIterations: number;
}

export class AutonomousLoop {
  private config: AutonomousLoopConfig;
  private running = false;
  private intervalId?: NodeJS.Timeout;
  private iterations = 0;

  constructor(config: Partial<AutonomousLoopConfig> = {}) {
    this.config = {
      enabled: config.enabled ?? true,
      intervalMs: config.intervalMs ?? 60000,
      maxIterations: config.maxIterations ?? 1000,
    };
  }

  start(): void {
    if (this.running) return;
    
    this.running = true;
    this.iterations = 0;
    
    console.log(`[AutonomousLoop] Starting - interval: ${this.config.intervalMs}ms`);
    
    this.run();
    
    this.intervalId = setInterval(() => {
      this.run();
    }, this.config.intervalMs);
  }

  stop(): void {
    this.running = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    console.log('[AutonomousLoop] Stopped');
  }

  private async run(): Promise<void> {
    if (!this.running || this.iterations >= this.config.maxIterations) {
      this.stop();
      return;
    }

    this.iterations++;
    
    try {
      await this.iterate();
    } catch (error: any) {
      console.error(`[AutonomousLoop] Iteration ${this.iterations} failed:`, error.message);
    }
  }

  private async iterate(): Promise<void> {
    const agent = getAgent();
    const status = agent.getStatus();

    console.log(`[AutonomousLoop] Iteration ${this.iterations} - Goals: ${status.brain.goals}`);

    if (status.executor.queueLength > 0) {
      console.log(`[AutonomousLoop] Processing ${status.executor.queueLength} queued tasks`);
    }

    const suggestions = agent.getSuggestions();
    if (suggestions.length > 0 && Math.random() > 0.7) {
      console.log(`[AutonomousLoop] Applying suggestion: ${suggestions[0].substring(0, 50)}...`);
      agent.addGoal(suggestions[0], 'low');
    }

    agent.perceive({
      source: 'timer',
      type: 'loop_iteration',
      data: {
        iteration: this.iterations,
        goals: status.brain.goals,
        suggestions: suggestions.length,
      },
      importance: 0.1,
    });
  }

  getStatus(): { running: boolean; iterations: number; config: AutonomousLoopConfig } {
    return {
      running: this.running,
      iterations: this.iterations,
      config: this.config,
    };
  }
}

export const autonomousLoop = new AutonomousLoop({
  intervalMs: 300000,
  enabled: false,
});
