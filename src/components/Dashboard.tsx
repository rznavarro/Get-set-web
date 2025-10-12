import React, { useState, useEffect, useCallback } from 'react';
import { MetricCard } from './MetricCard';
import { MetricEditForm } from './MetricEditForm';
import { SalesMetricsEditForm } from './SalesMetricsEditForm';
import { AnalysisData, getLatestAnalysis } from '../lib/api';
const logo = '/logo.png';

interface InstagramMetrics {
   reach: string;
   interactions: string;
   followers: string;
   follower_growth: string;
   reel_views: string;
   profile_clicks: string;
 }

interface DashboardProps {
  userCode: string;
  onLogout: () => void;
  onEditMetrics: () => void;
  onNavigateToPlanes: (response?: string) => void;
  onDataLoaded?: (data: AnalysisData) => void;
  onInstagramMetricsUpdate?: (metrics: InstagramMetrics) => void;
}


export function Dashboard({ userCode, onLogout, onEditMetrics, onNavigateToPlanes, onDataLoaded, onInstagramMetricsUpdate }: DashboardProps) {
  const handleDataLoaded = useCallback((data: AnalysisData) => {
    if (onDataLoaded) {
      onDataLoaded(data);
    }
  }, [onDataLoaded]);
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    clicks: 0,
    sales: 0,
    commissions: 0,
    ctr: 0
  });
  const [showMetricEdit, setShowMetricEdit] = useState(false);
  const [showSalesEdit, setShowSalesEdit] = useState(false);
  const [instagramMetrics, setInstagramMetrics] = useState<InstagramMetrics | null>(null);


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

        // Load instagram metrics from localStorage or initialize from API data
         const savedInstagramMetrics = localStorage.getItem('instagram_metrics');
         if (savedInstagramMetrics) {
           setInstagramMetrics(JSON.parse(savedInstagramMetrics));
         } else {
           // Initialize with API data if no saved data exists
           setInstagramMetrics(analysisData.metrics);
         }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);


  const handleSaveMetrics = (newMetrics: InstagramMetrics) => {
     setInstagramMetrics(newMetrics);
     localStorage.setItem('instagram_metrics', JSON.stringify(newMetrics));
     if (onInstagramMetricsUpdate) {
       onInstagramMetricsUpdate(newMetrics);
     }
     setShowMetricEdit(false);
   };

  const handleMetricEdit = (title: string, newValue: string) => {
    if (!instagramMetrics) return;

    const updatedMetrics = { ...instagramMetrics };

    // Map title to metric key
    switch (title) {
      case 'Reach':
        updatedMetrics.reach = newValue;
        break;
      case 'Interactions':
        updatedMetrics.interactions = newValue;
        break;
      case 'Followers':
        updatedMetrics.followers = newValue;
        break;
      case 'Follower Growth':
        updatedMetrics.follower_growth = newValue;
        break;
      case 'Reel Views':
        updatedMetrics.reel_views = newValue;
        break;
      case 'Profile Clicks':
        updatedMetrics.profile_clicks = newValue;
        break;
    }

    setInstagramMetrics(updatedMetrics);
    localStorage.setItem('instagram_metrics', JSON.stringify(updatedMetrics));
    if (onInstagramMetricsUpdate) {
      onInstagramMetricsUpdate(updatedMetrics);
    }
  };

  const handleSaveSalesMetrics = (newMetrics: { clicks: number; sales: number; commissions: number; ctr: number }) => {
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

    // Build dashboard text representation
    const dashboardText = `
Your Current Metrics
${userMetrics.clicks}
Clicks
${userMetrics.sales}
Sales
${userMetrics.commissions}
Commissions
${userMetrics.ctr}
CTR

EXECUTIVE SUMMARY
${data?.analysis.executive_summary}

Reach
${instagramMetrics?.reach}
Unique accounts reached

Interactions
${instagramMetrics?.interactions}
Total engagement

Followers
${instagramMetrics?.followers}
Current follower count

Follower Growth
${instagramMetrics?.follower_growth}
Growth in last 7 days

Reel Views
${instagramMetrics?.reel_views}
Total video views

Profile Clicks
${instagramMetrics?.profile_clicks}
Link clicks from profile

Top Opportunities
${topOpportunities.map((opp: any) => `
${opp.titulo}
${opp.descripcion}
${opp.valor_anual}
${opp.prioridad}
`).join('')}

Quick Actions (Next 30 Days)
${quickActionsFormatted.map((action: any) => `
${action.descripcion}
`).join('')}
    `.trim();

    const currentData = {
      action: 'navigate_to_planes',
      timestamp: new Date().toISOString(),
      userCode: userCode,
      executiveSummary: data?.analysis.executive_summary,
      metricas: {
        reach: instagramMetrics?.reach,
        interactions: instagramMetrics?.interactions,
        followers: instagramMetrics?.followers,
        follower_growth: instagramMetrics?.follower_growth,
        reel_views: instagramMetrics?.reel_views,
        profile_clicks: instagramMetrics?.profile_clicks,
        clicks: userMetrics.clicks,
        sales: userMetrics.sales,
        commissions: userMetrics.commissions,
        ctr: userMetrics.ctr
      },
      instagram_metrics_details: [
        {
          title: "Reach",
          value: instagramMetrics?.reach,
          description: "Unique accounts reached"
        },
        {
          title: "Interactions",
          value: instagramMetrics?.interactions,
          description: "Total engagement"
        },
        {
          title: "Followers",
          value: instagramMetrics?.followers,
          description: "Current follower count"
        },
        {
          title: "Follower Growth",
          value: instagramMetrics?.follower_growth,
          description: "Growth in last 7 days"
        },
        {
          title: "Reel Views",
          value: instagramMetrics?.reel_views,
          description: "Total video views"
        },
        {
          title: "Profile Clicks",
          value: instagramMetrics?.profile_clicks,
          description: "Link clicks from profile"
        }
      ],
      dashboard_text: dashboardText,
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
      console.error('Error sending data to CeoPremium:', error);
      responseText = `Error: ${error}`;
    }

    onNavigateToPlanes(responseText);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">No analysis data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-[#0F0F0F] via-[#0A0A0A] to-[#050505] opacity-50"></div>
      {/* Header */}
      <header className="relative z-10 border-b border-[#2C2C2C] px-8 py-6 backdrop-blur-sm bg-[#0F0F0F]/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <a
              href="https://www.instagram.com/zyre.luxe/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:opacity-80 transition-all duration-300 group"
            >
              <img src={logo} alt="Zyre.Luxe Logo" className="h-8 w-8 filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-300" />
              <span className="text-2xl font-bold text-[#EAEAEA] font-['Cinzel'] group-hover:text-[#D4AF37] transition-colors duration-300">Zyre.Luxe</span>
            </a>
            <div className="ml-4">
              <p className="text-xs text-[#EAEAEA]/70 font-['Inter'] italic">Data that speaks. Intelligence that sells.</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-[#D4AF37] text-[#0A0A0A] rounded-lg hover:bg-[#F5E6C5] transition-all duration-300 text-sm font-['Inter'] font-medium shadow-lg hover:shadow-[#D4AF37]/30"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-8 py-8">
        {/* Metrics Summary */}
        <div className="mb-8">
          <div className="bg-[#0F0F0F]/90 backdrop-blur-sm border border-[#2C2C2C] p-6 rounded-2xl shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-[#EAEAEA] font-['Cinzel'] tracking-wide">Your Current Metrics</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center group">
                  <div className="text-2xl font-bold text-[#D4AF37] mb-1 transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">{metrics.clicks}</div>
                  <div className="text-xs text-[#EAEAEA]/70 font-['Inter'] uppercase tracking-wider">Clicks</div>
                </div>
                <div className="text-center group">
                  <div className="text-2xl font-bold text-[#D4AF37] mb-1 transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">{metrics.sales}</div>
                  <div className="text-xs text-[#EAEAEA]/70 font-['Inter'] uppercase tracking-wider">Sales</div>
                </div>
                <div className="text-center group">
                  <div className="text-2xl font-bold text-[#D4AF37] mb-1 transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">{metrics.commissions}</div>
                  <div className="text-xs text-[#EAEAEA]/70 font-['Inter'] uppercase tracking-wider">Commissions</div>
                </div>
                <div className="text-center group">
                  <div className="text-2xl font-bold text-[#D4AF37] mb-1 transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]">{metrics.ctr}</div>
                  <div className="text-xs text-[#EAEAEA]/70 font-['Inter'] uppercase tracking-wider">CTR</div>
                </div>
            </div>
          </div>
        </div>


        {/* Metrics Grid */}
        {instagramMetrics && (
          <div className="grid grid-cols-3 gap-8 mb-12">
            <MetricCard
              title="Reach"
              value={instagramMetrics.reach}
              insight="Unique accounts reached"
              onEdit={handleMetricEdit}
            />
            <MetricCard
              title="Interactions"
              value={instagramMetrics.interactions}
              insight="Total engagement"
              isOpportunity={true}
              onEdit={handleMetricEdit}
            />
            <MetricCard
              title="Followers"
              value={instagramMetrics.followers}
              insight="Current follower count"
              onEdit={handleMetricEdit}
            />
            <MetricCard
              title="Follower Growth"
              value={instagramMetrics.follower_growth}
              insight="Growth in last 7 days"
              onEdit={handleMetricEdit}
            />
            <MetricCard
              title="Reel Views"
              value={instagramMetrics.reel_views}
              insight="Total video views"
              onEdit={handleMetricEdit}
            />
            <MetricCard
              title="Profile Clicks"
              value={instagramMetrics.profile_clicks}
              insight="Link clicks from profile"
              onEdit={handleMetricEdit}
            />
          </div>
        )}




      </main>

      {showMetricEdit && (
         <MetricEditForm
           currentMetrics={instagramMetrics}
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
