import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface OnboardingScreenProps {
  userCode: string;
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingScreen({ userCode, onComplete, onSkip }: OnboardingScreenProps) {
  const [metrics, setMetrics] = useState({
    leads: '',
    visitas_agendadas: '',
    visitas_casa: '',
    ventas: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setMetrics(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate that at least one metric is filled
    const hasData = Object.values(metrics).some(value => value.trim() !== '');
    if (!hasData) {
      setError('Por favor ingresa al menos una métrica.');
      return;
    }

    setIsLoading(true);

    try {
      // Insert metrics into user_metrics table
      const { error: insertError } = await supabase
        .from('user_metrics')
        .insert([{
          user_code: userCode,
          leads: metrics.leads ? parseInt(metrics.leads) : null,
          visitas_agendadas: metrics.visitas_agendadas ? parseInt(metrics.visitas_agendadas) : null,
          visitas_casa: metrics.visitas_casa ? parseInt(metrics.visitas_casa) : null,
          ventas: metrics.ventas ? parseInt(metrics.ventas) : null
        }]);

      if (insertError) {
        throw insertError;
      }

      // Save metrics to localStorage for quick access
      localStorage.setItem('user_metrics', JSON.stringify(metrics));
      onComplete();

    } catch (error) {
      console.error('Error saving metrics:', error);
      setError('Error al guardar las métricas. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Configuración Inicial</h1>
          <p className="text-gray-600">Ingresa tus métricas actuales</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="leads" className="block text-sm font-medium text-gray-700 mb-2">
                Leads
              </label>
              <input
                id="leads"
                type="text"
                value={metrics.leads}
                onChange={(e) => handleInputChange('leads', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="visitas_agendadas" className="block text-sm font-medium text-gray-700 mb-2">
                Visitas Agendadas
              </label>
              <input
                id="visitas_agendadas"
                type="text"
                value={metrics.visitas_agendadas}
                onChange={(e) => handleInputChange('visitas_agendadas', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="visitas_casa" className="block text-sm font-medium text-gray-700 mb-2">
                Visitas Casa
              </label>
              <input
                id="visitas_casa"
                type="text"
                value={metrics.visitas_casa}
                onChange={(e) => handleInputChange('visitas_casa', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="ventas" className="block text-sm font-medium text-gray-700 mb-2">
                Ventas
              </label>
              <input
                id="ventas"
                type="text"
                value={metrics.ventas}
                onChange={(e) => handleInputChange('ventas', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-6 rounded-2xl font-semibold text-white transition-all ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? 'Guardando...' : 'Guardar y Entrar al Dashboard'}
            </button>

            <button
              type="button"
              onClick={onSkip}
              className="w-full py-3 px-6 bg-white hover:bg-gray-50 text-gray-600 font-semibold rounded-2xl border-2 border-gray-300 transition-all"
              disabled={isLoading}
            >
              Saltar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}