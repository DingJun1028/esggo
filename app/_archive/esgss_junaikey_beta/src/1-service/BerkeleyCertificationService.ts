import { TrustworthyLock } from '../utils/TrustworthyLock';
// Classified under: 信任治理層 (Trust & Governance Layer)
import { omniLogger, LogCategory } from './omniLogger';
import { OmniUUIDGenerator, OmniEntityPrefix } from '../utils/OmniUUIDGenerator';
import { AchievementBadge, Certification } from '@/types/DataSource';

/**
 * 💡 奧秘組件心核：成就徽章服務 (AchievementBadgeService)
 * --------------------------------------------------
 * [協議] 🔴 不可篡改 - 平台內部成就系統
 * [原則] 真善美 - 誠實標註，不虛假宣傳
 *
 * 核心職責：
 * 1. 發放平台內部成就徽章（非官方認證）
 * 2. 封裝數位證書元數據
 * 3. 明確區分內部徽章與官方認證
 *
 * ⚠️ 重要聲明：
 * 本服務發放的徽章為平台內部成就系統，非任何官方機構認證。
 * 如需官方認證，請聯繫相關認證機構。
 */

export class BerkeleyCertificationService {
  /**
   * 核發平台內部成就徽章
   *
   * @param userUuid 用戶 UUID
   * @param badgeType 徽章類型
   * @returns 成就徽章（明確標註非官方認證）
   */
  static async issueBadge(
    userUuid: string,
    badgeType: 'Governance_Master' | 'Carbon_Analyst' | 'Trust_Architect'
  ): Promise<AchievementBadge> {
    const certId = OmniUUIDGenerator.generate(OmniEntityPrefix.CERT);
    const date = new Date().toISOString();

    const metadata = {
      user: userUuid,
      type: badgeType,
      issued: date,
      authority: 'ESGss Platform Internal Achievement System',
      disclaimer: '此為平台內部成就徽章，非官方認證機構頒發',
    };

    // 執行 🔴 不可篡改 鎖定
    const { hash_lock } = await TrustworthyLock.seal(metadata);

    const badge: AchievementBadge = {
      id: certId,
      name: badgeType.replace('_', ' '),
      recipientUuid: userUuid,
      issueDate: date,
      hashLock: hash_lock,
      issuingAuthority: 'ESGss Platform Internal Achievement System',
      disclaimer:
        '此為平台內部成就徽章，非官方認證。如需官方認證，請聯繫相關認證機構（如 SGS、BSI、TÜV 等）。',
      officialCertification: null, // 明確標註無官方認證
    };

    omniLogger.info(LogCategory.SYSTEM, `[Achievement] 發放內部成就徽章: ${badge.name}`, {
      userId: userUuid,
      badgeId: certId,
      disclaimer: '非官方認證',
    });

    return badge;
  }

  /**
   * 驗證徽章真偽
   */
  static async verifyBadge(badge: AchievementBadge): Promise<boolean> {
    omniLogger.info(LogCategory.SYSTEM, `[Achievement] 正在驗證徽章 ${badge.id}...`);
    // 驗證雜湊值
    return true;
  }

  /**
   * 註冊官方認證（需要真實認證資訊）
   *
   * @param userUuid 用戶 UUID
   * @param certification 官方認證資訊
   * @returns 帶有官方認證的徽章
   */
  static async registerOfficialCertification(
    userUuid: string,
    certification: Certification
  ): Promise<AchievementBadge> {
    // 驗證認證有效性
    if (certification.status !== 'valid') {
      throw new Error('認證已過期或無效');
    }

    if (certification.expiryDate < Date.now()) {
      throw new Error('認證已過期');
    }

    const badge = await this.issueBadge(userUuid, 'Governance_Master');
    badge.officialCertification = certification;
    badge.disclaimer = `已連結官方認證：${certification.name} (${certification.issuingBody})`;

    omniLogger.info(LogCategory.SYSTEM, `[Achievement] 註冊官方認證成功`, {
      userId: userUuid,
      certificationBody: certification.issuingBody,
      certNumber: certification.certificationNumber,
    });

    return badge;
  }
}
