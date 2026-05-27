---
description: Display agent and project status. Progress tracking and status board.
---

# /status - Show Status

$ARGUMENTS

## Task

Show current project and agent status.

### What It Shows

1. **Project Info**
   - Project name and path
   - Tech stack
   - Current features

2. **Agent Status Board**
   - Which agents are running
   - Which tasks are completed
   - Pending work

3. **File Statistics**
   - Files created count
   - Files modified count

4. **Preview Status**
   - Is server running
   - URL
   - Health check

## Example Output

```
=== Project Status ===

📁 Project: CRM Frontend
📂 Path: D:/WORK/crm-frontend
🏷️ Type: Next.js + Apollo + TypeScript
📊 Status: active

🔧 Tech Stack:
   Framework: next.js (App Router)
   API: Apollo Client (GraphQL)
   Styling: Tailwind CSS
   State: TanStack Query

✅ Features (email-marketing):
   • campaign-list
   • AB Campaign Editor
   • Reports Dashboard
   • Campaign Detail Modal

⏳ Pending:
   • Template management
   • A/B Test auto-winner

📄 Files: 15 modified, 8 created

=== Agent Status ===

✅ frontend-specialist → Email marketing UI ✅
✅ backend-specialist → API hooks ✅
🔄 debugger → TrendChart debug (60%)
⏳ test-engineer → Waiting

=== Preview ===

🌐 URL: http://localhost:3000
💚 Health: OK
```