
import React from 'react';
import Card from '../ui/Card';

const SapProcessPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Integración SAP</h2>
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-gray-600 hover:text-aena-green">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                    Volver a la vista general
                </button>
            </div>
            
            <section id="p2-sap">
                <Card>
                    <div className="p-6 border-b flex items-center opacity-50">
                        {/* Placeholder Icon */}
                        <svg className="w-8 h-8 text-aena-green mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                        </svg>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">Procesos de Integración con SAP</h2>
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

export default SapProcessPage;
