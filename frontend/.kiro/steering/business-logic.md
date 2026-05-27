---
inclusion: always
---
# Business Logic Context

## Mục Đích

File này đảm bảo AI luôn hiểu business logic của dự án **Personal Expense Manager** trước khi trả lời bất kỳ câu hỏi nào.

## Cách Sử Dụng

### Bước 1: Đọc File Này
- Luôn đọc file này TRƯỚC khi phân tích code hoặc trả lời câu hỏi

### Bước 2: Đọc Chi Tiết
- Đọc đầy đủ `docs/BUSINESS-LOGIC-GUIDE.md` để hiểu:
  - Luồng nghiệp vụ từ đầu đến cuối
  - Các ràng buộc quan trọng
  - API endpoints
  - Data models

---

## Tóm Tắt Business Logic (Quick Reference)

### 1. Core Flow: Tạo Transaction

```
Tạo Transaction → Cập nhật Wallet Balance ngay lập tức
├── Income: balance += amount
└── Expense: balance -= amount
```

### 2. Ràng Buộc Quan Trọng

| # | Ràng buộc | Chi tiết |
|---|-----------|----------|
| 1 | **Primary Wallet** | Chỉ 1 ví primary/user |
| 2 | **Wallet Limit** | Tối đa 10 ví/user |
| 3 | **Balance Auto-Update** | Luôn update khi tạo transaction |
| 4 | **Budget Period** | Tự động tính date range (daily/weekly/monthly) |
| 5 | **Goal Auto-Complete** | Khi currentAmount >= targetAmount → isCompleted=true |

### 3. Authentication

- JWT tokens: access (15 phút), refresh (7 ngày)
- Tokens stored in httpOnly cookies
- Middleware verify access token trước mỗi API call

### 4. Models Relationship

```
User ───< Wallet ───< Transaction ───> Category
  │
  ├──< Budget ───> Category
  └──< Goal
```

---

## Quy Tắc Khi Implement

### MUST (Bắt buộc)

1. **Tạo transaction** phải cập nhật wallet.balance
2. **Tạo ví đầu tiên** phải set isPrimary=true
3. **Set primary wallet** phải unset ví primary khác
4. **Xóa transaction** phải cập nhật wallet.balance ngược lại
5. **Cập nhật goal** phải kiểm tra isCompleted khi currentAmount >= targetAmount

### MUST NOT (Không được phép)

1. Không hardcode balance - luôn dùng $inc operator
2. Không tạo transaction với wallet không thuộc user
3. Không xóa category đang được dùng trong transactions
4. Không bỏ qua validation trong API routes

---

## File Quan Trọng

| File | Mô tả |
|------|--------|
| `docs/BUSINESS-LOGIC-GUIDE.md` | Hướng dẫn nghiệp vụ chi tiết |
| `src/models/*.model.ts` | Mongoose models |
| `src/app/api/**/*.ts` | API routes |

---

## Response Format

Khi trả lời câu hỏi về business logic:
- Trả lời bằng **tiếng Việt**
- Reference đến section trong BUSINESS-LOGIC-GUIDE.md nếu cần
- Giải thích rõ ràng business rules liên quan
