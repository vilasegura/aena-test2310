

import React, { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockActuaciones, mockModelReceptions, mockAimTransfers } from '../data';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import Card from '../components/ui/Card';
import ActionHeader from '../components/actuaciones/ActionHeader';
import ModelReceptionTable from '../components/models/ModelReceptionTable';
import AimTransferTable from '../components/transfers/AimTransferTable';
import { AimTransfer } from '../types';

const ModelReceptionIcon = () => (
    <svg className="w-8 h-8 text-aena-green mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12.5a8.5 8.5 0 11-17 0 8.5 8.5 0 0117 0z"></path>
    </svg>
);

const AimToPimTransferIcon = () => (
    <svg className="w-8 h-8 text-aena-green mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
    </svg>
);

const AnalyticsIcon = () => (
    <svg className="w-8 h-8 text-aena-green mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
    </svg>
);


const ActionDashboardPage: React.FC = () => {
  const { actuacionId } = useParams<{ actuacionId: string }>();
  
  // The actuacionId from the URL needs to be matched with the correct ID format in mockActuaciones.
  // Example URL ID: 'mad-new-9', mockActuaciones ID: 'mad-9'
  const actuacion = mockActuaciones.find(a => a.id === actuacionId?.replace('-new-', '-'));
  
  const modelReceptions = useMemo(() => {
    // The model receptions are linked via the same transformed ID
    return mockModelReceptions.filter(model => model.actuacionId === actuacionId?.replace('-new-', '-'));
  }, [actuacionId]);
  
  const initialAimTransfers = useMemo(() => {
    return mockAimTransfers.filter(transfer => transfer.actuacionId === actuacionId);
  }, [actuacionId]);

  const [aimTransfers, setAimTransfers] = useState<AimTransfer[]>(initialAimTransfers);

  React.useEffect(() => {
      setAimTransfers(initialAimTransfers);
  }, [initialAimTransfers]);

  const handleAimTransferChange = (updatedTransfer: AimTransfer) => {
      setAimTransfers(currentTransfers => 
          currentTransfers.map(t => (t.id === updatedTransfer.id ? updatedTransfer : t))
      );
  };

  if (!actuacion) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">Actuación no encontrada</h2>
        <Link to="/actuaciones" className="text-aena-green hover:underline mt-4 inline-block">Volver al listado</Link>
      </div>
    );
  }
  
  // The original ID from the detail list is 'mad-new-9', which gets simplified to 'mad-9' for the Actuacion list.
  // We'll check for the simplified ID 'mad-9' from the actuacion object.
  const targetActuacionIdForPowerBI = 'mad-9';


  return (
    <div className="space-y-8">
      <Breadcrumbs items={[
        { label: 'Inicio', href: '/' },
        { label: 'Actuaciones', href: '/actuaciones' },
        { label: actuacion.name }
      ]} />
      
      <ActionHeader actuacion={actuacion} />

      {actuacion.id === targetActuacionIdForPowerBI && (
          <section id="seguimiento-acc">
              <Card>
                  <div className="p-6 border-b flex items-center">
                      <AnalyticsIcon />
                      <div>
                          <h2 className="text-2xl font-semibold text-gray-800">Seguimiento ACC</h2>
                          <p className="mt-2 text-gray-600">Dashboard de seguimiento del proyecto en Power BI.</p>
                      </div>
                  </div>
                  <div className="p-4 sm:p-6 bg-gray-50">
                      <div className="relative overflow-hidden w-full shadow-lg rounded-md border" style={{ paddingTop: '62.25%' /* Aspect ratio based on 600x373.5 */ }}>
                          <iframe
                              title="Plantilla Testeo Nube_Aena - ModeloDatos_V3"
                              className="absolute top-0 left-0 w-full h-full"
                              src="https://app.powerbi.com/view?r=eyJrIjoiNDNhOWRkNjgtYmZlNC00ZDZjLWI5MjUtM2ExMjZiNTk5YTFlIiwidCI6IjY1MmE0MjFlLWE5ZTctNGNmNi05Mjk3LTUwNDhhMzQwNDI5MSIsImMiOjl9"
                              frameBorder="0"
                              allowFullScreen={true}
                          ></iframe>
                      </div>
                  </div>
              </Card>
          </section>
      )}

      <section id="recepcion-modelos-aim-p41">
          <Card>
            <div className="p-6 border-b flex items-center">
               <ModelReceptionIcon />
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">P4.1 Recepción de modelos AIM</h2>
                <p className="mt-2 text-gray-600">Trazabilidad de los modelos AIM recibidos y unificados en el entorno de Activos, listos para su traspaso a sistemas corporativos.</p>
              </div>
            </div>
            <div className="p-2 sm:p-4">
                {modelReceptions.length > 0 ? (
                    <ModelReceptionTable models={modelReceptions} />
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No hay modelos AIM recibidos para esta actuación.</p>
                    </div>
                )}
            </div>
          </Card>
        </section>

        <section id="traspaso-aim-pim-p42">
          <Card>
            <div className="p-6 border-b flex items-center">
              <AimToPimTransferIcon />
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">P4.2 Traspaso AIM-PIM</h2>
                <p className="mt-2 text-gray-600">Trazabilidad del retorno de información desde los modelos AIM de Activos hacia los modelos PIM de Proyectos.</p>
              </div>
            </div>
             <div className="p-2 sm:p-4">
                {aimTransfers.length > 0 ? (
                    <AimTransferTable transfers={aimTransfers} groupByAim={false} onTransferChange={handleAimTransferChange} />
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No hay traspasos AIM-PIM para esta actuación.</p>
                    </div>
                )}
            </div>
          </Card>
        </section>

    </div>
  );
};

export default ActionDashboardPage;