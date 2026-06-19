import fs from 'fs';
import path from 'path';

const isServer = typeof window === 'undefined';
const DATA_DIR = isServer ? path.join(process.cwd(), 'data') : '';
const DB_PATH = isServer ? path.join(DATA_DIR, 'ncbdb.json') : '';

// Ensure the data directory exists
if (isServer && !fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize database if not exists
if (isServer && !fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ documents: [], evidenceVault: [], intelHub: [] }, null, 2));
}

/**
 * Evidence Vault v2.0 (Phase 12: 5T + ZKP Protocol)
 * 
 * Implements dual-track storage:
 * 1. Private Track: Encrypted original data (L0)
 * 2. Public Track: ZK-Verified masked data (L1-L3)
 */
export interface EvidenceVaultEntry {
  id: string;
  description: string;
  privateTrack: string; // AES-256 Mock (Base64 + Salt)
  publicTrack: {
    maskedValue: string | number;
    zkProof: string;
    level: string;
    timestamp: number;
  };
  hashLock: string; // The binding hash
}

/**
 * Mock encryption for Private Track
 */
const encrypt = (data: string) => Buffer.from(data).toString('base64');
const decrypt = (data: string) => Buffer.from(data, 'base64').toString('utf-8');

export async function saveToEvidenceVault(entry: Omit<EvidenceVaultEntry, 'privateTrack' | 'hashLock'>, originalValue: string) {
  if (!isServer) return null;
  const dbContent = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

  // Hash Lock Binding: SHA-256 Mock (Combined Proof + Salt)
  const hashLock = `hl_${Buffer.from(`${entry.publicTrack.zkProof}-${originalValue}`).toString('hex').substring(0, 16)}`;

  const fullEntry: EvidenceVaultEntry = {
    ...entry,
    privateTrack: encrypt(originalValue),
    hashLock: hashLock
  };

  dbContent.evidenceVault = dbContent.evidenceVault || [];
  dbContent.evidenceVault.push(fullEntry);

  fs.writeFileSync(DB_PATH, JSON.stringify(dbContent, null, 2));
  return fullEntry;
}

export async function getEvidenceFromVault(id: string, role: string) {
  if (!isServer) return null;
  const dbContent = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  const entry = dbContent.evidenceVault.find((e: EvidenceVaultEntry) => e.id === id);

  if (!entry) return null;

  // Access Control Logic
  if (role === 'internal_board' || role === 'internal_cso') {
    return {
      ...entry,
      value: decrypt(entry.privateTrack),
      isMasked: false
    };
  }

  return {
    ...entry,
    value: entry.publicTrack.maskedValue,
    isMasked: true
  };
}

// Legacy support for report drafts
export async function saveDocumentMetadata(metadata: any) {
  if (!isServer) return;
  const dbContent = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  dbContent.documents.push({
    ...metadata,
    timestamp: Date.now(),
  });
  fs.writeFileSync(DB_PATH, JSON.stringify(dbContent, null, 2));
}


export async function getDocumentMetadata(id: string) {
  if (!isServer) return null;
  const dbContent = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  return dbContent.documents.find((doc: any) => doc.id === id);
}

// Q&A Progress Persistence
export async function saveQAProgress(answers: Record<string, string>, progress: { chapterIndex: number; questionIndex: number }) {
  if (!isServer) return;
  const dbContent = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  dbContent.qaProgress = {
    answers,
    progress,
    timestamp: Date.now()
  };
  fs.writeFileSync(DB_PATH, JSON.stringify(dbContent, null, 2));
}

export async function getQAProgress() {
  if (!isServer) return null;
  const dbContent = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  return dbContent.qaProgress || null;
}

// Intel Hub Persistence (Phase 3)
export async function saveIntelNode(node: any) {
  if (!isServer) return;
  const dbContent = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  dbContent.intelHub = dbContent.intelHub || [];

  // Replace if exists, else push
  const index = dbContent.intelHub.findIndex((n: any) => n.uuid === node.uuid);
  if (index !== -1) {
    dbContent.intelHub[index] = node;
  } else {
    dbContent.intelHub.push(node);
  }

  fs.writeFileSync(DB_PATH, JSON.stringify(dbContent, null, 2));
  return node;
}

export async function getIntelNodes() {
  if (!isServer) return [];
  const dbContent = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  return dbContent.intelHub || [];
}
