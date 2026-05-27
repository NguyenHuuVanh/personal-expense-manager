---
description: Deployment command for production releases. Pre-flight checks and deployment execution.
---

# /deploy - Production Deployment

$ARGUMENTS

## Sub-commands

```
/deploy            - Interactive deployment wizard
/deploy check      - Run pre-deployment checks only
/deploy preview    - Deploy to preview/staging
/deploy production - Deploy to production
/deploy rollback   - Rollback to previous version
```

## Pre-Deployment Checklist

```
## 🚀 Pre-Deploy Checklist

### Code Quality
- [ ] No TypeScript errors
- [ ] ESLint passing
- [ ] All tests passing

### Security
- [ ] No hardcoded secrets
- [ ] Environment variables documented
- [ ] Dependencies audited

### Performance
- [ ] Bundle size acceptable
- [ ] No console.log statements
- [ ] Images optimized
```

## Deployment Flow

```
/deploy → Pre-flight checks → Build → Deploy → Health check → ✅ Complete
                ↓
           Pass? No → Fix issues
```

## Platform Support

| Platform | Command | Notes |
|----------|---------|-------|
| Vercel | `vercel --prod` | Auto-detected for Next.js |
| Railway | `railway up` | Needs Railway CLI |
| Fly.io | `fly deploy` | Needs flyctl |
| Docker | `docker compose up -d` | For self-hosted |