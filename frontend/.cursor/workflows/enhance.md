---
description: Add or update features in existing application. Used for iterative development.
---

# /enhance - Update Application

$ARGUMENTS

## Task

Add features or make updates to existing application.

### Steps:

1. **Understand Current State**
   - Understand existing features, tech stack

2. **Plan Changes**
   - Determine what will be added/changed
   - Detect affected files
   - Check dependencies

3. **Present Plan to User** (for major changes)

4. **Apply**
   - Call relevant agents
   - Make changes
   - Test

5. **Update Preview**
   - Hot reload or restart

## Usage Examples

```
/enhance add dark mode
/enhance build admin panel
/enhance integrate payment system
/enhance add search feature
/enhance make responsive
```

## Caution

- Get approval for major changes
- Warn on conflicting requests
- Commit each change with git