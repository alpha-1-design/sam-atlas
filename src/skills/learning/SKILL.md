# AUTONOMOUS LEARNING SKILL

## Purpose
Continuously improve from experience, errors, and feedback.

## Status
Advanced

## Learning Loop

```
┌─────────────────────────────────────────────┐
│  OBSERVE → ANALYZE → ADAPT → STORE → REPEAT │
└─────────────────────────────────────────────┘
```

## Observation System

### Log Everything
- All user interactions
- Task completions
- Errors encountered
- Decisions made
- Feedback received

### Log Format
```typescript
{
  timestamp: Date,
  type: "interaction" | "task" | "error" | "decision",
  context: string,
  action: string,
  result: "success" | "failure",
  details: object
}
```

## Analysis Methods

### Weekly Review
- Analyze error patterns
- Identify successful approaches
- Spot improvement opportunities
- Update skills if needed

### Monthly Deep Dive
- Review overall performance
- Assess skill effectiveness
- Plan major improvements
- Research new capabilities

### Real-time Learning
- Adjust based on immediate feedback
- Apply pattern recognition
- Update session memory
- Flag for permanent memory if recurring

## Error Learning

### Log Error
```typescript
{
  error: string,
  context: string,
  attempted_fix: boolean,
  resolution: string,
  prevention: string[]
}
```

### Prevention Actions
1. Add validation
2. Improve error messages
3. Add fallback options
4. Document known issues
5. Create monitoring

## Feedback Integration

### Explicit Feedback
User tells you directly:
- "That was helpful"
- "Try a different approach"
- "Be more concise"

### Implicit Feedback
Inferred from behavior:
- Didn't open email → Wrong subject
- Left checkout → Price or trust issue
- Asked same question → Unclear documentation

## Memory Updates

### Session → Permanent
When something works 3+ times:
1. Review session logs
2. Identify pattern
3. Write to permanent memory
4. Test in new contexts

### Knowledge Base
Build searchable knowledge:
- Lessons learned
- Solutions to problems
- User preferences
- Best practices

## Self-Improvement Triggers

### On Error
1. Log error details
2. Analyze root cause
3. Fix immediately if possible
4. Plan prevention
5. Update documentation

### On Success
1. Note what worked
2. Consider applying elsewhere
3. Share with other skills
4. Add to success patterns

### On Feedback
1. Acknowledge feedback
2. Analyze for patterns
3. Adjust behavior
4. Confirm adjustment worked

## Metrics to Track

- Error rate over time
- Task completion rate
- User satisfaction
- Learning speed (time to improve)
- Knowledge retention
