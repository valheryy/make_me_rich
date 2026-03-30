export interface WatchedAsset {
    symbol: string;         // ticker used by the data provider
    name: string;
    type: "stock" | "crypto";
    coinGeckoId?: string;   // only for crypto
}

export const WATCHLIST: WatchedAsset[] = [
    // Stocks / ETFs
    {symbol: "^GSPC", name: "S&P 500", type: "stock"},
    {symbol: "MSFT", name: "Microsoft", type: "stock"},

    // Crypto  (coinGeckoId is the CoinGecko coin ID)
    {symbol: "ETH", name: "Ethereum", type: "crypto", coinGeckoId: "ethereum"},
    {symbol: "ZEC", name: "Zcash", type: "crypto", coinGeckoId: "zcash"},
    {symbol: "XRP", name: "XRP", type: "crypto", coinGeckoId: "ripple"},
    {symbol: "DOGE", name: "Zcash", type: "crypto", coinGeckoId: "doge"},
    {symbol: "ADA", name: "Cardano", type: "crypto", coinGeckoId: "cardano"},
];

// Strategy parameters (Charlie Munger 48-month avg approach)
export const STRATEGY = {
    avgMonths: 48,       // moving-average window
    sellThreshold: 0.20, // sell signal when price > avg * (1 + this)
    buyThreshold: 0.20, // buy  signal when price < avg * (1 - this)
};
