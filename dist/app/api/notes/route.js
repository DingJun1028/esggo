import { NextResponse } from 'next/server';
/**
 * Notes API - OmniTable Integration
 * GET /api/notes - 獲取筆記列表
 * POST /api/notes - 新增筆記
 */
const NOTES = [
    {
        id: '1',
        title: 'ESG 永續報告撰寫指南',
        content: 'GRI 2021 框架包含 28 個指標，需涵蓋環境(E)、社會(S)、治理(G)三大面向...',
        tags: ['GRI', '報告', '指南'],
        updatedAt: Date.now() - 86400000
    },
    {
        id: '2',
        title: '碳足跡計算方法',
        content: '範疇一: 直接排放量 Σ(活動數據 × 排放係數)，範疇二: 能源間接排放...',
        tags: ['碳足跡', 'GHG', '計算'],
        updatedAt: Date.now() - 172800000
    }
];
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('q') || '';
    if (search) {
        const q = search.toLowerCase();
        return NextResponse.json({
            notes: NOTES.filter(n => n.title.toLowerCase().includes(q) ||
                n.content.toLowerCase().includes(q) ||
                n.tags.some(t => t.toLowerCase().includes(q)))
        });
    }
    return NextResponse.json({ notes: NOTES });
}
export async function POST(request) {
    const body = await request.json();
    const newNote = {
        id: Date.now().toString(),
        title: body.title || '無標題',
        content: body.content || '',
        tags: body.tags || [],
        updatedAt: Date.now()
    };
    NOTES.unshift(newNote);
    return NextResponse.json({ success: true, note: newNote }, { status: 201 });
}
//# sourceMappingURL=route.js.map