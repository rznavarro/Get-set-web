import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  insight?: string;
  isOpportunity?: boolean;
}

export function MetricCard({ title, value, insight, isOpportunity }: MetricCardProps) {
  return (
    <div className="relative bg-black border border-gray-700 rounded-lg p-8 hover:border-yellow-600 hover:shadow-sm transition-all duration-200">


      <div className="space-y-2">
        <h3 className="text-sm font-medium text-white uppercase tracking-wide font-dancing-script">
          {title}
        </h3>
        <div className="text-4xl font-bold text-white">
          {value}
        </div>
        {insight && (
          <p className={`text-sm ${isOpportunity ? 'text-white' : 'text-white'}`}>
            {insight}
          </p>
        )}
      </div>
    </div>
  );
}
