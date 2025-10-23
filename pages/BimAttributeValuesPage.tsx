

import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { mockPropertySets, mockPredefinedValues } from '../data';
import { BimAttribute } from '../types';
import PredefinedValuesTable from '../components/requirements/PredefinedValuesTable';
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
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
);


const BimAttributeValuesPage: React.FC = () => {
    const { attributeId } = useParams<{ attributeId: string }>();
    const [searchTerm, setSearchTerm] = useState('');

    const { attribute, values } = useMemo(() => {
        let foundAttribute: BimAttribute | null = null;
        for (const pset of mockPropertySets) {
            const attr = pset.attributes.find(a => a.id === attributeId);
            if (attr) {
                foundAttribute = attr;
                break;
            }
        }
        
        const attributeValues = mockPredefinedValues.filter(v => v.attributeId === attributeId);

        return { attribute: foundAttribute, values: attributeValues };
    }, [attributeId]);
    
    const filteredValues = values.filter(value =>
        Object.values(value).some(v =>
            String(v).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    if (!attribute) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold">Atributo no encontrado</h2>
                <Link to="/requisitos/bim/atributos" className="text-aena-green hover:underline mt-4 inline-block">Volver a la definición de atributos</Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Breadcrumbs items={[
                { label: 'Inicio', href: '/' },
                { label: 'Requisitos de Información', href: '/requisitos' },
                { label: 'Definición de atributos', href: '/requisitos/bim/atributos' },
                { label: attribute.name }
            ]} />
            
            <header>
                <h1 className="text-3xl font-bold text-gray-800">Definición de valores predeterminados</h1>
                <p className="mt-2 text-md text-gray-600 max-w-4xl">
                    Interfaz para modificar los valores predeterminados en el atributo.
                </p>
            </header>

            <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Valores admitidos para {attribute.name}</h2>
                        <p className="text-sm text-gray-500">Valores predeterminados que puede tomar el atributo.</p>
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
                            placeholder="Buscar en la tabla..."
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

                <PredefinedValuesTable values={filteredValues} />
            </div>
        </div>
    );
};

export default BimAttributeValuesPage;