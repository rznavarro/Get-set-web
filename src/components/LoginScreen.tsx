import React, { useState } from 'react';
import { Lock, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (accessCode === 'PremiumCEO') {
      // Set login status in localStorage
      localStorage.setItem('portfolio_ceo_logged_in', 'true');
      onLogin();
    } else {
      setError('Código de acceso incorrecto. Inténtalo nuevamente.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2 font-dancing-script">PORTFOLIO CEO</h1>
          <p className="text-gray-600 font-dancing-script">Ingresa tu código de acceso</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2 font-dancing-script">
              Código de Acceso
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="accessCode"
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-navy focus:border-navy focus:outline-none"
                placeholder="Ingresa el código de acceso"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !accessCode.trim()}
            className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-semibold text-white transition-all ${
              isLoading || !accessCode.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-navy hover:bg-gray-600 hover:shadow-lg'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Verificando...
              </>
            ) : (
              'Acceder'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 font-dancing-script">
            Sistema exclusivo para miembros Premium CEO
          </p>
        </div>
      </div>
    </div>
  );
}
