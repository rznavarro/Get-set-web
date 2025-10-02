import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  insight?: string;
  hasAlert?: boolean;
  isOpportunity?: boolean;
}

export function MetricCard({ title, value, insight, hasAlert, isOpportunity }: MetricCardProps) {
  return (
    <div className="relative bg-white border border-gray-200 rounded-lg p-8 hover:border-navy hover:shadow-sm transition-all duration-200">

      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide font-dancing-script">
          {title}
        </h3>
        <div className="text-4xl font-bold text-black">
          {value}
        </div>
        {insight && (
          <p className={`text-sm ${isOpportunity ? 'text-green-600' : 'text-gray-600'}`}>
            {insight}
          </p>
        )}
      </div>
    </div>
  );
}
