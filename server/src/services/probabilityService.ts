import { Asset, AssetType, ProbabilityAnalysis } from '../types';
import priceService from './priceService';
import { query } from '../database/db';

export class ProbabilityService {
  /**
   * Calculate probability of 30% increase in 6 months using Monte Carlo simulation
   * Based on historical volatility and drift
   */
  async calculateProbability(
    asset: Asset,
    targetIncrease: number = 0.30,
    daysAhead: number = 180
  ): Promise<ProbabilityAnalysis> {
    try {
      // Fetch historical prices (last 180 days)
      const historicalPrices = await priceService.fetchHistoricalPrices(
        asset.symbol,
        asset.type as AssetType,
        180
      );

      if (historicalPrices.length < 30) {
        throw new Error('Insufficient historical data for probability calculation');
      }

      // Calculate daily returns
      const returns: number[] = [];
      for (let i = 1; i < historicalPrices.length; i++) {
        const dailyReturn = (historicalPrices[i] - historicalPrices[i - 1]) / historicalPrices[i - 1];
        returns.push(dailyReturn);
      }

      // Calculate mean (drift) and standard deviation (volatility)
      const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
      const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
      const stdDev = Math.sqrt(variance);

      // Annualized metrics
      const annualizedReturn = mean * 252; // 252 trading days
      const annualizedVolatility = stdDev * Math.sqrt(252);

      // Get current price
      const currentPriceData = await priceService.fetchPrice(asset.symbol, asset.type as AssetType);
      const currentPrice = currentPriceData.price;

      // Monte Carlo simulation
      const numSimulations = 10000;
      const targetPrice = currentPrice * (1 + targetIncrease);
      let successCount = 0;

      for (let i = 0; i < numSimulations; i++) {
        let price = currentPrice;

        // Simulate price movement over the period
        for (let day = 0; day < daysAhead; day++) {
          // Generate random number from normal distribution
          const randomShock = this.randomNormal(0, 1);

          // Geometric Brownian Motion
          const dailyReturn = (annualizedReturn / 252) +
                             (annualizedVolatility / Math.sqrt(252)) * randomShock;

          price *= (1 + dailyReturn);
        }

        if (price >= targetPrice) {
          successCount++;
        }
      }

      const probability = successCount / numSimulations;

      // Cache the result
      await this.cacheProbability(asset.id, targetIncrease, probability, annualizedVolatility);

      return {
        asset_id: asset.id,
        symbol: asset.symbol,
        current_price: currentPrice,
        target_increase: targetIncrease,
        probability: probability,
        historical_volatility: annualizedVolatility,
        calculated_at: new Date()
      };
    } catch (error) {
      console.error(`Error calculating probability for ${asset.symbol}:`, error);
      throw error;
    }
  }

  /**
   * Generate random number from standard normal distribution
   * Using Box-Muller transform
   */
  private randomNormal(mean: number = 0, stdDev: number = 1): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stdDev + mean;
  }

  /**
   * Cache probability calculation in database
   */
  private async cacheProbability(
    assetId: number,
    targetIncrease: number,
    probability: number,
    volatility: number
  ): Promise<void> {
    await query(
      `INSERT INTO probability_cache (asset_id, target_increase, probability, historical_volatility, calculated_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       ON CONFLICT (asset_id, target_increase)
       DO UPDATE SET
         probability = $3,
         historical_volatility = $4,
         calculated_at = CURRENT_TIMESTAMP`,
      [assetId, targetIncrease, probability, volatility]
    );
  }

  /**
   * Get cached probability or calculate if stale
   */
  async getProbability(asset: Asset, targetIncrease: number = 0.30): Promise<ProbabilityAnalysis> {
    // Try to get from cache (if calculated in last 24 hours)
    const cacheResult = await query(
      `SELECT * FROM probability_cache
       WHERE asset_id = $1 AND target_increase = $2
       AND calculated_at > NOW() - INTERVAL '24 hours'`,
      [asset.id, targetIncrease]
    );

    if (cacheResult.rows.length > 0) {
      const cached = cacheResult.rows[0];

      // Get current price
      const currentPriceData = await priceService.fetchPrice(asset.symbol, asset.type as AssetType);

      return {
        asset_id: asset.id,
        symbol: asset.symbol,
        current_price: currentPriceData.price,
        target_increase: targetIncrease,
        probability: parseFloat(cached.probability),
        historical_volatility: parseFloat(cached.historical_volatility),
        calculated_at: cached.calculated_at
      };
    }

    // Calculate if not in cache or stale
    return await this.calculateProbability(asset, targetIncrease);
  }

  /**
   * Calculate probabilities for all assets
   */
  async calculateAllProbabilities(targetIncrease: number = 0.30): Promise<ProbabilityAnalysis[]> {
    const assetsResult = await query('SELECT * FROM assets ORDER BY symbol');
    const assets = assetsResult.rows as Asset[];

    const probabilities: ProbabilityAnalysis[] = [];

    for (const asset of assets) {
      try {
        const prob = await this.getProbability(asset, targetIncrease);
        probabilities.push(prob);

        // Add delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to calculate probability for ${asset.symbol}:`, error);
      }
    }

    return probabilities;
  }
}

export default new ProbabilityService();
