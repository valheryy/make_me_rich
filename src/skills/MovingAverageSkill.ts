export class MovingAverageSkill {
  sma(prices: number[], period: number): number[] {
    if (prices.length < period) return [];
    const result: number[] = [];
    for (let i = period - 1; i < prices.length; i++) {
      const slice = prices.slice(i - period + 1, i + 1);
      result.push(slice.reduce((a, b) => a + b, 0) / period);
    }
    return result;
  }

  ema(prices: number[], period: number): number[] {
    if (prices.length < period) return [];
    const k = 2 / (period + 1);
    const result: number[] = [];
    let prev = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
    result.push(prev);
    for (let i = period; i < prices.length; i++) {
      prev = prices[i] * k + prev * (1 - k);
      result.push(prev);
    }
    return result;
  }

  crossover(fast: number[], slow: number[]): "bullish" | "bearish" | "none" {
    if (fast.length < 2 || slow.length < 2) return "none";
    const prevFast = fast[fast.length - 2];
    const prevSlow = slow[slow.length - 2];
    const currFast = fast[fast.length - 1];
    const currSlow = slow[slow.length - 1];

    if (prevFast <= prevSlow && currFast > currSlow) return "bullish";
    if (prevFast >= prevSlow && currFast < currSlow) return "bearish";
    return "none";
  }
}
