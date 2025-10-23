import React from 'react';
import StatCard from './StatCard';

interface GlobalStatsProps {
  stats: {
    totalAirports: number;
    airportsWithActions: number;
    inProgressIntegrations: number;
    totalActuaciones: number;
  };
}

const BuildingIcon = () => (
    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-4h1m-1 4h1m-1-4h1m-1-4h1"></path></svg>
);

const ClipboardListIcon = () => (
    <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
);

const RunningIcon = () => (
    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);

const GlobalStats: React.FC<GlobalStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Aeropuertos"
        value={stats.totalAirports}
        icon={<BuildingIcon />}
        description="Número total de aeropuertos gestionados en el portal."
      />
      <StatCard
        title="Aeropuertos con Actuaciones"
        value={stats.airportsWithActions}
        icon={<BuildingIcon />}
        description="Número de aeropuertos que tienen al menos una actuación asociada."
      />
      <StatCard
        title="Integraciones en Curso"
        value={stats.inProgressIntegrations}
        icon={<RunningIcon />}
        colorClass="text-blue-600"
        description="Aeropuertos con estado de integración 'En curso'."
      />
      <StatCard
        title="Actuaciones Totales"
        value={stats.totalActuaciones}
        icon={<ClipboardListIcon />}
        description="Suma de todas las actuaciones en todos los aeropuertos."
      />
    </div>
  );
};

export default GlobalStats;