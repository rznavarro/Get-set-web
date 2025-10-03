import React, { useState, useEffect } from 'react';
import { MetricCard } from './MetricCard';
import { OpportunityList } from './OpportunityList';
import { AnalysisData, getLatestAnalysis } from '../lib/api';

interface DashboardProps {
  userCode: string;
  onLogout: () => void;
  onEditMetrics: () => void;
  onNavigateToPlanes: () => void;
}

// Function to get executive summary personalized with user name
function getExecutiveSummary(userName: string | null, baseSummary: string): string {
  if (userName) {
    return `Hola ${userName}, bienvenido a tu dashboard de Portfolio CEO. Aquí encontrarás métricas clave de tu portafolio de inversiones inmobiliarias.`;
  }
  return baseSummary;
}

export function Dashboard({ userCode, onLogout, onEditMetrics, onNavigateToPlanes }: DashboardProps) {
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


  useEffect(() => {
    async function fetchData() {
      try {
        const analysisData = await getLatestAnalysis();

        if (!analysisData) {
          setData(null);
          return;
        }

        setData(analysisData);

        // Load metrics from localStorage
        const savedMetrics = localStorage.getItem('user_metrics');
        if (savedMetrics) {
          setMetrics(JSON.parse(savedMetrics));
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
      const response = await fetch('https://n8n.srv880021.hstgr.cloud/webhook/CeoPremium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate_executive_summary',
          timestamp: new Date().toISOString(),
          userCode: userCode,
          dashboardData: data
        }),
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
          <span className="text-2xl font-bold text-navy font-dancing-script">CEO Dashboard</span>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-600 uppercase tracking-wide font-dancing-script">CÓDIGO</div>
              <div className="text-lg font-bold text-navy">{userCode}</div>
            </div>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-8">
        {/* Metrics Summary */}
        <div className="mb-8">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4 text-black">Tus Métricas Actuales</h2>
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
          <div className="bg-navy text-white p-6 rounded-lg">
            <h1 className="text-xl font-semibold mb-2 font-dancing-script">EXECUTIVE SUMMARY</h1>
            <p className="text-lg">{data.analysis.executive_summary}</p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <MetricCard
            title="Current NOI"
            value={data.metrics.current_noi}
            insight="Monthly recurring income"
          />
          <MetricCard
            title="NOI Opportunity"
            value={data.metrics.noi_opportunity}
            insight="Potential additional income"
            isOpportunity={true}
          />
          <MetricCard
            title="Portfolio ROI"
            value={data.metrics.portfolio_roi}
            insight="Annual return on investment"
          />
          <MetricCard
            title="Vacancy Cost"
            value={data.metrics.vacancy_cost}
            insight="Monthly lost revenue"
            hasAlert={true}
          />
          <MetricCard
            title="Turnover Risk"
            value={data.metrics.turnover_risk}
            insight="Units requiring attention"
            hasAlert={true}
          />
          <MetricCard
            title="CapEx Due"
            value={data.metrics.capex_due}
            insight="Immediate capital required"
            hasAlert={true}
          />
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex space-x-4">
          <button
            onClick={handleGenerateExecutiveSummary}
            disabled={generatingSummary}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-all ${
              generatingSummary
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-black hover:bg-gray-800 hover:shadow-lg'
            }`}
          >
            {generatingSummary ? 'Generando...' : 'Generar Executive Summary'}
          </button>
          <button
            onClick={onNavigateToPlanes}
            className="px-6 py-3 rounded-lg font-semibold text-white bg-black hover:bg-gray-800 hover:shadow-lg transition-all"
          >
            Ver Planes
          </button>
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
    </div>
  );
}
