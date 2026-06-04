import { createHash, randomBytes, createHmac } from 'crypto';
// ============================================
// 強化雜湊算法 - 支援 SHA-512 和 ZKP 驗證
// ============================================
export var HashAlgorithm;
(function (HashAlgorithm) {
    HashAlgorithm["SHA256"] = "sha256";
    HashAlgorithm["SHA512"] = "sha512";
    HashAlgorithm["BLAKE3"] = "blake3";
})(HashAlgorithm || (HashAlgorithm = {}));
export var ZKPDifficulty;
(function (ZKPDifficulty) {
    ZKPDifficulty[ZKPDifficulty["LOW"] = 2] = "LOW";
    ZKPDifficulty[ZKPDifficulty["MEDIUM"] = 4] = "MEDIUM";
    ZKPDifficulty[ZKPDifficulty["HIGH"] = 8] = "HIGH"; // 00000000 前綴
})(ZKPDifficulty || (ZKPDifficulty = {}));
export async function computeHash(content, algorithm = HashAlgorithm.SHA512, difficulty = ZKPDifficulty.LOW) {
    const timestamp = new Date();
    if (algorithm === HashAlgorithm.SHA512) {
        const hash = createHash('sha512');
        hash.update(content);
        const hashHex = hash.digest('hex');
        // 生成 ZKP 證明
        let proof;
        if (difficulty > ZKPDifficulty.LOW) {
            proof = generateZKPProof(hashHex, difficulty);
        }
        return {
            hash: hashHex,
            algorithm,
            timestamp,
            difficulty,
            proof
        };
    }
    else {
        // 預設使用 SHA-256
        const hash = createHash('sha256');
        hash.update(content);
        return {
            hash: hash.digest('hex'),
            algorithm: HashAlgorithm.SHA256,
            timestamp
        };
    }
}
// 生成 ZKP 證明
function generateZKPProof(hash, difficulty) {
    const requiredPrefix = '0'.repeat(difficulty);
    let nonce = 0;
    let proof = '';
    do {
        const input = `${hash}:${nonce}`;
        const proofHash = createHash('sha256').update(input).digest('hex');
        proof = proofHash;
        nonce++;
    } while (!proof.startsWith(requiredPrefix));
    return proof;
}
// ============================================
// SHA-512 雜湊（推薦使用）
// ============================================
export async function computeSHA256(content) {
    const result = await computeHash(content, HashAlgorithm.SHA256);
    return result.hash;
}
export async function computeSHA256Async(content) {
    return computeSHA256(content);
}
export async function computeMultiLevelHash(content, metadata) {
    const contentHash = await computeSHA256(content);
    const metadataString = JSON.stringify(sortObjectKeys(metadata));
    const metadataHash = await computeSHA256(metadataString);
    // 組合雜湊：content_hash + metadata_hash
    const combinedHash = await computeSHA256(contentHash + metadataHash);
    return {
        content_hash: contentHash,
        metadata_hash: metadataHash,
        combined_hash: combinedHash,
        algorithm: 'sha256',
        timestamp: new Date(),
    };
}
// ============================================
// 對象鍵排序（確保一致性）
// ============================================
export function sortObjectKeys(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
        const value = obj[key];
        if (value && typeof value === 'object' && !Array.isArray(value)) {
            sorted[key] = sortObjectKeys(value);
        }
        else {
            sorted[key] = value;
        }
    }
    return sorted;
}
// ============================================
// 驗證雜湊
// ============================================
export async function verifyHash(content, expectedHash) {
    const computedHash = await computeSHA256(content);
    return computedHash === expectedHash;
}
// ============================================
// 生成隨機鹽值
// ============================================
export function generateSalt(length = 32) {
    return randomBytes(length).toString('hex');
}
// ============================================
// HMAC 簽名
// ============================================
export async function computeHMAC(content, secret) {
    const hmac = createHmac('sha256', secret);
    hmac.update(content);
    return hmac.digest('hex');
}
export async function verifyHMAC(content, signature, secret) {
    const computedSignature = await computeHMAC(content, secret);
    return computedSignature === signature;
}
// ============================================
// 區塊鏈風格的 Merkle Root
// ============================================
export async function computeMerkleRoot(hashes) {
    if (hashes.length === 0) {
        throw new Error('Cannot compute Merkle root of empty array');
    }
    if (hashes.length === 1) {
        return hashes[0];
    }
    const nextLevel = [];
    for (let i = 0; i < hashes.length; i += 2) {
        const left = hashes[i];
        const right = hashes[i + 1] || left; // 如果是奇數個，複製最後一個
        const combined = await computeSHA256(left + right);
        nextLevel.push(combined);
    }
    return computeMerkleRoot(nextLevel);
}
export async function generateContentFingerprint(content, contentType) {
    const hash = await computeSHA256(content);
    const size = Buffer.isBuffer(content) ? content.length : Buffer.byteLength(content);
    return {
        hash,
        size,
        type: contentType,
        created_at: new Date(),
    };
}
//# sourceMappingURL=hash.utils.js.map