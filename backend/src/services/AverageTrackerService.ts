import { MonthlyPrice } from './PriceHistoryService';
import { STRATEGY } from '../config/watchlist';

export type SignalLevel = 'STRONG_BUY' | 'BUY' | 'HOLD' | 'SELL' | 'STRONG_SELL';

export interface MonthSnapshot {
  date: string;
  close: number;
  avg48?: number;
  deviation?: number;
}

export interface AssetAnalysis {
  symbol: string;
  name: string;
  currentPrice: number;
  avg48: number;
  deviation: number;
  signal: SignalLevel;
  suggestedAction: string;
  history: MonthSnapshot[];
  updatedAt: string;
}

export class AverageTrackerService {
  analyze(symbol: string, name: string, prices: MonthlyPrice[]): AssetAnalysis {
    const { avgMonths, buyThreshold, sellThreshold } = STRATEGY;

    const history: MonthSnapshot[] = prices.map((p, i) => {
      const snap: MonthSnapshot = { date: p.date, close: p.close };
      if (i >= avgMonths - 1) {
        const window = prices.slice(i - avgMonths + 1, i + 1).map((x) => x.close);
        snap.avg48 = window.reduce((a, b) => a + b, 0) / window.length;
        snap.deviation = (p.close - snap.avg48) / snap.avg48;
      }
      return snap;
    });

    const latest = history[history.length - 1];
    const windowPrices = prices.slice(-Math.min(prices.length, avgMonths)).map((x) => x.close);
    const avg48 = windowPrices.reduce((a, b) => a + b, 0) / windowPrices.length;
    const deviation = (latest.close - avg48) / avg48;
    const signal = this.toSignal(deviation, buyThreshold, sellThreshold);

    return {
      symbol,
      name,
      currentPrice: latest.close,
      avg48,
      deviation,
      signal,
      suggestedAction: this.actionText(signal, deviation),
      history,
      updatedAt: new Date().toISOString(),
    };
  }

  private toSignal(dev: number, buyT: number, sellT: number): SignalLevel {
    if (dev <= -buyT * 1.5)  return 'STRONG_BUY';
    if (dev <= -buyT)        return 'BUY';
    if (dev >= sellT * 1.5)  return 'STRONG_SELL';
    if (dev >= sellT)        return 'SELL';
    return 'HOLD';
  }

  private actionText(signal: SignalLevel, deviation: number): string {
    const pct = (Math.abs(deviation) * 100).toFixed(1);
    switch (signal) {
      case 'STRONG_BUY':  return `${pct}% below 48m avg — strong buy, consider 20% position`;
      case 'BUY':         return `${pct}% below 48m avg — buy signal (20% of target)`;
      case 'STRONG_SELL': return `${pct}% above 48m avg — strong sell, consider reducing 20%`;
      case 'SELL':        return `${pct}% above 48m avg — sell signal (20% of holding)`;
      case 'HOLD':        return `Within ±20% of 48m avg (${deviation >= 0 ? '+' : ''}${(deviation * 100).toFixed(1)}%) — hold`;
    }
  }
}
