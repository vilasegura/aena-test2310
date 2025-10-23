import React, { useState, useMemo } from 'react';
import { DiacaeSpace, DiacaeHistoryItem } from '../../types';
import { mockDiacaeSpaces, mockCadPlans } from '../../data';

type DiacaeStep = 'idle' | 'extracting' | 'extracted' | 'validated' | 'downloading' | 'complete';

const LoadingSpinner: React.FC<{text: string}> = ({ text }) => (
    <div className="flex flex-col items-center justify-center space-y-2 text-center py-8">
        <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 rounded-full animate-pulse bg-aena-dark"></div>
            <div className="w-4 h-4 rounded-full animate-pulse bg-aena-dark" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-4 h-4 rounded-full animate-pulse bg-aena-dark" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <p className="mt-4 text-gray-600 font-semibold">{text}</p>
    </div>
);

const SpacesTable: React.FC<{spaces: DiacaeSpace[]}> = ({ spaces }) => {
    const headers: { key: keyof DiacaeSpace, label: string }[] = [
        { key: 'codigoEspacio', label: 'Cód. Espacio' },
        { key: 'iata', label: 'IATA' },
        { key: 'tipoEspacio', label: 'Tipo Espacio' },
        { key: 'descripcionEspacio', label: 'Descripción' },
        { key: 'identificador', label: 'Identificador' },
        { key: 'edificio', label: 'Edificio' },
        { key: 'planta', label: 'Planta' },
    ];
    return (
        <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {/* FIX: Cast `h.key` to string to satisfy React's `key` prop type, which doesn't accept symbols. */}
                        {headers.map(h => <th key={h.key as string} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h.label}</th>)}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {spaces.map(space => (
                        <tr key={space.id}>
                            {/* FIX: Cast `h.key` to string to satisfy React's `key` prop type, which doesn't accept symbols. */}
                            {headers.map(h => <td key={h.key as string} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{space[h.key] || '–'}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


const P3DiacaeProcess: React.FC = () => {
    const [step, setStep] = useState<DiacaeStep>('idle');
    const [spaces, setSpaces] = useState<DiacaeSpace[]>([]);
    const [selectedPlans, setSelectedPlans] = useState<Record<string, string[]>>({});
    const [history, setHistory] = useState<DiacaeHistoryItem[]>([]);
    const [versionCounter, setVersionCounter] = useState(1);
    const [expandedHistory, setExpandedHistory] = useState<Record<number, boolean>>({});

    const handleStartExtraction = () => {
        setStep('extracting');
        setTimeout(() => {
            setSpaces(mockDiacaeSpaces);
            setStep('extracted');
        }, 1500);
    };

    const handleValidate = () => {
        const initialSelection: Record<string, string[]> = {};
        Object.entries(mockCadPlans).forEach(([floor, plans]) => {
            initialSelection[floor] = plans;
        });
        setSelectedPlans(initialSelection);
        setStep('validated');
    };

    const handleReject = () => {
        setSpaces([]);
        setStep('idle');
    };
    
    const handleExportToExcel = () => {
        const headers = Object.keys(spaces[0]);
        const csvRows = [headers.join(',')];
        spaces.forEach(row => {
            const values = headers.map(header => `"${(row as any)[header as keyof DiacaeSpace]}"`);
            csvRows.push(values.join(','));
        });
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'maestro_de_espacios.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePlanSelection = (floor: string, planName: string) => {
        setSelectedPlans(prev => {
            const floorPlans = prev[floor] || [];
            if (floorPlans.includes(planName)) {
                return { ...prev, [floor]: floorPlans.filter(p => p !== planName) };
            }
            return { ...prev, [floor]: [...floorPlans, planName] };
        });
    };

    const handleDownload = () => {
        setStep('downloading');
        setTimeout(() => {
            const newHistoryItem: DiacaeHistoryItem = {
                id: Date.now(),
                date: new Date(),
                version: versionCounter,
                user: 'Usuario Técnico',
                downloadedPlans: selectedPlans,
                masterFileDownloaded: true,
                accLink: `ACC/DIACAE/P3_Downloads/VLC/${new Date().toISOString().split('T')[0]}/v${versionCounter}`
            };
            setHistory(prev => [newHistoryItem, ...prev]);
            setVersionCounter(prev => prev + 1);
            setStep('complete');
        }, 2500);
    };

    const handleReset = () => {
        setStep('idle');
        setSpaces([]);
        setSelectedPlans({});
    };

    const toggleHistoryDetails = (id: number) => {
        setExpandedHistory(prev => ({...prev, [id]: !prev[id]}));
    }

    const renderStep = () => {
        switch (step) {
            case 'idle':
                return (
                    <div className="text-center">
                        <button onClick={handleStartExtraction} className="bg-aena-dark hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg">
                            Extracción del maestro de espacios
                        </button>
                    </div>
                );
            case 'extracting':
                return <LoadingSpinner text="Extrayendo maestro de espacios desde Diacae..." />;
            case 'extracted':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Validación del Maestro de Espacios</h3>
                        <SpacesTable spaces={spaces} />
                        <div className="flex justify-end items-center gap-3 pt-2">
                            <button onClick={handleExportToExcel} className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg text-sm transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>
                                Exportar a Excel
                            </button>
                            <button onClick={handleReject} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg">Rechazar</button>
                            <button onClick={handleValidate} className="bg-aena-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">Validar</button>
                        </div>
                    </div>
                );
            case 'validated':
                return (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Descarga de Planos CAD por Planta</h3>
                        <p className="text-sm text-gray-600">El maestro de espacios ha sido validado. Seleccione los planos CAD que desea descargar a la carpeta de trabajo en ACC.</p>
                        
                        <div className="mt-4 space-y-4 max-h-72 overflow-y-auto pr-2">
                             {Object.entries(mockCadPlans).map(([floor, plans]) => (
                                <div key={floor} className="bg-gray-50 p-3 rounded-lg border">
                                    <h4 className="font-semibold text-gray-800 border-b pb-2 mb-2">{floor}</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                        {plans.map(plan => (
                                            <label key={plan} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer p-1 hover:bg-gray-200 rounded">
                                                <input type="checkbox" checked={selectedPlans[floor]?.includes(plan) || false} onChange={() => handlePlanSelection(floor, plan)} className="rounded text-aena-green focus:ring-aena-green" />
                                                <span className="font-mono">{plan}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                         <div className="mt-6 flex justify-end">
                            {/* FIX: Cast Object.values result to avoid 'unknown' type error on .every() */}
                            <button onClick={handleDownload} disabled={(Object.values(selectedPlans) as string[][]).every(p => p.length === 0)} className="bg-aena-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-gray-400">Descargar Maestro y Planos Seleccionados</button>
                         </div>
                    </div>
                );
            case 'downloading':
                 return <LoadingSpinner text="Descargando ficheros a la carpeta de trabajo en ACC..." />;
             case 'complete':
                return (
                     <div className="text-center p-6 bg-white rounded-lg border border-green-300">
                        <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h3 className="mt-4 font-semibold text-lg text-gray-800">Descarga completada con éxito</h3>
                        <p className="mt-2 text-gray-600">Los ficheros se han depositado en la carpeta de ACC:</p>
                        <a href="#" className="text-aena-green font-mono bg-gray-100 p-2 rounded-md inline-block my-2 hover:underline">{history[0]?.accLink}</a>
                        <div className="mt-6">
                            <button onClick={handleReset} className="bg-aena-dark hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg">Iniciar nuevo proceso</button>
                        </div>
                    </div>
                );
        }
    };
    
    const renderHistory = () => (
         <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Historial de Descargas</h3>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                 <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha y Hora</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                             <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Versión</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contenido Descargado</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Enlace ACC</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {history.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap align-top text-sm text-gray-500">{item.date.toLocaleString('es-ES')}</td>
                                <td className="px-6 py-4 whitespace-nowrap align-top text-sm text-gray-800">{item.user}</td>
                                <td className="px-6 py-4 whitespace-nowrap align-top text-center text-sm text-gray-500 font-semibold">{item.version}</td>
                                <td className="px-6 py-4 align-top text-sm text-gray-800">
                                    <button onClick={() => toggleHistoryDetails(item.id)} className="text-aena-green hover:underline flex items-center gap-1">
                                       {/* FIX: Cast result of Object.values to string[][] to use .flat() and .length */}
                                       <span>Ver ({(item.masterFileDownloaded ? 1 : 0) + (Object.values(item.downloadedPlans) as string[][]).flat().length} elementos)</span>
                                       <svg className={`w-4 h-4 transition-transform ${expandedHistory[item.id] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </button>
                                     {expandedHistory[item.id] && (
                                        <div className="mt-2 pl-2 border-l-2 border-gray-200 space-y-2">
                                            {item.masterFileDownloaded && (
                                                <div>
                                                    <h5 className="font-semibold text-xs text-gray-700">Maestro de Espacios</h5>
                                                    <ul className="list-disc list-inside pl-3">
                                                        <li className="text-xs text-gray-600 font-mono">maestro_de_espacios.xlsx</li>
                                                    </ul>
                                                </div>
                                            )}
                                            {/* FIX: Add explicit types to Object.entries callback to prevent 'plans' from being 'unknown'. */}
                                            {Object.entries(item.downloadedPlans).map(([floor, plans]: [string, string[]]) => (
                                                (plans.length > 0) && (
                                                    <div key={floor}>
                                                        <h5 className="font-semibold text-xs text-gray-700">{floor}</h5>
                                                        <ul className="list-disc list-inside pl-3">
                                                        {plans.map(plan => <li key={plan} className="text-xs text-gray-600 font-mono">{plan}</li>)}
                                                        </ul>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                     )}
                                </td>
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
            {renderStep()}
            {history.length > 0 && renderHistory()}
        </div>
    );
};

export default P3DiacaeProcess;