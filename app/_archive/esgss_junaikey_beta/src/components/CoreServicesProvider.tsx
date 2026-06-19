import React, { createContext, useContext, useEffect, useState } from 'react';
import { serviceRegistry } from '@/services/ServiceRegistry';
import { DataManager, LocalStorageStrategy } from '@/services/dataManager';
import { BackendService } from '@/services/backend';
import { AiServiceWrapper } from '@/services/AiServiceWrapper';
import { omniLogger, LogCategory } from '../services/omniLogger';
import { authService } from '@/services/auth';
import { esgAiService } from '@/services/esgAiService';
import { BidirectionalSyncService } from '@/services/bidirectionalSync';
import { monitoringService } from '@/services/monitoringService';
import { agentService } from '@/services/agentService';
import { cacheService } from '@/services/CacheService';
import { errorHandler } from '@/services/ErrorHandler';
import { localizationService } from '../services/localization';
import { analyticsService } from '../services/analytics';
import { securityService } from '../services/securityService';
import { complianceService } from '../services/complianceService';
import { integrationService } from '../services/integrationService';
import { valueService } from '../services/value';
import { strategyManagement } from '../services/strategyManagement';
import { esgDataCollector } from '../services/esgDataCollector';
import { esgCardService } from '../services/esgCardService';
import { dataQualityController } from '../services/dataQualityController';
import { historicalDataAnalysis } from '../services/historicalDataAnalysis';
import { realTimeDataSync } from '../services/realTimeDataSync';
import { learningService } from '@/services/learning';
import { innovationService } from '@/services/innovation';

// 定義核心服務上下文
interface CoreServicesContextType {
  isInitialized: boolean;
  registry: typeof serviceRegistry;
}

const CoreServicesContext = createContext<CoreServicesContextType | null>(null);

export const useCoreServices = () => {
  const context = useContext(CoreServicesContext);
  if (!context) {
    throw new Error('useCoreServices must be used within a CoreServicesProvider');
  }
  return context;
};

// 服務定義介面 (Best Practice: Type Definition)
interface ServiceDefinition {
  id: string;
  instance: any;
  metadata: {
    name: string;
    version: string;
    description: string;
    tags: string[];
  };
}

export const CoreServicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initServices = async () => {
      try {
        omniLogger.info(LogCategory.SYSTEM, 'Starting Core Services Initialization');

        // 輔助函式：安全註冊服務 (Best Practice: DRY & Error Handling)
        const safeRegister = (def: ServiceDefinition) => {
          try {
            serviceRegistry.register(def.id, def.instance, def.metadata);
            // 註冊成功不一定需要每條都 log，避免洗版，但可選開啟 debug log
            // omniLogger.debug(LogCategory.SYSTEM, `Service registered: ${def.metadata.name}`);
          } catch (e) {
            // 使用 omniLogger 記錄非嚴重警告
            omniLogger.warn(
              LogCategory.SYSTEM,
              `Service registration skipped (already registered): ${def.metadata.name}`
            );
          }
        };

        // 1. 基礎設施服務 (Infrastructure)
        const infraServices: ServiceDefinition[] = [
          {
            id: 'dataManager',
            instance: new DataManager(),
            metadata: {
              name: 'dataManager',
              version: '2.0.0',
              description: 'Unified Data Persistence Layer',
              tags: ['core', 'persistence'],
            },
          },
          {
            id: 'monitoring',
            instance: monitoringService,
            metadata: {
              name: 'monitoring',
              version: '1.0.0',
              description: 'System Monitoring & Metrics',
              tags: ['core', 'monitoring'],
            },
          },
          {
            id: 'omniLogger',
            instance: omniLogger,
            metadata: {
              name: 'omniLogger',
              version: '1.0.0',
              description: 'Centralized Logging System',
              tags: ['core', 'logging'],
            },
          },
          {
            id: 'cache',
            instance: cacheService,
            metadata: {
              name: 'cache',
              version: '1.0.0',
              description: 'Caching Service',
              tags: ['infra', 'cache'],
            },
          },
          {
            id: 'errorHandler',
            instance: errorHandler,
            metadata: {
              name: 'errorHandler',
              version: '1.0.0',
              description: 'Global Error Handling',
              tags: ['infra', 'error'],
            },
          },
          {
            id: 'localization',
            instance: localizationService,
            metadata: {
              name: 'localization',
              version: '1.0.0',
              description: 'Localization Service',
              tags: ['infra', 'i18n'],
            },
          },
          {
            id: 'analytics',
            instance: analyticsService,
            metadata: {
              name: 'analytics',
              version: '1.0.0',
              description: 'User & System Analytics',
              tags: ['infra', 'analytics'],
            },
          },
          {
            id: 'security',
            instance: securityService,
            metadata: {
              name: 'security',
              version: '1.0.0',
              description: 'Security & Encryption',
              tags: ['infra', 'security'],
            },
          },
        ];

        // 2. 核心與業務服務 (Core & Business)
        const coreServices: ServiceDefinition[] = [
          {
            id: 'authService',
            instance: authService,
            metadata: {
              name: 'authService',
              version: '1.0.0',
              description: 'Authentication Service',
              tags: ['core', 'security'],
            },
          },
          {
            id: 'agentService',
            instance: agentService,
            metadata: {
              name: 'agentService',
              version: '1.0.0',
              description: 'Agent Management System',
              tags: ['core', 'agents'],
            },
          },
          {
            id: 'compliance',
            instance: complianceService,
            metadata: {
              name: 'compliance',
              version: '1.0.0',
              description: 'Governance & Compliance',
              tags: ['esg', 'compliance'],
            },
          },
          {
            id: 'integration',
            instance: integrationService,
            metadata: {
              name: 'integration',
              version: '1.0.0',
              description: 'System Integration',
              tags: ['esg', 'integration'],
            },
          },
          {
            id: 'value',
            instance: valueService,
            metadata: {
              name: 'value',
              version: '1.0.0',
              description: 'Value Assessment',
              tags: ['esg', 'value'],
            },
          },
          {
            id: 'strategyManagement',
            instance: strategyManagement,
            metadata: {
              name: 'strategyManagement',
              version: '1.0.0',
              description: 'Strategy Management',
              tags: ['esg', 'strategy'],
            },
          },
          {
            id: 'bidirectionalSync',
            instance: BidirectionalSyncService, // Static class
            metadata: {
              name: 'bidirectionalSync',
              version: '1.0.0',
              description: 'Bidirectional Data Sync',
              tags: ['core', 'sync'],
            },
          },
          // Backend Service (Object)
          {
            id: 'backend',
            instance: BackendService,
            metadata: {
              name: 'backend',
              version: '1.0.0',
              description: 'NoCode Backend Bridge',
              tags: ['core', 'api'],
            },
          },
        ];

        // 3. AI 與數據服務 (AI & Data)
        const aiDataServices: ServiceDefinition[] = [
          {
            id: 'aiService',
            instance: new AiServiceWrapper(),
            metadata: {
              name: 'aiService',
              version: '1.0.0',
              description: 'Generative AI Wrapper',
              tags: ['core', 'ai'],
            },
          },
          {
            id: 'esgAiService',
            instance: esgAiService,
            metadata: {
              name: 'esgAiService',
              version: '1.0.0',
              description: 'ESG AI Intelligence',
              tags: ['core', 'ai', 'esg'],
            },
          },
          {
            id: 'esgDataCollector',
            instance: esgDataCollector,
            metadata: {
              name: 'esgDataCollector',
              version: '1.0.0',
              description: 'ESG Data Collection',
              tags: ['data', 'collector'],
            },
          },
          {
            id: 'esgCardService',
            instance: esgCardService,
            metadata: {
              name: 'esgCardService',
              version: '1.0.0',
              description: 'ESG Card Management',
              tags: ['data', 'cards'],
            },
          },
          {
            id: 'dataQualityController',
            instance: dataQualityController,
            metadata: {
              name: 'dataQualityController',
              version: '1.0.0',
              description: 'Data Quality Control',
              tags: ['data', 'quality'],
            },
          },
          {
            id: 'historicalDataAnalysis',
            instance: historicalDataAnalysis,
            metadata: {
              name: 'historicalDataAnalysis',
              version: '1.0.0',
              description: 'Historical Data Analysis',
              tags: ['data', 'analysis'],
            },
          },
          {
            id: 'realTimeDataSync',
            instance: realTimeDataSync,
            metadata: {
              name: 'realTimeDataSync',
              version: '1.0.0',
              description: 'Real-time Data Sync',
              tags: ['data', 'sync'],
            },
          },
          {
            id: 'learning',
            instance: learningService,
            metadata: {
              name: 'learning',
              version: '1.0.0',
              description: 'Learning & Adaptation',
              tags: ['ai', 'learning'],
            },
          },
          {
            id: 'innovation',
            instance: innovationService,
            metadata: {
              name: 'innovation',
              version: '1.0.0',
              description: 'Innovation Engine',
              tags: ['ai', 'innovation'],
            },
          },
        ];

        // 執行批次註冊
        [...infraServices, ...coreServices, ...aiDataServices].forEach(safeRegister);

        // 初始化註冊表
        await serviceRegistry.initialize();

        setIsInitialized(true);

        omniLogger.info(LogCategory.SYSTEM, '核心服務初始化完成 (Core Services Initialized)', {
          totalServices: serviceRegistry.getServiceNames().length,
          services: serviceRegistry.getServiceNames(),
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        omniLogger.error(LogCategory.SYSTEM, '核心服務初始化失敗 (Core Services Init Failed)', {
          error: errorMessage,
        });
      }
    };

    initServices();

    return () => {
      serviceRegistry.destroy();
    };
  }, []);

  if (!isInitialized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-neutral-900 text-yellow-500">
        正在啟動奧秘元鑰核心 (System Initializing)...
      </div>
    );
  }

  return (
    <CoreServicesContext.Provider value={{ isInitialized, registry: serviceRegistry }}>
      {children}
    </CoreServicesContext.Provider>
  );
};
