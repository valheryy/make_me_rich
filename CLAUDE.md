# make_me_rich — Project Context for Claude

## What this app does
Tracks cyclic stocks and cryptos using Charlie Munger's 48-month moving average strategy.
Shows buy/sell signals based on deviation from the 4-year average price.

## Strategy rules
- **48-month (4-year) simple moving average** is the reference price
- Price **+20% above avg** → SELL signal (sell 20% of holding)
- Price **+30%+ above avg** → STRONG_SELL
- Price **-20% below avg** → BUY signal (buy 20% of target position)
- Price **-30%+ below avg** → STRONG_BUY
- Parameters are in `backend/src/config/watchlist.ts` under `STRATEGY`

## Tracked assets
Configured in `backend/src/config/watchlist.ts`:
- **S&P 500** (`^GSPC`) — Stooq: `^spx`
- **Microsoft** (`MSFT`) — Stooq: `msft.us`
- **Ethereum** (`ETH`) — CoinGecko: `ethereum`
- **Zcash** (`ZEC`) — CoinGecko: `zcash`
- **XRP** (`XRP`) — CoinGecko: `ripple`

To add a stock: add a `stooqSymbol` entry (find ticker at stooq.com).
To add a crypto: add a `coinGeckoId` entry (find id at coingecko.com/coins list).

## Data sources
- **Stocks**: Stooq CSV API — free, no key, monthly OHLCV
  - URL pattern: `https://stooq.com/q/d/l/?s={symbol}&i=m`
- **Crypto**: CoinGecko `/market_chart` — free, no key, daily history downsampled to monthly
  - CoinGecko calls are sequential with 2s delay to avoid rate limiting

## Important: no live/realtime data
The app does NOT fetch live prices. It uses the most recent monthly close from each source.
This is intentional — data only needs to be loaded once a day (or on startup).

## No caching
Data is fetched fresh on every request. No cache files, no timers, no background jobs.
Open the app → it fetches → displays. That's it. Do NOT add caching.

## Architecture
```
backend/          Express + TypeScript (port 3000)
  src/
    config/watchlist.ts         — asset list + strategy thresholds
    services/
      PriceHistoryService.ts    — Stooq (stocks) + CoinGecko (crypto) fetchers
      AverageTrackerService.ts  — 48m SMA calculation + signal logic
      TrackerOrchestrator.ts    — coordinates fetching for all assets
    routes/assets.ts            — GET /api/assets, POST /api/assets/refresh
    server.ts

frontend/         Angular (port 4200)
  src/app/
    models/asset.model.ts
    services/asset.service.ts
    components/asset-card/      — card per asset showing price, avg, deviation, signal
    app.ts / app.html / app.scss
```

## How to run
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npx ng serve
```
Open `http://localhost:4200`

## User preferences
- No live/realtime data needed
- No automation — this is a read-only tracking dashboard
- No external paid APIs or API keys
- Keep API calls minimal to avoid rate limiting
- Data accuracy matters — verify prices against real sources when debugging
