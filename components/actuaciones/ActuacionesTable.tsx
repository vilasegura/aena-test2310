import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ActuacionDetail, ActionStatus } from '../../types';

type SortKey = 'name' | 'p1_1_status' | 'p1_2_status' | 'p4_status';

const useSortableData = (items: ActuacionDetail[], config: { key: SortKey; direction: string } | null = null) => {
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

const DetailsIcon = () => (
     <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
);

const StatusLabel: React.FC<{ status: ActionStatus }> = ({ status }) => {
    const statusStyles: Record<ActionStatus, string> = {
        'En curso': 'bg-yellow-100 text-yellow-800',
        'Pendiente': 'bg-red-100 text-red-800',
        'Publicado': 'bg-green-100 text-green-800',
        'N/A': 'bg-gray-100 text-gray-800',
    };

    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status]}`}>
            {status}
        </span>
    );
};


const ActuacionesTable: React.FC<{ actuaciones: ActuacionDetail[] }> = ({ actuaciones }) => {
    const { items, requestSort, sortConfig } = useSortableData(actuaciones, { key: 'name', direction: 'ascending'});
    
    const getSortDirectionFor = (name: SortKey) => {
        if (!sortConfig) return undefined;
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };
    
    const tableHeaders: { key: SortKey; label: string, className?: string }[] = [
        { key: 'name', label: 'Actuación' },
        { key: 'p1_1_status', label: 'P1.1', className: 'text-center' },
        { key: 'p1_2_status', label: 'P1.2', className: 'text-center' },
        { key: 'p4_status', label: 'P4', className: 'text-center' },
    ];

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-aena-dark text-white">
                    <tr>
                        {tableHeaders.map(({ key, label, className }) => (
                            <th key={key} scope="col" className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${className || ''}`}>
                                <button onClick={() => requestSort(key)} className="group flex items-center focus:outline-none w-full">
                                    <span className={className === 'text-center' ? 'mx-auto' : ''}>{label}</span>
                                    <SortIcon direction={getSortDirectionFor(key)} />
                                </button>
                            </th>
                        ))}
                        <th scope="col" className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                            Enlace ACC
                        </th>
                        <th scope="col" className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                            Detalles
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((actuacion) => (
                        <tr key={actuacion.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{actuacion.name}</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center"><StatusLabel status={actuacion.p1_1_status} /></td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center"><StatusLabel status={actuacion.p1_2_status} /></td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center"><StatusLabel status={actuacion.p4_status} /></td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                                <button className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aena-green" title="Abrir enlace ACC">
                                    <LinkIcon active={actuacion.accLinkActive} />
                                </button>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                                <Link to={`/actuacion/${actuacion.id}`} className="inline-block p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aena-green" title={`Ver detalles de ${actuacion.name}`}>
                                    <DetailsIcon />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ActuacionesTable;