
import React, { useState, useRef, useEffect } from 'react';
import { MappingPSet, MappingCategory } from '../../types';

interface BimMappingTableProps {
    psets: MappingPSet[];
    categories: MappingCategory[];
    onMappingChange: (categoryId: string, attributeId: string, value: string | null) => void;
}

const phases = [
  { code: 'TP', label: 'Desde Trabajos previos' },
  { code: 'PB', label: 'Desde Proyecto básico' },
  { code: 'PC', label: 'Desde Proyecto constructivo' },
  { code: 'OB', label: 'Desde Obra' },
  { code: 'DFO', label: 'Desde Documentación final de obra' },
  { code: 'OM', label: 'Desde Operación y mantenimiento' },
  { code: 'PC-PC', label: 'Solo fase de Proyecto Constructivo' },
  { code: 'OB-OB', label: 'Solo fase de Obra' },
  { code: 'TP-OB', label: 'Desde Trabajos Previos a Obra' },
  { code: 'PC-OB', label: 'Desde Proyecto constructivo a Obra' },
];


const BimMappingTable: React.FC<BimMappingTableProps> = ({ psets, categories, onMappingChange }) => {
    
    const [activeCell, setActiveCell] = useState<{ categoryId: string, attributeId: string } | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const allAttributes = psets.flatMap(pset => pset.attributes);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activeCell && menuRef.current && !menuRef.current.contains(event.target as Node)) {
                // Check if the click was on another table cell button
                const target = event.target as HTMLElement;
                if (!target.closest('td[data-cell-id]')) {
                    setActiveCell(null);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeCell]);


    const handleSelectPhase = (categoryId: string, attributeId: string, phase: string | null) => {
        onMappingChange(categoryId, attributeId, phase);
        setActiveCell(null);
    };

    return (
        <div className="overflow-auto border border-gray-200 rounded-lg" style={{ maxHeight: '70vh' }}>
            <table className="min-w-full text-xs border-separate border-spacing-0">
                <thead className="sticky top-0 z-20 bg-gray-100">
                    <tr className="text-gray-600 font-bold uppercase">
                        <th colSpan={3} className="sticky left-0 bg-gray-200 z-30 p-2 border-b border-r border-gray-300">Categoría</th>
                        {psets.map(pset => (
                            <th key={pset.id} colSpan={pset.attributes.length} className="p-2 border-b border-r border-gray-300 text-center">
                                {pset.name}
                            </th>
                        ))}
                    </tr>
                    <tr className="text-gray-500 font-semibold">
                        <th className="sticky left-0 bg-gray-100 z-30 p-2 border-b border-r border-gray-300 w-20 min-w-[5rem]">LOD 200</th>
                        <th className="sticky left-[5rem] bg-gray-100 z-30 p-2 border-b border-r border-gray-300 w-20 min-w-[5rem]">LOD 300</th>
                        <th className="sticky left-[10rem] bg-gray-100 z-30 p-2 border-b border-r border-gray-300 w-64 min-w-[16rem]">Atributos</th>
                        {allAttributes.map(attr => (
                             <th key={attr.id} className="p-2 border-b border-r border-gray-300 font-normal" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                                <span className="py-2">{attr.name}</span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white text-center">
                    {categories.map(category => (
                        <tr key={category.id} className="hover:bg-gray-50">
                            <td className="sticky left-0 bg-white hover:bg-gray-50 z-10 p-2 border-b border-r border-gray-200">{category.lod200}</td>
                            <td className="sticky left-[5rem] bg-white hover:bg-gray-50 z-10 p-2 border-b border-r border-gray-200">{category.lod300}</td>
                            <td className="sticky left-[10rem] bg-white hover:bg-gray-50 z-10 p-2 border-b border-r border-gray-200 text-left font-medium text-gray-800">{category.name}</td>
                            {allAttributes.map(attr => {
                                const mappingValue = category.mappings[attr.id];
                                const isCellActive = activeCell?.categoryId === category.id && activeCell?.attributeId === attr.id;
                                return (
                                    <td 
                                        key={attr.id} 
                                        data-cell-id={`${category.id}-${attr.id}`}
                                        className="relative p-0 border-b border-r border-gray-200"
                                    >
                                        <button 
                                            className={`w-full h-full min-h-[2.5rem] px-2 py-1 text-center font-bold text-sm transition-colors duration-150 ${
                                                mappingValue ? 'text-aena-green hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'
                                            } ${isCellActive ? 'bg-aena-green/20' : ''}`}
                                            onClick={() => setActiveCell({ categoryId: category.id, attributeId: attr.id })}
                                        >
                                            {mappingValue || ''}
                                        </button>

                                        {isCellActive && (
                                            <div ref={menuRef} className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-30 text-left overflow-hidden">
                                                <div className="py-2 px-3 bg-gray-50 border-b">
                                                    <p className="text-xs text-gray-500">Fase para</p>
                                                    <p className="text-xs font-semibold text-gray-800">{attr.name}</p>
                                                </div>
                                                <div className="max-h-60 overflow-y-auto">
                                                    {phases.map(phase => (
                                                        <button
                                                            key={phase.code}
                                                            onClick={() => handleSelectPhase(category.id, attr.id, phase.code)}
                                                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            title={phase.label}
                                                        >
                                                            <span className="font-bold mr-2">{phase.code}</span>
                                                            <span className="text-gray-600">{phase.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="border-t">
                                                     <button
                                                        onClick={() => handleSelectPhase(category.id, attr.id, null)}
                                                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold"
                                                    >
                                                        Limpiar asignación
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BimMappingTable;