import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Planes } from './components/Planes';
import { WelcomeScreen } from './components/WelcomeScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { AnalysisData } from './lib/api';

type AppScreen = 'login' | 'dashboard' | 'planes';

interface FinancialMetrics {
  current_noi: string;
  noi_opportunity: string;
  portfolio_roi: string;
  vacancy_cost: string;
  turnover_risk: string;
  capex_due: string;
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login');
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
      setCurrentScreen('login');
    }
  }, []);

  const handleAccessGranted = () => {
    setCurrentScreen('login');
    setCountdown(60);

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCurrentScreen('dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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
    setCurrentScreen('login');
  };

  switch (currentScreen) {
    case 'login':
      return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-radial from-[#0F0F0F] via-[#0A0A0A] to-[#050505] opacity-50"></div>

          <div className="relative z-10 text-center">
            {/* Logo */}
            <div className="mb-8">
              <img src="/logo.png" alt="Zyre.Luxe Logo" className="w-20 h-20 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-[#EAEAEA] mb-2 font-['Cinzel']">Zyre.Luxe</h1>
              <p className="text-[#EAEAEA]/70 font-['Inter']">Premium Analytics Access</p>
            </div>

            {/* Countdown Timer */}
            <div className="mb-8">
              <div className="text-8xl font-bold text-[#D4AF37] mb-4 font-['Cinzel'] drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
                {countdown}
              </div>
              <p className="text-[#EAEAEA]/80 font-['Inter'] text-lg">Initializing Dashboard</p>
            </div>

            {/* Progress Bar */}
            <div className="w-80 mx-auto mb-6">
              <div className="bg-[#2C2C2C] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#D4AF37] h-full rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${((60 - countdown) / 60) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Loading Text */}
            <div className="text-[#EAEAEA]/60 font-['Inter'] text-sm">
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
      return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-[#0F0F0F] via-[#0A0A0A] to-[#050505] opacity-50"></div>
          <div className="relative z-10 text-center">
            <div className="mb-8">
              <img src="/logo.png" alt="Zyre.Luxe Logo" className="w-20 h-20 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-[#EAEAEA] mb-2 font-['Cinzel']">Zyre.Luxe</h1>
              <p className="text-[#EAEAEA]/70 font-['Inter']">Premium Analytics Access</p>
            </div>
            <div className="text-8xl font-bold text-[#D4AF37] mb-4 font-['Cinzel'] drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]">
              60
            </div>
            <p className="text-[#EAEAEA]/80 font-['Inter'] text-lg">Initializing Dashboard</p>
          </div>
        </div>
      );
  }
}

export default App;
