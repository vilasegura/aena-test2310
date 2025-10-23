// FIX: Replaced incorrect React rendering code with proper type definitions.

export type ActionStatus = 'En curso' | 'Pendiente' | 'Publicado' | 'N/A';

export interface Airport {
  id: string;
  name: string;
  iataCode: string;
  location: string;
  lastSync: string;
  imageUrl: string;
  level: string;
  accLinkActive: boolean;
  accUrl: string | undefined;
  lat: number;
  lon: number;
  actionCount: number;
  integrationStatus: 'Finalizado' | 'En curso' | 'Por iniciar';
}

export interface Actuacion {
  id: string;
  name: string;
  airportId: string;
  airportName: string;
  status: 'En progreso' | 'Completada' | 'En espera' | 'Cancelada';
  startDate: string;
  endDate: string;
  type: 'PIM' | 'AIM' | 'Data Drop';
  hasRequirements: boolean;
}

export interface ActuacionDetail {
  id: string;
  airportId: string;
  name: string;
  accLinkActive: boolean;
  p1_1_status: ActionStatus;
  p1_2_status: ActionStatus;
  p4_status: ActionStatus;
}

export interface DataTransfer {
  id: string;
  actuacionId: string;
  fromSystem: 'ACC' | 'GMAO';
  toSystem: 'GMAO' | 'ACC' | 'GIS' | 'SAP';
  status: 'Éxito' | 'En curso' | 'Fallido';
  timestamp: string;
  fileSize: string;
}

export interface ModelReception {
    id: string;
    iata: string;
    actuacionId: string;
    modelReceived: string;
    expediente: string;
    denominationLDA: string;
    fase: 'AB' | 'DIG' | 'PCD';
    dateReceived: string;
    versionPIMNativo: number;
    versionPIMIFC: number;
}

export interface AimTransfer {
    id: string;
    iata: string;
    actuacionId: string;
    expediente: string;
    denominationLDA: string;
    fase: 'AB' | 'DIG' | 'PCD';
    modelReceived: string;
    modelAIM: string;
    versionAIMNativo: number | null;
    versionAIMIFC: number;
    status: 'Pendiente' | 'en integración' | 'finalizado';
    timestamp: string;
    comentarios?: string;
}

export interface P11ModelReception {
    id: string;
    iata: string;
    actuacionName: string;
    modelName: string;
    sourceFolder: string;
    dateReceived: string;
    version: number;
}

export interface PIMAsset {
    id: string;
    sistemaMaximo: string;
    subsistemaMaximo: string;
    tipoActivoMaximo: string;
    agrupacionMaximo: string;
    codigoEquipo: string;
    descripcion: string;
    marca: string;
    modelo: string;
    ubicacion: string;
    fechaInstalacion: string;
    codigoBIMMaximo: string;
    precioCompra: number;
    vidaUtil: number;
    estado: string;
    descripcionUbicacion: string;
    // Optional fields
    potenciaTermicaMax?: number;
    potenciaTermicaModoFrio?: number;
    potenciaTotalPorZona?: number;
    potenciaTermicaModoCalor?: number;
    ruta?: string;
    rutaNueva?: string;
    potenciaKw?: number;
    tipoDeAgenteExtintor?: string;
    pesoCargaKg?: number;
    fechaDeRetimbrado?: string;
    nBombasDeAgua?: number;
    potenciaIndividualBombas?: number;
    marcaBombasDeAgua?: string;
    modeloBombasDeAgua?: string;
    nSerieBombasDeAgua?: string;
    zonaQueAbastece?: string;
    sistemaDeAccionamiento?: string;
    velocidad015?: string;
    afeccionADora?: string;
    longitud?: number;
}

export interface DiacaeSpace {
    id: string;
    codigoEspacio: string;
    oaci: string;
    iata: string;
    tipoEspacio: string;
    descripcionEspacio: string | null;
    identificador: string | null;
    edificio: string;
    planta: string;
}

export interface BimCategory {
    id: string;
    nombre: string;
    claseAena: string;
    tipoAena: string;
    codigoOmniclass: string;
    entidadIfc: string;
    tipoIfc: string;
}

export interface BimAttribute {
    id: string;
    name: string;
    hasPredefinedValue: boolean;
}

export interface PropertySet {
    id: string;
    code: string;
    name: string;
    attributes: BimAttribute[];
}

export interface PredefinedValue {
    id: string;
    attributeId: string;
    valorAdmitido: string;
    formato: 'Texto' | 'Numero' | 'Booleano';
    unidad: string;
    tipoEjemploRevit: 'Tipo' | 'Ejemplo';
    grupoAtributoRevit: string;
    categoriaRevit: string;
}

export interface MappingCategory {
    id: string;
    name: string;
    lod200: string;
    lod300: string;
    mappings: Record<string, string>;
}

export interface MappingPSet {
    id: string;
    name: string;
    attributes: {
        id: string;
        name: string;
    }[];
}

export interface AimMapping {
    mappingId: string;
    modelAIM: string | null;
    versionAIMNativo: number | null;
    versionAIMIFC: number | null;
    status: 'Pendiente' | 'en integración' | 'finalizado';
    comentarios?: string;
}

export interface PimWithMappings extends P11ModelReception {
    expediente: string;
    denominationLDA: string;
    fase: 'AB' | 'DIG' | 'PCD';
    aimMappings: AimMapping[];
}

export interface DiacaeHistoryItem {
  id: number;
  date: Date;
  version: number;
  user: string;
  downloadedPlans: Record<string, string[]>;
  masterFileDownloaded: boolean;
  accLink: string;
}