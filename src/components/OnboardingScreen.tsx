import React, { useState } from 'react';

interface OnboardingScreenProps {
  userCode: string;
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingScreen({ userCode, onComplete, onSkip }: OnboardingScreenProps) {
  const [metrics, setMetrics] = useState({
    clicks: '',
    sales: '',
    commissions: '',
    ctr: ''
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
      setError('Please enter at least one metric.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Save metrics to localStorage for quick access
      localStorage.setItem('user_metrics', JSON.stringify(metrics));
      onComplete();

    } catch (error) {
      console.error('Error saving metrics:', error);
      setError('Error saving metrics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Initial Setup</h1>
          <p className="text-gray-300">Enter your current metrics</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="clicks" className="block text-sm font-medium text-white mb-2">
                Clicks
              </label>
              <input
                id="clicks"
                type="text"
                value={metrics.clicks}
                onChange={(e) => handleInputChange('clicks', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="0"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="sales" className="block text-sm font-medium text-white mb-2">
                Sales
              </label>
              <input
                id="sales"
                type="text"
                value={metrics.sales}
                onChange={(e) => handleInputChange('sales', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="0"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="commissions" className="block text-sm font-medium text-white mb-2">
                Commissions
              </label>
              <input
                id="commissions"
                type="text"
                value={metrics.commissions}
                onChange={(e) => handleInputChange('commissions', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="0"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="ctr" className="block text-sm font-medium text-white mb-2">
                CTR
              </label>
              <input
                id="ctr"
                type="text"
                value={metrics.ctr}
                onChange={(e) => handleInputChange('ctr', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                placeholder="0"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-300 px-4 py-3 rounded-2xl">
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
                  : 'bg-yellow-600 hover:bg-yellow-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? 'Saving...' : 'Save and Enter Dashboard'}
            </button>

            <button
              type="button"
              onClick={onSkip}
              className="w-full py-3 px-6 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-2xl border-2 border-gray-600 transition-all"
              disabled={isLoading}
            >
              Skip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}