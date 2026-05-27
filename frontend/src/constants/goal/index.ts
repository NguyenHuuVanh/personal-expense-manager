export const GOAL_ICON_OPTIONS = [
  { value: 'home', label: 'Nhà' },
  { value: 'plane', label: 'Máy bay' },
  { value: 'car', label: 'Xe hơi' },
  { value: 'gift', label: 'Quà tặng' },
  { value: 'laptop', label: 'Laptop' },
  { value: 'smartphone', label: 'Điện thoại' },
  { value: 'piggy-bank', label: 'Heo đất' },
  { value: 'shopping-bag', label: 'Mua sắm' },
  { value: 'heart', label: 'Yêu thương' },
  { value: 'book', label: 'Sách' },
  { value: 'camera', label: 'Máy ảnh' },
  { value: 'music', label: 'Âm nhạc' },
] as const;

export const GOAL_COLOR_OPTIONS = [
  '#F89C34',
  '#827BF2',
  '#F66PAC',
  '#21AE5A',
  '#F2CC00',
  '#38BDF8',
  '#E40127',
  '#9EA3B8',
] as const;

export const DEFAULT_GOAL_ICON = 'piggy-bank';
export const DEFAULT_GOAL_COLOR = '#827BF2';
