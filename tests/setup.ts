import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase
vi.mock('../lib/firebase', () => ({
  db: {},
  dataConnect: {
    // Mock the dataConnect object that would be returned from getDataConnect()
    // This is what gets passed to the generated functions
  }
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

// Mock the Data Connect services and generated module using the @ alias
vi.mock('@/lib/dataconnect-services', () => {
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
      // Return the structure that matches what the actual service expects: response.data.eternalMemory_insert
      return { data: { eternalMemory_insert: entry } };
    }),
    dcListEternalMemories: vi.fn().mockImplementation(async () => {
      // Return the structure that matches what the actual service expects: response.data.eternalMemories
      return { data: { eternalMemories: [...store] } };
    }),
    dcUpsertAuditRecord: vi.fn().mockResolvedValue({ id: 'mock-audit-record-id' }),
  };
});

// Mock the generated Data Connect functions
vi.mock('@dataconnect/generated', () => ({
  // Mock the functions
  listReports: vi.fn().mockResolvedValue({ data: { reports: [] } }),
  getReportById: vi.fn().mockResolvedValue({ data: { report: null } }),
  upsertReport: vi.fn().mockResolvedValue({ data: { report_upsert: { id: 'test-report-id' } } }),
  listScrapedArticles: vi.fn().mockResolvedValue({ data: { scrapedArticles: [] } }),
  listAuditRecords: vi.fn().mockResolvedValue({ data: { auditRecords: [] } }),
  listAllTasks: vi.fn().mockResolvedValue({ data: { tasks: [] } }),
  listRoadmapMilestones: vi.fn().mockResolvedValue({ data: { roadmapMilestones: [] } }),
  upsertRoadmapMilestone: vi.fn().mockResolvedValue({ data: { roadmapMilestone_upsert: { id: 'test-milestone-id' } } }),
  getCompanyProfile: vi.fn().mockResolvedValue({ data: { companyProfile: null } }),
  upsertCompanyProfile: vi.fn().mockResolvedValue({ data: { companyProfile_upsert: { id: 'test-company-id' } } }),
  listEternalMemories: vi.fn().mockResolvedValue({ data: { eternalMemories: [] } }),
  insertEternalMemory: vi.fn().mockResolvedValue({ data: { eternalMemory_insert: { id: 'test-eternal-memory-id' } } }),
  upsertEternalMemory: vi.fn().mockResolvedValue({ data: { eternalMemory_upsert: { id: 'test-eternal-memory-id' } } }),
  insertAuditRecord: vi.fn().mockResolvedValue({ data: { auditRecord_insert: { id: 'mock-audit-record-id' } } }),
  listSwarmAgentTasks: vi.fn().mockResolvedValue({ data: { swarmAgentTasks: [] } }),
  upsertSwarmAgentTask: vi.fn().mockResolvedValue({ data: { swarmAgentTask_upsert: { id: 'test-swarm-task-id' } } }),
  listRegulatoryPolicies: vi.fn().mockResolvedValue({ data: { regulatoryPolicies: [] } }),
  
  // Mock the variable types (these are usually empty objects or simple types)
  InsertEternalMemoryVariables: {},
  UpsertSwarmAgentTaskVariables: {},
  InsertAuditRecordVariables: {},
  UpsertCompanyProfileVariables: {},
}));