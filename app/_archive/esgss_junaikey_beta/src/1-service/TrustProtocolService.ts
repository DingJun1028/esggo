import type { ESGDataPoint, ChainedDataBlock } from '@/types/omni-report.types';
import { TrustworthyLock } from '../utils/TrustworthyLock';
import { OmniUUIDGenerator, OmniEntityPrefix } from '../utils/OmniUUIDGenerator';
import { EvidenceVault } from './EvidenceVault';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';

/**
 * 奧秘組件心核：數位信託協議服務 (TrustProtocolService)
 * --------------------------------------------------
 * [協議] 4+1 (5T Sentinel Protocol)
 *
 * 主要職責 (Responsibilities):
 * 1. 🟢 Traceable: 協調整合數據溯源 (Coordinate lineage)
 * 2. 🔵 Trackable: 維護稽核追蹤路徑 (Maintain audit paths)
 * 3. 🟠 Transparent: 驅動 AI/算法邏輯驗證 (Drive Transparent logic validation)
 * 4. 🟣 Tangible: 生成感知化證據清單 (Generate Tangible evidence manifest)
 * 5. 🔴 Trustworthy: 封裝不可篡改證跡 (Encapsulate Trustworthy/Tamper-proof evidence)
 */

export class TrustProtocolService {
  private static instance: TrustProtocolService;

  private constructor() {}

  public static getInstance(): TrustProtocolService {
    if (!TrustProtocolService.instance) {
      TrustProtocolService.instance = new TrustProtocolService();
    }
    return TrustProtocolService.instance;
  }

  /**
   * 數據接入 (Ingest) - 可溯源 (Traceable)
   */
  async ingestDataPoint(
    indicatorId: string,
    value: number,
    unit: string,
    evidenceFile: { content: unknown; name: string; mime: string },
    sourceOrigin: string
  ): Promise<ESGDataPoint> {
    // 1. 存入證據庫並獲取 Metadata
    const evidence = await EvidenceVault.deposit(
      evidenceFile.content,
      evidenceFile.name,
      evidenceFile.mime
    );

    // 2. 初始化數據點
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
   * 數據稽核 (Audit) - 可計算性 (Calculable)
   * 模擬對接 Auditor Agent 進行邏輯校驗
   */
  async auditDataPoint(dataPoint: ESGDataPoint, expectedFormula: string): Promise<ESGDataPoint> {
    omniLogger.info(LogCategory.SEC, `Audit performing formula validation for ${dataPoint.uuid}`, {
      expectedFormula,
    });

    // 模擬 AI 驗證結果
    const isTransparent = true; // 假設驗核成功

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
   * 數據封裝 (Seal) - 不可篡改 & 可追蹤 (Immutable & Trackable)
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
        `[Security] 數據點 ${dataPoint.uuid} 未達信託門檻 (Traceable/Transparent)，無法存證`
      );
    }

    // 2. 初始化數據點，啟用感知化 (Tangible) 與 信實鎖定 (Trustworthy)
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

    // 2. 封裝數據點並生成區塊鏈湊雜
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
   * 萬用數據封裝 (Generic Seal)
   * 用於非 DataPoint 物件（如配置檔、研究報告）的不可篡改保護
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
   * 銷毀 TrustProtocolService 實例
   */
  public static destroy(): void {
    TrustProtocolService.instance = undefined as unknown as TrustProtocolService;
    omniLogger.info(LogCategory.SYSTEM, 'TrustProtocolService destroyed');
  }
}

export const trustProtocolService = TrustProtocolService.getInstance();
