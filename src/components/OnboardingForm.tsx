import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface OnboardingData {
  portfolioValue: string;
  businessType: string;
  experience: string;
  goals: string[];
}

interface OnboardingFormProps {
  onSubmit: (data: OnboardingData) => void;
}

export function OnboardingForm({ onSubmit }: OnboardingFormProps) {
  const [formData, setFormData] = useState<OnboardingData>({
    portfolioValue: '',
    businessType: '',
    experience: '',
    goals: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onSubmit(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.portfolioValue.trim() !== '';
      case 2:
        return formData.businessType !== '';
      case 3:
        return formData.experience !== '';
      case 4:
        return formData.goals.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">PORTFOLIO CEO</h1>
          <p className="text-gray-600">Configura tu perfil para una experiencia personalizada</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  i + 1 <= currentStep
                    ? 'bg-navy text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-navy h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Steps */}
        <div className="min-h-64">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-navy text-center">
                ¿Cuál es el valor total de tu portfolio?
              </h2>
              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
                  <input
                    type="text"
                    value={formData.portfolioValue}
                    onChange={(e) => setFormData({ ...formData, portfolioValue: e.target.value })}
                    placeholder="Ej: 12.4M"
                    className="w-full pl-8 pr-4 py-4 text-xl border-2 border-gray-300 rounded-lg focus:border-navy focus:outline-none"
                  />
                </div>
                <p className="text-sm text-gray-500 text-center">
                  Ingresa el valor en millones (ej: 8M) o miles (ej: 8000K)
                </p>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-navy text-center">
                ¿Qué tipo de propiedades manejas?
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  'Apartamentos',
                  'Casas',
                  'Oficinas',
                  'Locales comerciales',
                  'Mixtos',
                  'Otros'
                ].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFormData({ ...formData, businessType: type })}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      formData.businessType === type
                        ? 'border-navy bg-navy text-white'
                        : 'border-gray-300 hover:border-navy'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-navy text-center">
                ¿Cuántos años de experiencia tienes?
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  'Menos de 1 año',
                  '1-3 años',
                  '3-5 años',
                  '5-10 años',
                  'Más de 10 años'
                ].map((exp) => (
                  <button
                    key={exp}
                    onClick={() => setFormData({ ...formData, experience: exp })}
                    className={`p-4 border-2 rounded-lg text-center transition-all ${
                      formData.experience === exp
                        ? 'border-navy bg-navy text-white'
                        : 'border-gray-300 hover:border-navy'
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-navy text-center">
                ¿Cuáles son tus objetivos principales?
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {[
                  'Maximizar ingresos (NOI)',
                  'Reducir costos operativos',
                  'Mejorar ROI del portfolio',
                  'Minimizar riesgos de vacancia',
                  'Planificar mantenimiento (CapEx)',
                  'Expandir el portfolio'
                ].map((goal) => (
                  <button
                    key={goal}
                    onClick={() => handleGoalToggle(goal)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.goals.includes(goal)
                        ? 'border-navy bg-navy text-white'
                        : 'border-gray-300 hover:border-navy'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 border-2 rounded mr-3 ${
                        formData.goals.includes(goal)
                          ? 'bg-white border-white'
                          : 'border-gray-400'
                      }`}></div>
                      {goal}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Atrás
          </button>
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
              canProceed()
                ? 'bg-navy text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span>{currentStep === totalSteps ? 'Comenzar' : 'Siguiente'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
