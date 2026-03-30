export class RiskSkill {
  volatility(returns: number[]): number {
    if (returns.length < 2) return 0;
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + (r - mean) ** 2, 0) / (returns.length - 1);
    return Math.sqrt(variance);
  }

  sharpeRatio(returns: number[], riskFreeRate = 0.05 / 252): number {
    if (returns.length < 2) return 0;
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const std = this.volatility(returns);
    if (std === 0) return 0;
    return (mean - riskFreeRate) / std;
  }

  maxDrawdown(prices: number[]): number {
    let peak = prices[0];
    let maxDD = 0;
    for (const price of prices) {
      if (price > peak) peak = price;
      const dd = (peak - price) / peak;
      if (dd > maxDD) maxDD = dd;
    }
    return maxDD;
  }

  positionSize(accountBalance: number, riskPercent: number, entryPrice: number, stopLoss: number): number {
    const riskAmount = accountBalance * (riskPercent / 100);
    const riskPerShare = Math.abs(entryPrice - stopLoss);
    if (riskPerShare === 0) return 0;
    return Math.floor(riskAmount / riskPerShare);
  }
}
