/**
 * Awakening Protocol Initializer
 *
 * Registers all Omni services to the Ultimate Awakening Protocol at app startup.
 */

import { getUltimateAwakeningProtocol } from '@/omni/protocols/UltimateAwakeningProtocol.ts';
import { BaseAwakeningAdapter } from '@/omni/adapters/AwakeningAdapters.ts';
import { createEternalMemory } from '@/omni/infrastructure/memory/EternalMemory.ts';
import { truthEngine } from '@/omni/services/OmniTruthEngine.ts';
import { esgAwakeningService } from '@/omni/services/OmniEsgManager.ts';
import { omniAltruismEngine } from '@/omni/services/OmniAltruismEngine.ts';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.ts';
import { awakeningStateManager } from '@/omni/infrastructure/state/AwakeningStateManager.ts';
import { awakeningBroadcaster } from '@/omni/infrastructure/broadcast/AwakeningBroadcaster.ts';
import { awakeningScheduler } from '@/omni/infrastructure/scheduler/AwakeningScheduler.ts';
import { junAiKeyService } from '../../../server/services/JunAiKeyService.ts';

/**
 * Initialize Awakening Protocol
 * Registers all awakenable Omni services.
 */
export function initializeAwakeningProtocol() {
  const protocol = getUltimateAwakeningProtocol();

  omniLogger.info(LogCategory.SYSTEM, '[PROTOCOL] Starting Protocol Initialization...');

  // Register Eternal Memory service
  const memoryService = createEternalMemory();
  const memoryAdapter = new BaseAwakeningAdapter('OmniEternalMemory', async () => {
    await memoryService.consolidate();
    await memoryService.forget({ importance: 0.2, accessCount: 0 });
    if (memoryService.enterEternalMode) {
      await memoryService.enterEternalMode();
    }
  });
  protocol.registerService(memoryAdapter);

  // Register other Omni services (using base adapters)
  const services = ['OmniLegionCoordinator', 'OmniAvatarOrchestrator'];

  services.forEach(serviceName => {
    const adapter = new BaseAwakeningAdapter(serviceName);
    protocol.registerService(adapter);
  });

  // Register Truth Engine (Native IAwakenable)
  protocol.registerService(truthEngine);

  // Register ESG Manager (Native IAwakenable)
  protocol.registerService(esgAwakeningService);

  // Register Altruism Engine (Native IAwakenable)
  protocol.registerService(omniAltruismEngine);

  // Register JunAiKey Service (Native IAwakenable - Spirit / Dialogue)
  protocol.registerService(junAiKeyService);

  omniLogger.info(
    LogCategory.SYSTEM,
    `[PROTOCOL] Initialization Complete. ${services.length + 1} services registered.`
  );

  // ========== Self-Awareness / Enlightening Automation Integration ==========

  // 1. Initialize State Manager (Self-Awareness)
  const savedState = awakeningStateManager.getState();
  omniLogger.info(LogCategory.SYSTEM, `[SELF-AWARENESS] Loaded State`, {
    phase: savedState.phase,
    totalAwakenings: savedState.totalAwakenings,
  });

  // 2. Listen to protocol state changes and auto-save (Self-Awareness)
  protocol.on('phase-change', state => {
    awakeningStateManager.saveState(state);
  });
  protocol.on('progress-update', state => {
    awakeningStateManager.saveState(state);
  });

  // 3. Initialize Broadcaster (Enlightening)
  awakeningBroadcaster.shareInsight({
    category: 'performance',
    title: 'Awakening System Started',
    message: `Self-Awareness / Enlightening system fully initialized with ${services.length + 1} registered services`,
    priority: 'medium',
    actionable: false,
  });

  // 4. Start Auto-Awakening Scheduler
  if (savedState.isAutoEnabled) {
    awakeningScheduler.start();
    omniLogger.info(LogCategory.SYSTEM, '[SCHEDULER] Automatic Awakening Enabled');
  }

  return protocol;
}

/**
 * Get Awakening Protocol status
 */
export function getAwakeningStatus() {
  const protocol = getUltimateAwakeningProtocol();
  return protocol.getState();
}

/**
 * Get Self-Awareness / Enlightening statistics
 */
export function getAwakeningAutomationStats() {
  return {
    stateManager: awakeningStateManager.getStatistics(),
    broadcaster: awakeningBroadcaster.getStatistics(),
    scheduler: awakeningScheduler.getStatus(),
  };
}
