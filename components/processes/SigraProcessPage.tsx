
import React from 'react';
import Card from '../ui/Card';
import P2ExportProcess from '../export/P2ExportProcess';
import P3DiacaeProcess from '../diacae/P3DiacaeProcess';

const ExportIcon = () => (
    <svg className="w-8 h-8 text-aena-green mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9A2.25 2.25 0 0018.75 19.5v-9a2.25 2.25 0 00-2.25-2.25H15M12 9V2.25M12 9l3-3m-3 3l-3-3" />
    </svg>
);

const DiacaeIcon = () => (
    <svg className="w-8 h-8 text-aena-green mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m18-18v18m-9-18v18m-3-3h6m-3-3h6m-3-3h6m-3-3h6m-6-3h6" />
    </svg>
);


const SigraProcessPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Integración SIGRA (GIS)</h2>
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-gray-600 hover:text-aena-green">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Volver a la vista general
                </button>
            </div>
            
            <section id="p2-export">
                <Card>
                    <div className="p-6 border-b flex items-center">
                        <ExportIcon />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">P2 Exportación de capas Base</h2>
                            <p className="mt-1 text-gray-600">Exportación de planos de referencia a DWG para la integración con sistemas GIS.</p>
                        </div>
                    </div>
                    <div className="p-6">
                        <P2ExportProcess />
                    </div>
                </Card>
            </section>
            
            <section id="p3-diacae">
                <Card>
                    <div className="p-6 border-b flex items-center">
                        <DiacaeIcon />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">P3 DIACAE</h2>
                            <p className="mt-1 text-gray-600">Extracción y gestión del maestro de espacios y planos CAD asociados.</p>
                        </div>
                    </div>
                    <div className="p-6">
                        <P3DiacaeProcess />
                    </div>
                </Card>
            </section>
        </div>
    );
};

export default SigraProcessPage;
