/**
 * ImpactExchangeService.ts
 *
 * 🌱 Planetary Mesh: Impact Credit Exchange Service
 * -----------------------------------------
 * [協議] Phase 6: v9.0 Core Implementation
 *
 * 核心職責 (Core Responsibilities):
 * 1. Impact Credit 管理 - 允許節點間交換影響力積分
 * 2. 5T Protocol 合規 - 所有交換遵循可溯源、可追蹤、可透明、可感知、不可篡改
 * 3. EDES 標準支援 - 符合 ESG Data Exchange Standard
 */

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { MeshMessage, MeshMessageType } from './MeshProtocol';
import { TrustworthyLock } from '@/utils/TrustworthyLock';
import { EventEmitter } from '@/utils/EventEmitter';
import { v4 as uuidv4 } from 'uuid';
import { zkpService, IZKPProof } from '../security/ZeroKnowledgeService';

/**
 * Impact Credit 類型定義 (影響力積分類型)
 * 用於節點間交換的 ESG 影響力資產
 */
export interface ImpactCredit {
  creditId: string; // [Traceable 可溯源] 唯一識別碼
  category: 'carbon' | 'water' | 'waste' | 'energy' | 'social' | 'governance';
  amount: number; // 積分數量
  unit: string; // 計量單位 (e.g., 'tCO2e', 'm³', 'kWh')
  sourceOrigin: string; // [Traceable 可溯源] 來源組織
  verificationStandard: string; // [Transparent 可透明] 驗證標準 (e.g., 'ISO-14064-1')
  timestamp: number; // [Trackable 可追蹤] 創建時間
  evidenceHash: string; // [Trustworthy 不可篡改] 證據雜湊
  status: 'Trustworthy'; // [Trustworthy 不可篡改] 狀態
}

/**
 * Impact Credit 交換提議 (影響力積分交換提議)
 */
export interface ImpactCreditOffer {
  offerId: string;
  senderNodeId: string;
  offeredCredits: ImpactCredit[];
  requestedCategories: ImpactCredit['category'][];
  exchangeRate: number; // 交換比率
  expiryTimestamp: number;
  timestamp: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  zkpProof?: IZKPProof; // [Phase 8] Quantum Defense Identity Proof
}

/**
 * Impact Credit 轉移記錄 (影響力積分轉移記錄)
 */
export interface ImpactCreditTransfer {
  transferId: string;
  senderNodeId: string;
  recipientNodeId: string;
  credits: ImpactCredit[];
  transactionHash: string; // 5T 交易雜湊
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  zkpProof?: IZKPProof; // [Phase 8] Quantum Defense Identity Proof
}

/**
 * Impact Exchange Service
 * 實現節點間的影響力積分交換功能
 */
export class ImpactExchangeService {
  private nodeId: string;
  private localCredits: Map<string, ImpactCredit> = new Map();
  private pendingOffers: Map<string, ImpactCreditOffer> = new Map();
  private transferHistory: Map<string, ImpactCreditTransfer> = new Map();
  private events: EventEmitter = new EventEmitter();
  private balancingThresholds: Map<ImpactCredit['category'], { min: number, max: number }> = new Map();

  constructor(nodeId: string = uuidv4()) {
    this.nodeId = nodeId;
    this.initializeMockCredits();
  }

  /**
   * 初始化模擬影響力積分 (Initialize Mock Impact Credits)
   */
  private initializeMockCredits(): void {
    const mockCredits: ImpactCredit[] = [
      {
        creditId: uuidv4(),
        category: 'carbon',
        amount: 100,
        unit: 'tCO2e',
        sourceOrigin: 'org-alpha-carbon-project',
        verificationStandard: 'ISO-14064-1',
        timestamp: Date.now(),
        evidenceHash: '',
        status: 'Trustworthy',
      },
      {
        creditId: uuidv4(),
        category: 'water',
        amount: 500,
        unit: 'm³',
        sourceOrigin: 'org-alpha-water-conservation',
        verificationStandard: 'ISO-14046',
        timestamp: Date.now(),
        evidenceHash: '',
        status: 'Trustworthy',
      },
      {
        creditId: uuidv4(),
        category: 'energy',
        amount: 1000,
        unit: 'kWh',
        sourceOrigin: 'org-alpha-renewable-energy',
        verificationStandard: 'ISO-50001',
        timestamp: Date.now(),
        evidenceHash: '',
        status: 'Trustworthy',
      },
    ];

    mockCredits.forEach(async credit => {
      // 計算證據雜湊
      const hash = await TrustworthyLock.generateHash(
        JSON.stringify({
          creditId: credit.creditId,
          category: credit.category,
          amount: credit.amount,
          sourceOrigin: credit.sourceOrigin,
          timestamp: credit.timestamp,
        })
      );
      credit.evidenceHash = hash;
      this.localCredits.set(credit.creditId, credit);
    });

    omniLogger.info(
      LogCategory.BUSINESS,
      `[ImpactExchange] Initialized with ${mockCredits.length} mock credits`
    );
  }

  /**
   * 創建影響力積分交換提議 (Create Impact Credit Exchange Offer)
   */
  public async createOffer(
    offeredCreditIds: string[],
    requestedCategories: ImpactCredit['category'][],
    exchangeRate: number = 1.0,
    expiryMinutes: number = 60
  ): Promise<ImpactCreditOffer | null> {
    const offeredCredits = offeredCreditIds
      .map(id => this.localCredits.get(id))
      .filter((credit): credit is ImpactCredit => credit !== undefined);

    if (offeredCredits.length === 0) {
      omniLogger.error(LogCategory.BUSINESS, '[ImpactExchange] No valid credits to offer');
      return null;
    }

    const zkpProof = await zkpService.generateProof(this.nodeId, "OMNI_SECRET_MOCK");

    const offer: ImpactCreditOffer = {
      offerId: uuidv4(),
      senderNodeId: this.nodeId,
      offeredCredits,
      requestedCategories,
      exchangeRate,
      expiryTimestamp: Date.now() + expiryMinutes * 60 * 1000,
      timestamp: Date.now(),
      status: 'pending',
      zkpProof,
    };

    this.pendingOffers.set(offer.offerId, offer);

    omniLogger.info(
      LogCategory.BUSINESS,
      `[ImpactExchange] Created offer ${offer.offerId} with ${offeredCredits.length} credits`
    );
    this.events.emit('offerCreated', offer);

    return offer;
  }

  /**
   * 接受交換提議 (Accept Exchange Offer)
   */
  public async acceptOffer(offer: ImpactCreditOffer): Promise<ImpactCreditTransfer | null> {
    if (offer.status !== 'pending') {
      omniLogger.error(
        LogCategory.BUSINESS,
        `[ImpactExchange] Offer ${offer.offerId} is not pending`
      );
      return null;
    }

    if (Date.now() > offer.expiryTimestamp) {
      offer.status = 'expired';
      omniLogger.error(LogCategory.BUSINESS, `[ImpactExchange] Offer ${offer.offerId} has expired`);
      return null;
    }

    // [Phase 8] Quantum Defense Handshake
    if (offer.zkpProof) {
      const isIdentityVerified = await zkpService.verifyProof(offer.zkpProof);
      if (!isIdentityVerified) {
        omniLogger.error(LogCategory.SECURITY, `[ImpactExchange] ZKP Verification Failed for offer ${offer.offerId}`);
        return null;
      }
    }

    // 創建轉移記錄
    const transfer: ImpactCreditTransfer = {
      transferId: uuidv4(),
      senderNodeId: offer.senderNodeId,
      recipientNodeId: this.nodeId,
      credits: offer.offeredCredits,
      transactionHash: '',
      timestamp: Date.now(),
      status: 'pending',
      zkpProof: await zkpService.generateProof(this.nodeId, "OMNI_SECRET_MOCK"), // Handshake response
    };

    // 生成 5T 交易雜湊
    const hash = await TrustworthyLock.generateHash(
      JSON.stringify({
        transferId: transfer.transferId,
        credits: transfer.credits,
        senderNodeId: transfer.senderNodeId,
        recipientNodeId: transfer.recipientNodeId,
        timestamp: transfer.timestamp,
      })
    );
    transfer.transactionHash = hash;

    // 更新提議狀態
    offer.status = 'accepted';

    // 將積分加入本地錢包
    transfer.credits.forEach(credit => {
      this.localCredits.set(credit.creditId, credit);
    });

    transfer.status = 'confirmed';
    this.transferHistory.set(transfer.transferId, transfer);

    omniLogger.info(
      LogCategory.BUSINESS,
      `[ImpactExchange] Transfer ${transfer.transferId} confirmed with ${transfer.credits.length} credits`
    );
    this.events.emit('transferConfirmed', transfer);

    return transfer;
  }

  /**
   * 拒絕交換提議 (Reject Exchange Offer)
   */
  public rejectOffer(offerId: string): boolean {
    const offer = this.pendingOffers.get(offerId);
    if (!offer) {
      return false;
    }

    offer.status = 'rejected';
    omniLogger.info(LogCategory.BUSINESS, `[ImpactExchange] Offer ${offerId} rejected`);
    this.events.emit('offerRejected', offer);

    return true;
  }

  /**
   * 獲取本地積分餘額 (Get Local Credit Balance)
   */
  public getBalance(): Map<ImpactCredit['category'], number> {
    const balance = new Map<ImpactCredit['category'], number>();

    this.localCredits.forEach(credit => {
      const current = balance.get(credit.category) || 0;
      balance.set(credit.category, current + credit.amount);
    });

    return balance;
  }

  /**
   * 獲取所有本地積分 (Get All Local Credits)
   */
  public getAllCredits(): ImpactCredit[] {
    return Array.from(this.localCredits.values());
  }

  /**
   * 獲取待處理提議 (Get Pending Offers)
   */
  public getPendingOffers(): ImpactCreditOffer[] {
    return Array.from(this.pendingOffers.values()).filter(o => o.status === 'pending');
  }

  /**
   * 獲取轉移歷史 (Get Transfer History)
   */
  public getTransferHistory(): ImpactCreditTransfer[] {
    return Array.from(this.transferHistory.values());
  }

  /**
   * 驗證積分完整性 (Verify Credit Integrity)
   * 使用 5T Protocol 驗證
   */
  public verifyCredit(credit: ImpactCredit): boolean {
    const expectedHash = TrustworthyLock.generateHashSync(
      JSON.stringify({
        creditId: credit.creditId,
        category: credit.category,
        amount: credit.amount,
        sourceOrigin: credit.sourceOrigin,
        timestamp: credit.timestamp,
      })
    );

    return credit.evidenceHash === expectedHash && credit.status === 'Trustworthy';
  }

  /**
   * 生成交換訊息 (Generate Exchange Message)
   */
  public generateExchangeMessage(offer: ImpactCreditOffer): MeshMessage {
    return {
      id: uuidv4(),
      type: MeshMessageType.DATA_OFFER,
      senderNodeId: this.nodeId,
      payload: {
        type: 'IMPACT_CREDIT_EXCHANGE',
        offer,
      },
      signature: TrustworthyLock.generateHashSync(JSON.stringify(offer)),
      timestamp: Date.now(),
    };
  }

  /**
   * 事件監聽器 (Event Listeners)
   */
  public onOfferCreated(callback: (offer: ImpactCreditOffer) => void): void {
    this.events.on('offerCreated', callback);
  }

  public onTransferConfirmed(callback: (transfer: ImpactCreditTransfer) => void): void {
    this.events.on('transferConfirmed', callback);
  }

  public onOfferRejected(callback: (offer: ImpactCreditOffer) => void): void {
    this.events.on('offerRejected', callback);
  }

  /**
   * 設置自動平衡閾值 (Set Balancing Thresholds)
   */
  public setBalancingThreshold(category: ImpactCredit['category'], min: number, max: number): void {
    this.balancingThresholds.set(category, { min, max });
    omniLogger.info(LogCategory.BUSINESS, `[ImpactExchange] Set thresholds for ${category}: min=${min}, max=${max}`);
  }

  /**
   * 自動平衡積分 (Auto-Balance Credits)
   * 檢查餘額並自動創建或請求交換
   */
  public async autoBalance(): Promise<void> {
    const currentBalance = this.getBalance();

    for (const [category, thresholds] of this.balancingThresholds.entries()) {
      const amount = currentBalance.get(category) || 0;

      if (amount < thresholds.min) {
        // 餘額不足，請求交換 (Request credits)
        omniLogger.info(LogCategory.BUSINESS, `[ImpactExchange] Low balance for ${category} (${amount} < ${thresholds.min}). Requesting...`);
        this.events.emit('balanceLow', { category, current: amount, target: thresholds.min });
      } else if (amount > thresholds.max) {
        // 餘額過多，提供交換 (Offer credits)
        const overflow = amount - thresholds.max;
        const creditsToOffer = this.getAllCredits()
          .filter(c => c.category === category)
          .slice(0, Math.ceil(overflow / 10)); // Just a heuristic for the mock

        if (creditsToOffer.length > 0) {
          omniLogger.info(LogCategory.BUSINESS, `[ImpactExchange] High balance for ${category} (${amount} > ${thresholds.max}). Offering surplus...`);
          await this.createOffer(creditsToOffer.map(c => c.creditId), []); // Offer for anything needed
        }
      }
    }
  }

  /**
   * 獲取節點 ID (Get Node ID)
   */
  public getNodeId(): string {
    return this.nodeId;
  }
}

// 單例實例
export const impactExchange = new ImpactExchangeService();
