'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ShieldCheck, Terminal, Cpu, Search, ChevronRight, Activity, Zap, Database } from 'lucide-react';
import { BrandCard, BrandBadge, BrandStatusDot } from '@/components/brand';

interface Section {
  id: string;
  title: string;
  content: string;
  icon: React.ElementType;
}

export default function WikiClientPage({ content }: { content: string }) {
  // 🌟 簡易的 Markdown 解析與動態分段邏輯
  const sections = useMemo<Section[]>(() => {
    const lines = content.split('\n');
    const parsed: Section[] = [];
    let currentSection: Section | null = null;

    lines.forEach((line, index) => {
      if (line.startsWith('## ') || (index === 0 && line.startsWith('# '))) {
        if (currentSection) parsed.push(currentSection);
        const title = line.replace(/^#+ /, '').trim();

        // 根據標題關鍵字分派圖示，賦予 UI 靈魂
        let icon = BookOpen;
        if (title.toLowerCase().includes('5t') || title.includes('協議')) icon = ShieldCheck;
        if (title.toLowerCase().includes('agent') || title.includes('蜂群')) icon = Cpu;
        if (title.toLowerCase().includes('zkp') || title.includes('密碼')) icon = Database;
        if (title.includes('法典') || title.includes('codex') || title.includes('架構')) icon = Terminal;

        currentSection = {
          id: `sec-${index}`,
          title,
          content: '',
          icon
        };
      } else if (currentSection) {
        currentSection.content += line + '\n';
      }
    });
    if (currentSection) parsed.push(currentSection);

    if (parsed.length === 0) {
      parsed.push({ id: 'sec-0', title: 'System Codex', content, icon: BookOpen });
    }
    return parsed;
  }, [content]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = sections.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSection = filteredSections.length > 0
    ? (filteredSections.includes(sections[activeIndex]) ? sections[activeIndex] : filteredSections[0])
    : null;

  // 🌟 輕量且高質感的 Markdown 渲染器 (無需額外安裝套件)
  const renderMarkdown = (text: string) => {
    return text.split('\n\n').map((block, i) => {
      if (!block.trim()) return null;

      // 處理 ### 標題
      if (block.startsWith('### ')) {
        return <h3 key={i} className="text-xl font-black text-cyan-400 mt-8 mb-4 tracking-wider flex items-center gap-2"><div className="w-1.5 h-6 bg-cyan-500 rounded-full" /> {block.replace('### ', '')}</h3>;
      }

      // 處理 Table (表格)
      if (block.startsWith('|')) {
        const rows = block.split('\n').filter(r => r.includes('|') && !r.includes('---'));
        return (
          <div key={i} className="overflow-x-auto my-6 border border-white/10 rounded-xl bg-black/20 shadow-lg">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="bg-white/5 text-cyan-300 border-b border-white/10">
                  {rows[0].split('|').filter(Boolean).map((cell, j) => (
                    <th key={j} className="p-4 font-bold tracking-widest uppercase text-xs">{cell.trim()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    {row.split('|').filter(Boolean).map((cell, j) => {
                      const formattedCell = cell.trim().replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>').replace(/`(.*?)`/g, '<code class="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">$1</code>');
                      return <td key={j} className="p-4 text-slate-300" dangerouslySetInnerHTML={{ __html: formattedCell }} />;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      // 處理 List (列表)
      if (block.startsWith('- ')) {
        return (
          <ul key={i} className="list-disc list-inside space-y-2 my-4 text-slate-300 marker:text-cyan-500 leading-relaxed">
            {block.split('\n').filter(l => l.startsWith('- ')).map((item, j) => {
              const formattedItem = item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>').replace(/`(.*?)`/g, '<code class="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">$1</code>');
              return <li key={j} dangerouslySetInnerHTML={{ __html: formattedItem }} />;
            })}
          </ul>
        );
      }

      // 處理 Code Block (程式碼)
      if (block.startsWith('```')) {
        const code = block.replace(/```\w*\n?/, '').replace(/```$/, '');
        return (
          <div key={i} className="my-6 relative group">
            <div className="absolute top-0 left-0 w-full h-full bg-indigo-500/10 blur-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
            <pre className="relative bg-[#0f172a] p-5 rounded-xl border border-indigo-500/30 text-emerald-400 font-mono text-sm overflow-x-auto shadow-inner">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // 處理 Paragraph (段落)
      const formattedText = block
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
        .replace(/`(.*?)`/g, '<code class="text-indigo-300 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/20">$1</code>');

      return <p key={i} className="text-slate-300 leading-relaxed mb-4 text-[15px]" dangerouslySetInnerHTML={{ __html: formattedText }} />;
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col md:flex-row selection:bg-cyan-500/30">
      {/* ─── 左側導覽列 (Sidebar) ──────────────── */}
      <aside className="w-full md:w-80 border-r border-white/10 bg-[#020617]/80 backdrop-blur-xl flex flex-col h-screen sticky top-0 z-20">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <BrandStatusDot status="active" pulse size="sm" />
            <span className="text-xs font-mono font-black tracking-[0.3em] text-cyan-400 uppercase">OmniCore_Wiki</span>
          </div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3 mb-6">
            <BookOpen className="text-cyan-400" />
            系統法典條目
          </h1>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="搜尋法典、5T 協議..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-full pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors shadow-inner"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1">
          {filteredSections.map((sec) => {
            const isActive = activeSection?.id === sec.id;
            const Icon = sec.icon;
            return (
              <button key={sec.id} onClick={() => {
                const origIndex = sections.findIndex(s => s.id === sec.id);
                if (origIndex !== -1) setActiveIndex(origIndex);
              }}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group ${isActive ? 'bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'bg-transparent border border-transparent hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <Icon size={16} className={isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300 transition-colors'} />
                  <span className={`text-sm truncate font-bold tracking-wide ${isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-slate-200 transition-colors'}`}>{sec.title}</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-cyan-500" />}
              </button>
            );
          })}
        </div>
      </aside>

      {/* ─── 右側主要內容區 (Main Content) ────────── */}
      <main className="flex-1 relative overflow-hidden flex flex-col h-screen">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

        {activeSection && (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-16 relative z-10">
            <motion.div key={activeSection.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <BrandBadge variant="outline" className="text-cyan-400 border-cyan-500/30">
                  Chapter {sections.findIndex(s => s.id === activeSection.id) + 1}
                </BrandBadge>
                <span className="text-xs text-slate-500 font-mono uppercase tracking-widest">OmniCore Architecture Registry</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-12 flex items-center gap-4">
                <activeSection.icon className="text-cyan-400" size={40} />
                {activeSection.title}
              </h2>
              <div className="prose prose-invert max-w-none">
                {renderMarkdown(activeSection.content)}
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}