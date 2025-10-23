import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass?: string;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass = 'text-gray-800', description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4" title={description}>
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
        <p className={`text-2xl font-semibold ${colorClass}`}>{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
