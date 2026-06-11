/**
 * ESG GO | Carbon Emission Factors Registry
 * Based on IPCC, EPA, and local Environmental Protection Bureau databases.
 */

export interface EmissionFactor {
  id: string;
  category: 'Scope 1' | 'Scope 2' | 'Scope 3';
  name: string;
  unit: string; // Activity unit (e.g., kWh, L, kg)
  factor: number; // kgCO2e per unit
  source: string;
  year: number;
}

export const EMISSION_FACTORS: Record<string, EmissionFactor> = {
  // Scope 2: Purchased Electricity (Taiwan 2023 factor as example)
  'electricity_tw_2023': {
    id: 'electricity_tw_2023',
    category: 'Scope 2',
    name: 'Purchased Electricity (Taiwan)',
    unit: 'kWh',
    factor: 0.495,
    source: 'Bureau of Energy, MOEA',
    year: 2023
  },
  // Scope 1: Diesel
  'diesel_stationary': {
    id: 'diesel_stationary',
    category: 'Scope 1',
    name: 'Diesel Fuel (Stationary Combustion)',
    unit: 'L',
    factor: 2.602,
    source: 'EPA GHG Emission Factor Table v6.0.4',
    year: 2023
  },
  // Scope 1: Gasoline
  'gasoline_mobile': {
    id: 'gasoline_mobile',
    category: 'Scope 1',
    name: 'Gasoline (Mobile Combustion)',
    unit: 'L',
    factor: 2.263,
    source: 'EPA GHG Emission Factor Table v6.0.4',
    year: 2023
  }
};
