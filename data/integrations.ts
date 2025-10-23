import { ModelReception, AimTransfer, P11ModelReception } from '../types';
import { generateRecentDate, toISODate, toISODateTime } from './utils';


export const mockP11ModelReceptions: P11ModelReception[] = [
  // BCN
  { id: 'p11-bcn-1', iata: 'BCN', actuacionName: 'BCN_DF-T1_ADECUACIÓN T1. AEROPUERTO JOSEP TARRADELLAS BARCELONA - EL PRAT', modelName: 'PLAT_CIV_PRO_v3.dwg', sourceFolder: 'BCN > 02_DocGrafica > 01_EnCurso > Modelos 3D > BCN_PET1234', dateReceived: toISODate(generateRecentDate(2)), version: 3 },
  // PMI
  { id: 'p11-pmi-1', iata: 'PMI', actuacionName: 'PMI_PET3322_MODERNIZACION ZONA EMBARQUE C', modelName: 'MODC_ARQ_PRO_v1.rvt', sourceFolder: 'PMI > 02_DocGrafica > 01_EnCurso > Modelos 3D > PMI_PET3322', dateReceived: toISODate(generateRecentDate(5)), version: 1 },
  // ACE
  { id: 'p11-ace-1', iata: 'ACE', actuacionName: 'ACE_PET6025_ADECUACIÓN DEL ÁREA TERMINAL', modelName: 'T1_ARQ_PRO_v2.rvt', sourceFolder: 'ACE > 02_DocGrafica > 01_EnCurso > Modelos 3D > ACE_PET6025', dateReceived: toISODate(generateRecentDate(3)), version: 2 },
  { id: 'p11-ace-2', iata: 'ACE', actuacionName: 'ACE_PET5776_APARCAMIENTO PARA RENT A CAR', modelName: 'PARKING_EST_PRO_v1.ifc', sourceFolder: 'ACE > 02_DocGrafica > 01_EnCurso > Modelos 3D > ACE_PET5776', dateReceived: toISODate(generateRecentDate(12)), version: 1 },
  // TFN
  { id: 'p11-tfn-1', iata: 'TFN', actuacionName: 'TFN_PET2287_ADECUACIÓN DEL EDIFICIO TERMINAL', modelName: 'TERMINAL_MEP_PRO_v4.rvt', sourceFolder: 'TFN > 02_DocGrafica > 01_EnCurso > Modelos 3D > TFN_PET2287', dateReceived: toISODate(generateRecentDate(6)), version: 4 },
  // VLC
  { id: 'p11-vlc-1', iata: 'VLC', actuacionName: 'VLC_PET2874_AMPLIACION COMERCIAL', modelName: 'COMERCIAL_ARQ_PRO_v2.ifc', sourceFolder: 'VLC > 02_DocGrafica > 01_EnCurso > Modelos 3D > VLC_PET2874', dateReceived: toISODate(generateRecentDate(10)), version: 2 },
  { id: 'p11-vlc-2', iata: 'VLC', actuacionName: 'VLC_PET2874_AMPLIACION COMERCIAL', modelName: 'COMERCIAL_EST_PRO_v2.rvt', sourceFolder: 'VLC > 02_DocGrafica > 01_EnCurso > Modelos 3D > VLC_PET2874', dateReceived: toISODate(generateRecentDate(9)), version: 2 },
  // MAD - Project 1: NUEVA ZONA DE AUTOBUSES EN T4
  { id: 'p11-mad-new-1', iata: 'MAD', actuacionName: 'MAD_DIN254/19_NUEVA ZONA DE AUTOBUSES EN T4', modelName: 'LEMD_254_PL_TER_MOD_INS_COM_CM', sourceFolder: '...', dateReceived: '2022-11-11', version: 1 },
  { id: 'p11-mad-new-2', iata: 'MAD', actuacionName: 'MAD_DIN254/19_NUEVA ZONA DE AUTOBUSES EN T4', modelName: 'LEMD_254_PL_TER_MOD_INS_ELE_CM', sourceFolder: '...', dateReceived: '2022-11-11', version: 1 },
  { id: 'p11-mad-new-3', iata: 'MAD', actuacionName: 'MAD_DIN254/19_NUEVA ZONA DE AUTOBUSES EN T4', modelName: 'LEMD_254_PL_TER_MOD_URB_CM', sourceFolder: '...', dateReceived: '2022-11-11', version: 1 },
  { id: 'p11-mad-new-4', iata: 'MAD', actuacionName: 'MAD_DIN254/19_NUEVA ZONA DE AUTOBUSES EN T4', modelName: 'LEMD_254_PL_TER_MOD_ARQ_CM', sourceFolder: '...', dateReceived: '2022-11-11', version: 1 },
  { id: 'p11-mad-new-5', iata: 'MAD', actuacionName: 'MAD_DIN254/19_NUEVA ZONA DE AUTOBUSES EN T4', modelName: 'LEMD_254_PL_TER_MOD_EST_CM', sourceFolder: '...', dateReceived: '2022-11-11', version: 1 },
  { id: 'p11-mad-new-6', iata: 'MAD', actuacionName: 'MAD_DIN254/19_NUEVA ZONA DE AUTOBUSES EN T4', modelName: 'LEMD_254_PL_TER_MOD_INS_CLI_CM', sourceFolder: '...', dateReceived: '2022-11-11', version: 1 },
  { id: 'p11-mad-new-7', iata: 'MAD', actuacionName: 'MAD_DIN254/19_NUEVA ZONA DE AUTOBUSES EN T4', modelName: 'LEMD_254_PL_TER_MOD_INS_FON_CM', sourceFolder: '...', dateReceived: '2022-11-11', version: 1 },
  { id: 'p11-mad-new-8', iata: 'MAD', actuacionName: 'MAD_DIN254/19_NUEVA ZONA DE AUTOBUSES EN T4', modelName: 'LEMD_254_PL_TER_MOD_INS_SAN_CM', sourceFolder: '...', dateReceived: '2022-11-11', version: 1 },
  { id: 'p11-mad-new-9', iata: 'MAD', actuacionName: 'MAD_DIN254/19_NUEVA ZONA DE AUTOBUSES EN T4', modelName: 'LEMD_254_PL_TER_MOD_INS_VEN_CM', sourceFolder: '...', dateReceived: '2022-11-11', version: 1 },
  // MAD - Project 2: DIGITALIZACIÓN T3
  { id: 'p11-mad-new-10', iata: 'MAD', actuacionName: 'MAD_MAD95/17_DIGITALIZACIÓN T3', modelName: 'PBT3_ARQ', sourceFolder: '...', dateReceived: '2024-06-28', version: 1 },
  { id: 'p11-mad-new-11', iata: 'MAD', actuacionName: 'MAD_MAD95/17_DIGITALIZACIÓN T3', modelName: 'PBT3_MEC', sourceFolder: '...', dateReceived: '2024-06-28', version: 1 },
  { id: 'p11-mad-new-12', iata: 'MAD', actuacionName: 'MAD_MAD95/17_DIGITALIZACIÓN T3', modelName: 'PBT3_PLU', sourceFolder: '...', dateReceived: '2024-06-28', version: 1 },
  { id: 'p11-mad-new-13', iata: 'MAD', actuacionName: 'MAD_MAD95/17_DIGITALIZACIÓN T3', modelName: 'PBT3_EST', sourceFolder: '...', dateReceived: '2024-06-28', version: 1 },
  { id: 'p11-mad-new-14', iata: 'MAD', actuacionName: 'MAD_MAD95/17_DIGITALIZACIÓN T3', modelName: 'PBT3_ELE', sourceFolder: '...', dateReceived: '2024-06-28', version: 1 },
  { id: 'p11-mad-new-15', iata: 'MAD', actuacionName: 'MAD_MAD95/17_DIGITALIZACIÓN T3', modelName: 'PBT3_SATE', sourceFolder: '...', dateReceived: '2024-06-28', version: 1 },
  { id: 'p11-mad-new-16', iata: 'MAD', actuacionName: 'MAD_MAD95/17_DIGITALIZACIÓN T3', modelName: 'PBT3_PCI', sourceFolder: '...', dateReceived: '2024-06-28', version: 1 },
  { id: 'p11-mad-new-17', iata: 'MAD', actuacionName: 'MAD_MAD95/17_DIGITALIZACIÓN T3', modelName: 'PBT3_NIVELES Y REJILLAS', sourceFolder: '...', dateReceived: '2024-06-28', version: 1 },
];

export const mockModelReceptions: ModelReception[] = [
  { id: 'mr1', iata: 'MAD', actuacionId: 'act-mad-1', modelReceived: 'MAD_1234_DIN543-11-1_PRO', expediente: 'MDI_TPA_ARQ_EA_DIN543-11-1', denominationLDA: 'UATS_MAD_PET1234_AMPLIACION_ZONA_SUR', fase: 'AB', dateReceived: '2025-08-20', versionPIMNativo: 3, versionPIMIFC: 3 },
  { id: 'mr2', iata: 'MAD', actuacionId: 'act-mad-1', modelReceived: 'MAD_1234_DIN543-11-1_PRO', expediente: 'MDI_TPA_EST_EA_DIN543-11-1', denominationLDA: 'UATS_MAD_PET1234_AMPLIACION_ZONA_SUR', fase: 'AB', dateReceived: '2025-08-20', versionPIMNativo: 3, versionPIMIFC: 3 },
  { id: 'mr3', iata: 'MAD', actuacionId: 'act-mad-2', modelReceived: 'MAD_5678_DIN612-23-4_PRO', expediente: 'MDI_T1_ICO_EA_DIN612-23-4', denominationLDA: 'UATS_MAD_PET5678_NUEVA_TERMINAL_SAT', fase: 'DIG', dateReceived: '2025-09-10', versionPIMNativo: 1, versionPIMIFC: 1 },
  { id: 'mr4', iata: 'VLC', actuacionId: 'act-vlc-1', modelReceived: 'VLC_2874_DIN643-22-1_PRO', expediente: 'MDI_TPA_ARQ_EA_DIN643-22-1', denominationLDA: 'UATS_VLC_PET2874_AMPLIACION DE LA SUPERFICIE COMERCIAL DEL E TP', fase: 'PCD', dateReceived: '2025-07-30', versionPIMNativo: 2, versionPIMIFC: 2 },
  { id: 'mr5', iata: 'VLC', actuacionId: 'act-vlc-1', modelReceived: 'VLC_2874_DIN643-22-1_PRO', expediente: 'MDI_TPA_EST_EA_DIN643-22-1', denominationLDA: 'UATS_VLC_PET2874_AMPLIACION DE LA SUPERFICIE COMERCIAL DEL E TP', fase: 'PCD', dateReceived: '2025-07-30', versionPIMNativo: 2, versionPIMIFC: 2 },
  { id: 'mr6', iata: 'VLC', actuacionId: 'act-vlc-1', modelReceived: 'VLC_2874_DIN643-22-1_PRO', expediente: 'MDI_TPA_ICL_EA_DIN643-22-1', denominationLDA: 'UATS_VLC_PET2874_AMPLIACION DE LA SUPERFICIE COMERCIAL DEL E TP', fase: 'PCD', dateReceived: '2025-07-30', versionPIMNativo: 2, versionPIMIFC: 2 },
  { id: 'mr7', iata: 'BCN', actuacionId: 'act-bcn-1', modelReceived: 'BCN_9101_DIN789-45-6_PRO', expediente: 'MDI_T2_IFS_EA_DIN789-45-6', denominationLDA: 'UATS_BCN_PET9101_REFORMA_PISTA', fase: 'AB', dateReceived: '2025-08-01', versionPIMNativo: 4, versionPIMIFC: 4 },
];

export const mockAimTransfers: AimTransfer[] = [
  // VLC
  { id: 'at1', iata: 'VLC', actuacionId: 'vlc-1', expediente: 'DIN643-22-1', denominationLDA: 'UATS_VLC_PET2874_AMPLI TP', fase: 'AB', modelReceived: 'COMERCIAL_ARQ_PRO_v2.ifc', modelAIM: 'VLC_X_X_OIMN_MDI_TF', versionAIMNativo: 2, versionAIMIFC: 2, status: 'en integración', timestamp: toISODateTime(generateRecentDate(0, 2, 30)) },
  { id: 'at2', iata: 'VLC', actuacionId: 'vlc-1', expediente: 'DIN643-22-1', denominationLDA: 'UATS_VLC_PET2874_AMPLI TP', fase: 'AB', modelReceived: 'COMERCIAL_EST_PRO_v2.rvt', modelAIM: 'VLC_X_X_OIMN_MDI_TF', versionAIMNativo: 2, versionAIMIFC: 2, status: 'Pendiente', timestamp: toISODateTime(generateRecentDate(0, 2, 29)) },
  { id: 'at3', iata: 'VLC', actuacionId: 'vlc-1', expediente: 'DIN643-22-1', denominationLDA: 'UATS_VLC_PET2874_AMPLI TP', fase: 'AB', modelReceived: 'VLC_2874_DIN643-22-1_PRO_MDI_TPA_ICL_EA', modelAIM: 'VLC_X_X_OIMN_MDI_TF', versionAIMNativo: 2, versionAIMIFC: 2, status: 'Pendiente', timestamp: toISODateTime(generateRecentDate(0, 2, 28)) },
  { id: 'at4', iata: 'VLC', actuacionId: 'vlc-1', expediente: 'DIN643-22-1', denominationLDA: 'UATS_VLC_PET2874_AMPLI TP', fase: 'AB', modelReceived: 'VLC_2874_DIN643-22-1_PRO_MDI_TPA_ICO_EA', modelAIM: 'VLC_X_X_OIMN_MDI_TF', versionAIMNativo: 2, versionAIMIFC: 2, status: 'Pendiente', timestamp: toISODateTime(generateRecentDate(0, 2, 27)) },
  // BCN
  { id: 'at13', iata: 'BCN', actuacionId: 'bcn-new-1', expediente: 'DIN123-45-6', denominationLDA: 'UATS_BCN_PET1234_PLATAFORMA REMOTA', fase: 'DIG', modelReceived: 'PLAT_CIV_PRO_v3.dwg', modelAIM: 'BCN_X_X_OIMN_MDI_CAMPO_VUELO', versionAIMNativo: 3, versionAIMIFC: 3, status: 'finalizado', timestamp: toISODateTime(generateRecentDate(1, 8, 0)) },
  { id: 'at14', iata: 'BCN', actuacionId: 'bcn-new-3', expediente: 'DIN910-01-2', denominationLDA: 'UATS_BCN_PET9101_NUEVA TORRE CONTROL', fase: 'AB', modelReceived: 'BCN_9101_DIN910-01-2_PRO_MDI_TORRE_ARQ_EA', modelAIM: 'BCN_X_X_OIMN_MDI_TORRE', versionAIMNativo: 1, versionAIMIFC: 1, status: 'Pendiente', timestamp: toISODateTime(generateRecentDate(2, 4, 0)) },
  // PMI
  { id: 'at15', iata: 'PMI', actuacionId: 'pmi-1', expediente: 'DIN332-21-1', denominationLDA: 'UATS_PMI_PET3322_MODERNIZACION EMBARQUE C', fase: 'AB', modelReceived: 'MODC_ARQ_PRO_v1.rvt', modelAIM: 'PMI_X_X_OIMN_MDI_MODC', versionAIMNativo: 1, versionAIMIFC: 1, status: 'en integración', timestamp: toISODateTime(generateRecentDate(1, 10, 30)) },
  // ACE
  { id: 'at16', iata: 'ACE', actuacionId: 'ace-new-5', expediente: 'DIN801-11-2', denominationLDA: 'UATS_ACE_PET6025_ADECUACION_TERMINAL', fase: 'PCD', modelReceived: 'T1_ARQ_PRO_v2.rvt', modelAIM: 'ACE_X_X_OIMN_MDI_T1', versionAIMNativo: 2, versionAIMIFC: 2, status: 'finalizado', timestamp: toISODateTime(generateRecentDate(10, 5, 0)) },
  // TFN
  { id: 'at17', iata: 'TFN', actuacionId: 'tfn-new-2', expediente: 'DIN832-45-1', denominationLDA: 'UATS_TFN_PET2287_ADECUACION_TERMINAL', fase: 'AB', modelReceived: 'TERMINAL_MEP_PRO_v4.rvt', modelAIM: 'TFN_X_X_OIMN_MDI_TERMINAL', versionAIMNativo: 4, versionAIMIFC: 4, status: 'Pendiente', timestamp: toISODateTime(generateRecentDate(8, 2, 15)) },
  // More for existing airports
  { id: 'at18', iata: 'VLC', actuacionId: 'vlc-1', expediente: 'DIN643-22-1', denominationLDA: 'UATS_VLC_PET2874_AMPLI TP', fase: 'AB', modelReceived: 'VLC_2874_DIN643-22-1_PRO_MDI_TPA_IEB_EA', modelAIM: 'VLC_X_X_OIMN_MDI_TPA', versionAIMNativo: 2, versionAIMIFC: 2, status: 'Pendiente', timestamp: toISODateTime(generateRecentDate(1, 1, 1)) },
  { id: 'at19', iata: 'PMI', actuacionId: 'pmi-2', expediente: 'DIN445-51-1', denominationLDA: 'UATS_PMI_PET4455_ADECUACION_SATE', fase: 'DIG', modelReceived: 'PMI_4455_DIN445-51-1_PRO_MDI_TPA_ARQ_EA', modelAIM: 'PMI_X_X_OIMN_MDI_SATE', versionAIMNativo: 1, versionAIMIFC: 1, status: 'finalizado', timestamp: toISODateTime(generateRecentDate(15, 0, 0)) },
  { id: 'at20', iata: 'PMI', actuacionId: 'pmi-2', expediente: 'DIN445-51-1', denominationLDA: 'UATS_PMI_PET4455_ADECUACION_SATE', fase: 'DIG', modelReceived: 'PMI_4455_DIN445-51-1_PRO_MDI_TPA_EST_EA', modelAIM: 'PMI_X_X_OIMN_MDI_SATE', versionAIMNativo: 1, versionAIMIFC: 1, status: 'finalizado', timestamp: toISODateTime(generateRecentDate(15, 0, 1)) },
  // MAD - Project 1: NUEVA ZONA DE AUTOBUSES EN T4
  { id: 'at-mad-new-1', iata: 'MAD', actuacionId: 'mad-autobuses-t4', expediente: 'DIN254/19', denominationLDA: 'NUEVA ZONA DE AUTOBUSES EN T4 AEROPUERTO ADOLFO SUAREZ MADRID - BARAJAS', fase: 'AB', modelReceived: 'LEMD_254_PL_TER_MOD_INS_COM_CM', modelAIM: 'MAD_X_X_MOD_TPA_ICO_EA_E200-T4_XXX_X', versionAIMNativo: 1, versionAIMIFC: 1, status: 'finalizado', timestamp: toISODateTime(generateRecentDate(3, 5, 0)) },
  { id: 'at-mad-new-2', iata: 'MAD', actuacionId: 'mad-autobuses-t4', expediente: 'DIN254/19', denominationLDA: 'NUEVA ZONA DE AUTOBUSES EN T4 AEROPUERTO ADOLFO SUAREZ MADRID - BARAJAS', fase: 'AB', modelReceived: 'LEMD_254_PL_TER_MOD_INS_ELE_CM', modelAIM: 'MAD_X_X_MOD_TPA_IEL_EA_E200-T4_XXX_X', versionAIMNativo: 1, versionAIMIFC: 1, status: 'en integración', timestamp: toISODateTime(generateRecentDate(0, 1, 0)) },
  { id: 'at-mad-new-3', iata: 'MAD', actuacionId: 'mad-autobuses-t4', expediente: 'DIN254/19', denominationLDA: 'NUEVA ZONA DE AUTOBUSES EN T4 AEROPUERTO ADOLFO SUAREZ MADRID - BARAJAS', fase: 'AB', modelReceived: 'LEMD_254_PL_TER_MOD_URB_CM', modelAIM: 'MAD_X_X_MOD_URB_YYY_EA_E200-T4_XXX_X', versionAIMNativo: null, versionAIMIFC: 1, status: 'Pendiente', timestamp: '2022-11-11T10:00:00Z' },
  { id: 'at-mad-new-4', iata: 'MAD', actuacionId: 'mad-autobuses-t4', expediente: 'DIN254/19', denominationLDA: 'NUEVA ZONA DE AUTOBUSES EN T4 AEROPUERTO ADOLFO SUAREZ MADRID - BARAJAS', fase: 'AB', modelReceived: 'LEMD_254_PL_TER_MOD_ARQ_CM', modelAIM: 'MAD_X_X_MOD_TPA_ARQ_EA_E200-T4_XXX_X', versionAIMNativo: null, versionAIMIFC: 1, status: 'Pendiente', timestamp: '2022-11-11T10:00:00Z' },
  { id: 'at-mad-new-5', iata: 'MAD', actuacionId: 'mad-autobuses-t4', expediente: 'DIN254/19', denominationLDA: 'NUEVA ZONA DE AUTOBUSES EN T4 AEROPUERTO ADOLFO SUAREZ MADRID - BARAJAS', fase: 'AB', modelReceived: 'LEMD_254_PL_TER_MOD_EST_CM', modelAIM: 'MAD_X_X_MOD_TPA_EST_EA_E200-T4_XXX_X', versionAIMNativo: null, versionAIMIFC: 1, status: 'Pendiente', timestamp: '2022-11-11T10:00:00Z' },
  { id: 'at-mad-new-6', iata: 'MAD', actuacionId: 'mad-autobuses-t4', expediente: 'DIN254/19', denominationLDA: 'NUEVA ZONA DE AUTOBUSES EN T4 AEROPUERTO ADOLFO SUAREZ MADRID - BARAJAS', fase: 'AB', modelReceived: 'LEMD_254_PL_TER_MOD_INS_CLI_CM', modelAIM: 'MAD_X_X_MOD_TPA_ICL_EA_E200-T4_XXX_X', versionAIMNativo: null, versionAIMIFC: 1, status: 'Pendiente', timestamp: '2022-11-11T10:00:00Z' },
  { id: 'at-mad-new-7', iata: 'MAD', actuacionId: 'mad-autobuses-t4', expediente: 'DIN254/19', denominationLDA: 'NUEVA ZONA DE AUTOBUSES EN T4 AEROPUERTO ADOLFO SUAREZ MADRID - BARAJAS', fase: 'AB', modelReceived: 'LEMD_254_PL_TER_MOD_INS_FON_CM', modelAIM: 'MAD_X_X_MOD_TPA_IFS_EA_E200-T4_XXX_X', versionAIMNativo: null, versionAIMIFC: 1, status: 'Pendiente', timestamp: '2022-11-11T10:00:00Z' },
  { id: 'at-mad-new-8', iata: 'MAD', actuacionId: 'mad-autobuses-t4', expediente: 'DIN254/19', denominationLDA: 'NUEVA ZONA DE AUTOBUSES EN T4 AEROPUERTO ADOLFO SUAREZ MADRID - BARAJAS', fase: 'AB', modelReceived: 'LEMD_254_PL_TER_MOD_INS_SAN_CM', modelAIM: 'MAD_X_X_MOD_TPA_IFS_EA_E200-T4_XXX_X', versionAIMNativo: null, versionAIMIFC: 1, status: 'Pendiente', timestamp: '2022-11-11T10:00:00Z' },
  { id: 'at-mad-new-9', iata: 'MAD', actuacionId: 'mad-autobuses-t4', expediente: 'DIN254/19', denominationLDA: 'NUEVA ZONA DE AUTOBUSES EN T4 AEROPUERTO ADOLFO SUAREZ MADRID - BARAJAS', fase: 'AB', modelReceived: 'LEMD_254_PL_TER_MOD_INS_VEN_CM', modelAIM: 'MAD_X_X_MOD_TPA_ICL_EA_E200-T4_XXX_X', versionAIMNativo: null, versionAIMIFC: 1, status: 'Pendiente', timestamp: '2022-11-11T10:00:00Z' },
  // MAD - Project 2: DIGITALIZACIÓN T3
  { id: 'at-mad-new-10', iata: 'MAD', actuacionId: 'mad-digital-t3', expediente: 'MAD95/17', denominationLDA: 'DIGITALIZACIÓN T3', fase: 'DIG', modelReceived: 'PBT3_ARQ', modelAIM: 'MAD_X_X_MOD_TPA_ARQ_EA_E005-T3_XXX_X', versionAIMNativo: 1, versionAIMIFC: 1, status: 'finalizado', timestamp: toISODateTime(generateRecentDate(1, 2, 10)) },
  { id: 'at-mad-new-11', iata: 'MAD', actuacionId: 'mad-digital-t3', expediente: 'MAD95/17', denominationLDA: 'DIGITALIZACIÓN T3', fase: 'DIG', modelReceived: 'PBT3_MEC', modelAIM: 'MAD_X_X_MOD_TPA_ICL_EA_E005-T3_XXX_X', versionAIMNativo: 1, versionAIMIFC: 1, status: 'en integración', timestamp: toISODateTime(generateRecentDate(0, 5, 0)) },
  { id: 'at-mad-new-12', iata: 'MAD', actuacionId: 'mad-digital-t3', expediente: 'MAD95/17', denominationLDA: 'DIGITALIZACIÓN T3', fase: 'DIG', modelReceived: 'PBT3_PLU', modelAIM: 'MAD_X_X_MOD_TPA_IFS_EA_E005-T3_XXX_X', versionAIMNativo: null, versionAIMIFC: 1, status: 'Pendiente', timestamp: '2024-06-28T10:00:00Z' },
  { id: 'at-mad-new-13', iata: 'MAD', actuacionId: 'mad-digital-t3', expediente: 'MAD95/17', denominationLDA: 'DIGITALIZACIÓN T3', fase: 'DIG', modelReceived: 'PBT3_EST', modelAIM: 'MAD_X_X_MOD_TPA_EST_EA_E005-T3_XXX_X', versionAIMNativo: 1, versionAIMIFC: 1, status: 'finalizado', timestamp: toISODateTime(generateRecentDate(1, 2, 5)) },
  { id: 'at-mad-new-14', iata: 'MAD', actuacionId: 'mad-digital-t3', expediente: 'MAD95/17', denominationLDA: 'DIGITALIZACIÓN T3', fase: 'DIG', modelReceived: 'PBT3_ELE', modelAIM: 'MAD_X_X_MOD_TPA_IEL_EA_E005-T3_XXX_X', versionAIMNativo: null, versionAIMIFC: 1, status: 'Pendiente', timestamp: '2024-06-28T10:00:00Z' },
  { id: 'at-mad-new-15', iata: 'MAD', actuacionId: 'mad-digital-t3', expediente: 'MAD95/17', denominationLDA: 'DIGITALIZACIÓN T3', fase: 'DIG', modelReceived: 'PBT3_SATE', modelAIM: 'MAD_X_X_MOD_TPA_IME_EA_E005-T3_XXX_X', versionAIMNativo: null, versionAIMIFC: 1, status: 'Pendiente', timestamp: '2024-06-28T10:00:00Z' },
  { id: 'at-mad-new-16', iata: 'MAD', actuacionId: 'mad-digital-t3', expediente: 'MAD95/17', denominationLDA: 'DIGITALIZACIÓN T3', fase: 'DIG', modelReceived: 'PBT3_PCI', modelAIM: 'MAD_X_X_MOD_TPA_IPI_EA_E005-T3_XXX_X', versionAIMNativo: null, versionAIMIFC: 1, status: 'Pendiente', timestamp: '2024-06-28T10:00:00Z' },
  { id: 'at-mad-new-17', iata: 'MAD', actuacionId: 'mad-digital-t3', expediente: 'MAD95/17', denominationLDA: 'DIGITALIZACIÓN T3', fase: 'DIG', modelReceived: 'PBT3_NIVELES Y REJILLAS', modelAIM: 'MAD_X_X_MOD_TPA_NYR_EA_E005-T3_XXX_X', versionAIMNativo: null, versionAIMIFC: 1, status: 'Pendiente', timestamp: '2024-06-28T10:00:00Z' },
  { id: 'at-mad-new-comp-1', iata: 'MAD', actuacionId: 'mad-new-comp-1', expediente: 'DIN599/19', denominationLDA: 'PROYECTO ESPECIAL 1', fase: 'DIG', modelReceived: 'PBT3_ARQ', modelAIM: 'MAD_X_X_MOD_TPA_ARQ_EA_E005-T3_XXX_X', versionAIMNativo: 2, versionAIMIFC: 2, status: 'finalizado', timestamp: toISODateTime(generateRecentDate(0, 1, 10)) },
  { id: 'at-mad-new-comp-2', iata: 'MAD', actuacionId: 'mad-new-comp-2', expediente: 'PRO_1098', denominationLDA: 'PROYECTO ESPECIAL 2', fase: 'DIG', modelReceived: 'PBT3_EST', modelAIM: 'MAD_X_X_MOD_TPA_IEL_EA_E005-T3_XXX_X', versionAIMNativo: 3, versionAIMIFC: 3, status: 'finalizado', timestamp: toISODateTime(generateRecentDate(0, 2, 20)) },
];

export const mockAimModels: Record<string, string[]> = {
    'MAD': [
        'MAD_X_X_OIMN_MDI_T4',
        'MAD_X_X_OIMN_MDI_T4S',
        'MAD_X_X_OIMN_MDI_SAT',
        'MAD_X_X_OIMN_MDI_SUR',
        'MAD_X_X_OIMN_MDI_T123',
        'MAD_X_X_MOD_TPA_ICO_EA_E200-T4_XXX_X',
        'MAD_X_X_MOD_TPA_IEL_EA_E200-T4_XXX_X',
        'MAD_X_X_MOD_URB_YYY_EA_E200-T4_XXX_X',
        'MAD_X_X_MOD_TPA_ARQ_EA_E200-T4_XXX_X',
        'MAD_X_X_MOD_TPA_EST_EA_E200-T4_XXX_X',
        'MAD_X_X_MOD_TPA_ICL_EA_E200-T4_XXX_X',
        'MAD_X_X_MOD_TPA_IFS_EA_E200-T4_XXX_X',
        'MAD_X_X_MOD_TPA_ARQ_EA_E005-T3_XXX_X',
        'MAD_X_X_MOD_TPA_ICL_EA_E005-T3_XXX_X',
        'MAD_X_X_MOD_TPA_IFS_EA_E005-T3_XXX_X',
        'MAD_X_X_MOD_TPA_EST_EA_E005-T3_XXX_X',
        'MAD_X_X_MOD_TPA_IEL_EA_E005-T3_XXX_X',
        'MAD_X_X_MOD_TPA_IME_EA_E005-T3_XXX_X',
        'MAD_X_X_MOD_TPA_IPI_EA_E005-T3_XXX_X',
        'MAD_X_X_MOD_TPA_NYR_EA_E005-T3_XXX_X',
    ],
    'VLC': [
        'VLC_X_X_OIMN_MDI_TF',
        'VLC_X_X_OIMN_MDI_TPA',
    ],
    'BCN': [
        'BCN_X_X_OIMN_MDI_CAMPO_Vuelo',
        'BCN_X_X_OIMN_MDI_TORRE',
        'BCN_X_X_OIMN_MDI_T1',
    ],
    'PMI': [
        'PMI_X_X_OIMN_MDI_MODC',
        'PMI_X_X_OIMN_MDI_MODA',
        'PMI_X_X_OIMN_MDI_SATE',
    ],
    'ACE': [
        'ACE_X_X_OIMN_MDI_T1',
        'ACE_X_X_OIMN_MDI_T2',
    ],
    'TFN': [
        'TFN_X_X_OIMN_MDI_TERMINAL',
    ],
};