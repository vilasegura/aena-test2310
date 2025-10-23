// FIX: Add placeholder data for missing mock files to resolve import errors.
import type { PIMAsset, DiacaeSpace, BimCategory, PropertySet, PredefinedValue, MappingCategory, MappingPSet } from '../types';

export const mockPimAssets: PIMAsset[] = [];
export const mockMaximoAssets: PIMAsset[] = [];
export const mockDiacaeSpaces: DiacaeSpace[] = [];
export const mockCadPlans: Record<string, string[]> = {};
export const mockBimCategories: BimCategory[] = [];
export const mockPropertySets: PropertySet[] = [];
export const mockPredefinedValues: PredefinedValue[] = [];
export const mockMappingCategories: MappingCategory[] = [];
export const mockMappingPSets: MappingPSet[] = [];
