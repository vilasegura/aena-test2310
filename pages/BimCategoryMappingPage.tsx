


import React, { useState, useMemo } from 'react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { mockMappingCategories, mockMappingPSets, mockBimCategories } from '../data';
import BimMappingTable from '../components/requirements/BimMappingTable';
import SearchInput from '../components/ui/SearchInput';
import { MappingCategory } from '../types';

const FilterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 12.414V17a1 1 0 01-1.447.894l-2-1A1 1 0 018 16v-3.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
    </svg>
);

const ExportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
        <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
    </svg>
);

const BimCategoryMappingPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [mappingData, setMappingData] = useState<MappingCategory[]>(mockMappingCategories);
    const [activePSetId, setActivePSetId] = useState<string>('all');

    const filteredData = useMemo(() => {
        if (!searchTerm) {
            return mappingData;
        }
        const lowercasedFilter = searchTerm.toLowerCase();
        // Also get the full category data to search in all its properties
        const categoryMap = new Map(mockBimCategories.map(cat => [cat.id, cat]));

        return mappingData.filter(row => {
            const categoryDetails = categoryMap.get(row.id);
            if (categoryDetails) {
                 return Object.values(categoryDetails).some(value =>
                    String(value).toLowerCase().includes(lowercasedFilter)
                );
            }
            return row.name.toLowerCase().includes(lowercasedFilter);
        });
    }, [searchTerm, mappingData]);
    
    const handleMappingChange = (categoryId: string, attributeId: string, value: string | null) => {
        setMappingData(currentData => {
            return currentData.map(row => {
                if (row.id === categoryId) {
                    const newMappings = { ...row.mappings };
                    if (value === null) {
                        delete newMappings[attributeId];
                    } else {
                        newMappings[attributeId] = value;
                    }
                    return { ...row, mappings: newMappings };
                }
                return row;
            });
        });
    };
    
    const psetFilters = useMemo(() => [{ id: 'all', name: 'Todos' }, ...mockMappingPSets.map(p => ({ id: p.id, name: p.name }))], []);

    const filteredPsets = useMemo(() => {
        if (activePSetId === 'all') {
            return mockMappingPSets;
        }
        return mockMappingPSets.filter(p => p.id === activePSetId);
    }, [activePSetId]);


    return (
        <div className="space-y-6">
            <Breadcrumbs items={[
                { label: 'Inicio', href: '/' },
                { label: 'Requisitos de Información', href: '/requisitos' },
                // FIX: Completed the breadcrumb item to resolve missing 'label' property error.
                { label: 'Mapeo de Categorías y Atributos' }
            ]} />

            <header>
                <h1 className="text-3xl font-bold text-gray-800">Mapeo de Categorías y Atributos</h1>
                <p className="mt-2 text-md text-gray-600 max-w-4xl">
                    En esta pantalla se realiza el mapeo de las categorías y atributos de los requisitos de información BIM.
                </p>
            </header>

            <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-2">
                        <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                            <FilterIcon /> Filtros
                        </button>
                        <div className="flex items-center gap-2">
                            {psetFilters.map(pset => (
                                <button
                                    key={pset.id}
                                    onClick={() => setActivePSetId(pset.id)}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${activePSetId === pset.id ? 'bg-aena-green text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                >
                                    {pset.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-grow">
                        <SearchInput
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar por nombre de categoría, clase, tipo..."
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                            <ExportIcon /> Exportar
                        </button>
                    </div>
                </div>

                <BimMappingTable
                    psets={filteredPsets}
                    categories={filteredData}
                    onMappingChange={handleMappingChange}
                />
            </div>
        </div>
    );
};

// FIX: Added default export to resolve the module import error in App.tsx.
export default BimCategoryMappingPage;
