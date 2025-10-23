import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PropertySet, BimAttribute } from '../../types';
import Card from '../ui/Card';

const PredefinedValueIcon = () => (
    <svg className="w-5 h-5 text-aena-green flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const NoPredefinedValueIcon = () => (
    <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const OptionsIcon = () => (
    <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
);

const AttributeOptionsMenu: React.FC<{ attribute: BimAttribute }> = ({ attribute }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div className="relative">
            <button onClick={() => setIsOpen(!isOpen)} className="p-1 rounded-full hover:bg-gray-200">
                <OptionsIcon />
            </button>
            {isOpen && (
                 <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200"
                    onMouseLeave={() => setIsOpen(false)}
                >
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Editar</a>
                    {attribute.hasPredefinedValue ? (
                        <Link to={`/requisitos/bim/atributos/${attribute.id}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Modificar valor predeterminado</Link>
                    ) : (
                         <span className="block px-4 py-2 text-sm text-gray-400 cursor-not-allowed" title="Este atributo no tiene valores predefinidos.">Modificar valor predeterminado</span>
                    )}
                </div>
            )}
        </div>
    );
};

const PropertySetCard: React.FC<{ propertySet: PropertySet }> = ({ propertySet }) => {
    return (
        <Card className="flex flex-col">
            <div className="p-4 border-b bg-gray-50">
                <p className="text-xs font-semibold text-gray-500 uppercase">{propertySet.name}</p>
                <h3 className="text-md font-bold text-gray-800">{propertySet.code}</h3>
            </div>
            <div className="p-4 flex-grow space-y-3 divide-y divide-gray-100">
                {propertySet.attributes.map(attr => (
                    <div key={attr.id} className="flex items-center pt-3 first:pt-0">
                        {attr.hasPredefinedValue ? <PredefinedValueIcon /> : <NoPredefinedValueIcon />}
                        <div className="ml-3 flex-grow">
                            <p className="text-sm font-semibold text-gray-700">{attr.name}</p>
                            <p className="text-xs text-gray-500">
                                {attr.hasPredefinedValue ? 'El atributo tiene valor predeterminado' : 'El atributo no tiene valor predeterminado'}
                            </p>
                        </div>
                        <AttributeOptionsMenu attribute={attr} />
                    </div>
                ))}
            </div>
            <div className="p-4 border-t mt-auto">
                <button className="w-full bg-aena-green text-white font-semibold py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Nuevo Atributo
                </button>
            </div>
        </Card>
    );
};

export default PropertySetCard;