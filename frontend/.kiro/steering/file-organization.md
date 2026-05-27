---
inclusion: always
---

# Quy Tắc Tổ Chức Code - Tách Biệt Types/Constants/Utils/Tests

## Nguyên Tắc Cốt Lõi

**MỖI** component file `.tsx` chỉ chứa **logic hiển thị**. **TẤT CẢ** types, constants, utils, tests phải đặt ở **thư mục dùng chung riêng biệt**.

**KHÔNG ĐƯỢC** tạo file `*.types.ts`, `*.constants.ts`, `*.utils.ts` cùng folder với component.

---

## Cấu Trúc Thư Mục Đúng

```
src/
├── components/          # Chỉ có .tsx
│   ├── Button/
│   │   └── Button.tsx              # ✅ Chỉ file component
│   ├── Modal/
│   │   └── Modal.tsx               # ✅
│   └── ...
├── hooks/               # Chỉ có logic hook
│   ├── useAuth.ts
│   └── useWallets.ts
├── types/               # ✅ Types dùng chung - THƯ MỤC RIÊNG
│   ├── button/
│   │   └── index.ts               # ButtonProps, ButtonVariant...
│   ├── modal/
│   │   └── index.ts               # ModalProps, ModalSize...
│   ├── wallet/
│   │   └── index.ts               # Wallet, WalletType...
│   ├── auth/
│   │   └── index.ts               # AuthUser, AuthState...
│   ├── budget/
│   │   └── index.ts               # BudgetItem, BudgetFormData...
│   ├── goal/
│   │   └── index.ts               # GoalItem, GoalFormData...
│   ├── transaction/
│   │   └── index.ts               # Transaction, TransactionType...
│   ├── icon/
│   │   └── index.ts               # IconId, IconEntry...
│   └── common/
│       └── index.ts               # Shared types
├── constants/           # ✅ Constants dùng chung - THƯ MỤC RIÊNG
│   ├── app/
│   │   └── index.ts               # APP_NAME, APP_VERSION...
│   ├── button/
│   │   └── index.ts               # BUTTON_VARIANTS, BUTTON_SIZES...
│   ├── modal/
│   │   └── index.ts               # MODAL_SIZES, MODAL_DEFAULTS...
│   ├── theme/
│   │   └── index.ts               # COLORS, SPACING...
│   ├── budget/
│   │   └── index.ts               # PERIOD_OPTIONS...
│   ├── goal/
│   │   └── index.ts               # GOAL_ICONS, GOAL_COLORS...
│   ├── icon/
│   │   └── index.ts               # CATEGORY_TABS, TAB_ICONS...
│   └── route/
│       └── index.ts               # ROUTES, API_ENDPOINTS...
├── utils/               # ✅ Utils dùng chung - THƯ MỤC RIÊNG
│   ├── format/
│   │   ├── index.ts               # Exports
│   │   ├── formatCurrency.ts      # formatCurrency()
│   │   └── formatCurrency.constants.ts
│   ├── date/
│   │   ├── index.ts               # Exports
│   │   └── dateUtils.ts           # formatDate(), parseDate()...
│   ├── validation/
│   │   ├── index.ts               # Exports
│   │   └── validators.ts           # isEmail(), isPhone()...
│   └── cn/
│       └── index.ts               # cn() utility
├── data/                # ✅ Data files lớn - THƯ MỤC RIÊNG
│   ├── icons/
│   │   ├── index.ts               # Exports
│   │   ├── iconMap.ts             # ICON_MAP
│   │   └── allIcons.ts            # ALL_ICONS
│   ├── mock/
│   │   └── expenseDashboard.ts    # MOCK_DATA
│   └── ...
├── test/                # ✅ Tests dùng chung - THƯ MỤC RIÊNG
│   ├── setup.ts
│   ├── components/
│   │   └── button.test.ts
│   ├── hooks/
│   │   └── useAuth.test.ts
│   └── utils/
│       └── formatCurrency.test.ts
└── lib/                 # Third-party configs
    ├── firebase.ts
    └── ...
```

---

## Quy Tắc Chi Tiết

### 1. Components - CHỈ có .tsx

**SAI (❌):**
```
components/
├── Button/
│   ├── Button.tsx
│   ├── Button.types.ts      ❌ Đặt ở src/types/button/
│   ├── Button.constants.ts ❌ Đặt ở src/constants/button/
│   └── Button.utils.ts     ❌ Đặt ở src/utils/button/
```

**ĐÚNG (✅):**
```
src/
├── components/
│   └── Button/
│       └── Button.tsx               ✅ Chỉ có component
├── types/
│   └── button/
│       └── index.ts                 ✅ Types
├── constants/
│   └── button/
│       └── index.ts                ✅ Constants
├── utils/
│   └── button/
│       └── index.ts                ✅ Utils
└── test/
    └── components/
        └── button.test.ts          ✅ Tests
```

### 2. Import Đúng Cách

**SAI (❌):**
```typescript
// components/Button/Button.tsx
import type { ButtonProps } from './Button.types';           // ❌
import { BUTTON_VARIANTS } from './Button.constants';       // ❌
import { cn } from './Button.utils';                       // ❌
```

**ĐÚNG (✅):**
```typescript
// components/Button/Button.tsx
import type { ButtonProps } from '@/types/button';
import { BUTTON_VARIANTS } from '@/constants/button';
import { cn } from '@/utils/cn';
```

### 3. Cấu Trúc Types Theo Thư Mục

**SAI (❌):**
```typescript
// src/types/button.types.ts
export interface ButtonProps { ... }
```

**ĐÚNG (✅):**
```typescript
// src/types/button/index.ts
import type { LucideIcon } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}
```

### 4. Cấu Trúc Constants Theo Thư Mục

**SAI (❌):**
```typescript
// src/constants/button.constants.ts
export const BUTTON_VARIANTS = ['primary', 'secondary'] as const;
export const BUTTON_SIZES = ['sm', 'md', 'lg'] as const;
```

**ĐÚNG (✅):**
```typescript
// src/constants/button/index.ts
export const BUTTON_VARIANTS = ['primary', 'secondary', 'outline', 'ghost'] as const;
export const BUTTON_SIZES = ['sm', 'md', 'lg'] as const;

export const DEFAULT_BUTTON_VARIANT: ButtonVariant = 'primary';
export const DEFAULT_BUTTON_SIZE: ButtonSize = 'md';

export const BUTTON_CLASSES = {
  base: 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none',
  variants: { ... },
  sizes: { ... },
} as const;
```

### 5. Cấu Trúc Utils Theo Thư Mục

**SAI (❌):**
```typescript
// src/utils/formatCurrency.utils.ts
export function formatCurrency(amount: number) { ... }
```

**ĐÚNG (✅):**
```typescript
// src/utils/format/index.ts
export * from './formatCurrency';
export * from './formatCompactCurrency';
export { CURRENCY_SYMBOLS, DEFAULT_CURRENCY } from './formatCurrency.constants';

// src/utils/format/formatCurrency.ts
export function formatCurrency(amount: number, currency = DEFAULT_CURRENCY) {
  return `${CURRENCY_SYMBOLS[currency]}${amount.toLocaleString()}`;
}

// src/utils/format/formatCurrency.constants.ts
export const CURRENCY_SYMBOLS = { USD: '$', VND: '₫', EUR: '€' } as const;
export const DEFAULT_CURRENCY = 'VND';
```

---

## Ví Dụ Thực Tế

### Component: Budget Form Dialog

```
src/
├── components/
│   └── budgets/
│       ├── BudgetFormDialog.tsx    ✅ Component
│       └── BudgetCard.tsx          ✅ Component
├── types/
│   └── budget/
│       └── index.ts               ✅ BudgetItem, BudgetFormData, BudgetFormDialogProps...
├── constants/
│   └── budget/
│       └── index.ts               ✅ PERIOD_OPTIONS, DEFAULT_BUDGET...
├── utils/
│   └── budget/
│       └── index.ts               ✅ calculateBudgetUsage()...
└── test/
    └── components/
        └── budgets.test.ts        ✅
```

### Component: Icon Picker

```
src/
├── components/
│   └── categories/
│       ├── IconPicker.tsx          ✅ Component
│       └── IconPickerGrid.tsx     ✅ Component phụ
├── types/
│   └── icon/
│       └── index.ts               ✅ IconId, IconEntry, IconPickerProps...
├── constants/
│   └── icon/
│       └── index.ts               ✅ CATEGORY_TABS, TAB_ICONS...
├── data/
│   └── icons/
│       ├── index.ts               ✅ Exports
│       ├── iconMap.ts             ✅ ICON_MAP
│       └── allIcons.ts            ✅ ALL_ICONS
└── utils/
    └── icon/
        └── index.ts               ✅ getIconById()...
```

---

## Checklist Trước Khi Tạo Component Mới

```markdown
- [ ] Tên component là gì? (VD: BudgetFormDialog)
- [ ] Types → src/types/budget/index.ts
- [ ] Constants → src/constants/budget/index.ts
- [ ] Utils → src/utils/budget/index.ts
- [ ] Data lớn → src/data/budget/index.ts
- [ ] Tests → src/test/components/budget.test.ts
```

---

## Anti-Patterns Cần Tránh

| Sai | Đúng |
|-----|------|
| Colocate `*.types.ts` với component | `src/types/[name]/index.ts` |
| Colocate `*.constants.ts` với component | `src/constants/[name]/index.ts` |
| Colocate `*.utils.ts` với component | `src/utils/[name]/index.ts` |
| Colocate `*.test.ts` với component | `src/test/components/[name].test.ts` |
| Import từ `./types` | Import từ `@/types/[name]` |

---

## Quy Tắc Đặt Tên Thư Mục

| Loại | Định dạng | Ví dụ |
|------|-----------|--------|
| Types | `types/[name]/index.ts` | `types/button/index.ts`, `types/budget/index.ts` |
| Constants | `constants/[name]/index.ts` | `constants/theme/index.ts`, `constants/app/index.ts` |
| Utils | `utils/[name]/index.ts` | `utils/format/index.ts`, `utils/date/index.ts` |
| Tests | `test/[category]/[name].test.ts` | `test/components/button.test.ts` |
| Data | `data/[name]/index.ts` | `data/icons/index.ts` |

---

## Import Pattern Chuẩn

```typescript
// Từ types folder
import type { ButtonProps } from '@/types/button';
import type { BudgetItem, BudgetFormData } from '@/types/budget';

// Từ constants folder
import { BUTTON_VARIANTS } from '@/constants/button';
import { PERIOD_OPTIONS } from '@/constants/budget';

// Từ utils folder
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';

// Từ data folder
import { ICON_MAP, ALL_ICONS } from '@/data/icons';
```
