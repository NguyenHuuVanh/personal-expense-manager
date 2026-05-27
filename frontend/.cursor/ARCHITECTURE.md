---
description: Tổng quan kiến trúc Agent System cho CRM Frontend - 20 agents, 36 skills, 11 workflows
alwaysApply: false
---

# CRM Frontend - Agent System Architecture

> Hệ thống Agent chuyên biệt cho dự án Next.js CRM Frontend
> Dựa trên Antigravity Kit - tối ưu cho web development

---

## 📋 Tổng quan

Hệ thống gồm:

- **20 Specialist Agents** - AI personas chuyên biệt theo domain
- **36 Skills** - Module knowledge có thể load theo yêu cầu
- **11 Workflows** - Slash command procedures
- **2 Master Scripts** - Validation scripts cho pre-deploy

---

## 🏗️ Cấu trúc thư mục

```plaintext
.cursor/
├── ARCHITECTURE.md        # File này
├── agents/                # 20 Specialist Agents (.mdc)
├── rules/                 # Global Rules (3 files)
├── skills/                # Key Skills (SKILL.md)
├── workflows/             # 11 Slash Commands
└── scripts/               # Master Validation Scripts
```

---

## 🤖 Agents (20)

| Agent | Mô tả | Skills |
|-------|-------|--------|
| `orchestrator` | Điều phối multi-agent, task l���n | clean-code, parallel-agents, plan-writing |
| `project-planner` | Lên kế hoạch, break down tasks | clean-code, app-builder, plan-writing |
| `frontend-specialist` | UI/UX React/Next.js | clean-code, nextjs-react-expert, tailwind-patterns |
| `backend-specialist` | API, business logic | clean-code, nodejs-best-practices, api-patterns |
| `database-architect` | Schema, SQL, migrations | clean-code, database-design |
| `mobile-developer` | iOS, Android, React Native | mobile-design |
| `game-developer` | Game logic, mechanics | game-development |
| `devops-engineer` | CI/CD, Docker, deployment | deployment-procedures, docker-expert |
| `security-auditor` | Security compliance | vulnerability-scanner, red-team-tactics |
| `penetration-tester` | Offensive security testing | red-team-tactics |
| `test-engineer` | Testing strategies | testing-patterns, tdd-workflow |
| `debugger` | Root cause analysis | systematic-debugging |
| `performance-optimizer` | Speed, Web Vitals | performance-profiling |
| `seo-specialist` | SEO, visibility | seo-fundamentals |
| `documentation-writer` | Docs, manuals | documentation-templates |
| `product-manager` | Requirements, user stories | plan-writing, brainstorming |
| `product-owner` | Strategy, backlog, MVP | plan-writing, brainstorming |
| `qa-automation-engineer` | E2E testing, CI pipelines | webapp-testing, testing-patterns |
| `code-archaeologist` | Legacy code, refactoring | clean-code, code-review-checklist |
| `explorer-agent` | Codebase analysis | - |

---

## 🧩 Skills quan trọng (CRM Frontend)

### Frontend & UI
| Skill | Mô tả |
|-------|-------|
| `react-best-practices` | React & Next.js optimization (57 rules) |
| `tailwind-patterns` | Tailwind CSS v4 utilities |
| `frontend-design` | UI/UX patterns, design systems |
| `web-design-guidelines` | 100+ rules accessibility, UX |

### Backend & API
| Skill | Mô tả |
|-------|-------|
| `api-patterns` | REST, GraphQL, tRPC patterns |
| `nodejs-best-practices` | Node.js async, modules |

### TypeScript
| Skill | Mô tả |
|-------|-------|
| `typescript-expert` | Type-level programming |

### Testing & Quality
| Skill | Mô tả |
|-------|-------|
| `testing-patterns` | Jest, Vitest strategies |
| `webapp-testing` | E2E, Playwright |
| `tdd-workflow` | Test-driven development |
| `code-review-checklist` | Code review standards |

### Security
| Skill | Mô tả |
|-------|-------|
| `vulnerability-scanner` | Security auditing, OWASP |

### Architecture & Planning
| Skill | Mô tả |
|-------|-------|
| `brainstorming` | Socratic questioning |
| `plan-writing` | Task planning, breakdown |
| `clean-code` | Coding standards (Global - luôn áp dụng) |

### Other
| Skill | Mô tả |
|-------|-------|
| `i18n-localization` | Internationalization |
| `performance-profiling` | Web Vitals, optimization |
| `systematic-debugging` | Troubleshooting |

---

## 🔄 Workflows (11)

| Command | Mô tả |
|---------|-------|
| `/brainstorm` | Socratic discovery |
| `/create` | Create new features |
| `/debug` | Debug issues |
| `/deploy` | Deploy application |
| `/enhance` | Improve existing code |
| `/orchestrate` | Multi-agent coordination |
| `/plan` | Task breakdown |
| `/preview` | Preview changes |
| `/status` | Check project status |
| `/test` | Run tests |
| `/ui-ux-pro-max` | Design with 50 styles |

---

## 🔧 Scripts (2)

| Script | Mục đích | Khi nào dùng |
|--------|----------|--------------|
| `checklist.py` | Priority-based validation | Development, pre-commit |
| `verify_all.py` | Comprehensive verification | Pre-deployment, releases |

### Sử dụng
```bash
# Quick validation
python .cursor/scripts/checklist.py .

# Full verification
python .cursor/scripts/verify_all.py . --url http://localhost:3000
```

---

## 📊 Thống kê

| Metric | Value |
|--------|-------|
| **Total Agents** | 20 |
| **Total Skills** | 36 |
| **Total Workflows** | 11 |
| **Total Scripts** | 2 |
| **Coverage** | ~90% web/mobile development |

---

## 🚀 Quick Reference

| Need | Agent | Skills |
|------|-------|--------|
| Web UI | `frontend-specialist` | react-best-practices, frontend-design |
| API | `backend-specialist` | api-patterns, nodejs-best-practices |
| Database | `database-architect` | database-design |
| Security | `security-auditor` | vulnerability-scanner |
| Testing | `test-engineer` | testing-patterns, webapp-testing |
| Debug | `debugger` | systematic-debugging |
| Plan | `project-planner` | brainstorming, plan-writing |