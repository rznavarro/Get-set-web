import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Planes } from './components/Planes';
import { LoginScreen } from './components/LoginScreen';

type AppScreen = 'login' | 'dashboard' | 'planes';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login');
  const [userName, setUserName] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Check initial state on app start
  useEffect(() => {
    const loggedIn = localStorage.getItem('portfolio_ceo_logged_in') === 'true';
    if (loggedIn) {
      setCurrentScreen('dashboard');
      // Load saved name if available
      const savedName = localStorage.getItem('portfolio_ceo_user_name');
      if (savedName) {
        setUserName(savedName);
      }
    } else {
      setCurrentScreen('login');
    }
  }, []);

  const handleLogin = (name: string) => {
    setUserName(name);
    setCurrentScreen('dashboard');
  };


  const navigateToDashboard = () => setCurrentScreen('dashboard');
  const navigateToPlanes = () => setCurrentScreen('planes');
  const handleDataUpdate = (data: any) => setDashboardData(data);

  switch (currentScreen) {
    case 'login':
      return <LoginScreen onLogin={handleLogin} />;
    case 'dashboard':
      return <Dashboard userName={userName} onNavigateToPlanes={navigateToPlanes} onDataUpdate={handleDataUpdate} />;
    case 'planes':
      return <Planes onNavigateToDashboard={navigateToDashboard} dashboardData={dashboardData} userName={userName} />;
    default:
      return <LoginScreen onLogin={handleLogin} />;
  }
}

export default App;
