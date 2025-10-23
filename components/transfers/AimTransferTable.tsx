import React, { useMemo, useState } from 'react';
import { AimTransfer } from '../../types';

type SortKey = 'iata' | 'expediente' | 'denominationLDA' | 'fase' | 'modelReceived' | 'modelAIM' | 'versionAIMNativo' | 'versionAIMIFC' | 'status';

const useSortableData = (items: AimTransfer[], config: { key: SortKey; direction: string } | null = null) => {
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

const EditIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

interface AimTransferTableProps {
  transfers: AimTransfer[];
  groupByAim: boolean;
  interactiveAimModel?: boolean;
  availableAimModels?: string[];
  onTransferChange?: (transfer: AimTransfer) => void;
}

const AimTransferTable: React.FC<AimTransferTableProps> = ({ transfers, groupByAim, interactiveAimModel = false, availableAimModels = [], onTransferChange }) => {
    const [editingTransferId, setEditingTransferId] = useState<string | null>(null);
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

    const handleStatusChange = (transferId: string, newStatus: AimTransfer['status']) => {
        if (!onTransferChange) return;
        const transferToUpdate = transfers.find(t => t.id === transferId);
        if (transferToUpdate) {
            onTransferChange({ ...transferToUpdate, status: newStatus });
        }
    };

    const handleAimModelChange = (transferId: string, newModel: string) => {
        if (!onTransferChange) return;
        const transferToUpdate = transfers.find(t => t.id === transferId);
        if (transferToUpdate) {
            onTransferChange({ ...transferToUpdate, modelAIM: newModel });
        }
        setEditingTransferId(null); // Exit edit mode
    };

    const handleCommentChange = (transferId: string, newComment: string) => {
        if (!onTransferChange) return;
        const transferToUpdate = transfers.find(t => t.id === transferId);
        if (transferToUpdate) {
            onTransferChange({ ...transferToUpdate, comentarios: newComment });
        }
        setEditingCommentId(null);
    };


    const { items, requestSort, sortConfig } = useSortableData(transfers, { key: 'expediente', direction: 'ascending'});
    
    const groupedTransfers = useMemo(() => {
        if (!groupByAim) return null;

        const groups = items.reduce((acc, transfer) => {
            const key = transfer.modelAIM || 'Sin Asignar';
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(transfer);
            return acc;
        }, {} as Record<string, AimTransfer[]>);
        
        return Object.keys(groups)
            .sort()
            .reduce((obj, key) => { 
                obj[key] = groups[key]; 
                return obj;
            }, {} as Record<string, AimTransfer[]>);

    }, [items, groupByAim]);

    const getSortDirectionFor = (name: SortKey) => {
        if (!sortConfig) return undefined;
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };
    
    const tableHeaders: { key: SortKey | string; label: string, className?: string, sortable: boolean }[] = [
        { key: 'iata', label: 'IATA', className: 'w-20', sortable: true },
        { key: 'expediente', label: 'Expediente', sortable: true },
        { key: 'denominationLDA', label: 'Denominación LDA', sortable: true },
        { key: 'fase', label: 'Fase', className: 'w-24 text-center', sortable: true },
        { key: 'modelReceived', label: 'Modelo recibido', sortable: true },
        { key: 'modelAIM', label: 'Modelo AIM', sortable: true },
        { key: 'versionAIMNativo', label: 'Versión AIM Nativo', className: 'w-28 text-center', sortable: true },
        { key: 'versionAIMIFC', label: 'Versión AIM IFC', className: 'w-28 text-center', sortable: true },
        { key: 'status', label: 'Estado', className: 'w-36 text-center', sortable: true },
        { key: 'comentarios', label: 'Comentarios', className: 'w-96', sortable: false },
    ];

    const renderRows = (transferList: AimTransfer[]) => transferList.map((transfer) => {
        const isEditing = editingTransferId === transfer.id;
        const statusStyles: Record<AimTransfer['status'], string> = {
            'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-300 focus:ring-yellow-500',
            'en integración': 'bg-blue-100 text-blue-800 border-blue-300 focus:ring-blue-500',
            'finalizado': 'bg-green-100 text-green-800 border-green-300 focus:ring-green-500',
        };

        return (
            <tr key={transfer.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-500 font-mono">{transfer.iata}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{transfer.expediente}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{transfer.denominationLDA}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{transfer.fase}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{transfer.modelReceived}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    {isEditing && interactiveAimModel && availableAimModels && availableAimModels.length > 0 ? (
                        <select
                            value={transfer.modelAIM || ''}
                            onChange={(e) => handleAimModelChange(transfer.id, e.target.value)}
                            onBlur={() => setEditingTransferId(null)}
                            autoFocus
                            className="block w-full max-w-xs pl-3 pr-8 py-1.5 text-xs border-gray-300 focus:outline-none focus:ring-aena-green focus:border-aena-green rounded-md shadow-sm"
                            aria-label={`Seleccionar modelo AIM para ${transfer.modelReceived}`}
                        >
                            <option value="" disabled>Seleccionar modelo...</option>
                            {availableAimModels.map(model => (
                                <option key={model} value={model}>{model}</option>
                            ))}
                        </select>
                    ) : (
                        <div
                            className={`flex items-center justify-between p-1 -m-1 rounded ${interactiveAimModel ? 'cursor-pointer hover:bg-gray-200 group' : ''}`}
                            onClick={() => interactiveAimModel && setEditingTransferId(transfer.id)}
                            title={interactiveAimModel ? "Click para editar" : ""}
                        >
                            <span>{transfer.modelAIM || <span className="text-gray-400">Asignar...</span>}</span>
                            {interactiveAimModel && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            )}
                        </div>
                    )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{transfer.versionAIMNativo ?? '–'}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{transfer.versionAIMIFC ?? '–'}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                    <select
                        value={transfer.status}
                        onChange={(e) => handleStatusChange(transfer.id, e.target.value as AimTransfer['status'])}
                        className={`text-xs font-semibold rounded-full border px-2 py-1 appearance-none focus:outline-none focus:ring-2 cursor-pointer ${statusStyles[transfer.status]}`}
                    >
                        <option value="Pendiente">Pendiente</option>
                        <option value="en integración">En Integración</option>
                        <option value="finalizado">Finalizado</option>
                    </select>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                    {editingCommentId === transfer.id ? (
                        <textarea
                            defaultValue={transfer.comentarios}
                            onBlur={(e) => handleCommentChange(transfer.id, e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleCommentChange(transfer.id, e.currentTarget.value);
                                } else if (e.key === 'Escape') {
                                    setEditingCommentId(null);
                                }
                            }}
                            autoFocus
                            className="w-full text-sm border-gray-300 rounded shadow-sm focus:ring-aena-green focus:border-aena-green resize-y"
                            rows={2}
                        />
                    ) : (
                        <div
                            onClick={() => onTransferChange && setEditingCommentId(transfer.id)}
                            className={`group h-full p-1 -m-1 rounded flex items-start justify-between min-h-[2.5rem] w-full ${onTransferChange ? 'cursor-pointer hover:bg-blue-50' : ''}`}
                            title={onTransferChange ? "Click para editar" : ""}
                        >
                            <p className="whitespace-pre-wrap break-words text-left">{transfer.comentarios || (onTransferChange && <span className="text-gray-400">Añadir...</span>) || '–'}</p>
                            {onTransferChange && <EditIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1 mt-1" />}
                        </div>
                    )}
                </td>
            </tr>
        );
    });

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead className="bg-aena-dark text-white">
                    <tr>
                        {tableHeaders.map(({ key, label, className, sortable }) => (
                            <th key={key} scope="col" className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${className || ''}`}>
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
                {groupByAim && groupedTransfers ? (
                    Object.entries(groupedTransfers).map(([groupName, groupItems]: [string, AimTransfer[]]) => (
                        <tbody key={groupName} className="bg-white">
                            <tr>
                                <td colSpan={tableHeaders.length} className="px-4 py-3 bg-gray-100 border-t border-b border-gray-300">
                                    <h4 className="text-sm font-bold text-gray-800">{groupName}</h4>
                                </td>
                            </tr>
                            {/* FIX: Cast groupItems to AimTransfer[] to fix 'unknown' type error */}
                            {renderRows(groupItems)}
                        </tbody>
                    ))
                ) : (
                    <tbody className="bg-white divide-y divide-gray-200">
                        {renderRows(items)}
                    </tbody>
                )}
            </table>
        </div>
    );
};

export default AimTransferTable;