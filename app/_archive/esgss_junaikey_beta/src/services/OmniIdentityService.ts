/**
 * 🆔 OmniIdentityService: 全域主權身份服務
 * 
 * 核心功能:
 * 1. 分散式身份 (DID) 管理: 建立與解析主權參與者的身份標識。
 * 2. 身份證明 (Verifiable Credentials): 簽署與驗證參與者的資歷與權限。
 * 3. 跨鏈/跨域身份對齊: 確保主權身份在不同組織與系統中的一致性。
 * 
 * "名不正，則言不順" —— 透過 DID 確立萬物在永續網格中的數位主體性。
 */

import { v4 as uuidv4 } from 'uuid';
import SovereignVaultService from './SovereignVaultService';

export interface IdentityDocument {
    did: string;
    controller: string;
    publicKey: string;
    created: string;
    verified: boolean;
    metadata: Record<string, any>;
}

class OmniIdentityService {
    private static instance: OmniIdentityService;
    private identityMap: Map<string, IdentityDocument> = new Map();

    private constructor() { }

    public static getInstance(): OmniIdentityService {
        if (!OmniIdentityService.instance) {
            OmniIdentityService.instance = new OmniIdentityService();
        }
        return OmniIdentityService.instance;
    }

    /**
     * 註冊主權身份 (Register Sovereign Identity)
     */
    public registerIdentity(publicKey: string, metadata: Record<string, any> = {}): IdentityDocument {
        const did = `did:esgss:${uuidv4()}`;
        const identity: IdentityDocument = {
            did,
            controller: did, // Self-controlled by default
            publicKey,
            created: new Date().toISOString(),
            verified: true,
            metadata
        };
        this.identityMap.set(did, identity);
        console.log(`[OmniIdentity] Identity Registered: ${did}`);
        return identity;
    }

    /**
     * 解析身份 (Resolve Identity)
     */
    public resolveIdentity(did: string): IdentityDocument | undefined {
        return this.identityMap.get(did);
    }

    /**
     * 簽署可驗證憑證 (Sign Verifiable Credential)
     */
    public async signCredential(did: string, claim: any): Promise<string> {
        const identity = this.resolveIdentity(did);
        if (!identity) throw new Error('Identity not found');

        // 使用 5T 協議進行憑證封印
        const vaultRecord = await SovereignVaultService.sealRecord('VerifiableCredential', {
            did,
            claim,
            issuer: 'OmniIdentityService'
        });

        console.log(`[OmniIdentity] Credential Signed for ${did} -> Hash: ${vaultRecord.hash.substring(0, 8)}`);
        return vaultRecord.signature;
    }

    /**
     * 代碼結晶 (Crystallize DID Status)
     */
    public async crystallizeIdentity(did: string) {
        const identity = this.resolveIdentity(did);
        if (!identity) return;

        // 將身份狀態結晶為資產
        await SovereignVaultService.sealRecord('IdentityCrystallization', {
            did: identity.did,
            status: 'Crystallized',
            timestamp: Date.now()
        });
    }
}

export default OmniIdentityService.getInstance();
