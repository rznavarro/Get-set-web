import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { AnalysisData } from '../lib/api';
import { PlanCreationForm } from './PlanCreationForm';

interface PlanFormData {
  nombrePlan: string;
  duracion: string;
  roiEsperado: string;
  especificaciones: string;
  numeroPlanes: string;
}

interface Plan {
  id: string;
  title: string;
  content: any;
  createdAt: string;
}

interface FinancialMetrics {
  current_noi: string;
  noi_opportunity: string;
  portfolio_roi: string;
  vacancy_cost: string;
  turnover_risk: string;
  capex_due: string;
}

interface PlanesProps {
  onNavigateToDashboard: () => void;
  dashboardData: AnalysisData | null;
  userName: string | null;
  userMetrics: Record<string, unknown>;
  financialMetrics: FinancialMetrics | null;
}

export function Planes({ onNavigateToDashboard, dashboardData, userName, userMetrics, financialMetrics }: PlanesProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [creatingPlan, setCreatingPlan] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<string | null>(null);
  const [creationResponse, setCreationResponse] = useState<string | null>(null);

  useEffect(() => {
    const savedPlans = JSON.parse(localStorage.getItem('portfolio_ceo_plans') || '[]');
    setPlans(savedPlans);

    // Load webhook response from localStorage
    const response = localStorage.getItem('planes_webhook_response');
    if (response) {
      setWebhookResponse(response);
      // Clear it after displaying
      localStorage.removeItem('planes_webhook_response');
    }
  }, []);

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const handleCreatePlan = async (formData: PlanFormData) => {
    if (!dashboardData) {
      alert('No hay datos del dashboard disponibles');
      return;
    }

    setCreatingPlan(true);
    try {
      // Load current dynamic data
      const savedCriticalActions = localStorage.getItem('portfolio_ceo_critical_actions');
      const criticalActions = savedCriticalActions ? JSON.parse(savedCriticalActions) : dashboardData.analysis.critical_actions.map((action, index) => ({
        id: `critical-${index}`,
        ...action
      }));

      const savedQuickActions = localStorage.getItem('portfolio_ceo_quick_actions');
      const quickActions = savedQuickActions ? JSON.parse(savedQuickActions) : dashboardData.next_30_days.map((action, index) => ({
        id: `quick-${index}`,
        action
      }));

      const topOpportunities = criticalActions.map((action: any) => ({
        titulo: action.action,
        descripcion: action.details,
        valor_anual: action.impact,
        prioridad: action.urgency === 'high' ? 'ALTA' : action.urgency === 'medium' ? 'MEDIA' : 'BAJA'
      }));

      const quickActionsFormatted = quickActions.map((action: any) => ({
        descripcion: action.action,
        completada: false
      }));

      const currentData = {
        action: 'create_plan',
        timestamp: new Date().toISOString(),
        userName: userName,
        userCode: 'VORTEXIA',
        planFormData: formData,
        executiveSummary: dashboardData.analysis.executive_summary,
        metricas: {
          current_noi: financialMetrics?.current_noi,
          noi_opportunity: financialMetrics?.noi_opportunity,
          portfolio_roi: financialMetrics?.portfolio_roi,
          vacancy_cost: financialMetrics?.vacancy_cost,
          turnover_risk: financialMetrics?.turnover_risk,
          capex_due: financialMetrics?.capex_due,
          leads: userMetrics.leads,
          visitas_agendadas: userMetrics.visitas_agendadas,
          visitas_casa: userMetrics.visitas_casa,
          ventas: userMetrics.ventas
        },
        top_opportunities: topOpportunities,
        quick_actions: quickActionsFormatted
      };

      const response = await fetch('https://n8n.srv880021.hstgr.cloud/webhook-test/CeoPremium3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.text();

      // Set creation response for display
      setCreationResponse(result);

      // Save response as plan
      const existingPlans = JSON.parse(localStorage.getItem('portfolio_ceo_plans') || '[]');
      const newPlan = {
        id: `plan-${Date.now()}`,
        title: formData.nombrePlan || `Plan ${existingPlans.length + 1}`,
        content: result,
        createdAt: new Date().toISOString()
      };
      existingPlans.push(newPlan);
      localStorage.setItem('portfolio_ceo_plans', JSON.stringify(existingPlans));

      // Update local state
      setPlans(existingPlans);
      setShowForm(false);

    } catch (error) {
      console.error('Error creating plan:', error);
      // Save error response as plan
      const existingPlans = JSON.parse(localStorage.getItem('portfolio_ceo_plans') || '[]');
      const errorPlan = {
        id: `plan-error-${Date.now()}`,
        title: `Error en ${formData.nombrePlan || 'Plan'}`,
        content: `Error al crear el plan: ${(error as Error).message}`,
        createdAt: new Date().toISOString()
      };
      existingPlans.push(errorPlan);
      localStorage.setItem('portfolio_ceo_plans', JSON.stringify(existingPlans));
      setPlans(existingPlans);
      setShowForm(false);
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
    doc.setFontSize(8); // Reduced font size for better readability
    doc.text(`Plan: ${plan.title}`, 10, 10);
    doc.text(`Fecha: ${formatDate(plan.createdAt)}`, 10, 20);

    const yPosition = 30;
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
          <span className="text-2xl font-bold text-black font-dancing-script">PLANES</span>
          <button
            onClick={onNavigateToDashboard}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Volver al Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-8">
        {/* Webhook Response */}
        {webhookResponse && (
          <div className="mb-8">
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-black">Respuesta del Webhook</h2>
              <div className="text-black whitespace-pre-wrap">{webhookResponse}</div>
            </div>
          </div>
        )}

        {/* Plan Creation Response */}
        {creationResponse && (
          <div className="mb-8">
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-black">Respuesta de Creación de Plan</h2>
              <div className="text-black whitespace-pre-wrap">{creationResponse}</div>
            </div>
          </div>
        )}

        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-black">Mis Planes</h1>
          <button
            onClick={handleShowForm}
            disabled={creatingPlan}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-all ${
              creatingPlan
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-black hover:bg-gray-800'
            }`}
          >
            {creatingPlan ? 'Creando...' : 'Crear Nuevo Plan'}
          </button>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No tienes planes creados aún.</p>
            <button
              onClick={handleShowForm}
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
                    <h2 className="text-xl font-semibold text-black mb-2">{plan.title}</h2>
                    <p className="text-sm text-gray-600">
                      Creado el {formatDate(plan.createdAt)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => downloadAsPDF(plan)}
                      className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors"
                    >
                      PDF
                    </button>
                    <button
                      onClick={() => deletePlan(plan.id)}
                      className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800 transition-colors"
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

      {showForm && (
        <PlanCreationForm
          onSubmit={handleCreatePlan}
          onCancel={handleFormCancel}
          isSubmitting={creatingPlan}
        />
      )}
    </div>
  );
}