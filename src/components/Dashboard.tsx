import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy, useRef } from 'react';
import { MetricCard } from './MetricCard'; // Import directly for instant render
import { AnalysisData, getLatestAnalysis } from '../lib/api';
const logo = '/logo.png';

// Lazy load only non-critical components
const MetricEditForm = lazy(() => import('./MetricEditForm').then(module => ({ default: module.MetricEditForm })));
const SalesMetricsEditForm = lazy(() => import('./SalesMetricsEditForm').then(module => ({ default: module.SalesMetricsEditForm })));
const GetSetWebChat = lazy(() => import('./ZyreChat').then(module => ({ default: module.GetSetWebChat })));

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
  const [metrics, setMetrics] = useState({ clicks: 0, sales: 0, commissions: 0, ctr: 0 });
  const [showMetricEdit, setShowMetricEdit] = useState(false);
  const [showSalesEdit, setShowSalesEdit] = useState(false);
  const [instagramMetrics, setInstagramMetrics] = useState<InstagramMetrics | null>(null);

  // Pull-to-refresh functionality
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const mainRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    async function loadData() {
      try {
        const analysisData = await getLatestAnalysis();

        if (!analysisData) {
          setData(null);
          return;
        }

        setData(analysisData);
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

    loadData();
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

  // Touch gesture handlers for swipe and tap
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  // Pull-to-refresh handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });

    if (window.scrollY === 0) {
      setStartY(touch.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });

    if (startY > 0 && window.scrollY === 0) {
      const currentY = touch.clientY;
      const distance = Math.max(0, currentY - startY);
      setPullDistance(Math.min(distance * 0.5, 80)); // Dampen and limit pull distance
    }
  };

  const handleTouchEnd = async () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > 50;
    const isRightSwipe = distanceX < -50;
    const isVerticalSwipe = Math.abs(distanceY) > Math.abs(distanceX);

    // Handle pull-to-refresh
    if (pullDistance > 50 && !isRefreshing && !isVerticalSwipe) {
      setIsRefreshing(true);
      try {
        const analysisData = await getLatestAnalysis();
        if (analysisData) {
          setData(analysisData);
          handleDataLoaded(analysisData);
        }
      } catch (error) {
        console.error('Error refreshing data:', error);
      } finally {
        setIsRefreshing(false);
      }
    }

    // Handle swipe gestures (can be extended for carousel navigation)
    if (Math.abs(distanceX) > 50 && Math.abs(distanceY) < 100) {
      if (isLeftSwipe) {
        // Swipe left - could navigate to next metric or action
        console.log('Swipe left detected');
      }
      if (isRightSwipe) {
        // Swipe right - could navigate to previous metric or action
        console.log('Swipe right detected');
      }
    }

    // Reset touch states
    setTouchStart(null);
    setTouchEnd(null);
    setPullDistance(0);
    setStartY(0);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const analysisData = await getLatestAnalysis();
      if (analysisData) {
        setData(analysisData);
        handleDataLoaded(analysisData);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
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

  // Show loading only on first visit (no cached data)
  const hasVisitedBefore = localStorage.getItem('has_visited_before') === 'true';

  if (!data && !hasVisitedBefore) {
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="text-text-primary text-center animate-fade-in">
          <div className="animate-pulse-soft text-3xl mb-4">⚡</div>
          <div className="text-responsive-base font-inter">Loading your premium analytics...</div>
        </div>
      </div>
    );
  }

  // For returning users, show dashboard immediately with cached data
  if (!data && hasVisitedBefore) {
    // Set a flag to show data is loading in background
    setTimeout(() => {
      if (!data) {
        // Reload data in background
        (async () => {
          try {
            const analysisData = await getLatestAnalysis();
            if (analysisData) {
              setData(analysisData);
              handleDataLoaded(analysisData);
              if (!instagramMetrics && analysisData.metrics) {
                setInstagramMetrics(analysisData.metrics);
              }
            }
          } catch (error) {
            console.error('Error loading background data:', error);
          }
        })();
      }
    }, 100);
  }

  return (
    <div className="min-h-screen bg-dark-primary relative overflow-hidden gpu-accelerated smooth-scroll no-horizontal-scroll instant-render">
      {/* Premium background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-bg-card via-dark-primary to-bg-overlay opacity-60"></div>
      {/* Header - Mobile-First Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-border-primary px-4 py-4 backdrop-blur-md bg-bg-card/95 safe-top">
        <div className="flex items-center justify-between max-w-full">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <a
              href="https://www.instagram.com/get_setweb/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 touch-feedback group"
            >
              <img
                src={logo}
                alt="Get Set Web Logo"
                className="h-6 w-6 xs:h-8 xs:w-8 filter brightness-0 invert group-active:brightness-100 group-active:invert-0 transition-all duration-300"
                loading="lazy"
              />
              <span className="text-responsive-lg font-bold text-text-primary font-cinzel group-active:text-gold-primary transition-colors duration-300 truncate">
                Get Set Web
              </span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-gold-primary text-dark-primary rounded-xl touch-feedback text-responsive-sm font-inter font-medium shadow-soft min-h-[44px] min-w-[80px] active:scale-95 transition-all duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Pull-to-refresh indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 flex items-center space-x-2 bg-bg-card/95 backdrop-blur-md px-4 py-2 rounded-full border border-border-primary shadow-soft">
          <div className={`pull-refresh-indicator transition-transform duration-300 ${isRefreshing ? 'pulling' : ''}`}>
            <svg className="w-5 h-5 text-gold-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <span className="text-responsive-sm text-text-secondary font-inter">
            {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
          </span>
        </div>
      )}

      {/* Main Content */}
      <main
        ref={mainRef}
        className="relative z-10 px-4 py-6 animate-slide-up safe-bottom"
        style={{
          transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : 'translateY(0)',
          transition: isRefreshing ? 'none' : 'transform 0.3s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Metrics Summary - Mobile-First Design */}
        <div className="mb-6">
          <div className="bg-bg-card/95 backdrop-blur-md border border-border-primary p-4 rounded-2xl shadow-soft">
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-responsive-lg font-semibold text-text-primary font-cinzel tracking-wide">Your Current Metrics</h2>
                <button
                  onClick={() => setShowSalesEdit(true)}
                  className="px-4 py-2 bg-gold-primary text-dark-primary rounded-xl touch-feedback text-responsive-sm font-inter font-medium shadow-soft min-h-[44px] min-w-[100px] active:scale-95 transition-all duration-200"
                >
                  Edit Metrics
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center py-3 touch-feedback active:scale-95 transition-all duration-200">
                  <div className="text-responsive-xl font-bold text-gold-primary mb-2 font-cinzel drop-shadow-glow-gold">{metrics.clicks}</div>
                  <div className="text-responsive-xs text-text-muted font-inter uppercase tracking-wider">Clicks</div>
                </div>
                <div className="text-center py-3 touch-feedback active:scale-95 transition-all duration-200">
                  <div className="text-responsive-xl font-bold text-gold-primary mb-2 font-cinzel drop-shadow-glow-gold">{metrics.sales}</div>
                  <div className="text-responsive-xs text-text-muted font-inter uppercase tracking-wider">Sales</div>
                </div>
                <div className="text-center py-3 touch-feedback active:scale-95 transition-all duration-200">
                  <div className="text-responsive-xl font-bold text-gold-primary mb-2 font-cinzel drop-shadow-glow-gold">{metrics.commissions}</div>
                  <div className="text-responsive-xs text-text-muted font-inter uppercase tracking-wider">Commissions</div>
                </div>
                <div className="text-center py-3 touch-feedback active:scale-95 transition-all duration-200">
                  <div className="text-responsive-xl font-bold text-gold-primary mb-2 font-cinzel drop-shadow-glow-gold">{metrics.ctr}</div>
                  <div className="text-responsive-xs text-text-muted font-inter uppercase tracking-wider">CTR</div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Instagram Metrics - Mobile-First Hierarchical Layout */}
        {instagramMetrics && (
          <Suspense fallback={
            <div className="space-y-4 mb-8">
              {/* Skeleton screens for progressive loading */}
              <div className="bg-bg-card/90 backdrop-blur-sm border border-border-primary rounded-2xl p-4 skeleton min-h-[140px]"></div>
              <div className="bg-bg-card/90 backdrop-blur-sm border border-border-primary rounded-2xl p-4 skeleton min-h-[140px]"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-bg-card/90 backdrop-blur-sm border border-border-primary rounded-2xl p-4 skeleton min-h-[140px]"></div>
                <div className="bg-bg-card/90 backdrop-blur-sm border border-border-primary rounded-2xl p-4 skeleton min-h-[140px]"></div>
              </div>
              <div className="bg-bg-card/90 backdrop-blur-sm border border-border-primary rounded-2xl p-4 skeleton min-h-[140px]"></div>
              <div className="bg-bg-card/90 backdrop-blur-sm border border-border-primary rounded-2xl p-4 skeleton min-h-[140px]"></div>
            </div>
          }>
            {/* Mobile Layout (<768px): Hierarchical stacking */}
            <div className="space-y-4 mb-8 md:hidden">
              {/* Primary Metrics - Full width */}
              <MetricCard
                title="Reach"
                value={instagramMetrics.reach}
                insight="Unique accounts reached"
                onEdit={handleMetricEdit}
              />

              <MetricCard
                title="Followers"
                value={instagramMetrics.followers}
                insight="Current follower count"
                onEdit={handleMetricEdit}
              />

              {/* Secondary Metrics - 2 column grid */}
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  title="Interactions"
                  value={instagramMetrics.interactions}
                  insight="Total engagement"
                  isOpportunity={true}
                  onEdit={handleMetricEdit}
                />
                <MetricCard
                  title="Profile Clicks"
                  value={instagramMetrics.profile_clicks}
                  insight="Link clicks from profile"
                  onEdit={handleMetricEdit}
                />
              </div>

              {/* Tertiary Metrics - Full width */}
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
            </div>

            {/* Tablet/Desktop Layout (≥768px): Optimized grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
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
          </Suspense>
        )}




      </main>

      {/* FAB for main actions - Mobile-first approach */}
      <button
        onClick={handleNavigateToPlanes}
        className="fab bg-gradient-gold text-dark-primary shadow-glow-gold-strong touch-feedback"
        aria-label="Navigate to Planes"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      </button>

      {/* Pull-to-refresh button for desktop */}
      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="hidden md:flex fixed top-24 right-6 z-40 items-center space-x-2 bg-bg-card/95 backdrop-blur-md px-4 py-2 rounded-xl border border-border-primary shadow-soft touch-feedback disabled:opacity-50"
        aria-label="Refresh data"
      >
        <svg className={`w-5 h-5 text-gold-primary transition-transform duration-300 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span className="text-responsive-sm text-text-secondary font-inter">
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </span>
      </button>

      {/* Lazy loaded components with Suspense for instant initial render */}
      <Suspense fallback={null}>
        <GetSetWebChat />
      </Suspense>

      {showMetricEdit && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="animate-pulse text-[#EAEAEA]">Loading...</div>
          </div>
        }>
          <MetricEditForm
            currentMetrics={instagramMetrics}
            onSave={handleSaveMetrics}
            onCancel={handleCancelMetricEdit}
          />
        </Suspense>
      )}

      {showSalesEdit && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="animate-pulse text-[#EAEAEA]">Loading...</div>
          </div>
        }>
          <SalesMetricsEditForm
            currentMetrics={metrics}
            onSave={handleSaveSalesMetrics}
            onCancel={handleCancelSalesEdit}
          />
        </Suspense>
      )}
    </div>
  );
}
