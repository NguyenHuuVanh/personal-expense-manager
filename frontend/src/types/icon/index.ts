import type { LucideIcon } from 'lucide-react';

export type IconId =
  | 'utensils' | 'car' | 'shopping-bag' | 'pill' | 'gamepad'
  | 'package' | 'wallet' | 'gift' | 'home' | 'plane'
  | 'coffee' | 'beer' | 'music' | 'cake' | 'apple'
  | 'salad' | 'bus' | 'train' | 'bike' | 'truck'
  | 'rocket' | 'credit-card' | 'store' | 'shirt' | 'watch'
  | 'scissors' | 'book' | 'dumbbell' | 'heart' | 'droplets'
  | 'wifi' | 'smartphone' | 'laptop' | 'graduation' | 'building'
  | 'palette' | 'paw' | 'baby' | 'sparkles' | 'zap'
  | 'tree' | 'umbrella' | 'sun'
  // Food & Drink
  | 'pizza' | 'ice-cream' | 'sandwich' | 'cookie' | 'cherry'
  | 'grape' | 'milk' | 'wine' | 'water'
  | 'candy' | 'popsicle' | 'drumstick' | 'fish'
  // Transport
  | 'taxi' | 'ship' | 'mountain' | 'map-pin' | 'navigation'
  | 'compass' | 'map' | 'ticket' | 'fuel' | 'gauge'
  // Shopping & Fashion
  | 'shopping-cart' | 'gem' | 'crown' | 'glasses' | 'backpack'
  | 'briefcase' | 'handbag' | 'wallet-cards' | 'receipt'
  // Tech
  | 'tv' | 'camera' | 'printer' | 'headphones' | 'speaker'
  | 'smartwatch' | 'radio'
  // Home
  | 'sofa' | 'bed' | 'bath' | 'armchair' | 'lamp'
  | 'door' | 'castle' | 'building-home' | 'hospital' | 'school'
  | 'hotel' | 'warehouse' | 'factory' | 'church'
  // Finance
  | 'banknote' | 'coins' | 'dollar' | 'receipt'
  | 'landmark' | 'piggy-bank' | 'trending-up' | 'trending-down'
  | 'percent' | 'calculator'
  // Health
  | 'stethoscope' | 'syringe' | 'bandage' | 'thermometer'
  | 'activity' | 'heart-pulse' | 'brain' | 'bones'
  | 'accessibility'
  // Education
  | 'pen-tool' | 'pen' | 'pencil' | 'ruler' | 'book-marked'
  | 'library' | 'newspaper' | 'file' | 'files' | 'archive'
  | 'award' | 'medal' | 'trophy' | 'star'
  // Entertainment
  | 'film' | 'clapperboard' | 'image' | 'images' | 'brush'
  | 'wand' | 'flame' | 'leaf' | 'feather' | 'cloud'
  | 'moon' | 'waves'
  // People
  | 'users' | 'user-plus' | 'user-check' | 'contact'
  | 'message' | 'mail' | 'bell'
  // Sports
  | 'target' | 'flag' | 'swords' | 'shield'
  // Communication
  | 'phone' | 'phone-call' | 'video' | 'mic'
  // Time
  | 'calendar' | 'calendar-days' | 'clock' | 'timer' | 'hourglass'
  // Security
  | 'lock' | 'unlock' | 'key' | 'scan'
  // Nature
  | 'bug' | 'flower' | 'dog' | 'cat' | 'mountain-snow'
  // Tools
  | 'settings' | 'wrench' | 'tools';

export interface IconEntry {
  id: IconId;
  label: string;
  Icon: LucideIcon;
}

export type CategoryTabKey = 'general' | 'food' | 'transport' | 'shop' | 'tech' | 'finance' | 'health' | 'other';

export interface CategoryTab {
  key: CategoryTabKey;
  label: string;
}

export interface IconPickerProps {
  selectedIcon: string;
  onSelect: (icon: string) => void;
  accentColor?: string;
}
