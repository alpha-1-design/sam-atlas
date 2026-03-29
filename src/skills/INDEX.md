# SKILLS INDEX

## Overview
This is the complete list of skills available to Sam Atlas. Each skill is a modular capability that can be loaded and used independently.

## Core Skills

| Skill | Status | Purpose |
|-------|--------|---------|
| email | Advanced | Email operations |
| payment | Advanced | Payment processing |
| content | Advanced | Content creation |
| research | Advanced | Information gathering |
| learning | Advanced | Self-improvement |
| social | Intermediate | Social media management |
| browser | Intermediate | Web automation |
| voice | Advanced | Text-to-speech, voice commands |
| autonomous | Advanced | Self-directed task execution |
| monitoring | Advanced | System health, metrics |

## Skill Loading

Skills are loaded dynamically based on task requirements:

```typescript
// Load skill
const skill = await loadSkill('email');

// Use skill capability
await skill.send({
  to: 'user@example.com',
  subject: 'Hello',
  body: 'World'
});
```

## Adding New Skills

1. Create `/src/skills/[skill-name]/SKILL.md`
2. Define inputs, outputs, tools
3. Implement in TypeScript
4. Add to this index
5. Document with examples
6. Write tests

## Skill Priority

When multiple skills apply:
1. Safety-critical (payment, security)
2. Revenue-generating (sales, conversion)
3. Customer-facing (support, communication)
4. Operational (monitoring, maintenance)
5. Experimental (new features)

## Skill Metrics

Track per skill:
- Usage count
- Success rate
- Average duration
- Error frequency
- User satisfaction

## Version History

- v1.0 (March 28, 2026): Initial 7 skills
- Future: Browser automation, voice, etc.
