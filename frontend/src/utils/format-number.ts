// =====================
// Number Formatting
// =====================

export const formatNumberShort = (value: number | null | undefined, decimals: number = 1): string => {
  if (value == null || Number.isNaN(value)) {
    return '0';
  }

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1_000_000_000) {
    const formatted = (absValue / 1_000_000_000).toFixed(decimals);
    return `${sign}${formatted}B`;
  }

  if (absValue >= 1_000_000) {
    const formatted = (absValue / 1_000_000).toFixed(decimals);
    return `${sign}${formatted}M`;
  }

  if (absValue >= 1_000) {
    const formatted = (absValue / 1_000).toFixed(decimals);
    return `${sign}${formatted}K`;
  }

  return `${sign}${absValue.toFixed(0)}`;
};

export const formatNumberVN = (value: number | null | undefined): string => {
  if (value == null || Number.isNaN(value)) {
    return '0';
  }
  return value.toLocaleString('vi-VN');
};

// =====================
// Currency Formatting
// =====================

export function formatCurrency(amount: number, currency: string = 'VND'): string {
  if (amount == null || Number.isNaN(amount)) {
    return '0 VNĐ';
  }
  const formatted = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return `${formatted} VNĐ`;
}

export function formatCompactCurrency(amount: number): string {
  if (amount == null || Number.isNaN(amount)) {
    return '0';
  }
  if (amount >= 1_000_000_000) return `${(amount / 1_000_000_000).toFixed(1)}B`;
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K`;
  return amount.toString();
}

// =====================
// Date Formatting
// =====================

export function formatDate(dateStr: string | Date): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// =====================
// Input Formatting (for form inputs)
// =====================

/**
 * Format number string with thousand separators while typing
 * Input: "1000000" -> Output: "1.000.000"
 * This is used during onChange to auto-format as user types
 */
export const formatInputValue = (value: string): string => {
  if (!value) return "";
  const digitsOnly = value.replace(/[^0-9]/g, "");
  if (!digitsOnly) return "";
  const num = parseInt(digitsOnly, 10);
  return num.toLocaleString("vi-VN");
};

/**
 * Parse formatted string to number for submission
 * Input: "1.000.000" -> Output: 1000000
 */
export const parseInputForSubmit = (value: string): number => {
  if (!value) return 0;
  const parsed = parseFloat(value.replace(/\./g, ""));
  return isNaN(parsed) ? 0 : parsed;
};

// =====================
// Calculation Helpers
// =====================

export function calculateTrend(current: number, previous: number): number {
  if (previous === 0) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}
