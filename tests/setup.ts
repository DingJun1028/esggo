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