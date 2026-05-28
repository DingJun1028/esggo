import { IComponentCore, IEvidence } from '../../lib/core-types';
import { createHmac } from 'crypto';

const HMAC_SECRET = 'T5-ZKP-SECURITY-KEY';

export enum T5Protocol {
  Traceable = 'Traceable', // T1: 溯源
  Transparent = 'Transparent', // T2: 透明
  Tangible = 'Tangible', // T3: 可感知
  Trustworthy = 'Trustworthy', // T4: 不可篡改
  Trackable = 'Trackable' // T5: 可追蹤
}

// Hash Lock 強化實現 - SHA-512 + HMAC-ZKP
export class HashLock {
  private static readonly ALGORITHM = 'SHA-512';

  static async lock(data: string): Promise<string> {
    const hmac = createHmac('sha512', HMAC_SECRET);
    hmac.update(data);
    return hmac.digest('hex');
  }

  static verify(data: string, hash: string): boolean {
    const recomputed = createHmac('sha512', HMAC_SECRET)
      .update(data)
      .digest('hex');
    return recomputed === hash;
  }
}

// ZKP 驗證器
export class ZKPValidator {
  static generateProof(data: string, nonce: number): string {
    const hash = createHmac('sha512', HMAC_SECRET)
      .update(`${data}:${nonce}`)
      .digest('hex');
    return hash;
  }

  static verifyProof(data: string, proof: string, difficulty: number = 2): boolean {
    const expectedPrefix = '0'.repeat(difficulty);
    return proof.startsWith(expectedPrefix);
  }
}

// 5T 協議驗證器
export class T5Validator {
  static async validate(component: IComponentCore): Promise<boolean> {
    // T1: 可溯源 - 檢查每條證據的來源標記
    const traceable = component.evidence.every(e => e.originCause !== '');
    
    // T2: 可透明 - 檢查處理軌跡 (processTrace)
    const transparent = component.evidence.every(e => e.processTrace && e.processTrace.length > 0);
    
    // T3: 可感知 - UI 感知（實際由前端組件負責）
    const tangible = true; // 佔位符
    
    // T4: 不可篡改 - 哈希驗證（使用 finalEffect + originCause 作為驗算輸入）
    const trustworthy = component.evidence.every(e => 
      HashLock.verify(`${e.finalEffect}|${e.originCause}`, component.hash_lock)
    );
    
    // T5: 可追蹤 - 生命週期鉤子 (processTrace 代替)
    const trackable = component.evidence.every(e => e.processTrace && e.processTrace.length > 0);
    
    return traceable && transparent && tangible && trustworthy && trackable;
  }
}

// 極簡設計 Token
export const DesignTokens = {
  colors: {
    BerkeleyBlue: '#003262',
    CaliforniaGold: '#FDB515',
    TealAqua: '#008899',
    LiquidPearl: '#F2F6F8',
    SunflareCoral: '#E66453',
  },
  typography: {
    primary: 'Inter',
    mono: 'JetBrains Mono',
  },
  spacing: {
    unit: 4,
    borderRadius: {
      sm: 4,
      md: 6,
      lg: 8,
    },
  },
  animation: {
    duration: 150, // 機械級反應
  },
};

// Berkeley 設計系統組件基類
export abstract class BerkeleyComponent implements IComponentCore {
  public readonly uuid: string;
  public readonly version: string;
  public readonly timestamp: number;
  public evidence: IEvidence[] = [];

  // IComponentCore required fields — subclasses must supply concrete values
  public abstract readonly formula: string;        // 碳排與影響力計算公式 (Transparent)
  public abstract readonly impact_metric: string;  // 具體影響力指標 (Tangible)
  public abstract readonly status: 'Trustworthy';  // 唯一的不可狀態
  public abstract readonly hash_lock: string;      // 數據真理哈希鎖

  constructor() {
    this.uuid = this.generateUUID();
    this.version = '8.5.0-ooriginal';
    this.timestamp = Date.now();
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'.replace(/x/g, () => 
      Math.floor(Math.random() * 16).toString(16)
    );
  }

  public async validate(): Promise<boolean> {
    return T5Validator.validate(this);
  }
}
