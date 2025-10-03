import React, { useState, useEffect } from 'react';
import { MetricCard } from './MetricCard';
import { OpportunityList } from './OpportunityList';
import { AnalysisData, getLatestAnalysis } from '../lib/api';

interface DashboardProps {
  userName: string | null;
}

// Function to get executive summary personalized with user name
function getExecutiveSummary(userName: string | null, baseSummary: string): string {
  if (userName) {
    return `Hola ${userName}, bienvenido a tu dashboard de Portfolio CEO. Aquí encontrarás métricas clave de tu portafolio de inversiones inmobiliarias.`;
  }
  return baseSummary;
}

export function Dashboard({ userName }: DashboardProps) {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [executiveSummaryResponse, setExecutiveSummaryResponse] = useState<string | null>(null);
  const [planResponse, setPlanResponse] = useState<any>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [creatingPlan, setCreatingPlan] = useState(false);


  useEffect(() => {
    async function fetchData() {
      try {
        const analysisData = await getLatestAnalysis();

        if (!analysisData) {
          setData(null);
          return;
        }

        // Personalize executive summary with user name
        const personalizedData: AnalysisData = {
          ...analysisData,
          analysis: {
            ...analysisData.analysis,
            executive_summary: getExecutiveSummary(userName, analysisData.analysis.executive_summary)
          }
        };
        setData(personalizedData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [userName]);

  const handleGenerateExecutiveSummary = async () => {
    if (!data) return;

    setGeneratingSummary(true);
    try {
      const response = await fetch('https://n8n.srv880021.hstgr.cloud/webhook-test/CeoPremium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate_executive_summary',
          timestamp: new Date().toISOString(),
          userName: userName,
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

  const handleCreatePlan = async () => {
    if (!data) return;

    setCreatingPlan(true);
    try {
      const response = await fetch('https://n8n.srv880021.hstgr.cloud/webhook-test/CeoPremium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create_plan',
          timestamp: new Date().toISOString(),
          userName: userName,
          dashboardData: data
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setPlanResponse(result);

    } catch (error) {
      console.error('Error creating plan:', error);
      setPlanResponse({ error: 'Error al crear el plan.' });
    } finally {
      setCreatingPlan(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">No analysis data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-navy font-dancing-script">{userName || 'PORTFOLIO CEO'}</span>
          <div className="text-right">
            <div className="text-sm text-gray-600 uppercase tracking-wide font-dancing-script">TOTAL PORTFOLIO VALUE</div>
            <div className="text-4xl font-bold text-navy">{data.metrics.portfolio_value}</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-8">
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
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
            }`}
          >
            {generatingSummary ? 'Generando...' : 'Generar Executive Summary'}
          </button>
          <button
            onClick={handleCreatePlan}
            disabled={creatingPlan}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-all ${
              creatingPlan
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'
            }`}
          >
            {creatingPlan ? 'Creando...' : 'CREAR PLAN'}
          </button>
        </div>

        {/* Executive Summary Response */}
        {executiveSummaryResponse && (
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-blue-800">Executive Summary</h2>
              <div className="text-gray-700 whitespace-pre-wrap">{executiveSummaryResponse}</div>
            </div>
          </div>
        )}

        {/* Plan Response */}
        {planResponse && (
          <div className="mb-8">
            <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4 text-green-800">Plan Creado</h2>
              {typeof planResponse === 'object' ? (
                <div className="space-y-2">
                  {Object.entries(planResponse).map(([key, value]) => (
                    <div key={key} className="flex">
                      <span className="font-medium text-green-700 w-1/3">{key}:</span>
                      <span className="text-gray-700">{JSON.stringify(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-700">{planResponse}</div>
              )}
            </div>
          </div>
        )}

        {/* Opportunities and Actions */}
        <OpportunityList data={data} />
      </main>
    </div>
  );
}
