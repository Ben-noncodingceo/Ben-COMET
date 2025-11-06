import { useState, useEffect } from 'react';
import { Alert } from '../types';
import { alertsApi } from '../api';

export default function AlertList() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'triggered'>('all');

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const activeFilter = filter === 'active' ? true : filter === 'triggered' ? false : undefined;
      const response = await alertsApi.getAll(undefined, activeFilter);
      setAlerts(response.data);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [filter]);

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个预警吗？')) return;

    try {
      await alertsApi.delete(id);
      loadAlerts();
    } catch (error) {
      console.error('Failed to delete alert:', error);
    }
  };

  const handleToggle = async (alert: Alert) => {
    try {
      await alertsApi.update(alert.id, { is_active: !alert.is_active });
      loadAlerts();
    } catch (error) {
      console.error('Failed to toggle alert:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">我的预警</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            全部
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-md ${filter === 'active' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            活跃
          </button>
          <button
            onClick={() => setFilter('triggered')}
            className={`px-4 py-2 rounded-md ${filter === 'triggered' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
          >
            已触发
          </button>
        </div>
      </div>

      {alerts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">暂无预警</p>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg">{alert.symbol}</span>
                    <span className={`px-2 py-1 rounded text-xs ${alert.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {alert.is_active ? '活跃' : '已触发'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>条件: 当价格{alert.condition === 'ABOVE' ? '高于' : '低于'} ${alert.target_price}</div>
                    <div>邮箱: {alert.user_email}</div>
                    {alert.triggered_at && (
                      <div>触发时间: {new Date(alert.triggered_at).toLocaleString('zh-CN')}</div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {alert.is_active && (
                    <button
                      onClick={() => handleToggle(alert)}
                      className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                    >
                      停用
                    </button>
                  )}
                  {!alert.is_active && !alert.triggered_at && (
                    <button
                      onClick={() => handleToggle(alert)}
                      className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200"
                    >
                      启用
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
