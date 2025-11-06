import { Router, Request, Response } from 'express';
import probabilityService from '../services/probabilityService';
import { query } from '../database/db';
import { Asset } from '../types';

const router = Router();

/**
 * GET /api/probability - Calculate probabilities for all assets
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { targetIncrease = 0.30 } = req.query;

    const probabilities = await probabilityService.calculateAllProbabilities(
      parseFloat(targetIncrease as string)
    );

    res.json(probabilities);
  } catch (error) {
    console.error('Error calculating probabilities:', error);
    res.status(500).json({ error: 'Failed to calculate probabilities' });
  }
});

/**
 * GET /api/probability/:assetId - Get probability for specific asset
 */
router.get('/:assetId', async (req: Request, res: Response) => {
  try {
    const { assetId } = req.params;
    const { targetIncrease = 0.30 } = req.query;

    // Get asset
    const assetResult = await query('SELECT * FROM assets WHERE id = $1', [assetId]);
    if (assetResult.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    const asset = assetResult.rows[0] as Asset;

    const probability = await probabilityService.getProbability(
      asset,
      parseFloat(targetIncrease as string)
    );

    res.json(probability);
  } catch (error) {
    console.error('Error calculating probability:', error);
    res.status(500).json({ error: 'Failed to calculate probability' });
  }
});

/**
 * POST /api/probability/:assetId/calculate - Force recalculate probability
 */
router.post('/:assetId/calculate', async (req: Request, res: Response) => {
  try {
    const { assetId } = req.params;
    const { targetIncrease = 0.30 } = req.body;

    // Get asset
    const assetResult = await query('SELECT * FROM assets WHERE id = $1', [assetId]);
    if (assetResult.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    const asset = assetResult.rows[0] as Asset;

    // Force recalculation (bypasses cache)
    const probability = await probabilityService.calculateProbability(
      asset,
      parseFloat(targetIncrease as string)
    );

    res.json(probability);
  } catch (error) {
    console.error('Error calculating probability:', error);
    res.status(500).json({ error: 'Failed to calculate probability' });
  }
});

export default router;
