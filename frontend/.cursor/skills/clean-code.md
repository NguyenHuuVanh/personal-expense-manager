---
name: clean-code
description: Clean Code - Tiêu chuẩn viết code ngắn gọn, trực tiếp, không over-engineering
---

# Clean Code - Tiêu chuẩn viết code

> **CRITICAL SKILL** - Be **concise, direct, and solution-focused**.

## Nguyên tắc cốt lõi

| Nguyên tắc | Quy tắc |
|------------|---------|
| **SRP** | Single Responsibility - mỗi function/class làm MỘT việc |
| **DRY** | Don't Repeat Yourself - trích xuất duplicates |
| **KISS** | Keep It Simple - giải pháp đơn giản nhất hoạt động được |
| **YAGNI** | You Aren't Gonna Need It - đừng build features không dùng |
| **Boy Scout** | Để code sạch hơn lúc tìm thấy |

## Quy tắc đặt tên

| Element | Convention |
|---------|------------|
| **Variables** | Reveal intent: `userCount` not `n` |
| **Functions** | Verb + noun: `getUserById()` |
| **Booleans** | Question form: `isActive`, `hasPermission` |
| **Constants** | SCREAMING_SNAKE: `MAX_RETRY_COUNT` |

> **Rule:** Nếu cần comment để giải thích tên → đặt lại tên.

## Function Rules

| Quy tắc | Mô tả |
|---------|--------|
| **Small** | Max 20 lines, ideally 5-10 |
| **One Thing** | Làm một việc, làm tốt |
| **Few Args** | Max 3 arguments, prefer 0-2 |
| **No Side Effects** | Không mutate inputs bất ngờ |

## Anti-Patterns

| ❌ Pattern | ✅ Fix |
|-----------|-------|
| Comment every line | Delete obvious comments |
| Helper for one-liner | Inline the code |
| utils.ts with 1 function | Put code where used |
| Deep nesting | Guard clauses |
| God functions | Split by responsibility |

## Trước khi edit file

Trước khi thay đổi file, hỏi:

- **What imports this file?** → Có thể break
- **What does this file import?** → Interface changes
- **What tests cover this?** → Tests might fail
- **Is this a shared component?** → Multiple places affected

> 🔴 **Rule:** Edit file + all dependent files in the SAME task.

## Self-Check trước khi hoàn thành

| Check | Question |
|-------|----------|
| ✅ Goal met? | Did I do exactly what user asked? |
| ✅ Files edited? | Did I modify all necessary files? |
| ✅ Code works? | Did I test/verify the change? |
| ✅ No errors? | Lint and TypeScript pass? |