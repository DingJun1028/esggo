/**
 * Emission Factor Database
 *
 * Provides automatic matching of emission factors based on activity type and region.
 * Built-in database includes factors from IPCC, EPA, and other authoritative sources.
 *
 * As described in whitepaper Section 4.2: AI Computing Core
 * "排放係數自動匹配：系統根據活動類型及所處地區，自動從預設的排放係數資料庫中檢索最具代表性的數值。"
 *
 * Aligned with 5T Protocol v10.1
 */
import omniLogger from '../utils/omniLogger.js';
import { OmniComponentCoreFactory } from './OmniComponentCore.js';
import { type IComponentCore } from './OmniComponentCore.js';

export interface EmissionFactor {
  activityType: string;
  region: string;
  co2e: number;
  unit: string;
  source: string;
  year: number;
  uncertainty?: number;
}

export interface SearchCriteria {
  activityType?: string;
  region?: string;
  minYear?: number;
}

// ============================================================================
// Emission Factor Database
// ============================================================================
export class EmissionFactorDatabase {
  private factors: Map<string, EmissionFactor[]>;
  private ssotCore: IComponentCore;

  constructor() {
    this.factors = new Map();

    // 初始化 SSOT 資料來源 (v10.1.0-sentient)
    this.ssotCore = OmniComponentCoreFactory.create({
      sourceOrigin: 'EmissionFactorDatabase v10.1.0-sentient',
      rawDataPath: '/vault/raw/emission-factors-database-v10.1.json',
      verificationMethod: 'Authoritative Source Verification (IPCC, EPA, IEA)',
    });

    this.initializeDatabase();

    omniLogger.info('ESG', 'EmissionFactorDatabase initialized with SSOT', {
      ssotId: this.ssotCore.uuid,
      version: this.ssotCore.version,
      source: 'EmissionFactorDatabase.constructor',
    });
  }

  /**
   * Get emission factor for a specific activity and region
   */
  public async getFactor(activityType: string, region: string = 'global'): Promise<EmissionFactor> {
    const key = this.generateKey(activityType);
    const factors = this.factors.get(key) || [];

    // Try to find region-specific factor
    let factor = factors.find(f => f.region === region);

    // Fallback to global factor
    if (!factor) {
      factor = factors.find(f => f.region === 'global');
    }

    if (!factor) {
      omniLogger.warn('ESG', 'Emission factor not found, using default', {
        activityType,
        region,
        source: 'EmissionFactorDatabase.getFactor',
      });

      // Return conservative default
      return {
        activityType,
        region: 'global',
        co2e: 1.0,
        unit: 'unit',
        source: 'Default (Conservative Estimate)',
        year: 2024,
        uncertainty: 50,
      };
    }

    omniLogger.debug('ESG', 'Emission factor matched', {
      activityType,
      region: factor.region,
      co2e: factor.co2e,
      source: factor.source,
    });

    return factor;
  }

  /**
   * Search factors by criteria
   */
  public searchFactors(criteria: SearchCriteria): EmissionFactor[] {
    let results: EmissionFactor[] = [];

    this.factors.forEach(entry => {
      results = results.concat(entry);
    });

    // Apply filters
    if (criteria.activityType) {
      const searchType = criteria.activityType.toLowerCase();
      results = results.filter(f =>
        f.activityType.toLowerCase().includes(searchType)
      );
    }

    if (criteria.region) {
      results = results.filter(f => f.region === criteria.region);
    }

    if (criteria.minYear) {
      results = results.filter(f => f.year >= (criteria.minYear as number));
    }

    return results;
  }

  // ============================================================================
  // Database Initialization
  // ============================================================================

  private initializeDatabase(): void {
    // Electricity emission factors (Scope 2)
    this.addFactor({
      activityType: 'electricity',
      region: 'global',
      co2e: 0.475, // kg CO2e / kWh (IEA global average)
      unit: 'kWh',
      source: 'IEA 2023',
      year: 2023,
    });

    this.addFactor({
      activityType: 'electricity',
      region: 'taiwan',
      co2e: 0.509, // kg CO2e / kWh (Taiwan EPA 2023)
      unit: 'kWh',
      source: 'Taiwan EPA 2023',
      year: 2023,
    });

    this.addFactor({
      activityType: 'electricity',
      region: 'china',
      co2e: 0.581, // kg CO2e / kWh
      unit: 'kWh',
      source: 'MEE China 2023',
      year: 2023,
    });

    this.addFactor({
      activityType: 'electricity',
      region: 'usa',
      co2e: 0.386, // kg CO2e / kWh (EPA eGRID 2023)
      unit: 'kWh',
      source: 'EPA eGRID 2023',
      year: 2023,
    });

    // Natural Gas (Scope 1)
    this.addFactor({
      activityType: 'natural_gas',
      region: 'global',
      co2e: 2.02, // kg CO2e / m3
      unit: 'm3',
      source: 'IPCC 2006',
      year: 2006,
    });

    // Diesel (Scope 1)
    this.addFactor({
      activityType: 'diesel',
      region: 'global',
      co2e: 2.68, // kg CO2e / liter
      unit: 'liter',
      source: 'IPCC 2006',
      year: 2006,
    });

    // Gasoline (Scope 1)
    this.addFactor({
      activityType: 'gasoline',
      region: 'global',
      co2e: 2.31, // kg CO2e / liter
      unit: 'liter',
      source: 'IPCC 2006',
      year: 2006,
    });

    // Refrigerant R-134a (Scope 1 - Fugitive)
    this.addFactor({
      activityType: 'refrigerant',
      region: 'global',
      co2e: 1430, // kg CO2e / kg (GWP)
      unit: 'kg',
      source: 'IPCC AR5',
      year: 2014,
    });

    // Business Travel - Air (Scope 3)
    this.addFactor({
      activityType: 'business_travel',
      region: 'global',
      co2e: 0.255, // kg CO2e / passenger-km (economy class)
      unit: 'passenger-km',
      source: 'DEFRA 2023',
      year: 2023,
    });

    // Employee Commuting - Car (Scope 3)
    this.addFactor({
      activityType: 'employee_commute',
      region: 'global',
      co2e: 0.171, // kg CO2e / km (average car)
      unit: 'km',
      source: 'DEFRA 2023',
      year: 2023,
    });

    // Waste - Landfill (Scope 3)
    this.addFactor({
      activityType: 'waste',
      region: 'global',
      co2e: 0.502, // kg CO2e / kg
      unit: 'kg',
      source: 'EPA WARM',
      year: 2023,
    });

    // Purchased Goods - Paper (Scope 3)
    this.addFactor({
      activityType: 'supplier_goods',
      region: 'global',
      co2e: 1.09, // kg CO2e / kg
      unit: 'kg',
      source: 'DEFRA 2023',
      year: 2023,
    });

    omniLogger.info('ESG', 'Emission Factor Database initialized', {
      totalFactors: this.getTotalFactorCount(),
      source: 'EmissionFactorDatabase.initializeDatabase',
    });
  }

  /**
   * Add a factor to the database
   */
  private addFactor(factor: EmissionFactor): void {
    const key = this.generateKey(factor.activityType);

    if (!this.factors.has(key)) {
      this.factors.set(key, []);
    }

    this.factors.get(key)!.push(factor);
  }

  /**
   * Generate normalized key for activity type
   */
  private generateKey(activityType: string): string {
    return activityType.toLowerCase().replace(/[^a-z0-9]/g, '_');
  }

  /**
   * Get total number of factors in database
   */
  public getTotalFactorCount(): number {
    let count = 0;
    this.factors.forEach(entry => {
      count += entry.length;
    });
    return count;
  }

  // ============================================================================
  // API Integration Methods (for future expansion)
  // ============================================================================

  /**
   * Fetch latest factors from external API (e.g., EPA, IPCC)
   * TODO: Implement in Phase 2
   */
  public async syncWithExternalAPI(source: string): Promise<void> {
    omniLogger.info('ESG', 'External API sync not yet implemented', {
      source,
      status: 'planned_for_phase_2',
    });

    // Future implementation will fetch latest factors and update database
    throw new Error('External API sync not yet implemented');
  }

  /**
   * Return the SSOT core for audit purposes
   */
  public getSsotCore(): IComponentCore {
    return this.ssotCore;
  }
}

export default EmissionFactorDatabase;
