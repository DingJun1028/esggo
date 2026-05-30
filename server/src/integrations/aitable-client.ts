// @ts-ignore
import AITable from '@aitable/client';

const aitable = new AITable({
  token: process.env.AITABLE_TOKEN || '',
  spaceId: process.env.AITABLE_SPACE_ID || '',
  apiBase: 'https://aitable.ai'
});

export async function syncLogicNodesToAITable(nodes: any[]) {
  try {
    const space = await aitable.spaces.getById(process.env.AITABLE_SPACE_ID!);
    let datasheet = await space.getDatasheetByName('Logic Nodes');
    
    // If datasheet doesn't exist, create it
    if (!datasheet) {
      datasheet = await space.createDatasheet({
        name: 'Logic Nodes',
        fields: [
          { name: '節點名稱', type: 'text' },
          { name: '合規分數', type: 'number' },
          { name: '類型', type: 'text' },
          { name: '時間戳', type: 'dateTime' },
          { name: '目標系統', type: 'text' }
        ]
      });
    }

    // Prepare records for insertion
    const records = nodes.map(node => ({
      fields: {
        '節點名稱': node.name,
        '合規分數': node.compliance_score,
        '類型': node.logic_type,
        '時間戳': node.timestamp,
        '目標系統': node.targetSystem
      }
    }));

    // Upsert records (delete existing and reinsert for simplicity)
    await datasheet.deleteAllRecords();
    await datasheet.createRecords(records);
    
    return true;
  } catch (error) {
    console.error('Failed to sync to AITable:', error);
    return false;
  }
}