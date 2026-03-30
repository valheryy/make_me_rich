import { WATCHLIST, WatchedAsset } from '../config/watchlist';
import { PriceHistoryService } from './PriceHistoryService';
import { AverageTrackerService, AssetAnalysis } from './AverageTrackerService';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class TrackerOrchestrator {
  private priceHistory = new PriceHistoryService();
  private tracker = new AverageTrackerService();

  async runAll(): Promise<AssetAnalysis[]> {
    const results: PromiseSettledResult<AssetAnalysis>[] = [];

    // Stocks first — parallel, different domain
    const stockResults = await Promise.allSettled(
      WATCHLIST.filter((a) => a.type === 'stock').map((a) => this.runOne(a))
    );
    results.push(...stockResults);

    // Cryptos — sequential with 2s gap, CoinGecko free tier is sensitive to bursts
    for (const asset of WATCHLIST.filter((a) => a.type === 'crypto')) {
      const r = await this.runOne(asset)
        .then((v) => ({ status: 'fulfilled' as const, value: v }))
        .catch((e) => ({ status: 'rejected' as const, reason: e }));
      results.push(r);
      await delay(2000);
    }

    return results
      .filter((r): r is PromiseFulfilledResult<AssetAnalysis> => {
        if (r.status === 'rejected') console.error(`[ERROR]`, r.reason?.message ?? r.reason);
        return r.status === 'fulfilled';
      })
      .map((r) => r.value);
  }

  async runOne(asset: WatchedAsset): Promise<AssetAnalysis> {
    const prices =
      asset.type === 'crypto'
        ? await this.priceHistory.fetchCrypto(asset.coinGeckoId!)
        : await this.priceHistory.fetchStock(asset.yahooSymbol!);
    return this.tracker.analyze(asset.symbol, asset.name, prices);
  }
}
