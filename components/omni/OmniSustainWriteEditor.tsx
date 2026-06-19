"use client";

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import React, { useEffect, useImperativeHandle, forwardRef, useState, useRef } from 'react';
import { useSustainWriteVerification } from '@/hooks/useSustainWriteVerification';
import {
 Bold,
 Italic,
 Heading1,
 Heading2,
 Heading3,
 List,
 ListOrdered,
 Quote,
 RemoveFormatting,
 Sparkles,
 Wand2,
 RefreshCcw,
 Lock,
 FileDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// 定義暴露給父組件的 ref 類型
export interface OmniSustainWriteEditorRef {
 getHTML: () => string;
 getText: () => string;
 getJSON: () => Record<string, any>;
 editorInstance: Editor | null; // 暴露編輯器實例以供進階操作
}

interface OmniSustainWriteEditorProps {
 value: string;
 onChange: (value: string) => void;
 editable?: boolean;
 documentId?: string; // 用於區分不同文件的本地草稿
}

// 簡單的 SHA-256 Hash 產生器 (5T Trustworthy)
async function generateHashLock(text: string) {
 if (!text) return '0000000000000000';
 try {
 const encoder = new TextEncoder();
 const data = encoder.encode(text);
 const hashBuffer = await crypto.subtle.digest('SHA-256', data);
 const hashArray = Array.from(new Uint8Array(hashBuffer));
 const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
 return hashHex.substring(0, 16);
 } catch (e) {
 return 'HASH_ERR';
 }
}

const ToolbarButton = ({ onClick, isActive = false, disabled = false, children, title }: any) => (
 <button
 type="button"
 onClick={onClick}
 disabled={disabled}
 title={title}
 className={cn(
 'p-2 rounded-md transition-colors hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed',
 isActive
 ? 'bg-cyan-100 text-cyan-700 '
 : 'text-slate-600 '
 )}
 >
 {children}
 </button>
);

const MenuBar = ({ editor, documentId }: { editor: Editor | null; documentId: string }) => {
 const [isExporting, setIsExporting] = useState(false);

 if (!editor) {
 return null;
 }

 const handleExportPDF = async () => {
 setIsExporting(true);
 try {
 // @ts-ignore - html2pdf might not have strict TS definitions
 const html2pdf = (await import('html2pdf.js')).default;
 const element = editor.view.dom;

 // Temporarily add styling for PDF export
 const originalCssText = element.style.cssText;
 element.style.padding = '40px';
 element.style.fontFamily = 'Inter, sans-serif';

 const opt = {
 margin: 10,
 filename: `ESG_Report_${documentId}_${new Date().toISOString().split('T')[0]}.pdf`,
 image: { type: 'jpeg' as const, quality: 0.98 },
 html2canvas: { scale: 2, useCORS: true },
 jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
 };

 await html2pdf().set(opt).from(element).save();
 element.style.cssText = originalCssText;
 } catch (e) {
 console.error('PDF Export failed:', e);
 } finally {
 setIsExporting(false);
 }
 };

 return (
 <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-200 bg-slate-50 rounded-t-lg">
 <ToolbarButton
 onClick={() => editor.chain().focus().toggleBold().run()}
 disabled={!editor.can().chain().focus().toggleBold().run()}
 isActive={editor.isActive('bold')}
 title="Bold"
 >
 <Bold size={16} />
 </ToolbarButton>
 <ToolbarButton
 onClick={() => editor.chain().focus().toggleItalic().run()}
 disabled={!editor.can().chain().focus().toggleItalic().run()}
 isActive={editor.isActive('italic')}
 title="Italic"
 >
 <Italic size={16} />
 </ToolbarButton>
 <div className="w-px h-4 bg-slate-300 mx-1" />
 <ToolbarButton
 onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
 isActive={editor.isActive('heading', { level: 1 })}
 title="Heading 1"
 >
 <Heading1 size={16} />
 </ToolbarButton>
 <ToolbarButton
 onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
 isActive={editor.isActive('heading', { level: 2 })}
 title="Heading 2"
 >
 <Heading2 size={16} />
 </ToolbarButton>
 <ToolbarButton
 onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
 isActive={editor.isActive('heading', { level: 3 })}
 title="Heading 3"
 >
 <Heading3 size={16} />
 </ToolbarButton>
 <div className="w-px h-4 bg-slate-300 mx-1" />
 <ToolbarButton
 onClick={() => editor.chain().focus().toggleBulletList().run()}
 isActive={editor.isActive('bulletList')}
 title="Bullet List"
 >
 <List size={16} />
 </ToolbarButton>
 <ToolbarButton
 onClick={() => editor.chain().focus().toggleOrderedList().run()}
 isActive={editor.isActive('orderedList')}
 title="Ordered List"
 >
 <ListOrdered size={16} />
 </ToolbarButton>
 <ToolbarButton
 onClick={() => editor.chain().focus().toggleBlockquote().run()}
 isActive={editor.isActive('blockquote')}
 title="Quote"
 >
 <Quote size={16} />
 </ToolbarButton>
 <div className="flex-grow" />

 <ToolbarButton onClick={handleExportPDF} disabled={isExporting} title="Export to PDF">
 <span className="flex items-center gap-1 text-emerald-600 ">
 {isExporting ? <RefreshCcw size={16} className="animate-spin" /> : <FileDown size={16} />}
 <span className="text-[10px] hidden sm:inline-block font-bold">匯出 PDF</span>
 </span>
 </ToolbarButton>

 <ToolbarButton
 onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
 title="Clear Formatting"
 >
 <span className="flex items-center gap-1 text-amber-600 ">
 <RemoveFormatting size={16} />
 <span className="text-[10px] hidden sm:inline-block font-bold">清除格式</span>
 </span>
 </ToolbarButton>
 </div>
 );
};

const AIBubbleMenu = ({ editor }: { editor: Editor }) => {
 const [isAiLoading, setIsAiLoading] = useState(false);

 const handleAiRewrite = async (promptType: 'refine' | 'expand' | 'formal' | 'grammar') => {
 if (!editor) return;
 const { from, to } = editor.state.selection;
 const selectedText = editor.state.doc.textBetween(from, to, ' ');
 if (!selectedText) return;

 setIsAiLoading(true);
 try {
 let prompt = '';
 if (promptType === 'refine')
 prompt = `請將以下文字精煉、修正錯漏字，使其更通順：\n\n${selectedText}`;
 if (promptType === 'expand')
 prompt = `請以永續報告書的專業口吻，將以下文字擴寫並補充相關細節：\n\n${selectedText}`;
 if (promptType === 'formal')
 prompt = `請將以下文字轉換為符合 GRI 準則與上市櫃公司永續報告書的正式、客觀專業語氣：\n\n${selectedText}`;
 if (promptType === 'grammar')
 prompt = `請找出以下文字中的錯別字、文法語病或標點符號問題，並直接給出校正後的完美版本，不需解釋：\n\n${selectedText}`;

 // 5T 協議: 透過 OmniNexus 進行 L-Hub Swarm Routing
 const res = await fetch('/api/nexus/agent', {
 method: 'POST',
 headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
 tool: 'mcp_lhub_ai_ask',
 arguments: {
 prompt,
 context:
 '你是一個專業的 ESG 永續報告書撰寫助理，專精於修飾文辭、精煉語句、文法校正。直接回覆修改後的文字，不要包含任何開場白或說明。',
 },
 }),
 });

 const data = await res.json();
 // 兼容舊版 API 或新版 Nexus Response
 const responseText = data.data?.text || data.text || data.data;

 if (responseText && typeof responseText === 'string') {
 editor.chain().focus().insertContent(responseText).run();
 } else {
 console.warn('L-Hub Swarm Routing returned unexpected format:', data);
 }
 } catch (error) {
 console.error('L-Hub Swarm Routing Failed:', error);
 // Graceful Degradation: 若 AI 服務中斷，可在此實作 Toast 提示
 } finally {
 setIsAiLoading(false);
 }
 };

 return (
 <BubbleMenu
 editor={editor}
 className="flex bg-white border border-slate-200 shadow-xl rounded-lg overflow-hidden divide-x divide-slate-100 "
 >
 <button
 onClick={() => handleAiRewrite('refine')}
 disabled={isAiLoading}
 className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-cyan-600 hover:bg-cyan-50 disabled:opacity-50 transition-colors"
 >
 {isAiLoading ? <RefreshCcw size={14} className="animate-spin" /> : <Sparkles size={14} />}
 精煉文句
 </button>
 <button
 onClick={() => handleAiRewrite('grammar')}
 disabled={isAiLoading}
 className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 transition-colors"
 >
 <Sparkles size={14} />
 文法校正
 </button>
 <button
 onClick={() => handleAiRewrite('formal')}
 disabled={isAiLoading}
 className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-amber-600 hover:bg-amber-50 disabled:opacity-50 transition-colors"
 >
 <Wand2 size={14} />
 正式語氣
 </button>
 <button
 onClick={() => handleAiRewrite('expand')}
 disabled={isAiLoading}
 className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 disabled:opacity-50 transition-colors"
 >
 <Heading2 size={14} />
 擴寫細節
 </button>
 </BubbleMenu>
 );
};

const OmniSustainWriteEditor = forwardRef<OmniSustainWriteEditorRef, OmniSustainWriteEditorProps>(
 ({ value, onChange, editable = true, documentId = 'default' }, ref) => {
 const [hashLock, setHashLock] = useState<string>('0000000000000000');
 const { verifyText, result, isVerifying } = useSustainWriteVerification(value);

 const hashLockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

 const editor = useEditor({
 extensions: [StarterKit],
 content: value,
 editable: editable,
 onUpdate: ({ editor }) => {
 const html = editor.getHTML();
 onChange(html);

 // Debounce expensive operations to prevent UI freezing
 if (hashLockTimeoutRef.current) {
 clearTimeout(hashLockTimeoutRef.current);
 }
 hashLockTimeoutRef.current = setTimeout(async () => {
 // 5T Graceful Degradation: 本地草稿保存
 try {
 localStorage.setItem(`omni_draft_${documentId}`, html);
 } catch (e) {
 console.warn('Failed to save draft to localStorage', e);
 }

 // 5T Trustworthy: 即時計算 Hash Lock
 const textContent = editor.getText();
 const newHash = await generateHashLock(textContent);
 setHashLock(newHash);
 verifyText(textContent);
 }, 1000);
 },
 editorProps: {
 attributes: {
 class:
 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl focus:outline-none min-h-[400px] p-6 pb-12', // pb-12 預留空間給 Hash Badge
 },
 },
 });

 // 暴露 editor 實例的方法給父組件
 useImperativeHandle(ref, () => ({
 getHTML: () => editor?.getHTML() || '',
 getText: () => editor?.getText() || '',
 getJSON: () => editor?.getJSON() || {},
 editorInstance: editor,
 }));

 useEffect(() => {
 // 初始載入時計算 Hash
 if (editor && value) {
 const textContent = editor.getText();
 generateHashLock(textContent).then(setHashLock);
 verifyText(textContent);
 }
 }, [editor, value, verifyText]);

 useEffect(() => {
 if (editor && editor.getHTML() !== value) {
 editor.commands.setContent(value, { emitUpdate: false });
 }
 }, [value, editor]);

 if (!editor) {
 return (
 <div className="min-h-[400px] p-4 flex items-center justify-center text-slate-400 border border-slate-200 rounded-lg">
 載入萬能智能編撰器中...
 </div>
 );
 }

 return (
 <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm focus-within:border-cyan-500/50 transition-colors relative group">
 {editable && <MenuBar editor={editor} documentId={documentId} />}
 {editor && editable && <AIBubbleMenu editor={editor} />}
 <EditorContent editor={editor} />

 {/* 5T Protocol: Trustworthy Hash Lock Badge */}
 <div className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-slate-100/80 text-[10px] text-slate-500 font-mono rounded-md border border-slate-200/50 opacity-50 group-hover:opacity-100 transition-opacity">
 {isVerifying ? <RefreshCcw size={10} className="animate-spin text-cyan-500" /> : <Lock size={10} className={result.isTrustworthy ? "text-emerald-500" : "text-amber-500"} />}
 <span>5T-LOCK:{result.hashLock || hashLock} | Score:{result.score}</span>
 </div>

 {/* Print-only Verification Seal */}
 <div className="hidden print:block mt-8 p-4 border-2 border-slate-800 rounded-lg">
 <h3 className="font-bold text-lg mb-2">ESGGO 5T Protocol Verification Seal</h3>
 <p className="text-sm"><strong>Status:</strong> {result.isTrustworthy ? 'Verified (Trustworthy)' : 'Draft (Incomplete)'}</p>
 <p className="text-sm font-mono"><strong>Hash-Lock (ZKP):</strong> {result.hashLock || hashLock}</p>
 <p className="text-sm"><strong>GRI Coverage Score:</strong> {result.score}/100</p>
 </div>
 </div>
 );
 }
);

OmniSustainWriteEditor.displayName = 'OmniSustainWriteEditor';

export default OmniSustainWriteEditor;
