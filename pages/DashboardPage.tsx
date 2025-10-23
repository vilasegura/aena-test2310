

import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockAirports, mockActuaciones, mockActuacionesDetail, mockP11ModelReceptions, mockDataTransfers, mockAimTransfers } from '../data';
import GlobalStats from '../components/dashboard/GlobalStats';
import Card from '../components/ui/Card';
import { AimTransfer } from '../types';

// Icons for Quick Access
const AirportIcon = () => (
    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-4h1m-1 4h1m-1-4h1m-1-4h1"></path></svg>
);
const RequirementsIcon = () => (
    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
);

// --- Status Icons for Activity List ---
const SmallSuccessIcon = () => (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const SmallFailureIcon = () => (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const SmallRunningIcon = () => (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const SmallInfoIcon = () => (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const SmallWarningIcon = () => (<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>);

const statusConfig = {
    success: { icon: <SmallSuccessIcon />, color: 'text-green-600', bg: 'bg-green-100' },
    failure: { icon: <SmallFailureIcon />, color: 'text-red-600', bg: 'bg-red-100' },
    running: { icon: <SmallRunningIcon />, color: 'text-blue-600', bg: 'bg-blue-100' },
    info: { icon: <SmallInfoIcon />, color: 'text-gray-600', bg: 'bg-gray-100' },
    warning: { icon: <SmallWarningIcon />, color: 'text-orange-500', bg: 'bg-orange-100' },
};

const QuickAccessCard: React.FC<{ to: string; title: string; description: string; icon: React.ReactNode; color: string }> = ({ to, title, description, icon, color }) => (
    <Link to={to} className={`group block p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${color}`}>
        <div className="flex items-center">
            {icon}
            <div className="ml-4">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <p className="text-white opacity-90 mt-1">{description}</p>
            </div>
        </div>
    </Link>
);

const formatDateAgo = (date: Date) => {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `Hace un momento`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes} min`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} h`;

    const days = Math.floor(hours / 24);
    return `Hace ${days} d`;
};

const generateRecentDate = (daysAgo: number, hoursAgo: number = 0, minutesAgo: number = 0): Date => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    date.setHours(date.getHours() - hoursAgo);
    date.setMinutes(date.getMinutes() - minutesAgo);
    // Add some randomness to minutes
    date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 59));
    return date;
};

// Main Process Icons
const Process1Icon = () => ( // PIM -> AIM
    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg text-blue-600">
        <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
        </svg>
    </div>
);
const Process2Icon = () => ( // Export
    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-indigo-100 rounded-lg text-indigo-600">
        <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9A2.25 2.25 0 0018.75 19.5v-9a2.25 2.25 0 00-2.25-2.25H15M12 9V2.25M12 9l3-3m-3 3l-3-3" />
        </svg>
    </div>
);
const Process3Icon = () => ( // Import
    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-teal-100 rounded-lg text-teal-600">
        <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 13.5l3 3m0 0l3-3m-3 3v-6m1.06-4.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
        </svg>
    </div>
);
const Process4Icon = () => ( // AIM -> PIM (Return)
    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-rose-100 rounded-lg text-rose-600">
        <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
        </svg>
    </div>
);


const DashboardPage: React.FC = () => {
    const globalStats = useMemo(() => {
        const totalAirports = mockAirports.length;
        const airportsWithActions = mockAirports.filter(a => a.actionCount > 0).length;
        const inProgressIntegrations = mockAirports.filter(a => a.integrationStatus === 'En curso').length;
        const totalActuaciones = mockActuacionesDetail.length;
        return { totalAirports, airportsWithActions, inProgressIntegrations, totalActuaciones };
    }, []);
    
    const mainProcesses = useMemo(() => {
        // P1.1
        const p11ByAirport = mockP11ModelReceptions
            .sort((a, b) => new Date(b.dateReceived).getTime() - new Date(a.dateReceived).getTime())
            .slice(0, 5)
            .reduce((acc, item) => {
                const airportName = mockAirports.find(a => a.id === item.iata)?.name || item.iata;
                if (!acc[airportName]) acc[airportName] = [];
                acc[airportName].push({ id: item.id, description: `Recibido: ${item.modelName}`, date: new Date(item.dateReceived), status: 'info' });
                return acc;
            }, {} as Record<string, any[]>);

        // P1.2
        const p12ByAirport = mockAimTransfers
            .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 5)
            .reduce((acc, item) => {
                const airportName = mockAirports.find(a => a.id === item.iata)?.name || item.iata;
                if (!acc[airportName]) acc[airportName] = [];
                const statusLabels: Record<AimTransfer['status'], string> = {
                    'Pendiente': 'Pendiente',
                    'en integración': 'En Integración',
                    'finalizado': 'Finalizado',
                };
                acc[airportName].push({ id: item.id, description: `Traspaso exped. ${item.expediente} (${statusLabels[item.status]})`, date: new Date(item.timestamp), status: item.status === 'finalizado' ? 'success' : 'warning' });
                return acc;
            }, {} as Record<string, any[]>);

        // P2 GMAO
        const gmaoByAirport = mockDataTransfers
            .filter(t => t.toSystem === 'GMAO')
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 5)
            .reduce((acc, item) => {
                const actuacion = mockActuaciones.find(act => act.id === item.actuacionId);
                if (!actuacion) return acc;
                const airportName = mockAirports.find(a => a.id === actuacion.airportId)?.name || actuacion.airportId;
                if (!acc[airportName]) acc[airportName] = [];
                acc[airportName].push({ id: item.id, description: `Sincronización para ${actuacion.name.split('_').slice(2).join(' ')}`, date: new Date(item.timestamp), status: item.status === 'Éxito' ? 'success' : item.status === 'Fallido' ? 'failure' : 'running' });
                return acc;
            }, {} as Record<string, any[]>);
            
        // P2 GIS
        const gisByAirport = mockDataTransfers
            .filter(t => t.toSystem === 'GIS')
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 5)
            .reduce((acc, item) => {
                const actuacion = mockActuaciones.find(act => act.id === item.actuacionId);
                if (!actuacion) return acc;
                const airportName = mockAirports.find(a => a.id === actuacion.airportId)?.name || actuacion.airportId;
                if (!acc[airportName]) acc[airportName] = [];
                acc[airportName].push({ id: item.id, description: `Envío para ${actuacion.name.split('_').slice(2).join(' ')}`, date: new Date(item.timestamp), status: item.status === 'Éxito' ? 'success' : item.status === 'Fallido' ? 'failure' : 'running' });
                return acc;
            }, {} as Record<string, any[]>);

        // P3.1 Maximo -> AIM
        const p3MaximoActivities = [
            { airport: 'MAD', description: 'Sincronizados 52 activos modificados desde AIM.', date: generateRecentDate(0, 5, 10), status: 'success' },
            { airport: 'VLC', description: 'Sincronización de activos en curso...', date: generateRecentDate(0, 0, 5), status: 'running' },
        ];
        const p3MaximoByAirport = p3MaximoActivities.reduce((acc, item) => {
            const airportName = mockAirports.find(a => a.id === item.airport)?.name || item.airport;
            if (!acc[airportName]) acc[airportName] = [];
            acc[airportName].push({ id: item.date.toISOString(), description: item.description, date: item.date, status: item.status as keyof typeof statusConfig });
            return acc;
        }, {} as Record<string, any[]>);
            
        // P3.2 DIACAE
        const p3DiacaeActivities = [
            { airport: 'VLC', description: 'Descargado maestro y 12 planos', date: generateRecentDate(0, 3, 20), status: 'success' },
            { airport: 'MAD', description: 'Descargado maestro y 45 planos', date: generateRecentDate(1, 8, 0), status: 'success' },
            { airport: 'BCN', description: 'Descargado maestro y 23 planos', date: generateRecentDate(2, 4, 10), status: 'success' },
        ];
        const p3ByAirport = p3DiacaeActivities.reduce((acc, item) => {
            const airportName = mockAirports.find(a => a.id === item.airport)?.name || item.airport;
            if (!acc[airportName]) acc[airportName] = [];
            acc[airportName].push({ id: item.date.toISOString(), description: item.description, date: item.date, status: item.status as keyof typeof statusConfig });
            return acc;
        }, {} as Record<string, any[]>);
            
        // P4
        let p4DateCounter = 0;
        const p4ByAirport = mockActuacionesDetail
            .filter(a => a.p4_status === 'Publicado')
            .slice(-5)
            .reduce((acc, item) => {
                const airportName = mockAirports.find(a => a.id === item.airportId)?.name || item.airportId;
                if(!acc[airportName]) acc[airportName] = [];
                const date = generateRecentDate(p4DateCounter, p4DateCounter * 4);
                p4DateCounter++;
                acc[airportName].push({ id: item.id, description: `Retorno para ${item.name.split('_').slice(2).join(' ')}`, date: date, status: 'success'});
                return acc;
            }, {} as Record<string, any[]>);

        return [
            {
                id: 'p1',
                title: 'Proceso 1',
                icon: <Process1Icon />,
                description: 'Flujo de Información de Proyectos a Activos',
                subprocesses: [
                    { id: 'p1.1', title: 'P1.1 Traspaso de información entre Hub de Proyecto y Hub de Activos', activitiesByAirport: p11ByAirport, link: '/aeropuertos' },
                    { id: 'p1.2', title: 'P1.2 Actualización AIMs', activitiesByAirport: p12ByAirport, link: '/aeropuertos' }
                ]
            },
            {
                id: 'p2',
                title: 'Proceso 2',
                icon: <Process2Icon />,
                description: 'Envío de Datos a Sistemas Corporativos',
                subprocesses: [
                    { id: 'p2.1', title: 'P2 Sincronización de datos Máximo (Hojas PIM)', activitiesByAirport: gmaoByAirport, link: '/actuaciones' },
                    { id: 'p2.2', title: 'P2 Exportación de capas Base', activitiesByAirport: gisByAirport, link: '/actuaciones' }
                ]
            },
            {
                id: 'p3',
                title: 'Proceso 3',
                icon: <Process3Icon />,
                description: 'Importación de Datos desde Sistemas Corporativos',
                subprocesses: [
                    { id: 'p3.1', title: 'P3 Sincronización de datos Máximo (Modelo AIM)', activitiesByAirport: p3MaximoByAirport, link: '/actuaciones' },
                    { id: 'p3.2', title: 'P3 Obtención de datos del maestro de espacios', activitiesByAirport: p3ByAirport, link: '/aeropuertos' }
                ]
            },
            {
                id: 'p4',
                title: 'Proceso 4',
                icon: <Process4Icon />,
                description: 'Retorno de Información de Activos a Proyectos',
                subprocesses: [
                    { id: 'p4.1', title: 'P4 Traspaso de información entre Hub de Activos y Hub de Proyecto', activitiesByAirport: p4ByAirport, link: '/actuaciones' }
                ]
            }
        ];
    }, []);

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard de Integraciones</h1>
                <p className="text-md text-gray-600">Bienvenido al Portal de Integraciones de Aena. Aquí tiene un resumen del estado actual de la red.</p>
            </div>
            
            <GlobalStats stats={globalStats} />

            <section>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Módulos Principales</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <QuickAccessCard 
                        to="/aeropuertos"
                        title="Aeropuertos"
                        description="Gestión y monitorización por aeropuerto."
                        icon={<AirportIcon />}
                        color="bg-aena-green"
                    />
                     <QuickAccessCard 
                        to="/requisitos"
                        title="Requisitos"
                        description="Configuración de requisitos de información."
                        icon={<RequirementsIcon />}
                        color="bg-aena-green"
                    />
                </div>
            </section>
            
            <section>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Última Actividad por Proceso</h2>
                <div className="space-y-8">
                    {mainProcesses.map((process) => (
                        <Card key={process.id} className="overflow-hidden">
                            <div className="p-6 bg-gray-50 border-b flex items-start gap-4">
                                {process.icon}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{process.title}</h3>
                                    <p className="text-sm text-gray-600">{process.description}</p>
                                </div>
                            </div>
                            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {process.subprocesses.map((subprocess) => (
                                    <Card key={subprocess.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300 border">
                                        <div className="p-4 border-b">
                                            <h4 className="font-semibold text-md text-gray-800">{subprocess.title}</h4>
                                        </div>
                                        <div className="p-4 flex-grow space-y-3 overflow-y-auto max-h-64">
                                            {Object.entries(subprocess.activitiesByAirport).length > 0 ? (
                                                Object.entries(subprocess.activitiesByAirport).map(([airportName, activities]) => (
                                                    <div key={airportName}>
                                                        <h5 className="font-semibold text-sm text-gray-700">{airportName}</h5>
                                                        <ul className="mt-1 space-y-2 border-l-2 border-gray-200 pl-3">
                                                            {(activities as any[]).map(activity => (
                                                                <li key={activity.id} className="text-xs">
                                                                    <div className="flex justify-between items-start">
                                                                        <div className="flex items-start gap-2 pr-2">
                                                                            <span className={`mt-0.5 flex-shrink-0 p-1 rounded-full ${statusConfig[activity.status as keyof typeof statusConfig].bg} ${statusConfig[activity.status as keyof typeof statusConfig].color}`}>
                                                                                {statusConfig[activity.status as keyof typeof statusConfig].icon}
                                                                            </span>
                                                                            <p className="text-gray-600">{activity.description}</p>
                                                                        </div>
                                                                        <span className="text-gray-400 flex-shrink-0 ml-2" title={activity.date.toLocaleString('es-ES')}>
                                                                            {formatDateAgo(activity.date)}
                                                                        </span>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-8 text-sm text-gray-500">
                                                    <p>No hay actividad reciente.</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3 border-t bg-gray-50 mt-auto">
                                            <Link to={subprocess.link} className="text-sm font-semibold text-aena-green hover:underline flex items-center justify-between group">
                                                <span>Ver todo</span>
                                                <span className="transform transition-transform group-hover:translate-x-1">&rarr;</span>
                                            </Link>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default DashboardPage;