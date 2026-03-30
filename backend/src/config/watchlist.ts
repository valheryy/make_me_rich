export interface WatchedAsset {
  symbol: string;
  name: string;
  type: 'stock' | 'crypto';
  yahooSymbol?: string;  // Yahoo Finance ticker (stocks)
  coinGeckoId?: string;  // CoinGecko slug (crypto) — find at coingecko.com
}

export const WATCHLIST: WatchedAsset[] = [
  // { symbol: '^GSPC', name: 'S&P 500',   type: 'stock',  yahooSymbol: '^GSPC' },
  // { symbol: 'MSFT',  name: 'Microsoft', type: 'stock',  yahooSymbol: 'MSFT'  },
  { symbol: 'ETH',   name: 'Ethereum',  type: 'crypto', coinGeckoId: 'ethereum' },
  { symbol: 'ZEC',   name: 'Zcash',     type: 'crypto', coinGeckoId: 'zcash'    },
  { symbol: 'XRP',   name: 'XRP',       type: 'crypto', coinGeckoId: 'ripple'   },
  { symbol: 'DOGE',   name: 'Dogecoin',  type: 'crypto', coinGeckoId: 'dogecoin' },
  { symbol: 'ADA',   name: 'cardano',     type: 'crypto', coinGeckoId: 'cardano'  },
];

export const STRATEGY = {
  avgMonths:     48,
  sellThreshold: 0.20,
  buyThreshold:  0.20,
};
