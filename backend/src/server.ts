import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());

// Proxy Binance monthly OHLC — free, no key, no CORS issues from server side
// Returns 60 monthly candles (5 years) for a given symbol e.g. ETHUSDT
app.get('/api/history/:symbol', async (req, res) => {
  try {
    const { data } = await axios.get('https://api.binance.com/api/v3/klines', {
      params: { symbol: req.params['symbol'], interval: '1M', limit: 60 },
    });
    res.json(data);
  } catch (err: any) {
    res.status(err.response?.status ?? 500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Proxy running on http://localhost:3000'));
