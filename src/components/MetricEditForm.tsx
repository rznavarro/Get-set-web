import React, { useState } from 'react';

interface FinancialMetrics {
  current_noi: string;
  noi_opportunity: string;
  portfolio_roi: string;
  vacancy_cost: string;
  turnover_risk: string;
  capex_due: string;
}

interface MetricEditFormProps {
  currentMetrics: FinancialMetrics | null;
  onSave: (metrics: FinancialMetrics) => void;
  onCancel: () => void;
}

export function MetricEditForm({ currentMetrics, onSave, onCancel }: MetricEditFormProps) {
  const [metrics, setMetrics] = useState<FinancialMetrics>(currentMetrics || {
    current_noi: '',
    noi_opportunity: '',
    portfolio_roi: '',
    vacancy_cost: '',
    turnover_risk: '',
    capex_due: ''
  });

  const handleInputChange = (field: keyof FinancialMetrics, value: string) => {
    setMetrics(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(metrics);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-black mb-6">Editar Métricas Financieras</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="current_noi" className="block text-sm font-medium text-gray-700 mb-2">
                Current NOI
              </label>
              <input
                type="text"
                id="current_noi"
                value={metrics.current_noi}
                onChange={(e) => handleInputChange('current_noi', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Ej: $847K"
              />
              <p className="text-xs text-gray-500 mt-1">Monthly recurring income</p>
            </div>

            <div>
              <label htmlFor="noi_opportunity" className="block text-sm font-medium text-gray-700 mb-2">
                NOI Opportunity
              </label>
              <input
                type="text"
                id="noi_opportunity"
                value={metrics.noi_opportunity}
                onChange={(e) => handleInputChange('noi_opportunity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Ej: $156K"
              />
              <p className="text-xs text-gray-500 mt-1">Potential additional income</p>
            </div>

            <div>
              <label htmlFor="portfolio_roi" className="block text-sm font-medium text-gray-700 mb-2">
                Portfolio ROI
              </label>
              <input
                type="text"
                id="portfolio_roi"
                value={metrics.portfolio_roi}
                onChange={(e) => handleInputChange('portfolio_roi', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Ej: 14.2%"
              />
              <p className="text-xs text-gray-500 mt-1">Annual return on investment</p>
            </div>

            <div>
              <label htmlFor="vacancy_cost" className="block text-sm font-medium text-gray-700 mb-2">
                Vacancy Cost
              </label>
              <input
                type="text"
                id="vacancy_cost"
                value={metrics.vacancy_cost}
                onChange={(e) => handleInputChange('vacancy_cost', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Ej: $23K"
              />
              <p className="text-xs text-gray-500 mt-1">Monthly lost revenue</p>
            </div>

            <div>
              <label htmlFor="turnover_risk" className="block text-sm font-medium text-gray-700 mb-2">
                Turnover Risk
              </label>
              <input
                type="text"
                id="turnover_risk"
                value={metrics.turnover_risk}
                onChange={(e) => handleInputChange('turnover_risk', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Ej: 3 units"
              />
              <p className="text-xs text-gray-500 mt-1">Units requiring attention</p>
            </div>

            <div>
              <label htmlFor="capex_due" className="block text-sm font-medium text-gray-700 mb-2">
                CapEx Due
              </label>
              <input
                type="text"
                id="capex_due"
                value={metrics.capex_due}
                onChange={(e) => handleInputChange('capex_due', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Ej: $89K"
              />
              <p className="text-xs text-gray-500 mt-1">Immediate capital required</p>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg font-semibold text-white bg-black hover:bg-gray-800 transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}