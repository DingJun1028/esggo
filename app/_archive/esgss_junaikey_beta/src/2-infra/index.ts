/**
 * 💡 2-Infra Layer: Infrastructure Services (基礎設施層)
 * --------------------------------------------------
 * 統一匯出所有基礎設施服務
 * [版本] Sentient v7.0.0
 * [協議] 5T Sentinel Protocol
 */

// ========== Logging ==========
export {
  omniLogger,
  OmniLoggerService,
  LogLevel,
  LogCategory,
  logKernelEvent,
  kernelLogs$,
  type IOmniLogPayload,
  type LogEntry,
  type KernelLog,
} from '../omni/infrastructure/logging/OmniLogger';

// ========== Resonance ==========
export { OmniResonance } from './resonance/OmniResonance';

// ========== Broadcast (Event System) ==========
export { awakeningBroadcaster } from '../omni/infrastructure/broadcast/AwakeningBroadcaster';

// ========== Memory ==========
// ========== Memory ==========
export * from './memory/EternalMemory';
export { useOmniMemory } from './memory/OmniMemory';
