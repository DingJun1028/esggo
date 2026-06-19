import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.js';

/**
 * 🔑 OmniKeyService: True Cryptographic Binding
 * Implements the 5T [Trustworthy] protocol using WebCrypto API.
 * Ensures knowledge assets and game state are signed by a unique player key.
 */
export class OmniKeyService {
    private static instance: OmniKeyService;
    private keyPair: CryptoKeyPair | null = null;
    private readonly DB_NAME = 'OmniKeyStore';
    private readonly STORE_NAME = 'keys';
    private readonly KEY_ID = 'player_identity';

    private constructor() {
        omniLogger.info(LogCategory.SYSTEM, '[TRUST] 🛡️ OmniKey Service Initializing...');
    }

    public static getInstance(): OmniKeyService {
        if (!OmniKeyService.instance) {
            OmniKeyService.instance = new OmniKeyService();
        }
        return OmniKeyService.instance;
    }

    /**
     * Initialize or retrieve the cryptographic identity.
     */
    public async initializeIdentity(): Promise<void> {
        const existingKey = await this.loadKeyFromDB();
        if (existingKey) {
            this.keyPair = existingKey;
            omniLogger.info(LogCategory.SYSTEM, '[TRUST] ✅ Existing Identity Key loaded.');
        } else {
            this.keyPair = await this.generateNewKeyPair();
            await this.saveKeyToDB(this.keyPair);
            omniLogger.info(LogCategory.SYSTEM, '[TRUST] ✨ New Identity Key generated and bound.');
        }
    }

    private async generateNewKeyPair(): Promise<CryptoKeyPair> {
        return await window.crypto.subtle.generateKey(
            {
                name: "ECDSA",
                namedCurve: "P-256",
            },
            true, // extractable
            ["sign", "verify"]
        );
    }

    public async signData(data: any): Promise<string> {
        if (!this.keyPair) await this.initializeIdentity();
        if (!this.keyPair) throw new Error("Key generation failed");

        const msgBuffer = new TextEncoder().encode(JSON.stringify(data));
        const signatureBuffer = await window.crypto.subtle.sign(
            {
                name: "ECDSA",
                hash: { name: "SHA-256" },
            },
            this.keyPair.privateKey,
            msgBuffer
        );

        const hashArray = Array.from(new Uint8Array(signatureBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Returns the public key as a Base64 string for storage and transmission.
     */
    public async getPublicKeyString(): Promise<string | null> {
        if (!this.keyPair) await this.initializeIdentity();
        if (!this.keyPair) return null;

        const exported = await window.crypto.subtle.exportKey(
            "spki",
            this.keyPair.publicKey
        );
        return btoa(String.fromCharCode(...new Uint8Array(exported)));
    }

    public async verifySignature(data: any, signature: string, publicKeyStr: string): Promise<boolean> {
        const msgBuffer = new TextEncoder().encode(JSON.stringify(data));
        const sigBuffer = new Uint8Array(signature.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));

        // Import the public key from Base64 string
        const binaryDerString = window.atob(publicKeyStr);
        const binaryDer = new Uint8Array(binaryDerString.length);
        for (let i = 0; i < binaryDerString.length; i++) {
            binaryDer[i] = binaryDerString.charCodeAt(i);
        }

        const publicKey = await window.crypto.subtle.importKey(
            "spki",
            binaryDer.buffer,
            {
                name: "ECDSA",
                namedCurve: "P-256",
            },
            true,
            ["verify"]
        );

        return await window.crypto.subtle.verify(
            {
                name: "ECDSA",
                hash: { name: "SHA-256" },
            },
            publicKey,
            sigBuffer,
            msgBuffer
        );
    }

    public getRawPublicKey(): CryptoKey | null {
        return this.keyPair?.publicKey || null;
    }

    // --- IndexedDB Persistence ---

    private async loadKeyFromDB(): Promise<CryptoKeyPair | null> {
        return new Promise((resolve) => {
            if (typeof indexedDB === 'undefined') return resolve(null);
            const request = indexedDB.open(this.DB_NAME, 1);
            request.onupgradeneeded = () => {
                request.result.createObjectStore(this.STORE_NAME);
            };
            request.onsuccess = () => {
                const db = request.result;
                const tx = db.transaction(this.STORE_NAME, 'readonly');
                const store = tx.objectStore(this.STORE_NAME);
                const getReq = store.get(this.KEY_ID);
                getReq.onsuccess = () => resolve(getReq.result || null);
                getReq.onerror = () => resolve(null);
            };
            request.onerror = () => resolve(null);
        });
    }

    private async saveKeyToDB(keyPair: CryptoKeyPair): Promise<void> {
        return new Promise((resolve, reject) => {
            if (typeof indexedDB === 'undefined') return reject(new Error("IndexedDB not available"));
            const request = indexedDB.open(this.DB_NAME, 1);
            request.onsuccess = () => {
                const db = request.result;
                const tx = db.transaction(this.STORE_NAME, 'readwrite');
                const store = tx.objectStore(this.STORE_NAME);
                store.put(keyPair, this.KEY_ID);
                tx.oncomplete = () => resolve();
                tx.onerror = () => reject();
            };
            request.onerror = () => reject();
        });
    }
}

export const omniKeyService = OmniKeyService.getInstance();
