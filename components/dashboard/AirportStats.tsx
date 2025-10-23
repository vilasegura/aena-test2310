import React from 'react';
import StatCard from './StatCard';
import { Airport } from '../../types';

interface AirportStatsProps {
  stats: {
    actuacionesCount: number;
    integrationStatus: Airport['integrationStatus'];
    p11ModelsCount: number;
    aimTransfersCount: number;
  };
}

const ActuacionesIcon = () => (
    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
);
const StatusIcon: React.FC<{status: Airport['integrationStatus']}> = ({status}) => {
    const statusConfig = {
        'Finalizado': { icon: <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> },
        'En curso': { icon: <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> },
        'Por iniciar': { icon: <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> },
    };
    return statusConfig[status].icon;
};
const ModelIcon = () => (
    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
);
const TransferIcon = () => (
    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
);

const AirportStats: React.FC<AirportStatsProps> = ({ stats }) => {

    const statusConfig = {
        'Finalizado': { color: 'text-green-600', text: 'Finalizado' },
        'En curso': { color: 'text-blue-600', text: 'En curso' },
        'Por iniciar': { color: 'text-gray-600', text: 'Por iniciar' },
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
                title="Actuaciones en Curso"
                value={stats.actuacionesCount}
                icon={<ActuacionesIcon />}
            />
            <StatCard
                title="Estado de Integración"
                value={statusConfig[stats.integrationStatus].text}
                icon={<StatusIcon status={stats.integrationStatus} />}
                colorClass={statusConfig[stats.integrationStatus].color}
            />
            <StatCard
                title="Modelos P1.1 Recibidos"
                value={stats.p11ModelsCount}
                icon={<ModelIcon />}
            />
            <StatCard
                title="Traspasos AIM"
                value={stats.aimTransfersCount}
                icon={<TransferIcon />}
            />
        </div>
    );
};

export default AirportStats;