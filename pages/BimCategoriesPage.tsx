

import React, { useState } from 'react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { mockBimCategories } from '../data';
import BimCategoryTable from '../components/requirements/BimCategoryTable';
import SearchInput from '../components/ui/SearchInput';

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

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.25 2.25a.75.75 0 00-1.5 0v8.614L4.795 7.835a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.25z" />
        <path d="M5.25 12a.75.75 0 000 1.5h9.5a.75.75 0 000-1.5h-9.5z" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);


const BimCategoriesPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCategories = mockBimCategories.filter(category =>
        Object.values(category).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="space-y-6">
            <Breadcrumbs items={[
                { label: 'Inicio', href: '/' },
                { label: 'Requisitos de Información', href: '/requisitos' },
                { label: 'Categorías de elementos' }
            ]} />

            <header>
                <h1 className="text-3xl font-bold text-gray-800">Definición de categorías de elementos</h1>
                <p className="mt-2 text-md text-gray-600 max-w-4xl">
                    En esta pantalla se definen las categorías de los atributos de elementos, que se definen en los modelos BIM dentro del grupo de propiedades (1000).
                </p>
            </header>

            <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Requisitos de Información</h2>
                        <p className="text-sm text-gray-500">Categorías de los requisitos de información BIM</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-2">
                        <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                            <FilterIcon /> Filtros
                        </button>
                    </div>
                    <div className="flex-grow">
                        <SearchInput
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar en todas las columnas..."
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                            <ExportIcon /> Exportar
                        </button>
                        <button className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-aena-green border border-transparent rounded-md hover:bg-green-700">
                            <UploadIcon /> Subir Excel
                        </button>
                    </div>
                </div>
                
                <BimCategoryTable categories={filteredCategories} />
            </div>

            <button
                title="Añadir nueva categoría"
                className="fixed bottom-8 right-8 bg-aena-green text-white rounded-full p-4 shadow-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                <PlusIcon />
            </button>
        </div>
    );
};

export default BimCategoriesPage;