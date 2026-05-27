export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp (ms)
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfterSeconds?: number;
}
