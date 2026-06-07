import { OmniTableClient } from '../../src/clients/omni-table-client';
import { blueCC } from '../services/omni-blue';
import { omniAgentBus } from '../agents/omni-commander';

/**
 * 🌌 OmniTable & OmniBlue Deep Integration Bridge
 * v1.0 | #DataSovereignty #CloudOrchestration #ESGGO
 * 
 * This bridge synchronizes OmniTable records (ESG Metrics) with OmniBlue agent states.
 */
export class OmniTableBlueBridge {
  private aiTable: OmniTableClient;
  private spaceId: string;

  constructor() {
    const apiKey = process.env.OMNITABLE_API_KEY || '';
    this.spaceId = process.env.SPACE_ID || ''; // Using existing SPACE_ID from .env
    this.aiTable = new OmniTableClient(apiKey, this.spaceId);
  }

  /**
   * Sync ESG metrics from OmniTable to OmniBlue Cluster
   * For every metric with a 'Trigger' status, we provision/update an agent on OmniBlue.
   */
  async syncMetricsToCloud(datasheetId: string) {
    console.log(`[Bridge] 🔄 Initiating Sync: OmniTable [${datasheetId}] -> OmniBlue`);
    
    try {
      const result = await this.aiTable.getRecords(datasheetId);
      const records = result.records || [];
      
      console.log(`[Bridge] Found ${records.length} records in OmniTable.`);

      for (const record of records) {
        const fields = record.fields as Record<string, any>;
        const recordId = (record as any).id || (record as any).recordId || 'unknown';
        const metricName = fields['Metric Name'] || fields['Title'] || 'Unknown Metric';
        const status = fields['Status'];

        if (status === 'Deploy' || status === 'Trigger') {
          console.log(`[Bridge] 🚀 Trigger detected for [${metricName}]. Deploying to OmniBlue...`);
          
          const deployment = await blueCC.deployAgent(`esg-sync-${recordId.toLowerCase()}`, {
            metric: metricName,
            value: fields['Value'],
            timestamp: new Date().toISOString()
          });

          omniAgentBus.publish('AGENT_TASK', { 
            agent: 'OmniBlue_Bridge', 
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
   * Update OmniTable with OmniBlue Cluster health
   */
  async reportCloudStatusToOmniTable(datasheetId: string, recordId: string) {
    const status = await blueCC.getSystemStatus();
    
    await this.aiTable.updateRecords(datasheetId, [{
      recordId: recordId,
      fields: {
        'Cloud Status': status.healthy ? 'HEALTHY' : 'ERROR',
        'Active Nodes': status.active_nodes,
        'Last Sync': status.last_sync
      }
    }]);

    console.log(`[Bridge] ✅ Cloud status reported back to OmniTable.`);
  }
}

export const aiTableBlueBridge = new OmniTableBlueBridge();
