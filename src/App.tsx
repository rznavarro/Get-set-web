import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Planes } from './components/Planes';
import { WelcomeScreen } from './components/WelcomeScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { AnalysisData } from './lib/api';

type AppScreen = 'welcome' | 'login' | 'dashboard' | 'planes';

interface FinancialMetrics {
  current_noi: string;
  noi_opportunity: string;
  portfolio_roi: string;
  vacancy_cost: string;
  turnover_risk: string;
  capex_due: string;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');
  const [userCode] = useState<string>('Zyre.Luxe');
  const [dashboardData, setDashboardData] = useState<AnalysisData | null>(null);
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetrics | null>(null);
  const [countdown, setCountdown] = useState<number>(60);

  // Check initial state on app start
  useEffect(() => {
    const accessGranted = localStorage.getItem('access_granted') === 'true';

    if (accessGranted) {
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen('welcome');
    }
  }, []);

  const handleAccessGranted = () => {
    setCurrentScreen('login');
    setCountdown(60);

    // Start countdown and preload dashboard data
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Mark as visited and preload dashboard data before showing it
          localStorage.setItem('has_visited_before', 'true');
          preloadDashboardData().then(() => {
            setCurrentScreen('dashboard');
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Function to preload dashboard data
  const preloadDashboardData = async () => {
    try {
      // Preload API data in background
      const { getLatestAnalysis } = await import('./lib/api');
      const analysisData = await getLatestAnalysis();

      if (analysisData) {
        // Preload metrics from localStorage
        const savedMetrics = localStorage.getItem('user_metrics');
        const savedInstagramMetrics = localStorage.getItem('instagram_metrics');

        // Cache the data for immediate use
        sessionStorage.setItem('preloaded_analysis', JSON.stringify(analysisData));
        if (savedMetrics) {
          sessionStorage.setItem('preloaded_user_metrics', savedMetrics);
        }
        if (savedInstagramMetrics) {
          sessionStorage.setItem('preloaded_instagram_metrics', savedInstagramMetrics);
        }
      }
    } catch (error) {
      console.error('Error preloading dashboard data:', error);
    }
  };

  const navigateToDashboard = () => setCurrentScreen('dashboard');
  const navigateToPlanes = (response?: string) => {
    if (response) {
      // Store the response for Planes component
      localStorage.setItem('planes_webhook_response', response);
    }
    setCurrentScreen('planes');
  };
  const handleDataUpdate = (data: AnalysisData) => setDashboardData(data);
  const handleFinancialMetricsUpdate = (metrics: FinancialMetrics) => setFinancialMetrics(metrics);

  const handleLogout = () => {
    localStorage.removeItem('access_granted');
    localStorage.removeItem('user_metrics');
    localStorage.removeItem('instagram_metrics');
    // Keep cached data for instant reload, but remove visit flag to show loading on next login
    localStorage.removeItem('has_visited_before');
    setCurrentScreen('welcome');
  };

  switch (currentScreen) {
    case 'welcome':
      return <WelcomeScreen onAccessGranted={handleAccessGranted} />;
    case 'login':
      return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden p-4 gpu-accelerated">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-radial from-[#0F0F0F] via-[#0A0A0A] to-[#050505] opacity-50"></div>

          <div className="relative z-10 text-center w-full max-w-sm animate-fade-in">
            {/* Logo */}
            <div className="mb-6 xs:mb-8">
              <img src="/logo.png" alt="Zyre.Luxe Logo" className="w-16 h-16 xs:w-20 xs:h-20 mx-auto mb-4" />
              <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-[#EAEAEA] mb-2 font-['Cinzel']">Zyre.Luxe</h1>
              <p className="text-[#EAEAEA]/70 font-['Inter'] text-sm xs:text-base">Premium Analytics Access</p>
            </div>

            {/* Countdown Timer */}
            <div className="mb-6 xs:mb-8">
              <div className="text-6xl xs:text-7xl sm:text-8xl font-bold text-[#D4AF37] mb-4 font-['Cinzel'] drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
                {countdown}
              </div>
              <p className="text-[#EAEAEA]/80 font-['Inter'] text-base xs:text-lg">Initializing Dashboard</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-xs xs:max-w-sm mx-auto mb-4 xs:mb-6">
              <div className="bg-[#2C2C2C] rounded-full h-2 xs:h-3 overflow-hidden">
                <div
                  className="bg-[#D4AF37] h-full rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${((60 - countdown) / 60) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Loading Text */}
            <div className="text-[#EAEAEA]/60 font-['Inter'] text-xs xs:text-sm px-4">
              Preparing your exclusive analytics experience...
            </div>
          </div>
        </div>
      );
    case 'dashboard':
      return <Dashboard userCode={userCode} onLogout={handleLogout} onEditMetrics={() => {}} onNavigateToPlanes={navigateToPlanes} onDataLoaded={handleDataUpdate} />;
    case 'planes':
      return <Planes onNavigateToDashboard={navigateToDashboard} dashboardData={dashboardData} userName={userCode} userMetrics={JSON.parse(localStorage.getItem('user_metrics') || '{}')} financialMetrics={financialMetrics} />;
    default:
      return <WelcomeScreen onAccessGranted={handleAccessGranted} />;
  }
}

export default App;
