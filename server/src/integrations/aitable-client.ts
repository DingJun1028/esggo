// Using internal AITable bridge instead of missing @aitable/client
import { aitable as internalAitClient } from '../../../lib/aitable';

const aitable = internalAitClient;

export interface LogicNode {
  name: string;
  compliance_score: number;
  logic_type: string;
  timestamp: string | Date;
  targetSystem: string;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function withRetry<T>(fn: () => Promise<T>, retries = 3, backoff = 1000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.warn(`[AITable] Retrying... (${i + 1}/${retries}) after ${backoff}ms`);
      await delay(backoff);
      backoff *= 2; // exponential backoff
    }
  }
  throw new Error('Unreachable');
}

export async function syncLogicNodesToAITable(nodes: LogicNode[]) {
  try {
    const space = await withRetry<any>(() => aitable.spaces.getById(process.env.AITABLE_SPACE_ID!));
    let datasheet = await withRetry<any>(() => space.getDatasheetByName('Logic Nodes'));
    
    // If datasheet doesn't exist, create it
    if (!datasheet) {
      datasheet = await withRetry<any>(() => space.createDatasheet({
        name: 'Logic Nodes',
        fields: [
          { name: '節點名稱', type: 'text' },
          { name: '合規分數', type: 'number' },
          { name: '類型', type: 'text' },
          { name: '時間戳', type: 'dateTime' },
          { name: '目標系統', type: 'text' }
        ]
      }));
    }

    // Prepare records for insertion
    const records = nodes.map(node => ({
      fields: {
        '節點名稱': node.name,
        '合規分數': Number(node.compliance_score) || 0,
        '類型': node.logic_type || 'Unknown',
        '時間戳': new Date(node.timestamp).toISOString(),
        '目標系統': node.targetSystem || 'ESG GO'
      }
    }));

    // Upsert records (delete existing and reinsert for simplicity)
    await withRetry<any>(() => datasheet.deleteAllRecords());
    
    // Chunk array to avoid API limits (e.g., AITable batch limit is usually 10)
    const chunkSize = 10;
    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      await withRetry<any>(() => datasheet.createRecords(chunk));
    }
    
    return true;
  } catch (error) {
    console.error('Failed to sync to AITable:', error);
    return false;
  }
}