import yahooFinance from "yahoo-finance2";
import axios from "axios";

export interface MonthlyPrice {
  date: Date;
  close: number;
}

export class PriceHistoryService {
  // Fetch ~5 years of monthly closes from Yahoo Finance (stocks/ETFs/indices)
  async fetchStock(symbol: string): Promise<MonthlyPrice[]> {
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

    const result = await yahooFinance.chart(symbol, {
      period1: fiveYearsAgo,
      period2: new Date(),
      interval: "1mo",
    });

    return (result.quotes ?? [])
      .filter((q) => q.close != null)
      .map((q) => ({ date: new Date(q.date), close: q.close as number }));
  }

  // Fetch ~5 years of monthly closes from CoinGecko (crypto)
  async fetchCrypto(coinGeckoId: string): Promise<MonthlyPrice[]> {
    const days = 5 * 365; // CoinGecko returns daily for > 90 days
    const url = `https://api.coingecko.com/api/v3/coins/${coinGeckoId}/market_chart`;
    const { data } = await axios.get(url, {
      params: { vs_currency: "usd", days, interval: "daily" },
    });

    // data.prices = [[timestamp_ms, price], ...]
    // Downsample to monthly (keep last entry per calendar month)
    const daily: { date: Date; close: number }[] = (data.prices as [number, number][]).map(
      ([ts, price]) => ({ date: new Date(ts), close: price })
    );

    const byMonth = new Map<string, { date: Date; close: number }>();
    for (const d of daily) {
      const key = `${d.date.getFullYear()}-${String(d.date.getMonth() + 1).padStart(2, "0")}`;
      byMonth.set(key, d); // overwrite → keeps the last day of each month
    }

    return Array.from(byMonth.values()).sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}
