import React, { useState, useEffect, useCallback } from 'react';
import { MetricCard } from './MetricCard';
import { OpportunityList } from './OpportunityList';
import { MetricEditForm } from './MetricEditForm';
import { SalesMetricsEditForm } from './SalesMetricsEditForm';
import { AnalysisData, getLatestAnalysis } from '../lib/api';

interface FinancialMetrics {
  current_noi: string;
  noi_opportunity: string;
  portfolio_roi: string;
  vacancy_cost: string;
  turnover_risk: string;
  capex_due: string;
}

interface DashboardProps {
  userCode: string;
  onLogout: () => void;
  onEditMetrics: () => void;
  onNavigateToPlanes: (response?: string) => void;
  onDataLoaded?: (data: AnalysisData) => void;
  onFinancialMetricsUpdate?: (metrics: FinancialMetrics) => void;
}


export function Dashboard({ userCode, onLogout, onEditMetrics, onNavigateToPlanes, onDataLoaded, onFinancialMetricsUpdate }: DashboardProps) {
  const handleDataLoaded = useCallback((data: AnalysisData) => {
    if (onDataLoaded) {
      onDataLoaded(data);
    }
  }, [onDataLoaded]);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    leads: 0,
    visitas_agendadas: 0,
    visitas_casa: 0,
    ventas: 0
  });
  const [executiveSummaryResponse, setExecutiveSummaryResponse] = useState<string | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [showMetricEdit, setShowMetricEdit] = useState(false);
  const [showSalesEdit, setShowSalesEdit] = useState(false);
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetrics | null>(null);


  useEffect(() => {
    async function fetchData() {
      try {
        const analysisData = await getLatestAnalysis();

        if (!analysisData) {
          setData(null);
          return;
        }

        setData(analysisData);

        // Notify parent component that data is loaded
        handleDataLoaded(analysisData);

        // Load metrics from localStorage
        const savedMetrics = localStorage.getItem('user_metrics');
        if (savedMetrics) {
          setMetrics(JSON.parse(savedMetrics));
        }

        // Load financial metrics from localStorage or initialize from API data
        const savedFinancialMetrics = localStorage.getItem('financial_metrics');
        if (savedFinancialMetrics) {
          setFinancialMetrics(JSON.parse(savedFinancialMetrics));
        } else {
          // Initialize with API data if no saved data exists
          setFinancialMetrics(analysisData.metrics);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleGenerateExecutiveSummary = async () => {
    if (!data) return;

    setGeneratingSummary(true);
    try {
      // Load current dynamic data
      const savedMetrics = localStorage.getItem('user_metrics');
      const userMetrics = savedMetrics ? JSON.parse(savedMetrics) : metrics;

      const savedCriticalActions = localStorage.getItem('portfolio_ceo_critical_actions');
      const criticalActions = savedCriticalActions ? JSON.parse(savedCriticalActions) : data.analysis.critical_actions.map((action, index) => ({
        id: `critical-${index}`,
        ...action
      }));

      const savedQuickActions = localStorage.getItem('portfolio_ceo_quick_actions');
      const quickActions = savedQuickActions ? JSON.parse(savedQuickActions) : data.next_30_days.map((action, index) => ({
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
        action: 'generate_executive_summary',
        timestamp: new Date().toISOString(),
        userCode: userCode,
        executiveSummary: data.analysis.executive_summary,
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
      setExecutiveSummaryResponse(result);

    } catch (error) {
      console.error('Error generating executive summary:', error);
      setExecutiveSummaryResponse('Error al generar el resumen ejecutivo.');
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleSaveMetrics = (newMetrics: FinancialMetrics) => {
    setFinancialMetrics(newMetrics);
    localStorage.setItem('financial_metrics', JSON.stringify(newMetrics));
    if (onFinancialMetricsUpdate) {
      onFinancialMetricsUpdate(newMetrics);
    }
    setShowMetricEdit(false);
  };

  const handleSaveSalesMetrics = (newMetrics: { leads: number; visitas_agendadas: number; visitas_casa: number; ventas: number }) => {
    setMetrics(newMetrics);
    localStorage.setItem('user_metrics', JSON.stringify(newMetrics));
    setShowSalesEdit(false);
  };

  const handleCancelMetricEdit = () => {
    setShowMetricEdit(false);
  };

  const handleCancelSalesEdit = () => {
    setShowSalesEdit(false);
  };

  const handleSendFinancialMetrics = async () => {
    if (!financialMetrics) return;

    const currentData = {
      action: 'send_financial_metrics',
      timestamp: new Date().toISOString(),
      userCode: userCode,
      metrics: {
        current_noi: financialMetrics.current_noi,
        noi_opportunity: financialMetrics.noi_opportunity,
        portfolio_roi: financialMetrics.portfolio_roi,
        vacancy_cost: financialMetrics.vacancy_cost,
        turnover_risk: financialMetrics.turnover_risk,
        capex_due: financialMetrics.capex_due
      }
    };

    try {
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

      alert('Métricas financieras enviadas exitosamente');
    } catch (error) {
      console.error('Error sending financial metrics:', error);
      alert('Error al enviar métricas financieras');
    }
  };

  const handleNavigateToPlanes = async () => {
    // Load current dynamic data
    const savedMetrics = localStorage.getItem('user_metrics');
    const userMetrics = savedMetrics ? JSON.parse(savedMetrics) : metrics;

    const savedCriticalActions = localStorage.getItem('portfolio_ceo_critical_actions');
    const criticalActions = savedCriticalActions ? JSON.parse(savedCriticalActions) : data?.analysis.critical_actions.map((action, index) => ({
      id: `critical-${index}`,
      ...action
    })) || [];

    const savedQuickActions = localStorage.getItem('portfolio_ceo_quick_actions');
    const quickActions = savedQuickActions ? JSON.parse(savedQuickActions) : data?.next_30_days.map((action, index) => ({
      id: `quick-${index}`,
      action
    })) || [];

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
      action: 'navigate_to_planes',
      timestamp: new Date().toISOString(),
      userCode: userCode,
      executiveSummary: data?.analysis.executive_summary,
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

    let responseText = '';
    try {
      const response = await fetch('https://n8n.srv880021.hstgr.cloud/webhook-test/CeoPremium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentData),
      });

      if (response.ok) {
        responseText = await response.text();
      } else {
        responseText = `Error: ${response.status} ${response.statusText}`;
      }
    } catch (error) {
      console.error('Error sending data to CeoPremium3:', error);
      responseText = `Error: ${error}`;
    }

    onNavigateToPlanes(responseText);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black">Loading dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black">No analysis data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-black font-dancing-script">CEO Dashboard</span>
          <div className="flex space-x-2">
            <button
              onClick={onEditMetrics}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
            >
              Editar Métricas
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-8">
        {/* Metrics Summary */}
        <div className="mb-8">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-black">Tus Métricas Actuales</h2>
              <button
                onClick={() => setShowSalesEdit(true)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
              >
                Editar
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-black">{metrics.leads}</div>
                <div className="text-sm text-black">Leads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-black">{metrics.visitas_agendadas}</div>
                <div className="text-sm text-black">Visitas Agendadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-black">{metrics.visitas_casa}</div>
                <div className="text-sm text-black">Visitas Casa</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-black">{metrics.ventas}</div>
                <div className="text-sm text-black">Ventas</div>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-8">
          <div className="bg-black text-white p-6 rounded-lg">
            <h1 className="text-xl font-semibold mb-2 font-dancing-script">EXECUTIVE SUMMARY</h1>
            <p className="text-lg">{data.analysis.executive_summary}</p>
          </div>
        </div>

        {/* Metrics Grid */}
        {financialMetrics && (
          <div className="grid grid-cols-3 gap-6 mb-12">
            <MetricCard
              title="Current NOI"
              value={financialMetrics.current_noi}
              insight="Monthly recurring income"
            />
            <MetricCard
              title="NOI Opportunity"
              value={financialMetrics.noi_opportunity}
              insight="Potential additional income"
              isOpportunity={true}
            />
            <MetricCard
              title="Portfolio ROI"
              value={financialMetrics.portfolio_roi}
              insight="Annual return on investment"
            />
            <MetricCard
              title="Vacancy Cost"
              value={financialMetrics.vacancy_cost}
              insight="Monthly lost revenue"
            />
            <MetricCard
              title="Turnover Risk"
              value={financialMetrics.turnover_risk}
              insight="Units requiring attention"
            />
            <MetricCard
              title="CapEx Due"
              value={financialMetrics.capex_due}
              insight="Immediate capital required"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="mb-8 flex space-x-4 justify-center flex-wrap">
          <button
            onClick={handleGenerateExecutiveSummary}
            disabled={generatingSummary || !financialMetrics}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-all ${
              generatingSummary || !financialMetrics
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-black hover:bg-gray-800 hover:shadow-lg'
            }`}
          >
            {generatingSummary ? 'Generando...' : 'Generar Executive Summary'}
          </button>
          {financialMetrics && (
            <button
              onClick={() => setShowMetricEdit(true)}
              className="px-6 py-3 rounded-lg font-semibold text-white bg-black hover:bg-gray-800 hover:shadow-lg transition-all"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleNavigateToPlanes}
            className="px-6 py-3 rounded-lg font-semibold text-white bg-black hover:bg-gray-800 hover:shadow-lg transition-all"
          >
            Ver Planes
          </button>
          {financialMetrics && (
            <button
              onClick={handleSendFinancialMetrics}
              className="px-6 py-3 rounded-lg font-semibold text-white bg-black hover:bg-gray-800 hover:shadow-lg transition-all"
            >
              Enviar Métricas Financieras
            </button>
          )}
        </div>

        {/* Executive Summary Response */}
        {executiveSummaryResponse && (
          <div className="mb-8">
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-black">Executive Summary</h2>
              <div className="text-black whitespace-pre-wrap">{executiveSummaryResponse}</div>
            </div>
          </div>
        )}


        {/* Opportunities and Actions */}
        <OpportunityList data={data} />
      </main>

      {showMetricEdit && (
        <MetricEditForm
          currentMetrics={financialMetrics}
          onSave={handleSaveMetrics}
          onCancel={handleCancelMetricEdit}
        />
      )}

      {showSalesEdit && (
        <SalesMetricsEditForm
          currentMetrics={metrics}
          onSave={handleSaveSalesMetrics}
          onCancel={handleCancelSalesEdit}
        />
      )}
    </div>
  );
}
