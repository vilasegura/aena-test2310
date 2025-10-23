import React from 'react';
import { PIMAsset } from '../../types';

interface PimAssetSheetTableProps {
    assets: PIMAsset[];
    agrupacion: string;
}

const formatDateToDMY = (dateString: string | null | undefined): string => {
    if (!dateString || !/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
        return dateString || '–';
    }
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${day}-${month}-${year}`;
};

export const basePropertyHeaders: { key: keyof PIMAsset, label: string }[] = [
    { key: 'codigoEquipo', label: 'CODIGO DE EQUIPO' },
    { key: 'descripcion', label: 'DESCRIPCIÓN' },
    { key: 'marca', label: 'MARCA' },
    { key: 'modelo', label: 'MODELO' },
    { key: 'fechaInstalacion', label: 'FECHA INSTALACIÓN' },
    { key: 'precioCompra', label: 'PRECIO DE COMPRA' },
    { key: 'vidaUtil', label: 'VIDA ÚTIL' },
    { key: 'estado', label: 'ESTADO' },
    { key: 'ubicacion', label: 'UBICACION' },
    { key: 'descripcionUbicacion', label: 'DESCRIPCION UBICACION' },
];

export const headersMap: Record<string, { key: keyof PIMAsset, label: string }[]> = {
    '01_00_01': [...basePropertyHeaders, { key: 'potenciaTermicaMax', label: 'POTENCIA TÉRMICA MAX' }],
    '01_00_02': [...basePropertyHeaders, { key: 'potenciaTermicaModoFrio', label: 'POTENCIA TÉRMICA MODO FRIO' }, { key: 'potenciaTotalPorZona', label: 'POTENCIA TOTAL POR ZONA' }, { key: 'potenciaTermicaModoCalor', label: 'POTENCIA TERMICA MODO CALOR' }],
    '01_00_03': basePropertyHeaders,
    '01_00_04': [...basePropertyHeaders, { key: 'ruta', label: 'RUTA' }, { key: 'rutaNueva', label: 'RUTA NUEVA' }, { key: 'potenciaKw', label: 'POTENCIA (KW)' }],
    '01_00_05': [...basePropertyHeaders, { key: 'ruta', label: 'RUTA' }, { key: 'rutaNueva', label: 'RUTA NUEVA' }, { key: 'potenciaKw', label: 'POTENCIA (KW)' }],
    '01_00_06': [...basePropertyHeaders, { key: 'ruta', label: 'RUTA' }],
    '02_02_04': [...basePropertyHeaders, { key: 'ruta', label: 'RUTA' }, { key: 'tipoDeAgenteExtintor', label: 'TIPO DE AGENTE EXTINTOR' }, { key: 'pesoCargaKg', label: 'PESO/CARGA (KG)' }, { key: 'fechaDeRetimbrado', label: 'FECHA DE RETIMBRADO' }],
    '03_01_05': [...basePropertyHeaders, { key: 'nBombasDeAgua', label: 'Nº BOMBAS DE AGUA' }, { key: 'potenciaIndividualBombas', label: 'POTENCIA INDIVIDUAL BOMBAS' }, { key: 'marcaBombasDeAgua', label: 'MARCA BOMBAS DE AGUA' }, { key: 'modeloBombasDeAgua', label: 'MODELO BOMBAS DE AGUA' }, { key: 'nSerieBombasDeAgua', label: 'Nº SERIE BOMBAS DE AGUA' }, { key: 'zonaQueAbastece', label: 'ZONA QUE ABASTECE' }],
    '04_00_01': [...basePropertyHeaders, { key: 'sistemaDeAccionamiento', label: 'SISTEMA DE ACCCIONAMIENTO (...)' }, { key: 'velocidad015', label: 'VELOCIDAD > 0.15' }, { key: 'afeccionADora', label: 'AFECCIÓN A DORA' }],
    '10_00_01': [...basePropertyHeaders, { key: 'longitud', label: 'LONGITUD' }],
};

export const getHeadersForAgrupacion = (agrupacion: string) => {
    // Default to base headers if no specific config is found
    return headersMap[agrupacion] || basePropertyHeaders;
};

const PimAssetSheetTable: React.FC<PimAssetSheetTableProps> = ({ assets, agrupacion }) => {
    const propertyHeaders = getHeadersForAgrupacion(agrupacion);
    
    return (
        <div className="overflow-x-auto border rounded-lg shadow-sm">
            <table className="min-w-full text-sm border-collapse">
                <thead className="bg-gray-100 text-gray-700 text-xs font-bold align-middle text-center">
                    <tr>
                        <th rowSpan={2} className="border border-gray-300 p-2 align-bottom bg-gray-50">Nivel 2 = Sistema de Maximo</th>
                        <th rowSpan={2} className="border border-gray-300 p-2 align-bottom bg-gray-50">Nivel 3 = Subsistema de Maximo</th>
                        <th rowSpan={2} className="border border-gray-300 p-2 align-bottom bg-gray-50">Nivel 4 = Tipo de Activo de Maximo</th>
                        <th rowSpan={2} className="border border-gray-300 p-2 align-bottom bg-gray-50">Agrupacion Maximo</th>
                        <th rowSpan={2} className="border border-gray-300 p-2 align-bottom bg-gray-50">Codigo BIM Maximo</th>
                        <th colSpan={propertyHeaders.length} className="border border-gray-300 p-2 bg-gray-200">PROPIEDADES</th>
                    </tr>
                    <tr>
                        {/* FIX: Cast `h.key` to string to satisfy React's `key` prop type, which doesn't accept symbols. */}
                        {propertyHeaders.map(h => (
                            <th key={h.key as string} className="border border-gray-300 p-2 font-semibold bg-gray-200">{h.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white text-gray-800 text-left">
                    {assets.map(asset => (
                        <tr key={asset.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 p-2">{asset.sistemaMaximo}</td>
                            <td className="border border-gray-300 p-2">{asset.subsistemaMaximo}</td>
                            <td className="border border-gray-300 p-2">{asset.tipoActivoMaximo}</td>
                            <td className="border border-gray-300 p-2">{asset.agrupacionMaximo}</td>
                            <td className="border border-gray-300 p-2">{asset.codigoBIMMaximo}</td>
                            {/* FIX: Cast `h.key` to string to satisfy React's `key` prop type, which doesn't accept symbols. */}
                            {propertyHeaders.map(h => {
                                const value = asset[h.key as keyof PIMAsset] as string;
                                const isDate = h.key === 'fechaInstalacion' || h.key === 'fechaDeRetimbrado';
                                const displayValue = isDate ? formatDateToDMY(value) : (value ?? '–');

                                return (
                                    <td key={h.key as string} className="border border-gray-300 p-2">{displayValue}</td>
                                );
                            })}
                        </tr>
                    ))}
                    {assets.length === 0 && (
                        <tr>
                            <td colSpan={5 + propertyHeaders.length} className="text-center p-4 text-gray-500 border border-gray-300">No hay activos en este grupo.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default PimAssetSheetTable;