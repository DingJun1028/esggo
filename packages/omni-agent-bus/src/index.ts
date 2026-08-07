/**
 * OmniAgentBus — 入口
 */
export { OmniAgentBus, createBus, bus5TGate } from './bus.js';
export { deployGate, tryLoadForgeT5 } from './deploy-gate.js';
export type { BusHandler, BusMessage, OATaskResult, SubFrameId, IComponentCore } from './types.js';
