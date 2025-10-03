import React, { useState } from 'react';

interface LoginCodeScreenProps {
  onLoginSuccess: (code: string) => void;
  onBack: () => void;
}

export function LoginCodeScreen({ onLoginSuccess, onBack }: LoginCodeScreenProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code.trim()) {
      setError('Por favor ingresa tu código de acceso.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if code exists in localStorage
      const existingCodes = JSON.parse(localStorage.getItem('user_codes') || '[]');
      if (!existingCodes.includes(code.toUpperCase())) {
        setError('Código no encontrado. Verifica que esté correcto.');
        return;
      }

      // Save to localStorage and proceed
      localStorage.setItem('user_code', code.toUpperCase());
      onLoginSuccess(code.toUpperCase());

    } catch (error) {
      console.error('Error during login:', error);
      setError('Error al iniciar sesión. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Iniciar Sesión</h1>
          <p className="text-gray-600">Ingresa tu código de acceso</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Código de Acceso
            </label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ABC12345"
              maxLength={8}
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

          {/* Buttons */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isLoading || !code.trim()}
              className={`w-full py-3 px-6 rounded-2xl font-semibold text-white transition-all ${
                isLoading || !code.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>

            <button
              type="button"
              onClick={onBack}
              className="w-full py-3 px-6 bg-white hover:bg-gray-50 text-blue-600 font-semibold rounded-2xl border-2 border-blue-600 transition-all"
              disabled={isLoading}
            >
              Volver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}