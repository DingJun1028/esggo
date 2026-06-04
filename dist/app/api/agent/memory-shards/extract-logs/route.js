import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function POST() {
    try {
        const cwd = process.cwd();
        const possibleLogs = ['.omnisync_trace.txt', '.gemini_trace.md', 'execution_trace.log'];
        let conversationLog = '';
        for (const file of possibleLogs) {
            const filePath = path.join(cwd, file);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf-8');
                if (content.trim()) {
                    conversationLog += `\n\n--- Source: ${file} ---\n${content}`;
                }
            }
        }
        if (!conversationLog.trim()) {
            return NextResponse.json({ success: false, error: 'No execution logs found to extract.' }, { status: 404 });
        }
        // 將 log 傳遞給主 /api/agent/memory-shards 進行擷取
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `${protocol}://localhost:${process.env.PORT || 3000}`;
        const response = await fetch(`${baseUrl}/api/agent/memory-shards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'extract_shard',
                conversationLog
            })
        });
        if (!response.ok) {
            const err = await response.text();
            throw new Error(err);
        }
        const data = await response.json();
        // 如果擷取成功，再觸發一次自動合成奧義（當前系統會把這個shard寫入Supabase）
        // 我們可以另外開一隻腳本檢查庫中是否有足夠的shards可以合成
        // 這裡為了展示，我們先觸發
        if (data.success && data.shard) {
            // 嘗試獲取目前所有的 shards，如果超過 2 個，則自動觸發奧義合成
            const shardsRes = await fetch(`${baseUrl}/api/agent/memory-shards?type=shards`);
            if (shardsRes.ok) {
                const shardsData = await shardsRes.json();
                const allShards = shardsData.shards || [];
                if (allShards.length >= 2) {
                    await fetch(`${baseUrl}/api/agent/memory-shards`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'synthesize_ultimate',
                            shards: allShards
                        })
                    });
                }
            }
        }
        return NextResponse.json({ success: true, message: 'Log extracted and processed.', shard: data.shard });
    }
    catch (error) {
        console.error('Extraction Failed:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map