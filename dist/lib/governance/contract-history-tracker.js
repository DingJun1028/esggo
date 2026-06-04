/**
 * 合約變更歷史追蹤 (Contract Change History Tracker)
 * 維護型別變更的時間軸記錄，確保治理可追溯
 */
const contractHistory = [];
export function recordContractChange(event) {
    contractHistory.push({
        ...event,
        timestamp: new Date().toISOString()
    });
}
export function getContractHistory() {
    return [...contractHistory];
}
export function exportHistoryToADR() {
    const history = getContractHistory();
    return `
## Contract Evolution Timeline

| Timestamp | File | Change Type | Schema |
|-----------|------|-------------|--------|
${history.map(h => `| ${h.timestamp} | ${h.file} | ${h.changeType} | ${h.schemaName} |`).join('\n')}
`;
}
//# sourceMappingURL=contract-history-tracker.js.map