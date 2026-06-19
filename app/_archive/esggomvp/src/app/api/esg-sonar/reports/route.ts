import { NextRequest, NextResponse } from 'next/server';
import { CompanyReport, PaginatedResponse } from '@/types/esg-sonar';

// 模擬企業報告書數據
const mockReports: CompanyReport[] = [
  {
    id: '1',
    reportId: 'RPT-001',
    companyName: '台積電',
    companyCode: '2330',
    industry: '半導體',
    reportType: 'SUSTAINABILITY',
    reportYear: 2023,
    publishDate: '2024-01-15',
    reportUrl: 'https://www.tsmc.com',
    version: 1,
    isLatest: true,
    status: 'COMPLETED',
    summary: '台積電2023年永續發展報告，涵蓋環境保護、社會責任及公司治理等面向。',
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
    reportUrl: 'https://www.foxconn.com',
    version: 2,
    previousVersion: 1,
    isLatest: true,
    changeType: 'UPDATED',
    status: 'COMPLETED',
    summary: '鴻海2023年ESG報告，加強氣候變遷及供應商管理揭露。',
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
    summary: '中鋼2023年碳盤查報告，預計2024年Q1完成。',
    createdAt: '2024-02-15T00:00:00Z',
    updatedAt: '2024-02-15T00:00:00Z'
  },
  {
    id: '4',
    reportId: 'RPT-004',
    companyName: '台塑石化',
    companyCode: '6505',
    industry: '化工',
    reportType: 'SUSTAINABILITY',
    reportYear: 2023,
    publishDate: '2024-01-20',
    version: 1,
    isLatest: true,
    status: 'COMPLETED',
    summary: '台塑石化2023年永續報告，強調循環經濟與節能減碳。',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  },
  {
    id: '5',
    reportId: 'RPT-005',
    companyName: '中華電信',
    companyCode: '2412',
    industry: '電信',
    reportType: 'ESG_REPORT',
    reportYear: 2023,
    publishDate: '2024-02-10',
    version: 1,
    isLatest: true,
    status: 'COMPLETED',
    summary: '中華電信2023年ESG報告，著重數位包容與偏鄉建設。',
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z'
  },
  {
    id: '6',
    reportId: 'RPT-006',
    companyName: '國泰金控',
    companyCode: '2882',
    industry: '金融',
    reportType: 'INTEGRATED',
    reportYear: 2023,
    publishDate: '2024-01-25',
    version: 1,
    isLatest: true,
    status: 'COMPLETED',
    summary: '國泰金控2023年整合報告，結合財務與永續績效。',
    createdAt: '2024-01-25T00:00:00Z',
    updatedAt: '2024-01-25T00:00:00Z'
  },
  {
    id: '7',
    reportId: 'RPT-007',
    companyName: '聯發科',
    companyCode: '2454',
    industry: '半導體',
    reportType: 'SUSTAINABILITY',
    reportYear: 2023,
    version: 1,
    isLatest: true,
    status: 'PENDING',
    summary: '聯發科2023年永續報告，預計2024年Q2發布。',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-01T00:00:00Z'
  },
  {
    id: '8',
    reportId: 'RPT-008',
    companyName: '遠傳電信',
    companyCode: '4904',
    industry: '電信',
    reportType: 'ESG_REPORT',
    reportYear: 2022,
    publishDate: '2023-03-15',
    version: 1,
    isLatest: false,
    status: 'ARCHIVED',
    summary: '遠傳電信2022年ESG報告。',
    createdAt: '2023-03-15T00:00:00Z',
    updatedAt: '2023-03-15T00:00:00Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 獲取篩選參數
    const search = searchParams.get('search') || '';
    const companyCode = searchParams.get('companyCode') || '';
    const industries = searchParams.get('industries')?.split(',').filter(Boolean) || [];
    const reportTypes = searchParams.get('reportTypes')?.split(',').filter(Boolean) || [];
    const reportYears = searchParams.get('reportYears')?.split(',').filter(Boolean).map(Number) || [];
    const status = searchParams.get('status')?.split(',').filter(Boolean) || [];
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');

    // 過濾數據
    let filtered = [...mockReports];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(r => 
        r.companyName.toLowerCase().includes(searchLower) ||
        r.companyCode?.toLowerCase().includes(searchLower) ||
        r.summary?.toLowerCase().includes(searchLower)
      );
    }

    if (companyCode) {
      filtered = filtered.filter(r => r.companyCode === companyCode);
    }

    if (industries.length > 0) {
      filtered = filtered.filter(r => r.industry && industries.includes(r.industry));
    }

    if (reportTypes.length > 0) {
      filtered = filtered.filter(r => reportTypes.includes(r.reportType));
    }

    if (reportYears.length > 0) {
      filtered = filtered.filter(r => reportYears.includes(r.reportYear));
    }

    if (status.length > 0) {
      filtered = filtered.filter(r => status.includes(r.status));
    }

    // 分頁
    const total = filtered.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const items = filtered.slice(startIndex, startIndex + pageSize);

    const response: PaginatedResponse<CompanyReport> = {
      items,
      total,
      page,
      pageSize,
      totalPages
    };

    return NextResponse.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}