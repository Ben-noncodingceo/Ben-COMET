import { Router, Request, Response } from 'express';
import { query } from '../database/db';
import { Asset, AssetType } from '../types';
import priceService from '../services/priceService';
import probabilityService from '../services/probabilityService';

const router = Router();

/**
 * GET /api/assets - Get all assets
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM assets ORDER BY symbol');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
});

/**
 * GET /api/assets/:id - Get asset by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM assets WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching asset:', error);
    res.status(500).json({ error: 'Failed to fetch asset' });
  }
});

/**
 * POST /api/assets - Create new asset
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { symbol, name, type } = req.body;

    if (!symbol || !name || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!Object.values(AssetType).includes(type)) {
      return res.status(400).json({ error: 'Invalid asset type' });
    }

    const result = await query(
      'INSERT INTO assets (symbol, name, type) VALUES ($1, $2, $3) RETURNING *',
      [symbol.toUpperCase(), name, type]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'Asset with this symbol already exists' });
    }
    console.error('Error creating asset:', error);
    res.status(500).json({ error: 'Failed to create asset' });
  }
});

/**
 * GET /api/assets/:id/price - Get current price for an asset
 */
router.get('/:id/price', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Get asset
    const assetResult = await query('SELECT * FROM assets WHERE id = $1', [id]);
    if (assetResult.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    const asset = assetResult.rows[0] as Asset;

    // Fetch current price
    const priceData = await priceService.fetchPrice(
      asset.symbol,
      asset.type as AssetType
    );

    // Store in history
    await query(
      'INSERT INTO price_history (asset_id, price, timestamp) VALUES ($1, $2, $3)',
      [asset.id, priceData.price, priceData.timestamp]
    );

    res.json(priceData);
  } catch (error) {
    console.error('Error fetching price:', error);
    res.status(500).json({ error: 'Failed to fetch price' });
  }
});

/**
 * GET /api/assets/:id/history - Get price history for an asset
 */
router.get('/:id/history', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { days = 30 } = req.query;

    const result = await query(
      `SELECT * FROM price_history
       WHERE asset_id = $1
       AND timestamp > NOW() - INTERVAL '${parseInt(days as string)} days'
       ORDER BY timestamp DESC`,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching price history:', error);
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
});

/**
 * GET /api/assets/:id/probability - Get probability analysis
 */
router.get('/:id/probability', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { targetIncrease = 0.30 } = req.query;

    // Get asset
    const assetResult = await query('SELECT * FROM assets WHERE id = $1', [id]);
    if (assetResult.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    const asset = assetResult.rows[0] as Asset;

    // Calculate probability
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
 * DELETE /api/assets/:id - Delete an asset
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM assets WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    res.json({ message: 'Asset deleted successfully' });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ error: 'Failed to delete asset' });
  }
});

export default router;
