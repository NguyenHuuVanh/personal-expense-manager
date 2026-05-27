---
description: Create new application command. Triggers App Builder skill and starts interactive dialogue.
---

# /create - Create Application

$ARGUMENTS

## Task

Start a new application creation process.

### Steps:

1. **Request Analysis**
   - Understand what the user wants
   - If information is missing, ask questions

2. **Project Planning**
   - Use `project-planner` agent for task breakdown
   - Determine tech stack
   - Plan file structure
   - Create plan file and proceed to building

3. **Application Building (After Approval)**
   - Orchestrate with expert agents:
     - `database-architect` → Schema
     - `backend-specialist` → API
     - `frontend-specialist` → UI

4. **Preview**
   - Start with preview when complete
   - Present URL to user

## Usage Examples

```
/create blog site
/create e-commerce app with product listing and cart
/create todo app
/create CRM system with customer management
```