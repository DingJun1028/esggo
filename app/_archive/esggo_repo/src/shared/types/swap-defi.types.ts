export interface SwapDefiConfig {
  apiKey: string;
  token: string;
  endpoint: string;
}

export interface SwapDefiTransaction {
  id: string;
  fromToken: string;
  toToken: string;
  amount: number;
  userAddress: string;
  recipient?: string; // Optional, defaults to userAddress for self-transfers
  slippageTolerance?: number; // Percentage (e.g., 0.5 for 0.5%)
  deadline?: number; // Unix timestamp
}