import { NextRequest } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const companyId = req.nextUrl.searchParams.get('companyId');

        if (!companyId) {
            return new Response(JSON.stringify({ error: 'Missing companyId parameter' }), { status: 400 });
        }

        const db = getFirestore();
        // 為了節省頻寬與記憶體，我們用 select() 只抓取需要的欄位，不抓龐大的 text 與 embedding
        const snapshot = await db.collection('enterprise_knowledge')
            .where('companyId', '==', companyId)
            .select('title', 'createdAt')
            .get();

        // 將散落的 Chunk 重新聚合為單一「檔案」視圖
        const fileMap = new Map<string, { title: string, chunks: number, createdAt: string }>();

        snapshot.forEach(doc => {
            const data = doc.data();
            // 我們的 title 儲存格式為 "檔名.pdf (Part X)"，透過 Regex 把後綴拿掉還原檔名
            const baseTitle = data.title.replace(/ \(Part \d+\)$/, '');

            if (fileMap.has(baseTitle)) {
                fileMap.get(baseTitle)!.chunks += 1;
            } else {
                fileMap.set(baseTitle, { title: baseTitle, chunks: 1, createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString() });
            }
        });

        // 轉為陣列並依照上傳時間排序 (最新在上)
        const files = Array.from(fileMap.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        return new Response(JSON.stringify({ success: true, files }), { status: 200 });
    } catch (error) {
        console.error('[Knowledge API] List error:', error);
        return new Response(JSON.stringify({ error: '獲取知識庫列表失敗' }), { status: 500 });
    }
}