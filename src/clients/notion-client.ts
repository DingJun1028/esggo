// Notion client placeholder
export class NotionClient {
  async getCardState(uuid: string) {
    return { uuid, timestamp: Date.now(), version: '8.5.0' };
  }
}