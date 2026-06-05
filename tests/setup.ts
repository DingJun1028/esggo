import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase
vi.mock('../lib/firebase', () => ({
  db: {}
}));

// Mock Firebase Firestore
vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
}));

// Mock docx
vi.mock('docx', () => ({
  Document: vi.fn(),
  Paragraph: vi.fn(),
  TextRun: vi.fn(),
  HeadingLevel: {
    TITLE: 'Title',
    HEADING_1: 'Heading1',
    HEADING_2: 'Heading2',
    HEADING_3: 'Heading3',
  },
  Packer: vi.fn(),
}));

// Mock supabase
vi.mock('../lib/supabase', () => ({
  supabase: { channel: vi.fn() },
}));

// Mock better-sqlite3
vi.mock('better-sqlite3');

// Mock LogicRepo to prevent better-sqlite3 resolution issues
vi.mock('../esggo/server/src/storage/LogicRepo');

// Mock Data Connect services to avoid Firebase initialization in tests globally
vi.mock('../esggo/lib/dataconnect-services', () => {
  const store: Record<string, unknown>[] = []; // Local store for this mock
  return {
    dcInsertEternalMemory: vi.fn().mockImplementation(async (input: { id: string; type: string; content: string; tags?: string[]; hashLock: string; consolidated?: boolean; companyId?: string }) => {
      const entry = {
        id: input.id,
        type: input.type,
        content: input.content,
        tags: input.tags,
        hashLock: input.hashLock,
        consolidated: input.consolidated ?? false,
        createdAt: new Date().toISOString(),
        companyId: input.companyId,
      };
      const existing = store.findIndex(m => (m as any).id === input.id);
      if (existing >= 0) store[existing] = entry;
      else store.push(entry);
      return entry;
    }),
    dcListEternalMemories: vi.fn().mockImplementation(async () => {
      return [...store];
    }),
    dcUpsertAuditRecord: vi.fn().mockResolvedValue({ id: 'mock-audit-record-id' }),
  };
});