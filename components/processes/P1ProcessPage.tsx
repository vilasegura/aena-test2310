
import React from 'react';
import { P11ModelReception, AimTransfer, PimWithMappings, AimMapping } from '../../types';
import Card from '../ui/Card';
import P11ModelReceptionTable from '../models/P11ModelReceptionTable';
import SearchInput from '../ui/SearchInput';
import { mockAimModels, mockActuacionesDetail } from '../../data';
import PublishedAimModelsTable, { PublishedAimModel, PublishedAimModelStatus } from '../models/PublishedAimModelsTable';
import SentAimModelsTable, { SentAimModel } from '../models/SentAimModelsTable';


const ToggleSwitch: React.FC<{
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  id: string;
}> = ({ label, enabled, onChange, id }) => {
  return (
    <div className="flex items-center">
      <label htmlFor={id} className="text-sm font-medium text-gray-700 mr-3">{label}</label>
      <button
        id={id}
        type="button"
        onClick={() => onChange(!enabled)}
        className={`${
          enabled ? 'bg-aena-green' : 'bg-gray-200'
        } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-aena-green`}
      >
        <span
          className={`${
            enabled ? 'translate-x-6' : 'translate-x-1'
          } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
        />
      </button>
    </div>
  );
};


interface P1ProcessPageProps {
  airportId: string;
  p11Models: P11ModelReception[];
  aimTransfers: AimTransfer[];
  onBack: () => void;
  onAimTransfersChange: (transfer: AimTransfer) => void;
}

const P11ModelIcon = () => (
    <svg className="w-8 h-8 text-aena-green mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10V7a2 2 0 012-2h10a2 2 0 012 2v3"></path>
    </svg>
);

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
);

const AimModelIcon = () => (
    <svg className="w-8 h-8 text-aena-green mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7l8-4 8 4m-8 14v-4" />
    </svg>
);

const SentModelIcon = () => (
    <svg className="w-8 h-8 text-aena-green mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
    </svg>
);

const P1ProcessPage: React.FC<P1ProcessPageProps> = ({ airportId, p11Models, aimTransfers, onBack, onAimTransfersChange }) => {
    // FIX: Prefixed 'useState' with 'React.' to resolve the 'Cannot find name' error and ensure consistency with other hook calls in the component.
    const [activeTab, setActiveTab] = React.useState<'mapping' | 'published' | 'sent'>('mapping');
    const [p11SearchTerm, setP11SearchTerm] = React.useState('');
    const [publishedSearchTerm, setPublishedSearchTerm] = React.useState('');
    const [sentSearchTerm, setSentSearchTerm] = React.useState('');
    const [groupByActuacion, setGroupByActuacion] = React.useState(false);
    const [groupByAim, setGroupByAim] = React.useState(false);
    const [availableAimModels] = React.useState(() => mockAimModels[airportId] || []);

    const initialMappings = React.useMemo((): PimWithMappings[] => {
        const pims: Record<string, PimWithMappings> = {};

        // 1. Initialize all PIM models
        p11Models.forEach(pim => {
            if (!pims[pim.id]) {
                const parts = pim.actuacionName.split('_');
                pims[pim.id] = {
                    ...pim,
                    expediente: parts[1] || 'N/A',
                    denominationLDA: parts.slice(2).join(' ') || 'Digitalización',
                    fase: parts[1]?.includes('DF') ? 'DIG' : 'AB',
                    aimMappings: []
                };
            }
        });

        // 2. Populate with existing transfers and find matches
        aimTransfers.forEach(transfer => {
            const pimModel = p11Models.find(p => p.modelName === transfer.modelReceived && p.iata === transfer.iata);
            if (pimModel && pims[pimModel.id]) {
                pims[pimModel.id].aimMappings.push({
                    mappingId: transfer.id,
                    modelAIM: transfer.modelAIM,
                    // FIX: Corrected a typo in the property name 'versionAIMNativo'.
                    versionAIMNativo: transfer.versionAIMNativo ?? pimModel.version,
                    versionAIMIFC: transfer.versionAIMIFC,
                    status: transfer.status,
                    comentarios: transfer.comentarios
                });
                
                // Update with more specific data from the transfer
                pims[pimModel.id].expediente = transfer.expediente;
                pims[pimModel.id].denominationLDA = transfer.denominationLDA;
                pims[pimModel.id].fase = transfer.fase;
            }
        });

        // 3. For PIMs without any mappings, add a default empty mapping
        Object.values(pims).forEach(pim => {
            if (pim.aimMappings.length === 0) {
                pim.aimMappings.push({
                    mappingId: `${pim.id}-newmap`,
                    modelAIM: null,
                    versionAIMNativo: pim.version,
                    versionAIMIFC: null,
                    status: 'Pendiente'
                });
            }
        });

        return Object.values(pims);
    }, [p11Models, aimTransfers]);
    
    const [mappings, setMappings] = React.useState<PimWithMappings[]>(initialMappings);

    const initialPublishedAimModels = React.useMemo((): PublishedAimModel[] => {
        const hardcodedPublishedModels: PublishedAimModel[] = [
            { id: 'pub-1', iata: 'MAD', tipoAim: 'TPA', codigoAim: 'E200-T4', disciplina: 'ARQ', modeloAim: 'MAD_X_X_MOD_TPA_ARQ_EA_E200-T4_XXX_X', versionAimNativo: 1, versionAimIfc: 1, estado: 'Publicado', comentarios: '' },
            { id: 'pub-2', iata: 'MAD', tipoAim: 'TPA', codigoAim: 'E200-T4', disciplina: 'EST', modeloAim: 'MAD_X_X_MOD_TPA_EST_EA_E200-T4_XXX_X', versionAimNativo: 1, versionAimIfc: 1, estado: 'Publicado', comentarios: '' },
            { id: 'pub-3', iata: 'MAD', tipoAim: 'TPA', codigoAim: 'E200-T4', disciplina: 'ICL', modeloAim: 'MAD_X_X_MOD_TPA_ICL_EA_E200-T4_XXX_X', versionAimNativo: 1, versionAimIfc: 1, estado: 'Publicado', comentarios: '' },
            { id: 'pub-4', iata: 'MAD', tipoAim: 'TPA', codigoAim: 'E200-T4', disciplina: 'ICO', modeloAim: 'MAD_X_X_MOD_TPA_ICO_EA_E200-T4_XXX_X', versionAimNativo: 1, versionAimIfc: 1, estado: 'Publicado', comentarios: '' },
            { id: 'pub-5', iata: 'MAD', tipoAim: 'TPA', codigoAim: 'E200-T4', disciplina: 'IEL', modeloAim: 'MAD_X_X_MOD_TPA_IEL_EA_E200-T4_XXX_X', versionAimNativo: 1, versionAimIfc: 1, estado: 'Publicado', comentarios: '' },
            { id: 'pub-6', iata: 'MAD', tipoAim: 'TPA', codigoAim: 'E200-T4', disciplina: 'IFS', modeloAim: 'MAD_X_X_MOD_TPA_IFS_EA_E200-T4_XXX_X', versionAimNativo: 1, versionAimIfc: 1, estado: 'Publicado', comentarios: '' },
            { id: 'pub-7', iata: 'MAD', tipoAim: 'URB', codigoAim: 'E200-T4', disciplina: 'YYY', modeloAim: 'MAD_X_X_MOD_URB_YYY_EA_E200-T4_XXX_X', versionAimNativo: 1, versionAimIfc: 1, estado: 'Publicado', comentarios: '' },
            { id: 'pub-8', iata: 'MAD', tipoAim: 'TPA', codigoAim: 'E005-T3', disciplina: 'ARQ', modeloAim: 'MAD_X_X_MOD_TPA_ARQ_EA_E005-T3_XXX_X', versionAimNativo: 1, versionAimIfc: 1, estado: 'Publicado', comentarios: '' },
            { id: 'pub-9', iata: 'MAD', tipoAim: 'TPA', codigoAim: 'E005-T3', disciplina: 'IEL', modeloAim: 'MAD_X_X_MOD_TPA_IEL_EA_E005-T3_XXX_X', versionAimNativo: 1, versionAimIfc: 1, estado: 'Publicado', comentarios: '' },
            { id: 'pub-10', iata: 'MAD', tipoAim: 'TPA', codigoAim: 'E005-T3', disciplina: 'EST', modeloAim: 'MAD_X_X_MOD_TPA_EST_EA_E005-T3_XXX_X', versionAimNativo: 1, versionAimIfc: 1, estado: 'Publicado', comentarios: '' },
            { id: 'pub-11', iata: 'MAD', tipoAim: 'TPA', codigoAim: 'E005-T3', disciplina: 'IPI', modeloAim: 'MAD_X_X_MOD_TPA_IPI_EA_E005-T3_XXX_X', versionAimNativo: 1, versionAimIfc: 1, estado: 'Publicado', comentarios: '' },
            { id: 'pub-12', iata: 'MAD', tipoAim: 'TPA', codigoAim: 'E005-T3', disciplina: 'ICL', modeloAim: 'MAD_X_X_MOD_TPA_ICL_EA_E005-T3_XXX_X', versionAimNativo: 1, versionAimIfc: 1, estado: 'Publicado', comentarios: '' },
            { id: 'pub-13', iata: 'MAD', tipoAim: 'TPA', codigoAim: 'E005-T3', disciplina: 'IFS', modeloAim: 'MAD_X_X_MOD_TPA_IFS_EA_E005-T3_XXX_X', versionAimNativo: 1, versionAimIfc: 1, estado: 'Publicado', comentarios: '' },
            { id: 'pub-14', iata: 'MAD', tipoAim: 'TPA', codigoAim: 'E005-T3', disciplina: 'NYR', modeloAim: 'MAD_X_X_MOD_TPA_NYR_EA_E005-T3_XXX_X', versionAimNativo: 1, versionAimIfc: 1, estado: 'Publicado', comentarios: '' },
            { id: 'pub-15', iata: 'MAD', tipoAim: 'TPA', codigoAim: 'E005-T3', disciplina: 'IME', modeloAim: 'MAD_X_X_MOD_TPA_IME_EA_E005-T3_XXX_X', versionAimNativo: 1, versionAimIfc: 1, estado: 'Publicado', comentarios: '' },
        ];
        
        if (airportId === 'MAD') {
            return hardcodedPublishedModels;
        }

        const airportPublishedTransfers = aimTransfers.filter(
            t => t.status === 'finalizado' && t.iata === airportId
        );

        return airportPublishedTransfers.map(transfer => {
            const modelReceivedParts = transfer.modelReceived.split('_');
            const disciplines = ['ARQ', 'EST', 'ICL', 'ICO', 'IEB', 'INST', 'CIV', 'MEP'];
            const foundDiscipline = modelReceivedParts.find(p => disciplines.includes(p));
            
            return {
                id: transfer.id,
                iata: transfer.iata,
                tipoAim: 'TPA',
                codigoAim: 'E001-T1',
                disciplina: foundDiscipline || 'N/A',
                modeloAim: transfer.modelAIM,
                versionAimNativo: transfer.versionAIMNativo,
                versionAimIfc: transfer.versionAIMIFC,
                estado: 'Publicado',
                comentarios: transfer.comentarios
            };
        });
    }, [aimTransfers, airportId]);
    
    const [publishedAimModels, setPublishedAimModels] = React.useState(initialPublishedAimModels);

    React.useEffect(() => {
        setPublishedAimModels(initialPublishedAimModels);
    }, [initialPublishedAimModels]);

    const handlePublishedModelChange = (updatedModel: PublishedAimModel) => {
        setPublishedAimModels(currentModels =>
            currentModels.map(model => (model.id === updatedModel.id ? updatedModel : model))
        );
    };

    const sentAimModels = React.useMemo((): SentAimModel[] => {
        const sentStatuses: AimTransfer['status'][] = ['finalizado'];
        const airportSentTransfers = aimTransfers.filter(
            t => sentStatuses.includes(t.status) && t.iata === airportId
        );

        return airportSentTransfers.map(transfer => {
            return {
                id: transfer.id,
                iata: transfer.iata,
                modelo: transfer.modelAIM,
                version: transfer.versionAIMNativo,
                compartidoCon: transfer.expediente,
                fecha: transfer.timestamp,
                comentarios: transfer.comentarios,
            };
        });
    }, [aimTransfers, airportId]);

    const handleSentModelChange = (updatedModel: SentAimModel) => {
        const transferToUpdate = aimTransfers.find(t => t.id === updatedModel.id);
        if (transferToUpdate) {
            const updatedTransfer = { ...transferToUpdate, comentarios: updatedModel.comentarios };
            onAimTransfersChange(updatedTransfer);
        }
    };

    const filteredPublishedModels = React.useMemo(() => {
        return publishedAimModels.filter(model =>
            Object.values(model).some(val =>
                String(val).toLowerCase().includes(publishedSearchTerm.toLowerCase())
            )
        );
    }, [publishedAimModels, publishedSearchTerm]);

    const filteredSentModels = React.useMemo(() => {
        return sentAimModels.filter(model =>
            Object.values(model).some(val =>
                String(val).toLowerCase().includes(sentSearchTerm.toLowerCase())
            )
        );
    }, [sentAimModels, sentSearchTerm]);


    const handlePimDataChange = (pimId: string, field: 'denominationLDA' | 'fase', value: string) => {
        setMappings(currentMappings =>
            currentMappings.map(pim => {
                if (pim.id === pimId) {
                    if (field === 'fase') {
                        return { ...pim, fase: value as 'AB' | 'DIG' | 'PCD' };
                    } else {
                        return { ...pim, denominationLDA: value };
                    }
                }
                return pim;
            })
        );
    };

    const handleMappingChange = (pimId: string, updatedAimMapping: AimMapping) => {
        setMappings(currentMappings =>
            currentMappings.map(pim => {
                if (pim.id === pimId) {
                    return {
                        ...pim,
                        aimMappings: pim.aimMappings.map(aim => aim.mappingId === updatedAimMapping.mappingId ? updatedAimMapping : aim)
                    };
                }
                return pim;
            })
        );
    };

    const handleAddMapping = (pimModelId: string) => {
        setMappings(currentMappings => 
            currentMappings.map(pim => {
                if (pim.id === pimModelId) {
                    const newMapping: AimMapping = {
                        mappingId: `${pimModelId}-newmap-${Date.now()}`,
                        modelAIM: null,
                        versionAIMNativo: pim.version,
                        versionAIMIFC: null,
                        status: 'Pendiente'
                    };
                    return { ...pim, aimMappings: [...pim.aimMappings, newMapping] };
                }
                return pim;
            })
        );
    };

    const handleRemoveMapping = (pimId: string, mappingIdToRemove: string) => {
        setMappings(currentMappings =>
            currentMappings.map(pim => {
                if (pim.id === pimId) {
                    const updatedAimMappings = pim.aimMappings.filter(m => m.mappingId !== mappingIdToRemove);
                    // If all mappings are removed, add a default empty one back
                    if (updatedAimMappings.length === 0) {
                         updatedAimMappings.push({
                            mappingId: `${pim.id}-newmap`,
                            modelAIM: null,
                            versionAIMNativo: null,
                            versionAIMIFC: null,
                            status: 'Pendiente'
                        });
                    }
                    return { ...pim, aimMappings: updatedAimMappings };
                }
                return pim;
            })
        );
    };

    const handleGroupByActuacionChange = (enabled: boolean) => {
        setGroupByActuacion(enabled);
        if (enabled) {
            setGroupByAim(false);
        }
    };

    const handleGroupByAimChange = (enabled: boolean) => {
        setGroupByAim(enabled);
        if (enabled) {
            setGroupByActuacion(false);
        }
    };

    const filteredMappings = React.useMemo(() => {
        return mappings.filter(model => 
            Object.values(model).some(val => 
                String(val).toLowerCase().includes(p11SearchTerm.toLowerCase())
            ) || model.aimMappings.some(am => Object.values(am).some(v => String(v).toLowerCase().includes(p11SearchTerm.toLowerCase())))
        );
    }, [mappings, p11SearchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Traspaso de modelos PIM/AIM</h2>
          <button onClick={onBack} className="flex items-center text-sm font-semibold text-gray-600 hover:text-aena-green">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              Volver a la vista general
          </button>
      </div>
      
      <div>
          <nav className="flex space-x-1" aria-label="Tabs">
              <button
                  onClick={() => setActiveTab('mapping')}
                  className={`font-bold text-lg py-3 px-6 rounded-t-lg transition-colors duration-200 focus:outline-none ${
                      activeTab === 'mapping'
                          ? 'bg-aena-green text-white shadow-inner'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
              >
                  Solicitud de Integración PIM-AIM
              </button>
              <button
                  onClick={() => setActiveTab('published')}
                  className={`font-bold text-lg py-3 px-6 rounded-t-lg transition-colors duration-200 focus:outline-none ${
                      activeTab === 'published'
                          ? 'bg-aena-green text-white shadow-inner'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
              >
                  Seguimiento AIMs
              </button>
              <button
                  onClick={() => setActiveTab('sent')}
                  className={`font-bold text-lg py-3 px-6 rounded-t-lg transition-colors duration-200 focus:outline-none ${
                      activeTab === 'sent'
                          ? 'bg-aena-green text-white shadow-inner'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
              >
                  Modelos AIM Enviados
              </button>
          </nav>
          
          <div className="mt-0">
              {activeTab === 'mapping' && (
                  <Card className="rounded-t-none shadow-lg">
                    <div className="p-6 border-b flex items-center">
                      <P11ModelIcon />
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">Solicitud de Integración PIM-AIM</h2>
                        <p className="mt-1 text-gray-600">(Proceda a la asignación del modelo AIM en el que será integrada)</p>
                      </div>
                    </div>
                    <div className="p-4 border-b flex flex-wrap gap-4 items-center">
                        <div className="flex-grow min-w-[250px] md:min-w-[300px]">
                          <SearchInput 
                              value={p11SearchTerm}
                              onChange={e => setP11SearchTerm(e.target.value)}
                              placeholder="Buscar en modelos PIM recibidos..."
                          />
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0 md:ml-auto">
                          <ToggleSwitch 
                              id="group-by-actuacion-toggle"
                              label="Agrupar por Actuación"
                              enabled={groupByActuacion}
                              onChange={handleGroupByActuacionChange}
                          />
                          <ToggleSwitch 
                              id="group-by-aim-toggle"
                              label="Agrupar por AIM"
                              enabled={groupByAim}
                              onChange={handleGroupByAimChange}
                          />
                        </div>
                    </div>
                    <div className="p-2 sm:p-4">
                      {filteredMappings.length > 0 ? (
                          <P11ModelReceptionTable 
                              mappings={filteredMappings} 
                              groupByActuacion={groupByActuacion}
                              groupByAim={groupByAim}
                              availableAimModels={availableAimModels}
                              onMappingChange={handleMappingChange}
                              onAddMapping={handleAddMapping}
                              onRemoveMapping={handleRemoveMapping}
                              onPimDataChange={handlePimDataChange}
                          />
                      ) : (
                          <div className="text-center py-8"><p className="text-gray-500">No se han encontrado modelos para este aeropuerto.</p></div>
                      )}
                    </div>
                  </Card>
              )}

              {activeTab === 'published' && (
                  <Card className="rounded-t-none shadow-lg">
                      <div className="p-6 border-b flex items-center">
                          <AimModelIcon />
                          <div>
                              <h2 className="text-xl font-semibold text-gray-800">Seguimiento AIMs</h2>
                              <p className="mt-1 text-gray-600">(Estados y versiones)</p>
                          </div>
                      </div>
                       <div className="p-4 border-b flex flex-wrap gap-4 items-center">
                            <div className="flex-grow min-w-[250px] md:min-w-[300px]">
                              <SearchInput 
                                  value={publishedSearchTerm}
                                  onChange={e => setPublishedSearchTerm(e.target.value)}
                                  placeholder="Buscar en modelos publicados..."
                              />
                            </div>
                        </div>
                      <div className="p-2 sm:p-4">
                          {publishedAimModels.length > 0 ? (
                            filteredPublishedModels.length > 0 ? (
                                <PublishedAimModelsTable models={filteredPublishedModels} onModelChange={handlePublishedModelChange} />
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No se encontraron modelos con los criterios de búsqueda.</p>
                                </div>
                            )
                          ) : (
                              <div className="text-center py-8">
                                  <p className="text-gray-500">No hay modelos AIM publicados para este aeropuerto.</p>
                              </div>
                          )}
                      </div>
                  </Card>
              )}

              {activeTab === 'sent' && (
                  <Card className="rounded-t-none shadow-lg">
                      <div className="p-6 border-b flex items-center justify-between">
                          <div className="flex items-center">
                              <SentModelIcon />
                              <div>
                                  <h2 className="text-xl font-semibold text-gray-800">Modelos AIM: Listado Modelos Enviados</h2>
                              </div>
                          </div>
                          <div className="text-right">
                              <p className="text-sm text-gray-500">Total de Archivos</p>
                              <p className="text-2xl font-bold text-gray-800">{sentAimModels.length}</p>
                          </div>
                      </div>
                      <div className="p-4 border-b flex flex-wrap gap-4 items-center">
                            <div className="flex-grow min-w-[250px] md:min-w-[300px]">
                              <SearchInput 
                                  value={sentSearchTerm}
                                  onChange={e => setSentSearchTerm(e.target.value)}
                                  placeholder="Buscar en modelos enviados..."
                              />
                            </div>
                        </div>
                      <div className="p-2 sm:p-4">
                          {sentAimModels.length > 0 ? (
                            filteredSentModels.length > 0 ? (
                                <SentAimModelsTable models={filteredSentModels} onModelChange={handleSentModelChange} />
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No se encontraron modelos con los criterios de búsqueda.</p>
                                </div>
                            )
                          ) : (
                              <div className="text-center py-8">
                                  <p className="text-gray-500">No hay modelos AIM enviados para este aeropuerto.</p>
                              </div>
                          )}
                      </div>
                  </Card>
              )}
          </div>
      </div>
    </div>
  );
};

export default P1ProcessPage;
