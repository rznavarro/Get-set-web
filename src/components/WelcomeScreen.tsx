import React, { useState } from 'react';
const logo = '/logo.png';

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

    if (accessCode.toLowerCase() === 'zyre.luxe' || accessCode === 'Zyre.Luxe') {
      localStorage.setItem('access_granted', 'true');
      onAccessGranted();
    } else {
      setError('Código de acceso incorrecto.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 xs:p-6 sm:p-8 gpu-accelerated">
      <div className="bg-[#0F0F0F]/90 backdrop-blur-sm border border-[#2C2C2C] rounded-2xl shadow-2xl max-w-sm xs:max-w-md w-full p-6 xs:p-8 animate-scale-in">
        {/* Header */}
        <div className="mb-6 xs:mb-8">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <img src={logo} alt="Zyre.Luxe Logo" className="w-10 h-10 xs:w-12 xs:h-12" />
            <h1 className="text-2xl xs:text-3xl font-bold text-[#EAEAEA] font-['Cinzel']">Zyre.Luxe</h1>
          </div>
          <p className="text-center text-[#EAEAEA]/70 font-['Inter'] text-sm xs:text-base">Ingresa tu código de acceso</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-6">
          <div>
            <label htmlFor="accessCode" className="block text-sm font-medium text-[#EAEAEA] mb-2 font-['Inter']">
              Código de Acceso
            </label>
            <input
              id="accessCode"
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full px-4 py-3 xs:py-4 border border-[#2C2C2C] rounded-xl bg-[#0A0A0A] text-[#EAEAEA] placeholder-[#EAEAEA]/50 focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all duration-300 font-['Inter'] text-base"
              placeholder="Ingresa el código"
              required
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-700/50 text-red-400 px-4 py-3 rounded-xl font-['Inter'] text-sm">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading || !accessCode.trim()}
            className={`w-full py-3 xs:py-4 px-6 rounded-xl font-semibold text-[#0A0A0A] transition-all duration-300 font-['Inter'] text-base min-h-[44px] touch-feedback ${
              isLoading || !accessCode.trim()
                ? 'bg-[#2C2C2C] cursor-not-allowed text-[#EAEAEA]/50'
                : 'bg-[#D4AF37] hover:bg-[#F5E6C5] shadow-lg hover:shadow-[#D4AF37]/30'
            }`}
          >
            {isLoading ? 'Verificando...' : 'Acceder'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 xs:mt-8 text-center">
          <p className="text-xs xs:text-sm text-[#EAEAEA]/60 font-['Inter']">
            Sistema exclusivo para miembros autorizados
          </p>
        </div>
      </div>
    </div>
  );
}