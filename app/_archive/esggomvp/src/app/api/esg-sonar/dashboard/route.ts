import { NextRequest, NextResponse } from 'next/server';
import { DashboardStats, Regulation, CompanyReport, ESGRadarData, TimelineItem } from '@/types/esg-sonar';

// 模擬數據（實際應從資料庫獲取）
const mockStats: DashboardStats = {
  totalRegulations: 156,
  activeRegulations: 89,
  totalReports: 342,
  pendingReports: 28,
  totalCompanies: 127,
  recentChanges: 12
};

const mockRadarData: ESGRadarData[] = [
  { category: 'ENVIRONMENTAL', value: 85, label: '環境' },
  { category: 'SOCIAL', value: 72, label: '社會' },
  { category: 'GOVERNANCE', value: 90, label: '治理' }
];

const mockRecentRegulations: Regulation[] = [
  {
    id: '1',
    code: '金管會 1130301',
    name: '上市櫃公司永續發展行動方案',
    category: 'GOVERNANCE',
    authority: '金管會',
    sourceUrl: 'https://www.fsc.gov.tw',
    status: 'ACTIVE',
    publishedDate: '2024-03-01',
    effectiveDate: '2024-03-01',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  },
  {
    id: '2',
    code: '環境部 1130215',
    name: '碳費徵收辦法',
    category: 'ENVIRONMENTAL',
    authority: '環境部',
    sourceUrl: 'https://www.moenv.gov.tw',
    status: 'DRAFT',
    publishedDate: '2024-02-15',
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z'
  },
  {
    id: '3',
    code: '勞動部 1130110',
    name: '勞動基準法施行細則修正草案',
    category: 'SOCIAL',
    authority: '勞動部',
    sourceUrl: 'https://www.mol.gov.tw',
    status: 'AMENDED',
    publishedDate: '2024-01-10',
    effectiveDate: '2024-04-01',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  }
];

const mockRecentReports: CompanyReport[] = [
  {
    id: '1',
    reportId: 'RPT-001',
    companyName: '台積電',
    companyCode: '2330',
    industry: '半導體',
    reportType: 'SUSTAINABILITY',
    reportYear: 2023,
    publishDate: '2024-01-15',
    version: 1,
    isLatest: true,
    status: 'COMPLETED',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    reportId: 'RPT-002',
    companyName: '鴻海精密',
    companyCode: '2317',
    industry: '電子',
    reportType: 'ESG_REPORT',
    reportYear: 2023,
    publishDate: '2024-02-01',
    version: 2,
    previousVersion: 1,
    isLatest: true,
    changeType: 'UPDATED',
    status: 'COMPLETED',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z'
  },
  {
    id: '3',
    reportId: 'RPT-003',
    companyName: '中鋼',
    companyCode: '2002',
    industry: '鋼鐵',
    reportType: 'CARBON_INVENTORY',
    reportYear: 2023,
    version: 1,
    isLatest: true,
    status: 'PROCESSING',
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z'
  }
];

const mockTimeline: TimelineItem[] = [
  {
    id: '1',
    date: '2024-03-01',
    title: '上市櫃公司永續發展行動方案生效',
    description: '金管會發布之永續發展行動方案正式生效',
    type: 'regulation',
    status: 'ACTIVE'
  },
  {
    id: '2',
    date: '2024-02-28',
    title: '台積電發布 2023 永續報告',
    description: '台積電發布年度永續發展報告',
    type: 'report',
    status: 'COMPLETED'
  },
  {
    id: '3',
    date: '2024-02-15',
    title: '碳費徵收辦法草案預告',
    description: '環境部預告碳費徵收辦法草案',
    type: 'regulation',
    status: 'DRAFT'
  }
];

export async function GET(request: NextRequest) {
  try {
    // 模擬 API 延遲
    await new Promise(resolve => setTimeout(resolve, 100));

    return NextResponse.json({
      success: true,
      data: {
        stats: mockStats,
        radarData: mockRadarData,
        recentRegulations: mockRecentRegulations,
        recentReports: mockRecentReports,
        timeline: mockTimeline
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}