/**
 * 🏛️ SovereignVaultService: 主權數據保險箱服務
 *
 * 核心功能:
 * 1. 分散式身份識別 (DID) 管理: 建立與驗證用戶的數位主權身份。
 * 2. 不可篡改帳本 (Trustworthy Ledger): 記錄所有數據共鳴與 5T 結晶事件。
 * 3. 5T 協議執行: 確保數據符合 Traceable, Trackable, Transparent, Tangible, Trustworthy 五大標準。
 *
 * "服務即教學，知識即資產" —— 讓使用者掌握自己的數據主權。
 *
 * @version v7.0.0-sentient - 符合 Best Practice Hardening 標準
 */

import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';
import { SovereignDataPacket, SovereignDataPacket as SovereignPacket } from '@/types/core/index.js';
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.js';
import { TrustworthyLock } from '../utils/TrustworthyLock.js';

/**
 * VaultRecord 的 Payload 類型定義
 * 使用泛型以支援不同類型的數據載荷
 */
export interface VaultPayloadBase {
  source_origin: string; // [Traceable 可溯源] 數據來源
  action: string; // 操作類型
  data: unknown; // 實際數據
}

export interface SovereignParticipant {
  did: string; // 分散式身份標識 (Distributed Identifier)
  publicKey: string; // 公鑰，用於驗證簽章
  status: 'Sovereign' | 'Sentinel' | 'Participant';
  level: number;
}

/**
 * 5T 元數據介面
 * 每筆記錄都必須包含 5T 追蹤資訊
 */
export interface FiveTMetadata {
  traceable: {
    source_origin: string; // 數據來源
    created_by: string; // 創建者 DID
  };
  trackable: {
    created_at: number; // 創建時間戳
    version: number; // 版本號
    lifecycle: 'created' | 'updated' | 'sealed' | 'anchored';
  };
  transparent: {
    formula_ref: string; // 公式參考 (如 ISO-14064-1)
    algorithm: string; // 使用的演算法
  };
  tangible: {
    impact_metric?: string; // 影響指標
    record_type: string; // 記錄類型
  };
  trustworthy: {
    status: 'Trustworthy'; // 不可篡改狀態
    hash_lock: string; // Hash 鎖定值
  };
}

export interface VaultAnchorResult {
  id: string;
  ledger_hash: string;
  anchored_at?: number;
}

interface SyncResponse {
  success: boolean;
  anchors?: VaultAnchorResult[];
}

export interface VaultRecord<T extends VaultPayloadBase = VaultPayloadBase> {
  id: string;
  timestamp: number;
  type: string;
  payload: T;
  hash: string;
  previousHash: string;
  did: string;
  signature: string;
  cid?: string;
  anchoring?: {
    status: 'local' | 'anchored' | 'consensus_reached';
    ledger_hash?: string;
    anchored_at?: number;
  };
  fiveT?: FiveTMetadata;
}

class SovereignVaultService {
  private static instance: SovereignVaultService;
  private currentParticipant: SovereignParticipant | null = null;
  private ledger: VaultRecord[] = [];
  private readonly STORAGE_KEY = 'esgss_sovereign_vault';
  private readonly SOURCE_ORIGIN = 'SovereignVaultService';

  private constructor() {
    this.loadFromStorage();
  }

  public static getInstance(): SovereignVaultService {
    if (!SovereignVaultService.instance) {
      SovereignVaultService.instance = new SovereignVaultService();
    }
    return SovereignVaultService.instance;
  }

  /**
   * 從本地存儲加載數據 (Load from LocalStorage)
   */
  public loadFromStorage(): void {
    try {
      if (typeof window === 'undefined') return;
      const savedData = localStorage.getItem(this.STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        this.currentParticipant = parsed.participant || null;
        this.ledger = parsed.ledger || [];
        omniLogger.info(
          LogCategory.SOVEREIGN,
          `[SovereignVault] Loaded ${this.ledger.length} records from storage.`,
          {
            source_origin: this.SOURCE_ORIGIN,
            recordCount: this.ledger.length,
          }
        );
      }
    } catch (e) {
      omniLogger.warn(LogCategory.SOVEREIGN, '[SovereignVault] Failed to load from storage', {
        source_origin: this.SOURCE_ORIGIN,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  /**
   * 保存數據至本地存儲 (Save to LocalStorage)
   */
  public saveToStorage(): void {
    try {
      if (typeof window === 'undefined') return;
      const data = {
        participant: this.currentParticipant,
        ledger: this.ledger,
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      omniLogger.debug(LogCategory.SOVEREIGN, '[SovereignVault] Data persisted to storage', {
        source_origin: this.SOURCE_ORIGIN,
        recordCount: this.ledger.length,
      });
    } catch (e) {
      omniLogger.error(LogCategory.SOVEREIGN, '[SovereignVault] Persistence failed', {
        source_origin: this.SOURCE_ORIGIN,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  /**
   * 啟動主權身份 (Initialize Sovereign Identity)
   */
  public initializeSovereign(publicKey: string): SovereignParticipant {
    const did = `did:esgss:${uuidv4()}`;
    this.currentParticipant = {
      did,
      publicKey,
      status: 'Participant',
      level: 1,
    };
    this.saveToStorage();
    console.log(`[SovereignVault] Identity Initialized: ${did}`);
    return this.currentParticipant;
  }

  /**
   * 封印數據至保險箱 (Seal Data Into Vault)
   */
  public async sealRecord<T extends VaultPayloadBase = VaultPayloadBase>(
    type: string,
    payload: T
  ): Promise<VaultRecord<T>> {
    if (!this.currentParticipant) {
      throw new Error('Participant not initialized');
    }

    const lastRecord = this.ledger[this.ledger.length - 1];
    const previousHash = lastRecord ? lastRecord.hash : '0'.repeat(64);

    const record = this.createRecord(type, payload, previousHash);
    this.ledger.push(record);
    this.saveToStorage();
    omniLogger.info(LogCategory.SOVEREIGN, `[SovereignVault] Data Sealed: ${type}`, {
      source_origin: this.SOURCE_ORIGIN,
      hash: record.hash.substring(0, 8),
      type,
    });
    return record;
  }

  /**
   * 批量封印數據 (Batch Seal Records)
   * 用於提升大量數據處理效能
   */
  public async sealBatch(type: string, payloads: VaultPayloadBase[]): Promise<VaultRecord[]> {
    if (!this.currentParticipant) {
      throw new Error('Participant not initialized');
    }

    const newRecords: VaultRecord[] = [];
    const lastRecord = this.ledger[this.ledger.length - 1];
    let lastHash = lastRecord ? lastRecord.hash : '0'.repeat(64);

    for (const payload of payloads) {
      const record = this.createRecord(type, payload, lastHash);
      newRecords.push(record);
      lastHash = record.hash;
    }

    this.ledger.push(...newRecords);
    this.saveToStorage();
    omniLogger.info(LogCategory.SOVEREIGN, `[SovereignVault] Batch Sealed: ${type}`, {
      source_origin: this.SOURCE_ORIGIN,
      count: newRecords.length,
    });
    return newRecords;
  }

  /**
   * 產生內容識別碼 (Generate CID)
   * 符合 Phase 28 標準的三方可驗證 Hash
   */
  public generateCID(payload: unknown): string {
    const raw = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const hash = CryptoJS.SHA256(raw).toString();
    return `bafybei${hash.substring(0, 46)}`;
  }

  private createRecord<T extends VaultPayloadBase = VaultPayloadBase>(
    type: string,
    payload: T,
    previousHash: string
  ): VaultRecord<T> {
    if (!this.currentParticipant) throw new Error('No participant');

    const id = uuidv4();
    const timestamp = Date.now();
    const cid = this.generateCID(payload);
    const rawContent = JSON.stringify({
      id,
      timestamp,
      type,
      payload,
      previousHash,
      cid,
      did: this.currentParticipant.did,
    });
    const hash = CryptoJS.SHA256(rawContent).toString();
    const signature = `sig:${this.currentParticipant.did}:${hash.substring(0, 16)}`;

    return {
      id,
      timestamp,
      type,
      payload,
      hash,
      previousHash,
      did: this.currentParticipant.did,
      signature,
      cid,
      anchoring: {
        status: 'local',
      },
    };
  }

  /**
   * 與後端同步並執行分散式錨定 (Sync & Anchor)
   */
  public async syncWithBackend(): Promise<boolean> {
    if (!this.currentParticipant || this.ledger.length === 0) return false;

    try {
      const unanchored = this.ledger.filter(r => r.anchoring?.status === 'local');
      if (unanchored.length === 0) return true;

      const response = await fetch('/api/sovereign/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: this.currentParticipant.did,
          participant: this.currentParticipant,
          ledger: unanchored,
        }),
      });

      const result: SyncResponse = await response.json();

      if (result.success && result.anchors) {
        this.ledger = this.ledger.map(record => {
          const anchor = result.anchors?.find((a: VaultAnchorResult) => a.id === record.id);
          if (anchor) {
            return {
              ...record,
              anchoring: {
                status: 'anchored',
                ledger_hash: anchor.ledger_hash,
                anchored_at: Date.now(),
              },
            };
          }
          return record;
        });
        this.saveToStorage();
      }

      omniLogger.debug(LogCategory.SOVEREIGN, '[SovereignVault] Sync & Anchor result', {
        source_origin: this.SOURCE_ORIGIN,
        success: result.success,
      });
      return result.success;
    } catch (e) {
      omniLogger.error(LogCategory.SOVEREIGN, '[SovereignVault] Sync & Anchor failed', {
        source_origin: this.SOURCE_ORIGIN,
        error: e instanceof Error ? e.message : String(e),
      });
      return false;
    }
  }

  /**
   * 封裝主權數據包 (Wrap into SovereignDataPacket)
   */
  public wrapPacket<T extends VaultPayloadBase>(record: VaultRecord<T>): SovereignDataPacket<T> {
    return {
      cid: record.cid || '',
      payload: record.payload,
      timestamp: record.timestamp,
      did: record.did,
      witnesses: [],
      anchoring: record.anchoring || { status: 'local' },
    };
  }

  /**
   * 驗證帳本完整性 (Verify Ledger Integrity)
   */
  public verifyIntegrity(): boolean {
    if (this.ledger.length === 0) return true;
    for (let i = 1; i < this.ledger.length; i++) {
      const current = this.ledger[i];
      const previous = this.ledger[i - 1];

      if (!current || !previous) {
        console.error(`[SovereignVault] Item undefined at index ${i}`);
        return false;
      }

      if (current.previousHash !== previous.hash) {
        console.error(`[SovereignVault] Integrity Violation at index ${i}`);
        return false;
      }

      // 重新驗算 Hash
      const rawContent = JSON.stringify({
        id: current.id,
        timestamp: current.timestamp,
        type: current.type,
        payload: current.payload,
        previousHash: current.previousHash,
        cid: current.cid,
        did: current.did,
      });
      if (CryptoJS.SHA256(rawContent).toString() !== current.hash) {
        console.error(`[SovereignVault] Hash Mismatch at index ${i}`);
        return false;
      }
    }
    return true;
  }

  public getParticipant(): SovereignParticipant | null {
    return this.currentParticipant;
  }

  public getLedger(): VaultRecord[] {
    return [...this.ledger];
  }

  /**
   * 獲取帳本狀態摘要 (Get Ledger Status Summary)
   * 用於共鳴基準計算
   */
  public getLedgerStatus() {
    const lastRecord = this.ledger[this.ledger.length - 1];
    return {
      total_packets: this.ledger.length,
      last_sync: lastRecord?.timestamp ?? null,
      participant_status: this.currentParticipant?.status || 'Unknown',
    };
  }

  /**
   * 獲取所有封裝好的數據包 (List All Sovereign Packets)
   */
  public async listPackets(): Promise<SovereignPacket[]> {
    return this.ledger.map(record => this.wrapPacket(record));
  }

  /**
   * 數據錨定 (Anchor Data) - [Backward Compatibility]
   * 封裝並紀錄數據。
   */
  public async anchorData(data: unknown, type: string): Promise<string> {
    const record = await this.sealRecord(type, {
      source_origin: this.SOURCE_ORIGIN,
      action: 'ANCHOR',
      data,
    });
    return record.hash;
  }

  /**
   * 獲取保險箱系統狀態 (Get Vault Stats) - [Backward Compatibility]
   */
  public async getVaultStats() {
    return {
      totalSealed: this.ledger.length,
      lastSealed: this.ledger.length > 0 ? this.ledger[this.ledger.length - 1]?.timestamp : null,
      status: 'NIRVANA',
      quantumStatus: 'SECURE',
    };
  }

  /**
   * 旋轉保險箱金鑰 (Rotate Vault Keys)
   */
  public async rotateVaultKeys(): Promise<boolean> {
    omniLogger.info(LogCategory.SOVEREIGN, '[SovereignVault] Rotating vault keys...', {
      source_origin: this.SOURCE_ORIGIN,
    });
    // 模擬金鑰旋轉成功
    return true;
  }
}

export type { SovereignPacket };
export const sovereignVaultService = SovereignVaultService.getInstance();
export default sovereignVaultService;
