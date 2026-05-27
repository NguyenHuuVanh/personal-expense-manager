export type WalletType = "cash" | "bank" | "e-wallet" | "card";

// Options for wallet form selects
export interface WalletOption {
  value: string;
  label: string;
}

export const BANK_OPTIONS: WalletOption[] = [
  { value: "vietcombank", label: "Vietcombank" },
  { value: "vietinbank", label: "VietinBank" },
  { value: "bidv", label: "BIDV" },
  { value: "agribank", label: "Agribank" },
  { value: "mbbank", label: "MB Bank" },
  { value: "acb", label: "ACB" },
  { value: "vpbank", label: "VPBank" },
  { value: "tpbank", label: "TPBank" },
  { value: "shinhanbank", label: "Shinhan Bank" },
  { value: "ocb", label: "OCB" },
];

export const EWALLET_OPTIONS: WalletOption[] = [
  { value: "momo", label: "MoMo" },
  { value: "zalo", label: "ZaloPay" },
  { value: "vnpay", label: "VNPay" },
  { value: "shopee", label: "ShopeePay" },
  { value: "vietqr", label: "VietQR" },
  { value: "airpay", label: "AirPay" },
];

export const WALLET_COLOR_OPTIONS: WalletOption[] = [
  { value: "#827BF2", label: "Tím" },
  { value: "#21AE5A", label: "Xanh lá" },
  { value: "#38BDF8", label: "Xanh dương" },
  { value: "#F89C34", label: "Cam" },
  { value: "#F2CC00", label: "Vàng" },
];

export const WALLET_TYPE_OPTIONS: WalletOption[] = [
  { value: "cash", label: "Tiền mặt" },
  { value: "bank", label: "Tài khoản ngân hàng" },
  { value: "e-wallet", label: "Ví điện tử" },
  { value: "card", label: "Thẻ tín dụng" },
];

export interface Wallet {
  _id: string;
  userId: string;
  name: string;
  type: WalletType;
  balance: number;
  currency: string;
  cardNumber?: string;
  bankCode?: string;
  accountNumber?: string;
  accountHolder?: string;
  isPrimary: boolean;
  isLowBalance?: boolean;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletFormData {
  name: string;
  type: WalletType;
  balance?: number;
  cardNumber?: string;
  bankCode?: string;
  accountNumber?: string;
  accountHolder?: string;
  color?: string;
}

export interface CreateWalletData extends WalletFormData {
  isPrimary?: boolean;
}

export interface UpdateWalletData extends Partial<WalletFormData> {}
