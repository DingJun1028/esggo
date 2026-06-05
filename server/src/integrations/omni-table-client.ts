// Using internal OmniTable bridge instead of missing @omni-table/client
import { getOmniTableServerClient } from '../../../lib/omni-table';
import * as crypto from 'crypto';

const omniTable = getOmniTableServerClient();

export interface LogicNode {
  name: string;
  compliance_score: number;
  logic_type: string;
  timestamp: string | Date;
  targetSystem: string;
  source_origin?: string;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function withRetry<T>(fn: () => Promise<T>, retries = 3, backoff = 1000): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      console.warn(`[OmniTable] Retrying... (${i + 1}/${retries}) after ${backoff}ms`);
      await delay(backoff);
      backoff *= 2; // exponential backoff
    }
  }
  throw new Error('Unreachable');
}

/**
 * 產生 ZKP Hash Lock 封印
 * (5T Protocol: 信 - Trustworthy)
 */
function generateHashLock(node: any): string {
  const payload = JSON.stringify({
    n: node.name,
    s: node.compliance_score,
    t: node.logic_type,
    ts: node.timestamp,
    sys: node.targetSystem,
    src: node.source_origin
  });
  return crypto.createHash('sha256').update(payload).digest('hex');
}

export async function syncLogicNodesToOmniTable(nodes: LogicNode[]) {
  try {
    const spaceId = process.env.OMNITABLE_SPACE_ID!;
    // In OmniTable Fusion API, we can search for nodes by name
    const existingNodes = await withRetry<any>(() => omniTable.searchNodes(spaceId, 'Logic Nodes'));
    let datasheetId = existingNodes.length > 0 ? existingNodes[0].id : null;
    
    // If datasheet doesn't exist, create it with 5T Protocol Fields
    if (!datasheetId) {
      const created = await withRetry<any>(() => omniTable.createDatasheet(spaceId, {
        name: 'Logic Nodes',
        fields: [
          { name: '節點名稱', type: 'text' },
          { name: '合規分數', type: 'number' },
          { name: '類型', type: 'text' },
          { name: '時間戳', type: 'dateTime' },
          { name: '目標系統', type: 'text' },
          { name: 'source_origin', type: 'text' }, // 真 (Traceable)
          { name: 'hash_lock', type: 'text' }      // 信 (Trustworthy)
        ]
      }));
      datasheetId = created.id;
    }

    // Prepare records for insertion
    const records = nodes.map(node => {
      const source_origin = node.source_origin || 'OmniBlue_Sync_Routine';
      const hash_lock = generateHashLock({ ...node, source_origin });
      
      return {
        fields: {
          '節點名稱': node.name,
          '合規分數': Number(node.compliance_score) || 0,
          '類型': node.logic_type || 'Unknown',
          '時間戳': new Date(node.timestamp).toISOString(),
          '目標系統': node.targetSystem || 'ESG GO',
          'source_origin': source_origin,
          'hash_lock': hash_lock
        }
      };
    });

    // We can't delete all records directly without IDs in OmniTableClient, 
    // so we get them first
    const existingRecords = await withRetry<any>(() => omniTable.getRecords(datasheetId));
    if (existingRecords.records && existingRecords.records.length > 0) {
       await withRetry<any>(() => omniTable.deleteRecords(datasheetId, existingRecords.records.map((r: any) => r.recordId)));
    }
    
    // Chunk array to avoid API limits (e.g., OmniTable batch limit is usually 10)
    const chunkSize = 10;
    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      await withRetry<any>(() => omniTable.createRecords(datasheetId, chunk));
    }
    
    return true;
  } catch (error) {
    console.error('Failed to sync to OmniTable:', error);
    return false;
  }
}