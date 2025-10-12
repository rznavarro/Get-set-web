import React, { useState } from 'react';

interface InstagramMetrics {
   reach: string;
   interactions: string;
   followers: string;
   follower_growth: string;
   reel_views: string;
   profile_clicks: string;
 }

interface MetricEditFormProps {
   currentMetrics: InstagramMetrics | null;
   onSave: (metrics: InstagramMetrics) => void;
   onCancel: () => void;
 }

export function MetricEditForm({ currentMetrics, onSave, onCancel }: MetricEditFormProps) {
  const [metrics, setMetrics] = useState<InstagramMetrics>(currentMetrics || {
    reach: '',
    interactions: '',
    followers: '',
    follower_growth: '',
    reel_views: '',
    profile_clicks: ''
  });

  const handleInputChange = (field: keyof InstagramMetrics, value: string) => {
    setMetrics(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(metrics);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-black border border-gray-700 rounded-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 font-dancing-script">Initial Setup</h1>
          <p className="text-white">Enter your current metrics</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="space-y-4">
             <div>
               <label htmlFor="reach" className="block text-sm font-medium text-white mb-2">
                 Reach
               </label>
               <input
                 type="text"
                 id="reach"
                 value={metrics.reach}
                 onChange={(e) => handleInputChange('reach', e.target.value)}
                 className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent bg-black text-white"
                 placeholder="0"
               />
             </div>

             <div>
               <label htmlFor="interactions" className="block text-sm font-medium text-white mb-2">
                 Interactions
               </label>
               <input
                 type="text"
                 id="interactions"
                 value={metrics.interactions}
                 onChange={(e) => handleInputChange('interactions', e.target.value)}
                 className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent bg-black text-white"
                 placeholder="0"
               />
             </div>

             <div>
               <label htmlFor="followers" className="block text-sm font-medium text-white mb-2">
                 Followers
               </label>
               <input
                 type="text"
                 id="followers"
                 value={metrics.followers}
                 onChange={(e) => handleInputChange('followers', e.target.value)}
                 className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent bg-black text-white"
                 placeholder="0"
               />
             </div>

             <div>
               <label htmlFor="follower_growth" className="block text-sm font-medium text-white mb-2">
                 Growth
               </label>
               <input
                 type="text"
                 id="follower_growth"
                 value={metrics.follower_growth}
                 onChange={(e) => handleInputChange('follower_growth', e.target.value)}
                 className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent bg-black text-white"
                 placeholder="0"
               />
             </div>
           </div>

          <div className="flex space-x-4 pt-6 justify-start">
            <button
              type="submit"
              className="px-6 py-3 rounded-lg font-semibold text-black bg-yellow-600 hover:bg-yellow-700 transition-colors"
            >
              Save and Enter Dashboard
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 rounded-lg font-semibold text-white bg-gray-600 hover:bg-gray-700 transition-colors"
            >
              Skip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}