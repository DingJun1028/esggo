import { IOmniNote, OmniWuzuoNoteService } from "./wuzuo-note";
import { IOmniTag } from "./omni-types";
import { v4 as uuidv4 } from 'uuid';

/**
 * 🌉 OmniKnowledgeBridge - 萬能知識橋接服務
 * 負責處理跨系統的知識匯入、匯出與轉換邏輯
 */
export class OmniKnowledgeBridge {
    /**
     * 📥 importFromMarkdown: 從 Markdown 內容匯入筆記
     * 支援 Obsidian 標籤語法 (#tag)
     */
    public static async importFromMarkdown(filename: string, content: string): Promise<IOmniNote> {
        // 1. 提取標題（若無則使用檔名）
        const titleMatch = content.match(/^#\s+(.*)/);
        const title = titleMatch ? titleMatch[1] : filename.replace(/\.(md|markdown)$/, '');

        // 2. 提取 Obsidian 風格標籤 (#tag)
        const tagMatches = content.match(/#[\w\u4e00-\u9fa5]+/g) || [];
        const tags: IOmniTag[] = tagMatches.map(t => ({
            id: `tag-${uuidv4().slice(0, 8)}`,
            semantic: t,
            dimension: 'Imported',
            weight: 0.8
        }));

        // 3. 清理內容（移除標題與標籤行，保留純文字）
        let cleanContent = content
            .replace(/^#\s+.*/, '') // 移除一級標題
            .replace(/#[\w\u4e00-\u9fa5]+/g, '') // 移除標籤
            .trim();

        // 4. 建立筆記
        return await OmniWuzuoNoteService.createNote(title, cleanContent || 'Imported content');
    }

    /**
     * 📤 exportToMarkdown: 將筆記匯出為 Markdown
     * 包含 5T 誠信證明 Metadata
     */
    public static exportToMarkdown(note: IOmniNote): string {
        const tagsStr = note.tags?.map(t => t.semantic).join(' ') || '';
        let md = `# ${note.title}\n\n`;
        md += `${tagsStr}\n\n`;
        md += `${note.content}\n\n`;
        md += `---\n`;
        md += `## 5T Trust Proof (Omni-Bridge)\n`;
        md += `- **UUID**: ${note.uuid}\n`;
        md += `- **Status**: ${note.status}\n`;
        md += `- **Timestamp**: ${new Date(note.timestamp).toISOString()}\n`;

        if (note.evidence) {
            md += `- **Hash**: ${note.evidence.hash}\n`;
            md += `- **Protocol**: ${note.evidence.protocol}\n`;
        }

        return md;
    }

    /**
     * 📦 exportAllToJSON: 匯出完整知識庫備份
     */
    public static async exportAllToJSON(): Promise<string> {
        const notes = await OmniWuzuoNoteService.getAllNotes();
        return JSON.stringify({
            version: '8.2.5',
            exportedAt: Date.now(),
            notes
        }, null, 2);
    }
}
