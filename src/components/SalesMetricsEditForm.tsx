import React, { useState } from 'react';

interface SalesMetrics {
  clicks: number;
  sales: number;
  commissions: number;
  ctr: number;
}

interface SalesMetricsEditFormProps {
  currentMetrics: SalesMetrics | null;
  onSave: (metrics: SalesMetrics) => void;
  onCancel: () => void;
}

export function SalesMetricsEditForm({ currentMetrics, onSave, onCancel }: SalesMetricsEditFormProps) {
  const [metrics, setMetrics] = useState<SalesMetrics>(currentMetrics || {
    clicks: 0,
    sales: 0,
    commissions: 0,
    ctr: 0
  });

  const handleInputChange = (field: keyof SalesMetrics, value: string) => {
    const numValue = parseInt(value) || 0;
    setMetrics(prev => ({
      ...prev,
      [field]: numValue
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(metrics);
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-6">Edit Sales Metrics</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="clicks" className="block text-sm font-medium text-white mb-2">
                Clicks
              </label>
              <input
                type="number"
                id="clicks"
                value={metrics.clicks}
                onChange={(e) => handleInputChange('clicks', e.target.value)}
                className="w-full px-3 py-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent bg-black text-white"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="ctr" className="block text-sm font-medium text-white mb-2">
                CTR
              </label>
              <input
                type="number"
                id="ctr"
                value={metrics.ctr}
                onChange={(e) => handleInputChange('ctr', e.target.value)}
                className="w-full px-3 py-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent bg-black text-white"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="commissions" className="block text-sm font-medium text-white mb-2">
                Commissions
              </label>
              <input
                type="number"
                id="commissions"
                value={metrics.commissions}
                onChange={(e) => handleInputChange('commissions', e.target.value)}
                className="w-full px-3 py-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent bg-black text-white"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="sales" className="block text-sm font-medium text-white mb-2">
                Sales
              </label>
              <input
                type="number"
                id="sales"
                value={metrics.sales}
                onChange={(e) => handleInputChange('sales', e.target.value)}
                className="w-full px-3 py-2 border border-white rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent bg-black text-white"
                min="0"
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-yellow-600 text-black rounded-lg hover:bg-yellow-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg font-semibold text-black bg-yellow-600 hover:bg-yellow-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}