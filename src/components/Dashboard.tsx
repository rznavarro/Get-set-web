import React, { useState, useEffect } from 'react';
import { MetricCard } from './MetricCard';
import { OpportunityList } from './OpportunityList';
import { AnalysisData, getLatestAnalysis, regenerateExecutiveSummary } from '../lib/api';
import jsPDF from 'jspdf';

interface FormData {
  investorInfo: {
    fullName: string;
    experienceYears: string;
    primaryMarket: string;
    mainObjective: 'cash_flow' | 'appreciation' | 'both';
  };
  properties: any[];
  goalsAndPriorities: {
    noiTarget: string;
    availableCapital: string;
    mainPriority: string;
  };
  marketInfo: {
    avgRent1BR: string;
    avgRent2BR: string;
    avgRent3BR: string;
    currentInterestRate: string;
  };
  aiGeneratedSummary?: string;
}

interface DashboardProps {
  formData: FormData | null;
}

// Function to calculate real metrics from form data
function calculateRealMetrics(formData: FormData) {
  let totalPortfolioValue = 0;
  let totalMonthlyIncome = 0;
  let totalMonthlyExpenses = 0;
  let totalVacancyCost = 0;
  let totalCapexDue = 0;
  let totalTurnoverRisk = 0;

  // Calculate from properties
  formData.properties.forEach(property => {
    // Portfolio value
    totalPortfolioValue += parseFloat(property.currentValue) || 0;

    // Monthly income from occupied units
    property.units.forEach((unit: any) => {
      if (unit.isOccupied) {
        totalMonthlyIncome += parseFloat(unit.currentRent) || 0;
      } else {
        // Vacancy cost
        totalVacancyCost += parseFloat(unit.marketRent) || 0;
      }
    });

    // Monthly expenses
    const expenses = [
      'propertyTaxes', 'insurance', 'propertyManagement',
      'maintenance', 'utilities', 'marketing', 'otherExpenses'
    ].reduce((sum, exp) => sum + (parseFloat(property[exp]) || 0), 0);
    totalMonthlyExpenses += expenses;

    // CapEx due
    totalCapexDue += (parseFloat(property.deferredRepairs) || 0) + (parseFloat(property.plannedRenovations) || 0);

    // Turnover risk
    if (property.leasesExpiring3Months) {
      totalTurnoverRisk += parseFloat(property.expiringLeasesCount) || 0;
    }
    if (property.latePaymentTenants) {
      totalTurnoverRisk += parseFloat(property.latePaymentCount) || 0;
    }
  });

  const currentNOI = Math.max(0, totalMonthlyIncome - totalMonthlyExpenses);
  const noiOpportunity = Math.max(0, parseFloat(formData.goalsAndPriorities.noiTarget) - currentNOI);

  return {
    portfolio_value: `$${totalPortfolioValue.toLocaleString()}`,
    current_noi: `$${currentNOI.toLocaleString()}`,
    noi_opportunity: `$${noiOpportunity.toLocaleString()}`,
    portfolio_roi: `${((currentNOI * 12 / totalPortfolioValue) * 100).toFixed(1)}%`,
    vacancy_cost: `$${totalVacancyCost.toLocaleString()}`,
    turnover_risk: `${totalTurnoverRisk} units`,
    capex_due: `$${totalCapexDue.toLocaleString()}`
  };
}

// Function to get executive summary (AI-generated or fallback)
function getExecutiveSummary(formData: FormData | null, baseSummary: string): string {
  // If we have AI-generated summary, use it
  if (formData?.aiGeneratedSummary) {
    return formData.aiGeneratedSummary;
  }

  // Fallback to generated summary if no AI summary available
  if (formData) {
    const { investorInfo, goalsAndPriorities } = formData;
    let personalizedSummary = `Hola ${investorInfo.fullName}, como inversionista con ${investorInfo.experienceYears} años de experiencia en ${investorInfo.primaryMarket}`;

    if (investorInfo.mainObjective === 'cash_flow') {
      personalizedSummary += ', enfocado en generar flujo de efectivo';
    } else if (investorInfo.mainObjective === 'appreciation') {
      personalizedSummary += ', enfocado en la apreciación de propiedades';
    } else {
      personalizedSummary += ', buscando tanto flujo de efectivo como apreciación';
    }

    personalizedSummary += `. Tu meta de NOI es $${goalsAndPriorities.noiTarget} y tienes $${goalsAndPriorities.availableCapital} en capital disponible.`;

    return personalizedSummary;
  }

  return baseSummary;
}

export function Dashboard({ formData }: DashboardProps) {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState<string | null>(null);

  const handleRegenerateSummary = async () => {
    if (!formData) return;

    setRegenerating(true);
    try {
      // Send to webhook
      const response = await fetch('https://n8n.srv880021.hstgr.cloud/webhook-test/CeoPremium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'generate_executive_summary',
          timestamp: new Date().toISOString(),
          formData: formData
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const summary = result.executiveSummary || result.summary || 'Resumen generado por AI';

      setGeneratedSummary(summary);

    } catch (error) {
      console.error('Error generating executive summary:', error);
      setGeneratedSummary('Error al generar el resumen ejecutivo.');
    } finally {
      setRegenerating(false);
    }
  };

  const downloadAsPDF = () => {
    if (!generatedSummary) return;
    const doc = new jsPDF();
    doc.text(generatedSummary, 10, 10);
    doc.save('resumen_ejecutivo.pdf');
  };

  const downloadAsWord = () => {
    if (!generatedSummary) return;
    const blob = new Blob([generatedSummary], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resumen_ejecutivo.doc';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const analysisData = await getLatestAnalysis();

        if (!analysisData) {
          setData(null);
          return;
        }

        // Use real calculated metrics from form data
        if (formData) {
          const realMetrics = calculateRealMetrics(formData);
          const personalizedData: AnalysisData = {
            ...analysisData,
            metrics: realMetrics,
            // Generate personalized executive summary based on form data
            analysis: {
              ...analysisData.analysis,
              executive_summary: getExecutiveSummary(formData, analysisData.analysis.executive_summary)
            }
          };
          setData(personalizedData);
        } else {
          setData(analysisData);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [formData]);

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
          <div className="flex items-center space-x-8">
            <span className="text-2xl font-bold text-navy font-dancing-script">PORTFOLIO CEO</span>
            {generatedSummary && (
              <div className="flex items-center space-x-4">
                <span className="text-lg font-semibold text-navy font-dancing-script">Resumenes ejecutivos</span>
                <div className="flex space-x-2">
                  <button
                    onClick={downloadAsPDF}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium"
                  >
                    PDF
                  </button>
                  <button
                    onClick={downloadAsWord}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium"
                  >
                    Word
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 uppercase tracking-wide font-dancing-script">TOTAL PORTFOLIO VALUE</div>
            <div className="text-4xl font-bold text-navy">{data.metrics.portfolio_value}</div>
          </div>
        </div>
        {generatedSummary && (
          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-800">{generatedSummary}</p>
          </div>
        )}
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
