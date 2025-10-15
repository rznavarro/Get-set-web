import React, { useState } from 'react';
import { Eye, MessageCircle, Users, TrendingUp, Play, Link } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  insight?: string;
  isOpportunity?: boolean;
  onEdit?: (title: string, currentValue: string) => void;
}

const getIcon = (title: string) => {
  switch (title) {
    case 'Reach': return <Eye className="w-6 h-6 text-gold-primary" />;
    case 'Interactions': return <MessageCircle className="w-6 h-6 text-gold-primary" />;
    case 'Followers': return <Users className="w-6 h-6 text-gold-primary" />;
    case 'Follower Growth': return <TrendingUp className="w-6 h-6 text-gold-primary" />;
    case 'Reel Views': return <Play className="w-6 h-6 text-gold-primary" />;
    case 'Profile Clicks': return <Link className="w-6 h-6 text-gold-primary" />;
    default: return null;
  }
};

export function MetricCard({ title, value, insight, isOpportunity, onEdit }: MetricCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleSave = () => {
    if (onEdit) {
      onEdit(title, editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="relative bg-bg-card/95 backdrop-blur-md border border-border-primary rounded-2xl p-4 shadow-soft touch-feedback gpu-accelerated w-full min-h-[140px] overflow-hidden card-hover">
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold-primary/5 via-transparent to-electric/5 opacity-0 card-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-responsive-sm font-medium text-text-secondary uppercase tracking-wider font-inter leading-tight">
            {title}
          </h3>
          <button
            onClick={handleDoubleClick}
            className="p-2 rounded-full touch-feedback transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center active:bg-gold-primary/20"
            title={`Edit ${title}`}
          >
            {getIcon(title)}
          </button>
        </div>

        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full text-responsive-lg font-bold bg-transparent border-2 border-gold-primary rounded-xl px-3 py-2 text-text-primary font-cinzel focus:outline-none focus:border-gold-secondary min-h-[44px] touch-target"
              autoFocus
            />
            <div className="flex space-x-2 justify-center">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gold-primary text-dark-primary rounded-xl touch-feedback text-responsive-sm font-inter font-medium min-h-[44px] min-w-[80px] active:scale-95 transition-all duration-200"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-border-secondary text-text-primary rounded-xl touch-feedback text-responsive-sm font-inter font-medium min-h-[44px] min-w-[80px] active:scale-95 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            className="text-responsive-lg font-bold text-text-primary font-cinzel card-hover:text-gold-primary transition-colors duration-300 card-hover:drop-shadow-glow-gold leading-tight"
          >
            {value}
          </div>
        )}

        {insight && !isEditing && (
          <p className="text-responsive-sm text-text-muted font-inter leading-snug">
            {insight}
          </p>
        )}
      </div>

      {/* Premium border glow effect */}
      <div className="absolute inset-0 rounded-2xl border border-gold-primary/0 card-hover:border-gold-primary/30 transition-all duration-500"></div>
    </div>
  );
}
