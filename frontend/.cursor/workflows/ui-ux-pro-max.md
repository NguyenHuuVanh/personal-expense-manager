---
description: AI-powered design intelligence. 50+ styles, 95+ color palettes, 57 font pairings for UI/UX design.
---

# /ui-ux-pro-max - Design System Generator

$ARGUMENTS

## Prerequisites

Check if Python is installed:
```bash
python3 --version || python --version
```

## How to Use

### Step 1: Analyze User Requirements

Extract key information:
- **Product type**: SaaS, e-commerce, dashboard, landing page
- **Style keywords**: minimal, playful, professional, elegant, dark mode
- **Industry**: healthcare, fintech, education, CRM
- **Stack**: React, Next.js, or default to `html-tailwind`

### Step 2: Generate Design System

```bash
python3 .cursor/.shared/ui-ux-pro-max/scripts/search.py "<query>" --design-system -p "Project Name"
```

### Step 3: Supplement with Detailed Searches

```bash
# Get UX guidelines
python3 .cursor/.shared/ui-ux-pro-max/scripts/search.py "animation accessibility" --domain ux

# Get typography options
python3 .cursor/.shared/ui-ux-pro-max/scripts/search.py "elegant luxury serif" --domain typography
```

### Step 4: Stack Guidelines

```bash
python3 .cursor/.shared/ui-ux-pro-max/scripts/search.py "layout responsive form" --stack html-tailwind
```

## Available Stacks

- `html-tailwind` (DEFAULT)
- `react`
- `nextjs`
- `vue`
- `svelte`
- `shadcn`

## Common Rules

### Icons & Visual Elements

| Rule | Do | Don't |
|------|----|----- |
| **No emoji icons** | Use SVG icons (Heroicons, Lucide) | Use emojis like 🎨 🚀 as UI icons |
| **Stable hover states** | Use color/opacity transitions | Use scale transforms that shift layout |

### Interaction

| Rule | Do | Don't |
|------|----|----- |
| **Cursor pointer** | Add `cursor-pointer` to all clickable elements | Leave default cursor on interactive elements |
| **Hover feedback** | Provide visual feedback (color, shadow) | No indication element is interactive |

### Light/Dark Mode

| Rule | Do | Don't |
|------|----|----- |
| **Text contrast light** | Use `#0F172A` (slate-900) for text | Use `#94A3B8` for body text |
| **Border visibility** | Use `border-gray-200` in light mode | Use `border-white/10` (invisible) |