import { Injectable, inject, signal } from '@angular/core';
import { CoingeckoService } from './coingecko.service';
import { AssetAnalysis, MonthlyPrice, SignalLevel, STRATEGY, WATCHLIST } from '../models/asset.model';

@Injectable({ providedIn: 'root' })
export class TrackerService {
  private coingecko = inject(CoingeckoService);

  assets  = signal<AssetAnalysis[]>([]);
  loading = signal(false);
  error   = signal('');

  async loadAll(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    const results: AssetAnalysis[] = [];

    for (const asset of WATCHLIST) {
      try {
        const history = await this.coingecko.fetchHistory(asset.id);
        results.push(this.analyze(asset, history));
      } catch (e: any) {
        this.error.set(`Failed to load ${asset.name}: ${e.message}`);
      }
    }

    this.assets.set(results);
    this.loading.set(false);
  }

  private analyze(
    asset: { id: string; symbol: string; name: string },
    history: MonthlyPrice[]
  ): AssetAnalysis {
    const { avgMonths, buyThreshold, sellThreshold } = STRATEGY;

    const window = history.slice(-avgMonths);
    const avg48  = window.reduce((s, p) => s + p.close, 0) / window.length;
    const latest = history[history.length - 1];
    const deviation = (latest.close - avg48) / avg48;
    const signal = this.toSignal(deviation, buyThreshold, sellThreshold);

    return {
      id: asset.id,
      symbol: asset.symbol,
      name: asset.name,
      currentPrice: latest.close,
      avg48,
      deviation,
      signal,
      action: this.toAction(signal, deviation),
      history,
    };
  }

  private toSignal(dev: number, buy: number, sell: number): SignalLevel {
    if (dev <= -buy  * 1.5) return 'STRONG_BUY';
    if (dev <= -buy)        return 'BUY';
    if (dev >= sell  * 1.5) return 'STRONG_SELL';
    if (dev >= sell)        return 'SELL';
    return 'HOLD';
  }

  private toAction(signal: SignalLevel, deviation: number): string {
    const pct = (Math.abs(deviation) * 100).toFixed(1);
    switch (signal) {
      case 'STRONG_BUY':  return `${pct}% below 48m avg — strong buy`;
      case 'BUY':         return `${pct}% below 48m avg — buy 20%`;
      case 'STRONG_SELL': return `${pct}% above 48m avg — strong sell`;
      case 'SELL':        return `${pct}% above 48m avg — sell 20%`;
      case 'HOLD':        return `${deviation >= 0 ? '+' : ''}${(deviation * 100).toFixed(1)}% vs 48m avg — hold`;
    }
  }
}
