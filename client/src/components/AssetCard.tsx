import { useState } from 'react';
import { Asset, PriceData, ProbabilityAnalysis } from '../types';

interface AssetCardProps {
  asset: Asset;
  price?: PriceData;
  probability?: ProbabilityAnalysis;
  onRefresh: () => void;
  onCreateAlert: (asset: Asset) => void;
}

export default function AssetCard({ asset, price, probability, onRefresh, onCreateAlert }: AssetCardProps) {
  const [loading, setLoading] = useState(false);

  const getAssetTypeColor = (type: string) => {
    switch (type) {
      case 'STOCK': return 'bg-blue-100 text-blue-800';
      case 'ETF': return 'bg-green-100 text-green-800';
      case 'CRYPTO': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProbabilityColor = (prob: number) => {
    if (prob >= 0.5) return 'text-green-600';
    if (prob >= 0.3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleRefresh = async () => {
    setLoading(true);
    await onRefresh();
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{asset.symbol}</h3>
          <p className="text-sm text-gray-600">{asset.name}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getAssetTypeColor(asset.type)}`}>
          {asset.type}
        </span>
      </div>

      {price && (
        <div className="mb-4">
          <div className="text-3xl font-bold text-gray-900">
            ${price.price.toFixed(2)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            更新于: {new Date(price.timestamp).toLocaleString('zh-CN')}
          </div>
        </div>
      )}

      {probability && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mb-4">
          <div className="text-sm text-gray-600 mb-2">半年涨30%以上概率</div>
          <div className={`text-2xl font-bold ${getProbabilityColor(probability.probability)}`}>
            {(probability.probability * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-2">
            波动率: {(probability.historical_volatility * 100).toFixed(2)}%
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? '刷新中...' : '刷新价格'}
        </button>
        <button
          onClick={() => onCreateAlert(asset)}
          className="flex-1 bg-white border-2 border-indigo-600 text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-50 transition-colors"
        >
          设置预警
        </button>
      </div>
    </div>
  );
}
