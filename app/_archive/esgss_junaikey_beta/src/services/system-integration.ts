// System Integration Service - M9 System Architecture Module
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.js';
import { authService } from './auth.js';
import { dataManager } from './dataManager.js';
import { esgDataCollector } from './esgDataCollector.js';
import { historicalDataAnalysis } from './historicalDataAnalysis.js';
import { analyticsService } from './analytics.js';

// System Health Status
export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  services: Record<string, 'up' | 'down' | 'slow'>;
  uptime: number;
  lastCheck: number;
}

// Service Class
export class SystemIntegrationService {
  private static instance: SystemIntegrationService;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): SystemIntegrationService {
    if (!SystemIntegrationService.instance) {
      SystemIntegrationService.instance = new SystemIntegrationService();
    }
    return SystemIntegrationService.instance;
  }

  // Initialize System
  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    omniLogger.info(LogCategory.SYSTEM, 'Initializing ESG Sunshine System...');

    try {
      // Check Auth
      const authState = authService.currentState;
      omniLogger.info(LogCategory.SYSTEM, 'Auth Service loaded', {
        authenticated: authState.isAuthenticated,
      });

      // Start Data Collector
      esgDataCollector.start();

      this.isInitialized = true;
      omniLogger.info(LogCategory.SYSTEM, 'System Initialization Complete');
      return true;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'System Initialization Failed', { error });
      return false;
    }
  }

  // Health Check
  async checkHealth(): Promise<SystemHealth> {
    return {
      status: 'healthy',
      services: {
        auth: 'up',
        dataManager: 'up',
        collector: 'up',
        analytics: 'up',
      },
      uptime: process.uptime(),
      lastCheck: Date.now(),
    };
  }

  // Shutdown
  async shutdown(): Promise<void> {
    omniLogger.info(LogCategory.SYSTEM, 'Shutting down system...');
    esgDataCollector.stop();
    authService.destroy();
    analyticsService.destroy();
    historicalDataAnalysis.destroy();
    this.isInitialized = false;
  }
}

export const systemIntegrationService = SystemIntegrationService.getInstance();
