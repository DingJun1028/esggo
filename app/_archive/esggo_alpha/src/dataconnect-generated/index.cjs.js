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

const createTaskRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTask', inputVars);
}
createTaskRef.operationName = 'CreateTask';
exports.createTaskRef = createTaskRef;

exports.createTask = function createTask(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createTaskRef(dcInstance, inputVars));
}
;

const deleteTaskRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteTask', inputVars);
}
deleteTaskRef.operationName = 'DeleteTask';
exports.deleteTaskRef = deleteTaskRef;

exports.deleteTask = function deleteTask(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteTaskRef(dcInstance, inputVars));
}
;

const updateTaskStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTaskStatus', inputVars);
}
updateTaskStatusRef.operationName = 'UpdateTaskStatus';
exports.updateTaskStatusRef = updateTaskStatusRef;

exports.updateTaskStatus = function updateTaskStatus(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateTaskStatusRef(dcInstance, inputVars));
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

const createAuditRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAuditRecord', inputVars);
}
createAuditRecordRef.operationName = 'CreateAuditRecord';
exports.createAuditRecordRef = createAuditRecordRef;

exports.createAuditRecord = function createAuditRecord(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createAuditRecordRef(dcInstance, inputVars));
}
;

const updateAuditRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateAuditRecord', inputVars);
}
updateAuditRecordRef.operationName = 'UpdateAuditRecord';
exports.updateAuditRecordRef = updateAuditRecordRef;

exports.updateAuditRecord = function updateAuditRecord(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateAuditRecordRef(dcInstance, inputVars));
}
;

const deleteAuditRecordRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteAuditRecord', inputVars);
}
deleteAuditRecordRef.operationName = 'DeleteAuditRecord';
exports.deleteAuditRecordRef = deleteAuditRecordRef;

exports.deleteAuditRecord = function deleteAuditRecord(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteAuditRecordRef(dcInstance, inputVars));
}
;

const listIntelligenceModulesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListIntelligenceModules');
}
listIntelligenceModulesRef.operationName = 'ListIntelligenceModules';
exports.listIntelligenceModulesRef = listIntelligenceModulesRef;

exports.listIntelligenceModules = function listIntelligenceModules(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listIntelligenceModulesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const upsertIntelligenceModuleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertIntelligenceModule', inputVars);
}
upsertIntelligenceModuleRef.operationName = 'UpsertIntelligenceModule';
exports.upsertIntelligenceModuleRef = upsertIntelligenceModuleRef;

exports.upsertIntelligenceModule = function upsertIntelligenceModule(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertIntelligenceModuleRef(dcInstance, inputVars));
}
;

const listIntelligenceSourcesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListIntelligenceSources');
}
listIntelligenceSourcesRef.operationName = 'ListIntelligenceSources';
exports.listIntelligenceSourcesRef = listIntelligenceSourcesRef;

exports.listIntelligenceSources = function listIntelligenceSources(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listIntelligenceSourcesRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const upsertIntelligenceSourceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertIntelligenceSource', inputVars);
}
upsertIntelligenceSourceRef.operationName = 'UpsertIntelligenceSource';
exports.upsertIntelligenceSourceRef = upsertIntelligenceSourceRef;

exports.upsertIntelligenceSource = function upsertIntelligenceSource(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertIntelligenceSourceRef(dcInstance, inputVars));
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

const upsertReportSectionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertReportSection', inputVars);
}
upsertReportSectionRef.operationName = 'UpsertReportSection';
exports.upsertReportSectionRef = upsertReportSectionRef;

exports.upsertReportSection = function upsertReportSection(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertReportSectionRef(dcInstance, inputVars));
}
;

const getReportSectionsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetReportSections', inputVars);
}
getReportSectionsRef.operationName = 'GetReportSections';
exports.getReportSectionsRef = getReportSectionsRef;

exports.getReportSections = function getReportSections(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(getReportSectionsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listCompanyMetricRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListCompanyMetric', inputVars);
}
listCompanyMetricRef.operationName = 'ListCompanyMetric';
exports.listCompanyMetricRef = listCompanyMetricRef;

exports.listCompanyMetric = function listCompanyMetric(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listCompanyMetricRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
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

const listIntelligenceSignalsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListIntelligenceSignals');
}
listIntelligenceSignalsRef.operationName = 'ListIntelligenceSignals';
exports.listIntelligenceSignalsRef = listIntelligenceSignalsRef;

exports.listIntelligenceSignals = function listIntelligenceSignals(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listIntelligenceSignalsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const upsertIntelligenceSignalRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertIntelligenceSignal', inputVars);
}
upsertIntelligenceSignalRef.operationName = 'UpsertIntelligenceSignal';
exports.upsertIntelligenceSignalRef = upsertIntelligenceSignalRef;

exports.upsertIntelligenceSignal = function upsertIntelligenceSignal(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertIntelligenceSignalRef(dcInstance, inputVars));
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
