---
description: Brainstorming command. Explores multiple options before implementation.
---

# /brainstorm - Structured Idea Exploration

$ARGUMENTS

## Purpose

Explore options before committing to implementation. Use when you need to explore multiple approaches.

## Behavior

1. **Understand the goal**
   - What problem are we solving?
   - Who is the user?
   - What constraints exist?

2. **Generate options**
   - Provide at least 3 different approaches
   - Each with pros and cons
   - Consider unconventional solutions

3. **Compare and recommend**
   - Summarize tradeoffs
   - Give recommendation with reasoning

## Output Format

```
## 🧠 Brainstorm: [Topic]

### Context
[Brief problem statement]

### Option A: [Name]
✅ Pros: [benefit 1], [benefit 2]
❌ Cons: [drawback 1]

### Option B: [Name]
✅ Pros: [benefit 1]
❌ Cons: [drawback 1], [drawback 2]

### Option C: [Name]
✅ Pros: [benefit 1]
❌ Cons: [drawback 1]

## 💡 Recommendation
**Option [X]** because [reasoning].
```

## Key Principles

- No code - this is about ideas, not implementation
- Visual when helpful
- Honest tradeoffs
- Defer to user to decide