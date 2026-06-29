import { Client } from '@notionhq/client';
import { CelestialController } from '@/lib/celestial/implementation';

export interface ISyncPayload {
  title: string;
  content: string;
  category: string;
}

export class NotionSyncService {
  private client: Client;
  private databaseId: string;
  private celestial = CelestialController.getInstance();

  constructor() {
    this.client = new Client({ auth: process.env.NOTION_API_KEY });
    this.databaseId = process.env.NOTION_DATABASE_ID || '';
  }

  /**
   * 同步 5T 合規資產至 Notion 知識庫
   * @param payload 知識資產內容
   */
  async syncAsset(payload: ISyncPayload): Promise<string> {
    const traceId = this.celestial.initiateFlow('NotionSync');
    
    if (!process.env.NOTION_API_KEY || !this.databaseId) {
      this.celestial.recordMetric('NotionSync.Skipped', 1, { reason: 'Missing Credentials' });
      return 'Skipped (Missing API Key or Database ID)';
    }

    try {
      // Chunk content if too long (simplified block creation)
      const contentBlock = {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: payload.content.substring(0, 2000) // limit for safety
              }
            }
          ]
        }
      };

      const response = await this.client.pages.create({
        parent: { database_id: this.databaseId },
        properties: {
          Title: {
            title: [
              {
                text: {
                  content: payload.title
                }
              }
            ]
          },
          Category: {
            select: {
              name: payload.category
            }
          },
          Status: {
            status: {
              name: 'Trustworthy' // 符合 5T 協議
            }
          }
        },
        children: [contentBlock as any] // 為了避免繁雜的型別宣告暫時用 any
      });

      this.celestial.recordMetric('NotionSync.Success', 1, { pageId: response.id });
      return response.id;
    } catch (error) {
      this.celestial.detectEntropy(traceId, 'NotionAPIError');
      console.error('[NotionSyncService] Failed to sync to Notion:', error);
      throw error;
    }
  }
}
