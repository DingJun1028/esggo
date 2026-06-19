/**
 * KeyRotationService.ts
 *
 * 🔑 Key Rotation Service
 * -----------------------------------------
 * [功能] 模擬後量子加密金鑰輪換策略
 *
 * 核心職責:
 * 1. 金鑰生命週期管理
 * 2. 自動輪換策略
 * 3. 5T Protocol 合規記錄
 */

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { TrustworthyLock } from '@/utils/TrustworthyLock';
import { EventEmitter } from '@/utils/EventEmitter';
import { v4 as uuidv4 } from 'uuid';

/**
 * 金鑰類型
 */
export type KeyType = 'signing' | 'encryption' | 'quantum-resistant';

/**
 * 金鑰狀態
 */
export type KeyStatus = 'active' | 'rotating' | 'deprecated' | 'revoked';

/**
 * 金鑰資訊
 */
export interface KeyInfo {
  keyId: string; // [Traceable 可溯源] 金鑰唯一識別碼
  keyType: KeyType; // 金鑰類型
  algorithm: string; // 演算法 (e.g., 'CRYSTALS-Kyber-1024')
  publicKey: string; // 公鑰 (hex)
  status: KeyStatus; // 金鑰狀態
  createdAt: number; // [Trackable 可追蹤] 創建時間
  expiresAt: number; // 過期時間
  lastUsedAt: number; // 最後使用時間
  usageCount: number; // 使用次數
  rotationCount: number; // 輪換次數
  predecessorKeyId?: string; // 前任金鑰 ID
  evidenceHash: string; // [Trustworthy 不可篡改] 證據雜湊
}

/**
 * 輪換策略
 */
export interface RotationPolicy {
  policyId: string;
  name: string;
  maxKeyAge: number; // 最大金鑰年齡 (毫秒)
  maxUsageCount: number; // 最大使用次數
  autoRotate: boolean; // 是否自動輪換
  algorithm: string; // 演算法
  keySize: number; // 金鑰大小 (bits)
}

/**
 * 輪換記錄
 */
export interface RotationRecord {
  recordId: string;
  oldKeyId: string;
  newKeyId: string;
  rotatedAt: number;
  reason: 'scheduled' | 'usage-exceeded' | 'manual' | 'security-alert';
  evidenceHash: string;
}

/**
 * Key Rotation Service
 * 管理金鑰輪換策略
 */
export class KeyRotationService {
  private keys: Map<string, KeyInfo> = new Map();
  private activeKeys: Map<KeyType, string> = new Map(); // keyType -> keyId
  private rotationHistory: RotationRecord[] = [];
  private policies: Map<string, RotationPolicy> = new Map();
  private events: EventEmitter = new EventEmitter();
  private rotationInterval?: NodeJS.Timeout;

  constructor() {
    this.initializePolicies();
    this.generateInitialKeys();
  }

  /**
   * 初始化輪換策略
   */
  private initializePolicies(): void {
    const defaultPolicies: RotationPolicy[] = [
      {
        policyId: 'policy-signing-default',
        name: 'Signing Key Policy',
        maxKeyAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        maxUsageCount: 10000,
        autoRotate: true,
        algorithm: 'CRYSTALS-Dilithium-5',
        keySize: 256,
      },
      {
        policyId: 'policy-encryption-default',
        name: 'Encryption Key Policy',
        maxKeyAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        maxUsageCount: 100000,
        autoRotate: true,
        algorithm: 'CRYSTALS-Kyber-1024',
        keySize: 256,
      },
      {
        policyId: 'policy-quantum-default',
        name: 'Quantum-Resistant Key Policy',
        maxKeyAge: 90 * 24 * 60 * 60 * 1000, // 90 days
        maxUsageCount: 1000000,
        autoRotate: true,
        algorithm: 'SPHINCS+-SHA2-256s',
        keySize: 512,
      },
    ];

    defaultPolicies.forEach(policy => {
      this.policies.set(policy.policyId, policy);
    });

    omniLogger.info(
      LogCategory.SECURITY,
      `[KeyRotation] Initialized ${defaultPolicies.length} rotation policies`
    );
  }

  /**
   * 生成初始金鑰
   */
  private generateInitialKeys(): void {
    const keyTypes: KeyType[] = ['signing', 'encryption', 'quantum-resistant'];

    keyTypes.forEach(keyType => {
      const key = this.generateKey(keyType);
      this.keys.set(key.keyId, key);
      this.activeKeys.set(keyType, key.keyId);
    });

    omniLogger.info(
      LogCategory.SECURITY,
      `[KeyRotation] Generated ${keyTypes.length} initial keys`
    );
  }

  /**
   * 生成新金鑰
   */
  private generateKey(keyType: KeyType, predecessorKeyId?: string): KeyInfo {
    const policy =
      Array.from(this.policies.values()).find(p =>
        p.policyId.includes(keyType === 'quantum-resistant' ? 'quantum' : keyType)
      ) || this.policies.get('policy-encryption-default')!;

    const keyId = uuidv4();
    const now = Date.now();

    // 模擬生成公鑰 (實際應使用 PQC 演算法)
    const mockPublicKey = TrustworthyLock.generateHashSync(`${keyId}-${now}-${Math.random()}`);

    const keyInfo: KeyInfo = {
      keyId,
      keyType,
      algorithm: policy.algorithm,
      publicKey: mockPublicKey,
      status: 'active',
      createdAt: now,
      expiresAt: now + policy.maxKeyAge,
      lastUsedAt: now,
      usageCount: 0,
      rotationCount: 0,
      predecessorKeyId,
      evidenceHash: '',
    };

    // 計算證據雜湊
    keyInfo.evidenceHash = TrustworthyLock.generateHashSync(
      JSON.stringify({
        keyId: keyInfo.keyId,
        keyType: keyInfo.keyType,
        algorithm: keyInfo.algorithm,
        createdAt: keyInfo.createdAt,
      })
    );

    return keyInfo;
  }

  /**
   * 執行金鑰輪換
   */
  public async rotateKey(
    keyType: KeyType,
    reason: RotationRecord['reason'] = 'scheduled'
  ): Promise<RotationRecord | null> {
    const currentKeyId = this.activeKeys.get(keyType);
    if (!currentKeyId) {
      omniLogger.error(
        LogCategory.SECURITY,
        `[KeyRotation] No active key found for type: ${keyType}`
      );
      return null;
    }

    const currentKey = this.keys.get(currentKeyId);
    if (!currentKey) {
      return null;
    }

    omniLogger.info(
      LogCategory.SECURITY,
      `[KeyRotation] Starting rotation for ${keyType} key ${currentKeyId.substring(0, 8)}...`
    );

    // 標記當前金鑰為輪換中
    currentKey.status = 'rotating';

    // 生成新金鑰
    const newKey = this.generateKey(keyType, currentKeyId);
    newKey.rotationCount = currentKey.rotationCount + 1;

    // 創建輪換記錄
    const record: RotationRecord = {
      recordId: uuidv4(),
      oldKeyId: currentKeyId,
      newKeyId: newKey.keyId,
      rotatedAt: Date.now(),
      reason,
      evidenceHash: '',
    };

    record.evidenceHash = TrustworthyLock.generateHashSync(JSON.stringify(record));

    // 更新狀態
    currentKey.status = 'deprecated';
    newKey.status = 'active';

    // 儲存新金鑰
    this.keys.set(newKey.keyId, newKey);
    this.activeKeys.set(keyType, newKey.keyId);
    this.rotationHistory.push(record);

    omniLogger.info(
      LogCategory.SECURITY,
      `[KeyRotation] Rotation complete: ${currentKeyId.substring(0, 8)} -> ${newKey.keyId.substring(0, 8)}`
    );

    // 觸發事件
    this.events.emit('keyRotated', { oldKey: currentKey, newKey, record });

    return record;
  }

  /**
   * 記錄金鑰使用
   */
  public recordKeyUsage(keyType: KeyType): void {
    const keyId = this.activeKeys.get(keyType);
    if (!keyId) return;

    const key = this.keys.get(keyId);
    if (key) {
      key.usageCount++;
      key.lastUsedAt = Date.now();

      // 檢查是否需要輪換
      this.checkRotationNeeded(keyType);
    }
  }

  /**
   * 檢查是否需要輪換
   */
  private checkRotationNeeded(keyType: KeyType): void {
    const keyId = this.activeKeys.get(keyType);
    if (!keyId) return;

    const key = this.keys.get(keyId);
    if (!key) return;

    const policy = Array.from(this.policies.values()).find(p =>
      p.policyId.includes(keyType === 'quantum-resistant' ? 'quantum' : keyType)
    );

    if (!policy || !policy.autoRotate) return;

    const now = Date.now();
    const isExpired = now >= key.expiresAt;
    const usageExceeded = key.usageCount >= policy.maxUsageCount;

    if (isExpired || usageExceeded) {
      const reason = isExpired ? 'scheduled' : 'usage-exceeded';
      omniLogger.info(
        LogCategory.SECURITY,
        `[KeyRotation] Auto-rotation triggered for ${keyType}: ${reason}`
      );
      this.rotateKey(keyType, reason);
    }
  }

  /**
   * 啟動自動輪換檢查
   */
  public startAutoRotation(intervalMs: number = 60000): void {
    this.rotationInterval = setInterval(() => {
      const keyTypes: KeyType[] = ['signing', 'encryption', 'quantum-resistant'];
      keyTypes.forEach(keyType => this.checkRotationNeeded(keyType));
    }, intervalMs);

    omniLogger.info(
      LogCategory.SECURITY,
      `[KeyRotation] Auto-rotation started with interval ${intervalMs}ms`
    );
  }

  /**
   * 停止自動輪換
   */
  public stopAutoRotation(): void {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
      this.rotationInterval = undefined;
      omniLogger.info(LogCategory.SECURITY, '[KeyRotation] Auto-rotation stopped');
    }
  }

  /**
   * 獲取當前活躍金鑰
   */
  public getActiveKey(keyType: KeyType): KeyInfo | null {
    const keyId = this.activeKeys.get(keyType);
    return keyId ? this.keys.get(keyId) || null : null;
  }

  /**
   * 獲取所有金鑰
   */
  public getAllKeys(): KeyInfo[] {
    return Array.from(this.keys.values());
  }

  /**
   * 獲取輪換歷史
   */
  public getRotationHistory(): RotationRecord[] {
    return [...this.rotationHistory];
  }

  /**
   * 獲取金鑰狀態摘要
   */
  public getKeyStatusSummary(): {
    totalKeys: number;
    activeKeys: number;
    deprecatedKeys: number;
    totalRotations: number;
  } {
    const allKeys = Array.from(this.keys.values());
    return {
      totalKeys: allKeys.length,
      activeKeys: allKeys.filter(k => k.status === 'active').length,
      deprecatedKeys: allKeys.filter(k => k.status === 'deprecated').length,
      totalRotations: this.rotationHistory.length,
    };
  }

  /**
   * 撤銷金鑰
   */
  public revokeKey(keyId: string): boolean {
    const key = this.keys.get(keyId);
    if (!key) return false;

    key.status = 'revoked';
    omniLogger.warn(
      LogCategory.SECURITY,
      `[KeyRotation] Key ${keyId.substring(0, 8)}... has been revoked`
    );
    this.events.emit('keyRevoked', key);

    return true;
  }

  /**
   * 事件監聽
   */
  public onKeyRotated(
    callback: (data: { oldKey: KeyInfo; newKey: KeyInfo; record: RotationRecord }) => void
  ): void {
    this.events.on('keyRotated', callback);
  }

  public onKeyRevoked(callback: (key: KeyInfo) => void): void {
    this.events.on('keyRevoked', callback);
  }
}

// 單例實例
export const keyRotationService = new KeyRotationService();
