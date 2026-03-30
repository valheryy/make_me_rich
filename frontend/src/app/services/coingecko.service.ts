import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { MonthlyPrice } from '../models/asset.model';

// Binance kline format: [openTime, open, high, low, close, volume, closeTime, ...]
type Kline = [number, string, string, string, string, ...unknown[]];

@Injectable({ providedIn: 'root' })
export class CoingeckoService {
  private http = inject(HttpClient);

  async fetchHistory(binanceSymbol: string): Promise<MonthlyPrice[]> {
    const klines = await firstValueFrom(
      this.http.get<Kline[]>(`http://localhost:3000/api/history/${binanceSymbol}`)
    );

    return klines.map(k => ({
      date: new Date(k[0]).toISOString().split('T')[0],
      close: parseFloat(k[4]),
    }));
  }
}
