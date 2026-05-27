---
name: frontend-design
description: Frontend Design System cho web UI - color, typography, UX psychology, layout principles
---

# Frontend Design System

> **Philosophy:** Every pixel has purpose. Restraint is luxury. User psychology drives decisions.

## Nguyên tắc cốt lõi

### UX Psychology Laws

| Law | Principle | Application |
|-----|-----------|-------------|
| **Hick's Law** | More choices = slower decisions | Limit options, use progressive disclosure |
| **Fitts' Law** | Bigger + closer = easier to click | Size CTAs appropriately |
| **Miller's Law** | ~7 items in working memory | Chunk content into groups |
| **Von Restorff** | Different = memorable | Make CTAs visually distinct |

### Layout Principles

- **8-Point Grid**: All spacing in multiples of 8
- **Touch targets**: Minimum 44x44px
- **Reading width**: 45-75 characters optimal
- **Golden Ratio (φ = 1.618)**: Use for proportional harmony

## Color System

### 60-30-10 Rule

```
60% → Primary/Background (calm, neutral base)
30% → Secondary (supporting areas)
10% → Accent (CTAs, highlights, attention)
```

### Color Psychology

| If You Need... | Consider Hues |
|----------------|--------------|
| Trust, calm | Blue family |
| Growth, nature | Green family |
| Energy, urgency | Orange, red |
| Luxury, creativity | Deep Teal, Gold |
| Clean, minimal | Neutrals |

## Typography

| Content Type | Scale Ratio | Feel |
|--------------|-------------|------|
| Dense UI | 1.125-1.2 | Compact |
| General web | 1.25 | Balanced |
| Editorial | 1.333 | Readable |
| Hero/display | 1.5-1.618 | Dramatic |

## Animation Principles

| Action | Easing | Why |
|--------|--------|-----|
| Entering | Ease-out | Decelerate, settle in |
| Leaving | Ease-in | Accelerate, exit |
| Emphasis | Ease-in-out | Smooth, deliberate |

- Animate only `transform` and `opacity`
- Respect `prefers-reduced-motion`
- Max 400ms for any transition

## Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Purple/violet as primary | High contrast alternatives |
| Bento grids for simple pages | Think about WHY grid |
| Glassmorphism everywhere | Use radically or not at all |
| Rounded everything | Use sharp, brutalist edges where appropriate |
| Dark + neon default | What does the BRAND need? |