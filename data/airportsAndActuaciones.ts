import { Airport, Actuacion, ActuacionDetail, ActionStatus } from '../types';
import { toYMD_HM, generateRecentDate, toISODate } from './utils';

// --- AIRPORT RAW DATA ---
const originalMockAirports: Omit<Airport, 'actionCount' | 'integrationStatus'>[] = [
  { id: 'MAD', name: 'Aeropuerto Adolfo Suárez Madrid-Barajas', iataCode: 'MAD', location: 'Madrid', lastSync: toYMD_HM(generateRecentDate(0, 0, 15)), imageUrl: 'https://images.unsplash.com/photo-1578305698042-9310a4e50333?q=80&w=2070&auto=format&fit=crop', level: 'N1', accLinkActive: false, accUrl: undefined, lat: 40.4983, lon: -3.5676 },
  { id: 'BCN', name: 'Aeropuerto Josep Tarradellas Barcelona-El Prat', iataCode: 'BCN', location: 'Barcelona', lastSync: toYMD_HM(generateRecentDate(0, 0, 30)), imageUrl: 'https://images.unsplash.com/photo-1545641203-7d072a169b27?q=80&w=1974&auto=format&fit=crop', level: 'N1', accLinkActive: false, accUrl: undefined, lat: 41.2974, lon: 2.0833 },
  { id: 'PMI', name: 'Aeropuerto de Palma de Mallorca', iataCode: 'PMI', location: 'Palma de Mallorca', lastSync: toYMD_HM(generateRecentDate(0, 2, 0)), imageUrl: 'https://images.unsplash.com/photo-1628182189674-7009d666e4a2?q=80&w=2070&auto=format&fit=crop', level: 'N1', accLinkActive: false, accUrl: undefined, lat: 39.5517, lon: 2.7388 },
  { id: 'ALC', name: 'Aeropuerto de Alicante-Elche', iataCode: 'ALC', location: 'Alicante', lastSync: toYMD_HM(generateRecentDate(0, 3, 15)), imageUrl: 'https://images.unsplash.com/photo-1600003023812-32c02cb12cbd?q=80&w=2070&auto=format&fit=crop', level: 'N1', accLinkActive: false, accUrl: undefined, lat: 38.2822, lon: -0.5581 },
  { id: 'AGP', name: 'Aeropuerto de Málaga-Costa del Sol', iataCode: 'AGP', location: 'Málaga', lastSync: toYMD_HM(generateRecentDate(0, 1, 10)), imageUrl: 'https://images.unsplash.com/photo-1558509312-d92229f30c6a5?q=80&w=2070&auto=format&fit=crop', level: 'N1', accLinkActive: false, accUrl: undefined, lat: 36.6749, lon: -4.4991 },
  { id: 'LPA', name: 'Aeropuerto de Gran Canaria', iataCode: 'LPA', location: 'Gran Canaria', lastSync: toYMD_HM(generateRecentDate(0, 0, 5)), imageUrl: 'https://images.unsplash.com/photo-1558236122-421711241198?q=80&w=2070&auto=format&fit=crop', level: 'N1', accLinkActive: false, accUrl: undefined, lat: 27.9319, lon: -15.3866 },
  { id: 'TFS', name: 'Aeropuerto de Tenerife Sur', iataCode: 'TFS', location: 'Tenerife', lastSync: toYMD_HM(generateRecentDate(1, 1, 50)), imageUrl: 'https://images.unsplash.com/photo-1502452368-333d9b04a8e3?q=80&w=2070&auto=format&fit=crop', level: 'N1', accLinkActive: false, accUrl: undefined, lat: 28.0445, lon: -16.5725 },
  { id: 'IBZ', name: 'Aeropuerto de Ibiza', iataCode: 'IBZ', location: 'Ibiza', lastSync: toYMD_HM(generateRecentDate(0, 4, 30)), imageUrl: 'https://images.unsplash.com/photo-1549420956-29a39fe5354e?q=80&w=2070&auto=format&fit=crop', level: 'N2', accLinkActive: false, accUrl: undefined, lat: 38.8729, lon: 1.3731 },
  { id: 'SVQ', name: 'Aeropuerto de Sevilla', iataCode: 'SVQ', location: 'Sevilla', lastSync: toYMD_HM(generateRecentDate(0, 3, 15)), imageUrl: 'https://images.unsplash.com/photo-1563720231924-1b4d06a117b9?q=80&w=1964&auto=format&fit=crop', level: 'N2', accLinkActive: false, accUrl: undefined, lat: 37.418, lon: -5.8931 },
  { id: 'ACE', name: 'Aeropuerto de Lanzarote', iataCode: 'ACE', location: 'Lanzarote', lastSync: toYMD_HM(generateRecentDate(0, 8, 0)), imageUrl: 'https://images.unsplash.com/photo-1541818787-251394145718?q=80&w=2070&auto=format&fit=crop', level: 'N2', accLinkActive: false, accUrl: undefined, lat: 28.9455, lon: -13.6052 },
  { id: 'BIO', name: 'Aeropuerto de Bilbao', iataCode: 'BIO', location: 'Bilbao', lastSync: toYMD_HM(generateRecentDate(0, 2, 45)), imageUrl: 'https://images.unsplash.com/photo-1547895438-e9e144a15a77?q=80&w=1935&auto=format&fit=crop', level: 'N2', accLinkActive: false, accUrl: undefined, lat: 43.3011, lon: -2.9106 },
  { id: 'FUE', name: 'Aeropuerto de Fuerteventura', iataCode: 'FUE', location: 'Fuerteventura', lastSync: toYMD_HM(generateRecentDate(0, 10, 30)), imageUrl: 'https://images.unsplash.com/photo-1620067912428-9d6f6a7d519b?q=80&w=2070&auto=format&fit=crop', level: 'N2', accLinkActive: false, accUrl: undefined, lat: 28.4527, lon: -13.8638 },
  { id: 'TFN', name: 'Aeropuerto de Tenerife Norte', iataCode: 'TFN', location: 'Tenerife', lastSync: toYMD_HM(generateRecentDate(0, 5, 15)), imageUrl: 'https://images.unsplash.com/photo-1616768393084-97858c44563d?q=80&w=1974&auto=format&fit=crop', level: 'N2', accLinkActive: false, accUrl: undefined, lat: 28.4827, lon: -16.3415 },
  { id: 'MAH', name: 'Aeropuerto de Menorca', iataCode: 'MAH', location: 'Menorca', lastSync: toYMD_HM(generateRecentDate(0, 5, 30)), imageUrl: 'https://images.unsplash.com/photo-1510711762319-3f35f25a5d4a?q=80&w=1974&auto=format&fit=crop', level: 'N2', accLinkActive: false, accUrl: undefined, lat: 39.8626, lon: 4.2186 },
  { id: 'SCQ', name: 'Aeropuerto de Santiago de Compostela', iataCode: 'SCQ', location: 'Santiago de Compostela', lastSync: toYMD_HM(generateRecentDate(0, 7, 0)), imageUrl: 'https://images.unsplash.com/photo-1563507198169-4293a9233633?q=80&w=1931&auto=format&fit=crop', level: 'N2', accLinkActive: false, accUrl: undefined, lat: 42.8963, lon: -8.4151 },
  { id: 'VLC', name: 'Aeropuerto de Valencia', iataCode: 'VLC', location: 'Valencia', lastSync: toYMD_HM(generateRecentDate(0, 1, 0)), imageUrl: 'https://images.unsplash.com/photo-1563397399-52316e872c05?q=80&w=1964&auto=format&fit=crop', level: 'N2', accLinkActive: true, accUrl: 'https://acc.autodesk.eu/docs/files/projects/a2e8935f-5057-43f6-8975-1913c03c5101', lat: 39.4893, lon: -0.4816 },
  { id: 'GRO', name: 'Aeropuerto de Girona-Costa Brava', iataCode: 'GRO', location: 'Gerona', lastSync: toYMD_HM(generateRecentDate(1, 9, 0)), imageUrl: 'https://images.unsplash.com/photo-1545041552-be357e55198d?q=80&w=2070&auto=format&fit=crop', level: 'N3', accLinkActive: false, accUrl: undefined, lat: 41.901, lon: 2.7606 },
  { id: 'GRX', name: 'Aeropuerto de Granada-Jaén', iataCode: 'GRX', location: 'Granada', lastSync: toYMD_HM(generateRecentDate(2, 2, 0)), imageUrl: 'https://images.unsplash.com/photo-1588610762284-633446b3f75e?q=80&w=2070&auto=format&fit=crop', level: 'N3', accLinkActive: false, accUrl: undefined, lat: 37.1887, lon: -3.7773 },
  { id: 'XRY', name: 'Aeropuerto de Jerez', iataCode: 'XRY', location: 'Jerez', lastSync: toYMD_HM(generateRecentDate(1, 2, 50)), imageUrl: 'https://images.unsplash.com/photo-1594911736521-192635b75422?q=80&w=1932&auto=format&fit=crop', level: 'N3', accLinkActive: false, accUrl: undefined, lat: 36.7446, lon: -6.0601 },
  { id: 'LCG', name: 'Aeropuerto de A Coruña', iataCode: 'LCG', location: 'La Coruña', lastSync: toYMD_HM(generateRecentDate(0, 17, 30)), imageUrl: 'https://images.unsplash.com/photo-1582035909243-e0d00938d21b?q=80&w=2070&auto=format&fit=crop', level: 'N3', accLinkActive: false, accUrl: undefined, lat: 43.3021, lon: -8.3772 },
  { id: 'SPC', name: 'Aeropuerto de La Palma', iataCode: 'SPC', location: 'La Palma', lastSync: toYMD_HM(generateRecentDate(1, 12, 0)), imageUrl: 'https://images.unsplash.com/photo-1627889704287-93297a7d4a41?q=80&w=2070&auto=format&fit=crop', level: 'N3', accLinkActive: false, accUrl: undefined, lat: 28.6264, lon: -17.7556 },
  { id: 'OVD', name: 'Aeropuerto de Asturias', iataCode: 'OVD', location: 'Asturias', lastSync: toYMD_HM(generateRecentDate(1, 1, 0)), imageUrl: 'https://images.unsplash.com/photo-1594717596919-dd5dec16e147?q=80&w=2060&auto=format&fit=crop', level: 'N3', accLinkActive: false, accUrl: undefined, lat: 43.5636, lon: -6.0346 },
  { id: 'LEI', name: 'Aeropuerto de Almería', iataCode: 'LEI', location: 'Almería', lastSync: toYMD_HM(generateRecentDate(2, 3, 15)), imageUrl: 'https://images.unsplash.com/photo-1616428615438-41008d179612?q=80&w=1932&auto=format&fit=crop', level: 'N3', accLinkActive: false, accUrl: undefined, lat: 36.8439, lon: -2.3701 },
  { id: 'RMU', name: 'Aeropuerto de Murcia-Corvera', iataCode: 'RMU', location: 'Murcia', lastSync: toYMD_HM(generateRecentDate(1, 4, 30)), imageUrl: 'https://images.unsplash.com/photo-1593856230897-f5817d239c01?q=80&w=1932&auto=format&fit=crop', level: 'N3', accLinkActive: false, accUrl: undefined, lat: 37.804, lon: -1.127 },
  { id: 'MLN', name: 'Aeropuerto de Melilla', iataCode: 'MLN', location: 'Melilla', lastSync: toYMD_HM(generateRecentDate(1, 13, 0)), imageUrl: 'https://images.unsplash.com/photo-1623886576993-4a229a4f481a?q=80&w=2069&auto=format&fit=crop', level: 'N3', accLinkActive: false, accUrl: undefined, lat: 35.2798, lon: -2.9563 },
  { id: 'PNA', name: 'Aeropuerto de Pamplona', iataCode: 'PNA', location: 'Pamplona', lastSync: toYMD_HM(generateRecentDate(1, 14, 0)), imageUrl: 'https://images.unsplash.com/photo-1599857991522-861882d8c363?q=80&w=1935&auto=format&fit=crop', level: 'N3', accLinkActive: false, accUrl: undefined, lat: 42.77, lon: -1.6463 },
  { id: 'REU', name: 'Aeropuerto de Reus', iataCode: 'REU', location: 'Reus', lastSync: toYMD_HM(generateRecentDate(1, 10, 0)), imageUrl: 'https://images.unsplash.com/photo-1616110037599-73e440e8e7c1?q=80&w=2070&auto=format&fit=crop', level: 'N3', accLinkActive: false, accUrl: undefined, lat: 41.1472, lon: 1.1673 },
  { id: 'EAS', name: 'Aeropuerto de San Sebastián', iataCode: 'EAS', location: 'San Sebastián', lastSync: toYMD_HM(generateRecentDate(1, 14, 15)), imageUrl: 'https://images.unsplash.com/photo-1502444981-83c4103135b9?q=80&w=2070&auto=format&fit=crop', level: 'N3', accLinkActive: false, accUrl: undefined, lat: 43.355, lon: -1.7906 },
  { id: 'SDR', name: 'Aeropuerto de Santander', iataCode: 'SDR', location: 'Santander', lastSync: toYMD_HM(generateRecentDate(1, 0, 0)), imageUrl: 'https://images.unsplash.com/photo-1615847426649-7b561b32a24e?q=80&w=2070&auto=format&fit=crop', level: 'N3', accLinkActive: false, accUrl: undefined, lat: 43.4271, lon: -3.82 },
  { id: 'VLL', name: 'Aeropuerto de Valladolid', iataCode: 'VLL', location: 'Valladolid', lastSync: toYMD_HM(generateRecentDate(1, 16, 0)), imageUrl: 'https://images.unsplash.com/photo-1590176161962-42177651a14a?q=80&w=1974&auto=format&fit=crop', level: 'N3', accLinkActive: false, accUrl: undefined, lat: 41.7061, lon: -4.8519 },
  { id: 'VGO', name: 'Aeropuerto de Vigo', iataCode: 'VGO', location: 'Vigo', lastSync: toYMD_HM(generateRecentDate(0, 19, 0)), imageUrl: 'https://images.unsplash.com/photo-1597076415252-7065188f574d?q=80&w=2070&auto=format&fit=crop', level: 'N3', accLinkActive: false, accUrl: undefined, lat: 42.2318, lon: -8.6268 },
  { id: 'VIT', name: 'Aeropuerto de Vitoria', iataCode: 'VIT', location: 'Vitoria', lastSync: toYMD_HM(generateRecentDate(1, 15, 0)), imageUrl: 'https://images.unsplash.com/photo-1605899981329-79b889505d9c?q=80&w=1935&auto=format&fit=crop', level: 'N3', accLinkActive: false, accUrl: undefined, lat: 42.8828, lon: -2.7243 },
  { id: 'ZAZ', name: 'Aeropuerto de Zaragoza', iataCode: 'ZAZ', location: 'Zaragoza', lastSync: toYMD_HM(generateRecentDate(1, 23, 0)), imageUrl: 'https://images.unsplash.com/photo-1588191242337-1335b3644b1c?q=80&w=1974&auto=format&fit=crop', level: 'N3', accLinkActive: false, accUrl: undefined, lat: 41.6662, lon: -1.0416 },
  { id: 'LEN', name: 'Aeropuerto de León', iataCode: 'LEN', location: 'León', lastSync: toYMD_HM(generateRecentDate(2, 5, 0)), imageUrl: 'https://images.unsplash.com/photo-1596850870977-167232205510?q=80&w=1974&auto=format&fit=crop', level: 'N4', accLinkActive: false, accUrl: undefined, lat: 42.589, lon: -5.6555 },
  { id: 'RJL', name: 'Aeropuerto de Logroño-Agoncillo', iataCode: 'RJL', location: 'Logroño', lastSync: toYMD_HM(generateRecentDate(2, 5, 30)), imageUrl: 'https://images.unsplash.com/photo-1600192537025-a13155f9f6e6?q=80&w=1974&auto=format&fit=crop', level: 'N4', accLinkActive: false, accUrl: undefined, lat: 42.461, lon: -2.3207 },
  { id: 'ABC', name: 'Aeropuerto de Albacete', iataCode: 'ABC', location: 'Albacete', lastSync: toYMD_HM(generateRecentDate(2, 6, 0)), imageUrl: 'https://images.unsplash.com/photo-1629853342491-b0e6c86e0c60?q=80&w=2070&auto=format&fit=crop', level: 'N4', accLinkActive: false, accUrl: undefined, lat: 38.9483, lon: -1.8611 },
  { id: 'AEI', name: 'Aeropuerto de Algeciras', iataCode: 'AEI', location: 'Algeciras', lastSync: toYMD_HM(generateRecentDate(2, 6, 30)), imageUrl: 'https://images.unsplash.com/photo-1632765320986-21f4794e63be?q=80&w=1964&auto=format&fit=crop', level: 'N4', accLinkActive: false, accUrl: undefined, lat: 36.143, lon: -5.441 },
  { id: 'RGS', name: 'Aeropuerto de Burgos', iataCode: 'RGS', location: 'Burgos', lastSync: toYMD_HM(generateRecentDate(2, 7, 0)), imageUrl: 'https://images.unsplash.com/photo-1596850870838-8a8b1161d2d5?q=80&w=1974&auto=format&fit=crop', level: 'N4', accLinkActive: false, accUrl: undefined, lat: 42.357, lon: -3.619 },
  { id: 'QSA', name: 'Aeropuerto de Sabadell', iataCode: 'QSA', location: 'Sabadell', lastSync: toYMD_HM(generateRecentDate(2, 7, 30)), imageUrl: 'https://images.unsplash.com/photo-1603590179979-9941a9d863e4?q=80&w=2070&auto=format&fit=crop', level: 'N4', accLinkActive: false, accUrl: undefined, lat: 41.521, lon: 2.106 },
  { id: 'SLM', name: 'Aeropuerto de Salamanca', iataCode: 'SLM', location: 'Salamanca', lastSync: toYMD_HM(generateRecentDate(2, 8, 0)), imageUrl: 'https://images.unsplash.com/photo-1548263594-a71ea65a859b?q=80&w=2069&auto=format&fit=crop', level: 'N4', accLinkActive: false, accUrl: undefined, lat: 40.952, lon: -5.501 },
  { id: 'JCU', name: 'Aeropuerto de Ceuta', iataCode: 'JCU', location: 'Ceuta', lastSync: toYMD_HM(generateRecentDate(2, 8, 30)), imageUrl: 'https://images.unsplash.com/photo-1628178877526-0e1c28c82305?q=80&w=2069&auto=format&fit=crop', level: 'N4', accLinkActive: false, accUrl: undefined, lat: 35.892, lon: -5.347 },
  { id: 'VDE', name: 'Aeropuerto de El Hierro', iataCode: 'VDE', location: 'El Hierro', lastSync: toYMD_HM(generateRecentDate(2, 9, 0)), imageUrl: 'https://images.unsplash.com/photo-1596700147424-345372337731?q=80&w=1931&auto=format&fit=crop', level: 'N4', accLinkActive: false, accUrl: undefined, lat: 27.8148, lon: -17.8874 },
  { id: 'HSK', name: 'Aeropuerto de Huesca-Pirineos', iataCode: 'HSK', location: 'Huesca', lastSync: toYMD_HM(generateRecentDate(2, 9, 30)), imageUrl: 'https://images.unsplash.com/photo-1591412999954-20325b3901b0?q=80&w=1935&auto=format&fit=crop', level: 'N4', accLinkActive: false, accUrl: undefined, lat: 42.079, lon: -0.322 },
  { id: 'GMZ', name: 'Aeropuerto de La Gomera', iataCode: 'GMZ, QGZ', location: 'La Gomera', lastSync: toYMD_HM(generateRecentDate(2, 10, 0)), imageUrl: 'https://images.unsplash.com/photo-1601287950580-496e57b32252?q=80&w=1931&auto=format&fit=crop', level: 'N4', accLinkActive: false, accUrl: undefined, lat: 28.029, lon: -17.214 },
  { id: 'MCV', name: 'Aeropuerto de Madrid-Cuatro Vientos', iataCode: 'MCV, CVS', location: 'Cuatro Vientos (LECU)', lastSync: toYMD_HM(generateRecentDate(2, 10, 30)), imageUrl: 'https://images.unsplash.com/photo-1597894057850-244a53088b20?q=80&w=1974&auto=format&fit=crop', level: 'N4', accLinkActive: false, accUrl: undefined, lat: 40.371, lon: -3.784 },
  { id: 'BJZ', name: 'Aeropuerto de Badajoz', iataCode: 'BJZ', location: 'Badajoz', lastSync: toYMD_HM(generateRecentDate(2, 11, 0)), imageUrl: 'https://images.unsplash.com/photo-1627993049583-b785e505500a?q=80&w=2070&auto=format&fit=crop', level: 'N4', accLinkActive: false, accUrl: undefined, lat: 38.891, lon: -6.821 },
  { id: 'ODB', name: 'Aeropuerto de Córdoba', iataCode: 'ODB', location: 'Córdoba', lastSync: toYMD_HM(generateRecentDate(2, 11, 30)), imageUrl: 'https://images.unsplash.com/photo-1574225134262-17180b9e8211?q=80&w=2070&auto=format&fit=crop', level: 'N4', accLinkActive: false, accUrl: undefined, lat: 37.842, lon: -4.848 },
];

// --- ACTUACION RAW DATA ---
const newActuacionesRaw = [
  "MAD_DF-T4T4S_AMPLIACIÓN Y REMODELACIÓN T4 Y T4S", "MAD_PET2199_AMPLIACIÓN Y REMODELACIÓN PROCESADOR T4", "MAD_PET2264_AMPLIACIÓN DIQUE NORTE T4S Y PLATAFORMA ASOCIADA. AEROPUERTO ADOLFO SUÁREZ MADRID-BARAJAS", "MAD_PET2305_NUEVOS VIALES PROCESADOR T123", "MAD_PET2344_AMPLIACIÓN DIQUE NORTE T4 Y PLATAFORMA ASOCIADA. AEROPUERTO ADOLFO SUÁREZ MADRID-BARAJAS", "MAD_PET2352_NUEVO APARCAMIENTO P1N PROCESADOR T123", "MAD_PET2845-3_SEÑALETICA NUEVO EDIFICIO PROCESADOR T123", "MAD_PET2845_NUEVO EDIFICIO PROCESADOR T123", "MAD_PET3598_AMPLIACIÓN PLATAFORMA T4 NORTE", "MAD_PET3601_AMPLIACIÓN Y REMODELACIÓN DEL PROCESADOR T4S. AEROPUERTO ADOLFO SUÁREZ MADRID-BARAJAS", "MAD_PET3608_AMPLIACIÓN PLATAFORMA T4S NORTE. AEROPUERTO ADOLFO SUÁREZ MADRID-BARAJAS", "MAD_PET5662_TRASLADO PROVISIONAL DE OFICINAS DE IBERIA T4 SUR", "MAD_PET5663_NUEVA CENTRAL ELÉCTRICA CE-4", "MAD_PET5665_NUEVA SALA DE AUTORIDADES Y RECONFIGURACIÓN ZONA SUR PROCESADOR T4. AEROPUERTO ADOLFO SUÁREZ MADRID-BARAJAS", "MAD_PET5666_EQUIPAMIENTO Y MOBILIARIO NUEVA SALA DE AUTORIDADES. AEROPUERTO ADOLFO SUÁREZ MADRID-BARAJAS", "MAD_PET6160_NUEVA PLANTA TÉRMICA T4. AEROPUERTO ADOLFO SUÁREZ MADRID-BARAJAS", "MAD_PET6161_NUEVA PLANTA TÉRMICA T4S. AEROPUERTO ADOLFO SUÁREZ MADRID-BARAJAS", "MAD_PET6191_NUEVA CÁMARA DE REGULADORES SAT. AEROPUERTO ADOLFO SUÁREZ MADRID-BARAJAS", "MAD_PET6562_NUEVOS ANILLOS Y ACOMETIDAS A ZONA SUR DESDE CE-3", "MAD_PET7218_ADECUACIÓN OPERATIVA DE T123 AL PROCESADOR", "MAD_PET7219_EQUIPAMIENTO NUEVO EDIFICIO PROCESADOR T123", "MAD_PET7541_AMPLIACIÓN PARKING T4. APARCAMIENTO EN TALUD Y ESTRUCTURA DE ESTACIONES DE METRO Y AVE", "MAD_PET7542_AMPLIACIÓN PARKING T4. NUEVOS MÓDULOS ENTRE RAMPAS", "MAD_PET7543_AMPLIACIÓN PARKING T4. NUEVO MÓDULO SUR Y PARKING EXPRESS", "MAD_PET7574-1_CENTRO DE TRANSFORMACION P2N", "MAD_PET7574_NUEVO APARCAMIENTO P2N PROCESADOR T123", "BCN_DF-T1_ADECUACIÓN T1. AEROPUERTO JOSEP TARRADELLAS BARCELONA - EL PRAT", "BCN_PET2207_ADECUACIÓN DE TERMINAL T1", "BCN_PET7652_ADECUACIÓN DEL ESPACIO PARA REMODELACIÓN DEL ÁREA TERMINAL T1", "ACE_DF_ADECUACIÓN DEL ÁREA TERMINAL", "ACE_PET4303_RENOVACIÓN CLIMATIZACIÓN T2", "ACE_PET5320_RENOVACIÓN PUERTAS AUTOMÁTICAS TERMINALES", "ACE_PET5776_APARCAMIENTO PARA RENT A CAR", "ACE_PET6025_ADECUACIÓN DEL ÁREA TERMINAL", "ACE_PET6027_EQUIPAMIENTO Y MOBILIARIO PARA LA ADECUACIÓN DEL EDIFICIO TERMINAL", "TFN_DF_ADECUACIÓN DEL ÁREA TERMINAL", "TFN_PET2287_ADECUACIÓN DEL EDIFICIO TERMINAL", "TFN_PET2294_ACTUACIONES EN LOS APARCAMIENTOS",
];

const existingActuacionesDetail: ActuacionDetail[] = [
    { id: 'pmi-1', airportId: 'PMI', name: 'PMI_PET3322_MODERNIZACION ZONA EMBARQUE C', accLinkActive: true, p1_1_status: 'En curso', p1_2_status: 'En curso', p4_status: 'Pendiente' },
    { id: 'pmi-2', airportId: 'PMI', name: 'PMI_PET4455_ADECUACION SATE', accLinkActive: true, p1_1_status: 'Publicado', p1_2_status: 'Publicado', p4_status: 'Publicado' },
    { id: 'vlc-1', airportId: 'VLC', name: 'VLC_PET2874_AMPLIACION COMERCIAL', accLinkActive: true, p1_1_status: 'Pendiente', p1_2_status: 'Pendiente', p4_status: 'N/A' },
];

// --- DATA GENERATION LOGIC ---

// ActuacionDetail
const statuses = ['En curso', 'Pendiente', 'Publicado', 'N/A'] as const;
const getRandomStatus = (): ActionStatus => statuses[Math.floor(Math.random() * statuses.length)];

const newActuacionesDetail: ActuacionDetail[] = newActuacionesRaw.map((name, index) => {
  const airportId = name.substring(0, 3);
  const id = `${airportId.toLowerCase()}-new-${index + 1}`;
  return { id, airportId, name, accLinkActive: Math.random() > 0.3, p1_1_status: getRandomStatus(), p1_2_status: getRandomStatus(), p4_status: getRandomStatus() };
});

const airportsToReplace = ['MAD', 'BCN', 'ACE', 'TFN'];
const existingActuacionesToKeep = existingActuacionesDetail.filter(act => !airportsToReplace.includes(act.airportId));
// FIX: Add explicit type 'ActuacionDetail[]' to 'finalActuacionesDetail' to fix type incompatibility error.
const finalActuacionesDetail: ActuacionDetail[] = [
    ...existingActuacionesToKeep,
    ...newActuacionesDetail,
    { id: 'mad-new-comp-1', airportId: 'MAD', name: 'MAD_DIN599/19_PROYECTO ESPECIAL 1', accLinkActive: true, p1_1_status: 'Publicado', p1_2_status: 'Publicado', p4_status: 'Publicado' },
    { id: 'mad-new-comp-2', airportId: 'MAD', name: 'MAD_PRO_1098_PROYECTO ESPECIAL 2', accLinkActive: true, p1_1_status: 'Publicado', p1_2_status: 'Publicado', p4_status: 'Publicado' },
];

export const mockActuacionesDetail: ActuacionDetail[] = finalActuacionesDetail;

// Airport
const actionCounts = finalActuacionesDetail.reduce((acc, act) => {
  acc[act.airportId] = (acc[act.airportId] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

export const mockAirports: Airport[] = originalMockAirports.map(airport => {
  const newCount = actionCounts[airport.id] || 0;
  let newStatus: Airport['integrationStatus'];

  const inProgressAirports = ['MAD', 'BCN', 'ACE', 'TFN', 'VLC'];
  if (inProgressAirports.includes(airport.id)) {
    newStatus = 'En curso';
  } else {
    newStatus = 'Por iniciar';
  }

  return { ...airport, actionCount: newCount, integrationStatus: newStatus };
});

// Actuacion
const statusesAct = ['En progreso', 'Completada', 'En espera', 'Cancelada'] as const;
const typesAct = ['PIM', 'AIM', 'Data Drop'] as const;
export const mockActuaciones: Actuacion[] = finalActuacionesDetail.map(detail => {
    const airport = mockAirports.find(a => a.id === detail.airportId);
    return {
        id: detail.id.replace('-new', '').replace('-act-', ''),
        name: detail.name,
        airportId: detail.airportId,
        airportName: airport ? airport.name.replace('Aeropuerto ', '').replace('Adolfo Suárez ', '') : detail.airportId,
        status: statusesAct[Math.floor(Math.random() * statusesAct.length)],
        startDate: toISODate(generateRecentDate(Math.floor(Math.random() * 365))),
        endDate: toISODate(generateRecentDate(Math.floor(Math.random() * -365))),
        type: typesAct[Math.floor(Math.random() * typesAct.length)],
        hasRequirements: Math.random() > 0.5,
    };
});
