---
name: performance-profiling
description: Performance Profiling - Core Web Vitals, Bundle optimization, Runtime performance
---

# Performance Profiling

> Measure, analyze, optimize - in that order.

## Core Web Vitals Targets (2025)

| Metric | Good | Poor |
|--------|------|------|
| **LCP** | < 2.5s | > 4.0s |
| **INP** | < 200ms | > 500ms |
| **CLS** | < 0.1 | > 0.25 |

## Profiling Decision Tree

```
What's slow?
│
├── Initial page load
│   ├── LCP high → Optimize critical rendering path
│   ├── Large bundle → Code splitting, tree shaking
│   └── Slow server → Caching, CDN
│
├── Interaction sluggish
│   ├── INP high → Reduce JS blocking
│   ├── Re-renders → Memoization
│   └── Layout thrashing → Batch DOM reads/writes
│
└── Visual instability
    └── CLS high → Reserve space, explicit dimensions
```

## Bundle Optimization

| Problem | Solution |
|---------|----------|
| Large main bundle | Code splitting |
| Unused code | Tree shaking |
| Big libraries | Import only needed parts |
| Duplicate deps | Dedupe, analyze |

## Quick Wins Checklist

- [ ] Lazy loading enabled
- [ ] Proper format (WebP, AVIF)
- [ ] Correct dimensions
- [ ] Responsive srcset
- [ ] Code splitting for routes
- [ ] Critical CSS inlined
- [ ] Fonts preloaded

## Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Optimize without measuring | Profile first |
| Premature optimization | Fix real bottlenecks |
| Over-memoize | Memoize only expensive |