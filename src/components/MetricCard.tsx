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
    case 'Reach': return <Eye className="w-5 h-5 text-[#D4AF37]" />;
    case 'Interactions': return <MessageCircle className="w-5 h-5 text-[#D4AF37]" />;
    case 'Followers': return <Users className="w-5 h-5 text-[#D4AF37]" />;
    case 'Follower Growth': return <TrendingUp className="w-5 h-5 text-[#D4AF37]" />;
    case 'Reel Views': return <Play className="w-5 h-5 text-[#D4AF37]" />;
    case 'Profile Clicks': return <Link className="w-5 h-5 text-[#D4AF37]" />;
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
    <div className="relative bg-[#0F0F0F]/90 backdrop-blur-sm border border-[#2C2C2C] rounded-xl p-8 hover:border-[#D4AF37] hover:shadow-2xl hover:shadow-[#D4AF37]/20 transition-all duration-500 group overflow-hidden cursor-pointer">
      {/* Subtle glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-[#EAEAEA]/80 uppercase tracking-wider font-['Inter']">
            {title}
          </h3>
          {getIcon(title)}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full text-4xl font-bold bg-transparent border-2 border-[#D4AF37] rounded-lg px-3 py-2 text-[#EAEAEA] font-['Cinzel'] focus:outline-none focus:border-[#F5E6C5]"
              autoFocus
            />
            <div className="flex space-x-2 justify-center">
              <button
                onClick={handleSave}
                className="px-2 py-1 bg-[#D4AF37] text-[#0A0A0A] rounded text-xs font-['Inter'] font-medium hover:bg-[#F5E6C5] transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-2 py-1 bg-[#2C2C2C] text-[#EAEAEA] rounded text-xs font-['Inter'] font-medium hover:bg-[#404040] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            className="text-4xl font-bold text-[#EAEAEA] font-['Cinzel'] group-hover:text-[#D4AF37] transition-colors duration-300 group-hover:drop-shadow-[0_0_20px_rgba(212,175,55,0.6)]"
            onDoubleClick={handleDoubleClick}
            title="Double-click to edit"
          >
            {value}
          </div>
        )}

        {insight && !isEditing && (
          <p className="text-sm text-[#EAEAEA]/60 font-['Inter'] leading-relaxed">
            {insight}
          </p>
        )}
      </div>

      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-xl border border-[#D4AF37]/0 group-hover:border-[#D4AF37]/50 transition-all duration-500"></div>
    </div>
  );
}
