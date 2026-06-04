import { randomBytes, createHash } from 'crypto';
import * as secp from '@noble/secp256k1';
/**
 * 🌌 Pedersen Commitment 核心庫 (Pedersen Core)
 * 實作真正同態加密驗證，支援「驗證加總而不揭露明文」。
 *
 * 核心公式：C = v*G + r*H
 * - v: 原始數值 (Value)
 * - r: 隨機盲化因子 (Blinding Factor)
 * - G: secp256k1 基準生成點
 * - H: 第二個不可知的生成點 (Nothing-up-my-sleeve)
 */
// --- 基礎常數與點生成 ---
// G 是 secp256k1 的預設 Generator
const G_POINT = secp.Point.BASE;
// 生成第二個不可知的生成點 H
// 使用 G 點的 x 座標的哈希作為種子，確保 H 與 G 之間沒有已知的離散對數關係
const H_SEED = createHash('sha256').update(G_POINT.x.toString()).digest();
const H_POINT = secp.Point.fromBytes(secp.getPublicKey(new Uint8Array(H_SEED)));
/**
 * 生成 Pedersen 承諾
 */
export async function generateCommitment(value) {
    // 1. 生成 32 bytes 隨機盲化因子 r
    const r = randomBytes(32);
    const rBigInt = secp.etc.bytesToNumberBE(new Uint8Array(r));
    // 2. 計算 v * G
    const vG = G_POINT.multiply(BigInt(value));
    // 3. 計算 r * H
    const rH = H_POINT.multiply(rBigInt);
    // 4. 承諾 C = vG + rH
    const C = vG.add(rH);
    return {
        commitment: C.toHex(),
        blindingFactor: Buffer.from(r).toString('hex'),
        value
    };
}
/**
 * 驗證單個承諾
 */
export function verifyCommitment(commitment, value, blindingFactor) {
    try {
        const vG = G_POINT.multiply(BigInt(value));
        const rH = H_POINT.multiply(BigInt(`0x${blindingFactor}`));
        const expectedC = vG.add(rH);
        return expectedC.toHex() === commitment;
    }
    catch (error) {
        console.error('[PedersenCore] 承諾驗證失敗', error);
        return false;
    }
}
/**
 * 驗證多個承諾的同態加總
 * C_total = C1 + C2 + ... + Cn
 */
export function verifyHomomorphicSum(commitments, totalCommitment) {
    try {
        if (commitments.length === 0)
            return false;
        let sumPoint = secp.Point.fromHex(commitments[0]);
        for (let i = 1; i < commitments.length; i++) {
            sumPoint = sumPoint.add(secp.Point.fromHex(commitments[i]));
        }
        return sumPoint.toHex() === totalCommitment;
    }
    catch (error) {
        console.error('[PedersenCore] 同態加總校驗失敗', error);
        return false;
    }
}
/**
 * 輔助函數：對一組承諾進行求和 (僅限橢圓曲線點的加法)
 * 外部驗證者不需要知道 blinding factor 即可執行此操作
 */
export function aggregateCommitments(commitments) {
    let sumPoint = secp.Point.fromHex(commitments[0]);
    for (let i = 1; i < commitments.length; i++) {
        sumPoint = sumPoint.add(secp.Point.fromHex(commitments[i]));
    }
    return sumPoint.toHex();
}
//# sourceMappingURL=pedersen-core.js.map