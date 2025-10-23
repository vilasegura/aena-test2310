import React, { useMemo, useState } from 'react';
import { BimCategory } from '../../types';

type SortKey = keyof Omit<BimCategory, 'id'>;

const useSortableData = (items: BimCategory[], config: { key: SortKey; direction: string } | null = null) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
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
    if (!direction) return <svg className="w-4 h-4 inline-block ml-1 text-gray-400 opacity-50 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>;
    if (direction === 'ascending') return <svg className="w-4 h-4 inline-block ml-1 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>;
    return <svg className="w-4 h-4 inline-block ml-1 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>;
};

const OptionsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
);


const BimCategoryTable: React.FC<{ categories: BimCategory[] }> = ({ categories }) => {
    const { items, requestSort, sortConfig } = useSortableData(categories, { key: 'nombre', direction: 'ascending'});
    
    const getSortDirectionFor = (name: SortKey) => {
        if (!sortConfig) return undefined;
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };
    
    const tableHeaders: { key: SortKey; label: string, className?: string }[] = [
        { key: 'nombre', label: '1001_AENA_ID_Nombre' },
        { key: 'claseAena', label: '1003_AENA_ID_ClaseAena' },
        { key: 'tipoAena', label: '1005_AENA_ID_TipoAena' },
        { key: 'codigoOmniclass', label: '1007_AENA_ID_CodigoOmniclass' },
        { key: 'entidadIfc', label: 'Entidad IFC (Revit: Exportar a IFC como)' },
        { key: 'tipoIfc', label: 'Tipo IFC (Revit: Tipo Predefinido de IFC)' },
    ];

    return (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {/* FIX: Cast `key` to string to satisfy React's `key` prop type, which doesn't accept symbols. */}
                        {tableHeaders.map(({ key, label, className }) => (
                            <th key={key as string} scope="col" className={`px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider ${className || ''}`}>
                                <button onClick={() => requestSort(key)} className="group flex items-center focus:outline-none w-full">
                                    <span>{label}</span>
                                    <SortIcon direction={getSortDirectionFor(key)} />
                                </button>
                            </th>
                        ))}
                        <th scope="col" className="relative px-4 py-3">
                            <span className="sr-only">Opciones</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((category) => (
                        <tr key={category.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{category.nombre}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{category.claseAena}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{category.tipoAena}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-mono">{category.codigoOmniclass}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-mono">{category.entidadIfc}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 font-mono">{category.tipoIfc}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                                <button className="p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-aena-green">
                                    <OptionsIcon />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BimCategoryTable;