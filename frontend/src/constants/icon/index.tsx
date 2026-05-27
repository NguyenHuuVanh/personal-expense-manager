import type { CategoryTabKey } from '@/types/icon';

export const CATEGORY_TABS = [
  { key: 'general', label: 'Chung' },
  { key: 'food', label: 'Ăn uống' },
  { key: 'transport', label: 'Di chuyển' },
  { key: 'shop', label: 'Mua sắm' },
  { key: 'tech', label: 'Công nghệ' },
  { key: 'finance', label: 'Tài chính' },
  { key: 'health', label: 'Sức khỏe' },
  { key: 'other', label: 'Khác' },
] as const;

export const TAB_ICONS: Record<CategoryTabKey, readonly string[]> = {
  general: ['wallet', 'heart', 'home', 'package', 'gift', 'building', 'book', 'graduation', 'star', 'users', 'lock', 'key', 'settings', 'wrench'],
  food: ['utensils', 'coffee', 'apple', 'salad', 'cake', 'beer', 'music', 'droplets', 'pizza', 'ice-cream', 'sandwich', 'cookie', 'cherry', 'wine', 'milk', 'fish', 'drumstick'],
  transport: ['car', 'bus', 'train', 'bike', 'truck', 'plane', 'rocket', 'taxi', 'ship', 'navigation', 'map', 'compass', 'fuel'],
  shop: ['shopping-bag', 'shirt', 'watch', 'scissors', 'shopping-cart', 'gem', 'crown', 'glasses', 'backpack', 'briefcase', 'handbag', 'receipt'],
  tech: ['smartphone', 'laptop', 'tv', 'camera', 'headphones', 'speaker', 'printer', 'smartwatch', 'radio', 'wifi', 'credit-card'],
  finance: ['banknote', 'coins', 'dollar', 'landmark', 'piggy-bank', 'trending-up', 'trending-down', 'calculator', 'piggy-bank'],
  health: ['pill', 'stethoscope', 'syringe', 'bandage', 'activity', 'heart-pulse', 'brain', 'accessibility'],
  other: ['calendar', 'clock', 'timer', 'film', 'image', 'images', 'brush', 'wand', 'cloud', 'waves', 'mountain', 'flower', 'leaf', 'paw', 'baby', 'shield', 'swords', 'target', 'flag', 'message', 'mail', 'bell'],
} as const;

export const DEFAULT_ACCENT_COLOR = '#827BF2';
