import { useState, useEffect } from 'react';
import { Asset, PriceData, ProbabilityAnalysis } from './types';
import { assetsApi } from './api';
import AssetCard from './components/AssetCard';
import AlertForm from './components/AlertForm';
import AlertList from './components/AlertList';

function App() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [prices, setPrices] = useState<Record<number, PriceData>>({});
  const [probabilities, setProbabilities] = useState<Record<number, ProbabilityAnalysis>>({});
  const [loading, setLoading] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'assets' | 'alerts'>('assets');

  const loadAssets = async () => {
    try {
      const response = await assetsApi.getAll();
      setAssets(response.data);
    } catch (error) {
      console.error('Failed to load assets:', error);
    }
  };

  const loadAssetData = async (asset: Asset) => {
    try {
      // Load price
      const priceResponse = await assetsApi.getPrice(asset.id);
      setPrices(prev => ({ ...prev, [asset.id]: priceResponse.data }));

      // Load probability
      const probResponse = await assetsApi.getProbability(asset.id, 0.30);
      setProbabilities(prev => ({ ...prev, [asset.id]: probResponse.data }));
    } catch (error) {
      console.error(`Failed to load data for ${asset.symbol}:`, error);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await loadAssets();
    setLoading(false);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  useEffect(() => {
    // Load data for each asset with delay to respect API rate limits
    assets.forEach((asset, index) => {
      setTimeout(() => {
        loadAssetData(asset);
      }, index * 1500);
    });
  }, [assets]);

  const handleRefreshAsset = async (asset: Asset) => {
    await loadAssetData(asset);
  };

  const handleCreateAlert = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowAlertForm(true);
  };

  const handleAlertSuccess = () => {
    setShowAlertForm(false);
    setSelectedAsset(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Ben-COMET 金融监控系统
            </h1>
            <p className="text-gray-600">
              实时监控股票、ETF、数字货币价格，智能预警与概率分析
            </p>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'assets'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            资产监控
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              activeTab === 'alerts'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            我的预警
          </button>
        </div>

        {/* Content */}
        {activeTab === 'assets' && (
          <>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-600">加载中...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assets.map((asset) => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    price={prices[asset.id]}
                    probability={probabilities[asset.id]}
                    onRefresh={() => handleRefreshAsset(asset)}
                    onCreateAlert={handleCreateAlert}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'alerts' && <AlertList />}

        {/* Alert Form Modal */}
        {showAlertForm && (
          <AlertForm
            asset={selectedAsset || undefined}
            onSuccess={handleAlertSuccess}
            onCancel={() => setShowAlertForm(false)}
          />
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2024 Ben-COMET. All rights reserved.</p>
          <p className="mt-2">数据更新间隔: 5分钟 | 概率分析基于180天历史数据</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
