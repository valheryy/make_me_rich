export interface MonthlyPrice {
  date: string;
  close: number;
}

export type SignalLevel = 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL';

export interface AssetAnalysis {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  avg48: number;
  deviation: number;
  signal: SignalLevel;
  action: string;
  history: MonthlyPrice[];
}

export const WATCHLIST = [
  { id: 'ETHUSDT', symbol: 'ETH', name: 'Ethereum' },
  { id: 'ZECUSDT', symbol: 'ZEC', name: 'Zcash'    },
  { id: 'XRPUSDT', symbol: 'XRP', name: 'XRP'      },
] as const;

export const STRATEGY = {
  avgMonths:     48,
  buyThreshold:  0.20,
  sellThreshold: 0.20,
};
