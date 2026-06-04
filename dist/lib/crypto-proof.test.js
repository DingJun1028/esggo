"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const secp = __importStar(require("@noble/secp256k1"));
const crypto_1 = require("crypto");
const crypto_proof_1 = require("./crypto-proof");
(0, vitest_1.describe)('OmniCrypto Core - Pedersen Commitment', () => {
    (0, vitest_1.it)('should generate a valid commitment and verify it', async () => {
        const value = 1500; // e.g., 1500 tons of CO2
        const pc = await (0, crypto_proof_1.generatePedersenCommitment)(value);
        (0, vitest_1.expect)(pc.commitment).toBeDefined();
        (0, vitest_1.expect)(pc.blindingFactor).toBeDefined();
        (0, vitest_1.expect)(pc.value).toBe(value);
        const isValid = await (0, crypto_proof_1.verifyPedersenCommitment)(pc.commitment, value, pc.blindingFactor);
        (0, vitest_1.expect)(isValid).toBe(true);
    });
    (0, vitest_1.it)('should support homomorphic addition (v1 + v2 = v_total)', async () => {
        // Component 1: Scope 1 (500)
        const pc1 = await (0, crypto_proof_1.generatePedersenCommitment)(500);
        // Component 2: Scope 2 (300)
        const pc2 = await (0, crypto_proof_1.generatePedersenCommitment)(300);
        // To test homomorphic property: C(v1, r1) + C(v2, r2) = C(v1+v2, r1+r2)
        // We can verify that point addition matches.
        const isValid = (0, crypto_proof_1.verifyCommitmentSum)([pc1.commitment, pc2.commitment], pc1.commitment);
        (0, vitest_1.expect)(isValid).toBe(false);
        // Correct test for verifyCommitmentSum:
        const p1 = secp.Point.fromHex(pc1.commitment);
        const p2 = secp.Point.fromHex(pc2.commitment);
        const pTotal = p1.add(p2);
        const isSumValid = (0, crypto_proof_1.verifyCommitmentSum)([pc1.commitment, pc2.commitment], pTotal.toHex());
        (0, vitest_1.expect)(isSumValid).toBe(true);
    });
    (0, vitest_1.it)('should detect tampering', async () => {
        const pc = await (0, crypto_proof_1.generatePedersenCommitment)(100);
        const isInvalid = await (0, crypto_proof_1.verifyPedersenCommitment)(pc.commitment, 101, pc.blindingFactor);
        (0, vitest_1.expect)(isInvalid).toBe(false);
    });
});
(0, vitest_1.describe)('OmniCrypto Core - Data Masking (L1/L2/L3)', () => {
    (0, vitest_1.it)('L1: 應能將數值轉為區間，並將字串部分遮蔽', () => {
        const numMasked = (0, crypto_proof_1.applyDataMasking)(12345, 'L1');
        (0, vitest_1.expect)(numMasked).toBe('10000 ~ 20000'); // 量級為 10000
        const strMasked = (0, crypto_proof_1.applyDataMasking)('SecretData', 'L1');
        (0, vitest_1.expect)(strMasked).toBe('S********a'); // 保留首尾，中間替換為 *
        const shortStr = (0, crypto_proof_1.applyDataMasking)('Hi', 'L1');
        (0, vitest_1.expect)(shortStr).toBe('**'); // 長度 <= 2 全部遮蔽
    });
    (0, vitest_1.it)('L2: 應能假名化資料，並在持有金鑰時完美還原 (AES-256-GCM)', () => {
        const originalText = 'Sensitive-EMP-001';
        const l2Key = (0, crypto_1.randomBytes)(32);
        // 遮罩加密
        const masked = (0, crypto_proof_1.applyDataMasking)(originalText, 'L2', { l2Key });
        (0, vitest_1.expect)(masked.startsWith('L2::')).toBe(true);
        (0, vitest_1.expect)(masked).not.toContain(originalText); // 密文絕不可包含明文
        // 完美還原
        const unmasked = (0, crypto_proof_1.unmaskL2Data)(masked, l2Key);
        (0, vitest_1.expect)(unmasked).toBe(originalText);
    });
    (0, vitest_1.it)('L2: 當使用錯誤金鑰或密文遭竄改時，還原應失敗並拋出錯誤', () => {
        const l2Key = (0, crypto_1.randomBytes)(32);
        const wrongKey = (0, crypto_1.randomBytes)(32);
        const masked = (0, crypto_proof_1.applyDataMasking)('TopSecret', 'L2', { l2Key });
        (0, vitest_1.expect)(() => (0, crypto_proof_1.unmaskL2Data)(masked, wrongKey)).toThrow(); // 金鑰錯誤
    });
    (0, vitest_1.it)('L3: 應能利用 Salt 進行單向不可逆雜湊 (SHA-256)', () => {
        const originalText = 'user@example.com';
        const salt = 'fixed-salt-123';
        const masked1 = (0, crypto_proof_1.applyDataMasking)(originalText, 'L3', { l3Salt: salt });
        (0, vitest_1.expect)(masked1.startsWith('L3::')).toBe(true);
        const masked2 = (0, crypto_proof_1.applyDataMasking)(originalText, 'L3', { l3Salt: salt });
        // 同樣的 Salt 與輸入，必定產出恆定的 Hash 結果
        (0, vitest_1.expect)(masked1).toBe(masked2);
    });
});
//# sourceMappingURL=crypto-proof.test.js.map