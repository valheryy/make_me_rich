import { Router, Request, Response } from 'express';
import { TrackerOrchestrator } from '../services/TrackerOrchestrator';
import { WATCHLIST } from '../config/watchlist';

const router = Router();
const orchestrator = new TrackerOrchestrator();

router.get('/', async (_req: Request, res: Response) => {
  try {
    res.json(await orchestrator.runAll());
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:symbol', async (req: Request, res: Response) => {
  const symbolParam = String(req.params['symbol']).toLowerCase();
  const asset = WATCHLIST.find((a) => a.symbol.toLowerCase() === symbolParam);
  if (!asset) {
    res.status(404).json({ error: 'Asset not found' });
    return;
  }
  try {
    res.json(await orchestrator.runOne(asset));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
