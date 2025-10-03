import React, { useState, useEffect } from 'react';

interface Plan {
  id: string;
  title: string;
  content: any;
  createdAt: string;
}

interface PlanesProps {
  onNavigateToDashboard: () => void;
}

export function Planes({ onNavigateToDashboard }: PlanesProps) {
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    const savedPlans = JSON.parse(localStorage.getItem('portfolio_ceo_plans') || '[]');
    setPlans(savedPlans);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-navy font-dancing-script">PLANES</span>
          <button
            onClick={onNavigateToDashboard}
            className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-navy">Mis Planes</h1>
          <button
            onClick={onNavigateToDashboard}
            className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
          >
            Crear Nuevo Plan
          </button>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No tienes planes creados aún.</p>
            <button
              onClick={onNavigateToDashboard}
              className="mt-4 px-6 py-3 bg-navy text-white rounded-lg font-semibold hover:bg-gray-600 transition-all"
            >
              Crear tu primer plan
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-navy mb-2">{plan.title}</h2>
                    <p className="text-sm text-gray-600">
                      Creado el {formatDate(plan.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Contenido del Plan:</h3>
                  <div className="text-sm text-gray-700">
                    {typeof plan.content === 'object' ? (
                      <pre className="whitespace-pre-wrap font-mono text-xs">
                        {JSON.stringify(plan.content, null, 2)}
                      </pre>
                    ) : (
                      <p>{plan.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}