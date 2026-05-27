---
description: Coordinate multiple agents for complex tasks.
---

# /orchestrate - Multi-Agent Coordination

$ARGUMENTS

## 🔴 CRITICAL: Minimum Agent Requirement

> ⚠️ **ORCHESTRATION = MINIMUM 3 DIFFERENT AGENTS**
> If you use fewer than 3 agents, you are NOT orchestrating.

## Agent Selection Matrix

| Task Type | REQUIRED Agents |
|-----------|-----------------|
| **Web App** | frontend-specialist, backend-specialist, test-engineer |
| **API** | backend-specialist, security-auditor, test-engineer |
| **UI/Design** | frontend-specialist, seo-specialist, performance-optimizer |
| **Database** | database-architect, backend-specialist, security-auditor |
| **Full Stack** | project-planner, frontend-specialist, backend-specialist, devops-engineer |
| **Debug** | debugger, explorer-agent, test-engineer |
| **Security** | security-auditor, penetration-tester, devops-engineer |

## 2-PHASE ORCHESTRATION

### PHASE 1: PLANNING (Sequential)

1. `project-planner` → Create PLAN.md
2. (optional) `explorer-agent` → Codebase discovery if needed

### ⏸️ CHECKPOINT: User Approval

```
✅ Plan created: PLAN.md

Do you approve? (Y/N)
- Y: Start implementation
- N: I'll revise the plan
```

### PHASE 2: IMPLEMENTATION (Parallel after approval)

| Parallel Group | Agents |
|----------------|--------|
| Foundation | `database-architect`, `security-auditor` |
| Core | `backend-specialist`, `frontend-specialist` |
| Polish | `test-engineer`, `devops-engineer` |

## Output Format

```
## 🎼 Orchestration Report

### Task
[Original task summary]

### Agents Invoked (MINIMUM 3)
| # | Agent | Focus Area | Status |
|---|-------|------------|--------|
| 1 | project-planner | Task breakdown | ✅ |
| 2 | frontend-specialist | UI implementation | ✅ |
| 3 | test-engineer | Verification scripts | ✅ |

### Verification Scripts Executed
- [x] security_scan.py → Pass/Fail
- [x] lint_runner.py → Pass/Fail

### Key Findings
1. **[Agent 1]**: Finding
2. **[Agent 2]**: Finding

### Summary
[One paragraph synthesis]
```