import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  insight?: string;
  isOpportunity?: boolean;
}

export function MetricCard({ title, value, insight, isOpportunity }: MetricCardProps) {
  return (
    <div className="relative bg-white border border-gray-200 rounded-lg p-8 hover:border-black hover:shadow-sm transition-all duration-200">


      <div className="space-y-2">
        <h3 className="text-sm font-medium text-black uppercase tracking-wide font-dancing-script">
          {title}
        </h3>
        <div className="text-4xl font-bold text-black">
          {value}
        </div>
        {insight && (
          <p className={`text-sm ${isOpportunity ? 'text-black' : 'text-black'}`}>
            {insight}
          </p>
        )}
      </div>
    </div>
  );
}
