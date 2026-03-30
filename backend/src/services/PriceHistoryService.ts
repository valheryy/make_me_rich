import axios from 'axios';

export interface MonthlyPrice {
  date: string;
  close: number;
}

// CoinGecko — free, no key needed
const coingecko = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
  headers: { 'Accept': 'application/json' },
});

// Yahoo Finance v8 — called server-side so no CORS issue, browser headers avoid 401
const yahoo = axios.create({
  baseURL: 'https://query1.finance.yahoo.com/v8/finance/chart',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json',
    'Referer': 'https://finance.yahoo.com',
  },
});

export class PriceHistoryService {

  async fetchCrypto(coinGeckoId: string): Promise<MonthlyPrice[]> {
    const { data } = await coingecko.get(`/coins/${coinGeckoId}/market_chart`, {
      params: { vs_currency: 'usd', days: 5 * 365 },
    });

    const byMonth = new Map<string, { date: string; close: number }>();
    for (const [ts, price] of data.prices as [number, number][]) {
      const date = new Date(ts).toISOString().split('T')[0];
      byMonth.set(date.substring(0, 7), { date, close: price });
    }

    return Array.from(byMonth.values()).sort((a, b) => a.date.localeCompare(b.date));
  }

  async fetchStock(symbol: string): Promise<MonthlyPrice[]> {
    const { data } = await yahoo.get(`/${encodeURIComponent(symbol)}`, {
      params: { interval: '1mo', range: '5y' },
    });

    const result = data?.chart?.result?.[0];
    if (!result) throw new Error(`No data returned for ${symbol}`);

    const timestamps: number[] = result.timestamp ?? [];
    const closes: number[] = result.indicators?.quote?.[0]?.close ?? [];

    return timestamps
      .map((ts, i) => ({ date: new Date(ts * 1000).toISOString().split('T')[0], close: closes[i] }))
      .filter((p) => p.close != null)
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}
