"use strict";
/**
 * OmniSpace Service
 * 萬能空間核心服務層：真理狀態重建、卡牌自癒調和、ZKP 封印作業
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.omniSpaceService = exports.OmniSpaceService = void 0;
const child_process_1 = require("child_process");
const server_1 = require("@trpc/server");
const GlobalHealingServer_1 = require("../healing/GlobalHealingServer");
const types_1 = require("@/src/shared/types");
const api_types_1 = require("@/src/shared/types/api.types");
class OmniSpaceService {
    /**
     * 取得指定卡牌的真理狀態
     * @param uuid 卡牌唯一溯源 ID
     */
    getTruthState(uuid) {
        if (!uuid) {
            throw new server_1.TRPCError({
                code: 'BAD_REQUEST',
                message: 'uuid is required',
                cause: api_types_1.ErrorCode.VALIDATION_ERROR,
            });
        }
        const eventStore = GlobalHealingServer_1.globalHealingService.getEventStore();
        return eventStore.rebuildTruthState(uuid);
    }
    /**
     * 觸發全域自癒引擎進行卡牌狀態調和
     * @param card OmniCard 卡牌快照
     */
    async healCard(card) {
        const validated = types_1.OmniCardSchema.parse(card);
        return GlobalHealingServer_1.globalHealingService.healCard(validated, 'LV2_AUTO_HEAL');
    }
    /**
     * 呼叫底層 CLI 進行 ZKP 封印
     * @param documentId 證據文件 ID
     */
    async sealDocument(documentId) {
        const id = this.validateDocumentId(documentId);
        return new Promise((resolve) => {
            const child = (0, child_process_1.spawn)(process.execPath, ['cli/omni.mjs', 'vault', 'seal', id], {
                cwd: process.cwd(),
                stdio: ['pipe', 'pipe', 'pipe'],
                timeout: 30000,
            });
            let stdout = '';
            let stderr = '';
            child.stdout.on('data', (data) => {
                stdout += data.toString();
            });
            child.stderr.on('data', (data) => {
                stderr += data.toString();
            });
            child.on('error', (err) => {
                resolve({
                    success: false,
                    error: err.message,
                });
            });
            child.on('close', (code) => {
                if (code === 0) {
                    resolve({
                        success: true,
                        stdout: stdout.trim(),
                        stderr: stderr.trim() || undefined,
                    });
                }
                else {
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
    validateDocumentId(id) {
        if (!id || typeof id !== 'string') {
            throw new server_1.TRPCError({
                code: 'BAD_REQUEST',
                message: 'documentId must be a non-empty string',
                cause: api_types_1.ErrorCode.VALIDATION_ERROR,
            });
        }
        const trimmed = id.trim();
        if (trimmed.length === 0) {
            throw new server_1.TRPCError({
                code: 'BAD_REQUEST',
                message: 'documentId cannot be empty',
                cause: api_types_1.ErrorCode.VALIDATION_ERROR,
            });
        }
        return trimmed;
    }
}
exports.OmniSpaceService = OmniSpaceService;
exports.omniSpaceService = new OmniSpaceService();
//# sourceMappingURL=omnispace.service.js.map