import { IOmniInfoCore, IOmniInfoNode, IOmniInfoAura } from '../../0-domain/contracts/IComponentCore';
import { omniLogger, LogCategory } from '../../omni/infrastructure/logging/OmniLogger';

/**
 * 奧�?資�?節點�?�?(OmniInfoNode Logic)
 * --------------------------------------------------
 * [中�?] 負責治�?驗�??�自?�修復�?
 */
export class OmniInfoNodeService {
    /**
     * ?��?治�?驗�? (The Lock)
     * ?�裡?��??�零幻覺驗�??��? $R_s$ ?�鳴計�???
     */
    public static async process(core: IOmniInfoCore, options: { entropyControl: number; healing: boolean }): Promise<number> {
        omniLogger.info(LogCategory.SYSTEM, `[OmniInfoNode] Processing core DNA: ${core.uuid}`);

        // 模擬 Rs ?�鳴?��?�?(?��?對�?�?
        // ?��?標籤?�屬?��??�度等進�?賦�?
        let resonance = 0.85; // ?��?對�?�?

        if (core.hash_lock) resonance += 0.05;
        if (core.rpgStats && core.vitals) resonance += 0.05;
        if (options.healing) {
            omniLogger.info(LogCategory.SYSTEM, `[OmniInfoNode] Self-healing initiated for entropy: ${options.entropyControl}`);
            resonance += 0.05;
        }

        return Math.min(resonance, 1.0);
    }
}

/**
 * 奧�?資�?表現?�輯 (OmniInfoAura Logic)
 * --------------------------------------------------
 * [宏�?] 負責?�維顯�??��?覺�??��?饋�?
 */
export class OmniInfoAuraService {
    /**
     * 觸發顯�??��?(Manifestation)
     */
    public static async manifest(config: { resonanceValue: number; style: string; action: string }): Promise<IOmniInfoAura & { manifested: boolean; visualEffect: string; timestamp: number }> {
        const luminosity = Math.floor(config.resonanceValue * 100);
        const color = config.resonanceValue >= 0.9 ? '#00FFFF' : '#FFD700';

        omniLogger.info(LogCategory.SYSTEM, `[OmniInfoAura] Manifesting Liquid Glass: Rs=${config.resonanceValue}, Lum=${luminosity}%`);

        return {
            manifested: true,
            resonance_rs: config.resonanceValue,
            color,
            luminosity,
            visualEffect: config.action,
            timestamp: Date.now()
        };
    }
}

