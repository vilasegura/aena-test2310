import React, { useMemo, useState } from 'react';
import { ModelReception } from '../../types';

type SortKey = 'iata' | 'modelReceived' | 'expediente' | 'denominationLDA' | 'fase' | 'dateReceived' | 'versionPIMNativo' | 'versionPIMIFC';

const formatDateToDMY = (dateString: string | null | undefined): string => {
    if (!dateString || !/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
        return dateString || '';
    }
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${day}-${month}-${year}`;
};

const useSortableData = (items: ModelReception[], config: { key: SortKey; direction: string } | null = null) => {
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


const ModelReceptionTable: React.FC<{ models: ModelReception[] }> = ({ models }) => {
    const { items, requestSort, sortConfig } = useSortableData(models, { key: 'dateReceived', direction: 'ascending'});
    
    const getSortDirectionFor = (name: SortKey) => {
        if (!sortConfig) return undefined;
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };
    
    const tableHeaders: { key: SortKey; label: string, className?: string }[] = [
        { key: 'iata', label: 'IATA', className: 'w-20' },
        { key: 'modelReceived', label: 'Modelo recibido' },
        { key: 'expediente', label: 'Expediente' },
        { key: 'denominationLDA', label: 'Denominación LDA' },
        { key: 'fase', label: 'Fase', className: 'w-24 text-center' },
        { key: 'dateReceived', label: 'Fecha Recibida', className: 'w-36 text-center' },
        { key: 'versionPIMNativo', label: 'Versión PIM Nativo', className: 'w-28 text-center' },
        { key: 'versionPIMIFC', label: 'Versión PIM IFC', className: 'w-28 text-center' },
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
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-500 font-mono">{model.iata}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{model.modelReceived}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{model.expediente}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{model.denominationLDA}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{model.fase}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{formatDateToDMY(model.dateReceived)}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{model.versionPIMNativo}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{model.versionPIMIFC}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ModelReceptionTable;