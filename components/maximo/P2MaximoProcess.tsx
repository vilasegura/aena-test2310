import React, { useState, useMemo, useEffect } from 'react';
import { PIMAsset } from '../../types';
import { mockPimAssets, mockMaximoAssets } from '../../data';
import PimAssetSheetTable, { getHeadersForAgrupacion } from './PimAssetSheetTable';

type MaximoStep = 'idle' | 'loading_pim' | 'validating_pim' | 'loading_maximo' | 'validating_maximo' | 'comparing' | 'sending' | 'complete';

type ComparisonStatus = 'new' | 'deleted' | 'modified' | 'unchanged';
interface ComparisonItem {
    id: string;
    status: ComparisonStatus;
    pim: PIMAsset | null;
    maximo: PIMAsset | null;
    diffs: Set<keyof PIMAsset>;
}

interface MaximoSyncHistoryItem {
  id: number;
  date: Date;
  user: string;
  base: 'pim' | 'maximo';
  summary: {
    new: number;
    modified: number;
    deleted: number;
  };
  appliedChanges: ComparisonItem[];
  accLink: string;
  maximoLink: string;
}

type UserDecisions = Record<string, boolean>;

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

const P2MaximoProcess: React.FC = () => {
    const [step, setStep] = useState<MaximoStep>('idle');
    const [pimData, setPimData] = useState<PIMAsset[]>([]);
    const [maximoData, setMaximoData] = useState<PIMAsset[]>([]);
    const [comparison, setComparison] = useState<ComparisonItem[]>([]);
    const [decisions, setDecisions] = useState<UserDecisions>({});
    const [syncHistory, setSyncHistory] = useState<MaximoSyncHistoryItem[]>([]);
    const [expandedHistory, setExpandedHistory] = useState<Record<number, boolean>>({});
    const [activeTab, setActiveTab] = useState<string | null>(null);
    const [diffTabs, setDiffTabs] = useState<Set<string>>(new Set());

    const handleStart = () => {
        setStep('loading_pim');
        setTimeout(() => {
            setPimData(mockPimAssets);
            setStep('validating_pim');
        }, 1500);
    };

    const handleValidatePim = () => {
        setActiveTab(null);
        setStep('loading_maximo');
        setTimeout(() => {
            setMaximoData(mockMaximoAssets);
            setStep('validating_maximo');
        }, 1500);
    };

    const handleValidateMaximo = () => {
        setActiveTab(null);
        setStep('comparing');
    };

    const handleDecisionChange = (id: string) => {
        setDecisions(prev => ({ ...prev, [id]: !prev[id] }));
    };
    
    const handleConfirmAndSend = () => {
        setStep('sending');
        setTimeout(() => {
            const appliedChanges = comparison.filter(item => decisions[item.id] && item.status !== 'unchanged');
            
            const summary = appliedChanges.reduce((acc, item) => {
                if (item.status === 'new') acc.new++;
                if (item.status === 'modified') acc.modified++;
                if (item.status === 'deleted') acc.deleted++;
                return acc;
            }, { new: 0, modified: 0, deleted: 0 });

            const newHistoryItem: MaximoSyncHistoryItem = {
                id: Date.now(),
                date: new Date(),
                user: 'Usuario Técnico',
                base: 'pim',
                summary: summary,
                appliedChanges: appliedChanges,
                accLink: `ACC/PIM/Maximo_Sync/results_${Date.now()}.xlsx`,
                maximoLink: '#'
            };

            setSyncHistory(prev => [newHistoryItem, ...prev]);
            setStep('complete');
        }, 2500);
    };

    const handleReset = () => {
        setStep('idle');
        setPimData([]);
        setMaximoData([]);
        setComparison([]);
        setDecisions({});
        setActiveTab(null);
    };

    const handleExportToExcel = () => {
        const headers = ['Decision', 'Estado', 'codigoEquipo', 'descripcion', 'marca', 'modelo', 'ubicacion', 'estado', 'sistemaMaximo', 'subsistemaMaximo', 'tipoActivoMaximo', 'agrupacionMaximo', 'codigoBIMMaximo', 'fechaInstalacion', 'precioCompra', 'vidaUtil', 'descripcionUbicacion'];
        
        const csvRows = [headers.join(',')];

        comparison.forEach(item => {
            const decision = decisions[item.id] ? 'Aplicar' : 'Ignorar';
            const status = item.status.charAt(0).toUpperCase() + item.status.slice(1);
            let assetData: PIMAsset | null = null;
            
            // PIM is always the base
            if (item.status === 'new' || item.status === 'modified' || item.status === 'unchanged') {
                assetData = item.pim;
            } else { // deleted
                assetData = item.maximo;
            }
            
            if (assetData) {
                const row = [decision, status, ...headers.slice(2).map(h => `"${(assetData as any)[h as keyof PIMAsset]}"`)];
                csvRows.push(row.join(','));
            }
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'comparativa_pim_maximo.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const toggleHistoryDetails = (id: number) => {
        setExpandedHistory(prev => ({...prev, [id]: !prev[id]}));
    }

    const pimDataByAgrupacion = useMemo(() => {
        return pimData.reduce((acc, asset) => {
            const key = asset.agrupacionMaximo;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(asset);
            return acc;
        }, {} as Record<string, PIMAsset[]>);
    }, [pimData]);

    const maximoDataByAgrupacion = useMemo(() => {
        return maximoData.reduce((acc, asset) => {
            const key = asset.agrupacionMaximo;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(asset);
            return acc;
        }, {} as Record<string, PIMAsset[]>);
    }, [maximoData]);

    useEffect(() => {
        if (step === 'validating_pim' && !activeTab && Object.keys(pimDataByAgrupacion).length > 0) {
            setActiveTab(Object.keys(pimDataByAgrupacion).sort()[0]);
        }
        if (step === 'validating_maximo' && !activeTab && Object.keys(maximoDataByAgrupacion).length > 0) {
            setActiveTab(Object.keys(maximoDataByAgrupacion).sort()[0]);
        }
    }, [step, pimDataByAgrupacion, maximoDataByAgrupacion, activeTab]);

    useEffect(() => {
        if (step !== 'comparing') return;

        const pimMap = new Map(pimData.map(a => [a.codigoEquipo, a]));
        const maximoMap = new Map(maximoData.map(a => [a.codigoEquipo, a]));
        const allKeys = new Set([...pimMap.keys(), ...maximoMap.keys()]);

        const results: ComparisonItem[] = [];
        const initialDecisions: UserDecisions = {};
        const differences = new Set<string>();

        allKeys.forEach(key => {
            const pimAsset = pimMap.get(key);
            const maximoAsset = maximoMap.get(key);
            
            let item: ComparisonItem | null = null;
            
            if (pimAsset && !maximoAsset) { // New
                item = { id: key, status: 'new', pim: pimAsset, maximo: null, diffs: new Set() };
            } else if (!pimAsset && maximoAsset) { // Deleted
                item = { id: key, status: 'deleted', pim: null, maximo: maximoAsset, diffs: new Set() };
            } else if (pimAsset && maximoAsset) { // Potentially modified or unchanged
                const diffs = new Set<keyof PIMAsset>();
                const allProps = new Set([...Object.keys(pimAsset), ...Object.keys(maximoAsset)]) as Set<keyof PIMAsset>;
                
                allProps.forEach(prop => {
                    if (pimAsset[prop] !== maximoAsset[prop]) {
                        diffs.add(prop);
                    }
                });

                if (diffs.size > 0) {
                    item = { id: key, status: 'modified', pim: pimAsset, maximo: maximoAsset, diffs };
                } else {
                    item = { id: key, status: 'unchanged', pim: pimAsset, maximo: maximoAsset, diffs: new Set() };
                }
            }

            if (item) {
                results.push(item);
                if (item.status !== 'unchanged') {
                    initialDecisions[key] = true;
                    const agrupacion = item.pim?.agrupacionMaximo || item.maximo?.agrupacionMaximo;
                    if (agrupacion) {
                        differences.add(agrupacion);
                    }
                }
            }
        });
        
        setDiffTabs(differences);
        setComparison(results.sort((a,b) => a.id.localeCompare(b.id)));
        setDecisions(initialDecisions);

    }, [step, pimData, maximoData]);

    const renderStep = () => {
        switch(step) {
            case 'idle':
                return (
                    <div className="text-center">
                        <button onClick={handleStart} className="bg-aena-dark hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg">
                            Iniciar Extracción de Datos
                        </button>
                    </div>
                );
            case 'loading_pim':
                return <LoadingSpinner text="Extrayendo datos de Hojas PIM desde ACC/PIM/Exports..." />;
            case 'validating_pim':
                return (
                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                            <p className="font-semibold text-green-800">Se han importado satisfactoriamente {pimData.length} activos desde la carpeta ACC/PIM/Exports.</p>
                        </div>
                        <div>
                             <div className="border-b border-gray-200">
                                <nav className="-mb-px flex flex-wrap gap-4" aria-label="Tabs">
                                    {Object.keys(pimDataByAgrupacion).sort().map(agrupacion => (
                                        <button
                                            key={agrupacion}
                                            onClick={() => setActiveTab(agrupacion)}
                                            className={`whitespace-nowrap py-3 px-4 border-b-4 text-sm font-medium focus:outline-none transition-colors duration-200 ${
                                                activeTab === agrupacion
                                                    ? 'border-aena-dark text-aena-dark'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            {agrupacion}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                            <div className="mt-4">
                                {activeTab && pimDataByAgrupacion[activeTab] && (
                                    <PimAssetSheetTable assets={pimDataByAgrupacion[activeTab]} agrupacion={activeTab} />
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                             <button onClick={handleValidatePim} className="bg-aena-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
                                Validar y Continuar
                            </button>
                        </div>
                    </div>
                );
            case 'loading_maximo':
                 return <LoadingSpinner text="Obteniendo datos de Maximo..." />;
            case 'validating_maximo':
                 return (
                    <div className="space-y-4">
                         <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                            <p className="font-semibold text-blue-800">Se han obtenido {maximoData.length} activos desde Maximo.</p>
                        </div>
                        <div>
                             <div className="border-b border-gray-200">
                                <nav className="-mb-px flex flex-wrap gap-4" aria-label="Tabs">
                                    {Object.keys(maximoDataByAgrupacion).sort().map(agrupacion => (
                                        <button
                                            key={agrupacion}
                                            onClick={() => setActiveTab(agrupacion)}
                                            className={`whitespace-nowrap py-3 px-4 border-b-4 text-sm font-medium focus:outline-none transition-colors duration-200 ${
                                                activeTab === agrupacion
                                                    ? 'border-aena-dark text-aena-dark'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                        >
                                            {agrupacion}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                            <div className="mt-4">
                                {activeTab && maximoDataByAgrupacion[activeTab] && (
                                    <PimAssetSheetTable assets={maximoDataByAgrupacion[activeTab]} agrupacion={activeTab} />
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                             <button onClick={handleValidateMaximo} className="bg-aena-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
                                Validar y Preparar Comparación
                            </button>
                        </div>
                    </div>
                );
            case 'comparing':
                const allAgrupaciones = Object.keys(pimDataByAgrupacion).sort();
                if (activeTab === null && allAgrupaciones.length > 0) {
                    setActiveTab(allAgrupaciones[0]);
                }
                const filteredComparison = comparison.filter(item => {
                    const itemAgrupacion = item.pim?.agrupacionMaximo || item.maximo?.agrupacionMaximo;
                    return itemAgrupacion === activeTab;
                });
                const propertyHeaders = activeTab ? getHeadersForAgrupacion(activeTab) : [];

                const statusConfig: Record<ComparisonStatus, {label: string, bg: string, text: string}> = {
                    new: { label: 'Nuevo', bg: 'bg-green-100', text: 'text-green-800'},
                    deleted: { label: 'Eliminado', bg: 'bg-red-100', text: 'text-red-800'},
                    modified: { label: 'Modificado', bg: 'bg-orange-100', text: 'text-orange-800'},
                    unchanged: { label: 'Sin cambios', bg: 'bg-gray-100', text: 'text-gray-500'},
                };
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-800">Tabla Comparativa de Activos</h3>
                        <p className="text-gray-600">Base de comparación: <span className="font-semibold">Hojas PIM</span>. Revise los cambios y seleccione las acciones a realizar para actualizar Máximo.</p>
                        
                         <div className="border-b border-gray-200">
                            <nav className="-mb-px flex flex-wrap gap-4" aria-label="Tabs">
                                {allAgrupaciones.map(agrupacion => (
                                    <button
                                        key={agrupacion}
                                        onClick={() => setActiveTab(agrupacion)}
                                        className={`flex items-center whitespace-nowrap py-3 px-4 border-b-4 text-sm font-medium focus:outline-none transition-colors duration-200 ${
                                            activeTab === agrupacion
                                                ? 'border-aena-dark text-aena-dark'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        {agrupacion}
                                        {diffTabs.has(agrupacion) && (
                                            <span className="w-2.5 h-2.5 bg-orange-400 rounded-full ml-2" title="Esta pestaña contiene diferencias"></span>
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>

                         <div className="overflow-x-auto border rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Decisión</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                        {propertyHeaders.map(h => <th key={h.key as string} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">{h.label}</th>)}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                                    {filteredComparison.map(item => {
                                        const config = statusConfig[item.status];
                                        let displayAsset: PIMAsset | null = item.status === 'deleted' ? item.maximo : item.pim;
                                        if (!displayAsset) return null;

                                        return (
                                        <tr key={item.id} className={item.status !== 'unchanged' ? config.bg : 'bg-white'}>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                               {item.status !== 'unchanged' && (
                                                   <input type="checkbox" className="h-4 w-4 rounded text-aena-green focus:ring-aena-green border-gray-300" checked={decisions[item.id] || false} onChange={() => handleDecisionChange(item.id)} />
                                               )}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>{config.label}</span></td>
                                            {propertyHeaders.map(h => {
                                                const isDiff = item.status === 'modified' && item.diffs.has(h.key);
                                                const oldValue = item.maximo?.[h.key];
                                                const tooltip = isDiff ? `Valor anterior en Máximo: ${oldValue}` : undefined;
                                                return (
                                                <td key={h.key as string} title={tooltip} className={`px-4 py-3 whitespace-nowrap ${isDiff ? 'bg-orange-200 font-semibold' : ''} ${config.text}`}>
                                                    {(displayAsset as any)[h.key as keyof PIMAsset] as React.ReactNode ?? '–'}
                                                </td>
                                                )
                                            })}
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                             <button onClick={handleExportToExcel} className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg text-sm transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>
                                Exportar a Excel
                            </button>
                             <button onClick={handleConfirmAndSend} className="bg-aena-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
                                Validar Cambios y Enviar
                            </button>
                        </div>
                    </div>
                );
            case 'sending':
                return <LoadingSpinner text="Generando Excel y enviando a ACC... Actualizando Maximo..." />;
            case 'complete':
                return (
                    <div className="text-center p-6 bg-white rounded-lg border border-green-300">
                        <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h3 className="mt-4 font-semibold text-lg text-gray-800">Proceso Completado</h3>
                        <p className="mt-2 text-gray-600">Los datos han sido enviados correctamente y se ha creado un registro en el historial.</p>
                        
                         <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-4xl mx-auto">
                            <div className="bg-gray-50 p-4 rounded-lg border flex items-start gap-3">
                                <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <div>
                                    <p className="font-semibold text-gray-800">1. Fichero Excel generado en ACC</p>
                                    <a href="#" className="text-sm text-aena-green font-medium hover:underline">
                                        ACC/PIM/Maximo_Sync/results.xlsx
                                    </a>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border flex items-start gap-3">
                               <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <div>
                                    <p className="font-semibold text-gray-800">2. Integración con Maximo completada</p>
                                    <a href="#" className="text-sm text-aena-green font-medium hover:underline">
                                        Ir a Maximo para ver los activos actualizados
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <button onClick={handleReset} className="bg-aena-dark hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg">
                                Iniciar Nuevo Proceso
                            </button>
                        </div>
                    </div>
                );
        }
    };
    
    const renderHistory = () => {
        const statusConfig: Record<ComparisonStatus, {label: string, bg: string, text: string}> = {
            new: { label: 'Nuevo', bg: 'bg-green-100', text: 'text-green-800'},
            deleted: { label: 'Eliminado', bg: 'bg-red-100', text: 'text-red-800'},
            modified: { label: 'Modificado', bg: 'bg-orange-100', text: 'text-orange-800'},
            unchanged: { label: 'Sin cambios', bg: 'bg-gray-100', text: 'text-gray-500'},
        };

        return (
        <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Historial de Sincronizaciones con Maximo</h3>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                 <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha y Hora</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tabla Base</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resumen de Cambios</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resultados</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Detalles</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {syncHistory.map(item => (
                            <React.Fragment key={item.id}>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date.toLocaleString('es-ES')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.user}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-600">{item.base === 'pim' ? 'Hojas PIM' : 'Maximo'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                        <div className="flex flex-wrap gap-2">
                                            {item.summary.new > 0 && <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">{item.summary.new} Nuevos</span>}
                                            {item.summary.modified > 0 && <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">{item.summary.modified} Modificados</span>}
                                            {item.summary.deleted > 0 && <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">{item.summary.deleted} Eliminados</span>}
                                        </div>
                                    </td>
                                     <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex flex-col space-y-1">
                                            <a href={item.accLink} target="_blank" rel="noopener noreferrer" className="text-aena-green hover:underline text-xs">Enlace ACC</a>
                                            <a href={item.maximoLink} target="_blank" rel="noopener noreferrer" className="text-aena-green hover:underline text-xs">Enlace Maximo</a>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                        <button onClick={() => toggleHistoryDetails(item.id)} className="text-aena-dark hover:underline flex items-center gap-1 mx-auto">
                                            <span>Ver</span>
                                            <svg className={`w-4 h-4 transition-transform ${expandedHistory[item.id] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </button>
                                    </td>
                                </tr>
                                {expandedHistory[item.id] && (
                                    <tr>
                                        <td colSpan={6} className="p-0">
                                            <div className="p-4 bg-gray-50">
                                                <h4 className="font-semibold text-sm mb-2">Detalle de cambios aplicados:</h4>
                                                <div className="space-y-3">
                                                    {/* FIX: Add explicit types to the callback arguments of .map() to resolve 'unknown' type errors from Object.entries. */}
                                                    {Object.entries(item.appliedChanges.reduce((acc, change) => {
                                                        if (!acc[change.status]) acc[change.status] = [];
                                                        acc[change.status].push(change);
                                                        return acc;
                                                    }, {} as Record<ComparisonStatus, ComparisonItem[]>)).map(([status, changes]: [string, ComparisonItem[]]) => (
                                                        <div key={status}>
                                                            <p className={`px-2 py-1 text-xs font-bold rounded-full inline-block ${statusConfig[status as ComparisonStatus].bg} ${statusConfig[status as ComparisonStatus].text}`}>{statusConfig[status as ComparisonStatus].label}</p>
                                                            <ul className="list-disc list-inside mt-1 pl-4 text-sm text-gray-600">
                                                                {changes.map(change => <li key={change.id} className="font-mono text-xs">{change.id} - {((item.base === 'pim' ? change.pim : change.maximo) || (item.base === 'pim' ? change.maximo : change.pim))?.descripcion}</li>)}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                 </table>
            </div>
        </div>
    )};
    
    return (
        <div className="space-y-6">
           {renderStep()}
           {syncHistory.length > 0 && renderHistory()}
        </div>
    );
};

export default P2MaximoProcess;