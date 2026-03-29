import { NextResponse } from 'next/server';
import { getAgent } from '@/agent';

export async function GET(request: Request) {
  const agent = getAgent();

  if (request.url.includes('/status')) {
    return NextResponse.json(agent.getStatus());
  }

  if (request.url.includes('/suggestions')) {
    return NextResponse.json(agent.getSuggestions());
  }

  if (request.url.includes('/think')) {
    const { searchParams } = new URL(request.url);
    const prompt = searchParams.get('prompt') || 'What is your current state?';
    return NextResponse.json({ response: agent.think(prompt) });
  }

  return NextResponse.json({
    name: 'Sam Atlas Agent',
    version: '1.0',
    status: 'running',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  const agent = getAgent();
  const body = await request.json();
  const { action, ...data } = body;

  switch (action) {
    case 'perceive':
      agent.perceive(data);
      return NextResponse.json({ success: true, message: 'Perception recorded' });

    case 'add_goal':
      agent.addGoal(data.description, data.priority);
      return NextResponse.json({ success: true, message: 'Goal added' });

    case 'execute_task':
      agent.executeTask(data);
      return NextResponse.json({ success: true, message: 'Task queued' });

    case 'learn':
      agent.learn(data.type, data.content, data.context || {});
      return NextResponse.json({ success: true, message: 'Learning recorded' });

    case 'start':
      agent.start();
      return NextResponse.json({ success: true, message: 'Agent started' });

    case 'stop':
      agent.stop();
      return NextResponse.json({ success: true, message: 'Agent stopped' });

    case 'review':
      agent.weeklyReview();
      return NextResponse.json({ success: true, message: 'Weekly review complete' });

    default:
      return NextResponse.json(
        { error: 'Unknown action' },
        { status: 400 }
      );
  }
}
