import { NextResponse } from 'next/server';
import { getAgent } from '@/agent';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  if (secret !== process.env.AGENT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const agent = getAgent();
  const actions: string[] = [];

  try {
    const metrics = await checkSystemHealth();
    actions.push(...metrics.actions);

    if (metrics.healthy) {
      const suggestions = agent.getSuggestions();
      if (suggestions.length > 0) {
        agent.addGoal(suggestions[0], 'low');
        actions.push(`Added goal from suggestion: ${suggestions[0].substring(0, 50)}...`);
      }
    }

    agent.perceive({
      source: 'timer',
      type: 'heartbeat',
      data: {
        timestamp: new Date().toISOString(),
        metrics,
      },
      importance: 0.3,
    });

    return NextResponse.json({
      heartbeat: new Date().toISOString(),
      healthy: metrics.healthy,
      actions,
      status: agent.getStatus(),
    });
  } catch (error: any) {
    return NextResponse.json({
      heartbeat: new Date().toISOString(),
      healthy: false,
      error: error.message,
    }, { status: 500 });
  }
}

async function checkSystemHealth(): Promise<{ healthy: boolean; actions: string[] }> {
  const actions: string[] = [];

  try {
    const websiteResponse = await fetch('https://sam-atlas.vercel.app', { 
      method: 'HEAD',
      signal: AbortSignal.timeout(5000),
    });
    
    if (!websiteResponse.ok) {
      actions.push('Website returned non-200 status');
    }
  } catch (error: any) {
    actions.push(`Website check failed: ${error.message}`);
  }

  try {
    const apiResponse = await fetch('https://sam-atlas.vercel.app/api/verify-payment', {
      method: 'POST',
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // Expected to fail without data
  }

  return {
    healthy: actions.length === 0,
    actions,
  };
}
