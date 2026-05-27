# Personal Expense Manager

Ứng dụng quản lý chi tiêu cá nhân, gồm hai phần: **backend** (NestJS + MongoDB) cung cấp REST API và **frontend** (Next.js 16 + React 19) cho giao diện người dùng.

## Tính năng chính

- 🔐 Xác thực người dùng (đăng ký, đăng nhập) với JWT
- 💰 Quản lý ví (wallets) với snapshot số dư hàng tháng
- 🏷️ Quản lý danh mục (categories) thu/chi
- 📝 Ghi nhận và quản lý giao dịch (transactions) với bộ lọc nâng cao
- 📊 Báo cáo & biểu đồ (charts) trực quan theo thời gian
- 🎯 Mục tiêu tiết kiệm (goals) và ngân sách (budgets)
- 📈 Dashboard tổng quan thu chi cá nhân

## Công nghệ sử dụng

### Backend (`/backend`)
- **NestJS 11** — framework Node.js theo kiến trúc module
- **MongoDB + Mongoose** — lưu trữ dữ liệu
- **Passport JWT** — xác thực
- **Swagger** — tài liệu API
- **class-validator / class-transformer** — validate DTO

### Frontend (`/frontend`)
- **Next.js 16** (App Router) + **React 19**
- **TanStack Query** — quản lý server state
- **React Hook Form + Zod** — form & validation
- **shadcn/ui + Radix UI + Tailwind CSS** — UI components
- **Recharts** — biểu đồ
- **Vitest + Testing Library** — unit test

## Cấu trúc thư mục

```
personal-expense-manager/
├── backend/                # NestJS API server
│   └── src/
│       ├── auth/           # Đăng ký, đăng nhập, JWT strategy
│       ├── users/          # User schema & service
│       ├── wallets/        # Quản lý ví
│       ├── wallet-snapshots/ # Snapshot số dư hàng tháng
│       ├── categories/     # Danh mục thu/chi
│       ├── transactions/   # Giao dịch
│       ├── budgets/        # Ngân sách
│       ├── goals/          # Mục tiêu tiết kiệm
│       ├── charts/         # Dữ liệu biểu đồ
│       └── reports/        # Báo cáo
└── frontend/               # Next.js app
    └── src/
        ├── app/            # Routes (App Router)
        ├── components/     # UI components
        ├── hooks/          # Custom hooks
        ├── lib/            # API client, react-query setup
        ├── contexts/       # React contexts (auth, date-range...)
        └── types/          # TypeScript types
```

## Yêu cầu môi trường

- **Node.js** >= 20
- **npm** >= 10
- **MongoDB** (local hoặc Atlas)

## Cài đặt & chạy

### 1. Clone repo

```bash
git clone https://github.com/NguyenHuuVanh/personal-expense-manager.git
cd personal-expense-manager
```

### 2. Backend

```bash
cd backend
npm install
```

Tạo file `.env` từ template:

```bash
cp .env.example .env
```

Mở `.env` và cập nhật:

```env
MONGODB_URI=mongodb://localhost:27017/personal-expense-manager
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=3001
```

Chạy server dev:

```bash
npm run start:dev
```

API sẽ chạy ở `http://localhost:3001`.

### 3. Frontend

Mở terminal mới:

```bash
cd frontend
npm install
npm run dev
```

App chạy ở `http://localhost:2509`.

## Scripts hữu ích

### Backend

| Lệnh | Mô tả |
| --- | --- |
| `npm run start:dev` | Chạy server với watch mode |
| `npm run start:debug` | Chạy ở chế độ debug |
| `npm run build` | Build production |
| `npm run start:prod` | Chạy bản build |
| `npm run lint` | ESLint + auto fix |
| `npm run format` | Prettier format |

### Frontend

| Lệnh | Mô tả |
| --- | --- |
| `npm run dev` | Chạy Next.js dev server (port 2509) |
| `npm run build` | Build production |
| `npm run start` | Chạy bản build |
| `npm run lint` | Next lint |
| `npm run type-check` | Kiểm tra type |
| `npm run test` | Chạy Vitest watch mode |
| `npm run test:run` | Chạy tests một lần |
| `npm run test:coverage` | Test kèm coverage report |
| `npm run test:ui` | Mở Vitest UI |

## Biến môi trường

### Backend (`backend/.env`)

| Biến | Mô tả |
| --- | --- |
| `MONGODB_URI` | Connection string MongoDB |
| `JWT_SECRET` | Khóa bí mật ký JWT (đổi trong production) |
| `JWT_EXPIRES_IN` | Thời hạn token (mặc định `7d`) |
| `PORT` | Port server (mặc định `3001`) |

## API Documentation

Sau khi chạy backend, mở Swagger UI tại `http://localhost:3001/api` để xem và thử API.

## Lưu ý bảo mật

- Không commit file `.env` lên git (đã có trong `.gitignore`).
- Đổi `JWT_SECRET` thành chuỗi ngẫu nhiên đủ mạnh trong production.
- Khi deploy, dùng MongoDB Atlas với IP whitelist hoặc VPC peering.

## License

Private project - chưa public license.
