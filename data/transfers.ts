import { DataTransfer } from '../types';
import { generateRecentDate, toISODateTime } from './utils';

export const mockDataTransfers: DataTransfer[] = [
    // GMAO (Maximo) History
    { id: 'tr1', actuacionId: 'mad-new-1', fromSystem: 'ACC', toSystem: 'GMAO', status: 'Éxito', timestamp: toISODateTime(generateRecentDate(0, 0, 25)), fileSize: '1.2 GB' },
    { id: 'tr3', actuacionId: 'mad-new-2', fromSystem: 'GMAO', toSystem: 'ACC', status: 'En curso', timestamp: toISODateTime(generateRecentDate(0, 0, 10)), fileSize: '50 MB' },
    { id: 'tr10', actuacionId: 'vlc-1', fromSystem: 'ACC', toSystem: 'GMAO', status: 'Éxito', timestamp: toISODateTime(generateRecentDate(1, 2, 0)), fileSize: '850 MB' },
    { id: 'tr11', actuacionId: 'mad-new-16', fromSystem: 'ACC', toSystem: 'GMAO', status: 'Fallido', timestamp: toISODateTime(generateRecentDate(2, 5, 0)), fileSize: 'N/A' },
    { id: 'tr12', actuacionId: 'pmi-1', fromSystem: 'ACC', toSystem: 'GMAO', status: 'Éxito', timestamp: toISODateTime(generateRecentDate(3, 1, 30)), fileSize: '450 MB' },
    
    // GIS (SAP) History
    { id: 'tr2', actuacionId: 'bcn-new-1', fromSystem: 'ACC', toSystem: 'GIS', status: 'Éxito', timestamp: toISODateTime(generateRecentDate(0, 7, 0)), fileSize: '350 MB' },
    { id: 'tr4', actuacionId: 'mad-new-1', fromSystem: 'ACC', toSystem: 'GIS', status: 'Fallido', timestamp: toISODateTime(generateRecentDate(1, 5, 0)), fileSize: 'N/A' },
    { id: 'tr20', actuacionId: 'mad-new-5', fromSystem: 'ACC', toSystem: 'GIS', status: 'Éxito', timestamp: toISODateTime(generateRecentDate(2, 1, 0)), fileSize: '2.1 GB' },
    { id: 'tr21', actuacionId: 'tfn-new-2', fromSystem: 'ACC', toSystem: 'GIS', status: 'En curso', timestamp: toISODateTime(generateRecentDate(0, 1, 5)), fileSize: '1.1 GB' },
    { id: 'tr22', actuacionId: 'ace-new-5', fromSystem: 'ACC', toSystem: 'GIS', status: 'Éxito', timestamp: toISODateTime(generateRecentDate(4, 10, 0)), fileSize: '150 MB' },
];
