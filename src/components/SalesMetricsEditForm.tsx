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
    clicks: 30,
    sales: 300,
    commissions: 200,
    ctr: 20
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
    <div className="fixed inset-0 bg-[#0A0A0A]/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#0F0F0F]/95 backdrop-blur-sm border border-[#2C2C2C] rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#EAEAEA] mb-2 font-['Cinzel']">Edit Sales Metrics</h2>
          <p className="text-[#EAEAEA]/70 font-['Inter']">Update your performance data</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="clicks" className="block text-sm font-medium text-[#EAEAEA]/80 uppercase tracking-wider font-['Inter']">
                Clicks
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="clicks"
                  value={metrics.clicks}
                  onChange={(e) => handleInputChange('clicks', e.target.value)}
                  className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#404040] rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 text-[#EAEAEA] font-['Inter'] text-center text-xl font-semibold transition-all duration-300"
                  min="0"
                />
                <div className="absolute inset-0 rounded-lg border border-[#D4AF37]/0 group-hover:border-[#D4AF37]/50 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="ctr" className="block text-sm font-medium text-[#EAEAEA]/80 uppercase tracking-wider font-['Inter']">
                CTR
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="ctr"
                  value={metrics.ctr}
                  onChange={(e) => handleInputChange('ctr', e.target.value)}
                  className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#404040] rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 text-[#EAEAEA] font-['Inter'] text-center text-xl font-semibold transition-all duration-300"
                  min="0"
                />
                <div className="absolute inset-0 rounded-lg border border-[#D4AF37]/0 group-hover:border-[#D4AF37]/50 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="commissions" className="block text-sm font-medium text-[#EAEAEA]/80 uppercase tracking-wider font-['Inter']">
                Commissions
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="commissions"
                  value={metrics.commissions}
                  onChange={(e) => handleInputChange('commissions', e.target.value)}
                  className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#404040] rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 text-[#EAEAEA] font-['Inter'] text-center text-xl font-semibold transition-all duration-300"
                  min="0"
                />
                <div className="absolute inset-0 rounded-lg border border-[#D4AF37]/0 group-hover:border-[#D4AF37]/50 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="sales" className="block text-sm font-medium text-[#EAEAEA]/80 uppercase tracking-wider font-['Inter']">
                Sales
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="sales"
                  value={metrics.sales}
                  onChange={(e) => handleInputChange('sales', e.target.value)}
                  className="w-full px-4 py-3 bg-[#2C2C2C] border border-[#404040] rounded-lg focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 text-[#EAEAEA] font-['Inter'] text-center text-xl font-semibold transition-all duration-300"
                  min="0"
                />
                <div className="absolute inset-0 rounded-lg border border-[#D4AF37]/0 group-hover:border-[#D4AF37]/50 transition-all duration-300 pointer-events-none"></div>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-6 justify-center">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-3 bg-[#2C2C2C] text-[#EAEAEA] rounded-lg hover:bg-[#404040] transition-all duration-300 text-sm font-['Inter'] font-medium border border-[#404040] hover:border-[#D4AF37]/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-lg font-semibold text-[#0A0A0A] bg-[#D4AF37] hover:bg-[#F5E6C5] transition-all duration-300 text-sm font-['Inter'] font-medium shadow-lg hover:shadow-[#D4AF37]/30"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}