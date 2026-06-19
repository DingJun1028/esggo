import type { ESGDataPoint, ChainedDataBlock } from '../types/omni-report.types.js';
import { TrustworthyLock } from '../utils/TrustworthyLock.js';
import { OmniUUIDGenerator, OmniEntityPrefix } from '../utils/OmniUUIDGenerator.js';
import { EvidenceVault } from './EvidenceVault.js';
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.js';

/**
 * Omni-Component Core: Digital Trust Protocol Service (TrustProtocolService)
 * --------------------------------------------------
 * [Protocol] 4+1 (5T Sentinel Protocol)
 *
 * Core Responsibilities:
 * 1. 🟢 Traceable: Coordinate data lineage
 * 2. 🔵 Trackable: Maintain audit tracking paths
 * 3. 🟠 Transparent: Drive AI/algorithm logic validation
 * 4. 🟣 Tangible: Generate perceived evidence manifest
 * 5. 🔴 Trustworthy: Encapsulate immutable evidence
 */

export class TrustProtocolService {
  private static instance: TrustProtocolService;

  private constructor() { }

  public static getInstance(): TrustProtocolService {
    if (!TrustProtocolService.instance) {
      TrustProtocolService.instance = new TrustProtocolService();
    }
    return TrustProtocolService.instance;
  }

  /**
   * Data Ingestion (Ingest) - Traceable
   */
  async ingestDataPoint(
    indicatorId: string,
    value: number,
    unit: string,
    evidenceFile: { content: unknown; name: string; mime: string },
    sourceOrigin: string
  ): Promise<ESGDataPoint> {
    // 1. Deposit into evidence vault and get Metadata
    const evidence = await EvidenceVault.deposit(
      evidenceFile.content,
      evidenceFile.name,
      evidenceFile.mime
    );

    // 2. Initialize data point
    const dataPoint: ESGDataPoint = {
      uuid: OmniUUIDGenerator.generate(OmniEntityPrefix.DATAPOINT),
      indicatorId,
      value,
      unit,
      version: '1.0.0-draft',
      sourceOrigin,
      evidenceLinks: [evidence.id],
      currentStatus: {
        traceable: 'success',
        trackable: 'pending',
        transparent: 'pending',
        tangible: 'pending',
        trustworthy: 'pending',
      },
    };

    return dataPoint;
  }

  /**
   * Data Audit (Audit) - Calculable
   * Simulate interface with Auditor Agent for logic verification
   */
  async auditDataPoint(dataPoint: ESGDataPoint, expectedFormula: string): Promise<ESGDataPoint> {
    omniLogger.info(LogCategory.SEC, `Audit performing formula validation for ${dataPoint.uuid}`, {
      expectedFormula,
    });

    // Simulate AI verification result
    const isTransparent = true; // Assume verification success

    const updated: ESGDataPoint = {
      ...dataPoint,
      currentStatus: {
        ...dataPoint.currentStatus,
        transparent: isTransparent ? 'success' : 'error',
      },
    };

    return updated;
  }

  /**
   * Data Sealing (Seal) - Immutable & Trackable
   */
  async sealAndChain(
    dataPoint: ESGDataPoint,
    parentHash: string | null
  ): Promise<ChainedDataBlock> {
    if (
      dataPoint.currentStatus.traceable !== 'success' ||
      dataPoint.currentStatus.transparent !== 'success'
    ) {
      throw new Error(
        `[Security] Data point ${dataPoint.uuid} does not meet trust threshold (Traceable/Transparent), cannot seal`
      );
    }

    // 2. Initialize data point, enable Tangible and Trustworthy locking
    const readyToSeal = {
      ...dataPoint,
      version: dataPoint.version.replace('-draft', ''),
      currentStatus: {
        ...dataPoint.currentStatus,
        trackable: 'success',
        tangible: 'success',
        trustworthy: 'active',
      },
    };

    // 2. Seal data point and generate blockchain hash
    const sealed = await TrustworthyLock.seal(
      readyToSeal,
      dataPoint.evidenceLinks[0],
      parentHash || undefined
    );

    omniLogger.info(LogCategory.SEC, `Data point sealed`, {
      uuid: dataPoint.uuid,
      hash: sealed.hash_lock,
    });

    return {
      ...sealed,
      parentHash,
    } as ChainedDataBlock;
  }

  /**
   * Generic Data Sealing (Generic Seal)
   * Used for non-DataPoint objects (e.g., config files, research reports) for immutable protection
   */
  async sealGeneric<T>(
    data: T,
    evidenceLink?: string
  ): Promise<{ data: Readonly<T>; hash: string; sealedAt: string }> {
    const sealed = await TrustworthyLock.seal(data, evidenceLink);
    return {
      data: sealed.data,
      hash: sealed.hash_lock,
      sealedAt: sealed.sealed_at,
    };
  }

  /**
   * Destroy TrustProtocolService instance
   */
  public static destroy(): void {
    TrustProtocolService.instance = undefined as unknown as TrustProtocolService;
    omniLogger.info(LogCategory.SYSTEM, 'TrustProtocolService destroyed');
  }
}

export const trustProtocolService = TrustProtocolService.getInstance();
