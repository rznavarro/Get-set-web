import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Planes } from './components/Planes';
import { WelcomeScreen } from './components/WelcomeScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { AnalysisData } from './lib/api';

type AppScreen = 'welcome' | 'onboarding' | 'dashboard' | 'planes';

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
  const [userCode] = useState<string>('VORTEXIA');
  const [dashboardData, setDashboardData] = useState<AnalysisData | null>(null);
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetrics | null>(null);

  // Check initial state on app start
  useEffect(() => {
    const accessGranted = localStorage.getItem('access_granted') === 'true';
    const onboardingCompleted = localStorage.getItem('onboarding_completed') === 'true';

    // Load financial metrics from localStorage
    const savedFinancialMetrics = localStorage.getItem('financial_metrics');
    if (savedFinancialMetrics) {
      setFinancialMetrics(JSON.parse(savedFinancialMetrics));
    }

    if (accessGranted && onboardingCompleted) {
      setCurrentScreen('dashboard');
    } else if (accessGranted) {
      setCurrentScreen('onboarding');
    } else {
      setCurrentScreen('welcome');
    }
  }, []);

  const handleAccessGranted = () => {
    setCurrentScreen('onboarding');
  };

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setCurrentScreen('dashboard');
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setCurrentScreen('dashboard');
  };

  const navigateToDashboard = () => setCurrentScreen('dashboard');
  const navigateToPlanes = () => setCurrentScreen('planes');
  const handleDataUpdate = (data: AnalysisData) => setDashboardData(data);
  const handleFinancialMetricsUpdate = (metrics: FinancialMetrics) => setFinancialMetrics(metrics);

  const handleLogout = () => {
    localStorage.removeItem('access_granted');
    localStorage.removeItem('onboarding_completed');
    localStorage.removeItem('user_metrics');
    setCurrentScreen('welcome');
  };

  const handleEditMetrics = () => {
    setCurrentScreen('onboarding');
  };

  switch (currentScreen) {
    case 'welcome':
      return <WelcomeScreen onAccessGranted={handleAccessGranted} />;
    case 'onboarding':
      return <OnboardingScreen userCode={userCode} onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />;
    case 'dashboard':
      return <Dashboard userCode={userCode} onLogout={handleLogout} onEditMetrics={handleEditMetrics} onNavigateToPlanes={navigateToPlanes} onDataLoaded={handleDataUpdate} onFinancialMetricsUpdate={handleFinancialMetricsUpdate} />;
    case 'planes':
      return <Planes onNavigateToDashboard={navigateToDashboard} dashboardData={dashboardData} userName={userCode} userMetrics={JSON.parse(localStorage.getItem('user_metrics') || '{}')} financialMetrics={financialMetrics} />;
    default:
      return <WelcomeScreen onAccessGranted={handleAccessGranted} />;
  }
}

export default App;
