---
inclusion: always
---

## 2. Clean Code Principles

### Meaningful Names

```
// ❌ BAD - Tên không mô tả
function d(v: number) { return v * 1.6; }

// ✅ GOOD - Tên rõ ràng, mô tả được mục đích
function kilometersToMiles(kilometers: number): number {
  const conversionFactor = 1.60934;
  return kilometers * conversionFactor;
}
```

### Small Functions

Hàm tối đa **20-30 dòng**. Nếu dài hơn, tách ra.

```
// ❌ BAD - Hàm quá dài
async function handleFormSubmit(data: FormData) {
  // validation... 10 dòng
  // transform... 15 dòng
  // API call... 10 dòng
  // Update state... 10 dòng
  // Show notification... 5 dòng
}

// ✅ GOOD - Tách thành hàm nhỏ, mỗi hàm 1 việc
async function handleFormSubmit(data: FormData) {
  const validated = validateFormData(data);
  const transformed = transformToApiFormat(validated);
  await submitToApi(transformed);
  showSuccessNotification('Saved successfully');
}
```

### Early Returns

```
// ❌ BAD - Nested conditionals
function processUser(user?: User) {
  if (user) {
    if (user.isActive) {
      if (user.permissions.length > 0) {
        // Logic...
      }
    }
  }
}

// ✅ GOOD - Early return, flatten structure
function processUser(user?: User) {
  if (!user) return;
  if (!user.isActive) return;
  if (user.permissions.length === 0) return;
  // Logic...
}
```

### Khai Báo Hàm Phụ Trước `return`, Gọi Tên Hàm Trong `return`

**Mọi hàm phụ phải khai báo trước `return`**, không định nghĩa inline trong JSX. Trong `return` chỉ **gọi tên hàm**, không viết logic.

```
// ❌ BAD - Logic trong return, hàm inline trong JSX
function TransactionList({ transactions }) {
  return (
    <div>
      {transactions.map(t => (
        <div key={t.id}>
          <span>{t.type === 'income' ? `+${t.amount}` : `-${t.amount}`}</span>
          <span>{new Date(t.date).toLocaleDateString('vi-VN')}</span>
          <span>{CATEGORIES.find(c => c.id === t.categoryId)?.name}</span>
        </div>
      ))}
    </div>
  );
}

// ❌ BAD - Hàm phụ đặt sau return
function TransactionList({ transactions }) {
  const formatAmount = (t) => t.type === 'income' ? `+${t.amount}` : `-${t.amount}`;

  return (
    <div>
      {transactions.map(t => (
        <div key={t.id}>
          <span>{formatAmount(t)}</span>
        </div>
      ))}
    </div>
  );

  function formatAmount(t) { // ❌ Đặt sau return - khó đọc
    return t.type === 'income' ? `+${t.amount}` : `-${t.amount}`;
  }
}

// ✅ GOOD - Khai báo tất cả hàm phụ TRƯỚC return, return chỉ gọi tên
function TransactionList({ transactions }) {
  // Hàm phụ: khai báo trước return
  const formatAmount = useCallback((t: Transaction) => {
    return t.type === 'income' ? `+${formatCurrency(t.amount)}` : `-${formatCurrency(t.amount)}`;
  }, []);

  const formatDate = useCallback((date: string) => {
    return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short' });
  }, []);

  const getCategoryName = useCallback((categoryId: string) => {
    return CATEGORIES.find(c => c.id === categoryId)?.name ?? 'Khác';
  }, []);

  const renderTransaction = useCallback((t: Transaction) => (
    <div key={t.id} className="flex items-center gap-3">
      <CategoryBadge categoryId={t.categoryId} />
      <span className={t.type === 'income' ? 'text-green' : 'text-red'}>
        {formatAmount(t)}
      </span>
      <span className="text-muted">{formatDate(t.date)}</span>
      <span>{getCategoryName(t.categoryId)}</span>
    </div>
  ), [formatAmount, formatDate, getCategoryName]);

  // ✅ return: chỉ gọi tên hàm, không logic
  return (
    <div className="space-y-2">
      {transactions.map(renderTransaction)}
    </div>
  );
}
```

**Quy tắc cụ thể:**

| Vị trí             | Cho phép                               | Không cho phép                     |
| ------------------ | -------------------------------------- | ---------------------------------- |
| **Trước `return`** | Khai báo hàm phụ, hooks, derived state | —                                  |
| **Trong `return`** | Gọi tên hàm đã khai báo ở trên         | Viết logic, định nghĩa hàm inline  |
| **Sau `return`**   | —                                      | Không đặt gì cả (ngoại trừ export) |

**Trường hợp exception — arrow function trực tiếp trong JSX:**

Khi map một mảng đơn giản, arrow function inline trong JSX **được phép** nếu logic chỉ là 1 dòng và không có side effects:

```
// ✅ ĐƯỢC PHÉP - Arrow inline cho map đơn giản
return (
  <div>
    {items.map(item => (
      <div key={item.id}>{item.name}</div>
    ))}
  </div>
);

// ❌ KHÔNG ĐƯỢC - Map phức tạp, nhiều dòng → phải tách
return (
  <div>
    {items.map(item => {
      const processed = expensiveComputation(item);
      const formatted = formatData(processed);
      return <div key={item.id}>{formatted}</div>;
    })}
  </div>
);
// → Phải tách thành hàm `renderItem` phía trên return
```

---

### No Magic Numbers/Strings

```
// ❌ BAD
if (age > 18 && status !== 2) { ... }

// ✅ GOOD
const MINIMUM_AGE = 18;
const ACTIVE_STATUS = 'active';

if (age > MINIMUM_AGE && status !== ACTIVE_STATUS) { ... }
```

---

## 3. Tránh Tạo Components/Hàm Không Cần Thiết

### Không tạo wrapper component khi không cần

```
// ❌ BAD - Wrapper không thêm logic gì
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-xl font-bold">{children}</h2>;
}
// Sử dụng: <SectionTitle>Hello</SectionTitle> thay vì <h2>Hello</h2>

// ✅ GOOD - Chỉ tạo component khi có logic đặc biệt
function StatCard({
  title,
  value,
  icon: Icon,
  trend
}: StatCardProps) {
  // Có logic: formatting, animation, state management
  const formattedValue = useFormattedNumber(value);
  return ( ... );
}
```

### Composition thay vì tạo mới

```
// ❌ BAD - Tạo nhiều variants
function PrimaryButton() { ... }
function SecondaryButton() { ... }
function DangerButton() { ... }

// ✅ GOOD - Một component, nhiều props
function Button({ variant = 'primary', children, ...props }: ButtonProps) {
  return <button className={getVariantClass(variant)} {...props}>{children}</button>;
}

// Usage
<Button variant="primary">Save</Button>
<Button variant="danger">Delete</Button>
```

### Tái sử dụng hàm utility

```
// ❌ BAD - Copy-paste logic
function formatCurrencyVND(amount: number) {
  return new Intl.NumberFormat('vi-VN').format(amount);
}
function formatCurrencyUSD(amount: number) {
  return new Intl.NumberFormat('en-US').format(amount);
}

// ✅ GOOD - Một hàm, linh hoạt
import { formatCurrency } from '@/utils/format';
formatCurrency(100000, 'VND');
formatCurrency(99.99, 'USD');
```

---

## 4. Tránh Re-render Thừa

### Memoization đúng cách

```
// ❌ BAD - Memo hàm không cần thiết
const Component = ({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => item.name); // Map đơn giản, không cần memo
  }, [data]);

  return <List items={processedData} />;
};

// ✅ GOOD - Chỉ memo khi có computation nặng hoặc reference stability
const Component = ({ data, onItemClick }) => {
  const processedData = useMemo(() => {
    return data.reduce((acc, item) => {
      // Computation nặng
      return acc + expensiveCalculation(item);
    }, 0);
  }, [data]);

  // Stable callback - truyền xuống child là memo
  const handleClick = useCallback((id: string) => {
    onItemClick(id);
  }, [onItemClick]);

  return <List items={processedData} onItemClick={handleClick} />;
};
```

### React.memo chỉ khi cần

```
// ❌ BAD - Memo tất cả, không phân biệt
const Button = React.memo(({ label }) => <button>{label}</button>);

// ✅ GOOD - Chỉ memo khi component có re-render thường xuyên
// và props ít thay đổi
const ExpenseRow = React.memo(({ expense, onDelete }: ExpenseRowProps) => {
  // Row trong danh sách dài, chỉ 1 row thay đổi khi 1 expense update
  return ( ... );
}, (prev, next) => {
  // Custom comparison - so sánh chỉ các field cần thiết
  return prev.expense.id === next.expense.id &&
         prev.expense.amount === next.expense.amount;
});
```

### Context phân chia theo domain

```
// ❌ BAD - Một context lớn, re-render toàn bộ khi 1 state thay đổi
const AppContext = createContext({
  user: null,
  theme: 'light',
  notifications: [],
  expenses: [],
  // ...10+ states
});

// ✅ GOOD - Tách context theo domain, re-render có kiểm soát
const ThemeContext = createContext<ThemeContextType>(null);
const UserContext = createContext<UserContextType>(null);
const NotificationContext = createContext<NotificationContextType>(null);

// Hoặc tách read-only vs mutable
const AuthContext = createContext<AuthContextType>(null);
```

### Key ổn định, không dùng index

```
// ❌ BAD - Index làm key, list reorder gây re-render sai
{items.map((item, index) => <Item key={index} {...item} />)}

// ✅ GOOD - ID ổn định
{items.map(item => <Item key={item.id} {...item} />)}
```

---

## 5. Component Structure Chuẩn

```
// 1. Imports (external → internal → relative)
import { useState, useCallback, useMemo } from 'react';
import { cn } from '@/utils/cn';
import { BUTTON_VARIANTS } from '@/constants/button';
import type { ButtonProps } from '@/types/button';

// 2. Types (nếu không export riêng)
type State = 'idle' | 'loading' | 'error';

// 3. Constants (nếu có)

// 4. Component
function Button({ variant = 'primary', size = 'md', disabled, loading, children, className, ...props }: ButtonProps) {
  // 5. Hooks - đặt đầu component
  const [isPressed, setIsPressed] = useState(false);

  // 6. Derived state
  const isDisabled = disabled || loading;

  // 7. Callbacks với useCallback
  const handleClick = useCallback(() => {
    if (!isDisabled) {
      props.onClick?.();
    }
  }, [isDisabled, props.onClick]);

  // 8. Effects (nếu có)

  // 9. Render
  return (
    <button
      className={cn(BUTTON_CLASSES.base, BUTTON_CLASSES.variants[variant], className)}
      disabled={isDisabled}
      onClick={handleClick}
      {...props}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}

// 10. Export
export { Button };
export type { ButtonProps };
```

---

## 6. Checklist Trước Khi Commit

- [ ] Component làm đúng **một việc** duy nhất?
- [ ] Tên biến/hàm **mô tả được** mục đích?
- [ ] Có **copy-paste** logic có thể tái sử dụng không?
- [ ] Có **magic number/string** cần extract thành constant?
- [ ] Có **nested conditionals** cần flatten?
- [ ] Có **memoization** không cần thiết hoặc thiếu?
- [ ] Có **wrapper component** thừa?
- [ ] Props có **quá dài** cần tách?
- [ ] Context có **quá lớn** cần chia nhỏ?
- [ ] Key trong list có **ổn định** không?

---

## Anti-Patterns Cần Tránh

| Sai                                                          | Đúng                                   |
| ------------------------------------------------------------ | -------------------------------------- |
| Tạo component mới khi có thể dùng composition                | Sử dụng `children`, `slot` pattern     |
| `useEffect` để cập nhật state rồi lại `useEffect` khác xử lý | Xử lý trong event handler              |
| Prop drilling nhiều tầng                                     | Context hoặc composition               |
| Render prop pattern khi không cần                            | Hook hoặc component composition        |
| Side effects trong render                                    | Đưa vào `useEffect` hoặc event handler |
