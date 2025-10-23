import React, { useMemo, useState } from 'react';

export interface SentAimModel {
  id: string;
  iata: string;
  modelo: string;
  version: number | null;
  compartidoCon: string;
  fecha: string;
  comentarios?: string;
}

type SortKey = keyof Omit<SentAimModel, 'id'>;

const useSortableData = (items: SentAimModel[], config: { key: SortKey; direction: string } | null = null) => {
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


const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateString;
    }
};

interface SentAimModelsTableProps {
    models: SentAimModel[];
    onModelChange: (model: SentAimModel) => void;
}

const SentAimModelsTable: React.FC<SentAimModelsTableProps> = ({ models, onModelChange }) => {
    const { items, requestSort, sortConfig } = useSortableData(models, { key: 'fecha', direction: 'descending'});
    const [editingCommentId, setEditingCommentId] = React.useState<string | null>(null);
    
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
        { key: 'iata', label: 'IATA', className: 'w-24' },
        { key: 'modelo', label: 'Modelo' },
        { key: 'version', label: 'Versión', className: 'w-24 text-center' },
        { key: 'compartidoCon', label: 'Compartido con' },
        { key: 'fecha', label: 'Fecha', className: 'w-48 text-center' },
        { key: 'comentarios', label: 'Comentarios', className: 'w-64' },
    ];

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-aena-dark text-white">
                    <tr>
                        {tableHeaders.map(({ key, label, className }) => (
                            <th key={key} scope="col" className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${className || ''}`}>
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
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{model.iata}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800 font-mono">{model.modelo}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{model.version ?? '–'}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{model.compartidoCon}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{formatDate(model.fecha)}</td>
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

export default SentAimModelsTable;