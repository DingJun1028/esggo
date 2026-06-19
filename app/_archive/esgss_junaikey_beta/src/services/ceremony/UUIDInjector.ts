/**
 * @esgss/jun-ai-ceremony
 * UUID 注入系統 (OmniESGcell)
 * 
 * 為現有組件注入 InfoOne = OmniESGcell = Omnicell 統一識別機制
 * 遵循 W4 聖典執行手冊規範
 */

import { generateOmniUUID, IComponentCore, ComponentCoreFactory } from './core/IComponentCore.js';

/**
 * 組件元數據注入配置
 */
export interface ComponentInjectionConfig {
  /** 組件名稱 */
  component_name: string;
  /** 來源路徑 */
  source_path: string;
  /** 版本號 */
  version?: string;
  /** 自定義來源標識 */
  custom_origin?: string;
}

/**
 * 注入後的組件元數據
 */
export interface InjectedMetadata {
  /** OmniUUID */
  uuid: string;
  /** 版本 */
  version: string;
  /** 時間戳 */
  timestamp: number;
  /** 來源標識 */
  source_origin: string;
  /** 元數據創建時間 */
  created_at: string;
}

/**
 注入器
 * UUID */
export class UUIDInjector {
  private static injectedComponents = new Map<string, InjectedMetadata>();
  
  /**
   * 為組件注入 UUID 和元數據
   */
  static inject<T extends Record<string, unknown>>(
    component: T,
    config: ComponentInjectionConfig
  ): T & InjectedMetadata {
    const source_origin = config.custom_origin || config.source_path;
    const core = ComponentCoreFactory.create(source_origin, config.version);
    
    const metadata: InjectedMetadata = {
      uuid: core.uuid,
      version: core.version,
      timestamp: core.timestamp,
      source_origin: core.source_origin,
      created_at: new Date(core.timestamp).toISOString()
    };
    
    // 存儲注入的元數據
    this.injectedComponents.set(config.component_name, metadata);
    
    // 返回注入後的組件
    return {
      ...component,
      ...metadata
    };
  }
  
  /**
   * 獲取已注入的元數據
   */
  static getMetadata(component_name: string): InjectedMetadata | undefined {
    return this.injectedComponents.get(component_name);
  }
  
  /**
   * 檢查組件是否已注入 UUID
   */
  static hasInjected(component: Record<string, unknown>): boolean {
    return !!component.uuid && typeof component.uuid === 'string' && 
           component.uuid.startsWith('ARIA-CORP-');
  }
  
  /**
   * 驗證組件的 UUID 有效性
   */
  static validateUUID(uuid: string): boolean {
    const pattern = /^ARIA-CORP-[A-F0-9]{8}-[A-F0-9]{8}-[A-F0-9]{12}$/i;
    return pattern.test(uuid);
  }
}

/**
 * 預定義的儀表板組件注入配置
 */
export const DASHBOARD_COMPONENTS = {
  NPCCompanionWidget: {
    component_name: 'NPCCompanionWidget',
    source_path: 'src/components/dashboard/NPCCompanionWidget.tsx',
    version: '1.0.0'
  },
  OriginCabinBackground: {
    component_name: 'OriginCabinBackground',
    source_path: 'src/components/dashboard/OriginCabinBackground.tsx',
    version: '1.0.0'
  },
  MyDashboardPage: {
    component_name: 'MyDashboardPage',
    source_path: 'src/pages/esg/MyDashboardPage.tsx',
    version: '1.0.0'
  }
} as const;

/**
 * 為 NPCCompanionWidget 注入 UUID
 */
export function injectNPCCompanionWidgetUUID<T extends Record<string, unknown>>(
  component: T
): T & InjectedMetadata {
  return UUIDInjector.inject(component, DASHBOARD_COMPONENTS.NPCCompanionWidget);
}

/**
 * 為 OriginCabinBackground 注入 UUID
 */
export function injectOriginCabinBackgroundUUID<T extends Record<string, unknown>>(
  component: T
): T & InjectedMetadata {
  return UUIDInjector.inject(component, DASHBOARD_COMPONENTS.OriginCabinBackground);
}

/**
   * 為 MyDashboardPage 注入 UUID
 */
export function injectMyDashboardPageUUID<T extends Record<string, unknown>>(
  component: T
): T & InjectedMetadata {
  return UUIDInjector.inject(component, DASHBOARD_COMPONENTS.MyDashboardPage);
}

/**
 * 批量注入儀表板組件 UUID
 */
export function injectAllDashboardComponents(
  components: {
    NPCCompanionWidget: Record<string, unknown>;
    OriginCabinBackground: Record<string, unknown>;
    MyDashboardPage: Record<string, unknown>;
  }
): {
  NPCCompanionWidget: Record<string, unknown> & InjectedMetadata;
  OriginCabinBackground: Record<string, unknown> & InjectedMetadata;
  MyDashboardPage: Record<string, unknown> & InjectedMetadata;
} {
  return {
    NPCCompanionWidget: injectNPCCompanionWidgetUUID(components.NPCCompanionWidget),
    OriginCabinBackground: injectOriginCabinBackgroundUUID(components.OriginCabinBackground),
    MyDashboardPage: injectMyDashboardPageUUID(components.MyDashboardPage)
  };
}

/**
 * 生成快速 UUID（短格式）
 */
export function generateQuickUUID(): string {
  return `ARIA-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

/**
 * 解析 UUID 格式
 */
export interface ParsedUUID {
  prefix: string;
  sourceHash: string;
  timestampHash: string;
  randomPart: string;
  full: string;
}

/**
 * 解析 OmniUUID
 */
export function parseOmniUUID(uuid: string): ParsedUUID | null {
  const parts = uuid.split('-');
  if (parts.length !== 5) return null;
  
  return {
    prefix: parts[0],
    sourceHash: parts[1],
    timestampHash: parts[2],
    randomPart: parts[3] + '-' + parts[4],
    full: uuid
  };
}

/**
 * 從 UUID 提取時間戳
 */
export function extractTimestampFromUUID(uuid: string): number | null {
  const parsed = parseOmniUUID(uuid);
  if (!parsed) return null;
  
  // timestampHash 是 SHA256 時間戳的截斷
  // 這是一個近似值
  return parseInt(parsed.timestampHash, 16) || null;
}
