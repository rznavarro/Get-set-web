import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { LoginScreen } from './components/LoginScreen';

type AppScreen = 'login' | 'dashboard';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login');
  const [userName, setUserName] = useState<string | null>(null);

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


  switch (currentScreen) {
    case 'login':
      return <LoginScreen onLogin={handleLogin} />;
    case 'dashboard':
      return <Dashboard userName={userName} />;
    default:
      return <LoginScreen onLogin={handleLogin} />;
  }
}

export default App;
