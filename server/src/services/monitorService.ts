import cron from 'node-cron';
import { query } from '../database/db';
import { Asset, Alert, AlertCondition, AssetType } from '../types';
import priceService from './priceService';
import emailService from './emailService';

export class MonitorService {
  private isRunning = false;
  private cronJob: cron.ScheduledTask | null = null;

  /**
   * Start the price monitoring service
   */
  start(): void {
    if (this.isRunning) {
      console.log('Monitor service is already running');
      return;
    }

    // Default: Check every 5 minutes
    const schedule = process.env.PRICE_CHECK_INTERVAL || '*/5 * * * *';

    this.cronJob = cron.schedule(schedule, async () => {
      await this.checkAllPrices();
    });

    this.isRunning = true;
    console.log(`Monitor service started with schedule: ${schedule}`);

    // Run immediately on start
    this.checkAllPrices();
  }

  /**
   * Stop the monitoring service
   */
  stop(): void {
    if (this.cronJob) {
      this.cronJob.stop();
      this.cronJob = null;
    }
    this.isRunning = false;
    console.log('Monitor service stopped');
  }

  /**
   * Check prices for all assets with active alerts
   */
  async checkAllPrices(): Promise<void> {
    try {
      console.log('Checking prices for all assets...');

      // Get all assets with active alerts
      const result = await query(`
        SELECT DISTINCT a.*
        FROM assets a
        INNER JOIN alerts al ON a.id = al.asset_id
        WHERE al.is_active = true
      `);

      const assets = result.rows as Asset[];

      for (const asset of assets) {
        try {
          await this.checkAssetPrice(asset);

          // Add delay to respect API rate limits
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Error checking price for ${asset.symbol}:`, error);
        }
      }

      console.log('Price check completed');
    } catch (error) {
      console.error('Error in checkAllPrices:', error);
    }
  }

  /**
   * Check price for a specific asset and trigger alerts
   */
  async checkAssetPrice(asset: Asset): Promise<void> {
    try {
      // Fetch current price
      const priceData = await priceService.fetchPrice(
        asset.symbol,
        asset.type as AssetType
      );

      // Store price in history
      await query(
        'INSERT INTO price_history (asset_id, price, timestamp) VALUES ($1, $2, $3)',
        [asset.id, priceData.price, priceData.timestamp]
      );

      // Check active alerts
      const alertsResult = await query(
        'SELECT * FROM alerts WHERE asset_id = $1 AND is_active = true',
        [asset.id]
      );

      const alerts = alertsResult.rows as Alert[];

      for (const alert of alerts) {
        const shouldTrigger = this.shouldTriggerAlert(alert, priceData.price);

        if (shouldTrigger) {
          await this.triggerAlert(alert, asset, priceData.price);
        }
      }
    } catch (error) {
      console.error(`Error checking asset price for ${asset.symbol}:`, error);
      throw error;
    }
  }

  /**
   * Determine if an alert should be triggered
   */
  private shouldTriggerAlert(alert: Alert, currentPrice: number): boolean {
    if (alert.condition === AlertCondition.ABOVE) {
      return currentPrice >= alert.target_price;
    } else {
      return currentPrice <= alert.target_price;
    }
  }

  /**
   * Trigger an alert: send email and mark as triggered
   */
  private async triggerAlert(alert: Alert, asset: Asset, currentPrice: number): Promise<void> {
    try {
      // Send email notification
      await emailService.sendPriceAlert(alert, asset, currentPrice);

      // Mark alert as triggered and inactive
      await query(
        'UPDATE alerts SET is_active = false, triggered_at = CURRENT_TIMESTAMP WHERE id = $1',
        [alert.id]
      );

      console.log(`Alert ${alert.id} triggered for ${asset.symbol} at price ${currentPrice}`);
    } catch (error) {
      console.error(`Error triggering alert ${alert.id}:`, error);
      throw error;
    }
  }

  /**
   * Manually trigger a price check for a specific asset
   */
  async checkAssetById(assetId: number): Promise<void> {
    const result = await query('SELECT * FROM assets WHERE id = $1', [assetId]);

    if (result.rows.length === 0) {
      throw new Error(`Asset with id ${assetId} not found`);
    }

    const asset = result.rows[0] as Asset;
    await this.checkAssetPrice(asset);
  }

  /**
   * Get monitoring status
   */
  getStatus(): { isRunning: boolean; schedule: string } {
    return {
      isRunning: this.isRunning,
      schedule: process.env.PRICE_CHECK_INTERVAL || '*/5 * * * *'
    };
  }
}

export default new MonitorService();
