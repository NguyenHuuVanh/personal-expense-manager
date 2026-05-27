# Personal Expense Manager - Hướng Dẫn Nghiệp Vụ

> **DÀNH CHO AI AGENT: ĐỌC FILE NÀY TRƯỚC KHI TRẢ LỜI BẤT KỲ CÂU HỎI NÀO**
>
> ### Cách đọc file:
> 1. Đọc phần này trước tiên khi được hỏi về dự án
> 2. Hiểu context trước khi phân tích code
> 3. Tuân theo business rules đã định nghĩa
> 4. Không phá vỡ các ràng buộc nghiệp vụ
> 5. Trả lời bằng **tiếng Việt**

## Mục Lục

1. [Tổng Quan Dự Án](#1-tổng-quan-dự-án)
2. [Cấu Trúc Models](#2-cấu-trúc-models)
3. [Luồng Nghiệp Vụ Chi Tiết](#3-luồng-nghiệp-vụ-chi-tiết)
4. [API Endpoints](#4-api-endpoints)
5. [Cấu Trúc Component](#5-cấu-trúc-component)
6. [Authentication Flow](#6-authentication-flow)
7. [Quy Tắc Quan Trọng](#7-quy-tắc-quan-trọng)

---

## 1. Tổng Quan Dự Án

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16, React 19, Tailwind CSS |
| Backend | Next.js API Routes (Serverless) |
| Database | MongoDB + Mongoose ODM |
| Auth | JWT (access: 15p, refresh: 7d) |
| Charts | Recharts |
| Icons | Lucide React |

### Cài Đặt

```bash
# Clone và cài đặt dependencies
npm install

# Copy environment file
cp .env.example .env
# Chỉnh sửa MONGODB_URI trong .env

# Chạy development server
npm run dev
```

### Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/personal-expense-manager
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

---

## 2. Cấu Trúc Models

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER (1)                                 │
│    ├── hasMany → WALLETS (max 10)                              │
│    ├── hasMany → TRANSACTIONS                                   │
│    ├── hasMany → BUDGETS                                       │
│    └── hasMany → GOALS                                         │
└─────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────┐      ┌─────────────────┐   ┌──────────┐
│   WALLET    │      │  TRANSACTION    │   │   GOAL   │
│─────────────│      │─────────────────│   │──────────│
│ userId      │      │ userId          │   │ userId   │
│ name        │      │ walletId        │   │ name     │
│ type        │◄─────│ categoryId      │   │ targetAmt│
│ balance     │      │ type            │   │ current  │
│ isPrimary   │      │ amount          │   │ deadline │
└─────────────┘      │ date            │   └──────────┘
                     └─────────────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │   CATEGORY      │
                     │─────────────────│
                     │ name            │
                     │ icon            │
                     │ color           │
                     │ type            │
                     └─────────────────┘
```

### Chi Tiết Models

#### User Model

```typescript
// src/models/user.model.ts
interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;              // unique, required
  password: string;          // hashed (bcryptjs)
  name: string;
  avatar?: string;
  settings: {
    lowBalanceThreshold: number;  // default: 500000
    currency: string;            // default: "VND"
    theme: "light" | "dark" | "system";
  };
  createdAt: Date;
  updatedAt: Date;
}
```

#### Wallet Model

```typescript
// src/models/wallet.model.ts
interface IWallet extends Document {
  _id: mongoose.Types.ObjectId;
  userId: Types.ObjectId;       // FK → User
  name: string;
  type: "cash" | "bank" | "e-wallet" | "card";
  balance: number;              // default: 0
  currency: string;             // default: "VND"
  cardNumber?: string;
  bankCode?: string;
  accountNumber?: string;
  accountHolder?: string;
  isPrimary: boolean;           // default: false
  color: string;                // default: "#827BF2"
  createdAt: Date;
  updatedAt: Date;
}
```

**Ràng buộc:**
- Tối đa **10 ví/user**
- Chỉ **1 ví primary/user** (pre-save hook đảm bảo)

#### Category Model

```typescript
// src/models/category.model.ts
interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  icon: CategoryIcon;           // lucide-react icon names
  color: string;
  type: "income" | "expense" | "both";
  budgetAmount?: number;         // ngân sách giới hạn (optional)
  defaultAmount?: number;        // số tiền mặc định (optional)
  isDefault: boolean;           // có phải danh mục mặc định
  createdAt: Date;
  updatedAt: Date;
}

type CategoryIcon =
  | "utensils" | "car" | "shopping-bag" | "pill" | "gamepad" | "package"
  | "zap" | "droplets" | "wifi" | "wallet" | "smartphone" | "gift"
  | "home" | "briefcase" | "plane" | "book" | "heart" | "coffee"
  | "music" | "camera" | "film" | "truck" | "phone"
  | "mail" | "printer" | "tool" | "watch" | "headphones" | "globe";
```

#### Transaction Model

```typescript
// src/models/transaction.model.ts
interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId;
  userId: Types.ObjectId;       // FK → User
  walletId: Types.ObjectId;     // FK → Wallet
  categoryId: Types.ObjectId;    // FK → Category
  type: "income" | "expense";
  amount: number;
  currency: string;             // default: "VND"
  description: string;
  date: Date;                   // ngày giao dịch
  note?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

**Indexes:**
- `userId + date` (descending)
- `userId + walletId`
- `userId + categoryId`

#### Budget Model

```typescript
// src/models/budget.model.ts
interface IBudget extends Document {
  _id: mongoose.Types.ObjectId;
  userId: Types.ObjectId;       // FK → User
  categoryId: Types.ObjectId;   // FK → Category
  budgetAmount: number;
  period: "daily" | "weekly" | "monthly";
  startDate: Date;
  endDate: Date;
  isActive: boolean;            // default: true
  createdAt: Date;
  updatedAt: Date;
}
```

#### Goal Model

```typescript
// src/models/goal.model.ts
interface IGoal extends Document {
  _id: mongoose.Types.ObjectId;
  userId: Types.ObjectId;       // FK → User
  name: string;
  targetAmount: number;         // số tiền mục tiêu
  currentAmount: number;         // số tiền hiện tại (default: 0)
  deadline: Date;               // ngày hết hạn (phải > hiện tại)
  icon: string;
  color: string;
  isCompleted: boolean;         // default: false
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 3. Luồng Nghiệp Vụ Chi Tiết

### 3.1 Authentication

```
┌─────────────────────────────────────────────────────────────────┐
│  JWT Authentication Flow                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. REGISTER:                                                   │
│     POST /api/auth/register                                      │
│     → Hash password (bcryptjs)                                   │
│     → Create user                                               │
│     → Return token pair (access + refresh)                       │
│                                                                  │
│  2. LOGIN:                                                      │
│     POST /api/auth/login                                         │
│     → Verify password                                            │
│     → Generate token pair                                       │
│     → Set cookies:                                              │
│       • access_token (15 phút, httpOnly)                        │
│       • refresh_token (7 ngày, httpOnly)                        │
│                                                                  │
│  3. ACCESS API (mỗi request):                                  │
│     → Read access_token từ cookie                               │
│     → verifyAccessToken()                                        │
│     → Valid → proceed                                           │
│     → Invalid/Expired → return 401                               │
│                                                                  │
│  4. REFRESH TOKEN:                                              │
│     POST /api/auth/refresh                                       │
│     → Read refresh_token từ cookie                              │
│     → Verify refresh token                                       │
│     → Generate new token pair                                   │
│     → Set new cookies                                           │
│                                                                  │
│  5. LOGOUT:                                                     │
│     POST /api/auth/logout                                        │
│     → Clear both cookies (maxAge: 0)                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Tạo Wallet

```
┌─────────────────────────────────────────────────────────────────┐
│  Tạo Wallet                                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User gọi POST /api/wallets với payload:                   │
│     { name, type, balance?, color?, isPrimary?, ... }          │
│                                                                  │
│  2. Backend kiểm tra:                                          │
│     ✓ Name & type bắt buộc                                     │
│     ✓ Giới hạn 10 ví/user                                      │
│     ✓ Nếu isPrimary=true → unset ví primary khác              │
│     ✓ Nếu ví đầu tiên → auto set làm primary                  │
│                                                                  │
│  3. Tạo wallet trong MongoDB                                   │
│                                                                  │
│  4. Trả về wallet đã tạo                                       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Code quan trọng từ `src/app/api/wallets/route.ts`:**

```typescript
// POST /api/wallets
export async function POST(request: NextRequest) {
  // 1. Xác thực user
  const authResult = requireAuth(request);

  // 2. Giới hạn 10 ví/user
  const walletCount = await Wallet.countDocuments({ userId });
  if (walletCount >= 10) {
    return NextResponse.json(
      { error: "Đã đạt giới hạn 10 ví" },
      { status: 400 }
    );
  }

  // 3. Nếu set primary → unset ví primary khác
  if (isPrimary) {
    await Wallet.updateMany({ userId }, { isPrimary: false });
  }

  // 4. Tạo wallet
  const wallet = await Wallet.create({ userId, name, type, ... });

  return NextResponse.json(
    { success: true, data: wallet },
    { status: 201 }
  );
}
```

### 3.3 Tạo Category

```
┌─────────────────────────────────────────────────────────────────┐
│  Tạo Category                                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User gọi POST /api/categories với payload:                │
│     { name, icon, color, type, budgetAmount?, defaultAmount? } │
│                                                                  │
│  2. Backend kiểm tra:                                          │
│     ✓ Name, icon, color bắt buộc                               │
│     ✓ Type: income | expense | both                             │
│                                                                  │
│  3. Tạo category trong MongoDB                                 │
│                                                                  │
│  4. Seed Data:                                                 │
│     POST /api/categories/seed                                   │
│     → Tạo 20 categories mặc định nếu chưa có                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Categories mặc định:**

```typescript
// Expense categories
{ name: "Ăn uống", icon: "utensils", color: "#F89C34", type: "expense" }
{ name: "Di chuyển", icon: "car", color: "#827BF2", type: "expense" }
{ name: "Mua sắm", icon: "shopping-bag", color: "#F66PAC", type: "expense" }
{ name: "Sức khỏe", icon: "pill", color: "#21AE5A", type: "expense" }
{ name: "Giải trí", icon: "gamepad", color: "#F2CC00", type: "expense" }
{ name: "Nhà cửa", icon: "home", color: "#38BDF8", type: "expense" }
{ name: "Điện", icon: "zap", color: "#F89C34", type: "expense" }
{ name: "Nước", icon: "droplets", color: "#38BDF8", type: "expense" }
{ name: "Internet", icon: "wifi", color: "#F66PAC", type: "expense" }
{ name: "Điện thoại", icon: "smartphone", color: "#F2CC00", type: "expense" }
{ name: "Phí dịch vụ", icon: "wallet", color: "#21AE5A", type: "expense" }
{ name: "Giáo dục", icon: "book", color: "#38BDF8", type: "expense" }
{ name: "Du lịch", icon: "plane", color: "#F66PAC", type: "expense" }
{ name: "Khác", icon: "package", color: "#9EA3B8", type: "expense" }

// Income categories
{ name: "Lương", icon: "wallet", color: "#21AE5A", type: "income" }
{ name: "Thưởng", icon: "gift", color: "#F2CC00", type: "income" }
{ name: "Phụ cấp", icon: "briefcase", color: "#827BF2", type: "income" }
{ name: "Đầu tư", icon: "trending-up", color: "#38BDF8", type: "income" }
{ name: "Thưởng dự án", icon: "gift", color: "#F66PAC", type: "income" }
```

### 3.4 Tạo Transaction (CORE LOGIC)

```
┌─────────────────────────────────────────────────────────────────┐
│  Tạo Transaction - CORE BUSINESS LOGIC                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User nhập thông tin trong modal:                          │
│     • Type: income / expense                                    │
│     • Amount: số tiền                                          │
│     • Wallet: ví giao dịch                                      │
│     • Category: danh mục                                        │
│     • Description: mô tả                                        │
│     • Date: ngày giao dịch                                      │
│     • Note: ghi chú (optional)                                 │
│                                                                  │
│  2. Gọi POST /api/transactions                                 │
│                                                                  │
│  3. Backend xử lý:                                            │
│     ✓ Validate required fields                                  │
│     ✓ Tạo transaction record                                   │
│     ✓ CẬP NHẬT WALLET BALANCE:                                │
│       • Income: balance = balance + amount                     │
│       • Expense: balance = balance - amount                    │
│                                                                  │
│  4. Trả về transaction đã tạo (populated wallet/category)    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Code quan trọng từ `src/app/api/transactions/route.ts`:**

```typescript
// POST /api/transactions
export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    walletId,
    categoryId,
    type,
    amount,
    description,
    date,
    note,
    currency,
  } = body;

  // 1. Validate required fields
  if (!walletId || !categoryId || !type || !amount || !description) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // 2. Tạo transaction
  const transaction = await Transaction.create({
    userId,
    walletId,
    categoryId,
    type,
    amount,
    description,
    date: date ? new Date(date) : new Date(),
    note,
    currency: currency || "VND",
  });

  // 3. CẬP NHẬT WALLET BALANCE (CRITICAL!)
  const { Wallet } = await import("@/models");
  const balanceUpdate = type === "income" ? amount : -amount;
  await Wallet.findByIdAndUpdate(walletId, {
    $inc: { balance: balanceUpdate },
  });

  // 4. Trả về populated transaction
  const populatedTransaction = await Transaction.findById(transaction._id)
    .populate("walletId", "name color")
    .populate("categoryId", "name icon color");

  return NextResponse.json(
    { transaction: populatedTransaction },
    { status: 201 }
  );
}
```

### 3.5 Tính Toán Số Dư

**Công thức:**

```
Wallet.balance = Tổng Income - Tổng Expense

hoặc:

Wallet.balance = Σ(transactions WHERE type='income' AND walletId=X)
              - Σ(transactions WHERE type='expense' AND walletId=X)
```

**Cách hoạt động thực tế:**
- Khi tạo transaction mới → balance được cập nhật ngay trong `$inc` operation
- Không cần tính toán lại tất cả mỗi lần (performance optimization)

### 3.6 Budget (Ngân Sách)

```
┌─────────────────────────────────────────────────────────────────┐
│  Budget Tracking                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User tạo Budget:                                            │
│     • Chọn Category                                             │
│     • Nhập budgetAmount (số tiền giới hạn)                     │
│     • Chọn period: daily / weekly / monthly                     │
│                                                                  │
│  2. Backend tự động tính date range:                           │
│     • daily: hôm nay (00:00:00 → 23:59:59)                    │
│     • weekly: thứ 2 → Chủ nhật                                 │
│     • monthly: ngày 1 → ngày cuối tháng                        │
│                                                                  │
│  3. Khi GET budgets:                                           │
│     • Query transactions theo period range                     │
│     • SUM(amount) WHERE type='expense' AND categoryId=X        │
│     • Trả về: { budgetAmount, spentAmount, remaining, % used } │
│                                                                  │
│  4. UI hiển thị progress bar:                                 │
│     • < 80%: Xanh (#21AE5A) ✅                                │
│     • 80-100%: Cam (#F89C34) ⚠️                               │
│     • > 100%: Đỏ (#E40127) ❌ Vượt ngân sách                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Code tính spent amount từ `src/app/api/budgets/route.ts`:**

```typescript
// Tính spent amount trong period
const spentResult = await Transaction.aggregate([
  {
    $match: {
      userId: budget.userId,
      categoryId: budget.categoryId._id,
      type: "expense",
      date: { $gte: startDate, $lte: endDate },
    },
  },
  {
    $group: {
      _id: null,
      total: { $sum: "$amount" },
    },
  },
]);

const spentAmount = spentResult[0]?.total || 0;
const remainingAmount = budget.budgetAmount - spentAmount;
const percentage = (spentAmount / budget.budgetAmount) * 100;
const isOverBudget = spentAmount > budget.budgetAmount;
```

### 3.7 Goal (Mục Tiêu Tiết Kiệm)

```
┌─────────────────────────────────────────────────────────────────┐
│  Goal/Mục Tiêu Tiết Kiệm                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User tạo Goal:                                             │
│     • name: tên mục tiêu                                       │
│     • targetAmount: số tiền cần đạt                            │
│     • deadline: ngày hết hạn (phải > hiện tại)                │
│     • icon, color                                              │
│                                                                  │
│  2. User thêm tiền vào Goal:                                   │
│     PUT /api/goals/{id}                                        │
│     → currentAmount += amount                                  │
│                                                                  │
│  3. Tự động hoàn thành khi:                                   │
│     currentAmount >= targetAmount                               │
│     → isCompleted = true                                       │
│     → completedAt = now                                        │
│                                                                  │
│  4. UI hiển thị:                                               │
│     • Progress bar: (currentAmount / targetAmount) * 100       │
│     • Số ngày còn lại đến deadline                            │
│     • Badge "Đã hoàn thành" khi isCompleted=true               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.8 Reports (Báo Cáo)

```
┌─────────────────────────────────────────────────────────────────┐
│  Reports/Thống Kê                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  API: GET /api/reports?type=X&monthKey=YYYY-MM                  │
│                                                                  │
│  Các loại report:                                               │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ type=overview (mặc định):                               │  │
│  │ • summary: totalIncome, totalExpense, netBalance, trend  │  │
│  │ • categoryBreakdown: chi tiêu theo danh mục              │  │
│  │ • recentTransactions: 10 giao dịch gần nhất              │  │
│  │ • weeklyData: thu chi theo tuần                         │  │
│  │ • monthlyTrend: 6 tháng gần nhất                        │  │
│  │ • comparisonData: so sánh vs tháng trước                │  │
│  │ • quickStats: số lượng transactions/categories/wallets    │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ type=expense:                                           │  │
│  │ • expenseByCategory: chi tiêu chi tiết theo danh mục    │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ type=income:                                            │  │
│  │ • incomeTransactions: danh sách thu nhập                │  │
│  │ • totalIncome: tổng thu                                  │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ type=trend:                                             │  │
│  │ • monthlyTrend: xu hướng 6 tháng                        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. API Endpoints

### 4.1 Authentication APIs

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/register` | Đăng ký user mới |
| POST | `/api/auth/login` | Đăng nhập, trả về JWT tokens |
| POST | `/api/auth/logout` | Xóa tokens (logout) |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Lấy thông tin user hiện tại |

### 4.2 Wallets APIs

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/wallets` | Lấy danh sách ví của user |
| POST | `/api/wallets` | Tạo ví mới |
| GET | `/api/wallets/[id]` | Lấy thông tin 1 ví |
| PUT | `/api/wallets/[id]` | Cập nhật ví |
| DELETE | `/api/wallets/[id]` | Xóa ví |

### 4.3 Categories APIs

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/categories` | Lấy danh sách categories |
| POST | `/api/categories` | Tạo category mới |
| GET | `/api/categories/[id]` | Lấy thông tin 1 category |
| PUT | `/api/categories/[id]` | Cập nhật category |
| DELETE | `/api/categories/[id]` | Xóa category |
| POST | `/api/categories/seed` | Tạo categories mặc định |
| PATCH | `/api/categories/migrate` | Thêm fields mới cho categories cũ |

### 4.4 Transactions APIs

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/transactions` | Lấy danh sách transactions |
| POST | `/api/transactions` | Tạo transaction mới |
| GET | `/api/transactions/[id]` | Lấy thông tin 1 transaction |
| PUT | `/api/transactions/[id]` | Cập nhật transaction |
| DELETE | `/api/transactions/[id]` | Xóa transaction |

**Query params cho GET /api/transactions:**
```
?walletId=xxx
&categoryId=xxx
&type=income|expense
&startDate=YYYY-MM-DD
&endDate=YYYY-MM-DD
&page=1
&limit=20
```

### 4.5 Budgets APIs

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/budgets` | Lấy danh sách budgets với spent amounts |
| POST | `/api/budgets` | Tạo budget mới |
| GET | `/api/budgets/[id]` | Lấy thông tin 1 budget |
| PUT | `/api/budgets/[id]` | Cập nhật budget |
| DELETE | `/api/budgets/[id]` | Xóa budget |

### 4.6 Goals APIs

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/goals` | Lấy danh sách goals |
| POST | `/api/goals` | Tạo goal mới |
| GET | `/api/goals/[id]` | Lấy thông tin 1 goal |
| PUT | `/api/goals/[id]` | Cập nhật goal |
| DELETE | `/api/goals/[id]` | Xóa goal |

### 4.7 Reports APIs

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/reports` | Lấy báo cáo tổng hợp |

**Query params:**
```
?type=overview|expense|income|trend
&startDate=YYYY-MM-DD
&endDate=YYYY-MM-DD
&monthKey=YYYY-MM
```

---

## 5. Cấu Trúc Component

### 5.1 Cấu Trúc Thư Mục

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   ├── me/route.ts
│   │   │   ├── refresh/route.ts
│   │   │   └── register/route.ts
│   │   ├── budgets/
│   │   ├── categories/
│   │   ├── goals/
│   │   ├── reports/
│   │   ├── transactions/
│   │   └── wallets/
│   ├── auth/                     # Auth pages
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── page.tsx
│   └── protected/               # Protected routes
│       ├── budgets/page.tsx
│       ├── categories/page.tsx
│       ├── dashboard/page.tsx
│       ├── goals/page.tsx
│       ├── reports/page.tsx
│       └── transactions/page.tsx
├── components/
│   ├── auth/
│   ├── budgets/
│   │   └── budget-card.tsx
│   ├── categories/
│   │   ├── categories-grid.tsx
│   │   ├── categories-table.tsx
│   │   └── category-form-dialog.tsx
│   ├── expense-dashboard/
│   │   ├── balance-card.tsx
│   │   ├── budget-tracker.tsx
│   │   ├── category-donut-chart.tsx
│   │   ├── income-expense-bar-chart.tsx
│   │   ├── kpi-card.tsx
│   │   ├── trend-chart.tsx
│   │   └── recent-transactions.tsx
│   ├── goals/
│   ├── reports/
│   ├── shadcn-ui/                # UI primitives
│   ├── transactions/
│   │   ├── add-transaction-modal.tsx
│   │   └── transactions-list.tsx
│   └── ui/
├── hooks/                        # Custom hooks
├── lib/                          # Utilities
├── models/                       # Mongoose models
├── types/
├── utils/
└── context/
    └── auth-context.tsx
```

### 5.2 Component Chính

#### Dashboard Components

| Component | Mô tả |
|-----------|-------|
| `PersonalExpenseDashboard` | Component dashboard chính |
| `KPICard` | Card hiển thị 1 chỉ số (income/expense/balance/count) |
| `TrendChart` | Line/Area chart xu hướng thu chi theo ngày |
| `CategoryDonutChart` | Donut chart cơ cấu chi tiêu theo danh mục |
| `IncomeExpenseBarChart` | Bar chart so sánh thu/chi |
| `RecentTransactions` | Danh sách giao dịch gần đây |
| `BudgetTracker` | Component theo dõi ngân sách |

#### Transaction Components

| Component | Mô tả |
|-----------|-------|
| `AddTransactionModal` | Modal form tạo giao dịch mới |
| `TransactionsList` | Danh sách transactions với filter |

#### Budget Components

| Component | Mô tả |
|-----------|-------|
| `BudgetCard` | Card hiển thị budget với progress bar |

#### Goal Components

| Component | Mô tả |
|-----------|-------|
| `GoalCard` | Card hiển thị mục tiêu tiết kiệm |
| `GoalsList` | Danh sách các mục tiêu |

#### Report Components

| Component | Mô tả |
|-----------|-------|
| `ReportOverview` | Tổng quan báo cáo với charts |
| `ExpenseReport` | Báo cáo chi tiêu chi tiết |
| `IncomeReport` | Báo cáo thu nhập |

### 5.3 Custom Hooks

| Hook | Mô tả |
|------|-------|
| `useWallets` | Quản lý state wallets (CRUD operations) |
| `useDisclosure` | Quản lý open/close state cho modals |
| `useAdvancedFilter` | Quản lý filter logic phức tạp |
| `useSelectValues` | Quản lý giá trị select |
| `useInvalidField` | Xử lý validation errors |

---

## 6. Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                              │
│  ┌───────────────────────────────────────────────────────┐      │
│  │  Next.js App (React 19)                                 │      │
│  │  ├── Auth Context (JWT state)                           │      │
│  │  ├── Custom Hooks (useWallets, etc.)                    │      │
│  │  └── Components (Dashboard, Modals, Forms)              │      │
│  └───────────────────────────────────────────────────────┘      │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP/REST
┌──────────────────────────▼──────────────────────────────────────┐
│                     SERVER (Next.js API Routes)                  │
│  ┌───────────────────────────────────────────────────────┐      │
│  │  Middleware: JWT Authentication                         │      │
│  │  └── requireAuth() → 401 if invalid                  │      │
│  └───────────────────────────────────────────────────────┘      │
│  ┌───────────────────────────────────────────────────────┐      │
│  │  API Routes                                            │      │
│  │  ├── /api/auth/* (login, register, logout, ...)       │      │
│  │  ├── /api/wallets/*                                   │      │
│  │  ├── /api/categories/*                                │      │
│  │  ├── /api/transactions/*                              │      │
│  │  ├── /api/budgets/*                                   │      │
│  │  ├── /api/goals/*                                     │      │
│  │  └── /api/reports/*                                   │      │
│  └───────────────────────────────────────────────────────┘      │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Mongoose ODM
┌──────────────────────────▼──────────────────────────────────────┐
│                     DATABASE (MongoDB)                              │
│  ┌───────────────────────────────────────────────────────┐      │
│  │  Collections:                                         │      │
│  │  ├── users                                            │      │
│  │  ├── wallets                                          │      │
│  │  ├── categories                                       │      │
│  │  ├── transactions                                     │      │
│  │  ├── budgets                                          │      │
│  │  └── goals                                            │      │
│  └───────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Quy Tắc Quan Trọng

### 7.1 Wallet Balance Update

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚠️ QUAN TRỌNG: Wallet Balance luôn được cập nhật ngay khi    │
│     tạo transaction bằng $inc operator                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  KHI tạo transaction:                                          │
│                                                                  │
│  if (type === 'income') {                                      │
│    wallet.balance += amount;  // Tăng số dư                    │
│  } else {                                                      │
│    wallet.balance -= amount;  // Giảm số dư                    │
│  }                                                             │
│                                                                  │
│  KHÔNG cần recalculate tất cả transactions mỗi lần             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Primary Wallet Rule

```
┌─────────────────────────────────────────────────────────────────┐
│  Ràng buộc: Chỉ có 1 ví primary per user                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  KHI tạo ví mới với isPrimary=true:                           │
│    → Update all other wallets: isPrimary = false               │
│                                                                  │
│  KHI tạo ví đầu tiên:                                         │
│    → Auto set isPrimary = true                                  │
│                                                                  │
│  KHI xóa ví primary:                                           │
│    → Đặt ví có balance cao nhất làm primary (optional)         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Budget Period Calculation

```
┌─────────────────────────────────────────────────────────────────┐
│  Backend tự động tính date range dựa trên period:            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Period: daily                                                 │
│    → startDate = today 00:00:00                                │
│    → endDate = today 23:59:59                                  │
│                                                                  │
│  Period: weekly                                                │
│    → startDate = Monday 00:00:00 của tuần hiện tại            │
│    → endDate = Sunday 23:59:59 của tuần hiện tại              │
│                                                                  │
│  Period: monthly                                               │
│    → startDate = ngày 1 của tháng 00:00:00                   │
│    → endDate = ngày cuối tháng 23:59:59                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.4 Goal Auto-Completion

```
┌─────────────────────────────────────────────────────────────────┐
│  Goal tự động hoàn thành khi currentAmount >= targetAmount    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  KHI cập nhật goal:                                            │
│                                                                  │
│  goal.currentAmount += addedAmount;                             │
│                                                                  │
│  if (goal.currentAmount >= goal.targetAmount) {                │
│    goal.isCompleted = true;                                     │
│    goal.completedAt = new Date();                               │
│  }                                                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.5 Category Default Amount

```
┌─────────────────────────────────────────────────────────────────┐
│  Số tiền mặc định (defaultAmount) được sử dụng khi:         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  • Tạo transaction mới → Auto-fill amount field               │
│  • Chọn category trong form transaction                       │
│                                                                  │
│  Đây là tiện ích giúp user không phải nhập lại số tiền       │
│  thường dùng mỗi khi chọn category                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.6 Budget Amount Per Category

```
┌─────────────────────────────────────────────────────────────────┐
│  Ngân sách giới hạn (budgetAmount) cho category:              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  • Đặt ngưỡng chi tiêu tối đa cho một danh mục                │
│  • Hiển thị warning khi gần đạt ngưỡng                        │
│  • Hiển thị alert khi vượt ngưỡng                             │
│                                                                  │
│  Khác với Budget model - đây là ngân sách cố định per category │
│  trong khi Budget model cho phép tracking theo period          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 8. Migration Hướng Dẫn

### Thêm fields mới cho Categories (nếu cần)

```javascript
// Chạy trong MongoDB Shell (mongosh) hoặc Compass
db.categories.updateMany(
  { $or: [{ defaultAmount: { $exists: false } }, { budgetAmount: { $exists: false } }] },
  { $set: { defaultAmount: 0, budgetAmount: 0 } }
)
```

### Reset Categories

```bash
# Xóa collection categories
db.categories.drop()

# Gọi API seed
curl -X POST http://localhost:3000/api/categories/seed
```

---

## 9. Quick Reference

### Tạo Transaction Flow

```
1. User mở AddTransactionModal
2. Chọn type (income/expense)
3. Nhập amount, description
4. Chọn wallet, category
5. Click "Thêm giao dịch"
6. → POST /api/transactions
7. → Tạo transaction
8. → Cập nhật wallet.balance (+/- amount)
9. → Trả về success
10. → Update UI với transaction mới
```

### Tính Balance Của User

```javascript
// Tổng balance của user = SUM(balance) của tất cả wallets

const wallets = await Wallet.find({ userId });
const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
```

### Lấy Chi Tiêu Theo Danh Mục

```javascript
const categoryStats = await Transaction.aggregate([
  { $match: { userId, type: 'expense', date: { $gte: startDate, $lte: endDate } } },
  { $group: { _id: '$categoryId', total: { $sum: '$amount' } } },
  { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
  { $unwind: '$category' },
  { $project: { name: '$category.name', icon: '$category.icon', color: '$category.color', total: 1 } },
  { $sort: { total: -1 } }
]);
```

---

## 10. License & Credits

- **Framework**: Next.js 16
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts

---

_Document này được tạo tự động từ codebase analysis._
