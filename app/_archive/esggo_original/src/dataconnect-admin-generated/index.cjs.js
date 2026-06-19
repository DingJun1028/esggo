const { validateAdminArgs } = require('firebase-admin/data-connect');

const connectorConfig = {
  connector: 'example',
  serviceId: 'esggoalpha',
  location: 'asia-east1'
};
exports.connectorConfig = connectorConfig;

function listAllTasks(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('ListAllTasks', undefined, inputOpts);
}
exports.listAllTasks = listAllTasks;

function getTaskById(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('GetTaskById', inputVars, inputOpts);
}
exports.getTaskById = getTaskById;

function upsertTask(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('UpsertTask', inputVars, inputOpts);
}
exports.upsertTask = upsertTask;

function listAuditRecords(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('ListAuditRecords', undefined, inputOpts);
}
exports.listAuditRecords = listAuditRecords;

function listScrapedArticles(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('ListScrapedArticles', undefined, inputOpts);
}
exports.listScrapedArticles = listScrapedArticles;

function listRoadmapMilestones(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('ListRoadmapMilestones', undefined, inputOpts);
}
exports.listRoadmapMilestones = listRoadmapMilestones;

function upsertRoadmapMilestone(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('UpsertRoadmapMilestone', inputVars, inputOpts);
}
exports.upsertRoadmapMilestone = upsertRoadmapMilestone;

function getCompanyProfile(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('GetCompanyProfile', inputVars, inputOpts);
}
exports.getCompanyProfile = getCompanyProfile;

function upsertCompanyProfile(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('UpsertCompanyProfile', inputVars, inputOpts);
}
exports.upsertCompanyProfile = upsertCompanyProfile;

function getReportById(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('GetReportById', inputVars, inputOpts);
}
exports.getReportById = getReportById;

function upsertReport(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('UpsertReport', inputVars, inputOpts);
}
exports.upsertReport = upsertReport;

function upsertReportSection(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('UpsertReportSection', inputVars, inputOpts);
}
exports.upsertReportSection = upsertReportSection;

function listReportSectionsByReport(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('ListReportSectionsByReport', inputVars, inputOpts);
}
exports.listReportSectionsByReport = listReportSectionsByReport;

function upsertCompanyMetric(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('UpsertCompanyMetric', inputVars, inputOpts);
}
exports.upsertCompanyMetric = upsertCompanyMetric;

function listCompanyMetrics(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('ListCompanyMetrics', inputVars, inputOpts);
}
exports.listCompanyMetrics = listCompanyMetrics;

function upsertEternalMemory(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('UpsertEternalMemory', inputVars, inputOpts);
}
exports.upsertEternalMemory = upsertEternalMemory;

function listEternalMemoriesByCompany(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('ListEternalMemoriesByCompany', inputVars, inputOpts);
}
exports.listEternalMemoriesByCompany = listEternalMemoriesByCompany;

function getReportByCompany(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('GetReportByCompany', inputVars, inputOpts);
}
exports.getReportByCompany = getReportByCompany;

function listReports(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('ListReports', undefined, inputOpts);
}
exports.listReports = listReports;

function upsertScrapedArticle(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('UpsertScrapedArticle', inputVars, inputOpts);
}
exports.upsertScrapedArticle = upsertScrapedArticle;

function listEternalMemories(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('ListEternalMemories', undefined, inputOpts);
}
exports.listEternalMemories = listEternalMemories;

function listSwarmAgentTasks(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('ListSwarmAgentTasks', undefined, inputOpts);
}
exports.listSwarmAgentTasks = listSwarmAgentTasks;

function upsertSwarmAgentTask(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('UpsertSwarmAgentTask', inputVars, inputOpts);
}
exports.upsertSwarmAgentTask = upsertSwarmAgentTask;

function listRegulatoryPolicies(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('ListRegulatoryPolicies', undefined, inputOpts);
}
exports.listRegulatoryPolicies = listRegulatoryPolicies;

function createDemoData(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('CreateDemoData', undefined, inputOpts);
}
exports.createDemoData = createDemoData;

