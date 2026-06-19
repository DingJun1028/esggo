/**
 * 💡 企業情資 API 路由
 * Company Intelligence API Route
 * 
 * 透過企業網址或名稱查詢相關的企業履歷資訊
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { CompanyIntelService } from '@/services/reconnaissance/company-intel-service';

/**
 * 驗證用戶身份
 */
async function verifyAuth(request: NextRequest) {
    const session = await auth();
    
    if (!session?.user) {
        return { authenticated: false, error: 'Unauthorized' };
    }
    
    return { authenticated: true, user: session.user };
}

/**
 * GET /api/reconnaissance/company
 * 查詢企業履歷資訊
 * 
 * 參數:
 * - q: 企業網址或名稱
 */
export async function GET(request: NextRequest) {
    // 驗證身份
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
        return NextResponse.json({ error: 'Unauthorized', message: '請先登入' }, { status: 401 });
    }
    
    try {
        const searchParams = request.nextUrl.searchParams;
        const rawQuery = searchParams.get('q');

        // 輸入驗證與消毒
        const sanitizedQuery = rawQuery 
            ? rawQuery.replace(/[<>"'`]|[\x00-\x1F]/g, '').substring(0, 100)
            : null;

        if (!sanitizedQuery) {
            // 返回所有企業列表
            const companies = CompanyIntelService.getAllCompanies();
            return NextResponse.json({
                message: '企業列表',
                total: companies.length,
                companies: companies.map(c => ({
                    id: c.id,
                    nameZh: c.nameZh,
                    nameEn: c.nameEn,
                    industry: c.industry,
                    esgRating: c.esgRating,
                    riskLevel: c.riskLevel
                }))
            });
        }

        // 搜尋企業
        const company = await CompanyIntelService.searchCompany(sanitizedQuery);

        if (!company) {
            return NextResponse.json({
                error: 'Company not found',
                message: `找不到企業: ${sanitizedQuery}`,
                suggestion: '請嘗試輸入完整的公司名稱或網址'
            }, { status: 404 });
        }

        // 產生風險評估
        const riskAssessment = CompanyIntelService.generateRiskAssessment(company);

        return NextResponse.json({
            success: true,
            company: {
                ...company,
                riskAssessment
            }
        });
    } catch (error) {
        console.error('Company Intelligence API Error:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}