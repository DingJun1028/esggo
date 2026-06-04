export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import '@/lib/firebase-admin'; // 確保 Admin SDK 已初始化
export const dynamic = 'force-dynamic';
/**
 * 🚀 獲取企業已入庫的文件列表
 * 此 API 會從 enterprise_knowledge 集合中按 docId 分組，彙整出檔案名稱與區塊數量。
 */
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const companyId = searchParams.get('companyId') || 'default';
        const db = getFirestore();
        const snapshot = await db.collection('enterprise_knowledge')
            .where('companyId', '==', companyId)
            .orderBy('createdAt', 'desc')
            .get();
        if (snapshot.empty) {
            return NextResponse.json({ success: true, files: [] });
        }
        // 按 docId 彙整檔案資訊
        const fileMap = {};
        snapshot.docs.forEach(doc => {
            const data = doc.data();
            const rawDocId = data.docId || 'unknown';
            // 由於 docId 包含 _chunk_N，我們取前半段作為真正的 docId
            const docId = rawDocId.split('_chunk_')[0];
            if (!fileMap[docId]) {
                fileMap[docId] = {
                    title: data.title?.split(' (Part ')[0] || '未命名文件',
                    chunks: 0,
                    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
                };
            }
            fileMap[docId].chunks += 1;
        });
        const files = Object.values(fileMap);
        return NextResponse.json({
            success: true,
            files: files
        });
    }
    catch (error) {
        console.error('[List API] Error fetching knowledge list:', error);
        return NextResponse.json({
            success: false,
            error: '無法獲取智庫列表',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map