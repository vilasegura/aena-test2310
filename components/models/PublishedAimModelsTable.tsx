import React, { useMemo, useState } from 'react';
import { AimTransfer } from '../../types';

export type PublishedAimModelStatus = 'Pendiente' | 'En curso' | 'Compartido' | 'Publicado';

export interface PublishedAimModel {
  id: string;
  iata: string;
  tipoAim: string;
  codigoAim: string;
  disciplina: string;
  modeloAim: string;
  versionAimNativo: number | null;
  versionAimIfc: number | null;
  estado: PublishedAimModelStatus;
  comentarios?: string;
}

type SortKey = keyof Omit<PublishedAimModel, 'id' | 'versionAimIfc'>;

const useSortableData = (items: PublishedAimModel[], config: { key: SortKey; direction: string } | null = null) => {
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

interface PublishedAimModelsTableProps {
  models: PublishedAimModel[];
  onModelChange: (model: PublishedAimModel) => void;
}

const PublishedAimModelsTable: React.FC<PublishedAimModelsTableProps> = ({ models, onModelChange }) => {
    const { items, requestSort, sortConfig } = useSortableData(models, { key: 'modeloAim', direction: 'ascending'});
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

    const handleStatusChange = (modelId: string, newStatus: PublishedAimModelStatus) => {
        const modelToUpdate = models.find(m => m.id === modelId);
        if (modelToUpdate) {
            onModelChange({ ...modelToUpdate, estado: newStatus });
        }
    };

    const handleCommentChange = (modelId: string, newComment: string) => {
        const modelToUpdate = models.find(m => m.id === modelId);
        if (modelToUpdate) {
            onModelChange({ ...modelToUpdate, comentarios: newComment });
        }
        setEditingCommentId(null);
    };
    
    const getSortDirectionFor = (name: SortKey) => {
        if (!sortConfig) return undefined;
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };
    
    const tableHeaders: { key: SortKey; label: string, className?: string }[] = [
        { key: 'iata', label: 'IATA', className: 'w-20' },
        { key: 'tipoAim', label: 'Tipo AIM' },
        { key: 'codigoAim', label: 'Código AIM' },
        { key: 'disciplina', label: 'Disciplina' },
        { key: 'modeloAim', label: 'NOMENCLATURA MODELO' },
        { key: 'versionAimNativo', label: 'Versión AIM Nativo', className: 'w-28 text-center' },
        { key: 'estado', label: 'Estado', className: 'w-48 text-center' },
        { key: 'comentarios', label: 'Comentarios', className: 'w-96' },
    ];

    const statusStyles: Record<PublishedAimModelStatus, string> = {
        'Pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-300 focus:ring-yellow-500',
        'En curso': 'bg-blue-100 text-blue-800 border-blue-300 focus:ring-blue-500',
        'Compartido': 'bg-indigo-100 text-indigo-800 border-indigo-300 focus:ring-indigo-500',
        'Publicado': 'bg-green-100 text-green-800 border-green-300 focus:ring-green-500',
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-aena-dark text-white">
                    <tr>
                        {tableHeaders.map(({ key, label, className }) => (
                            <th key={key as string} scope="col" className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${className || ''}`}>
                                <button onClick={() => requestSort(key)} className="group flex items-center focus:outline-none w-full">
                                    <span className={className?.includes('text-center') ? 'mx-auto' : ''}>{label}</span>
                                    <SortIcon direction={getSortDirectionFor(key)} />
                                </button>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((model) => (
                        <tr key={model.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-500 font-mono">{model.iata}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{model.tipoAim}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{model.codigoAim}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{model.disciplina}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{model.modeloAim}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{model.versionAimNativo ?? '–'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                                <select
                                    value={model.estado}
                                    onChange={(e) => handleStatusChange(model.id, e.target.value as PublishedAimModelStatus)}
                                    className={`text-xs font-semibold rounded-full border px-2 py-1 appearance-none focus:outline-none focus:ring-2 cursor-pointer ${statusStyles[model.estado]}`}
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="En curso">En curso</option>
                                    <option value="Compartido">Compartido</option>
                                    <option value="Publicado">Publicado</option>
                                </select>
                            </td>
                             <td className="px-4 py-3 text-sm text-gray-600">
                                {editingCommentId === model.id ? (
                                    <textarea
                                        defaultValue={model.comentarios}
                                        onBlur={(e) => handleCommentChange(model.id, e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleCommentChange(model.id, e.currentTarget.value);
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
                                        onClick={() => setEditingCommentId(model.id)}
                                        className="group cursor-pointer h-full p-1 -m-1 rounded hover:bg-blue-50 flex items-start justify-between min-h-[2.5rem] w-full"
                                        title="Click para editar"
                                    >
                                        <p className="whitespace-pre-wrap break-words text-left">{model.comentarios || <span className="text-gray-400">Añadir...</span>}</p>
                                        <EditIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1 mt-1" />
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PublishedAimModelsTable;