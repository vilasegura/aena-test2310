

import React from 'react';
import Breadcrumbs from '../components/ui/Breadcrumbs';
import { mockPropertySets } from '../data';
import PropertySetCard from '../components/requirements/PropertySetCard';

const BimAttributesPage: React.FC = () => {
    return (
        <div className="space-y-6">
            <Breadcrumbs items={[
                { label: 'Inicio', href: '/' },
                { label: 'Requisitos de Información', href: '/requisitos' },
                { label: 'Definición de atributos' }
            ]} />

            <header>
                <h1 className="text-3xl font-bold text-gray-800">Definición de atributos</h1>
                <p className="mt-2 text-md text-gray-600 max-w-4xl">
                    Visualice los atributos organizados por property sets. Desde esta interfaz se pueden tanto crear nuevos atributos como visualizar y modificar los valores predefinidos para cada uno, que luego podrán integrarse con los modelos BIM y la herramienta de auditoría.
                </p>
            </header>
            
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-700">Property Sets</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {mockPropertySets.map(pset => (
                        <PropertySetCard key={pset.id} propertySet={pset} />
                    ))}
                </div>
            </div>
            
            <div className="flex justify-center py-4">
                <div className="w-1/3 h-1.5 bg-aena-green rounded-full"></div>
            </div>
        </div>
    );
};

export default BimAttributesPage;