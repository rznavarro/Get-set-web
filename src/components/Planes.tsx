import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

interface Plan {
  id: string;
  title: string;
  content: any;
  createdAt: string;
}

interface PlanesProps {
  onNavigateToDashboard: () => void;
  dashboardData: any;
  userName: string | null;
}

export function Planes({ onNavigateToDashboard, dashboardData, userName }: PlanesProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [creatingPlan, setCreatingPlan] = useState(false);

  useEffect(() => {
    const savedPlans = JSON.parse(localStorage.getItem('portfolio_ceo_plans') || '[]');
    setPlans(savedPlans);
  }, []);

  const handleCreatePlan = async () => {
    if (!dashboardData) {
      alert('No hay datos del dashboard disponibles');
      return;
    }

    setCreatingPlan(true);
    try {
      const response = await fetch('https://n8n.srv880021.hstgr.cloud/webhook/CeoPremium3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_plan',
          timestamp: new Date().toISOString(),
          userName: userName,
          dashboardData: dashboardData
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();

      // Save response as plan
      const existingPlans = JSON.parse(localStorage.getItem('portfolio_ceo_plans') || '[]');
      const newPlan = {
        id: `plan-${Date.now()}`,
        title: `Plan ${existingPlans.length + 1}`,
        content: result,
        createdAt: new Date().toISOString()
      };
      existingPlans.push(newPlan);
      localStorage.setItem('portfolio_ceo_plans', JSON.stringify(existingPlans));

      // Update local state
      setPlans(existingPlans);

    } catch (error) {
      console.error('Error creating plan:', error);
      // Save error response as plan
      const existingPlans = JSON.parse(localStorage.getItem('portfolio_ceo_plans') || '[]');
      const errorPlan = {
        id: `plan-error-${Date.now()}`,
        title: `Error en Plan ${existingPlans.length + 1}`,
        content: `Error al crear el plan: ${(error as Error).message}`,
        createdAt: new Date().toISOString()
      };
      existingPlans.push(errorPlan);
      localStorage.setItem('portfolio_ceo_plans', JSON.stringify(existingPlans));
      setPlans(existingPlans);
    } finally {
      setCreatingPlan(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const downloadAsPDF = (plan: Plan) => {
    const doc = new jsPDF();
    doc.text(`Plan: ${plan.title}`, 10, 10);
    doc.text(`Fecha: ${formatDate(plan.createdAt)}`, 10, 20);

    let yPosition = 30;
    if (typeof plan.content === 'string') {
      // Split text into lines that fit the page width
      const lines = doc.splitTextToSize(plan.content, 180);
      doc.text(lines, 10, yPosition);
    } else {
      // For JSON content, stringify it
      const contentText = JSON.stringify(plan.content, null, 2);
      const lines = doc.splitTextToSize(contentText, 180);
      doc.text(lines, 10, yPosition);
    }

    doc.save(`${plan.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
  };

  const deletePlan = (planId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este plan?')) {
      const existingPlans = JSON.parse(localStorage.getItem('portfolio_ceo_plans') || '[]');
      const updatedPlans = existingPlans.filter((plan: Plan) => plan.id !== planId);
      localStorage.setItem('portfolio_ceo_plans', JSON.stringify(updatedPlans));
      setPlans(updatedPlans);
    }
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
            onClick={handleCreatePlan}
            disabled={creatingPlan}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-all ${
              creatingPlan
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {creatingPlan ? 'Creando...' : 'Crear Nuevo Plan'}
          </button>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No tienes planes creados aún.</p>
            <button
              onClick={handleCreatePlan}
              disabled={creatingPlan}
              className={`mt-4 px-6 py-3 rounded-lg font-semibold text-white transition-all ${
                creatingPlan
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {creatingPlan ? 'Creando...' : 'Crear tu primer plan'}
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
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadAsPDF(plan)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => deletePlan(plan.id)}
                      className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                    >
                      Eliminar
                    </button>
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