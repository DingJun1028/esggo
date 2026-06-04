import React, { useState, useRef } from 'react'; // 導入 useRef
import { useSustainWriteStore } from '../store/useSustainWriteStore';
import AiStyleSelector from './omni/AiStyleSelector'; // 導入 AiStyleSelector
import { Bot, RefreshCw, Type, Download, Briefcase, Database, Lightbulb, Heart } from 'lucide-react'; // 新增更多 Lucide icons for AI styles
import { cn } from '../lib/utils';
import SustainWriteTipTapEditor, { SustainWriteEditorRef } from './omni/SustainWriteTipTapEditor'; // 導入 TipTap 編輯器組件及其 Ref 類型
import { convertHtmlToPdf, convertHtmlToDocx, convertHtmlToMarkdown, convertHtmlToPlainText } from '../lib/utils/documentConverters'; // 導入轉換函數

const AI_STYLES_OPTIONS = [
    { key: 'professional', label: '嚴謹專業', description: '請以嚴謹、專業且符合 GRI 準則的口吻進行擴寫，確保語氣客觀中立。', icon: <Briefcase size={12} /> },
    { key: 'data_driven', label: '數據導向', description: '請以數據導向為主，在擴寫時強調具體指標、成效與量化數據的邏輯分析。', icon: <Database size={12} /> },
    { key: 'innovative', label: '前瞻創新', description: '請以創新、前瞻性的口吻進行擴寫，強調企業在永續發展上的突破與未來願景。', icon: <Lightbulb size={12} /> },
    { key: 'empathetic', label: '溫暖關懷', description: '請以溫暖、關懷社會的柔和口吻擴寫，強調企業對員工、社區與環境的正面影響力。', icon: <Heart size={12} /> },
];
// 為了兼容 expandContentWithAI 的參數，我們仍然需要一個對象形式的 AI_STYLES
const AI_STYLES = AI_STYLES_OPTIONS.reduce((acc, curr) => {
    acc[curr.key] = curr.description;
    return acc;
}, {} as Record<string, string>);

type AiStyleKey = keyof typeof AI_STYLES;

interface ChapterEditorProps {
    chapterId: string;
    chapterName: string;
    chapterOrder: number;
    griRefs: string[];
}

export function ChapterEditor({ chapterId, chapterName, chapterOrder, griRefs }: ChapterEditorProps) {
    const [aiStyle, setAiStyle] = useState<AiStyleKey>('professional');
    const editorRef = useRef<SustainWriteEditorRef>(null); // 新增 editorRef
    const {
        generatedContent,
        updateContent,
        commitHistory,
        undoContent,
        redoContent,
        expandContentWithAI,
        isGeneratingAI,
        contentHistory
    } = useSustainWriteStore();

    const content = generatedContent[chapterId] || '';

    const handleExport = async (format: string) => {
        if (!editorRef.current) {
            alert('編輯器未準備好，無法匯出。');
            return;
        }

        const htmlContent = editorRef.current.getHTML();
        const plainTextContent = editorRef.current.getText();
        const filenamePrefix = `${chapterName.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}`;

        switch (format) {
            case 'pdf':
                alert('正在匯出 PDF，請稍候...');
                await convertHtmlToPdf(htmlContent, `${filenamePrefix}.pdf`);
                break;
            case 'docx':
                alert('正在匯出 Word (DOCX)，請稍候...');
                // 注意：convertHtmlToDocx 目前只處理純文本，HTML 到 Docx 的完整轉換需要更複雜的解析
                await convertHtmlToDocx(htmlContent, `${filenamePrefix}.docx`);
                break;
            case 'markdown':
                alert('正在匯出 Markdown，請稍候...');
                const markdownContent = convertHtmlToMarkdown(htmlContent);
                const markdownBlob = new Blob([markdownContent], { type: 'text/markdown' });
                const markdownLink = document.createElement('a');
                markdownLink.href = URL.createObjectURL(markdownBlob);
                markdownLink.download = `${filenamePrefix}.md`;
                markdownLink.click();
                break;
            case 'plaintext':
                alert('正在匯出純文本，請稍候...');
                const plainTextBlob = new Blob([plainTextContent], { type: 'text/plain' });
                const plainTextLink = document.createElement('a');
                plainTextLink.href = URL.createObjectURL(plainTextBlob);
                plainTextLink.download = `${filenamePrefix}.txt`;
                plainTextLink.click();
                break;
            default:
                alert('不支援的匯出格式。');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Toolbar */}
            <div className="h-12 px-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Type size={14} className="text-cyan-600" />
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{chapterName}</span>
                    </div>

                    <div className="h-4 w-[1px] bg-slate-200 mx-1" />

                    <div className="flex gap-1">
                        <button
                            onClick={() => undoContent(chapterId, chapterName, chapterOrder, griRefs)}
                            disabled={!(contentHistory[chapterId]?.past.length > 0) || isGeneratingAI[chapterId]}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 disabled:opacity-20 transition-all"
                            title="復原"
                        >
                            <RefreshCw size={14} className="-scale-x-100" />
                        </button>
                        <button
                            onClick={() => redoContent(chapterId, chapterName, chapterOrder, griRefs)}
                            disabled={!(contentHistory[chapterId]?.future.length > 0) || isGeneratingAI[chapterId]}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 disabled:opacity-20 transition-all"
                            title="重做"
                        >
                            <RefreshCw size={14} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <AiStyleSelector
                        options={AI_STYLES_OPTIONS}
                        value={aiStyle}
                        onValueChange={(key) => setAiStyle(key as AiStyleKey)}
                        disabled={isGeneratingAI[chapterId]}
                    />

                    <button
                        onClick={() => expandContentWithAI(chapterId, chapterName, chapterOrder, griRefs, AI_STYLES[aiStyle])}
                        disabled={isGeneratingAI[chapterId]}
                        className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full border border-indigo-100 transition-all disabled:opacity-50"
                    >
                        {isGeneratingAI[chapterId] ? <RefreshCw size={12} className="animate-spin" /> : <Bot size={12} />}
                        <span className="text-[10px] font-bold uppercase tracking-tight">
                            {isGeneratingAI[chapterId] ? 'OmniAgent Expanding...' : 'Expert AI Expansion'}
                        </span>
                    </button>

                    {/* Export Dropdown */}
                    <div className="relative">
                        <select
                            onChange={(e) => handleExport(e.target.value)}
                            className="text-[11px] font-medium border border-slate-200 rounded-full text-slate-600 bg-white px-3 py-1.5 outline-none hover:border-blue-300 focus:border-blue-500 transition-colors cursor-pointer"
                            defaultValue=""
                        >
                            <option value="" disabled>匯出格式</option>
                            <option value="pdf">PDF</option>
                            <option value="docx">Word (.docx)</option>
                            <option value="markdown">Markdown</option>
                            <option value="plaintext">純文本</option>
                        </select>
                        <Download size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative">
                <SustainWriteTipTapEditor
                    ref={editorRef} // 傳遞 ref
                    value={content}
                    onChange={(htmlContent) => updateContent(chapterId, htmlContent, chapterName, chapterOrder, griRefs)}
                    editable={!isGeneratingAI[chapterId]} // 禁用時編輯器不可編輯
                />

                {/* AI Loading Overlay */}
                <div className={cn(
                    "absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-[1px] transition-all duration-500 pointer-events-none",
                    isGeneratingAI[chapterId] ? 'opacity-100' : 'opacity-0'
                )}>
                    <div className="p-4 bg-white/80 rounded-2xl border border-indigo-100 shadow-2xl flex flex-col items-center gap-3">
                        <RefreshCw size={24} className="text-indigo-600 animate-spin" />
                        <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest">Generating Content...</span>
                    </div>
                </div>
            </div>
        </div>
    );
}