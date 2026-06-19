import {
  ArenaSyncPayload,
  ISyncVFXService,
  VFXParams,
} from '../../0-domain/contracts/ISyncVFXService.ts';
import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.ts';




/**
 * 🚌 Omni Event Bus (Local WebSocket Simulator)
 * --------------------------------------------------
 * [TC] 本地事件總線，模擬 WebSocket 的廣播與訂閱功能。
 * [EN] Local Event Bus, simulating WebSocket broadcast and subscription.
 */
class OmniEventBus {
  private static instance: OmniEventBus;
  private subscribers: ((payload: ArenaSyncPayload) => void)[] = [];

  public static getInstance(): OmniEventBus {
    if (!OmniEventBus.instance) {
      OmniEventBus.instance = new OmniEventBus();
    }
    return OmniEventBus.instance;
  }

  public subscribe(callback: (payload: ArenaSyncPayload) => void): void {
    this.subscribers.push(callback);
  }

  public publish(payload: ArenaSyncPayload): void {
    // Audit Log for Broad Connectivity
    // omniLogger.info(LogCategory.SYSTEM, '[SyncVFXService] Info', { data: `[OmniBus] 📡 Broadcasting: ${payload.componentId} (VFX: ${payload.vfx.resonanceColor})` });

    this.subscribers.forEach(sub => sub(payload));
  }
}

/**
 * 🎬 SyncVFXService: Broad Presentation & Real-time Sync
 * --------------------------------------------------
 * Bridges the internal core state to the visual rendering layer (VFX/Shader).
 * Now fully integrated with OmniEventBus for true "Broad Connectivity".
 */
export class SyncVFXService implements ISyncVFXService {
  private eventBus = OmniEventBus.getInstance();

  /**
   * Derives pure visual parameters for local preview or partial updates.
   */
  deriveVisuals(core: any): VFXParams {
    return {
      glowIntensity: core.status === 'SEALED' ? 1.0 : (core.omniCrystal?.purity || 0.5),
      resonanceColor: (core.partnerAttributes?.hp || 0) > 8 ? '#00FFEE' : '#FFDD00',
      domainRippleScale: Number((1 + (core.evolutionProfile?.level || 1) * 0.1).toFixed(2)),
      tesseractFold: core.evolutionProfile?.tesseractNodes ? Math.min(1.0, core.evolutionProfile.tesseractNodes * 0.2) : 0,
    };
  }

  prepareSyncPayload(core: any): ArenaSyncPayload {
    // Derive visual parameters from internal state
    const vfx = this.deriveVisuals(core);

    return {
      componentId: core.uuid,
      attributes: core.partnerAttributes,
      vfx,
      timestamp: Date.now(),
    };
  }

  async dispatchSync(payload: ArenaSyncPayload): Promise<void> {
    omniLogger.debug(LogCategory.SYSTEM, `[SyncVFX] Dispatching to OmniBus...`);
    this.eventBus.publish(payload);

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  /**
   * 👂 Allow Frontend Components to Subscribe
   */
  public subscribeToVisuals(callback: (payload: ArenaSyncPayload) => void): void {
    this.eventBus.subscribe(callback);
  }
}
