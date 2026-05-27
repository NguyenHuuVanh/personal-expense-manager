/**
 * Filter options cho Transactions List
 * Các options này dùng cho SelectField trong filter panel
 */

export const TRANSACTION_CATEGORY_OPTIONS = [
  { value: '', label: 'Tất cả danh mục' },
  { value: 'food', label: 'Ăn uống' },
  { value: 'transport', label: 'Di chuyển' },
  { value: 'shopping', label: 'Mua sắm' },
  { value: 'bills', label: 'Hóa đơn' },
  { value: 'entertainment', label: 'Giải trí' },
  { value: 'health', label: 'Sức khỏe' },
];

export const TRANSACTION_WALLET_OPTIONS = [
  { value: '', label: 'Tất cả ví' },
  { value: 'vcb', label: 'VCB - Tài khoản chính' },
  { value: 'momo', label: 'Momo' },
  { value: 'cash', label: 'Tiền mặt' },
  { value: 'zalopay', label: 'ZaloPay' },
];

export const TRANSACTION_TYPE_OPTIONS = [
  { value: '', label: 'Tất cả loại' },
  { value: 'income', label: 'Thu nhập' },
  { value: 'expense', label: 'Chi tiêu' },
  { value: 'transfer', label: 'Chuyển khoản' },
];

export const TRANSACTION_STATUS_OPTIONS = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'pending', label: 'Đang xử lý' },
  { value: 'failed', label: 'Thất bại' },
];
