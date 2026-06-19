/**
 * 📍 OmniSpaceTime: 萬能時空座標核心
 * ==========================================
 * 提供 4D (Spatial + Temporal + Hyper-Phase) 座標定位與 5T 溯源證明。
 * 遵循「大統一脈絡 (Universal Context)」架構。
 */

// import * as crypto from 'crypto'; // Removed for browser compatibility
import { IOmniSpaceTime } from './omni-types';

export class OmniSpaceTime {
    /**
     * 🚀 顯化當前時空錨點 (Manifest Anchor / Capture)
     */
    public static manifest(
        geo?: { latitude: number; longitude: number; altitude: number; accuracy: number },
        wPhase: number = 0.5
    ): IOmniSpaceTime {
        const now = new Date();
        const epochNs = (BigInt(now.getTime()) * BigInt(1000000)).toString();

        const st: IOmniSpaceTime = {
            timestamp: {
                iso: now.toISOString(),
                epochNanoseconds: epochNs,
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            },
            location: {
                geo,
                digital: {
                    serverRegion: process.env.VERCEL_REGION || 'edge-nexus-01',
                    blockHeight: Date.now() % 1000000, // Mock block height for entropy
                }
            },
            proof: {
                method: 'Atomic-Sync',
                signature: '', // To be generated
            },
            w: Math.max(0, Math.min(1, wPhase)),
        };

        st.proof.signature = this.generateSignature(st);
        return st;
    }

    /** 別名以支援現有引用 */
    public static capture = () => OmniSpaceTime.manifest();

    /**
     * 🔐 產生時空證明簽章 (Space-Time Proof Signature)
     */
    private static generateSignature(st: IOmniSpaceTime): string {
        // Simplified signature for cross-platform compatibility without Node crypto
        const payload = `${st.timestamp.epochNanoseconds}-${st.w}-OmniOne_Universal_Salt`;
        let hash = 0;
        for (let i = 0; i < payload.length; i++) {
            const char = payload.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return `ST_PROOF_${Math.abs(hash).toString(16)}`;
    }

    /**
     * 🌀 計算兩點之間的「因果熵距離」 (Causal Entropy Distance)
     */
    public static calculateEntropyDistance(a: IOmniSpaceTime, b: IOmniSpaceTime): number {
        const dt = Math.abs(Number(a.timestamp.epochNanoseconds) - Number(b.timestamp.epochNanoseconds)) / 1e9;
        const dw = Math.abs((a.w || 0) - (b.w || 0));

        // 簡單的歐氏時空距離模型
        return Math.sqrt(Math.pow(dt, 2) + Math.pow(dt, 2));
    }

    /**
     * 琥珀封存 (Amber Freeze) 狀態下檢驗證明
     */
    public static verifyProof(st: IOmniSpaceTime): boolean {
        const originalSignature = st.proof.signature;
        const currentSignature = this.generateSignature(st);
        return originalSignature === currentSignature;
    }
}

/** 📍 ost: 全域時空座標單例 */
export const ost = OmniSpaceTime;
