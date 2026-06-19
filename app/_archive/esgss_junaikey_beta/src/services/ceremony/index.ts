/**
 * @esgss/jun-ai-ceremony
 * 
 * Antigravity 反重力開發框架
 * W4 聖典執行手冊 - 核心模組
 * 
 * 包含：
 * - AlchemyForge（熵減煉金爐）
 * - SuggestionEngine（淨化建議引擎）
 * - HealingAgent（自癒補強代理）
 * - IComponentCore 規範
 * - 5T 協議實作
 * - UUID 注入系統 (OmniESGcell)
 * - T5TValidator（5T 協議驗證器）
 * - W4CeremonyService（W4 聖典刻印服務）
 */

// ============== Core Interfaces ==============

// IComponentCore 規範
export type {
  IComponentCore,
  ISealedData
} from './core/IComponentCore.js';

export {
  ComponentCoreFactory,
  generateOmniUUID,
  computeHash,
  verifyHashLock,
  createSealedObject
} from './core/IComponentCore.js';

// AlchemyForge - 熵減煉金引擎
export type {
  ResonanceResult,
  AlchemyConfig
} from './core/AlchemyForge.js';

export {
  AlchemyForge,
  createAlchemyForge
} from './core/AlchemyForge.js';

// SuggestionEngine - 淨化建議引擎
export type {
  PurificationSuggestion,
  PurificationActionType,
  PurificationImpact
} from './core/SuggestionEngine.js';

export {
  SuggestionEngine,
  createSuggestionEngine
} from './core/SuggestionEngine.js';

// ============== Agents ==============

// HealingAgent - 自癒補強代理
export type {
  GapResult,
  Gap,
  GapType,
  HealingConfig,
  PurifyResult
} from './agents/HealingAgent.js';

export {
  HealingAgent,
  createHealingAgent
} from './agents/HealingAgent.js';

// ============== Types ==============

// 5T 協議類型
export type {
  IT5TProtocol,
  ITangible,
  ITraceable,
  ITrackable,
  ITransparent,
  ITrustworthy,
  ModificationRecord,
  StateRecord,
  TrackableMetrics,
  AccessControlEntry,
  AuditEntry,
  TrustRecord,
  Certification,
  T5TComplianceResult
} from './types/T5TProtocol.js';

export {
  T5TProtocolFactory
} from './types/T5TProtocol.js';

// ============== T5TValidator ==============

// T5TValidator - 5T 協議驗證器
export type {
  DeepFreezeConfig,
  TamperRecord,
  ComplianceReportConfig,
  T5TValidationDetail
} from './T5TValidator.js';

export {
  T5TValidator,
  createT5TValidator
} from './T5TValidator.js';

// ============== W4CeremonyService ==============

// W4CeremonyService - W4 聖典刻印服務
export type {
  W4CeremonyConfig,
  IW4CeremonyResult,
  FourPillarsData,
  CeremonyProgressCallback
} from './W4CeremonyService.js';

export {
  W4CeremonyService,
  createW4CeremonyService,
  FourPillarsFactory,
  CeremonyPhase
} from './W4CeremonyService.js';

// ============== UUID Injection System ==============

// UUID 注入系統
export type {
  ComponentInjectionConfig,
  InjectedMetadata
} from './UUIDInjector.js';

export {
  UUIDInjector,
  DASHBOARD_COMPONENTS,
  injectNPCCompanionWidgetUUID,
  injectOriginCabinBackgroundUUID,
  injectMyDashboardPageUUID,
  injectAllDashboardComponents,
  generateQuickUUID,
  parseOmniUUID,
  extractTimestampFromUUID
} from './UUIDInjector.js';

// ============== Utility Functions ==============

import { generateOmniUUID, IComponentCore, ISealedData, ComponentCoreFactory } from './core/IComponentCore.js';
import { AlchemyForge } from './core/AlchemyForge.js';
import { HealingAgent } from './agents/HealingAgent.js';
import { W4CeremonyService, IW4CeremonyResult, FourPillarsData } from './W4CeremonyService.js';
import { IT5TProtocol, T5TComplianceResult } from './types/T5TProtocol.js';
import { T5TValidator } from './T5TValidator.js';

/**
 * 為組件注入 OmniUUID
 * 
 * @param component - 要注入 UUID 的組件
 * @param source_origin - 來源標識
 * @returns 注入後的組件
 */
export function injectOmniUUID<T extends Record<string, unknown>>(
  component: T,
  source_origin: string
): T & { uuid: string; version: string; timestamp: number } {
  return {
    ...component,
    uuid: generateOmniUUID(source_origin),
    version: (component.version as string) || '1.0.0',
    timestamp: (component.timestamp as number) || Date.now()
  };
}

/**
 * 創建完整的密封組件
 * 
 * @param component - 原始組件資料
 * @param source_origin - 來源標識
 * @returns 密封後的組件
 */
export function createSealedComponent<T extends Record<string, unknown>>(
  component: T,
  source_origin: string
): ISealedData {
  const forge = new AlchemyForge();
  return forge.seal(component, source_origin);
}

/**
 * 執行健康檢查
 * 
 * @param components - 要檢查的組件列表
 * @returns 健康檢查結果
 */
export function performHealthCheck(components: IComponentCore[]): {
  scan: (components: IComponentCore[]) => import('./agents/HealingAgent.ts').GapResult;
} {
  const agent = new HealingAgent();
  return {
    scan: (comps) => agent.scan(comps)
  };
}

/**
 * 執行 W4 刻印儀式
 */
export async function executeW4Ceremony(
  pillars: FourPillarsData,
  name: string,
  allianceMembers?: string[]
): Promise<IW4CeremonyResult> {
  const service = new W4CeremonyService({
    name,
    allianceMembers
  });
  return service.executeCeremony(pillars);
}

/**
 * 驗證 5T 合規
 */
export function validateT5TCompliance(protocol: IT5TProtocol): T5TComplianceResult {
  const validator = new T5TValidator();
  return validator.calculateOverallCompliance(protocol);
}

/**
 * 生成 5T 合規報告
 */
export function generateComplianceReport(
  protocol: IT5TProtocol,
  format: 'json' | 'markdown' | 'html' = 'json'
): string {
  const validator = new T5TValidator();
  return validator.generateComplianceReport(protocol, {
    title: '5T Protocol Compliance Report',
    includeRecommendations: true,
    includeHistory: true,
    format
  });
}

// ============== Version Info ==============

export const CEREMONY_VERSION = '1.0.0';
export const CEREMONY_NAME = '@esgss/jun-ai-ceremony';
export const CEREMONY_DESCRIPTION = 'Antigravity 反重力開發框架 - W4 聖典核心模組';
export const W4_INTEGRATION_VERSION = '2.0.0';
export const W4_INTEGRATION_NAME = '@esgss/jun-ai-ceremony/w4-integration';
