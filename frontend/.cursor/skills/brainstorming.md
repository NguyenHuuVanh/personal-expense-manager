---
name: brainstorming
description: Brainstorming Protocol - Socratic questioning cho complex requests
---

# Brainstorming & Communication Protocol

> **MANDATORY:** Use for complex/vague requests, new features, or unclear requirements.

## 🛑 SOCRATIC GATE

### When to Trigger

| Pattern | Action |
|---------|--------|
| "Build/Create/Make [thing]" without details | 🛑 ASK 3 questions |
| Complex feature or architecture | 🛑 Clarify before implementing |
| Update/change request | 🛑 Confirm scope |
| Vague requirements | 🛑 Ask purpose, users, constraints |

### 🚫 3 Questions Before Implementation

1. **STOP** - Do NOT start coding
2. **ASK** - Minimum 3 questions:
   - 🎯 **Purpose**: What problem are you solving?
   - 👥 **Users**: Who will use this?
   - 📦 **Scope**: Must-have vs nice-to-have?
3. **WAIT** - Get response before proceeding

## Question Format

```markdown
### [PRIORITY] **[DECISION POINT]**

**Question:** [Clear question]

**Why This Matters:**
- [Architectural consequence]

**Options:**
| Option | Pros | Cons |
|--------|------|------|
| A | [+] | [-] |
| B | [+] | [-] |

**If Not Specified:** [Default + rationale]
```

## Progress Reporting

| Icon | Meaning |
|------|---------|
| ✅ | Completed |
| 🔄 | Running |
| ⏳ | Waiting |
| ❌ | Error |
| ⚠️ | Warning |

## Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Jumping to solutions before understanding | Wastes time on wrong problem |
| Assuming requirements without asking | Creates wrong output |
| "I think" phrases | Ask instead |
| Over-engineering first version | Delays value delivery |