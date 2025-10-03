import React, { useState } from 'react';

interface WelcomeScreenProps {
  onAccessGranted: () => void;
}

export function WelcomeScreen({ onAccessGranted }: WelcomeScreenProps) {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!accessCode.trim()) {
      setError('Por favor ingresa el código de acceso.');
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (accessCode.toLowerCase() === 'vortexia') {
      localStorage.setItem('access_granted', 'true');
      onAccessGranted();
    } else {
      setError('Código de acceso incorrecto.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">CEO Dashboard</h1>
          <p className="text-black">Ingresa tu código de acceso</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="accessCode" className="block text-sm font-medium text-black mb-2">
              Código de Acceso
            </label>
            <input
              id="accessCode"
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Ingresa el código"
              required
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading || !accessCode.trim()}
            className={`w-full py-3 px-6 rounded-2xl font-semibold text-white transition-all ${
              isLoading || !accessCode.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-black hover:bg-gray-800 shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? 'Verificando...' : 'Acceder'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-black">
            Sistema exclusivo para miembros autorizados
          </p>
        </div>
      </div>
    </div>
  );
}