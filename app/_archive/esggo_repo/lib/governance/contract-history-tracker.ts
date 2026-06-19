/**
 * 合約變更歷史追蹤 (Contract Change History Tracker)
 * 維護型別變更的時間軸記錄，確保治理可追溯
 */

export interface ContractChangeEvent {
  timestamp: string;
  file: string;
  changeType: 'added' | 'modified' | 'removed';
  schemaName: string;
  commitHash?: string;
  author?: string;
}

const contractHistory: ContractChangeEvent[] = [];

export function recordContractChange(event: ContractChangeEvent) {
  contractHistory.push({
    ...event,
    timestamp: new Date().toISOString()
  });
}

export function getContractHistory(): ContractChangeEvent[] {
  return [...contractHistory];
}

export function exportHistoryToADR(): string {
  const history = getContractHistory();
  return `
## Contract Evolution Timeline

| Timestamp | File | Change Type | Schema |
|-----------|------|-------------|--------|
${history.map(h => `| ${h.timestamp} | ${h.file} | ${h.changeType} | ${h.schemaName} |`).join('\n')}
`;
}