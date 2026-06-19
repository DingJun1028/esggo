/**
 * ESG Sunshine Universal System - Genesis Seed Data Injector
 * 創世種子數據注入器
 */

export interface GenesisSeedData {
  version: string;
  timestamp: number;
  esgMetrics: {
    environmental: Record<string, number>;
    social: Record<string, number>;
    governance: Record<string, number>;
  };
  systemConfig: {
    aiEnabled: boolean;
    monitoringEnabled: boolean;
    securityEnabled: boolean;
  };
  defaultUsers: Array<{
    id: string;
    role: string;
    name: string;
  }>;
}

/**
 * 創世種子數據
 */
const genesisSeedData: GenesisSeedData = {
  version: '2.0.0-seraphim',
  timestamp: Date.now(),
  esgMetrics: {
    environmental: {
      carbonFootprint: 1250.5,
      energyConsumption: 87500.25,
      waterUsage: 23450.75,
      wasteGenerated: 1234.56,
    },
    social: {
      employeeCount: 300,
      diversityRatio: 0.65,
      trainingHours: 15000,
      communityEngagement: 85,
    },
    governance: {
      boardIndependence: 0.75,
      auditQuality: 95,
      riskManagement: 88,
      ethicalCompliance: 92,
    },
  },
  systemConfig: {
    aiEnabled: true,
    monitoringEnabled: true,
    securityEnabled: true,
  },
  defaultUsers: [
    {
      id: 'admin-001',
      role: 'Admin',
      name: '系統管理員',
    },
    {
      id: 'esg-manager-001',
      role: 'ESG Manager',
      name: 'ESG經理',
    },
    {
      id: 'analyst-001',
      role: 'Analyst',
      name: '數據分析師',
    },
  ],
};

/**
 * 注入創世種子數據到 localStorage
 */
export function injectGenesisData(): void {
  try {
    // 檢查是否已經注入過
    const existingData = localStorage.getItem('esgss-genesis-data');
    if (existingData) {
      const parsed = JSON.parse(existingData);
      // 如果版本相同，不重複注入
      if (parsed.version === genesisSeedData.version) {
        console.log('🌱 ESGss Genesis data already injected');
        return;
      }
    }

    // 注入種子數據
    localStorage.setItem('esgss-genesis-data', JSON.stringify(genesisSeedData));

    // 注入系統配置
    localStorage.setItem('esgss-system-config', JSON.stringify(genesisSeedData.systemConfig));

    // 注入默認用戶
    localStorage.setItem('esgss-users', JSON.stringify(genesisSeedData.defaultUsers));

    // 注入ESG基準數據
    localStorage.setItem('esgss-baseline-metrics', JSON.stringify(genesisSeedData.esgMetrics));

    console.log('🌱 ESGss Genesis data injected successfully');
    console.log('✨ Version:', genesisSeedData.version);
    console.log(
      '📊 ESG Metrics initialized with',
      Object.keys(genesisSeedData.esgMetrics).length,
      'categories'
    );
    console.log('👥 Default users created:', genesisSeedData.defaultUsers.length);
  } catch (error) {
    console.error('❌ Failed to inject ESGss Genesis data:', error);
  }
}

/**
 * 獲取創世種子數據
 */
export function getGenesisData(): GenesisSeedData | null {
  try {
    const data = localStorage.getItem('esgss-genesis-data');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('❌ Failed to retrieve genesis data:', error);
    return null;
  }
}

/**
 * 重置創世種子數據
 */
export function resetGenesisData(): void {
  try {
    localStorage.removeItem('esgss-genesis-data');
    localStorage.removeItem('esgss-system-config');
    localStorage.removeItem('esgss-users');
    localStorage.removeItem('esgss-baseline-metrics');
    console.log('🔄 ESGss Genesis data reset');
  } catch (error) {
    console.error('❌ Failed to reset genesis data:', error);
  }
}
