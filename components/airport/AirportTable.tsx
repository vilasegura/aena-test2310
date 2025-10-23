import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Airport } from '../../types';

type SortKey = 'level' | 'iataCode' | 'name' | 'actionCount';

const useSortableData = (items: Airport[], config: { key: SortKey; direction: string } | null = null) => {
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
    if (!direction) return <svg className="w-4 h-4 inline-block ml-1 text-gray-400 group-hover:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>;
    if (direction === 'ascending') return <svg className="w-4 h-4 inline-block ml-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>;
    return <svg className="w-4 h-4 inline-block ml-1 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>;
};

const LinkIcon: React.FC<{ active: boolean }> = ({ active }) => (
    <svg className={`w-5 h-5 ${active ? 'text-gray-600' : 'text-gray-300'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      {!active && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6" />}
    </svg>
);

const AirportTable: React.FC<{ airports: Airport[] }> = ({ airports }) => {
    const { items, requestSort, sortConfig } = useSortableData(airports, { key: 'level', direction: 'ascending'});
    
    const getSortDirectionFor = (name: SortKey) => {
        if (!sortConfig) return undefined;
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };
    
    const tableHeaders: { key: SortKey; label: string, className?: string }[] = [
        { key: 'level', label: 'Nivel', className: 'w-16' },
        { key: 'iataCode', label: 'IATA', className: 'w-24' },
        { key: 'name', label: 'Ubicación' },
        { key: 'actionCount', label: 'Actuaciones', className: 'text-center' },
    ];

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-aena-dark text-white">
                    <tr>
                        {tableHeaders.map(({ key, label, className }) => (
                            <th key={key} scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${className || ''}`}>
                                <button onClick={() => requestSort(key)} className="group flex items-center focus:outline-none w-full">
                                    <span className={className === 'text-center' ? 'mx-auto' : ''}>{label}</span>
                                    <SortIcon direction={getSortDirectionFor(key)} />
                                </button>
                            </th>
                        ))}
                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                            Enlace ACC
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((airport) => (
                        <tr key={airport.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{airport.level}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{airport.iataCode}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                <Link to={`/airport/${airport.id}`} className="hover:text-aena-green transition-colors duration-150">
                                    {airport.name}
                                </Link>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{airport.actionCount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                {airport.accLinkActive && airport.accUrl ? (
                                    <a
                                        href={airport.accUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aena-green"
                                        title="Abrir enlace ACC en nueva pestaña"
                                    >
                                        <LinkIcon active={true} />
                                    </a>
                                ) : (
                                    <div className="inline-block p-2" title="Enlace ACC inactivo">
                                        <LinkIcon active={false} />
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

export default AirportTable;