import React, { useMemo, useState } from 'react';
import { PimWithMappings, AimMapping } from '../../types';

type SortKey = 'modelName' | 'expediente' | 'denominationLDA' | 'fase' | 'dateReceived';

const formatDateToDMY = (dateString: string | null | undefined): string => {
    if (!dateString || !/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
        return dateString || '';
    }
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${day}-${month}-${year}`;
};

const useSortableData = (items: PimWithMappings[], config: { key: SortKey; direction: string } | null = null) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal === null) return 1;
        if (bVal === null) return -1;
        if (aVal < bVal) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

const SortIcon: React.FC<{ direction?: string }> = ({ direction }) => {
    if (!direction) return <svg className="w-4 h-4 inline-block ml-1 text-gray-400 group-hover:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>;
    if (direction === 'ascending') return <svg className="w-4 h-4 inline-block ml-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>;
    return <svg className="w-4 h-4 inline-block ml-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>;
};

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);

const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);


interface P11ModelReceptionTableProps {
  mappings: PimWithMappings[];
  groupByActuacion: boolean;
  groupByAim: boolean;
  availableAimModels: string[];
  onMappingChange: (pimId: string, aimMapping: AimMapping) => void;
  onAddMapping: (pimModelId: string) => void;
  onRemoveMapping: (pimId: string, mappingId: string) => void;
  onPimDataChange: (pimId: string, field: 'denominationLDA' | 'fase', value: string) => void;
}

const P11ModelReceptionTable: React.FC<P11ModelReceptionTableProps> = ({ mappings, groupByActuacion, groupByAim, availableAimModels, onMappingChange, onAddMapping, onRemoveMapping, onPimDataChange }) => {
    const [editingMappingId, setEditingMappingId] = useState<string | null>(null);
    const [editingPimCell, setEditingPimCell] = useState<{ pimId: string, field: 'denominationLDA' } | null>(null);
    const [editingCommentCell, setEditingCommentCell] = useState<{ mappingId: string } | null>(null);
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const { items, requestSort, sortConfig } = useSortableData(mappings, { key: 'modelName', direction: 'ascending'});
    
    const handlePimFieldChange = (pimId: string, field: 'denominationLDA', value: string) => {
        onPimDataChange(pimId, field, value);
        setEditingPimCell(null);
    };

    const EditablePimCell: React.FC<{ pim: PimWithMappings, field: 'denominationLDA' }> = ({ pim, field }) => {
        const isEditing = editingPimCell?.pimId === pim.id && editingPimCell?.field === field;
        const value = pim[field];

        if (isEditing) {
            return (
                <input
                    type="text"
                    defaultValue={value ?? ''}
                    onBlur={(e) => handlePimFieldChange(pim.id, field, e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handlePimFieldChange(pim.id, field, e.currentTarget.value);
                        else if (e.key === 'Escape') setEditingPimCell(null);
                    }}
                    autoFocus
                    className="w-full text-sm border-gray-300 rounded shadow-sm focus:ring-aena-green focus:border-aena-green"
                />
            );
        }

        return (
            <div
                onClick={() => setEditingPimCell({ pimId: pim.id, field })}
                className="group cursor-pointer h-full p-1 -m-1 rounded hover:bg-blue-50 flex items-center justify-between min-h-[1.5rem]"
                title="Click para editar"
            >
                <span className="text-green-700 font-medium">{value || <span className="text-gray-400 font-normal">Sin asignar</span>}</span>
                <EditIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
        );
    };
    
    const handleStatusChange = (pimId: string, aimMapping: AimMapping, newStatus: AimMapping['status']) => {
        onMappingChange(pimId, { ...aimMapping, status: newStatus });
    };

    const handleAimModelChange = (pimId: string, aimMapping: AimMapping, newModel: string) => {
        onMappingChange(pimId, { ...aimMapping, modelAIM: newModel });
        setEditingMappingId(null);
    };
    
    const handleCommentChange = (pimId: string, aimMapping: AimMapping, value: string) => {
        onMappingChange(pimId, { ...aimMapping, comentarios: value });
        setEditingCommentCell(null);
    };

    const toggleRowExpansion = (pimId: string) => {
        setExpandedRows(prev => ({...prev, [pimId]: !prev[pimId]}));
    };
    
    const statusStyles: Record<AimMapping['status'], string> = {
        'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-300 focus:ring-yellow-500',
        'en integración': 'bg-blue-100 text-blue-800 border-blue-300 focus:ring-blue-500',
        'finalizado': 'bg-green-100 text-green-800 border-green-300 focus:ring-green-500',
    };

    const renderMappingControl = (pim: PimWithMappings, aimMapping: AimMapping) => {
        const isEditing = editingMappingId === aimMapping.mappingId;
        return (
             isEditing ? (
                <select
                    value={aimMapping.modelAIM || ''}
                    onChange={(e) => handleAimModelChange(pim.id, aimMapping, e.target.value)}
                    onBlur={() => setEditingMappingId(null)}
                    autoFocus
                    className="block w-full max-w-xs pl-3 pr-8 py-1.5 text-sm border-gray-300 focus:outline-none focus:ring-aena-green focus:border-aena-green rounded-md shadow-sm"
                >
                    <option value="" disabled>Seleccionar modelo...</option>
                    {availableAimModels.map(model => (
                        <option key={model} value={model}>{model}</option>
                    ))}
                </select>
            ) : (
                <div
                    className="group flex items-center justify-between p-1 -m-1 rounded cursor-pointer hover:bg-blue-50 h-full min-h-[1.5rem]"
                    onClick={() => setEditingMappingId(aimMapping.mappingId)}
                    title="Click para editar"
                >
                    <span className="text-sm text-green-700 font-medium">{aimMapping.modelAIM || <span className="text-gray-400 font-normal">Asignar...</span>}</span>
                    <EditIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                </div>
            )
        );
    }

    const renderCommentControl = (pim: PimWithMappings, aimMapping: AimMapping) => {
        const isEditing = editingCommentCell?.mappingId === aimMapping.mappingId;
        const value = aimMapping.comentarios;

        if (isEditing) {
            return (
                <textarea
                    defaultValue={value ?? ''}
                    onBlur={(e) => handleCommentChange(pim.id, aimMapping, e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleCommentChange(pim.id, aimMapping, e.currentTarget.value);
                        } else if (e.key === 'Escape') {
                            setEditingCommentCell(null);
                        }
                    }}
                    autoFocus
                    className="w-full text-sm border-gray-300 rounded shadow-sm focus:ring-aena-green focus:border-aena-green resize-y"
                    rows={2}
                />
            );
        }

        return (
            <div
                onClick={() => setEditingCommentCell({ mappingId: aimMapping.mappingId })}
                className="group cursor-pointer h-full p-1 -m-1 rounded hover:bg-blue-50 flex items-start justify-between min-h-[2.5rem] w-full"
                title="Click para editar"
            >
                <p className="text-sm text-gray-700 whitespace-pre-wrap break-words text-left">{value || <span className="text-gray-400">Añadir...</span>}</p>
                <EditIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1 mt-1" />
            </div>
        );
    };

    const renderStatusControl = (pim: PimWithMappings, aimMapping: AimMapping) => {
         const status = aimMapping.status ?? 'Pendiente';
         return (
             <select
                value={status}
                onChange={(e) => handleStatusChange(pim.id, aimMapping, e.target.value as AimMapping['status'])}
                className={`text-sm font-semibold rounded-full border px-2 py-1 appearance-none focus:outline-none focus:ring-2 cursor-pointer ${statusStyles[status]}`}
            >
                <option value="Pendiente">Pendiente</option>
                <option value="en integración">En Integración</option>
                <option value="finalizado">Finalizado</option>
            </select>
         );
    }

    const processedData = useMemo(() => {
        if (groupByAim) {
            const flattened = items
                .flatMap(pim => pim.aimMappings.map(aim => ({ pim, aim })))
                .filter(item => item.aim.modelAIM);

            const groups = flattened.reduce((acc, item) => {
                const key = item.aim.modelAIM!;
                if (!acc[key]) acc[key] = [];
                acc[key].push(item);
                return acc;
            }, {} as Record<string, { pim: PimWithMappings, aim: AimMapping }[]>);

            return {
                type: 'grouped-by-aim',
                groups: Object.keys(groups).sort().reduce((obj, key) => { 
                    obj[key] = groups[key]; 
                    return obj;
                }, {} as Record<string, { pim: PimWithMappings, aim: AimMapping }[]>)
            };
        }

        if (groupByActuacion) {
            const groups = items.reduce((acc, item) => {
                const key = item.actuacionName;
                if (!acc[key]) acc[key] = [];
                acc[key].push(item);
                return acc;
            }, {} as Record<string, PimWithMappings[]>);

            return {
                type: 'grouped-by-actuacion',
                groups: Object.keys(groups).sort().reduce((obj, key) => { 
                    obj[key] = groups[key]; 
                    return obj;
                }, {} as Record<string, PimWithMappings[]>)
            };
        }

        return { type: 'ungrouped', data: items };
    }, [items, groupByActuacion, groupByAim]);
    
    
    const getSortDirectionFor = (name: SortKey) => {
        if (!sortConfig) return undefined;
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };
    
    const tableHeaders: { key: SortKey | string; label:string, className?: string, sortable: boolean, tooltip?: string }[] = [
        { key: 'iata', label: 'IATA', className: 'w-20', sortable: false, tooltip: 'Se obtiene del proyecto del aeropuerto en el hub de activos de ACC' },
        { key: 'modelName', label: 'Modelo PIM Recibido', sortable: true, tooltip: 'Nombre del archivo' },
        { key: 'expediente', label: 'Expediente', sortable: true, tooltip: 'Se obtiene del nombre de la subcarpeta que indica el expediente dentro de la carpeta DocRef' },
        { key: 'denominationLDA', label: 'Denominación LDA', sortable: true, tooltip: 'Dato a introducir manualmente' },
        { key: 'fase', label: 'Fase', className: 'w-24 text-center', sortable: true, tooltip: 'Dato a introducir manualmente' },
        { key: 'dateReceived', label: 'Fecha Recibida', className: 'w-36 text-center', sortable: true },
        { key: 'modelAIM', label: 'Modelo AIM', sortable: false },
        { key: 'actions', label: '', className: 'w-16 text-center', sortable: false },
        { key: 'versionAIMNativo', label: 'Versión AIM Nativo', className: 'w-28 text-center', sortable: false },
        { key: 'status', label: 'Estado', className: 'w-36 text-center', sortable: false },
        { key: 'comentarios', label: 'Comentarios', className: 'w-96', sortable: false },
    ];
    
    const renderRows = (modelList: PimWithMappings[]) => modelList.map((pim) => {
        const isExpanded = expandedRows[pim.id];
        const hasMultipleMappings = pim.aimMappings.length > 1;

        return (
            <React.Fragment key={pim.id}>
                <tr className="bg-white hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-500 font-mono">{pim.iata}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-mono">{pim.modelName}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{pim.expediente}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        <EditablePimCell pim={pim} field="denominationLDA" />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center group hover:bg-blue-50">
                         <select
                            value={pim.fase}
                            onChange={(e) => onPimDataChange(pim.id, 'fase', e.target.value)}
                            className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-aena-green focus:border-aena-green py-1 bg-transparent group-hover:bg-blue-50 cursor-pointer text-green-700 font-medium"
                        >
                            <option value="AB">AB</option>
                            <option value="DIG">DIG</option>
                            <option value="PCD">PCD</option>
                        </select>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{formatDateToDMY(pim.dateReceived)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                        {hasMultipleMappings ? (
                             <button onClick={() => toggleRowExpansion(pim.id)} className="flex items-center text-blue-600 hover:underline">
                                <span>{pim.aimMappings.length} Mapeos AIM</span>
                                <svg className={`w-4 h-4 ml-1 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                        ) : renderMappingControl(pim, pim.aimMappings[0])}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                        <button
                            onClick={() => onAddMapping(pim.id)}
                            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-200 hover:text-aena-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aena-green"
                            title="Añadir otro mapeo AIM para este PIM"
                        >
                            <PlusIcon />
                        </button>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">
                        {!hasMultipleMappings ? (pim.aimMappings[0].versionAIMNativo ?? '–') : ''}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                       {!hasMultipleMappings ? renderStatusControl(pim, pim.aimMappings[0]) : null}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                        {!hasMultipleMappings ? renderCommentControl(pim, pim.aimMappings[0]) : ''}
                    </td>
                </tr>
                {isExpanded && hasMultipleMappings && pim.aimMappings.map((aimMapping) => (
                    <tr key={aimMapping.mappingId} className="bg-gray-50 hover:bg-gray-100">
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-400 font-mono">{pim.iata}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-400 font-mono">{pim.modelName}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-400">{pim.expediente}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-400">{pim.denominationLDA}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-400 text-center">{pim.fase}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-400 text-center">{formatDateToDMY(pim.dateReceived)}</td>
                        <td className="px-4 py-2 relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 select-none text-lg" aria-hidden="true">↳</span>
                            <div className="pl-5">
                                {renderMappingControl(pim, aimMapping)}
                            </div>
                        </td>
                        <td className="px-4 py-2 text-center">
                             <button
                                onClick={() => onRemoveMapping(pim.id, aimMapping.mappingId)}
                                className="p-1.5 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                title="Eliminar este mapeo"
                            >
                                <MinusIcon />
                            </button>
                        </td>
                        <td className="px-4 py-2 text-center text-sm text-gray-500">{aimMapping.versionAIMNativo ?? '–'}</td>
                        <td className="px-4 py-2 text-center">{renderStatusControl(pim, aimMapping)}</td>
                        <td className="px-4 py-2 text-sm text-gray-600">{renderCommentControl(pim, aimMapping)}</td>
                    </tr>
                ))}
            </React.Fragment>
        )
    });

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead className="bg-aena-dark text-white">
                    <tr>
                        {tableHeaders.map(({ key, label, className, sortable, tooltip }) => (
                            <th key={key} scope="col" className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${className || ''}`} title={tooltip}>
                                {sortable ? (
                                    <button onClick={() => requestSort(key as SortKey)} className="group flex items-center focus:outline-none w-full">
                                        <span className={className?.includes('text-center') ? 'mx-auto' : ''}>{label}</span>
                                        <SortIcon direction={getSortDirectionFor(key as SortKey)} />
                                    </button>
                                ) : (
                                    <span className={className?.includes('text-center') ? 'mx-auto block' : ''}>{label}</span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                
                {processedData.type === 'ungrouped' && (
                    <tbody className="bg-white divide-y divide-gray-200">
                        {renderRows(processedData.data)}
                    </tbody>
                )}
                {processedData.type === 'grouped-by-actuacion' && (
                    Object.entries(processedData.groups).map(([groupName, groupItems]: [string, PimWithMappings[]]) => (
                        <tbody key={groupName} className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td colSpan={tableHeaders.length} className="px-4 py-3 bg-gray-100 border-t border-b border-gray-300">
                                    <h4 className="text-sm font-bold text-gray-800">{groupName}</h4>
                                </td>
                            </tr>
                            {renderRows(groupItems)}
                        </tbody>
                    ))
                )}
                {processedData.type === 'grouped-by-aim' && (
                    Object.entries(processedData.groups).map(([groupName, groupItems]: [string, { pim: PimWithMappings, aim: AimMapping }[]]) => (
                        <tbody key={groupName} className="bg-white divide-y divide-gray-200">
                            <tr>
                                <td colSpan={tableHeaders.length} className="px-4 py-3 bg-gray-100 border-t border-b border-gray-300">
                                    <h4 className="text-sm font-bold text-gray-800">{groupName}</h4>
                                </td>
                            </tr>
                            {groupItems.map(({ pim, aim }) => (
                                <tr key={`${pim.id}-${aim.mappingId}`} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-500 font-mono">{pim.iata}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-mono">{pim.modelName}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{pim.expediente}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                        <EditablePimCell pim={pim} field="denominationLDA" />
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center hover:bg-blue-50">
                                        <select
                                            value={pim.fase}
                                            onChange={(e) => onPimDataChange(pim.id, 'fase', e.target.value)}
                                            className="w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-aena-green focus:border-aena-green py-1 bg-transparent hover:bg-blue-50 cursor-pointer text-green-700 font-medium"
                                        >
                                            <option value="AB">AB</option>
                                            <option value="DIG">DIG</option>
                                            <option value="PCD">PCD</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{formatDateToDMY(pim.dateReceived)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{renderMappingControl(pim, aim)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                                        <button
                                            onClick={() => onRemoveMapping(pim.id, aim.mappingId)}
                                            className="p-1.5 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                            title="Eliminar este mapeo"
                                        >
                                            <MinusIcon />
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-center">{aim.versionAIMNativo ?? '–'}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">{renderStatusControl(pim, aim)}</td>
                                    <td className="px-4 py-2 text-sm text-gray-600">{renderCommentControl(pim, aim)}</td>
                                </tr>
                            ))}
                        </tbody>
                    ))
                )}
            </table>
        </div>
    );
};

export default P11ModelReceptionTable;