import { Router, Request, Response } from 'express';
import { query } from '../database/db';
import { Alert, AlertCondition } from '../types';

const router = Router();

/**
 * GET /api/alerts - Get all alerts
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { email, active } = req.query;

    let queryText = `
      SELECT al.*, a.symbol, a.name, a.type
      FROM alerts al
      INNER JOIN assets a ON al.asset_id = a.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (email) {
      params.push(email);
      queryText += ` AND al.user_email = $${params.length}`;
    }

    if (active !== undefined) {
      params.push(active === 'true');
      queryText += ` AND al.is_active = $${params.length}`;
    }

    queryText += ' ORDER BY al.created_at DESC';

    const result = await query(queryText, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

/**
 * GET /api/alerts/:id - Get alert by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT al.*, a.symbol, a.name, a.type
       FROM alerts al
       INNER JOIN assets a ON al.asset_id = a.id
       WHERE al.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching alert:', error);
    res.status(500).json({ error: 'Failed to fetch alert' });
  }
});

/**
 * POST /api/alerts - Create new alert
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const { asset_id, user_email, condition, target_price } = req.body;

    // Validate required fields
    if (!asset_id || !user_email || !condition || !target_price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user_email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate condition
    if (!Object.values(AlertCondition).includes(condition)) {
      return res.status(400).json({ error: 'Invalid condition. Must be ABOVE or BELOW' });
    }

    // Validate target price
    if (isNaN(target_price) || target_price <= 0) {
      return res.status(400).json({ error: 'Invalid target price' });
    }

    // Check if asset exists
    const assetResult = await query('SELECT * FROM assets WHERE id = $1', [asset_id]);
    if (assetResult.rows.length === 0) {
      return res.status(404).json({ error: 'Asset not found' });
    }

    // Create alert
    const result = await query(
      `INSERT INTO alerts (asset_id, user_email, condition, target_price)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [asset_id, user_email, condition, target_price]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating alert:', error);
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

/**
 * PUT /api/alerts/:id - Update an alert
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { condition, target_price, is_active } = req.body;

    // Build update query dynamically
    const updates: string[] = [];
    const params: any[] = [];

    if (condition !== undefined) {
      if (!Object.values(AlertCondition).includes(condition)) {
        return res.status(400).json({ error: 'Invalid condition' });
      }
      params.push(condition);
      updates.push(`condition = $${params.length}`);
    }

    if (target_price !== undefined) {
      if (isNaN(target_price) || target_price <= 0) {
        return res.status(400).json({ error: 'Invalid target price' });
      }
      params.push(target_price);
      updates.push(`target_price = $${params.length}`);
    }

    if (is_active !== undefined) {
      params.push(is_active);
      updates.push(`is_active = $${params.length}`);

      // Reset triggered_at if reactivating
      if (is_active) {
        updates.push('triggered_at = NULL');
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(id);
    const queryText = `
      UPDATE alerts
      SET ${updates.join(', ')}
      WHERE id = $${params.length}
      RETURNING *
    `;

    const result = await query(queryText, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating alert:', error);
    res.status(500).json({ error: 'Failed to update alert' });
  }
});

/**
 * DELETE /api/alerts/:id - Delete an alert
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM alerts WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Error deleting alert:', error);
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

/**
 * POST /api/alerts/:id/test - Test an alert by sending a test email
 */
router.post('/:id/test', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT al.*, a.symbol, a.name, a.type
       FROM alerts al
       INNER JOIN assets a ON al.asset_id = a.id
       WHERE al.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alert not found' });
    }

    const alert = result.rows[0];

    // Import here to avoid circular dependency
    const emailService = (await import('../services/emailService')).default;

    await emailService.sendPriceAlert(
      alert,
      { id: alert.asset_id, symbol: alert.symbol, name: alert.name, type: alert.type, created_at: alert.created_at },
      alert.target_price
    );

    res.json({ message: 'Test email sent successfully' });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({ error: 'Failed to send test email' });
  }
});

export default router;
