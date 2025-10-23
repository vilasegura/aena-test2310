

import React, { useState, useMemo } from 'react';
import { mockActuaciones, mockAirports } from '../data';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import SearchInput from '../components/ui/SearchInput';
import AllActuacionesTable from '../components/actuaciones/AllActuacionesTable';
import { Actuacion } from '../types';

const FilterDropdown: React.FC<{
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder: string;
  className?: string;
}> = ({ label, options, value, onChange, placeholder, className = '' }) => (
    <div className={className}>
        <label htmlFor={label} className="sr-only">{label}</label>
        <select
            id={label}
            name={label}
            value={value}
            onChange={onChange}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-aena-green focus:border-aena-green sm:text-sm rounded-md shadow-sm"
        >
            <option value="">{placeholder}</option>
            {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    </div>
);

const ToggleSwitch: React.FC<{
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}> = ({ label, enabled, onChange }) => {
  return (
    <div className="flex items-center">
      <label htmlFor="toggle-switch-group" className="text-sm font-medium text-gray-700 mr-3">{label}</label>
      <button
        id="toggle-switch-group"
        type="button"
        onClick={() => onChange(!enabled)}
        className={`${
          enabled ? 'bg-aena-green' : 'bg-gray-200'
        } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aena-green`}
      >
        <span
          className={`${
            enabled ? 'translate-x-6' : 'translate-x-1'
          } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
        />
      </button>
    </div>
  );
};


const ActionListPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [airportFilter, setAirportFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [groupByAirport, setGroupByAirport] = useState(true);

    const filteredActuaciones = useMemo(() => {
        return mockActuaciones.filter((actuacion: Actuacion) => {
            const searchMatch = actuacion.name.toLowerCase().includes(searchTerm.toLowerCase());
            const airportMatch = airportFilter ? actuacion.airportId === airportFilter : true;
            const statusMatch = statusFilter ? actuacion.status === statusFilter : true;
            return searchMatch && airportMatch && statusMatch;
        });
    }, [searchTerm, airportFilter, statusFilter]);
    
    const airportOptions = mockAirports.map(a => ({ value: a.id, label: a.name })).sort((a,b) => a.label.localeCompare(b.label));
    const statusOptions = [...new Set(mockActuaciones.map(a => a.status))].map(status => ({ value: status, label: status }));

    return (
        <div className="space-y-6">
            <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Actuaciones' }]} />
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-gray-800">Listado de Actuaciones</h1>
                <p className="text-md text-gray-600">Explore y gestione todas las actuaciones en la red de aeropuertos de Aena.</p>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm flex flex-col lg:flex-row items-center gap-4 sticky top-0 z-10">
                <div className="w-full lg:w-1/3">
                    <SearchInput 
                        value={searchTerm} 
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Buscar por nombre de actuación..."
                    />
                </div>
                <FilterDropdown
                    label="Filtrar por Aeropuerto"
                    options={airportOptions}
                    value={airportFilter}
                    onChange={e => setAirportFilter(e.target.value)}
                    placeholder="Todos los aeropuertos"
                    className="w-full lg:w-auto"
                />
                <FilterDropdown
                    label="Filtrar por Estado"
                    options={statusOptions}
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    placeholder="Todos los estados"
                    className="w-full lg:w-auto"
                />
                <div className="lg:ml-auto">
                    <ToggleSwitch 
                        label="Agrupar por Aeropuerto"
                        enabled={groupByAirport}
                        onChange={setGroupByAirport}
                    />
                </div>
            </div>
            
            {filteredActuaciones.length > 0 ? (
                <AllActuacionesTable actuaciones={filteredActuaciones} groupByAirport={groupByAirport} />
            ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <h3 className="text-xl font-medium text-gray-700">No se encontraron actuaciones</h3>
                    <p className="text-gray-500 mt-2">Intente ajustar su búsqueda o filtros.</p>
                </div>
            )}
        </div>
    );
};

export default ActionListPage;