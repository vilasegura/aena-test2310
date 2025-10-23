import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Actuacion } from '../../types';
// FIX: Import mockAirports to resolve 'Cannot find name' error.
import { mockAirports } from '../../data';

type SortKey = 'name' | 'airportName' | 'status';

const useSortableData = (items: Actuacion[], config: { key: SortKey; direction: string } | null = null) => {
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

const StatusLabel: React.FC<{ status: Actuacion['status'] }> = ({ status }) => {
    const statusStyles: Record<Actuacion['status'], string> = {
        'En progreso': 'bg-blue-100 text-blue-800',
        'Completada': 'bg-green-100 text-green-800',
        'En espera': 'bg-yellow-100 text-yellow-800',
        'Cancelada': 'bg-red-100 text-red-800',
    };

    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status]}`}>
            {status}
        </span>
    );
};

const AllActuacionesTable: React.FC<{ actuaciones: Actuacion[]; groupByAirport: boolean; }> = ({ actuaciones, groupByAirport }) => {
    const { items, requestSort, sortConfig } = useSortableData(actuaciones, { key: 'name', direction: 'ascending'});
    
    const groupedActuaciones = useMemo(() => {
        if (!groupByAirport) return null;

        const groups = items.reduce((acc, actuacion) => {
            const airportKey = actuacion.airportId;
            const airport = mockAirports.find(a => a.id === airportKey);
            const key = airport ? airport.name : airportKey;
            
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(actuacion);
            return acc;
        }, {} as Record<string, Actuacion[]>);
        
        return Object.keys(groups)
            .sort()
            .reduce((obj, key) => { 
                obj[key] = groups[key]; 
                return obj;
            }, {} as Record<string, Actuacion[]>);

    }, [items, groupByAirport]);
    
    const getSortDirectionFor = (name: SortKey) => {
        if (!sortConfig) return undefined;
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };
    
    const headersConfig = useMemo(() => {
        const base: { key: string; label: string; className?: string; sortable: boolean }[] = [
            { key: 'name', label: 'Actuación', sortable: true },
            { key: 'status', label: 'Estado', className: 'w-36 text-center', sortable: true },
            { key: 'requirements', label: 'Req. Info', className: 'w-32 text-center', sortable: false },
        ];
        if (groupByAirport) {
            return base;
        }
        return [
            base[0],
            { key: 'airportName', label: 'Aeropuerto', sortable: true },
            ...base.slice(1)
        ];
    }, [groupByAirport]);


    const renderRows = (actuacionList: Actuacion[]) => (
        actuacionList.map((actuacion) => (
            <tr key={actuacion.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                    <Link to={`/actuacion/${actuacion.id}`} className="hover:text-aena-green transition-colors duration-150">
                        {actuacion.name}
                    </Link>
                </td>
                {!groupByAirport && <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{actuacion.airportName}</td>}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center"><StatusLabel status={actuacion.status} /></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    {actuacion.hasRequirements ? (
                        <Link to="/requisitos/bim/mapeo" className="inline-flex items-center justify-center" title="Ver requisitos definidos">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-aena-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </Link>
                    ) : (
                        <></>
                    )}
                </td>
            </tr>
        ))
    );

    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
                <thead className="bg-aena-dark text-white">
                    <tr>
                        {headersConfig.map(({ key, label, className, sortable }) => (
                            <th key={key} scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${className || ''}`}>
                                {sortable ? (
                                     <button onClick={() => requestSort(key as SortKey)} className="group flex items-center focus:outline-none w-full">
                                        <span className={className?.includes('text-center') ? 'mx-auto' : ''}>{label}</span>
                                        <SortIcon direction={getSortDirectionFor(key as SortKey)} />
                                    </button>
                                ) : (
                                    <div className={`flex items-center w-full ${className?.includes('text-center') ? 'justify-center' : ''}`}>
                                        {label}
                                    </div>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                {groupByAirport && groupedActuaciones ? (
                    Object.entries(groupedActuaciones).map(([airportName, groupItems]: [string, Actuacion[]]) => (
                        <tbody key={airportName} className="bg-white">
                            <tr>
                                <td colSpan={headersConfig.length} className="px-6 py-3 bg-gray-100 border-t border-b border-gray-300">
                                    <Link to={`/airport/${groupItems[0].airportId}`} className="text-sm font-bold text-gray-800 hover:text-aena-green hover:underline">{airportName}</Link>
                                </td>
                            </tr>
                            {/* FIX: Cast groupItems to Actuacion[] to fix 'unknown' type error */}
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

export default AllActuacionesTable;