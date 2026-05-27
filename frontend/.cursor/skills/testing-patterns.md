---
name: testing-patterns
description: Testing patterns và principles - Unit, Integration, E2E testing
---

# Testing Patterns

## Testing Pyramid

```
        /\          E2E (Few) - Critical user flows
       /  \
      /----\
     /      \    Integration (Some) - API, DB, services
    /--------\
   /          \
  /------------\  Unit (Many) - Functions, classes
```

## AAA Pattern

1. **Arrange**: Set up test data
2. **Act**: Execute code under test
3. **Assert**: Verify outcome

## Framework Selection (TypeScript)

| Type | Framework |
|------|-----------|
| **Unit** | Vitest, Jest |
| **Integration** | Supertest |
| **E2E** | Playwright |
| **Component** | React Testing Library |

## Coverage Targets

| Area | Target |
|------|--------|
| Critical paths | 100% |
| Business logic | 80%+ |
| Utilities | 70%+ |
| UI layout | As needed |

## Mocking Principles

| Mock | Don't Mock |
|------|------------|
| External APIs | Code under test |
| Database (unit) | Simple deps |
| Network | Pure functions |

## Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Test implementation | Test behavior |
| Multiple asserts | One per test |
| Dependent tests | Independent |
| Skip cleanup | Always reset |