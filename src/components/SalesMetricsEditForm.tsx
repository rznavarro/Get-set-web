import React, { useState } from 'react';

interface SalesMetrics {
  leads: number;
  visitas_agendadas: number;
  visitas_casa: number;
  ventas: number;
}

interface SalesMetricsEditFormProps {
  currentMetrics: SalesMetrics | null;
  onSave: (metrics: SalesMetrics) => void;
  onCancel: () => void;
}

export function SalesMetricsEditForm({ currentMetrics, onSave, onCancel }: SalesMetricsEditFormProps) {
  const [metrics, setMetrics] = useState<SalesMetrics>(currentMetrics || {
    leads: 0,
    visitas_agendadas: 0,
    visitas_casa: 0,
    ventas: 0
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-black mb-6">Editar Métricas de Ventas</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="leads" className="block text-sm font-medium text-gray-700 mb-2">
                Leads
              </label>
              <input
                type="number"
                id="leads"
                value={metrics.leads}
                onChange={(e) => handleInputChange('leads', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="visitas_agendadas" className="block text-sm font-medium text-gray-700 mb-2">
                Visitas Agendadas
              </label>
              <input
                type="number"
                id="visitas_agendadas"
                value={metrics.visitas_agendadas}
                onChange={(e) => handleInputChange('visitas_agendadas', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="visitas_casa" className="block text-sm font-medium text-gray-700 mb-2">
                Visitas Casa
              </label>
              <input
                type="number"
                id="visitas_casa"
                value={metrics.visitas_casa}
                onChange={(e) => handleInputChange('visitas_casa', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="ventas" className="block text-sm font-medium text-gray-700 mb-2">
                Ventas
              </label>
              <input
                type="number"
                id="ventas"
                value={metrics.ventas}
                onChange={(e) => handleInputChange('ventas', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                min="0"
              />
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