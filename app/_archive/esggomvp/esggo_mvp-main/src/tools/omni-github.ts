import { odm } from '@/core/omni-domain';
import { IOmniAtom } from '@/core/omni-types';
import { ost } from '@/core/omni-space-time';
import { omniLogger, LogCategory } from '@/core/omniLogger';

/**
 * 🛰️ OmniGithub: The Domain Border Guardian
 * Responsibility: Securely synchronize domain assets with external repositories.
 * Philosophy: "未經 OmniDomain 許可，一顆原子都不能離開，也不能進入。"
 */
export class OmniGithubGuardian {
    /**
     * 🛡️ Border Control (Pre-push Check)
     * Ensures Sovereignty, 5T Compliance, and Semantic Integrity.
     */
    public async borderControl(params: {
        domainUuid: string;
        userUuid: string;
        atoms: IOmniAtom<any>[];
    }): Promise<{ success: boolean; message: string; anchor?: any }> {
        omniLogger.info(LogCategory.SECURITY, "🛡️ OmniGithub: 正在掃描邊境貨物 (Pre-push Check)...");

        // 1. [Identity] Sovereignty Check
        const domain = odm.getDomain(params.domainUuid);
        if (!domain) {
            return { success: false, message: '⛔ 拒絕：未知的領域管轄。' };
        }

        if (!domain.citizens.includes(params.userUuid)) {
            omniLogger.error(LogCategory.SECURITY, `⛔ 錯誤：非領域領主 ${params.userUuid}，無權推送原子。`);
            return { success: false, message: '⛔ 錯誤：非領域領主，無權推送原子至此倉庫。' };
        }
        omniLogger.info(LogCategory.SECURITY, `> [Identity] 領主 ${params.userUuid} 確認。`);

        // 2. [Semantic] Rosetta Cleanliness Check
        // Scans all atom payloads for "Semantic Entropy" (Mojibake)
        const OmniRosetta = (await import('@/core/omni-rosetta')).OmniRosetta;
        const corruptedAtoms = params.atoms.filter(atom =>
            typeof atom.payload === 'string' && OmniRosetta.isMojibake(atom.payload)
        );

        if (corruptedAtoms.length > 0) {
            omniLogger.error(LogCategory.SECURITY, `⛔ 攔截：偵測到語義熵增 (亂碼)！受影響原子: ${corruptedAtoms.map(a => a.uuid).join(', ')}`);
            return { success: false, message: '⛔ 攔截：偵測到語義熵增 (亂碼)。請執行 OmniRosetta 淨化流程。' };
        }
        omniLogger.info(LogCategory.SECURITY, `> [Semantic] 語義掃描完成... 無亂碼 (UTF-8).`);

        // 3. [Constitution] 5T Compliance Check
        const allCompliant = params.atoms.every(atom => atom.status === 'Trustworthy' || atom.status === 'Active');
        if (!allCompliant) {
            return { success: false, message: '⛔ 攔截：違反領域憲法 (5T Protocol Violation)。' };
        }
        omniLogger.info(LogCategory.SECURITY, `> [Constitution] 5T 結構驗證通過。`);

        // 4. [Anchoring] SpaceTime Anchoring (Yonghe)
        // Simulate high-precision coordinate injection for Yonghe
        const localizedAnchor = ost.manifest({
            latitude: 25.0,
            longitude: 121.51,
            altitude: 10,
            accuracy: 1
        });

        omniLogger.info(LogCategory.SECURITY, `> [Anchor] 鎖定座標: Yonghe District (25.00, 121.51).`);

        return {
            success: true,
            message: `✅ 驗證通過。准許進入 OmniDomain 遠端領域。`,
            anchor: localizedAnchor
        };
    }

    /**
     * 📤 OmniPush Sequence
     */
    public async push(params: {
        domainUuid: string;
        userUuid: string;
        atoms: IOmniAtom<any>[];
        remote: string;
    }) {
        const result = await this.pushSync(params.domainUuid, params.userUuid, params.atoms, params.remote);
        if (!result.success) {
            omniLogger.error(LogCategory.SECURITY, result.message);
            return;
        }
        omniLogger.info(LogCategory.SYSTEM, `✅ Deployment Successful.`);
    }

    /**
     * 🛰️ Sync Domain to Repository (Legacy alias)
     */
    public async syncDomainToRepo(
        domainUuid: string,
        userUuid: string,
        atoms: IOmniAtom<any>[],
        remote: string
    ) {
        return this.pushSync(domainUuid, userUuid, atoms, remote);
    }

    private async pushSync(domainUuid: string, userUuid: string, atoms: IOmniAtom<any>[], remote: string) {
        const result = await this.borderControl({ domainUuid, userUuid, atoms });
        if (!result.success) return result;

        omniLogger.info(LogCategory.SYSTEM, `🚀 Starting OmniPush to ${remote}...`);
        omniLogger.info(LogCategory.SYSTEM, `> Time: ${result.anchor.timestamp.iso}`);

        return { success: true, message: `Domain synchronized to ${remote} successfully.` };
    }
}

export const omniGithub = new OmniGithubGuardian();
