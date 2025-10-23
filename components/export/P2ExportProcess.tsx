import React, { useState, useMemo } from 'react';

// Types
type ExportStep = 'initial' | 'confirm' | 'selectViews' | 'exporting' | 'result';

interface ExportHistoryItem {
    id: number;
    date: Date;
    models: { id: string; name: string }[];
    exportedViewsByFloor: Record<string, string[]>; // Key is floor name
    version: number;
    accLink: string;
}

// Mock Data - Updated to group views by floor
const mockModels = [
    { id: 'model-1', name: 'MAD_T4_ARQ_PRO_v3.rvt', views: [
        { name: 'ARQ - Vista 3D General', floor: 'Vistas 3D' },
        { name: 'ARQ - Planta Baja', floor: 'Planta Baja' },
        { name: 'ARQ - Planta Primera', floor: 'Planta Primera' },
        { name: 'ARQ - Alzado Norte', floor: 'Alzados' }
    ]},
    { id: 'model-2', name: 'MAD_T4_EST_PRO_v2.rvt', views: [
        { name: 'EST - Vista 3D Estructura', floor: 'Vistas 3D' },
        { name: 'EST - Planta Cimentación', floor: 'Planta Cimentación' },
        { name: 'EST - Planta Baja', floor: 'Planta Baja' }
    ]},
    { id: 'model-3', name: 'MAD_T4_MEP_PRO_v4.rvt', views: [
        { name: 'MEP - Vista 3D Instalaciones', floor: 'Vistas 3D' },
        { name: 'MEP - Fontanería Planta Baja', floor: 'Planta Baja' },
        { name: 'MEP - Climatización Planta Baja', floor: 'Planta Baja' },
        { name: 'MEP - Climatización Planta Primera', floor: 'Planta Primera' }
    ]},
];

// Helper Components
const LoadingSpinner = () => (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 rounded-full animate-pulse bg-aena-dark"></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-aena-dark" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-aena-dark" style={{ animationDelay: '0.4s' }}></div>
    </div>
);

// Main Component
const P2ExportProcess: React.FC = () => {
    // State for the export process
    const [step, setStep] = useState<ExportStep>('initial');
    const [selectedViews, setSelectedViews] = useState<Record<string, string[]>>({}); // Key is floor name
    const [exportSuccess, setExportSuccess] = useState(false);

    // State for history
    const [exportHistory, setExportHistory] = useState<ExportHistoryItem[]>([]);
    const [versionCounter, setVersionCounter] = useState(1);
    const [expandedHistory, setExpandedHistory] = useState<Record<number, boolean>>({});

    const viewsByFloor = useMemo(() => {
        const grouped: Record<string, { name: string; modelName: string }[]> = {};
        mockModels.forEach(model => {
            model.views.forEach(view => {
                // Filter to only include floor plans ('plantas'), excluding elevations and 3D views.
                if (!view.floor.toLowerCase().includes('planta')) {
                    return;
                }
                if (!grouped[view.floor]) {
                    grouped[view.floor] = [];
                }
                grouped[view.floor].push({ name: view.name, modelName: model.name });
            });
        });
        // Sort floors for consistent order
        const sortedFloors = Object.keys(grouped).sort();
        const result: Record<string, { name: string; modelName: string }[]> = {};
        sortedFloors.forEach(floor => {
            result[floor] = grouped[floor];
        });
        return result;
    }, []);

    const handleExportProcess = () => {
        setStep('exporting');
        // Simulate API call
        setTimeout(() => {
            const success = Math.random() > 0.2; // 80% chance of success
            setExportSuccess(success);

            if (success) {
                const newHistoryItem: ExportHistoryItem = {
                    id: Date.now(),
                    date: new Date(),
                    models: mockModels.map(m => ({ id: m.id, name: m.name })),
                    exportedViewsByFloor: selectedViews,
                    version: versionCounter,
                    accLink: `02_DocGrafica/01_EnCurso/DINXXX/Planos 2D/v${versionCounter}`
                };
                setExportHistory(prev => [newHistoryItem, ...prev]);
                setVersionCounter(prev => prev + 1);
            }

            setStep('result');
        }, 3000);
    };

    const handleStart = () => {
        setStep('confirm');
    };

    const handleConfirm = () => {
        const initialSelection: Record<string, string[]> = {};
        // FIX: Add explicit types to Object.entries callback to prevent 'views' from being 'unknown'.
        Object.entries(viewsByFloor).forEach(([floor, views]: [string, { name: string; modelName: string; }[]]) => {
            initialSelection[floor] = views.map(v => v.name);
        });
        setSelectedViews(initialSelection);
        setStep('selectViews');
    };

    const handleCancel = () => {
        setStep('initial');
    };
    
    const handleViewSelection = (floor: string, viewName: string) => {
        setSelectedViews(prev => {
            const floorViews = prev[floor] || [];
            if (floorViews.includes(viewName)) {
                return { ...prev, [floor]: floorViews.filter(v => v !== viewName) };
            } else {
                return { ...prev, [floor]: [...floorViews, viewName] };
            }
        });
    };
    
    const handleResetProcess = () => {
        setStep('initial');
        setSelectedViews({});
    };

    const toggleHistoryDetails = (id: number) => {
        setExpandedHistory(prev => ({...prev, [id]: !prev[id]}));
    }

    const renderCurrentStep = () => {
        switch (step) {
            case 'initial':
                return (
                    <div className="text-center">
                        <button
                            onClick={handleStart}
                            className="bg-aena-dark hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
                        >
                            Iniciar exportación de planos (Capas de referencia)
                        </button>
                    </div>
                );
            case 'confirm':
                return (
                    <div className="bg-white p-6 rounded-lg border">
                        <h3 className="font-semibold text-lg text-gray-800">Confirmar Exportación</h3>
                        <p className="mt-2 text-gray-600">
                            Se han detectado los siguientes modelos en la carpeta de origen: 
                            <code className="ml-2 bg-gray-200 px-1 rounded font-mono text-xs">02_DocGrafica/01_EnCurso/DINXXX</code>
                        </p>
                        <ul className="list-disc list-inside mt-3 space-y-1 text-gray-700 bg-gray-50 p-4 rounded-md border">
                            {mockModels.map(model => <li key={model.id} className="font-mono text-sm">{model.name}</li>)}
                        </ul>
                         <p className="mt-3 text-sm text-gray-500">
                            Los planos 2D generados se exportarán a la carpeta de destino: 
                            <code className="ml-2 bg-gray-200 px-1 rounded font-mono text-xs">02_DocGrafica/01_EnCurso/DINXXX/Planos 2D</code>
                        </p>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button onClick={handleCancel} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancelar</button>
                            <button onClick={handleConfirm} className="bg-aena-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">Confirmar e Iniciar</button>
                        </div>
                    </div>
                );
            case 'selectViews':
                return (
                     <div className="bg-white p-6 rounded-lg border">
                        <h3 className="font-semibold text-lg text-gray-800">Seleccionar Planos a Exportar por Planta</h3>
                        <p className="mt-2 text-gray-600">Seleccione los planos que se exportarán, agrupados por su planta correspondiente.</p>
                        <div className="mt-4 space-y-4 max-h-72 overflow-y-auto pr-2">
                            {/* FIX: Add explicit types to Object.entries callback to prevent 'views' from being 'unknown'. */}
                            {Object.entries(viewsByFloor).map(([floor, views]: [string, { name: string; modelName: string }[]]) => (
                                <div key={floor} className="bg-gray-50 p-3 rounded-lg border">
                                    <h4 className="font-semibold text-gray-800 border-b pb-2 mb-2">{floor}</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {views.map(view => (
                                            <label key={view.name} className="flex items-start space-x-2 text-sm text-gray-700 cursor-pointer p-1 hover:bg-gray-200 rounded">
                                                <input 
                                                    type="checkbox"
                                                    checked={selectedViews[floor]?.includes(view.name) || false}
                                                    onChange={() => handleViewSelection(floor, view.name)}
                                                    className="rounded text-aena-green focus:ring-aena-green mt-1"
                                                />
                                                <div className="flex flex-col">
                                                    <span>{view.name}</span>
                                                    <span className="text-xs text-gray-500 font-mono">de: {view.modelName}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-between items-center">
                            <button onClick={() => setStep('confirm')} className="text-sm text-gray-600 hover:underline">Atrás</button>
                            <button 
                                onClick={handleExportProcess} 
                                className="bg-aena-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400"
                                // FIX: Cast the result of Object.values to string[][] to use array methods safely.
                                disabled={(Object.values(selectedViews) as string[][]).every(v => v.length === 0)}
                            >
                                Exportar Planos Seleccionados
                            </button>
                        </div>
                    </div>
                );
            case 'exporting':
                return (
                     <div className="text-center py-8">
                        <LoadingSpinner />
                        <p className="mt-4 text-gray-600 font-semibold">Exportando planos a ACC...</p>
                        <p className="mt-1 text-sm text-gray-500">Este proceso puede tardar unos minutos.</p>
                    </div>
                );
            case 'result':
                return (
                    <div className="text-center p-6 bg-white rounded-lg border">
                        {exportSuccess ? (
                            <>
                                <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <h3 className="mt-4 font-semibold text-lg text-gray-800">Exportación completada con éxito</h3>
                                <p className="mt-2 text-gray-600">La exportación (v{versionCounter-1}) se ha añadido al historial.</p>
                                <div className="mt-6">
                                    <button onClick={handleResetProcess} className="bg-aena-dark hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg">Iniciar nueva exportación</button>
                                </div>
                            </>
                        ) : (
                             <>
                                <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <h3 className="mt-4 font-semibold text-lg text-gray-800">Error en la exportación</h3>
                                <p className="mt-2 text-gray-600">No se pudieron exportar los planos. Por favor, revise los logs para más detalles.</p>
                                <div className="mt-6 flex justify-center space-x-3">
                                    <button onClick={handleResetProcess} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg">Cancelar</button>
                                    <button onClick={handleExportProcess} className="bg-aena-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">Reintentar</button>
                                </div>
                             </>
                        )}
                    </div>
                );
        }
    };
    
    const renderHistory = () => (
        <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Historial de Exportaciones</h3>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                 <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha y Hora</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelos de Origen</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planos Obtenidos</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Versión</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Enlace ACC</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {exportHistory.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap align-top text-sm text-gray-500">{item.date.toLocaleString('es-ES')}</td>
                                <td className="px-6 py-4 whitespace-nowrap align-top text-sm text-gray-800">
                                    <ul className="list-disc list-inside">
                                        {item.models.map(m => <li key={m.id} className="font-mono text-xs">{m.name}</li>)}
                                    </ul>
                                </td>
                                <td className="px-6 py-4 align-top text-sm text-gray-800">
                                    <button onClick={() => toggleHistoryDetails(item.id)} className="text-aena-green hover:underline flex items-center gap-1">
                                       {/* FIX: Cast result of Object.values to string[][] to use .flat() and .length */}
                                       <span>Ver ({(Object.values(item.exportedViewsByFloor) as string[][]).flat().length})</span>
                                       <svg className={`w-4 h-4 transition-transform ${expandedHistory[item.id] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </button>
                                     {expandedHistory[item.id] && (
                                        <div className="mt-2 pl-2 border-l-2 border-gray-200 space-y-2">
                                            {/* FIX: Add explicit types to Object.entries callback to prevent 'views' from being 'unknown'. */}
                                            {Object.entries(item.exportedViewsByFloor).map(([floor, views]: [string, string[]]) => (
                                                <div key={floor}>
                                                    <h5 className="font-semibold text-xs text-gray-700">{floor}</h5>
                                                    <ul className="list-disc list-inside pl-3">
                                                      {views.map(view => <li key={view} className="text-xs text-gray-600">{view}</li>)}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                     )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap align-top text-center text-sm text-gray-500 font-semibold">{item.version}</td>
                                <td className="px-6 py-4 whitespace-nowrap align-top text-center text-sm">
                                    <a href="#" target="_blank" rel="noopener noreferrer" className="inline-block bg-aena-dark text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-gray-800 transition-colors">
                                        Ver
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {renderCurrentStep()}
            {exportHistory.length > 0 && renderHistory()}
        </div>
    );
};

export default P2ExportProcess;