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


        {/* Opportunities and Actions */}
        <OpportunityList data={data} />
      </main>
    </div>
  );
}
