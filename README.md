# Munger Tracker — 48-Month Moving Average Strategy

Track cyclic stocks and cryptocurrencies using a Charlie Munger-inspired 48-month simple moving average strategy.

## Project Structure

```
make_me_rich/
├── backend/    ← Express API (TypeScript, port 3000)
└── frontend/   ← Angular app (port 4200)
```

## How to Run

### Terminal 1 — Backend
```bash
cd backend
npm run dev
```

### Terminal 2 — Frontend
```bash
cd frontend
ng serve
```

Then open your browser at **http://localhost:4200**

---

## Strategy: 48-Month Simple Moving Average

| Signal      | Condition                          | Suggested Action              |
|-------------|------------------------------------|-------------------------------|
| STRONG BUY  | Price > 30% below 48m average      | Consider 20% position size    |
| BUY         | Price 20–30% below 48m average     | Buy 20% of target allocation  |
| HOLD        | Price within ±20% of 48m average   | Hold current position         |
| SELL        | Price 20–30% above 48m average     | Sell 20% of current holding   |
| STRONG SELL | Price > 30% above 48m average      | Reduce position by 20%        |

The strategy uses a 48-month (4-year) simple moving average as the benchmark. Assets trading significantly below their long-term average represent buying opportunities; assets significantly above represent selling opportunities.

## Watchlist

| Symbol | Name      | Type   |
|--------|-----------|--------|
| ^GSPC  | S&P 500   | Stock  |
| MSFT   | Microsoft | Stock  |
| ETH    | Ethereum  | Crypto |
| ZEC    | Zcash     | Crypto |
| XRP    | XRP       | Crypto |

## API Endpoints

- `GET http://localhost:3000/api/assets` — All assets (15-minute cache)
- `GET http://localhost:3000/api/assets/:symbol` — Single asset (live)

## Data Sources

- **Stocks**: Yahoo Finance (via `yahoo-finance2`)
- **Crypto**: CoinGecko public API

## Build

```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npx ng build
```
