
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  trend?: string;
  onClick?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, unit, icon, color, trend, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`glass-card p-5 rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 ${color}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            <span className="text-gray-400 text-xs">{unit}</span>
          </div>
          {trend && (
            <p className="text-xs mt-2 text-emerald-600 font-semibold">{trend}</p>
          )}
        </div>
        <div className="p-3 bg-white rounded-2xl shadow-sm">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
