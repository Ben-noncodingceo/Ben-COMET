import { Router, Request, Response } from 'express';
import monitorService from '../services/monitorService';

const router = Router();

/**
 * GET /api/monitor/status - Get monitoring service status
 */
router.get('/status', (req: Request, res: Response) => {
  try {
    const status = monitorService.getStatus();
    res.json(status);
  } catch (error) {
    console.error('Error getting monitor status:', error);
    res.status(500).json({ error: 'Failed to get monitor status' });
  }
});

/**
 * POST /api/monitor/start - Start monitoring service
 */
router.post('/start', (req: Request, res: Response) => {
  try {
    monitorService.start();
    res.json({ message: 'Monitor service started', status: monitorService.getStatus() });
  } catch (error) {
    console.error('Error starting monitor:', error);
    res.status(500).json({ error: 'Failed to start monitor service' });
  }
});

/**
 * POST /api/monitor/stop - Stop monitoring service
 */
router.post('/stop', (req: Request, res: Response) => {
  try {
    monitorService.stop();
    res.json({ message: 'Monitor service stopped' });
  } catch (error) {
    console.error('Error stopping monitor:', error);
    res.status(500).json({ error: 'Failed to stop monitor service' });
  }
});

/**
 * POST /api/monitor/check - Manually trigger price check for all assets
 */
router.post('/check', async (req: Request, res: Response) => {
  try {
    await monitorService.checkAllPrices();
    res.json({ message: 'Price check completed' });
  } catch (error) {
    console.error('Error checking prices:', error);
    res.status(500).json({ error: 'Failed to check prices' });
  }
});

/**
 * POST /api/monitor/check/:assetId - Manually trigger price check for specific asset
 */
router.post('/check/:assetId', async (req: Request, res: Response) => {
  try {
    const { assetId } = req.params;
    await monitorService.checkAssetById(parseInt(assetId));
    res.json({ message: `Price check completed for asset ${assetId}` });
  } catch (error) {
    console.error('Error checking asset price:', error);
    res.status(500).json({ error: 'Failed to check asset price' });
  }
});

export default router;
