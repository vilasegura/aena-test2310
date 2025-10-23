import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockAirports, mockActuacionesDetail, mockP11ModelReceptions, mockAimTransfers } from '../data';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import Card from '../components/ui/Card';
import ActuacionesTable from '../components/actuaciones/ActuacionesTable';
import AirportHeader from '../components/airport/AirportHeader';
import P1ProcessPage from '../components/processes/P1ProcessPage';
import SigraProcessPage from '../components/processes/SigraProcessPage';
import MaximoProcessPage from '../components/processes/MaximoProcessPage';
import SapProcessPage from '../components/processes/SapProcessPage';
import AirportStats from '../components/dashboard/AirportStats';
import { AimTransfer } from '../types';

const ProcessButton: React.FC<{ title: string; description: string; onClick: () => void }> = ({ title, description, onClick }) => (
    <button
        onClick={onClick}
        className="group text-left p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:bg-gray-50 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-aena-green focus:ring-offset-2 w-full h-full flex flex-col"
    >
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600 flex-grow">{description}</p>
        <div className="mt-4 text-aena-green font-semibold flex items-center group-hover:underline">
            <span>Acceder</span>
            <svg className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
        </div>
    </button>
);

const ModelTransferIcon = () => (
    <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
);

const ActuacionesListIcon = () => (
    <svg className="w-7 h-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const ProcessLinkCard: React.FC<{ title: string; description: string; onClick: () => void; icon: React.ReactNode }> = ({ title, description, onClick, icon }) => (
    <button
        onClick={onClick}
        className="group w-full text-left p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:bg-gray-50 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-aena-green focus:ring-offset-2 flex items-center"
    >
        <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-aena-green/10 text-aena-green rounded-lg">
            {icon}
        </div>
        <div className="ml-6 flex-grow">
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
        </div>
        <div className="ml-6 text-aena-green">
            <svg className="w-8 h-8 transform transition-transform group-hover:translate-x-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
        </div>
    </button>
);


const AirportDetailPage: React.FC = () => {
  const { airportId } = useParams<{ airportId: string }>();
  const [view, setView] = useState<'main' | 'p1' | 'sigra' | 'maximo' | 'sap' | 'actuaciones'>('main');
  
  const airport = mockAirports.find(a => a.id === airportId);

  const actuaciones = useMemo(() => {
    return mockActuacionesDetail.filter(act => act.airportId === airportId);
  }, [airportId]);

  const p11Models = useMemo(() => {
    return mockP11ModelReceptions.filter(model => model.iata === airportId);
  }, [airportId]);
  
  const initialAimTransfers = useMemo(() => {
    return mockAimTransfers.filter(transfer => transfer.iata === airportId);
  }, [airportId]);

  const [aimTransfers, setAimTransfers] = useState(initialAimTransfers);

  useEffect(() => {
      setAimTransfers(initialAimTransfers);
  }, [initialAimTransfers]);

  const handleAimTransferChange = (updatedTransfer: AimTransfer) => {
    setAimTransfers(currentTransfers => 
        currentTransfers.map(t => t.id === updatedTransfer.id ? updatedTransfer : t)
    );
  };

  const airportStats = useMemo(() => {
    if (!airport) return null;
    return {
      actuacionesCount: actuaciones.length,
      integrationStatus: airport.integrationStatus,
      p11ModelsCount: p11Models.length,
      aimTransfersCount: aimTransfers.length,
    };
  }, [actuaciones, airport, p11Models, aimTransfers]);


  if (!airport || !airportStats) {
    return (
        <div className="text-center p-8">
            <h2 className="text-2xl font-bold">Aeropuerto no encontrado</h2>
            <Link to="/aeropuertos" className="text-aena-green hover:underline mt-4 inline-block">Volver al listado</Link>
        </div>
    );
  }

  if (view === 'p1') {
    return <P1ProcessPage airportId={airport.id} p11Models={p11Models} aimTransfers={aimTransfers} onBack={() => setView('main')} onAimTransfersChange={handleAimTransferChange} />;
  }
  if (view === 'sigra') {
    return <SigraProcessPage onBack={() => setView('main')} />;
  }
  if (view === 'maximo') {
    return <MaximoProcessPage onBack={() => setView('main')} />;
  }
  if (view === 'sap') {
    return <SapProcessPage onBack={() => setView('main')} />;
  }
  if (view === 'actuaciones') {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Actuaciones para {airport.name}</h2>
                <button onClick={() => setView('main')} className="flex items-center text-sm font-semibold text-gray-600 hover:text-aena-green">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Volver a la vista general del aeropuerto
                </button>
            </div>
            <Card>
                <div className="p-4 sm:p-6">
                    {actuaciones.length > 0 ? (
                        <ActuacionesTable actuaciones={actuaciones} />
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">No hay actuaciones en curso para este aeropuerto.</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
  }


  return (
    <div className="space-y-8">
        <Breadcrumbs items={[
            { label: 'Inicio', href: '/' },
            { label: 'Aeropuertos', href: '/aeropuertos' },
            { label: airport.name }
        ]} />

        <AirportHeader airport={airport} />
        
        <AirportStats stats={airportStats} />

        <section id="gestion-modelos">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Gestión de Modelos</h2>
            <ProcessLinkCard
                title="Traspaso de modelos PIM/AIM"
                description="Gestión de modelos PIM recibidos, mapeo con modelos AIM y seguimiento del traspaso de información."
                onClick={() => setView('p1')}
                icon={<ModelTransferIcon />}
            />
        </section>

        <section id="integraciones">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Integraciones con Sistemas Corporativos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProcessButton title="Integración SIGRA" description="Integración de datos con el sistema GIS de Aena." onClick={() => setView('sigra')} />
                <ProcessButton title="Integración Máximo" description="Integración de datos con el sistema GMAO de Aena." onClick={() => setView('maximo')} />
                <ProcessButton title="Integración SAP" description="Integración de datos con el sistema SAP de Aena." onClick={() => setView('sap')} />
            </div>
        </section>

        <section id="actuaciones">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Actuaciones</h2>
            <ProcessLinkCard
                title={`Ver ${actuaciones.length} Actuaciones`}
                description="Consulta el estado y los detalles de todas las actuaciones para este aeropuerto."
                onClick={() => setView('actuaciones')}
                icon={<ActuacionesListIcon />}
            />
        </section>
    </div>
  );
};

export default AirportDetailPage;