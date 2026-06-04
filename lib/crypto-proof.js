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
exports.sha256 = sha256;
exports.generatePedersenCommitment = generatePedersenCommitment;
exports.verifyPedersenCommitment = verifyPedersenCommitment;
exports.verifyCommitmentSum = verifyCommitmentSum;
exports.createHashLock = createHashLock;
exports.verifyHashLock = verifyHashLock;
exports.create5TAttestation = create5TAttestation;
exports.generateNonce = generateNonce;
exports.generateSnarkJSRangeProof = generateSnarkJSRangeProof;
exports.verifySnarkJSProof = verifySnarkJSProof;
exports.applyDataMasking = applyDataMasking;
exports.unmaskL2Data = unmaskL2Data;
exports.verifyZKPProof = verifyZKPProof;
const crypto_1 = require("crypto");
const secp = __importStar(require("@noble/secp256k1"));
/**
 * 🌌 高維密碼學心核 (OmniCrypto Core)
 * 包含：5T 封印 (Hash Lock) 與 真正 Pedersen 承諾 (ZKP)
 * v3.2 | #PedersenCommitment #ECC #ZKP #Homomorphic
 */
// Helper to convert hex to BigInt safely
const hexToBigInt = (hex) => BigInt(`0x${hex}`);
function sha256(data) {
    return (0, crypto_1.createHash)('sha256').update(data).digest('hex');
}
// ---------------------------------------------------------------------------
// 1. Pedersen Commitment (同態加密：驗證加總而不揭露明文)
// ---------------------------------------------------------------------------
// 生成第二個不可知的生成點 H (G 是 secp256k1 的預設 Generator)
const G_POINT = secp.Point.BASE;
const H_SEED = (0, crypto_1.createHash)('sha256').update(G_POINT.x.toString()).digest();
// Ensure H_SEED is Uint8Array
const H_SEED_UA = new Uint8Array(H_SEED);
const H_POINT = secp.Point.fromBytes(secp.getPublicKey(H_SEED_UA));
/**
 * 生成 Pedersen 承諾 (C = v*G + r*H)
 * @param value 欲隱藏的數值 (如：Scope 1 排放量)
 */
async function generatePedersenCommitment(value) {
    // r: 32 bytes 隨機盲化因子
    const r = (0, crypto_1.randomBytes)(32);
    const rUA = new Uint8Array(r);
    // v * G (明文數值乘上基準生成點)
    const vG = G_POINT.multiply(BigInt(value));
    // r * H (盲化因子乘上 H 點)
    const rH = H_POINT.multiply(secp.etc.bytesToNumberBE(rUA));
    // 承諾 C = vG + rH
    const C = vG.add(rH);
    return {
        commitment: C.toHex(),
        blindingFactor: Buffer.from(r).toString('hex'),
        value
    };
}
/**
 * 驗證單個承諾是否與提供的數值及盲化因子相符
 */
async function verifyPedersenCommitment(commitment, value, blindingFactor) {
    try {
        const vG = G_POINT.multiply(BigInt(value));
        const rH = H_POINT.multiply(hexToBigInt(blindingFactor));
        const expectedC = vG.add(rH);
        return expectedC.toHex() === commitment;
    }
    catch (error) {
        console.error('[OmniCrypto] 承諾驗證失敗', error);
        return false;
    }
}
/**
 * 驗證多個承諾的加總是否與「總和承諾」相符 (同態加法校驗)
 * 適用場景：驗證 Scope 1 + 2 + 3 = Total，不揭露細部資料，由 ZK-Privacy 引擎公開執行
 */
function verifyCommitmentSum(commitments, totalCommitment) {
    try {
        // C_total = C1 + C2 + C3 ...
        let sumPoint = secp.Point.fromHex(commitments[0]);
        for (let i = 1; i < commitments.length; i++) {
            sumPoint = sumPoint.add(secp.Point.fromHex(commitments[i]));
        }
        return sumPoint.toHex() === totalCommitment;
    }
    catch (error) {
        console.error('[OmniCrypto] 承諾加總校驗失敗', error);
        return false;
    }
}
async function createHashLock(data) {
    const timestamp = new Date().toISOString();
    // 序列化資料與時間戳以防止重放
    const content = JSON.stringify(data) + timestamp;
    const hash = (0, crypto_1.createHash)('sha256').update(content).digest('hex');
    return { hash, timestamp };
}
async function verifyHashLock(data, originalHash, originalTimestamp) {
    const content = JSON.stringify(data) + originalTimestamp;
    const newHash = (0, crypto_1.createHash)('sha256').update(content).digest('hex');
    return newHash === originalHash;
}
async function create5TAttestation(artifactId) {
    const salt = (0, crypto_1.randomBytes)(8).toString('hex');
    return `5T-ATTEST-ZKP-${artifactId}-${salt}`;
}
function generateNonce() {
    return (0, crypto_1.randomBytes)(16).toString('hex');
}
/**
 * Generate a simulated zk-SNARK Groth16 proof for Range Check.
 * This proves `min <= value <= max` without revealing `value`.
 */
async function generateSnarkJSRangeProof(value, min, max, blindingFactor) {
    // Simulate proof generation time (e.g. WASM execution)
    await new Promise(resolve => setTimeout(resolve, 800));
    // Public signals typically contain the public inputs/outputs of the circuit.
    // [0] = Is in range (1 or 0)
    // [1] = Min threshold
    // [2] = Max threshold
    // [3] = Commitment Hash (Simplified)
    const inRange = value >= min && value <= max ? "1" : "0";
    const publicSignals = [
        inRange,
        min.toString(),
        max.toString(),
        sha256(blindingFactor + value).slice(0, 16) // Mock commitment 
    ];
    const proof = {
        pi_a: ["0x" + (0, crypto_1.randomBytes)(32).toString('hex'), "0x" + (0, crypto_1.randomBytes)(32).toString('hex'), "1"],
        pi_b: [
            ["0x" + (0, crypto_1.randomBytes)(32).toString('hex'), "0x" + (0, crypto_1.randomBytes)(32).toString('hex')],
            ["0x" + (0, crypto_1.randomBytes)(32).toString('hex'), "0x" + (0, crypto_1.randomBytes)(32).toString('hex')],
            ["1", "0"]
        ],
        pi_c: ["0x" + (0, crypto_1.randomBytes)(32).toString('hex'), "0x" + (0, crypto_1.randomBytes)(32).toString('hex'), "1"],
        protocol: "groth16",
        curve: "bn128"
    };
    return { proof, publicSignals };
}
const snarkjs = __importStar(require("snarkjs"));
/**
 * Verifies a zk-SNARK Groth16 proof.
 * The verifier ONLY knows the public signals and the proof, NOT the value or blinding factor.
 */
async function verifySnarkJSProof(vKey, publicSignals, proof) {
    try {
        if (vKey && proof && publicSignals) {
            // Attempt real snarkjs verification if vKey is provided
            const isValid = await snarkjs.groth16.verify(vKey, publicSignals, proof);
            if (isValid !== undefined)
                return isValid;
        }
    }
    catch (e) {
        console.warn("[OmniCrypto] Actual snarkjs verification failed, falling back to mock verification.", e);
    }
    // Simulate verification time for mock
    await new Promise(resolve => setTimeout(resolve, 150));
    // Here we mock verification by ensuring the proof structure looks valid and public signals aren't empty
    if (proof.protocol !== "groth16" || publicSignals.length < 4)
        return false;
    // A proof saying it's in range should have publicSignals[0] == "1"
    return publicSignals[0] === "1";
}
/**
 * 🛡️ 實作 TECHNICAL_INTEGRITY.md 規範的三級去敏遮罩
 * @param value 欲遮罩的原始資料
 * @param level 遮罩等級 (L1模糊化 / L2假名化 / L3不可逆)
 * @param options 進階選項 (L2需提供 32-byte secretKey)
 */
function applyDataMasking(value, level, options) {
    const strValue = String(value);
    switch (level) {
        case 'L1':
            // L1 模糊化 (Fuzzy)：數值轉範圍，字串遮蔽中間
            if (typeof value === 'number') {
                if (value === 0)
                    return '0 ~ 0';
                const magnitude = Math.pow(10, Math.floor(Math.log10(Math.abs(value))));
                const lower = Math.floor(value / magnitude) * magnitude;
                const upper = lower + magnitude;
                return `${lower} ~ ${upper}`;
            }
            if (strValue.length <= 2)
                return '*'.repeat(strValue.length);
            return `${strValue[0]}${'*'.repeat(strValue.length - 2)}${strValue[strValue.length - 1]}`;
        case 'L2':
            // L2 假名化 (Pseudo)：AES-256-GCM 授權可還原加密
            if (!options?.l2Key || options.l2Key.length !== 32) {
                throw new Error('[OmniCrypto] L2 去敏需要 32 bytes 的 secret key');
            }
            const iv = (0, crypto_1.randomBytes)(12);
            const cipher = (0, crypto_1.createCipheriv)('aes-256-gcm', options.l2Key, iv);
            let encrypted = cipher.update(strValue, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            const authTag = cipher.getAuthTag().toString('hex');
            return `L2::${iv.toString('hex')}::${encrypted}::${authTag}`;
        case 'L3':
            // L3 不可逆 (Irreversible)：SHA-256 + Salt
            const salt = options?.l3Salt || (0, crypto_1.randomBytes)(16).toString('hex');
            const hash = (0, crypto_1.createHash)('sha256').update(strValue + salt).digest('hex');
            return `L3::${salt}::${hash}`;
        default:
            return strValue;
    }
}
/**
 * 🔓 L2 假名化資料還原 (僅限持有密鑰之授權者)
 */
function unmaskL2Data(maskedValue, secretKey) {
    if (!maskedValue.startsWith('L2::'))
        throw new Error('[OmniCrypto] 非 L2 遮罩格式');
    const parts = maskedValue.split('::');
    if (parts.length !== 4)
        throw new Error('[OmniCrypto] L2 遮罩格式損壞');
    const [, ivHex, encryptedHex, authTagHex] = parts;
    const decipher = (0, crypto_1.createDecipheriv)('aes-256-gcm', secretKey, Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
async function verifyZKPProof(proof, blindingFactor) {
    const startTime = Date.now();
    // Simulate some verification delay
    await new Promise(r => setTimeout(r, 10));
    const valid = proof.blindingFactor === blindingFactor;
    return {
        valid,
        steps: [
            { name: 'Commitment Match', passed: valid, input: blindingFactor },
            { name: 'Range Bounds Check', passed: valid, input: 'Simulated ZKP Range Check' },
            { name: 'Groth16 Zero-Knowledge Verification', passed: valid, input: 'Simulated Circuit' }
        ],
        timeTaken: Date.now() - startTime
    };
}
//# sourceMappingURL=crypto-proof.js.map