export interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;
}

export class MarketService {
  private quotes: Map<string, Quote> = new Map([
    ["AAPL", { symbol: "AAPL", price: 189.5, change: 1.2, changePercent: 0.64, volume: 52_000_000, timestamp: new Date() }],
    ["TSLA", { symbol: "TSLA", price: 242.3, change: -3.1, changePercent: -1.26, volume: 98_000_000, timestamp: new Date() }],
    ["NVDA", { symbol: "NVDA", price: 875.0, change: 12.5, changePercent: 1.45, volume: 41_000_000, timestamp: new Date() }],
    ["BTC",  { symbol: "BTC",  price: 67_400, change: 800, changePercent: 1.2, volume: 25_000_000_000, timestamp: new Date() }],
  ]);

  getQuote(symbol: string): Quote {
    const quote = this.quotes.get(symbol.toUpperCase());
    if (!quote) throw new Error(`Unknown symbol: ${symbol}`);
    return quote;
  }

  getAllQuotes(): Quote[] {
    return Array.from(this.quotes.values());
  }

  getPrices(symbols: string[]): Record<string, number> {
    return Object.fromEntries(
      symbols.map((s) => [s, this.getQuote(s).price])
    );
  }

  // Simulate a price tick (for demo/testing)
  tick(): void {
    for (const quote of this.quotes.values()) {
      const delta = (Math.random() - 0.5) * quote.price * 0.01;
      quote.change = delta;
      quote.changePercent = (delta / quote.price) * 100;
      quote.price = Math.max(0.01, quote.price + delta);
      quote.timestamp = new Date();
    }
  }
}
