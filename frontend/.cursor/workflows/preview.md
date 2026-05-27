---
description: Preview server start, stop, and status check. Local development server management.
---

# /preview - Preview Management

$ARGUMENTS

## Task

Manage preview server: start, stop, status check.

## Commands

```
/preview           - Show current status
/preview start     - Start server
/preview stop      - Stop server
/preview restart   - Restart
/preview check     - Health check
```

## Usage Examples

### Start Server
```
/preview start

🚀 Starting preview...
   Port: 3000
   Type: Next.js

✅ Preview ready!
   URL: http://localhost:3000
```

### Status Check
```
/preview

=== Preview Status ===

🌐 URL: http://localhost:3000
📁 Project: CRM Frontend
🏷️ Type: nextjs
💚 Health: OK
```

### Port Conflict
```
/preview start

⚠️ Port 3000 is in use.

Options:
1. Start on port 3001
2. Close app on 3000
3. Specify different port

Which one? (default: 1)
```