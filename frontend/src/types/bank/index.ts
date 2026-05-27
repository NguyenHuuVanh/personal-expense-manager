/**
 * Shape của bank trả về từ VietQR API.
 * Docs: https://api.vietqr.io/v2/banks
 */
export interface Bank {
  id: number;
  name: string;        // Tên đầy đủ — "Ngân hàng TMCP Ngoại Thương Việt Nam"
  code: string;        // Mã ngân hàng — "VCB"
  bin: string;         // BIN — "970436"
  shortName: string;   // Tên ngắn — "Vietcombank"
  logo: string;        // URL logo — "https://cdn.vietqr.io/img/VCB.png"
  transferSupported: number;
  lookupSupported: number;
  swift_code?: string;
}

export interface VietQrBanksResponse {
  code: string;
  desc: string;
  data: Bank[];
}
