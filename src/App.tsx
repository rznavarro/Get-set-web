import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Planes } from './components/Planes';
import { WelcomeScreen } from './components/WelcomeScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { AnalysisData } from './lib/api';

type AppScreen = 'welcome' | 'dashboard' | 'planes';

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
    setCurrentScreen('dashboard');
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
    setCurrentScreen('welcome');
  };

  switch (currentScreen) {
    case 'welcome':
      return <WelcomeScreen onAccessGranted={handleAccessGranted} />;
    case 'dashboard':
      return <Dashboard userCode={userCode} onLogout={handleLogout} onEditMetrics={() => {}} onNavigateToPlanes={navigateToPlanes} onDataLoaded={handleDataUpdate} />;
    case 'planes':
      return <Planes onNavigateToDashboard={navigateToDashboard} dashboardData={dashboardData} userName={userCode} userMetrics={JSON.parse(localStorage.getItem('user_metrics') || '{}')} financialMetrics={financialMetrics} />;
    default:
      return <WelcomeScreen onAccessGranted={handleAccessGranted} />;
  }
}

export default App;
