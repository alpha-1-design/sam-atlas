import { AgentBrain } from '../core/brain';

export interface LearningEntry {
  id: string;
  type: 'success' | 'failure' | 'feedback' | 'pattern' | 'improvement';
  content: string;
  context: Record<string, any>;
  timestamp: Date;
  confidence: number;
  applied: boolean;
  applications: number;
}

export interface SkillLevel {
  name: string;
  level: number;
  experience: number;
  lastUsed: Date;
  successRate: number;
}

export interface Improvement {
  id: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'proposed' | 'approved' | 'implemented' | 'tested' | 'rejected';
  createdAt: Date;
  implementedAt?: Date;
  impact: number;
  effort: number;
}

export class LearningLoop {
  private brain: AgentBrain;
  private learningLog: LearningEntry[] = [];
  private skills: Map<string, SkillLevel> = new Map();
  private improvements: Improvement[] = [];
  private maxLogSize = 500;

  constructor(brain: AgentBrain) {
    this.brain = brain;
    this.initializeSkills();
  }

  private initializeSkills(): void {
    const coreSkills = [
      'email', 'payment', 'content', 'research', 'social', 
      'monitoring', 'twitter', 'execution', 'decision', 'learning'
    ];
    
    coreSkills.forEach(skill => {
      this.skills.set(skill, {
        name: skill,
        level: 1,
        experience: 0,
        lastUsed: new Date(),
        successRate: 0,
      });
    });
  }

  logLearning(entry: Omit<LearningEntry, 'id' | 'timestamp' | 'applied' | 'applications'>): LearningEntry {
    const fullEntry: LearningEntry = {
      ...entry,
      id: `learn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      applied: false,
      applications: 0,
    };

    this.learningLog.unshift(fullEntry);
    if (this.learningLog.length > this.maxLogSize) {
      this.learningLog.pop();
    }

    this.brain.learn(entry.content, entry.context);
    
    if (entry.type === 'success' || entry.type === 'pattern') {
      this.updateSkillLevel(entry.context.skill, true);
    } else if (entry.type === 'failure') {
      this.updateSkillLevel(entry.context.skill, false);
    }

    this.analyzeForImprovements(fullEntry);

    return fullEntry;
  }

  private updateSkillLevel(skillName?: string, success?: boolean): void {
    if (!skillName) return;
    
    const skill = this.skills.get(skillName);
    if (!skill) return;

    skill.lastUsed = new Date();
    skill.experience += success ? 10 : 2;

    const total = this.learningLog.filter(e => e.context.skill === skillName).length;
    const successes = this.learningLog.filter(e => 
      e.context.skill === skillName && e.type === 'success'
    ).length;
    
    skill.successRate = total > 0 ? (successes / total) * 100 : 0;

    if (skill.experience >= skill.level * 100) {
      skill.level++;
      this.brain.think(`Skill leveled up: ${skillName} is now level ${skill.level}`, 'learning');
    }
  }

  private analyzeForImprovements(entry: LearningEntry): void {
    if (entry.type === 'failure') {
      const existing = this.improvements.find(i => 
        i.description.includes(entry.content) && i.status !== 'rejected'
      );
      
      if (!existing) {
        const improvement: Improvement = {
          id: `imp_${Date.now()}`,
          description: `Fix: ${entry.content}`,
          priority: 'medium',
          status: 'proposed',
          createdAt: new Date(),
          impact: 3,
          effort: 2,
        };
        this.improvements.push(improvement);
        this.brain.think(`Proposed improvement: ${improvement.description}`, 'learning');
      }
    }

    if (entry.type === 'pattern' && entry.applications > 3) {
      const improvement: Improvement = {
        id: `imp_${Date.now()}`,
        description: `Generalize pattern: ${entry.content}`,
        priority: 'low',
        status: 'proposed',
        createdAt: new Date(),
        impact: 4,
        effort: 3,
      };
      this.improvements.push(improvement);
    }
  }

  getSuggestions(): string[] {
    const suggestions: string[] = [];

    const failedSkills = this.learningLog
      .filter(e => e.type === 'failure')
      .reduce((acc, e) => {
        const skill = e.context.skill;
        acc[skill] = (acc[skill] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    Object.entries(failedSkills)
      .filter(([_, count]) => count >= 3)
      .forEach(([skill]) => {
        suggestions.push(`Practice ${skill} more - high failure rate`);
      });

    const recentFeedback = this.learningLog
      .filter(e => e.type === 'feedback')
      .slice(0, 3);

    recentFeedback.forEach(f => {
      suggestions.push(`Review feedback: ${f.content.substring(0, 50)}...`);
    });

    const pendingImprovements = this.improvements
      .filter(i => i.status === 'proposed')
      .slice(0, 3);

    pendingImprovements.forEach(i => {
      suggestions.push(`Consider: ${i.description}`);
    });

    return suggestions;
  }

  applyImprovement(improvementId: string): boolean {
    const improvement = this.improvements.find(i => i.id === improvementId);
    if (!improvement) return false;

    improvement.status = 'implemented';
    improvement.implementedAt = new Date();

    this.logLearning({
      type: 'improvement',
      content: `Implemented: ${improvement.description}`,
      context: { improvementId },
      confidence: 1.0,
    });

    return true;
  }

  getSkillLevel(skillName: string): SkillLevel | undefined {
    return this.skills.get(skillName);
  }

  getAllSkills(): SkillLevel[] {
    return Array.from(this.skills.values());
  }

  getRecentLearnings(count = 20): LearningEntry[] {
    return this.learningLog.slice(0, count);
  }

  getImprovements(status?: Improvement['status']): Improvement[] {
    if (status) {
      return this.improvements.filter(i => i.status === status);
    }
    return [...this.improvements];
  }

  getMetrics(): {
    totalLearnings: number;
    successRate: number;
    topSkills: SkillLevel[];
    pendingImprovements: number;
  } {
    const total = this.learningLog.length;
    const successes = this.learningLog.filter(e => e.type === 'success').length;
    
    const topSkills = Array.from(this.skills.values())
      .sort((a, b) => b.level - a.level || b.experience - a.experience)
      .slice(0, 5);

    return {
      totalLearnings: total,
      successRate: total > 0 ? (successes / total) * 100 : 0,
      topSkills,
      pendingImprovements: this.improvements.filter(i => i.status === 'proposed').length,
    };
  }

  weeklyReview(): void {
    this.brain.think('Starting weekly learning review...', 'learning');

    const thisWeek = this.learningLog.filter(e => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return e.timestamp > weekAgo;
    });

    const successes = thisWeek.filter(e => e.type === 'success').length;
    const failures = thisWeek.filter(e => e.type === 'failure').length;

    this.brain.think(
      `Weekly review: ${successes} successes, ${failures} failures`,
      'learning'
    );

    const skillImprovements: string[] = [];
    this.skills.forEach((skill, name) => {
      if (skill.level > 1) {
        skillImprovements.push(`${name}: level ${skill.level}`);
      }
    });

    if (skillImprovements.length > 0) {
      this.brain.think(
        `Skill improvements: ${skillImprovements.join(', ')}`,
        'learning'
      );
    }

    this.brain.learn(
      `Weekly review complete. ${successes} successes, ${failures} failures this week.`,
      { 
        weekOf: new Date().toISOString(),
        successes,
        failures,
        skillImprovements,
      }
    );
  }
}
