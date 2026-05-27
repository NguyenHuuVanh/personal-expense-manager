import type { LucideIcon } from "lucide-react";
import type { Wallet, WalletFormData } from "@/types/wallet";
import type { CategoryBreakdown } from "@/hooks";

// =====================
// Shared Components
// =====================
export interface DonutTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: { color: string };
  }>;
  total?: number;
}

// =====================
// Card Wrapper
// =====================
export interface CardProps {
  title: string;
  badge?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

// =====================
// Wallet Type alias (still used by other types below)
// =====================
export type WalletType = "cash" | "bank" | "e-wallet" | "card";

// =====================
// Delete Wallet Modal
// =====================
export interface DeleteWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: Wallet | null;
  onConfirm: () => Promise<{ success: boolean; error?: string }>;
}

// =====================
// Wallets Section
// =====================
export interface WalletsSectionProps {
  onAddWallet: () => void;
  onEditWallet: (wallet: Wallet) => void;
  onDeleteWallet: (wallet: Wallet) => void;
  wallets: Wallet[];
  totalBalance: number;
  lowBalanceThreshold: number;
  isLoading: boolean;
}

// =====================
// Donut Chart Section
// =====================
export interface DonutChartSectionProps {
  categories: CategoryBreakdown[];
  isLoading?: boolean;
}

// =====================
// RightPanel Hooks
// =====================
export interface UseRightPanelReturn {
  isWalletModalOpen: boolean;
  isDeleteModalOpen: boolean;
  editingWallet: Wallet | null;
  deletingWallet: Wallet | null;
  categoryBreakdown: CategoryBreakdown[];
  lowBalanceThreshold: number;
  handleAddWallet: () => void;
  handleEditWallet: (wallet: Wallet) => void;
  handleDeleteWallet: (wallet: Wallet) => void;
  handleWalletSubmit: (data: WalletFormData) => Promise<{ success: boolean; error?: string }>;
  handleDeleteConfirm: () => Promise<{ success: boolean; error?: string }>;
  openWalletModal: (wallet?: Wallet) => void;
  closeWalletModal: () => void;
  openDeleteModal: (wallet: Wallet) => void;
  closeDeleteModal: () => void;
}
