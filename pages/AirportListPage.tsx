
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { mockAirports, mockActuacionesDetail } from '../data';
import { Airport } from '../types';
import Card from '../components/ui/Card';
import SearchInput from '../components/ui/SearchInput';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import AirportTable from '../components/airport/AirportTable';
import GlobalStats from '../components/dashboard/GlobalStats';

const AirportCard: React.FC<{ airport: Airport }> = ({ airport }) => (
  <Link to={`/airport/${airport.id}`}>
    <Card className="flex flex-col h-full group">
      <div className="overflow-hidden">
        <img className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-300" src={airport.imageUrl} alt={`Vista de ${airport.name}`} />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-900">{airport.name}</h3>
        <p className="text-sm text-gray-500">{airport.iataCode} - {airport.location}</p>
        <div className="mt-4 pt-4 border-t border-gray-200 flex-grow flex items-end justify-between text-sm">
            <div className="flex items-center">
                <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                <span>{airport.actionCount} Actuaciones</span>
            </div>
             <div className="flex items-center text-gray-500">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>{airport.lastSync}</span>
            </div>
        </div>
      </div>
    </Card>
  </Link>
);

const ViewModeToggle: React.FC<{ viewMode: 'grid' | 'table'; setViewMode: (mode: 'grid' | 'table') => void }> = ({ viewMode, setViewMode }) => {
    const baseClasses = "p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aena-green";
    const activeClasses = "bg-aena-green text-white";
    const inactiveClasses = "text-gray-500 bg-white hover:bg-gray-100";

    return (
        <div className="flex bg-gray-200 p-1 rounded-lg">
            <button onClick={() => setViewMode('grid')} className={`${baseClasses} ${viewMode === 'grid' ? activeClasses : inactiveClasses}`} aria-label="Vista de tarjetas">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            </button>
            <button onClick={() => setViewMode('table')} className={`${baseClasses} ${viewMode === 'table' ? activeClasses : inactiveClasses} ml-1`} aria-label="Vista de tabla">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
            </button>
        </div>
    );
};

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


const AirportListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [levelFilter, setLevelFilter] = useState('');

  const filteredAirports = useMemo(() => {
    return mockAirports.filter(airport => {
        const searchMatch = (
            airport.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            airport.iataCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            airport.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const levelMatch = levelFilter ? airport.level === levelFilter : true;
        
        return searchMatch && levelMatch;
    });
  }, [searchTerm, levelFilter]);
  
  const levelOptions = [...new Set(mockAirports.map(a => a.level))].sort().map(level => ({ value: level, label: level }));
  
  const globalStats = useMemo(() => {
    const totalAirports = mockAirports.length;
    const airportsWithActions = mockAirports.filter(a => a.actionCount > 0).length;
    const inProgressIntegrations = mockAirports.filter(a => a.integrationStatus === 'En curso').length;
    const totalActuaciones = mockActuacionesDetail.length;
    return { totalAirports, airportsWithActions, inProgressIntegrations, totalActuaciones };
  }, []);

  return (
    <div className="space-y-6">
       <Breadcrumbs items={[{ label: 'Inicio', href: '/' }, { label: 'Aeropuertos' }]} />
       
       <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-800">Listado de Aeropuertos</h1>
            <p className="text-md text-gray-600">Supervise y acceda al estado de las integraciones y actuaciones de los aeropuertos de la red de Aena.</p>
        </div>
        
        <GlobalStats stats={globalStats} />

      <div className="p-4 bg-white rounded-lg shadow-sm flex flex-col lg:flex-row items-center gap-4 sticky top-0 z-10">
        <div className="w-full lg:w-1/3">
          <SearchInput 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por Ubicación o código IATA..."
          />
        </div>
        <FilterDropdown
            label="Filtrar por Nivel"
            options={levelOptions}
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value)}
            placeholder="Todos los niveles"
            className="w-full lg:w-auto"
        />
        <div className="lg:ml-auto">
            <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>
      
      {filteredAirports.length > 0 ? (
        viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAirports.map(airport => (
                    <AirportCard key={airport.id} airport={airport} />
                ))}
            </div>
        ) : (
            <AirportTable airports={filteredAirports} />
        )
      ) : (
         <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-medium text-gray-700">No se encontraron aeropuertos</h3>
            <p className="text-gray-500 mt-2">Intente ajustar su búsqueda o filtros.</p>
        </div>
      )}
    </div>
  );
};

export default AirportListPage;