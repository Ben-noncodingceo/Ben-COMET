export enum AssetType {
  STOCK = 'STOCK',
  ETF = 'ETF',
  CRYPTO = 'CRYPTO'
}

export enum AlertCondition {
  ABOVE = 'ABOVE',
  BELOW = 'BELOW'
}

export interface Asset {
  id: number;
  symbol: string;
  name: string;
  type: AssetType;
  created_at: Date;
}

export interface PriceData {
  id: number;
  asset_id: number;
  price: number;
  timestamp: Date;
}

export interface Alert {
  id: number;
  asset_id: number;
  user_email: string;
  condition: AlertCondition;
  target_price: number;
  is_active: boolean;
  triggered_at?: Date;
  created_at: Date;
}

export interface ProbabilityAnalysis {
  asset_id: number;
  symbol: string;
  current_price: number;
  target_increase: number; // 30% = 0.30
  probability: number; // 0-1
  historical_volatility: number;
  calculated_at: Date;
}

export interface ApiPriceResponse {
  symbol: string;
  price: number;
  timestamp: Date;
}
