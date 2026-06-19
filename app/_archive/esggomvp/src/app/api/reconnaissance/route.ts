/**
 * 💡 商業偵情中心 API 路由
 * Business Reconnaissance Center API Route
 * 
 * 提供 S1-S5 情資的 CRUD 操作
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { IntelAggregator, SOURCE_INSTITUTIONS } from '@/services/reconnaissance/intel-aggregator';
import { IntelCategory } from '@/core/5t-protocol/intel-node';
import { writeLimiter } from '@/lib/rate-limit';

// ============== 速率限制 ==============
// 使用 Redis 進行的速率限制（適合 Serverless 環境）
// 爬蟲操作使用 writeLimiter: 50 requests per minute

/**
 * URL 驗證函數
 */
function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

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
 * GET /api/reconnaissance
 * 獲取所有情報或按分類篩選
 */
export async function GET(request: NextRequest) {
    // 驗證身份
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
        return NextResponse.json({ error: 'Unauthorized', message: '請先登入' }, { status: 401 });
    }
    
    try {
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get('category') as IntelCategory | null;
        const sourceId = searchParams.get('source');

        // 如果指定了源頭機構
        if (sourceId) {
            const source = SOURCE_INSTITUTIONS.find(s => s.id === sourceId);
            if (!source) {
                return NextResponse.json({ error: 'Source not found' }, { status: 404 });
            }
            return NextResponse.json({
                source,
                message: `Found source: ${source.nameZh}`
            });
        }

        // 如果指定了分類
        if (category && ['S1', 'S2', 'S3', 'S4', 'S5'].includes(category)) {
            const sources = IntelAggregator.getSourcesByCategory(category);
            return NextResponse.json({
                category,
                label: IntelAggregator.getCategoryLabel(category),
                sources,
                count: sources.length
            });
        }

        // 返回所有源頭機構
        return NextResponse.json({
            message: 'Business Reconnaissance Center - 30+ Sources',
            categories: {
                S1: { ...IntelAggregator.getCategoryLabel('S1'), count: IntelAggregator.getSourcesByCategory('S1').length },
                S2: { ...IntelAggregator.getCategoryLabel('S2'), count: IntelAggregator.getSourcesByCategory('S2').length },
                S3: { ...IntelAggregator.getCategoryLabel('S3'), count: IntelAggregator.getSourcesByCategory('S3').length },
                S4: { ...IntelAggregator.getCategoryLabel('S4'), count: IntelAggregator.getSourcesByCategory('S4').length },
                S5: { ...IntelAggregator.getCategoryLabel('S5'), count: IntelAggregator.getSourcesByCategory('S5').length }
            },
            sources: SOURCE_INSTITUTIONS,
            total: SOURCE_INSTITUTIONS.length
        });
    } catch (error) {
        console.error('Reconnaissance API Error:', error);
        return NextResponse.json({
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

/**
 * POST /api/reconnaissance
 * 創建新情報並通過 5T 協議閘口
 */
export async function POST(request: NextRequest) {
    // 驗證身份
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
        return NextResponse.json({ error: 'Unauthorized', message: '請先登入' }, { status: 401 });
    }
    
    try {
        const body = await request.json();
        
        // 檢查是否為爬蟲請求
        if (body.action === 'crawl') {
            // 使用 Redis 速率限制檢查
            const ip = request.headers.get('x-forwarded-for') || 'unknown';
            const { success } = await writeLimiter.limit(ip);
            
            if (!success) {
                return NextResponse.json({
                    error: 'Rate limit exceeded',
                    message: '爬蟲操作過於頻繁，請稍後再試'
                }, { status: 429 });
            }
            
            // 執行全局爬蟲
            const intels = await IntelAggregator.runGlobalCrawl();
            return NextResponse.json({
                success: true,
                message: '爬蟲掃描完成',
                count: intels.length,
                intels: intels
            });
        }
        
        const {
            source_url,
            title,
            insight,
            risk_score,
            affected_supply_chain,
            raw_evidence,
            iso_tags,
            category
        } = body;

        // 驗證必填欄位
        if (!source_url || !title || !insight || risk_score === undefined) {
            return NextResponse.json({
                error: 'Missing required fields',
                required: ['source_url', 'title', 'insight', 'risk_score']
            }, { status: 400 });
        }

        // 驗證 URL 格式
        if (!isValidUrl(source_url)) {
            return NextResponse.json({
                error: 'Invalid source_url',
                message: '請提供有效的 http/https 網址格式'
            }, { status: 400 });
        }

        // 驗證 category 參數
        const validCategories: IntelCategory[] = ['S1', 'S2', 'S3', 'S4', 'S5'];
        if (category && !validCategories.includes(category)) {
            return NextResponse.json({
                error: 'Invalid category',
                message: '分類必須是 S1, S2, S3, S4, 或 S5 之一'
            }, { status: 400 });
        }

        // 驗證風險分數範圍
        if (risk_score < 0 || risk_score > 100) {
            return NextResponse.json({
                error: 'Invalid risk_score',
                message: 'risk_score must be between 0 and 100'
            }, { status: 400 });
        }

        // 處理情報
        const intel = await IntelAggregator.processIntel({
            source_url,
            title,
            insight,
            risk_score,
            affected_supply_chain: affected_supply_chain || [],
            raw_evidence: raw_evidence || {},
            iso_tags: iso_tags || [],
            category
        });

        // 儲存到 NCBDB
        try {
            const saved = await IntelAggregator.saveIntel(intel);
            return NextResponse.json({
                success: true,
                message: 'Intel processed and saved successfully',
                intel: intel,
                ncb_result: saved
            });
        } catch (ncbError) {
            // NCB 儲存失敗，但仍返回情報（可能是離線模式）
            console.warn('NCB save failed, returning intel anyway:', ncbError);
            return NextResponse.json({
                success: true,
                message: 'Intel processed successfully (NCB save pending)',
                intel: intel,
                ncb_error: ncbError instanceof Error ? ncbError.message : 'Unknown NCB error'
            });
        }
    } catch (error) {
        console.error('Reconnaissance POST Error:', error);
        return NextResponse.json({
            error: 'Processing Error',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}