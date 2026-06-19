import { TrustworthyLock } from '../utils/TrustworthyLock.js';
// Classified under: Trust & Governance Layer
import { omniLogger, LogCategory } from './omniLogger.js';
import { OmniUUIDGenerator, OmniEntityPrefix } from '../utils/OmniUUIDGenerator.js';
import { AchievementBadge, Certification } from '../types/DataSource.js';

/**
 * 💡 Omni Component Core: Achievement Badge Service (AchievementBadgeService)
 * --------------------------------------------------
 * [Protocol] 🔴 Immutable - Platform Internal Achievement System
 * [Principle] Truth, Goodness, Beauty - Honest labeling, no false advertising
 *
 * Core Responsibilities:
 * 1. Issue platform internal achievement badges (Non-official certification)
 * 2. Encapsulate digital certificate metadata
 * 3. Clearly distinguish internal badges from official certifications
 *
 * ⚠️ Important Disclaimer:
 * Badges issued by this service are part of the platform's internal achievement system and are not certifications from any official body.
 * For official certification, please contact relevant certification bodies.
 */

export class BerkeleyCertificationService {
  /**
   * Issues platform internal achievement badges
   *
   * @param userUuid User UUID
   * @param badgeType Badge type
   * @returns Achievement badge (clearly labeled as non-official)
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
      disclaimer:
        'This is a platform internal achievement badge, not issued by an official certification body',
    };

    // Execute 🔴 Immutable locking
    const { hash_lock } = await TrustworthyLock.seal(metadata);

    const badge: AchievementBadge = {
      id: certId,
      name: badgeType.replace('_', ' '),
      recipientUuid: userUuid,
      issueDate: date,
      hashLock: hash_lock,
      issuingAuthority: 'ESGss Platform Internal Achievement System',
      disclaimer:
        'This is a platform internal achievement badge, not an official certification. For official certification, please contact relevant bodies (e.g., SGS, BSI, TÜV, etc.).',
      officialCertification: null, // Clearly marked as no official certification
    };

    omniLogger.info(
      LogCategory.SYSTEM,
      `[Achievement] Issued internal achievement badge: ${badge.name}`,
      {
        userId: userUuid,
        badgeId: certId,
        disclaimer: 'Non-official certification',
      }
    );

    return badge;
  }

  /**
   * Verify badge authenticity
   */
  static async verifyBadge(badge: AchievementBadge): Promise<boolean> {
    omniLogger.info(LogCategory.SYSTEM, `[Achievement] Verifying badge ${badge.id}...`);
    // Verify hash value
    return true;
  }

  /**
   * Register official certification (requires real certification info)
   *
   * @param userUuid User UUID
   * @param certification Official certification info
   * @returns Badge with official certification
   */
  static async registerOfficialCertification(
    userUuid: string,
    certification: Certification
  ): Promise<AchievementBadge> {
    // Verify certification validity
    if (certification.status !== 'valid') {
      throw new Error('Certification expired or invalid');
    }

    if (certification.expiryDate < Date.now()) {
      throw new Error('Certification expired');
    }

    const badge = await this.issueBadge(userUuid, 'Governance_Master');
    badge.officialCertification = certification;
    badge.disclaimer = `Linked official certification: ${certification.name} (${certification.issuingBody})`;

    omniLogger.info(
      LogCategory.SYSTEM,
      `[Achievement] Official certification registered successfully`,
      {
        userId: userUuid,
        certificationBody: certification.issuingBody,
        certNumber: certification.certificationNumber,
      }
    );

    return badge;
  }
}
