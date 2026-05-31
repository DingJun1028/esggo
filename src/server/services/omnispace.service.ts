/**
 * OmniSpace Service
 * 萬能空間核心服務層：真理狀態重建、卡牌自癒調和、ZKP 封印作業
 */

import { spawn } from 'child_process';
import { TRPCError } from '@trpc/server';
import { globalHealingService } from '../healing/GlobalHealingServer';
import { OmniCard, OmniCardSchema } from '@/src/shared/types';
import { ErrorCode } from '@/src/shared/types/api.types';

export class OmniSpaceService {

  /**
   * 取得指定卡牌的真理狀態
   * @param uuid 卡牌唯一溯源 ID
   */
  getTruthState(uuid: string): unknown {
    if (!uuid) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'uuid is required',
        cause: ErrorCode.VALIDATION_ERROR,
      });
    }
    const eventStore = globalHealingService.getEventStore();
    return eventStore.rebuildTruthState(uuid);
  }

  /**
   * 觸發全域自癒引擎進行卡牌狀態調和
   * @param card OmniCard 卡牌快照
   */
  async healCard(card: OmniCard) {
    const validated = OmniCardSchema.parse(card);
    return globalHealingService.healCard(validated, 'LV2_AUTO_HEAL');
  }

  /**
   * 呼叫底層 CLI 進行 ZKP 封印
   * @param documentId 證據文件 ID
   */
  async sealDocument(documentId: string) {
    const id = this.validateDocumentId(documentId);

    return new Promise<{ success: boolean; stdout?: string; stderr?: string; error?: string }>((resolve) => {
      const child = spawn(
        process.execPath,
        ['cli/omni.mjs', 'vault', 'seal', id],
        {
          cwd: process.cwd(),
          stdio: ['pipe', 'pipe', 'pipe'],
          timeout: 30_000,
        }
      );

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data: Buffer) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      child.on('error', (err: Error) => {
        resolve({
          success: false,
          error: err.message,
        });
      });

      child.on('close', (code: number | null) => {
        if (code === 0) {
          resolve({
            success: true,
            stdout: stdout.trim(),
            stderr: stderr.trim() || undefined,
          });
        } else {
          const errorMessage = stderr.trim() || `CLI exited with code ${code}`;
          resolve({
            success: false,
            error: errorMessage,
          });
        }
      });
    });
  }

  /**
   * 驗證文件 ID 格式，防止命令注入
   */
  private validateDocumentId(id: string): string {
    if (!id || typeof id !== 'string') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'documentId must be a non-empty string',
        cause: ErrorCode.VALIDATION_ERROR,
      });
    }

    const trimmed = id.trim();

    if (trimmed.length === 0) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'documentId cannot be empty',
        cause: ErrorCode.VALIDATION_ERROR,
      });
    }

    return trimmed;
  }
}

export const omniSpaceService = new OmniSpaceService();
