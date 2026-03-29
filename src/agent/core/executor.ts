import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

export interface Task {
  id: string;
  type: 'script' | 'api' | 'file' | 'schedule';
  command?: string;
  script?: string;
  scriptPath?: string;
  schedule?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}

export class AutonomousExecutor {
  private running = false;
  private taskQueue: Task[] = [];
  private executing: Task | null = null;
  private taskHistory: Task[] = [];
  private maxHistory = 100;

  async executeTask(task: Task): Promise<Task> {
    task.status = 'running';
    task.startedAt = new Date();
    this.executing = task;

    try {
      switch (task.type) {
        case 'script':
          task.result = await this.runScript(task.script || '');
          break;
        case 'api':
          task.result = await this.callApi(task.command || '');
          break;
        case 'file':
          task.result = await this.operateFile(task);
          break;
        default:
          throw new Error(`Unknown task type: ${task.type}`);
      }

      task.status = 'completed';
      task.completedAt = new Date();
      console.log(`[Executor] Task ${task.id} completed`);
    } catch (error: any) {
      task.status = 'failed';
      task.error = error.message;
      task.completedAt = new Date();
      console.error(`[Executor] Task ${task.id} failed:`, error.message);
    }

    this.addToHistory(task);
    this.executing = null;
    return task;
  }

  private async runScript(script: string): Promise<any> {
    const scriptPath = `/tmp/script_${Date.now()}.sh`;
    await fs.writeFile(scriptPath, script, 'utf-8');
    
    try {
      const { stdout, stderr } = await execAsync(`bash ${scriptPath}`);
      return { stdout, stderr, success: true };
    } catch (error: any) {
      return { stdout: error.stdout, stderr: error.stderr, success: false };
    } finally {
      await fs.unlink(scriptPath).catch(() => {});
    }
  }

  private async callApi(endpoint: string): Promise<any> {
    const response = await fetch(endpoint);
    return {
      status: response.status,
      data: await response.json().catch(() => response.text()),
    };
  }

  private async operateFile(task: Task): Promise<any> {
    const cmd = task.command || '';
    
    if (cmd.startsWith('read:')) {
      const filePath = cmd.replace('read:', '').trim();
      const content = await fs.readFile(filePath, 'utf-8');
      return { filePath, content, lines: content.split('\n').length };
    }
    
    if (cmd.startsWith('write:')) {
      const parts = cmd.replace('write:', '').split('>>');
      const filePath = parts[0].trim();
      const content = parts[1]?.trim() || '';
      await fs.writeFile(filePath, content, 'utf-8');
      return { filePath, written: true };
    }
    
    if (cmd.startsWith('append:')) {
      const parts = cmd.replace('append:', '').split('>>');
      const filePath = parts[0].trim();
      const content = parts[1]?.trim() || '';
      await fs.appendFile(filePath, content + '\n', 'utf-8');
      return { filePath, appended: true };
    }

    if (cmd.startsWith('mkdir:')) {
      const dirPath = cmd.replace('mkdir:', '').trim();
      await fs.mkdir(dirPath, { recursive: true });
      return { directory: dirPath, created: true };
    }

    if (cmd.startsWith('list:')) {
      const dirPath = cmd.replace('list:', '').trim();
      const files = await fs.readdir(dirPath);
      return { directory: dirPath, files };
    }

    throw new Error(`Unknown file operation: ${cmd}`);
  }

  queueTask(task: Omit<Task, 'id' | 'status' | 'createdAt'>): Task {
    const fullTask: Task = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date(),
    };
    this.taskQueue.push(fullTask);
    this.sortQueue();
    console.log(`[Executor] Queued task: ${fullTask.id} (${fullTask.type})`);
    return fullTask;
  }

  private sortQueue(): void {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    this.taskQueue.sort((a, b) => 
      priorityOrder[a.priority] - priorityOrder[b.priority]
    );
  }

  async processQueue(): Promise<void> {
    if (this.running || this.taskQueue.length === 0) return;
    
    this.running = true;
    
    while (this.taskQueue.length > 0) {
      const task = this.taskQueue.shift();
      if (task) {
        await this.executeTask(task);
      }
    }
    
    this.running = false;
  }

  private addToHistory(task: Task): void {
    this.taskHistory.unshift(task);
    if (this.taskHistory.length > this.maxHistory) {
      this.taskHistory.pop();
    }
  }

  getQueue(): Task[] {
    return [...this.taskQueue];
  }

  getHistory(): Task[] {
    return [...this.taskHistory];
  }

  getStatus(): { running: boolean; queueLength: number; historyLength: number; currentTask?: string } {
    return {
      running: this.running,
      queueLength: this.taskQueue.length,
      historyLength: this.taskHistory.length,
      currentTask: this.executing?.id,
    };
  }

  cancelTask(taskId: string): boolean {
    const index = this.taskQueue.findIndex(t => t.id === taskId);
    if (index !== -1) {
      this.taskQueue.splice(index, 1);
      console.log(`[Executor] Cancelled task: ${taskId}`);
      return true;
    }
    return false;
  }

  retryTask(taskId: string): Task | null {
    const task = this.taskHistory.find(t => t.id === taskId);
    if (task && task.status === 'failed') {
      const newTask = this.queueTask({
        type: task.type,
        command: task.command,
        script: task.script,
        scriptPath: task.scriptPath,
        schedule: task.schedule,
        priority: task.priority,
      });
      return newTask;
    }
    return null;
  }
}

export const executor = new AutonomousExecutor();
