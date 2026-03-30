import { MovingAverageSkill } from "./MovingAverageSkill";
import { RiskSkill } from "./RiskSkill";

export type Signal = "buy" | "sell" | "hold";

export interface SignalResult {
  symbol: string;
  signal: Signal;
  confidence: number;
  reason: string;
}

export class SignalSkill {
  private ma = new MovingAverageSkill();
  private risk = new RiskSkill();

  analyze(symbol: string, prices: number[]): SignalResult {
    if (prices.length < 26) {
      return { symbol, signal: "hold", confidence: 0, reason: "Insufficient data" };
    }

    const fast = this.ma.ema(prices, 12);
    const slow = this.ma.ema(prices, 26);
    const crossover = this.ma.crossover(fast, slow);

    const returns = prices.slice(1).map((p, i) => (p - prices[i]) / prices[i]);
    const sharpe = this.risk.sharpeRatio(returns);
    const maxDD = this.risk.maxDrawdown(prices);

    if (crossover === "bullish" && sharpe > 0 && maxDD < 0.2) {
      return {
        symbol,
        signal: "buy",
        confidence: Math.min(1, sharpe * 0.5 + 0.5),
        reason: `Bullish EMA crossover, Sharpe=${sharpe.toFixed(2)}, MaxDD=${(maxDD * 100).toFixed(1)}%`,
      };
    }

    if (crossover === "bearish" || maxDD > 0.3) {
      return {
        symbol,
        signal: "sell",
        confidence: Math.min(1, maxDD * 2),
        reason: `${crossover === "bearish" ? "Bearish EMA crossover" : "High drawdown"}, MaxDD=${(maxDD * 100).toFixed(1)}%`,
      };
    }

    return {
      symbol,
      signal: "hold",
      confidence: 0.5,
      reason: `No clear signal, Sharpe=${sharpe.toFixed(2)}`,
    };
  }
}
