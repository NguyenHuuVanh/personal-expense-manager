/**
 * Color palette for categories and UI elements
 * Extended color palette for better visual variety
 */

export const CATEGORY_COLORS = [
  // Orange series
  { value: '#F89C34', label: 'Cam' },
  { value: '#FF8A00', label: 'Cam đậm' },
  { value: '#FF6B35', label: 'Cam san hô' },
  { value: '#FFB347', label: 'Cam nhạt' },

  // Purple series
  { value: '#827BF2', label: 'Tím' },
  { value: '#6B5FD4', label: 'Tím đậm' },
  { value: '#A78BFA', label: 'Tím nhạt' },
  { value: '#8B5CF6', label: 'Violet' },

  // Green series
  { value: '#21AE5A', label: 'Xanh lá' },
  { value: '#10B981', label: 'Xanh ngọc' },
  { value: '#34D399', label: 'Xanh lá nhạt' },
  { value: '#059669', label: 'Xanh lá đậm' },

  // Yellow series
  { value: '#F2CC00', label: 'Vàng' },
  { value: '#FBBF24', label: 'Vàng mật ong' },
  { value: '#FCD34D', label: 'Vàng nhạt' },
  { value: '#EAB308', label: 'Vàng đậm' },

  // Blue series
  { value: '#38BDF8', label: 'Xanh dương' },
  { value: '#0EA5E9', label: 'Xanh biển' },
  { value: '#06B6D4', label: 'Cyan' },
  { value: '#0D9488', label: 'Xanh ngọc đậm' },

  // Red/Pink series
  { value: '#E40127', label: 'Đỏ' },
  { value: '#F66PAC', label: 'Hồng' },
  { value: '#F472B6', label: 'Hồng đậm' },
  { value: '#EC4899', label: 'Hồng fuchsia' },

  // Gray/Neutral series
  { value: '#9EA3B8', label: 'Xám' },
  { value: '#6B7280', label: 'Xám đậm' },
  { value: '#9CA3AF', label: 'Xám trung' },
  { value: '#D1D5DB', label: 'Xám nhạt' },

  // Special colors
  { value: '#14B8A6', label: 'Teal' },
  { value: '#6366F1', label: 'Indigo' },
  { value: '#F97316', label: 'Orange đậm' },
  { value: '#EF4444', label: 'Đỏ cảnh báo' },
];

// Default color for new categories
export const DEFAULT_CATEGORY_COLOR = '#827BF2';

// Get color by value
export function getColorByValue(value: string): typeof CATEGORY_COLORS[0] | undefined {
  return CATEGORY_COLORS.find((c) => c.value === value);
}

// Get random color
export function getRandomColor(): string {
  return CATEGORY_COLORS[Math.floor(Math.random() * CATEGORY_COLORS.length)].value;
}
