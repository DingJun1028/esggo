"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dcCreateReport = exports.dcUpsertCompanyProfile = exports.dcGetCompanyProfile = exports.dcUpsertMilestone = exports.dcGetRoadmapMilestones = exports.dcGetTasks = exports.dcUpsertAuditRecord = exports.dcListAuditRecords = exports.dcListScrapedArticles = exports.dcGetReportById = exports.dcGetReports = exports.dcListRegulatoryPolicies = exports.dcUpsertSwarmAgentTask = exports.dcListSwarmAgentTasks = exports.dcInsertEternalMemory = exports.dcListEternalMemories = void 0;
const firebase_1 = require("./firebase");
const generated_1 = require("@dataconnect/generated");
/**
 * Data Connect Service Layer
 * This module provides type-safe access to the PostgreSQL backend via GraphQL.
 */
// --- Eternal Memory ---
const dcListEternalMemories = async () => {
    try {
        const response = await (0, generated_1.listEternalMemories)(firebase_1.dataConnect);
        return response.data.eternalMemories;
    }
    catch (error) {
        console.error('Data Connect: Failed to list eternal memories', error);
        return [];
    }
};
exports.dcListEternalMemories = dcListEternalMemories;
const dcInsertEternalMemory = async (input) => {
    try {
        const response = await (0, generated_1.insertEternalMemory)(firebase_1.dataConnect, input);
        return response.data.eternalMemory_insert;
    }
    catch (error) {
        console.error('Data Connect: Failed to insert eternal memory', error);
        throw error;
    }
};
exports.dcInsertEternalMemory = dcInsertEternalMemory;
// --- Swarm Agent Tasks ---
const dcListSwarmAgentTasks = async () => {
    try {
        const response = await (0, generated_1.listSwarmAgentTasks)(firebase_1.dataConnect);
        return response.data.swarmAgentTasks;
    }
    catch (error) {
        console.error('Data Connect: Failed to list swarm agent tasks', error);
        return [];
    }
};
exports.dcListSwarmAgentTasks = dcListSwarmAgentTasks;
const dcUpsertSwarmAgentTask = async (input) => {
    try {
        const response = await (0, generated_1.upsertSwarmAgentTask)(firebase_1.dataConnect, input);
        return response.data.swarmAgentTask_upsert;
    }
    catch (error) {
        console.error('Data Connect: Failed to upsert swarm agent task', error);
        throw error;
    }
};
exports.dcUpsertSwarmAgentTask = dcUpsertSwarmAgentTask;
// --- Regulatory Policies ---
const dcListRegulatoryPolicies = async () => {
    try {
        const response = await (0, generated_1.listRegulatoryPolicies)(firebase_1.dataConnect);
        return response.data.regulatoryPolicies;
    }
    catch (error) {
        console.error('Data Connect: Failed to list regulatory policies', error);
        return [];
    }
};
exports.dcListRegulatoryPolicies = dcListRegulatoryPolicies;
// --- Reports ---
const dcGetReports = async () => {
    try {
        const response = await (0, generated_1.listReports)(firebase_1.dataConnect);
        return response.data.reports;
    }
    catch (error) {
        console.error('Data Connect: Failed to list reports', error);
        return [];
    }
};
exports.dcGetReports = dcGetReports;
const dcGetReportById = async (id) => {
    try {
        const response = await (0, generated_1.getReportById)(firebase_1.dataConnect, { id });
        return response.data.report || null;
    }
    catch (error) {
        console.error(`Data Connect: Failed to get report ${id}`, error);
        return null;
    }
};
exports.dcGetReportById = dcGetReportById;
// --- Intelligence ---
const dcListScrapedArticles = async () => {
    try {
        const response = await (0, generated_1.listScrapedArticles)(firebase_1.dataConnect);
        return response.data.scrapedArticles;
    }
    catch (error) {
        console.error('Data Connect: Failed to list scraped articles', error);
        return [];
    }
};
exports.dcListScrapedArticles = dcListScrapedArticles;
// --- Audit ---
const dcListAuditRecords = async () => {
    try {
        const response = await (0, generated_1.listAuditRecords)(firebase_1.dataConnect);
        return response.data.auditRecords;
    }
    catch (error) {
        console.error('Data Connect: Failed to list audit records', error);
        return [];
    }
};
exports.dcListAuditRecords = dcListAuditRecords;
const dcUpsertAuditRecord = async (input) => {
    try {
        const response = await (0, generated_1.insertAuditRecord)(firebase_1.dataConnect, input);
        return response.data.auditRecord_insert;
    }
    catch (error) {
        console.error('Data Connect: Failed to insert audit record', error);
        throw error;
    }
};
exports.dcUpsertAuditRecord = dcUpsertAuditRecord;
// --- Tasks ---
const dcGetTasks = async () => {
    try {
        const response = await (0, generated_1.listAllTasks)(firebase_1.dataConnect);
        return response.data.tasks;
    }
    catch (error) {
        console.error('Data Connect: Failed to list tasks', error);
        return [];
    }
};
exports.dcGetTasks = dcGetTasks;
// --- Roadmap ---
const dcGetRoadmapMilestones = async () => {
    try {
        const response = await (0, generated_1.listRoadmapMilestones)(firebase_1.dataConnect);
        return response.data.roadmapMilestones;
    }
    catch (error) {
        console.error('Data Connect: Failed to list roadmap milestones', error);
        return [];
    }
};
exports.dcGetRoadmapMilestones = dcGetRoadmapMilestones;
const dcUpsertMilestone = async (input) => {
    try {
        const response = await (0, generated_1.upsertRoadmapMilestone)(firebase_1.dataConnect, {
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
    }
    catch (error) {
        console.error('Data Connect: Failed to upsert milestone', error);
        throw error;
    }
};
exports.dcUpsertMilestone = dcUpsertMilestone;
// --- Company Profile ---
const dcGetCompanyProfile = async (id) => {
    try {
        const response = await (0, generated_1.getCompanyProfile)(firebase_1.dataConnect, { id });
        return response.data.companyProfile || null;
    }
    catch (error) {
        console.error(`Data Connect: Failed to get company profile ${id}`, error);
        return null;
    }
};
exports.dcGetCompanyProfile = dcGetCompanyProfile;
const dcUpsertCompanyProfile = async (input) => {
    try {
        const response = await (0, generated_1.upsertCompanyProfile)(firebase_1.dataConnect, input);
        return response.data.companyProfile_upsert;
    }
    catch (error) {
        console.error('Data Connect: Failed to upsert company profile', error);
        throw error;
    }
};
exports.dcUpsertCompanyProfile = dcUpsertCompanyProfile;
// --- Report Generation ---
const dcCreateReport = async (input) => {
    try {
        const response = await (0, generated_1.upsertReport)(firebase_1.dataConnect, {
            companyId: input.companyId,
            templateId: input.templateId,
            title: input.title,
            language: input.language,
            progress: 0,
            status: 'draft'
        });
        return response.data.report_upsert;
    }
    catch (error) {
        console.error('Data Connect: Failed to create report', error);
        throw error;
    }
};
exports.dcCreateReport = dcCreateReport;
//# sourceMappingURL=dataconnect-services.js.map