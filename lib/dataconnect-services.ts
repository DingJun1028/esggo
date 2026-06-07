import { dataConnect } from './firebase';
import { 
  listReports, 
  getReportById, 
  upsertReport,
  listScrapedArticles,
  listAuditRecords,
  listAllTasks,
  listRoadmapMilestones,
  upsertRoadmapMilestone,
  getCompanyProfile,
  upsertCompanyProfile,
  listEternalMemories,
  insertEternalMemory,
  insertAuditRecord,
  listSwarmAgentTasks,
  upsertSwarmAgentTask,
  listRegulatoryPolicies,
} from '@dataconnect/generated';

/**
 * Data Connect Service Layer
 * This module provides type-safe access to the PostgreSQL backend via GraphQL.
 */

// --- Eternal Memory ---
export const dcListEternalMemories = async (): Promise<any> => {
  try {
    const response = await listEternalMemories(dataConnect);
    return response.data.eternalMemories;
  } catch (error) {
    console.error('Data Connect: Failed to list eternal memories', error);
    return [];
  }
};

export const dcInsertEternalMemory = async (input: any) => {
  try {
    const response = await insertEternalMemory(dataConnect, input);
    return response.data.eternalMemory_insert;
  } catch (error) {
    console.error('Data Connect: Failed to insert eternal memory', error);
    throw error;
  }
};

// --- Swarm Agent Tasks ---
export const dcListSwarmAgentTasks = async (): Promise<any> => {
  try {
    const response = await listSwarmAgentTasks(dataConnect);
    return response.data.swarmAgentTasks;
  } catch (error) {
    console.error('Data Connect: Failed to list swarm agent tasks', error);
    return [];
  }
};

export const dcUpsertSwarmAgentTask = async (input: any) => {
  try {
    const response = await upsertSwarmAgentTask(dataConnect, input);
    return response.data.swarmAgentTask_upsert;
  } catch (error) {
    console.error('Data Connect: Failed to upsert swarm agent task', error);
    throw error;
  }
};

// --- Regulatory Policies ---
export const dcListRegulatoryPolicies = async (): Promise<any> => {
  try {
    const response = await listRegulatoryPolicies(dataConnect);
    return response.data.regulatoryPolicies;
  } catch (error) {
    console.error('Data Connect: Failed to list regulatory policies', error);
    return [];
  }
};

// --- Reports ---
export const dcGetReports = async (): Promise<any> => {
  try {
    const response = await listReports(dataConnect);
    return response.data.reports;
  } catch (error) {
    console.error('Data Connect: Failed to list reports', error);
    return [];
  }
};

export const dcGetReportById = async (id: string): Promise<any | null> => {
  try {
    const response = await getReportById(dataConnect, { id });
    return response.data.report || null;
  } catch (error) {
    console.error(`Data Connect: Failed to get report ${id}`, error);
    return null;
  }
};

// --- Intelligence ---
export const dcListScrapedArticles = async (): Promise<any> => {
  try {
    const response = await listScrapedArticles(dataConnect);
    return response.data.scrapedArticles;
  } catch (error) {
    console.error('Data Connect: Failed to list scraped articles', error);
    return [];
  }
};

// --- Audit ---
export const dcListAuditRecords = async (): Promise<any> => {
  try {
    const response = await listAuditRecords(dataConnect);
    return response.data.auditRecords;
  } catch (error) {
    console.error('Data Connect: Failed to list audit records', error);
    return [];
  }
};

export const dcUpsertAuditRecord = async (input: any) => {
  try {
    const response = await insertAuditRecord(dataConnect, input);
    return response.data.auditRecord_insert;
  } catch (error) {
    console.error('Data Connect: Failed to insert audit record', error);
    throw error;
  }
};

// --- Tasks ---
export const dcGetTasks = async (): Promise<any> => {
  try {
    const response = await listAllTasks(dataConnect);
    return response.data.tasks;
  } catch (error) {
    console.error('Data Connect: Failed to list tasks', error);
    return [];
  }
};

// --- Roadmap ---
export const dcGetRoadmapMilestones = async (): Promise<any> => {
  try {
    const response = await listRoadmapMilestones(dataConnect);
    return response.data.roadmapMilestones;
  } catch (error) {
    console.error('Data Connect: Failed to list roadmap milestones', error);
    return [];
  }
};

export const dcUpsertMilestone = async (input: any) => {
  try {
    const response = await upsertRoadmapMilestone(dataConnect, {
      id: input.id,
      title: input.title,
      targetYear: input.targetYear || 2030,
      category: input.category || 'Carbon',
      status: input.status || 'planned',
      targetValue: input.targetValue,
      unit: input.unit,
      sbtiAligned: input.sbtiAligned !== undefined ? input.sbtiAligned : true
    });
    return response.data.roadmapMilestone_upsert;
  } catch (error) {
    console.error('Data Connect: Failed to upsert milestone', error);
    throw error;
  }
};

// --- Company Profile ---
export const dcGetCompanyProfile = async (id: string): Promise<any | null> => {
  try {
    const response = await getCompanyProfile(dataConnect, { id });
    return response.data.companyProfile || null;
  } catch (error) {
    console.error(`Data Connect: Failed to get company profile ${id}`, error);
    return null;
  }
};

export const dcUpsertCompanyProfile = async (input: any) => {
  try {
    const response = await upsertCompanyProfile(dataConnect, input);
    return response.data.companyProfile_upsert;
  } catch (error) {
    console.error('Data Connect: Failed to upsert company profile', error);
    throw error;
  }
};

// --- Report Generation ---
export const dcCreateReport = async (input: {
  companyId: string;
  templateId: string;
  title: string;
  language: string;
}) => {
  try {
    const response = await upsertReport(dataConnect, {
      companyId: input.companyId,
      templateId: input.templateId,
      title: input.title,
      language: input.language,
      progress: 0,
      status: 'draft'
    });
    return response.data.report_upsert;
  } catch (error) {
    console.error('Data Connect: Failed to create report', error);
    throw error;
  }
};
