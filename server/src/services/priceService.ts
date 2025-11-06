import axios from 'axios';
import { AssetType, ApiPriceResponse } from '../types';

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const ALPHA_VANTAGE_BASE = 'https://www.alphavantage.co/query';
const COINGECKO_BASE = 'https://api.coingecko.com/api/v3';

// Mapping for CoinGecko IDs
const CRYPTO_ID_MAP: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'BNB': 'binancecoin',
  'ADA': 'cardano',
  'SOL': 'solana',
  'XRP': 'ripple',
  'DOT': 'polkadot',
  'DOGE': 'dogecoin',
  'AVAX': 'avalanche-2',
  'MATIC': 'matic-network'
};

export class PriceService {
  /**
   * Fetch current price for a stock or ETF using Alpha Vantage
   */
  async fetchStockPrice(symbol: string): Promise<ApiPriceResponse> {
    try {
      const response = await axios.get(ALPHA_VANTAGE_BASE, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol,
          apikey: ALPHA_VANTAGE_KEY
        }
      });

      const quote = response.data['Global Quote'];
      if (!quote || !quote['05. price']) {
        throw new Error(`No price data available for ${symbol}`);
      }

      return {
        symbol,
        price: parseFloat(quote['05. price']),
        timestamp: new Date()
      };
    } catch (error) {
      console.error(`Error fetching stock price for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Fetch current price for cryptocurrency using CoinGecko
   */
  async fetchCryptoPrice(symbol: string): Promise<ApiPriceResponse> {
    try {
      const coinId = CRYPTO_ID_MAP[symbol.toUpperCase()];
      if (!coinId) {
        throw new Error(`Unsupported crypto symbol: ${symbol}`);
      }

      const response = await axios.get(`${COINGECKO_BASE}/simple/price`, {
        params: {
          ids: coinId,
          vs_currencies: 'usd'
        }
      });

      const price = response.data[coinId]?.usd;
      if (!price) {
        throw new Error(`No price data available for ${symbol}`);
      }

      return {
        symbol,
        price: parseFloat(price),
        timestamp: new Date()
      };
    } catch (error) {
      console.error(`Error fetching crypto price for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Fetch historical prices for probability calculation
   */
  async fetchHistoricalPrices(symbol: string, type: AssetType, days: number = 180): Promise<number[]> {
    try {
      if (type === AssetType.CRYPTO) {
        return await this.fetchCryptoHistory(symbol, days);
      } else {
        return await this.fetchStockHistory(symbol, days);
      }
    } catch (error) {
      console.error(`Error fetching historical prices for ${symbol}:`, error);
      throw error;
    }
  }

  private async fetchStockHistory(symbol: string, days: number): Promise<number[]> {
    try {
      const response = await axios.get(ALPHA_VANTAGE_BASE, {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol: symbol,
          apikey: ALPHA_VANTAGE_KEY,
          outputsize: 'full'
        }
      });

      const timeSeries = response.data['Time Series (Daily)'];
      if (!timeSeries) {
        throw new Error(`No historical data for ${symbol}`);
      }

      const prices: number[] = [];
      const dates = Object.keys(timeSeries).sort().reverse().slice(0, days);

      for (const date of dates) {
        prices.push(parseFloat(timeSeries[date]['4. close']));
      }

      return prices;
    } catch (error) {
      console.error(`Error fetching stock history for ${symbol}:`, error);
      throw error;
    }
  }

  private async fetchCryptoHistory(symbol: string, days: number): Promise<number[]> {
    try {
      const coinId = CRYPTO_ID_MAP[symbol.toUpperCase()];
      if (!coinId) {
        throw new Error(`Unsupported crypto symbol: ${symbol}`);
      }

      const response = await axios.get(`${COINGECKO_BASE}/coins/${coinId}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days: days,
          interval: 'daily'
        }
      });

      const prices: number[] = response.data.prices.map((p: [number, number]) => p[1]);
      return prices;
    } catch (error) {
      console.error(`Error fetching crypto history for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Generic price fetcher based on asset type
   */
  async fetchPrice(symbol: string, type: AssetType): Promise<ApiPriceResponse> {
    if (type === AssetType.CRYPTO) {
      return await this.fetchCryptoPrice(symbol);
    } else {
      return await this.fetchStockPrice(symbol);
    }
  }
}

export default new PriceService();
