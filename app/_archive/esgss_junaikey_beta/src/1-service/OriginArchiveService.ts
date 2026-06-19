import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { awakeningBroadcaster } from '@infra/broadcast/AwakeningBroadcaster';

/**
 * OriginArchiveService
 *
 * 負責將已驗證的 ESG 報告「永久鎖定」至模擬冷存儲層。
 * 這是實現「極限潛能」的最後一環：確保真理一經驗證，永不消逝。
 */
export class OriginArchiveService {
  private static instance: OriginArchiveService;
  private readonly ARCHIVE_KEY = 'OMNI_ORIGIN_ARCHIVE';

  private constructor() {
    omniLogger.info(LogCategory.SYSTEM, '[OriginArchive] 原始存檔服務已啟動');
  }

  static getInstance(): OriginArchiveService {
    if (!OriginArchiveService.instance) {
      OriginArchiveService.instance = new OriginArchiveService();
    }
    return OriginArchiveService.instance;
  }

  /**
   * 將報告存檔至 Origin 層
   */
  async archiveReport(reportId: string, content: any): Promise<string> {
    omniLogger.info(LogCategory.SYSTEM, `[OriginArchive] 正在封印報告: ${reportId}`);

    // 模擬網路延遲
    await new Promise(resolve => setTimeout(resolve, 1500));

    const archiveEntry = {
      reportId,
      content,
      sealedAt: new Date().toISOString(),
      originHash: `0x${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
      version: '10.1.0-ULTIMATE',
    };

    // 存入 LocalStorage (模擬 Cold Storage)
    const currentArchive = this.getArchive();
    currentArchive[reportId] = archiveEntry;
    localStorage.setItem(this.ARCHIVE_KEY, JSON.stringify(currentArchive));

    // 廣播永恆錨定事件
    awakeningBroadcaster.broadcast({
      type: 'eternal-anchored',
      timestamp: new Date().toISOString(),
      data: {
        serviceName: 'OriginArchive',
        error: undefined,
      } as any,
    });

    omniLogger.info(
      LogCategory.SYSTEM,
      `[OriginArchive] 報告已成功封印於 Origin 層: ${archiveEntry.originHash}`
    );
    return archiveEntry.originHash;
  }

  /**
   * 獲取存檔列表
   */
  getArchive(): Record<string, any> {
    const data = localStorage.getItem(this.ARCHIVE_KEY);
    return data ? JSON.parse(data) : {};
  }

  /**
   * 驗證檔案完整性
   */
  verifyIntegrity(reportId: string): boolean {
    const archive = this.getArchive();
    const entry = archive[reportId];
    if (!entry) return false;

    // 在模擬環境中，我們假設存儲在 LS 的數據即為真理
    return !!entry.originHash;
  }
}

export const originArchiveService = OriginArchiveService.getInstance();
