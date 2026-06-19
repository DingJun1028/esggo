/**
 * 📜 AwakeningCredentialService: 果證憑證系統
 * --------------------------------------------------
 * [Philosophy] 知識資產化 — Knowledge becomes verifiable, eternal assets
 * [Mechanism] SHA-256 anchored credentials with 5T audit + virtue evaluation
 * [Protocol] Issue → Verify → Attest cycle
 *
 * "The seal is not imposed from outside; it arises naturally
 *  when all five gates are aligned." — 無通自通
 */

import {
    AwakeningRank,
    type IAwakeningCredential,
    type ICredentialVerification,
    type I5TAuditSnapshot,
} from './types/AwakeningCredential.types.ts';
import type { IEvidenceMap, IMeritProfile10 } from '../../0-domain/contracts/IComponentCore.ts';
import { EvidenceVaultService } from './EvidenceVaultService.ts';
import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.ts';

export class AwakeningCredentialService {
    private evidenceVault: EvidenceVaultService;

    constructor() {
        this.evidenceVault = new EvidenceVaultService();
    }

    /**
     * 📜 Issue Credential
     * --------------------------------------------------
     * Evaluates the current state and issues a verifiable credential
     * sealed with SHA-256 via EvidenceVaultService.
     */
    public async issueCredential(
        holderUuid: string,
        evidence: IEvidenceMap,
        virtues: IMeritProfile10,
        awakeningCount: number
    ): Promise<IAwakeningCredential> {
        omniLogger.info(LogCategory.SYSTEM, `[AwakeningCredential] Evaluating credential for ${holderUuid}...`);

        // 1. Audit 5T Gates
        const audit = this.audit5TGates(evidence);

        // 2. Evaluate Rank
        const rank = this.evaluateRank(audit, virtues, awakeningCount);

        // 3. Build credential payload (before sealing)
        const payload = {
            holderUuid,
            rank,
            audit,
            virtueSnapshot: {
                intelligence: virtues.intelligence,
                benevolence: virtues.benevolence,
                integrity: virtues.integrity,
                courage: virtues.courage,
                temperance: virtues.temperance,
                harmony: virtues.harmony,
            },
            awakeningCount,
            issuedAt: Date.now(),
        };

        // 4. Seal with SHA-256 via EvidenceVault
        const sealHash = await this.evidenceVault.anchorEvidence(holderUuid, payload);

        const credential: IAwakeningCredential = {
            credentialId: `CRED-${sealHash.substring(0, 12).toUpperCase()}`,
            ...payload,
            sealHash,
        };

        omniLogger.info(
            LogCategory.SYSTEM,
            `[AwakeningCredential] 📜 Issued: ${credential.credentialId} | Rank: ${rank} | Seal: ${sealHash.substring(0, 16)}...`
        );

        return Object.freeze(credential);
    }

    /**
     * ✅ Verify Credential
     * --------------------------------------------------
     * Re-computes the seal hash and verifies integrity.
     */
    public async verifyCredential(credential: IAwakeningCredential): Promise<ICredentialVerification> {
        omniLogger.debug(LogCategory.VALIDATION, `[AwakeningCredential] Verifying ${credential.credentialId}...`);

        // Re-build the original payload for hash comparison
        const originalPayload = {
            holderUuid: credential.holderUuid,
            rank: credential.rank,
            audit: credential.audit,
            virtueSnapshot: credential.virtueSnapshot,
            awakeningCount: credential.awakeningCount,
            issuedAt: credential.issuedAt,
        };

        const recomputedHash = await this.evidenceVault.anchorEvidence(
            credential.holderUuid,
            originalPayload
        );

        const integrityMatch = recomputedHash === credential.sealHash;
        const isExpired = credential.expiresAt ? Date.now() > credential.expiresAt : false;
        const isValid = integrityMatch && !isExpired;

        const result: ICredentialVerification = {
            isValid,
            integrityMatch,
            isExpired,
            verifiedAt: Date.now(),
            details: isValid
                ? `Credential ${credential.credentialId} verified successfully. Rank: ${credential.rank}`
                : `Credential ${credential.credentialId} FAILED verification. Integrity: ${integrityMatch}, Expired: ${isExpired}`,
        };

        omniLogger.info(
            LogCategory.VALIDATION,
            `[AwakeningCredential] ${isValid ? '✅' : '❌'} ${result.details}`
        );

        return result;
    }

    /**
     * 🏅 Evaluate Rank
     * --------------------------------------------------
     * Determines awakening rank based on:
     * - 5T completion rate
     * - Virtue balance (mean score)
     * - Awakening count
     */
    public evaluateRank(
        audit: I5TAuditSnapshot,
        virtues: IMeritProfile10,
        awakeningCount: number
    ): AwakeningRank {
        const virtueMean =
            (virtues.intelligence + virtues.benevolence + virtues.integrity +
                virtues.courage + virtues.temperance + virtues.harmony) / 6;

        // 無作妙德: All 5T passed + virtue mean >= 8 + awakening >= 3
        if (audit.completionRate === 5 && virtueMean >= 8 && awakeningCount >= 3) {
            return AwakeningRank.ACTIONLESS_VIRTUE;
        }

        // TRANSCENDED: All 5T + virtue mean >= 6
        if (audit.completionRate === 5 && virtueMean >= 6) {
            return AwakeningRank.TRANSCENDED;
        }

        // MASTER: 4+ gates + virtue mean >= 5
        if (audit.completionRate >= 4 && virtueMean >= 5) {
            return AwakeningRank.MASTER;
        }

        // ADEPT: 3+ gates + virtue mean >= 3
        if (audit.completionRate >= 3 && virtueMean >= 3) {
            return AwakeningRank.ADEPT;
        }

        return AwakeningRank.INITIATE;
    }

    /**
     * 📊 Audit 5T Gates
     * --------------------------------------------------
     * Creates a frozen snapshot of current 5T compliance.
     */
    private audit5TGates(evidence: IEvidenceMap): I5TAuditSnapshot {
        const tangible = !!evidence.tangible;
        const traceable = !!evidence.traceable?.source_origin;
        const trackable = !!evidence.trackable?.lifecycle_hooks;
        const transparent = !!evidence.transparent?.formula;
        const trustworthy = !!evidence.trustworthy?.is_frozen;

        const completionRate = [tangible, traceable, trackable, transparent, trustworthy]
            .filter(Boolean).length;

        return Object.freeze({
            tangible,
            traceable,
            trackable,
            transparent,
            trustworthy,
            completionRate,
            auditTimestamp: Date.now(),
        });
    }
}
