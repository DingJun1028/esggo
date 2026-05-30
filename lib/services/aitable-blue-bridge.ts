import { AITableClient } from '../../src/clients/aitable-client.ts';
import { blueCC } from '../services/blue-cc.ts';
import { omniAgentBus } from '../agents/omni-commander.ts';

/**
 * 🌌 AITable & BlueCC Deep Integration Bridge
 * v1.0 | #DataSovereignty #CloudOrchestration #ESGGO
 * 
 * This bridge synchronizes AITable records (ESG Metrics) with BlueCC agent states.
 */
export class AITableBlueBridge {
  private aiTable: AITableClient;
  private spaceId: string;

  constructor() {
    const apiKey = process.env.AITABLE_API_KEY || '';
    this.spaceId = process.env.SPACE_ID || ''; // Using existing SPACE_ID from .env
    this.aiTable = new AITableClient(apiKey, this.spaceId);
  }

  /**
   * Sync ESG metrics from AITable to BlueCC Cluster
   * For every metric with a 'Trigger' status, we provision/update an agent on BlueCC.
   */
  async syncMetricsToCloud(datasheetId: string) {
    console.log(`[Bridge] 🔄 Initiating Sync: AITable [${datasheetId}] -> BlueCC`);
    
    try {
      const result = await this.aiTable.getRecords(datasheetId);
      const records = result.records || [];
      
      console.log(`[Bridge] Found ${records.length} records in AITable.`);

      for (const record of records) {
        const fields = record.fields;
        const metricName = fields['Metric Name'] || fields['Title'] || 'Unknown Metric';
        const status = fields['Status'];

        if (status === 'Deploy' || status === 'Trigger') {
          console.log(`[Bridge] 🚀 Trigger detected for [${metricName}]. Deploying to BlueCC...`);
          
          const deployment = await blueCC.deployAgent(`esg-sync-${record.id.toLowerCase()}`, {
            metric: metricName,
            value: fields['Value'],
            timestamp: new Date().toISOString()
          });

          omniAgentBus.publish('AGENT_TASK', { 
            agent: 'BlueCC_Bridge', 
            task: `Deployed agent for ${metricName} (ID: ${deployment.deployment_id})` 
          });
        }
      }

      return { success: true, processed: records.length };
    } catch (error) {
      console.error('[Bridge] Sync failed:', error);
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  }

  /**
   * Update AITable with BlueCC Cluster health
   */
  async reportCloudStatusToAITable(datasheetId: string, recordId: string) {
    const status = await blueCC.getSystemStatus();
    
    await this.aiTable.updateRecords(datasheetId, [{
      recordId: recordId,
      fields: {
        'Cloud Status': status.healthy ? 'HEALTHY' : 'ERROR',
        'Active Nodes': status.active_nodes,
        'Last Sync': status.last_sync
      }
    }]);

    console.log(`[Bridge] ✅ Cloud status reported back to AITable.`);
  }
}

export const aiTableBlueBridge = new AITableBlueBridge();
