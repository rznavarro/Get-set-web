import React from 'react';

interface WelcomeScreenProps {
  onCreateAccount: () => void;
  onLogin: () => void;
}

export function WelcomeScreen({ onCreateAccount, onLogin }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xl max-w-md w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-2">CEO Dashboard</h1>
          <p className="text-black">Gestiona tus métricas de ventas inmobiliarias</p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <button
            onClick={onCreateAccount}
            className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Crear Cuenta
          </button>

          <button
            onClick={onLogin}
            className="w-full bg-white hover:bg-gray-50 text-black font-semibold py-4 px-6 rounded-2xl border-2 border-black transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Iniciar Sesión
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-black">
            Sistema exclusivo para profesionales inmobiliarios
          </p>
        </div>
      </div>
    </div>
  );
}