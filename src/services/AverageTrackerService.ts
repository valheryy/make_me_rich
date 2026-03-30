import { MonthlyPrice } from "./PriceHistoryService";
import { STRATEGY } from "../config/watchlist";

export type SignalLevel = "STRONG_BUY" | "BUY" | "HOLD" | "SELL" | "STRONG_SELL";

export interface MonthSnapshot {
  date: Date;
  close: number;
  avg48?: number;         // undefined until we have 48 months
  deviation?: number;     // (close - avg) / avg  — positive = above avg
}

export interface AssetAnalysis {
  symbol: string;
  name: string;
  currentPrice: number;
  avg48: number;
  deviation: number;      // e.g. 0.25 = 25% above average
  signal: SignalLevel;
  suggestedAction: string;
  history: MonthSnapshot[];
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
    const avg48 = latest.avg48 ?? prices.slice(-avgMonths).reduce((a, b) => a + b.close, 0) / Math.min(prices.length, avgMonths);
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
    };
  }

  private toSignal(dev: number, buyT: number, sellT: number): SignalLevel {
    if (dev <= -buyT * 1.5)  return "STRONG_BUY";
    if (dev <= -buyT)        return "BUY";
    if (dev >= sellT * 1.5)  return "STRONG_SELL";
    if (dev >= sellT)        return "SELL";
    return "HOLD";
  }

  private actionText(signal: SignalLevel, deviation: number): string {
    const pct = (Math.abs(deviation) * 100).toFixed(1);
    switch (signal) {
      case "STRONG_BUY":  return `Price is ${pct}% below 48m avg — consider buying 20% of target position`;
      case "BUY":         return `Price is ${pct}% below 48m avg — buy signal (20% of position)`;
      case "STRONG_SELL": return `Price is ${pct}% above 48m avg — consider selling 20% of holding`;
      case "SELL":        return `Price is ${pct}% above 48m avg — sell signal (20% of holding)`;
      case "HOLD":        return `Price within ±20% of 48m avg (${deviation >= 0 ? "+" : ""}${(deviation * 100).toFixed(1)}%) — hold`;
    }
  }
}
