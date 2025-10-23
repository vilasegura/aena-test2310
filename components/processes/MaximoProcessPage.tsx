
import React from 'react';
import Card from '../ui/Card';
import P2MaximoProcess from '../maximo/P2MaximoProcess';

const MaximoIcon = () => (
    <svg className="w-8 h-8 text-aena-green mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.03 1.125 0 1.131.094 1.976 1.057 1.976 2.192V7.5M8.25 7.5h7.5M8.25 7.5V9a.75.75 0 01-.75.75H5.625a.75.75 0 01-.75-.75V7.5m11.25 0V9A.75.75 0 0018.375 9.75h-2.25a.75.75 0 00-.75.75V7.5m-3 12V15m0 4.5v-1.5m0 0l-3-3m3 3l3-3" />
    </svg>
);

const P3MaximoIcon = () => ( // Same icon for now, maybe differentiate later if needed
    <svg className="w-8 h-8 text-aena-green mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.03 1.125 0 1.131.094 1.976 1.057 1.976 2.192V7.5M8.25 7.5h7.5M8.25 7.5V9a.75.75 0 01-.75.75H5.625a.75.75 0 01-.75-.75V7.5m11.25 0V9A.75.75 0 0018.375 9.75h-2.25a.75.75 0 00-.75.75V7.5m-3 12V15m0 4.5v-1.5m0 0l-3-3m3 3l3-3" />
    </svg>
);


const MaximoProcessPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Integración Máximo (GMAO)</h2>
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-gray-600 hover:text-aena-green">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Volver a la vista general
                </button>
            </div>
            
            <section id="p2-maximo">
                <Card>
                    <div className="p-6 border-b flex items-center">
                        <MaximoIcon />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">P2 Sincronización de datos Máximo (Hojas PIM)</h2>
                            <p className="mt-1 text-gray-600">Proceso de comparación y envío de datos desde las hojas PIM hacia Maximo.</p>
                        </div>
                    </div>
                     <div className="p-6">
                        <P2MaximoProcess />
                    </div>
                </Card>
            </section>

            <section id="p3-maximo">
                <Card>
                    <div className="p-6 border-b flex items-center opacity-50">
                        <P3MaximoIcon />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">P3 Maximo</h2>
                            <p className="mt-1 text-gray-600">Importación de datos desde Maximo.</p>
                        </div>
                    </div>
                    <div className="p-6 text-center text-gray-500">
                        <p className="font-semibold">En desarrollo</p>
                        <p className="text-sm">Esta funcionalidad estará disponible próximamente.</p>
                    </div>
                </Card>
            </section>
        </div>
    );
};

export default MaximoProcessPage;
