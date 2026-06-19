import { NextRequest, NextResponse } from 'next/server';
import { Regulation, PaginatedResponse } from '@/types/esg-sonar';

// 模擬法規數據
const mockRegulations: Regulation[] = [
    {
        id: '1',
        code: '金管會 1130301',
        name: '上市櫃公司永續發展行動方案',
        category: 'GOVERNANCE',
        authority: '金管會',
        sourceUrl: 'https://www.fsc.gov.tw',
        content: '為推動上市櫃公司永續發展，提升企業永續資訊揭露品質與透明度，特訂定本方案。',
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
        content: '依據氣候變遷因應法規定，徵收碳費之相關辦法。',
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
        content: '修正勞動基準法施行細則相關規定。',
        status: 'AMENDED',
        publishedDate: '2024-01-10',
        effectiveDate: '2024-04-01',
        createdAt: '2024-01-10T00:00:00Z',
        updatedAt: '2024-01-10T00:00:00Z'
    },
    {
        id: '4',
        code: '證交所 1121205',
        name: '上市公司永續資訊揭露辦法',
        category: 'DISCLOSURE',
        authority: '證交所',
        sourceUrl: 'https://www.twse.com.tw',
        content: '規範上市公司永續資訊揭露相關事項。',
        status: 'ACTIVE',
        publishedDate: '2023-12-05',
        effectiveDate: '2024-01-01',
        createdAt: '2023-12-05T00:00:00Z',
        updatedAt: '2023-12-05T00:00:00Z'
    },
    {
        id: '5',
        code: '環境部 1121101',
        name: '温室氣體排放量盤查登錄辦法',
        category: 'ENVIRONMENTAL',
        authority: '環境部',
        sourceUrl: 'https://www.moenv.gov.tw',
        content: '規範温室氣體排放量盤查及登錄相關事項。',
        status: 'ACTIVE',
        publishedDate: '2023-11-01',
        effectiveDate: '2023-11-01',
        createdAt: '2023-11-01T00:00:00Z',
        updatedAt: '2023-11-01T00:00:00Z'
    },
    {
        id: '6',
        code: '金管會 1121015',
        name: '金融業永續發展規範',
        category: 'TAXONOMY',
        authority: '金管會',
        sourceUrl: 'https://www.fsc.gov.tw',
        content: '規範金融業永續發展相關規範。',
        status: 'ACTIVE',
        publishedDate: '2023-10-15',
        effectiveDate: '2024-01-01',
        createdAt: '2023-10-15T00:00:00Z',
        updatedAt: '2023-10-15T00:00:00Z'
    }
];

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // 獲取篩選參數
        const search = searchParams.get('search') || '';
        const categories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
        const authorities = searchParams.get('authorities')?.split(',').filter(Boolean) || [];
        const status = searchParams.get('status')?.split(',').filter(Boolean) || [];
        const dateFrom = searchParams.get('dateFrom');
        const dateTo = searchParams.get('dateTo');
        const page = parseInt(searchParams.get('page') || '1');
        const pageSize = parseInt(searchParams.get('pageSize') || '10');

        // 過濾數據
        let filtered = [...mockRegulations];

        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(r =>
                r.name.toLowerCase().includes(searchLower) ||
                r.code.toLowerCase().includes(searchLower) ||
                r.content?.toLowerCase().includes(searchLower)
            );
        }

        if (categories.length > 0) {
            filtered = filtered.filter(r => categories.includes(r.category));
        }

        if (authorities.length > 0) {
            filtered = filtered.filter(r => authorities.includes(r.authority));
        }

        if (status.length > 0) {
            filtered = filtered.filter(r => status.includes(r.status));
        }

        if (dateFrom) {
            filtered = filtered.filter(r => r.publishedDate && r.publishedDate >= dateFrom);
        }

        if (dateTo) {
            filtered = filtered.filter(r => r.publishedDate && r.publishedDate <= dateTo);
        }

        // 分頁
        const total = filtered.length;
        const totalPages = Math.ceil(total / pageSize);
        const startIndex = (page - 1) * pageSize;
        const items = filtered.slice(startIndex, startIndex + pageSize);

        const response: PaginatedResponse<Regulation> = {
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
        console.error('Error fetching regulations:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch regulations' },
            { status: 500 }
        );
    }
}