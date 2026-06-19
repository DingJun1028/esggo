// 數據加密與安全儲存服務 - M8安全治理模組
import { DataOperationResult } from './dataManager';

// 加密演算法類型
export enum EncryptionAlgorithm {
  AES_256_GCM = 'AES-256-GCM',
  AES_256_CBC = 'AES-256-CBC',
  CHACHA20_POLY1305 = 'ChaCha20-Poly1305',
  RSA_OAEP = 'RSA-OAEP-256'
}

// 密鑰類型
export enum KeyType {
  SYMMETRIC = 'symmetric',
  ASYMMETRIC = 'asymmetric',
  HMAC = 'hmac'
}

// 數據敏感度等級
export enum DataSensitivityLevel {
  PUBLIC = 'public',         // 公開數據
  INTERNAL = 'internal',     // 內部數據
  CONFIDENTIAL = 'confidential', // 機密數據
  RESTRICTED = 'restricted', // 受限數據
  CLASSIFIED = 'classified'  // 機密數據
}

// 密鑰信息
export interface KeyInfo {
  id: string;
  type: KeyType;
  algorithm: EncryptionAlgorithm;
  createdAt: number;
  expiresAt?: number;
  isActive: boolean;
  usageCount: number;
  lastUsed?: number;
  metadata: {
    purpose: string;
    owner: string;
    sensitivity: DataSensitivityLevel;
    rotationSchedule?: number; // 輪換間隔（天）
  };
}

// 加密數據
export interface EncryptedData {
  data: string; // Base64編碼的加密數據
  keyId: string;
  algorithm: EncryptionAlgorithm;
  iv?: string; // 初始化向量（Base64編碼）
  tag?: string; // 認證標籤（Base64編碼）
  timestamp: number;
}

// 安全儲存項目
export interface SecureStorageItem {
  id: string;
  key: string;
  encryptedData: EncryptedData;
  sensitivity: DataSensitivityLevel;
  accessControl: {
    readUsers: string[];
    writeUsers: string[];
    readRoles: string[];
    writeRoles: string[];
  };
  auditTrail: AuditEntry[];
  metadata: {
    createdAt: number;
    updatedAt: number;
    createdBy: string;
    expiresAt?: number;
    tags: string[];
  };
}

// 審計條目
export interface AuditEntry {
  id: string;
  timestamp: number;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'ACCESS_DENIED';
  userId: string;
  userRole: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  details?: Record<string, any>;
}

// 安全配置
export interface SecurityConfig {
  encryption: {
    defaultAlgorithm: EncryptionAlgorithm;
    keyRotationDays: number;
    saltRounds: number;
  };
  storage: {
    maxItemSize: number; // 最大項目大小（字節）
    retentionPolicy: {
      [DataSensitivityLevel.PUBLIC]: number;
      [DataSensitivityLevel.INTERNAL]: number;
      [DataSensitivityLevel.CONFIDENTIAL]: number;
      [DataSensitivityLevel.RESTRICTED]: number;
      [DataSensitivityLevel.CLASSIFIED]: number;
    }; // 保留天數
  };
  audit: {
    enabled: boolean;
    retentionDays: number;
    logLevel: 'basic' | 'detailed' | 'full';
  };
}

// 安全服務類
export class SecurityService {
  private static instance: SecurityService;
  private config: SecurityConfig;
  private keys: Map<string, KeyInfo> = new Map();
  private secureStorage: Map<string, SecureStorageItem> = new Map();
  private subscribers: Map<string, ((event: string, data?: any) => void)[]> = new Map();

  private constructor() {
    this.config = this.getDefaultConfig();
    this.initializeKeys();
  }

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  // 加密數據
  async encryptData(
    data: string,
    sensitivity: DataSensitivityLevel = DataSensitivityLevel.INTERNAL,
    keyId?: string
  ): Promise<DataOperationResult<EncryptedData>> {
    const startTime = Date.now();

    try {
      // 選擇合適的密鑰
      const selectedKeyId = keyId || this.selectKeyForSensitivity(sensitivity);
      if (!selectedKeyId) {
        return {
          success: false,
          error: '找不到適合的加密密鑰',
          metadata: {
            operation: 'encrypt_data',
            timestamp: startTime,
            duration: Date.now() - startTime
          }
        };
      }

      const keyInfo = this.keys.get(selectedKeyId);
      if (!keyInfo || !keyInfo.isActive) {
        return {
          success: false,
          error: '密鑰不可用',
          metadata: {
            operation: 'encrypt_data',
            timestamp: startTime,
            duration: Date.now() - startTime
          }
        };
      }

      // 生成加密參數
      const iv = crypto.getRandomValues(new Uint8Array(16));
      const key = await this.deriveKey(selectedKeyId);

      // 加密數據
      const encrypted = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        new TextEncoder().encode(data)
      );

      // 創建加密數據對象
      const encryptedData: EncryptedData = {
        data: this.arrayBufferToBase64(encrypted),
        keyId: selectedKeyId,
        algorithm: keyInfo.algorithm,
        iv: this.arrayBufferToBase64(iv),
        timestamp: Date.now()
      };

      // 更新密鑰使用統計
      keyInfo.usageCount++;
      keyInfo.lastUsed = Date.now();

      this.notifySubscribers('data_encrypted', {
        keyId: selectedKeyId,
        sensitivity,
        timestamp: encryptedData.timestamp
      });

      return {
        success: true,
        data: encryptedData,
        metadata: {
          operation: 'encrypt_data',
          timestamp: startTime,
          duration: Date.now() - startTime,
          keyId: selectedKeyId,
          algorithm: keyInfo.algorithm
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '加密失敗',
        metadata: {
          operation: 'encrypt_data',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    }
  }

  // 解密數據
  async decryptData(
    encryptedData: EncryptedData,
    userId?: string
  ): Promise<DataOperationResult<string>> {
    const startTime = Date.now();

    try {
      const keyInfo = this.keys.get(encryptedData.keyId);
      if (!keyInfo || !keyInfo.isActive) {
        return {
          success: false,
          error: '密鑰不可用',
          metadata: {
            operation: 'decrypt_data',
            timestamp: startTime,
            duration: Date.now() - startTime
          }
        };
      }

      // 檢查訪問權限
      if (userId) {
        const accessCheck = await this.checkAccessPermission(encryptedData.keyId, userId, 'read');
        if (!accessCheck) {
          this.logAuditEvent('ACCESS_DENIED', userId, encryptedData.keyId, false, {
            reason: 'insufficient_permissions'
          });
          return {
            success: false,
            error: '沒有訪問權限',
            metadata: {
              operation: 'decrypt_data',
              timestamp: startTime,
              duration: Date.now() - startTime
            }
          };
        }
      }

      const key = await this.deriveKey(encryptedData.keyId);
      const iv = this.base64ToArrayBuffer(encryptedData.iv!);
      const encrypted = this.base64ToArrayBuffer(encryptedData.data);

      // 解密數據
      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        encrypted
      );

      const decryptedText = new TextDecoder().decode(decrypted);

      // 更新密鑰使用統計
      keyInfo.usageCount++;
      keyInfo.lastUsed = Date.now();

      // 記錄審計日誌
      if (userId) {
        this.logAuditEvent('READ', userId, encryptedData.keyId, true);
      }

      this.notifySubscribers('data_decrypted', {
        keyId: encryptedData.keyId,
        userId,
        timestamp: Date.now()
      });

      return {
        success: true,
        data: decryptedText,
        metadata: {
          operation: 'decrypt_data',
          timestamp: startTime,
          duration: Date.now() - startTime,
          keyId: encryptedData.keyId
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '解密失敗',
        metadata: {
          operation: 'decrypt_data',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    }
  }

  // 安全儲存數據
  async storeSecureData(
    key: string,
    data: string,
    sensitivity: DataSensitivityLevel = DataSensitivityLevel.INTERNAL,
    accessControl: SecureStorageItem['accessControl'],
    userId: string,
    tags: string[] = []
  ): Promise<DataOperationResult<SecureStorageItem>> {
    const startTime = Date.now();

    try {
      // 加密數據
      const encryptionResult = await this.encryptData(data, sensitivity);
      if (!encryptionResult.success) {
        return {
          success: false,
          error: encryptionResult.error,
          metadata: {
            operation: 'store_secure_data',
            timestamp: startTime,
            duration: Date.now() - startTime
          }
        };
      }

      // 創建安全儲存項目
      const item: SecureStorageItem = {
        id: `secure_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        key,
        encryptedData: encryptionResult.data!,
        sensitivity,
        accessControl,
        auditTrail: [],
        metadata: {
          createdAt: Date.now(),
          updatedAt: Date.now(),
          createdBy: userId,
          tags
        }
      };

      // 檢查項目大小限制
      const itemSize = JSON.stringify(item).length;
      if (itemSize > this.config.storage.maxItemSize) {
        return {
          success: false,
          error: '數據大小超過限制',
          metadata: {
            operation: 'store_secure_data',
            timestamp: startTime,
            duration: Date.now() - startTime,
            itemSize,
            maxSize: this.config.storage.maxItemSize
          }
        };
      }

      this.secureStorage.set(item.id, item);

      // 記錄審計日誌
      this.logAuditEvent('CREATE', userId, item.id, true);

      this.notifySubscribers('data_stored', {
        itemId: item.id,
        key,
        sensitivity,
        userId
      });

      return {
        success: true,
        data: item,
        metadata: {
          operation: 'store_secure_data',
          timestamp: startTime,
          duration: Date.now() - startTime,
          itemId: item.id,
          itemSize
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '安全儲存失敗',
        metadata: {
          operation: 'store_secure_data',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    }
  }

  // 檢索安全數據
  async retrieveSecureData(
    itemId: string,
    userId: string
  ): Promise<DataOperationResult<string>> {
    const startTime = Date.now();

    try {
      const item = this.secureStorage.get(itemId);
      if (!item) {
        this.logAuditEvent('ACCESS_DENIED', userId, itemId, false, {
          reason: 'item_not_found'
        });
        return {
          success: false,
          error: '數據項目不存在',
          metadata: {
            operation: 'retrieve_secure_data',
            timestamp: startTime,
            duration: Date.now() - startTime
          }
        };
      }

      // 檢查訪問權限
      const accessCheck = await this.checkAccessPermission(itemId, userId, 'read');
      if (!accessCheck) {
        this.logAuditEvent('ACCESS_DENIED', userId, itemId, false, {
          reason: 'insufficient_permissions'
        });
        return {
          success: false,
          error: '沒有訪問權限',
          metadata: {
            operation: 'retrieve_secure_data',
            timestamp: startTime,
            duration: Date.now() - startTime
          }
        };
      }

      // 解密數據
      const decryptionResult = await this.decryptData(item.encryptedData, userId);
      if (!decryptionResult.success) {
        this.logAuditEvent('READ', userId, itemId, false);
        return {
          success: false,
          error: decryptionResult.error,
          metadata: {
            operation: 'retrieve_secure_data',
            timestamp: startTime,
            duration: Date.now() - startTime
          }
        };
      }

      // 記錄審計日誌
      this.logAuditEvent('READ', userId, itemId, true);

      // 更新項目元數據
      item.metadata.updatedAt = Date.now();

      this.notifySubscribers('data_retrieved', {
        itemId,
        key: item.key,
        userId,
        sensitivity: item.sensitivity
      });

      return {
        success: true,
        data: decryptionResult.data,
        metadata: {
          operation: 'retrieve_secure_data',
          timestamp: startTime,
          duration: Date.now() - startTime,
          itemId,
          key: item.key,
          sensitivity: item.sensitivity
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '檢索安全數據失敗',
        metadata: {
          operation: 'retrieve_secure_data',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    }
  }

  // 生成新的密鑰
  async generateKey(
    type: KeyType,
    algorithm: EncryptionAlgorithm,
    purpose: string,
    owner: string,
    sensitivity: DataSensitivityLevel,
    expiresInDays?: number
  ): Promise<DataOperationResult<KeyInfo>> {
    const startTime = Date.now();

    try {
      const keyId = `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      let cryptoKey: CryptoKey;

      // 生成密鑰
      if (type === KeyType.SYMMETRIC) {
        cryptoKey = await crypto.subtle.generateKey(
          {
            name: 'AES-GCM',
            length: 256
          },
          true, // 可導出
          ['encrypt', 'decrypt']
        );
      } else {
        // 非對稱密鑰生成（簡化實現）
        cryptoKey = await crypto.subtle.generateKey(
          {
            name: 'RSA-OAEP',
            modulusLength: 2048,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: 'SHA-256'
          },
          true,
          ['encrypt', 'decrypt']
        );
      }

      // 導出密鑰（在實際實現中應該安全儲存）
      const exportedKey = await crypto.subtle.exportKey('raw', cryptoKey);

      // 創建密鑰信息
      const keyInfo: KeyInfo = {
        id: keyId,
        type,
        algorithm,
        createdAt: Date.now(),
        expiresAt: expiresInDays ? Date.now() + (expiresInDays * 24 * 60 * 60 * 1000) : undefined,
        isActive: true,
        usageCount: 0,
        metadata: {
          purpose,
          owner,
          sensitivity,
          rotationSchedule: 90 // 默認90天輪換
        }
      };

      // 儲存密鑰信息（密鑰材料應該安全儲存）
      this.keys.set(keyId, keyInfo);
      this.storeKeyMaterial(keyId, exportedKey);

      this.notifySubscribers('key_generated', {
        keyId,
        type,
        algorithm,
        purpose,
        owner
      });

      return {
        success: true,
        data: keyInfo,
        metadata: {
          operation: 'generate_key',
          timestamp: startTime,
          duration: Date.now() - startTime,
          keyId,
          algorithm
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '密鑰生成失敗',
        metadata: {
          operation: 'generate_key',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    }
  }

  // 輪換密鑰
  async rotateKey(keyId: string, userId: string): Promise<DataOperationResult<KeyInfo>> {
    const startTime = Date.now();

    try {
      const oldKey = this.keys.get(keyId);
      if (!oldKey) {
        return {
          success: false,
          error: '密鑰不存在',
          metadata: {
            operation: 'rotate_key',
            timestamp: startTime,
            duration: Date.now() - startTime
          }
        };
      }

      // 生成新密鑰
      const newKeyResult = await this.generateKey(
        oldKey.type,
        oldKey.algorithm,
        oldKey.metadata.purpose,
        oldKey.metadata.owner,
        oldKey.metadata.sensitivity,
        oldKey.metadata.rotationSchedule ? oldKey.metadata.rotationSchedule / (24 * 60 * 60 * 1000) : undefined
      );

      if (!newKeyResult.success) {
        return newKeyResult;
      }

      // 將舊密鑰標記為非活躍
      oldKey.isActive = false;

      // 重新加密使用舊密鑰的數據（簡化實現）
      // 在實際實現中，需要重新加密所有相關數據

      // 記錄審計日誌
      this.logAuditEvent('UPDATE', userId, keyId, true, {
        action: 'key_rotation',
        oldKeyId: keyId,
        newKeyId: newKeyResult.data!.id
      });

      this.notifySubscribers('key_rotated', {
        oldKeyId: keyId,
        newKeyId: newKeyResult.data!.id,
        userId
      });

      return newKeyResult;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '密鑰輪換失敗',
        metadata: {
          operation: 'rotate_key',
          timestamp: startTime,
          duration: Date.now() - startTime
        }
      };
    }
  }

  // 獲取審計日誌
  getAuditTrail(
    itemId?: string,
    userId?: string,
    startTime?: number,
    endTime?: number,
    limit: number = 100
  ): AuditEntry[] {
    // 在實際實現中，審計日誌應該儲存在安全的位置
    // 這裡返回模擬數據
    return [];
  }

  // 事件訂閱
  subscribe(event: string, callback: (event: string, data?: any) => void): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }
    this.subscribers.get(event)!.push(callback);

    return () => {
      const subscribers = this.subscribers.get(event);
      if (subscribers) {
        const index = subscribers.indexOf(callback);
        if (index !== -1) {
          subscribers.splice(index, 1);
        }
      }
    };
  }

  // 獲取安全統計
  getSecurityStats(): {
    totalKeys: number;
    activeKeys: number;
    totalSecureItems: number;
    encryptionOperations: number;
    auditEntries: number;
    dataBySensitivity: Record<DataSensitivityLevel, number>;
  } {
    const activeKeys = Array.from(this.keys.values()).filter(k => k.isActive).length;
    const dataBySensitivity = Array.from(this.secureStorage.values()).reduce((acc, item) => {
      acc[item.sensitivity] = (acc[item.sensitivity] || 0) + 1;
      return acc;
    }, {} as Record<DataSensitivityLevel, number>);

    return {
      totalKeys: this.keys.size,
      activeKeys,
      totalSecureItems: this.secureStorage.size,
      encryptionOperations: Array.from(this.keys.values()).reduce((sum, key) => sum + key.usageCount, 0),
      auditEntries: 0, // 在實際實現中應該統計審計條目
      dataBySensitivity
    };
  }

  // 私有方法實現

  private selectKeyForSensitivity(sensitivity: DataSensitivityLevel): string | null {
    // 根據敏感度選擇合適的密鑰
    const suitableKeys = Array.from(this.keys.values())
      .filter(key =>
        key.isActive &&
        key.metadata.sensitivity === sensitivity &&
        (!key.expiresAt || key.expiresAt > Date.now())
      )
      .sort((a, b) => (b.lastUsed || 0) - (a.lastUsed || 0)); // 優先使用最近使用的密鑰

    return suitableKeys.length > 0 ? suitableKeys[0].id : null;
  }

  private async deriveKey(keyId: string): Promise<CryptoKey> {
    // 在實際實現中，應該從安全儲存中檢索密鑰材料
    // 這裡使用模擬的密鑰導出

    const keyMaterial = crypto.getRandomValues(new Uint8Array(32)); // 256位密鑰

    return crypto.subtle.importKey(
      'raw',
      keyMaterial,
      'AES-GCM',
      false,
      ['encrypt', 'decrypt']
    );
  }

  private storeKeyMaterial(keyId: string, keyMaterial: ArrayBuffer): void {
    // 在實際實現中，應該將密鑰材料安全儲存在HSM或其他安全設備中
    // 這裡只是模擬儲存
    sessionStorage.setItem(`key_${keyId}`, this.arrayBufferToBase64(keyMaterial));
  }

  private async checkAccessPermission(itemId: string, userId: string, action: 'read' | 'write'): Promise<boolean> {
    // 簡化的權限檢查邏輯
    // 在實際實現中，應該檢查用戶角色和權限
    return true;
  }

  private logAuditEvent(
    action: AuditEntry['action'],
    userId: string,
    resourceId: string,
    success: boolean,
    details?: Record<string, any>
  ): void {
    if (!this.config.audit.enabled) return;

    const auditEntry: AuditEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      action,
      userId,
      userRole: 'user', // 在實際實現中應該從認證服務獲取
      success,
      details
    };

    // 在實際實現中，應該將審計條目安全儲存
    console.log('Audit Event:', auditEntry);
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private getDefaultConfig(): SecurityConfig {
    return {
      encryption: {
        defaultAlgorithm: EncryptionAlgorithm.AES_256_GCM,
        keyRotationDays: 90,
        saltRounds: 12
      },
      storage: {
        maxItemSize: 10 * 1024 * 1024, // 10MB
        retentionPolicy: {
          [DataSensitivityLevel.PUBLIC]: 365,         // 1年
          [DataSensitivityLevel.INTERNAL]: 730,       // 2年
          [DataSensitivityLevel.CONFIDENTIAL]: 1095,  // 3年
          [DataSensitivityLevel.RESTRICTED]: 1825,    // 5年
          [DataSensitivityLevel.CLASSIFIED]: 3650     // 10年
        }
      },
      audit: {
        enabled: true,
        retentionDays: 2555, // 7年
        logLevel: 'detailed'
      }
    };
  }

  private initializeKeys(): void {
    // 初始化默認密鑰
    // 在實際實現中，應該從安全儲存中載入現有密鑰

    // 生成默認對稱密鑰
    this.generateKey(
      KeyType.SYMMETRIC,
      EncryptionAlgorithm.AES_256_GCM,
      'Default encryption key',
      'system',
      DataSensitivityLevel.INTERNAL,
      90
    );
  }

  private notifySubscribers(event: string, data?: any): void {
    const subscribers = this.subscribers.get(event);
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(event, data);
        } catch (error) {
          console.error('Security event callback error:', error);
        }
      });
    }
  }
}

// 導出單例實例
export const securityService = SecurityService.getInstance();

// React Hook
export const useSecurity = () => {
  return {
    encryptData: securityService.encryptData.bind(securityService),
    decryptData: securityService.decryptData.bind(securityService),
    storeSecureData: securityService.storeSecureData.bind(securityService),
    retrieveSecureData: securityService.retrieveSecureData.bind(securityService),
    generateKey: securityService.generateKey.bind(securityService),
    rotateKey: securityService.rotateKey.bind(securityService),
    getAuditTrail: securityService.getAuditTrail.bind(securityService),
    getSecurityStats: securityService.getSecurityStats.bind(securityService),
    subscribe: securityService.subscribe.bind(securityService)
  };
};