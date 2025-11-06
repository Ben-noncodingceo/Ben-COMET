import { useState } from 'react';
import { Asset, AlertCondition } from '../types';
import { alertsApi } from '../api';

interface AlertFormProps {
  asset?: Asset;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AlertForm({ asset, onSuccess, onCancel }: AlertFormProps) {
  const [email, setEmail] = useState('');
  const [condition, setCondition] = useState<AlertCondition>(AlertCondition.ABOVE);
  const [targetPrice, setTargetPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!asset) {
        throw new Error('请选择一个资产');
      }

      await alertsApi.create({
        asset_id: asset.id,
        user_email: email,
        condition,
        target_price: parseFloat(targetPrice),
      });

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || '创建预警失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">创建价格预警</h2>

        {asset && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="font-semibold">{asset.symbol}</div>
            <div className="text-sm text-gray-600">{asset.name}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              邮箱地址
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              预警条件
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as AlertCondition)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={AlertCondition.ABOVE}>高于目标价格</option>
              <option value={AlertCondition.BELOW}>低于目标价格</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              目标价格 (USD)
            </label>
            <input
              type="number"
              step="0.01"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              required
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="0.00"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? '创建中...' : '创建预警'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
