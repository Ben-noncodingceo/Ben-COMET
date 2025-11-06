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
  created_at: string;
}

export interface PriceData {
  symbol: string;
  price: number;
  timestamp: string;
}

export interface Alert {
  id: number;
  asset_id: number;
  user_email: string;
  condition: AlertCondition;
  target_price: number;
  is_active: boolean;
  triggered_at?: string;
  created_at: string;
  symbol?: string;
  name?: string;
  type?: AssetType;
}

export interface ProbabilityAnalysis {
  asset_id: number;
  symbol: string;
  current_price: number;
  target_increase: number;
  probability: number;
  historical_volatility: number;
  calculated_at: string;
}
