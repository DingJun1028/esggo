const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'esg-connector',
  service: 'esggov10',
  location: 'asia-east1'
};
exports.connectorConfig = connectorConfig;

const listUserEvidenceRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListUserEvidence');
}
listUserEvidenceRef.operationName = 'ListUserEvidence';
exports.listUserEvidenceRef = listUserEvidenceRef;

exports.listUserEvidence = function listUserEvidence(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listUserEvidenceRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listDashboardMetricsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListDashboardMetrics');
}
listDashboardMetricsRef.operationName = 'ListDashboardMetrics';
exports.listDashboardMetricsRef = listDashboardMetricsRef;

exports.listDashboardMetrics = function listDashboardMetrics(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listDashboardMetricsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const listOcrReviewItemsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListOcrReviewItems');
}
listOcrReviewItemsRef.operationName = 'ListOcrReviewItems';
exports.listOcrReviewItemsRef = listOcrReviewItemsRef;

exports.listOcrReviewItems = function listOcrReviewItems(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listOcrReviewItemsRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const getCurrentUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCurrentUser');
}
getCurrentUserRef.operationName = 'GetCurrentUser';
exports.getCurrentUserRef = getCurrentUserRef;

exports.getCurrentUser = function getCurrentUser(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getCurrentUserRef(dcInstance, inputVars), inputOpts && inputOpts.fetchPolicy);
}
;

const createEvidenceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateEvidence', inputVars);
}
createEvidenceRef.operationName = 'CreateEvidence';
exports.createEvidenceRef = createEvidenceRef;

exports.createEvidence = function createEvidence(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createEvidenceRef(dcInstance, inputVars));
}
;

const createDashboardMetricRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateDashboardMetric', inputVars);
}
createDashboardMetricRef.operationName = 'CreateDashboardMetric';
exports.createDashboardMetricRef = createDashboardMetricRef;

exports.createDashboardMetric = function createDashboardMetric(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createDashboardMetricRef(dcInstance, inputVars));
}
;

const updateOcrReviewItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateOcrReviewItem', inputVars);
}
updateOcrReviewItemRef.operationName = 'UpdateOcrReviewItem';
exports.updateOcrReviewItemRef = updateOcrReviewItemRef;

exports.updateOcrReviewItem = function updateOcrReviewItem(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateOcrReviewItemRef(dcInstance, inputVars));
}
;

const upsertUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertUser', inputVars);
}
upsertUserRef.operationName = 'UpsertUser';
exports.upsertUserRef = upsertUserRef;

exports.upsertUser = function upsertUser(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars);
  return executeMutation(upsertUserRef(dcInstance, inputVars));
}
;
