import React, { useState, useEffect } from 'react';
import { Plus, X, CreditCard as Edit2, Check, AlertCircle } from 'lucide-react';
import { AnalysisData, CriticalAction, QuickAction, sendPlanToWebhook } from '../lib/api';

interface OpportunityListProps {
  data: AnalysisData;
}

export function OpportunityList({ data }: OpportunityListProps) {
  // Load saved actions from localStorage or use default data
  const loadSavedActions = () => {
    const savedCritical = localStorage.getItem('portfolio_ceo_critical_actions');
    const savedQuick = localStorage.getItem('portfolio_ceo_quick_actions');

    return {
      critical: savedCritical ? JSON.parse(savedCritical) : data.analysis.critical_actions.map((action, index) => ({
        id: `critical-${index}`,
        ...action
      })),
      quick: savedQuick ? JSON.parse(savedQuick) : data.next_30_days.map((action, index) => ({
        id: `quick-${index}`,
        action
      }))
    };
  };

  const savedActions = loadSavedActions();

  const [criticalActions, setCriticalActions] = useState<CriticalAction[]>(savedActions.critical);
  const [quickActions, setQuickActions] = useState<QuickAction[]>(savedActions.quick);

  // Save critical actions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('portfolio_ceo_critical_actions', JSON.stringify(criticalActions));
  }, [criticalActions]);

  // Save quick actions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('portfolio_ceo_quick_actions', JSON.stringify(quickActions));
  }, [quickActions]);

  const [editingCritical, setEditingCritical] = useState<string | null>(null);
  const [editingQuick, setEditingQuick] = useState<string | null>(null);
  const [newCriticalAction, setNewCriticalAction] = useState({
    action: '',
    impact: '',
    urgency: 'medium' as 'high' | 'medium' | 'low',
    details: ''
  });
  const [newQuickAction, setNewQuickAction] = useState('');
  const [showNewCritical, setShowNewCritical] = useState(false);
  const [showNewQuick, setShowNewQuick] = useState(false);

  const addCriticalAction = () => {
    if (newCriticalAction.action.trim()) {
      const newAction: CriticalAction = {
        id: `critical-${Date.now()}`,
        ...newCriticalAction
      };
      setCriticalActions([...criticalActions, newAction]);
      setNewCriticalAction({ action: '', impact: '', urgency: 'medium', details: '' });
      setShowNewCritical(false);
    }
  };

  const addQuickAction = () => {
    if (newQuickAction.trim()) {
      const newAction: QuickAction = {
        id: `quick-${Date.now()}`,
        action: newQuickAction
      };
      setQuickActions([...quickActions, newAction]);
      setNewQuickAction('');
      setShowNewQuick(false);
    }
  };

  const deleteCriticalAction = (id: string) => {
    setCriticalActions(criticalActions.filter(action => action.id !== id));
  };

  const deleteQuickAction = (id: string) => {
    setQuickActions(quickActions.filter(action => action.id !== id));
  };

  const updateCriticalAction = (id: string, updatedAction: Partial<CriticalAction>) => {
    setCriticalActions(criticalActions.map(action => 
      action.id === id ? { ...action, ...updatedAction } : action
    ));
    setEditingCritical(null);
  };

  const updateQuickAction = (id: string, updatedAction: string) => {
    setQuickActions(quickActions.map(action => 
      action.id === id ? { ...action, action: updatedAction } : action
    ));
    setEditingQuick(null);
  };


  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-8">
        <div className="bg-black border border-gray-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white uppercase tracking-wide font-dancing-script">
              Top Opportunities
            </h2>
            <button
              onClick={() => setShowNewCritical(true)}
              className="flex items-center space-x-1 text-white hover:text-yellow-400 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Agregar</span>
            </button>
          </div>
          
          <div className="space-y-4">
            {criticalActions.map((action) => (
              <div key={action.id} className="border-l-4 border-yellow-600 pl-4">
                {editingCritical === action.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={action.action}
                      onChange={(e) => updateCriticalAction(action.id, { action: e.target.value })}
                      className="w-full p-2 border border-gray-600 rounded text-sm bg-gray-800 text-white"
                      placeholder="Acción"
                    />
                    <input
                      type="text"
                      value={action.impact}
                      onChange={(e) => updateCriticalAction(action.id, { impact: e.target.value })}
                      className="w-full p-2 border border-gray-600 rounded text-sm bg-gray-800 text-white"
                      placeholder="Impacto"
                    />
                    <textarea
                      value={action.details}
                      onChange={(e) => updateCriticalAction(action.id, { details: e.target.value })}
                      className="w-full p-2 border border-gray-600 rounded text-sm bg-gray-800 text-white"
                      placeholder="Detalles"
                      rows={2}
                    />
                    <select
                      value={action.urgency}
                      onChange={(e) => updateCriticalAction(action.id, { urgency: e.target.value as 'high' | 'medium' | 'low' })}
                      className="p-2 border border-gray-600 rounded text-sm bg-gray-800 text-white"
                    >
                      <option value="high">Alta</option>
                      <option value="medium">Media</option>
                      <option value="low">Baja</option>
                    </select>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingCritical(null)}
                        className="flex items-center space-x-1 text-white hover:text-yellow-400"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{action.action}</h3>
                      <p className="text-sm text-gray-400 mt-1">{action.details}</p>
                    </div>
                    <div className="ml-4 flex items-center space-x-2">
                      <div className="text-right">
                        <div className="text-lg font-bold text-white">{action.impact}</div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          action.urgency === 'high' ? 'bg-gray-800 text-gray-300' :
                          action.urgency === 'medium' ? 'bg-gray-800 text-gray-300' :
                          'bg-gray-800 text-gray-300'
                        }`}>
                          {action.urgency === 'high' ? 'ALTA' : action.urgency === 'medium' ? 'MEDIA' : 'BAJA'}
                        </span>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <button
                          onClick={() => setEditingCritical(action.id)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCriticalAction(action.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {showNewCritical && (
              <div className="border-l-4 border-gray-600 pl-4 space-y-2">
                <input
                  type="text"
                  value={newCriticalAction.action}
                  onChange={(e) => setNewCriticalAction({ ...newCriticalAction, action: e.target.value })}
                  className="w-full p-2 border border-gray-600 rounded text-sm bg-gray-800 text-white"
                  placeholder="Nueva acción"
                />
                <input
                  type="text"
                  value={newCriticalAction.impact}
                  onChange={(e) => setNewCriticalAction({ ...newCriticalAction, impact: e.target.value })}
                  className="w-full p-2 border border-gray-600 rounded text-sm bg-gray-800 text-white"
                  placeholder="Impacto (ej: +$28K anuales)"
                />
                <textarea
                  value={newCriticalAction.details}
                  onChange={(e) => setNewCriticalAction({ ...newCriticalAction, details: e.target.value })}
                  className="w-full p-2 border border-gray-600 rounded text-sm bg-gray-800 text-white"
                  placeholder="Detalles"
                  rows={2}
                />
                <select
                  value={newCriticalAction.urgency}
                  onChange={(e) => setNewCriticalAction({ ...newCriticalAction, urgency: e.target.value as 'high' | 'medium' | 'low' })}
                  className="p-2 border border-gray-600 rounded text-sm bg-gray-800 text-white"
                >
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
                <div className="flex space-x-2">
                  <button
                    onClick={addCriticalAction}
                    className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                  >
                    Agregar
                  </button>
                  <button
                    onClick={() => setShowNewCritical(false)}
                    className="px-3 py-1 bg-gray-600 text-gray-300 rounded text-sm hover:bg-gray-500"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-black border border-gray-700 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white uppercase tracking-wide font-dancing-script">
              Quick Actions (Next 30 Days)
            </h2>
            <button
              onClick={() => setShowNewQuick(true)}
              className="flex items-center space-x-1 text-white hover:text-yellow-400 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Agregar</span>
            </button>
          </div>
          
          <div className="space-y-3">
            {quickActions.map((action) => (
              <div key={action.id} className="flex items-center justify-between space-x-3">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                  {editingQuick === action.id ? (
                    <input
                      type="text"
                      value={action.action}
                      onChange={(e) => updateQuickAction(action.id, e.target.value)}
                      className="flex-1 p-1 border border-gray-600 rounded text-sm bg-gray-800 text-white"
                      onBlur={() => setEditingQuick(null)}
                      onKeyPress={(e) => e.key === 'Enter' && setEditingQuick(null)}
                      autoFocus
                    />
                  ) : (
                    <span className="text-gray-300 flex-1">{action.action}</span>
                  )}
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setEditingQuick(action.id)}
                    className="text-gray-500 hover:text-white"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteQuickAction(action.id)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {showNewQuick && (
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                <input
                  type="text"
                  value={newQuickAction}
                  onChange={(e) => setNewQuickAction(e.target.value)}
                  className="flex-1 p-2 border border-gray-600 rounded text-sm bg-gray-800 text-white"
                  placeholder="Nueva acción rápida"
                />
                <div className="flex space-x-1">
                  <button
                    onClick={addQuickAction}
                    className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                  >
                    Agregar
                  </button>
                  <button
                    onClick={() => setShowNewQuick(false)}
                    className="px-3 py-1 bg-gray-600 text-gray-300 rounded text-sm hover:bg-gray-500"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
