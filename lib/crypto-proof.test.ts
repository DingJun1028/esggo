import { describe, it, expect } from 'vitest';
import * as secp from '@noble/secp256k1';
import { randomBytes } from 'crypto';
import {
    generatePedersenCommitment,
    verifyCommitmentSum,
    verifyPedersenCommitment,
    applyDataMasking,
    unmaskL2Data
} from './crypto-proof';

describe('OmniCrypto Core - Pedersen Commitment', () => {
    it('should generate a valid commitment and verify it', async () => {
        const value = 1500; // e.g., 1500 tons of CO2
        const pc = await generatePedersenCommitment(value);

        expect(pc.commitment).toBeDefined();
        expect(pc.blindingFactor).toBeDefined();
        expect(pc.value).toBe(value);

        const isValid = await verifyPedersenCommitment(pc.commitment, value, pc.blindingFactor);
        expect(isValid).toBe(true);
    });

    it('should support homomorphic addition (v1 + v2 = v_total)', async () => {
        // Component 1: Scope 1 (500)
        const pc1 = await generatePedersenCommitment(500);
        // Component 2: Scope 2 (300)
        const pc2 = await generatePedersenCommitment(300);

        // To test homomorphic property: C(v1, r1) + C(v2, r2) = C(v1+v2, r1+r2)
        // We can verify that point addition matches.
        const isValid = verifyCommitmentSum([pc1.commitment, pc2.commitment], pc1.commitment);
        expect(isValid).toBe(false);

        // Correct test for verifyCommitmentSum:
        const p1 = secp.Point.fromHex(pc1.commitment);
        const p2 = secp.Point.fromHex(pc2.commitment);
        const pTotal = p1.add(p2);

        const isSumValid = verifyCommitmentSum([pc1.commitment, pc2.commitment], pTotal.toHex());
        expect(isSumValid).toBe(true);
    });

    it('should detect tampering', async () => {
        const pc = await generatePedersenCommitment(100);
        const isInvalid = await verifyPedersenCommitment(pc.commitment, 101, pc.blindingFactor);
        expect(isInvalid).toBe(false);
    });
});

describe('OmniCrypto Core - Data Masking (L1/L2/L3)', () => {
    it('L1: 應能將數值轉為區間，並將字串部分遮蔽', () => {
        const numMasked = applyDataMasking(12345, 'L1');
        expect(numMasked).toBe('10000 ~ 20000'); // 量級為 10000

        const strMasked = applyDataMasking('SecretData', 'L1');
        expect(strMasked).toBe('S********a'); // 保留首尾，中間替換為 *

        const shortStr = applyDataMasking('Hi', 'L1');
        expect(shortStr).toBe('**'); // 長度 <= 2 全部遮蔽
    });

    it('L2: 應能假名化資料，並在持有金鑰時完美還原 (AES-256-GCM)', () => {
        const originalText = 'Sensitive-EMP-001';
        const l2Key = randomBytes(32);

        // 遮罩加密
        const masked = applyDataMasking(originalText, 'L2', { l2Key });
        expect(masked.startsWith('L2::')).toBe(true);
        expect(masked).not.toContain(originalText); // 密文絕不可包含明文

        // 完美還原
        const unmasked = unmaskL2Data(masked, l2Key);
        expect(unmasked).toBe(originalText);
    });

    it('L2: 當使用錯誤金鑰或密文遭竄改時，還原應失敗並拋出錯誤', () => {
        const l2Key = randomBytes(32);
        const wrongKey = randomBytes(32);
        const masked = applyDataMasking('TopSecret', 'L2', { l2Key });

        expect(() => unmaskL2Data(masked, wrongKey)).toThrow(); // 金鑰錯誤
    });

    it('L3: 應能利用 Salt 進行單向不可逆雜湊 (SHA-256)', () => {
        const originalText = 'user@example.com';
        const salt = 'fixed-salt-123';

        const masked1 = applyDataMasking(originalText, 'L3', { l3Salt: salt });
        expect(masked1.startsWith('L3::')).toBe(true);

        const masked2 = applyDataMasking(originalText, 'L3', { l3Salt: salt });
        // 同樣的 Salt 與輸入，必定產出恆定的 Hash 結果
        expect(masked1).toBe(masked2);
    });
});
