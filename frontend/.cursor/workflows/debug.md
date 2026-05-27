---
description: Debugging command. Activates DEBUG mode for systematic problem investigation.
---

# /debug - Systematic Problem Investigation

$ARGUMENTS

## Purpose

Systematic investigation of issues, errors, or unexpected behavior.

## Behavior

1. **Gather information**
   - Error message
   - Reproduction steps
   - Expected vs actual behavior
   - Recent changes

2. **Form hypotheses**
   - List possible causes
   - Order by likelihood

3. **Investigate systematically**
   - Test each hypothesis
   - Check logs, data flow
   - Use elimination method

4. **Fix and prevent**
   - Apply fix
   - Explain root cause
   - Add prevention measures

## Output Format

```
## 🔍 Debug: [Issue]

### 1. Symptom
[What's happening]

### 2. Information Gathered
- Error: [error message]
- File: [filepath]
- Line: [line number]

### 3. Hypotheses
1. ❓ [Most likely cause]
2. ❓ [Second possibility]

### 4. Investigation
[What I checked] → [Result]

### 5. Root Cause
🎯 [Explanation of why this happened]

### 6. Fix
[Before/After code]

### 7. Prevention
🛡️ [How to prevent this in the future]
```

## Key Principles

- Ask before assuming
- Test hypotheses, don't guess randomly
- Explain why, not just what to fix
- Prevent recurrence with tests