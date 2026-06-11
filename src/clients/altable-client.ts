// AlTable client placeholder
export class AlTableClient {
  async getCardState(uuid: string) {
    return { uuid, timestamp: Date.now(), version: '8.5.0' };
  }
}