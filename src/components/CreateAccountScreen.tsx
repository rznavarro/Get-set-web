import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface CreateAccountScreenProps {
  onAccountCreated: (code: string) => void;
  onBack: () => void;
}

export function CreateAccountScreen({ onAccountCreated, onBack }: CreateAccountScreenProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
  };

  const validateCode = (code: string) => {
    // Exactly 8 characters, alphanumeric only
    const regex = /^[A-Z0-9]{8}$/;
    return regex.test(code);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateCode(code)) {
      setError('El código debe tener exactamente 8 caracteres alfanuméricos (letras mayúsculas y números).');
      return;
    }

    setIsLoading(true);

    try {
      // Check if code already exists
      const { data: existingCode, error: checkError } = await supabase
        .from('users_codes')
        .select('code')
        .eq('code', code)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw checkError;
      }

      if (existingCode) {
        setError('Este código ya está en uso. Por favor elige otro.');
        return;
      }

      // Insert new code
      const { error: insertError } = await supabase
        .from('users_codes')
        .insert([{ code }]);

      if (insertError) {
        throw insertError;
      }

      // Save to localStorage and proceed
      localStorage.setItem('user_code', code);
      onAccountCreated(code);

    } catch (error) {
      console.error('Error creating account:', error);
      setError('Error al crear la cuenta. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Crear Cuenta</h1>
          <p className="text-gray-600">Ingresa o genera un código de 8 caracteres</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Código de Acceso (8 caracteres)
            </label>
            <div className="flex space-x-2">
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ABC12345"
                maxLength={8}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={generateRandomCode}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl transition-colors"
                disabled={isLoading}
              >
                🎲
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Solo letras mayúsculas y números
            </p>
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
              {isLoading ? 'Creando...' : 'Crear Cuenta'}
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