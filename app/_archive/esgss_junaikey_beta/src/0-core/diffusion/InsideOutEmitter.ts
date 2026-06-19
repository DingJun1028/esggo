import { IOmniInfoCore } from '../../0-domain/contracts/IComponentCore';
import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger';
import { OmniInfoNodeService, OmniInfoAuraService } from './OmniDiffusionServices';

/**
 * OmniInfoOne 萬能擴散器 (InsideOutEmitter)
 * --------------------------------------------------
 * 實現 Inside out, Key to the lock 哲學。
 * 數據從 Inside (Core) 噴發，經過 Node (For/Key) 的過濾與修正，最終在 Aura (One) 中顯現。
 */
export class InsideOutEmitter {
    private lambda: number = 0.1; // 熵減係數 (Entropy Reduction Coefficient)

    /**
     * 數據噴發 (Radiation)
     * 將 Core 轉化為 Manifested Aura。
     */
    public async radiate(core: IOmniInfoCore) {
        omniLogger.info(LogCategory.SYSTEM, `🌌 [Inside-Out] Radiating singularity core: ${core.uuid}`);

        // 1. Inside: 鎖定起點 (Key)
        omniLogger.info(LogCategory.SYSTEM, `[Inside] 數據奇點已鎖定 (Source: ${core.source_origin})`);

        // 2. For/4: 穿過節點 (The Lock) - 治理與驗算
        const entropy = core.data?.entropy || 0.5;
        const resonance = await OmniInfoNodeService.process(core, {
            entropyControl: this.lambda,
            healing: true
        });

        // 3. Out/Whole: 觸發 Aura (The One) - 全維顯化
        // 計算擴散強度 Phi(t) = Core_truth * e^(-lambda * Entropy) * Psi_Resonance
        const diffusionStrength = 1.0 * Math.exp(-this.lambda * entropy) * resonance;

        omniLogger.info(LogCategory.SYSTEM, `[Diffusion] Calculated Strength Φ(t): ${diffusionStrength.toFixed(4)}`);

        const aura = await OmniInfoAuraService.manifest({
            resonanceValue: resonance,
            style: "LiquidGlass",
            action: "DiffusionRipple" // 觸發液態玻璃漣漪動畫
        });

        return {
            ...aura,
            source_origin: core.source_origin,
            hash_lock: core.hash_lock,
            resonance_rs: resonance,
            diffusion_phi: diffusionStrength,
            visual_data: true // Indicate visual manifestation is ready
        };
    }
}
