import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { PropertyInvestmentForm } from './components/PropertyInvestmentForm';
import { LoginScreen } from './components/LoginScreen';
import { saveFormDataToSupabase, getInvestorData, saveAnalysisData } from './lib/api';

interface FormData {
  investorInfo: {
    fullName: string;
    experienceYears: string;
    primaryMarket: string;
    mainObjective: 'cash_flow' | 'appreciation' | 'both';
  };
  properties: any[];
  goalsAndPriorities: {
    noiTarget: string;
    availableCapital: string;
    mainPriority: string;
  };
  marketInfo: {
    avgRent1BR: string;
    avgRent2BR: string;
    avgRent3BR: string;
    currentInterestRate: string;
  };
}

type AppScreen = 'login' | 'dashboard';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login');
  const [formData, setFormData] = useState<FormData | null>(null);

  // Check initial state on app start
  useEffect(() => {
    const loggedIn = localStorage.getItem('portfolio_ceo_logged_in') === 'true';
    if (loggedIn) {
      setCurrentScreen('dashboard');
      // Load saved data if available
      const savedFormData = localStorage.getItem('portfolio_ceo_form_data');
      if (savedFormData) {
        try {
          const parsedData = JSON.parse(savedFormData);
          setFormData(parsedData);
        } catch (error) {
          console.error('Error parsing saved form data:', error);
        }
      }
    } else {
      setCurrentScreen('login');
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('portfolio_ceo_logged_in', 'true');
    setCurrentScreen('dashboard');
    // Load data if available
    const savedFormData = localStorage.getItem('portfolio_ceo_form_data');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    try {
      // Save form data to Supabase
      const saveResult = await saveFormDataToSupabase(data);

      if (!saveResult.success) {
        console.error('Error saving to Supabase:', saveResult.error);
        // Fallback to localStorage if Supabase fails
        setFormData(data);
        setCurrentScreen('dashboard');
        localStorage.setItem('portfolio_ceo_form_data', JSON.stringify(data));
        return;
      }

      const investorId = saveResult.investorId!;

      // Use static executive summary
      const analysisData = {
        analysis: {
          executive_summary: "EXECUTIVE SUMMARY Hola Joaquin felipe , como inversionista con 8 años de experiencia en Estados unidos,Miami, enfocado en la apreciación de propiedades. Tu meta de NOI es $18000000 y tienes $5600000 en capital disponible.",
          critical_actions: []
        },
        metrics: {
          portfolio_value: "",
          current_noi: "",
          noi_opportunity: "",
          vacancy_cost: "",
          turnover_risk: "",
          capex_due: "",
          portfolio_roi: ""
        },
        next_30_days: []
      };

      await saveAnalysisData(investorId, analysisData);

      // Save form data with generated summary
      const dataWithSummary = {
        ...data,
        aiGeneratedSummary: analysisData.analysis.executive_summary,
        investorId // Store investor ID for future reference
      };

      setFormData(dataWithSummary);
      setCurrentScreen('dashboard');

      // Also save to localStorage as backup
      localStorage.setItem('portfolio_ceo_form_data', JSON.stringify(dataWithSummary));
      localStorage.setItem('portfolio_ceo_investor_id', investorId);
    } catch (error) {
      console.error('Error in form submission:', error);
      // Proceed to dashboard even if everything fails
      setFormData(data);
      setCurrentScreen('dashboard');
      localStorage.setItem('portfolio_ceo_form_data', JSON.stringify(data));
    }
  };

  switch (currentScreen) {
    case 'login':
      return <LoginScreen onLogin={handleLogin} />;
    case 'dashboard':
      if (!formData) {
        return <PropertyInvestmentForm onSubmit={handleFormSubmit} />;
      } else {
        return <Dashboard formData={formData} />;
      }
    default:
      return <LoginScreen onLogin={handleLogin} />;
  }
}

export default App;
