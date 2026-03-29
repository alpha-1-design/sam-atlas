import { NextResponse } from 'next/server';
import { getAgent } from '@/agent';

interface ScheduledTask {
  id: string;
  name: string;
  schedule: string;
  action: string;
  enabled: boolean;
  lastRun?: string;
  nextRun?: string;
  runs: number;
}

const tasks: ScheduledTask[] = [
  {
    id: 'daily_health_check',
    name: 'Daily Health Check',
    schedule: '0 8 * * *',
    action: 'check_health',
    enabled: true,
    runs: 0,
  },
  {
    id: 'hourly_metrics',
    name: 'Hourly Metrics Check',
    schedule: '0 * * * *',
    action: 'check_metrics',
    enabled: true,
    runs: 0,
  },
  {
    id: 'weekly_review',
    name: 'Weekly Learning Review',
    schedule: '0 9 * * 0',
    action: 'weekly_review',
    enabled: true,
    runs: 0,
  },
];

export async function GET() {
  return NextResponse.json({
    tasks: tasks.map(t => ({
      ...t,
      nextRun: calculateNextRun(t.schedule),
    })),
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { action, taskId } = body;

  const agent = getAgent();

  switch (action) {
    case 'run_task':
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      }
      
      task.lastRun = new Date().toISOString();
      task.runs++;
      
      await executeTask(agent, task.action);
      
      return NextResponse.json({
        success: true,
        task: task.name,
        message: `Task executed successfully`,
      });

    case 'run_all':
      const results: string[] = [];
      for (const t of tasks.filter(t => t.enabled)) {
        t.lastRun = new Date().toISOString();
        t.runs++;
        await executeTask(agent, t.action);
        results.push(t.name);
      }
      
      return NextResponse.json({
        success: true,
        tasks: results,
      });

    case 'enable':
    case 'disable':
      const targetTask = tasks.find(t => t.id === taskId);
      if (targetTask) {
        targetTask.enabled = action === 'enable';
        return NextResponse.json({ success: true, task: targetTask });
      }
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}

async function executeTask(agent: ReturnType<typeof getAgent>, action: string): Promise<void> {
  switch (action) {
    case 'check_health':
      agent.addGoal('Perform daily health check', 'medium');
      break;
    case 'check_metrics':
      agent.perceive({
        source: 'timer',
        type: 'hourly_check',
        data: { action: 'metrics' },
        importance: 0.2,
      });
      break;
    case 'weekly_review':
      agent.weeklyReview();
      break;
    default:
      agent.addGoal(`Execute scheduled task: ${action}`, 'low');
  }
}

function calculateNextRun(cron: string): string | undefined {
  const parts = cron.split(' ');
  if (parts.length !== 5) return undefined;
  
  const [minute, hour] = parts;
  const now = new Date();
  const next = new Date();
  
  next.setHours(parseInt(hour) || 0);
  next.setMinutes(parseInt(minute) || 0);
  next.setSeconds(0);
  
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }
  
  return next.toISOString();
}
