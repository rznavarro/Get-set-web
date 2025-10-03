import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Planes } from './components/Planes';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CreateAccountScreen } from './components/CreateAccountScreen';
import { LoginCodeScreen } from './components/LoginCodeScreen';
import { OnboardingScreen } from './components/OnboardingScreen';

type AppScreen = 'welcome' | 'createAccount' | 'loginCode' | 'onboarding' | 'dashboard' | 'planes';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('welcome');
  const [userCode, setUserCode] = useState<string>('');
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Check initial state on app start
  useEffect(() => {
    const savedCode = localStorage.getItem('user_code');
    const onboardingCompleted = localStorage.getItem('onboarding_completed') === 'true';

    if (savedCode && onboardingCompleted) {
      setUserCode(savedCode);
      setCurrentScreen('dashboard');
    } else if (savedCode) {
      setUserCode(savedCode);
      setCurrentScreen('onboarding');
    } else {
      setCurrentScreen('welcome');
    }
  }, []);

  const handleCreateAccount = () => setCurrentScreen('createAccount');
  const handleLogin = () => setCurrentScreen('loginCode');

  const handleAccountCreated = (code: string) => {
    setUserCode(code);
    setCurrentScreen('onboarding');
  };

  const handleCodeLogin = (code: string) => {
    setUserCode(code);
    const onboardingCompleted = localStorage.getItem('onboarding_completed') === 'true';
    if (onboardingCompleted) {
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen('onboarding');
    }
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
    localStorage.removeItem('user_code');
    localStorage.removeItem('onboarding_completed');
    localStorage.removeItem('user_metrics');
    setUserCode('');
    setCurrentScreen('welcome');
  };

  const handleEditMetrics = () => {
    setCurrentScreen('onboarding');
  };

  switch (currentScreen) {
    case 'welcome':
      return <WelcomeScreen onCreateAccount={handleCreateAccount} onLogin={handleLogin} />;
    case 'createAccount':
      return <CreateAccountScreen onAccountCreated={handleAccountCreated} onBack={() => setCurrentScreen('welcome')} />;
    case 'loginCode':
      return <LoginCodeScreen onLoginSuccess={handleCodeLogin} onBack={() => setCurrentScreen('welcome')} />;
    case 'onboarding':
      return <OnboardingScreen userCode={userCode} onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />;
    case 'dashboard':
      return <Dashboard userCode={userCode} onLogout={handleLogout} onEditMetrics={handleEditMetrics} onNavigateToPlanes={navigateToPlanes} />;
    case 'planes':
      return <Planes onNavigateToDashboard={navigateToDashboard} dashboardData={dashboardData} userName={userCode} />;
    default:
      return <WelcomeScreen onCreateAccount={handleCreateAccount} onLogin={handleLogin} />;
  }
}

export default App;
