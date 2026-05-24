const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs, makeMemoryCacheProvider } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'esggoalpha',
  location: 'asia-east1'
};
exports.connectorConfig = connectorConfig;
const dataConnectSettings = {
  cacheSettings: {
    cacheProvider: makeMemoryCacheProvider()
  }
};
exports.dataConnectSettings = dataConnectSettings;

const listAllTasksRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllTasks');
}
listAllTasksRef.operationName = 'ListAllTasks';
exports.listAllTasksRef = listAllTasksRef;

exports.listAllTasks = function listAllTasks(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllTasksRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getTaskByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTaskById', inputVars);
}
getTaskByIdRef.operationName = 'GetTaskById';
exports.getTaskByIdRef = getTaskByIdRef;

exports.getTaskById = function getTaskById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getTaskByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const upsertTaskRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertTask', inputVars);
}
upsertTaskRef.operationName = 'UpsertTask';
exports.upsertTaskRef = upsertTaskRef;

exports.upsertTask = function upsertTask(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertTaskRef(dcInstance, inputVars));
}
;

const listAuditRecordsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAuditRecords');
}
listAuditRecordsRef.operationName = 'ListAuditRecords';
exports.listAuditRecordsRef = listAuditRecordsRef;

exports.listAuditRecords = function listAuditRecords(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAuditRecordsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listScrapedArticlesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListScrapedArticles');
}
listScrapedArticlesRef.operationName = 'ListScrapedArticles';
exports.listScrapedArticlesRef = listScrapedArticlesRef;

exports.listScrapedArticles = function listScrapedArticles(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listScrapedArticlesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listRoadmapMilestonesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListRoadmapMilestones');
}
listRoadmapMilestonesRef.operationName = 'ListRoadmapMilestones';
exports.listRoadmapMilestonesRef = listRoadmapMilestonesRef;

exports.listRoadmapMilestones = function listRoadmapMilestones(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listRoadmapMilestonesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const upsertRoadmapMilestoneRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertRoadmapMilestone', inputVars);
}
upsertRoadmapMilestoneRef.operationName = 'UpsertRoadmapMilestone';
exports.upsertRoadmapMilestoneRef = upsertRoadmapMilestoneRef;

exports.upsertRoadmapMilestone = function upsertRoadmapMilestone(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertRoadmapMilestoneRef(dcInstance, inputVars));
}
;

const getCompanyProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCompanyProfile', inputVars);
}
getCompanyProfileRef.operationName = 'GetCompanyProfile';
exports.getCompanyProfileRef = getCompanyProfileRef;

exports.getCompanyProfile = function getCompanyProfile(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getCompanyProfileRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const upsertCompanyProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertCompanyProfile', inputVars);
}
upsertCompanyProfileRef.operationName = 'UpsertCompanyProfile';
exports.upsertCompanyProfileRef = upsertCompanyProfileRef;

exports.upsertCompanyProfile = function upsertCompanyProfile(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertCompanyProfileRef(dcInstance, inputVars));
}
;

const getReportByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetReportById', inputVars);
}
getReportByIdRef.operationName = 'GetReportById';
exports.getReportByIdRef = getReportByIdRef;

exports.getReportById = function getReportById(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getReportByIdRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const upsertReportRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertReport', inputVars);
}
upsertReportRef.operationName = 'UpsertReport';
exports.upsertReportRef = upsertReportRef;

exports.upsertReport = function upsertReport(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertReportRef(dcInstance, inputVars));
}
;

const listReportsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListReports');
}
listReportsRef.operationName = 'ListReports';
exports.listReportsRef = listReportsRef;

exports.listReports = function listReports(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listReportsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listCompanyMetricsByCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCompanyMetricsByCategory', inputVars);
}
listCompanyMetricsByCategoryRef.operationName = 'ListCompanyMetricsByCategory';
exports.listCompanyMetricsByCategoryRef = listCompanyMetricsByCategoryRef;

exports.listCompanyMetricsByCategory = function listCompanyMetricsByCategory(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listCompanyMetricsByCategoryRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const upsertCompanyMetricRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertCompanyMetric', inputVars);
}
upsertCompanyMetricRef.operationName = 'UpsertCompanyMetric';
exports.upsertCompanyMetricRef = upsertCompanyMetricRef;

exports.upsertCompanyMetric = function upsertCompanyMetric(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertCompanyMetricRef(dcInstance, inputVars));
}
;

const upsertScrapedArticleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertScrapedArticle', inputVars);
}
upsertScrapedArticleRef.operationName = 'UpsertScrapedArticle';
exports.upsertScrapedArticleRef = upsertScrapedArticleRef;

exports.upsertScrapedArticle = function upsertScrapedArticle(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertScrapedArticleRef(dcInstance, inputVars));
}
;

const createDemoDataRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateDemoData');
}
createDemoDataRef.operationName = 'CreateDemoData';
exports.createDemoDataRef = createDemoDataRef;

exports.createDemoData = function createDemoData(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createDemoDataRef(dcInstance, inputVars));
}
;
