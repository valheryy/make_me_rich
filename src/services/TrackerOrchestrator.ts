import { WATCHLIST, WatchedAsset } from "../config/watchlist";
import { PriceHistoryService } from "./PriceHistoryService";
import { AverageTrackerService, AssetAnalysis } from "./AverageTrackerService";

export class TrackerOrchestrator {
  private priceHistory = new PriceHistoryService();
  private tracker = new AverageTrackerService();

  async runAll(): Promise<AssetAnalysis[]> {
    const results: AssetAnalysis[] = [];
    for (const asset of WATCHLIST) {
      try {
        const analysis = await this.runOne(asset);
        results.push(analysis);
      } catch (err: any) {
        console.error(`  [ERROR] ${asset.symbol}: ${err.message}`);
      }
    }
    return results;
  }

  async runOne(asset: WatchedAsset): Promise<AssetAnalysis> {
    const prices =
      asset.type === "crypto"
        ? await this.priceHistory.fetchCrypto(asset.coinGeckoId!)
        : await this.priceHistory.fetchStock(asset.symbol);

    return this.tracker.analyze(asset.symbol, asset.name, prices);
  }
}
