/**
 * ESG GO | 生態自然與循環經濟數據模型
 * 遵循 GRI 301, 304 與 TNFD 規範
 */

export interface BiodiversityImpact {
  id: string;
  siteName: string;
  proximityToProtectedArea: boolean;
  impactLevel: 'None' | 'Low' | 'Medium' | 'High';
  restorationArea: number; // m2
  status: 'Monitoring' | 'Active Restoration' | 'Completed';
}

export interface MaterialFlow {
  id: string;
  materialName: string;
  totalWeight: number; // kg
  recycledPercentage: number; // 0-100
  renewable: boolean;
  category: 'Raw' | 'Packaging' | 'Process';
}

export const mockBioImpacts: BiodiversityImpact[] = [
  { 
    id: 'BIO-001', 
    siteName: '台北總部研發中心', 
    proximityToProtectedArea: false, 
    impactLevel: 'None', 
    restorationArea: 120, 
    status: 'Completed' 
  },
  { 
    id: 'BIO-002', 
    siteName: '桃園二廠 (鄰近保護區)', 
    proximityToProtectedArea: true, 
    impactLevel: 'Low', 
    restorationArea: 850, 
    status: 'Active Restoration' 
  }
];

export const mockMaterials: MaterialFlow[] = [
  { id: 'MAT-101', materialName: '回收鋁材', totalWeight: 4500, recycledPercentage: 85, renewable: false, category: 'Raw' },
  { id: 'MAT-102', materialName: '生物可降解包材', totalWeight: 1200, recycledPercentage: 100, renewable: true, category: 'Packaging' },
  { id: 'MAT-103', materialName: '工業用潤滑油', totalWeight: 500, recycledPercentage: 12, renewable: false, category: 'Process' }
];