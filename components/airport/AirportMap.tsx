import React, { useMemo, useState } from 'react';
import { Airport } from '../../types';

const StatusLabel: React.FC<{ status: Airport['integrationStatus'] }> = ({ status }) => {
    const statusStyles: Record<Airport['integrationStatus'], string> = {
        'Finalizado': 'bg-green-100 text-green-800',
        'En curso': 'bg-yellow-100 text-yellow-800',
        'Por iniciar': 'bg-gray-200 text-gray-800',
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status]}`}>{status}</span>;
};


const Tooltip: React.FC<{ data: { x: number; y: number; airport: Airport } }> = ({ data }) => {
    const { x, y, airport } = data;
    const width = 220;
    const height = 130;
    const offsetX = 15;
    const offsetY = 15;
    
    // Boundary checks to flip tooltip if it goes out of bounds
    const finalX = x + offsetX + width > 1000 ? x - width - offsetX : x + offsetX;
    const finalY = y + offsetY + height > 900 ? y - height - offsetY : y + offsetY;

    return (
        <foreignObject x={finalX} y={finalY} width={width} height={height} style={{pointerEvents: 'none'}}>
            <div className="bg-white p-3 rounded-lg shadow-xl border border-gray-200 text-sm text-gray-800 transition-opacity duration-200 opacity-100">
                <h4 className="font-bold text-base text-gray-900">{airport.name}</h4>
                <p className="text-gray-600">{airport.iataCode} - {airport.location}</p>
                <hr className="my-2" />
                <div className="space-y-1">
                    <p><strong>Actuaciones:</strong> {airport.actionCount}</p>
                    <div className="flex items-center">
                        <strong className="mr-2">Integración:</strong> <StatusLabel status={airport.integrationStatus} />
                    </div>
                </div>
            </div>
        </foreignObject>
    );
};


const AirportMarker: React.FC<{
    airport: Airport;
    cx: number;
    cy: number;
    onMouseEnter: (airport: Airport) => void;
    onMouseLeave: () => void;
}> = ({ airport, cx, cy, onMouseEnter, onMouseLeave }) => {
    
    const displayName = airport.name.replace('Aeropuerto de ', '').replace('Aeropuerto ', '');

    const labelConfig: { [key: string]: { dx: number; dy: number; anchor: 'start' | 'middle' | 'end'; name?: string; } } = {
        'MAD': { dx: 10, dy: 5, anchor: 'start', name: 'Adolfo Suárez Madrid-Barajas' },
        'BCN': { dx: 10, dy: 5, anchor: 'start', name: 'Josep Tarradellas\nBarcelona-El Prat' },
        'PMI': { dx: 10, dy: 5, anchor: 'start', name: 'Palma de\nMallorca' },
        'AGP': { dx: -10, dy: 10, anchor: 'end', name: 'Málaga-Costa del Sol' },
        'ALC': { dx: 10, dy: 10, anchor: 'start', name: 'Alicante-Elche' },
        'LPA': { dx: 0, dy: 30, anchor: 'middle', name: 'Gran\nCanaria' },
        'TFS': { dx: -10, dy: 20, anchor: 'end', name: 'Tenerife\nSur' },
        'ACE': { dx: -10, dy: -5, anchor: 'end', name: 'César Manrique-Lanzarote' },
        'FUE': { dx: 10, dy: 5, anchor: 'start', name: 'Fuerteventura' },
        'SVQ': { dx: -10, dy: 10, anchor: 'end' },
        'VLC': { dx: 10, dy: 10, anchor: 'start'},
        'IBZ': { dx: -10, dy: -10, anchor: 'end' },
        'BIO': { dx: 10, dy: 5, anchor: 'start' },
        'TFN': { dx: 10, dy: -5, anchor: 'start', name: 'Tenerife Norte'},
        'SCQ': { dx: -10, dy: -5, anchor: 'end', name: 'Santiago' },
        'MAH': { dx: 10, dy: -5, anchor: 'start', name: 'Menorca'},
        'GRO': { dx: 10, dy: -5, anchor: 'start', name: 'Girona-Costa Brava'},
        'GRX': { dx: -10, dy: 10, anchor: 'end', name: 'FGL Granada-Jaén'},
        'XRY': { dx: 10, dy: 10, anchor: 'start' },
        'LCG': { dx: -10, dy: -5, anchor: 'end', name: 'A Coruña'},
        'OVD': { dx: 0, dy: -10, anchor: 'middle', name: 'Asturias'},
        'SPC': { dx: -10, dy: -5, anchor: 'end', name: 'La Palma'},
        'RMU': { dx: 10, dy: 10, anchor: 'start', name: 'Internacional\nRegión de Murcia'},
        'LEI': { dx: 10, dy: 10, anchor: 'start', name: 'Almería'},
        'SDR': { dx: 0, dy: -10, anchor: 'middle', name: 'Seve Ballesteros-\nSantander'},
        'VGO': { dx: -10, dy: 5, anchor: 'end'},
        'ZAZ': { dx: -10, dy: 5, anchor: 'end' },
        'EAS': { dx: 10, dy: -5, anchor: 'start', name: 'San Sebastián'},
        'REU': { dx: -10, dy: 5, anchor: 'end'},
        'PNA': { dx: 10, dy: 5, anchor: 'start' },
        'VLL': { dx: 10, dy: 5, anchor: 'start' },
        'VIT': { dx: 10, dy: 5, anchor: 'start' },
        'MLN': { dx: 10, dy: 5, anchor: 'start', name: 'Melilla'},
        'LEN': { dx: -10, dy: -5, anchor: 'end' },
        'SLM': { dx: -10, dy: 5, anchor: 'end' },
        'RGS': { dx: 10, dy: 5, anchor: 'start', name: 'Burgos'},
        'RJL': { dx: -10, dy: -5, anchor: 'end', name: 'Logroño-Agoncillo'},
        'HSK': { dx: 10, dy: 5, anchor: 'start', name: 'Huesca-Pirineos'},
        'BJZ': { dx: -10, dy: -5, anchor: 'end' },
        'ODB': { dx: 0, dy: -10, anchor: 'middle' },
        'ABC': { dx: 10, dy: 10, anchor: 'start' },
        'GMZ, QGZ': { dx: -10, dy: 15, anchor: 'end', name: 'La Gomera'},
        'VDE': { dx: -10, dy: 15, anchor: 'end', name: 'El Hierro'},
        'JCU': { dx: -10, dy: 5, anchor: 'end', name: 'Ceuta'},
        'AEI': { dx: 10, dy: 5, anchor: 'start', name: 'Algeciras'},
        'QSA': { dx: 10, dy: 5, anchor: 'start' },
        'MCV, CVS': { dx: 0, dy: 15, anchor: 'middle', name: 'Madrid-Cuatro Vientos' },
        'default': { dx: 8, dy: 3, anchor: 'start' }
    };
    
    const config = labelConfig[airport.iataCode] || labelConfig[airport.iataCode.split(',')[0]] || labelConfig['default'];
    const finalName = config.name || displayName;
    const nameParts = finalName.split('\n');
    
    const isMajor = ['MAD', 'BCN', 'PMI', 'AGP', 'ALC', 'LPA', 'TFS', 'ACE', 'FUE', 'IBZ', 'SVQ', 'VLC'].includes(airport.iataCode);
    const fontSize = isMajor ? '1em' : '0.8em';
    const circleRadius = isMajor ? 5 : 4;

    const statusColors: Record<Airport['integrationStatus'], string> = {
        'Finalizado': 'fill-aena-green',
        'En curso': 'fill-yellow-400',
        'Por iniciar': 'fill-gray-400',
    };

    return (
        <a href={`#/airport/${airport.id}`} className="group">
            <g onMouseEnter={() => onMouseEnter(airport)} onMouseLeave={onMouseLeave}>
                <circle cx={cx} cy={cy} r={circleRadius} className={`${statusColors[airport.integrationStatus]} transition-transform duration-200 group-hover:scale-150 origin-center`} />
                <text 
                    x={cx + config.dx} 
                    y={cy + config.dy} 
                    className="font-semibold pointer-events-none fill-white transition-colors"
                    style={{ fontSize: fontSize, textAnchor: config.anchor, paintOrder: 'stroke', stroke: 'rgba(50,50,50,0.8)', strokeWidth: '0.25em', strokeLinejoin: 'round' }}
                >
                    {nameParts.map((part, i) => <tspan key={i} x={cx + config.dx} dy={i > 0 ? '1.2em' : 0}>{part}</tspan>)}
                </text>
            </g>
        </a>
    );
};


export const AirportMap: React.FC<{ airports: Airport[] }> = ({ airports }) => {
    const [tooltipData, setTooltipData] = useState<{ x: number, y: number, airport: Airport } | null>(null);

    const projection = useMemo(() => {
        const lonMin = -10.0, lonMax = 4.5, latMin = 35.8, latMax = 44.0;
        const canariesLonMin = -18.2, canariesLonMax = -13.3, canariesLatMin = 27.6, canariesLatMax = 29.4;
        const mapWidth = 1000, mapHeight = 900;
        const insetX = 50, insetY = 650, insetWidth = 200, insetHeight = 150;

        return (lat: number, lon: number) => {
            if (lon >= canariesLonMin && lon <= canariesLonMax && lat >= canariesLatMin && lat <= canariesLatMax) {
                const x = insetX + ((lon - canariesLonMin) / (canariesLonMax - canariesLonMin)) * insetWidth;
                const y = insetY + ((canariesLatMax - lat) / (canariesLatMax - canariesLatMin)) * insetHeight;
                return { x, y };
            }
            const x = ((lon - lonMin) / (lonMax - lonMin)) * mapWidth;
            const y = ((latMax - lat) / (latMax - latMin)) * mapHeight;
            return { x, y };
        };
    }, []);

    const handleMouseEnter = (airport: Airport) => {
        const { x, y } = projection(airport.lat, airport.lon);
        setTooltipData({ x, y, airport });
    };
    const handleMouseLeave = () => {
        setTooltipData(null);
    };

    const markers = useMemo(() => airports.map(airport => {
        const { x, y } = projection(airport.lat, airport.lon);
        return <AirportMarker key={airport.id} airport={airport} cx={x} cy={y} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />;
    }), [airports, projection, handleMouseEnter, handleMouseLeave]);

    const fullSpainPath = "M718.5,289.8l-12.8,11.2l-1.9,4.3l-4.5,1.5l-0.5,3.3l-3.5,1l-4.1-2l-3.7-0.2l-1.6,4.3l-4.6,1l-1.4-2.9l-5.2,0.3l-2.2,2.6l-2.9,0.3l-2.6-1.6l-3.3-2.7l-2.3-4.3l-2.1-3.4l-0.4-3.1l0.4-4.8l1.9-1.9l-1.7-3.5l-0.1-2.9l1.5-3.8l-1.2-1.6l-3.8,0.4l-4.3-3.4l-2.9-2.5l-0.9-1.6l-2.4-2.6l-1.8-3.7l-2.6-2.4l-2.8-0.4l-2.5,0.5l-1.9,1.4l-2.1,2.3l-3.2,0.6l-1.8-0.2l-2.1,0.3l-2.7-0.5l-1.9,0.4l-2.1,1.7l-2.4,1.1l-1.4,1l-1.6-0.1l-2.7,1l-1.4,1.5l-1.4,0.6l-2.1,0.7l-1.6,0.1l-1.9-1.1l-1.9-0.4l-1.6,0.4l-1.8,1.3l-2.1,0.3l-1.8-1.5l-1.5-0.7l-1.6,0.3l-2.2-0.2l-1.5,0.7l-2.4,0.1l-1.8-0.4l-1.9,0.3l-1.8-0.3l-1.8,0.3l-1.6-0.4l-1.6,0.3l-1.6-0.4l-1.5,0.3l-1.5-0.4l-1.5,0.3l-1.5-0.4l-1.4,0.3l-1.5-0.4l-1.4,0.3l-1.4-0.5l-1.3,0.3l-1.4-0.5l-1.3,0.3l-1.3-0.5l-1.2,0.3l-1.3-0.6l-1.2,0.3l-1.3-0.6l-1.2,0.3l-1.3-0.7l-1.1,0.3l-1.2-0.7l-1.1,0.3l-1.2-0.8l-1,0.3l-1.1-0.8l-1,0.3l-1.1-0.9l-0.9,0.3l-1-0.9l-0.9,0.3l-1-1l-0.8,0.3l-0.9-1l-0.8,0.3l-0.9-1.1l-0.7,0.3l-0.9-1.2l-0.6,0.3l-0.8-1.2l-0.6,0.3l-0.8-1.3l-0.5,0.3l-0.8-1.4l-0.4,0.3l-0.7-1.5l-0.4,0.3l-0.7-1.6l-0.3,0.3l-0.7-1.7l-0.2,0.3l-0.6-1.8l-0.2,0.3l-0.6-1.9l-0.1,0.3l-0.6-2l-0.1,0.3l-0.5-2.1l0,0.3l-0.5-2.2l0.1,0.3l-0.5-2.3l0.2,0.3l-0.5-2.4l0.3,0.3l-0.4-2.5l0.4,0.3l-0.4-2.6l0.5,0.3l-0.4-2.7l0.6,0.3l-0.4-2.8l0.7,0.3l-0.3-2.9l0.8,0.3l-0.3-3l0.9,0.3l-0.3-3.1l1,0.3l-0.3-3.2l1.1,0.3l-0.2-3.3l1.2,0.3l-0.2-3.4l1.3,0.3l-0.2-3.5l1.4,0.3l-0.2-3.6l1.5,0.3l-0.2-3.7l1.6,0.3l-0.1-3.8l1.7,0.3l-0.1-3.9l1.8,0.3l-0.1-4l1.9,0.3l-0.1-4.1l2,0.3l0-4.2l2.1,0.3l0-4.3l2.2,0.3l0-4.4l2.3,0.3l0-4.5l2.4,0.3l0-4.6l2.5,0.3l0-4.7l2.6,0.3l0.1-4.8l2.7,0.3l0.1-4.9l2.8,0.3l0.1-5l2.9,0.3l0.1-5.1l3,0.3l0.2-5.2l3.1,0.3l0.2-5.3l3.2,0.3l0.2-5.4l3.3,0.3l0.2-5.5l3.4,0.3l0.3-5.6l3.5,0.3l0.3-5.7l3.6,0.3l0.3-5.8l3.7,0.3l0.4-5.9l3.8,0.3l0.4-6l3.9,0.3l0.4-6.1l4,0.3l0.5-6.2l4.1,0.3l0.5-6.3l4.2,0.3l0.5-6.4l4.3,0.3l0.6-6.5l4.4,0.3l0.6-6.6l4.5,0.3l0.6-6.7l4.6,0.3l0.7-6.8l4.7,0.3l0.7-6.9l4.8,0.3l0.7-7l4.9,0.3l0.8-7.1l5,0.3l0.8-7.2l5.1,0.3l0.9-7.3l5.2,0.3l0.9-7.4l5.3,0.3l0.9-7.5l5.4,0.3l1-7.6l5.5,0.3l1-7.7l5.6,0.3l1.1-7.8l5.7,0.3l1.1-7.9l5.8,0.3l1.1-8l5.9,0.3l1.2-8.1l6,0.3l1.2-8.2l6.1,0.3l1.3-8.3l6.2,0.3l1.3-8.4l6.3,0.3l1.3-8.5l6.4,0.3l1.4-8.6l6.5,0.3l1.4-8.7l6.6,0.3l1.5-8.8l6.7,0.3l1.5-8.9l6.8,0.3l1.6-9l6.9,0.3l1.6-9.1l7,0.3l1.6-9.2l7.1,0.3l1.7-9.3l7.2,0.3l1.7-9.4l7.3,0.3l1.8-9.5l7.4,0.3l1.8-9.6l7.5,0.3l1.9-9.7l7.6,0.3l1.9-9.8l7.7,0.3l1.9-9.9l7.8,0.3l2-10l7.9,0.3l2-10.1l8,0.3l2.1-10.2l8.1,0.3l2.1-10.3l8.2,0.3l2.2-10.4l8.3,0.3l2.2-10.5l8.4,0.3l2.3-10.6l8.5,0.3l2.3-10.7l8.6,0.3l2.4-10.8l8.7,0.3l2.4-10.9l8.8,0.3l2.5-11l8.9,0.3l2.5-11.1l9,0.3l2.6-11.2l9.1,0z M936.4,466.1z M870.8,544.1z M891.1,484.2z M129.5,733.9z M221.4,754.7z M129.5,733.9z";

    return (
        <div className="bg-aena-dark rounded-lg shadow-lg overflow-hidden">
            <svg viewBox="0 0 1000 900" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                    <pattern id="dot-pattern" width="12" height="12" patternUnits="userSpaceOnUse">
                        <circle cx="4" cy="4" r="2.5" className="fill-gray-600" />
                    </pattern>
                    <clipPath id="spain-map-clip">
                        <path d={fullSpainPath} />
                    </clipPath>
                </defs>
                
                <rect width="1000" height="900" clipPath="url(#spain-map-clip)" fill="url(#dot-pattern)" />
                
                {/* Canary Islands Inset Box */}
                <g>
                    <rect x="50" y="650" width="200" height="150" fill="none" stroke="#9CA3AF" strokeWidth="1.5" rx="5" />
                </g>
                
                {markers}
                
                {tooltipData && <Tooltip data={tooltipData} />}
            </svg>
        </div>
    );
};
