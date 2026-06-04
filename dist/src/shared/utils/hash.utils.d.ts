import type { ContentHash } from '../types/evidence.types';
export declare enum HashAlgorithm {
    SHA256 = "sha256",
    SHA512 = "sha512",
    BLAKE3 = "blake3"
}
export declare enum ZKPDifficulty {
    LOW = 2,// 00 前綴
    MEDIUM = 4,// 0000 前綴
    HIGH = 8
}
export interface HashResult {
    hash: ContentHash;
    algorithm: HashAlgorithm;
    timestamp: Date;
    difficulty?: ZKPDifficulty;
    proof?: string;
}
export declare function computeHash(content: string | Buffer, algorithm?: HashAlgorithm, difficulty?: ZKPDifficulty): Promise<HashResult>;
export declare function computeSHA256(content: string | Buffer): Promise<ContentHash>;
export declare function computeSHA256Async(content: string | Buffer): Promise<ContentHash>;
export interface MultiLevelHash {
    content_hash: ContentHash;
    metadata_hash: string;
    combined_hash: string;
    algorithm: 'sha256';
    timestamp: Date;
}
export declare function computeMultiLevelHash(content: string, metadata: Record<string, unknown>): Promise<MultiLevelHash>;
export declare function sortObjectKeys<T extends Record<string, unknown>>(obj: T): T;
export declare function verifyHash(content: string | Buffer, expectedHash: ContentHash): Promise<boolean>;
export declare function generateSalt(length?: number): string;
export declare function computeHMAC(content: string, secret: string): Promise<string>;
export declare function verifyHMAC(content: string, signature: string, secret: string): Promise<boolean>;
export declare function computeMerkleRoot(hashes: ContentHash[]): Promise<string>;
export interface ContentFingerprint {
    hash: ContentHash;
    size: number;
    type: string;
    created_at: Date;
}
export declare function generateContentFingerprint(content: string | Buffer, contentType: string): Promise<ContentFingerprint>;
//# sourceMappingURL=hash.utils.d.ts.map