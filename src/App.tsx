import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Planes } from './components/Planes';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CreateAccountScreen } from './components/CreateAccountScreen';
import { LoginCodeScreen } from './components/LoginCodeScreen';
import { OnboardingScreen } from './components/OnboardingScreen';

type AppScreen = 'welcome' | 'onboarding' | 'dashboard' | 'planes';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');
  const [userCode, setUserCode] = useState<string>('VORTEXIA');
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Check initial state on app start
  useEffect(() => {
    const accessGranted = localStorage.getItem('access_granted') === 'true';
    const onboardingCompleted = localStorage.getItem('onboarding_completed') === 'true';

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
  const handleDataUpdate = (data: any) => setDashboardData(data);

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
      return <Dashboard userCode={userCode} onLogout={handleLogout} onEditMetrics={handleEditMetrics} onNavigateToPlanes={navigateToPlanes} />;
    case 'planes':
      return <Planes onNavigateToDashboard={navigateToDashboard} dashboardData={dashboardData} userName={userCode} />;
    default:
      return <WelcomeScreen onAccessGranted={handleAccessGranted} />;
  }
}

export default App;
