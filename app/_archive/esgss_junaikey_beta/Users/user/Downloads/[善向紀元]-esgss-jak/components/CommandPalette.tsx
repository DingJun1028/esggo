import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, LayoutDashboard, Leaf, FileText, Zap, Settings, Globe, Command, X, GraduationCap, Home, Trophy, BrainCircuit } from 'lucide-react';
import { View, Language } from '../types';
import { useToast } from '../contexts/ToastContext';
import { runMcpAction } from '../services/ai-service';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: View) => void;
  language: Language;
  toggleLanguage: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onNavigate, language, toggleLanguage }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();
  
  const isZh = language === 'zh-TW';

  // Define Commands
  const commands = [
    { 
      section: isZh ? '導航' : 'Navigation',
      items: [
        { id: 'nav-home', label: isZh ? '回到首頁 (My ESG)' : 'Go to My ESG', icon: Home, action: () => onNavigate(View.MY_ESG) },
        { id: 'nav-vault', label: isZh ? '個人寶庫 (Vault)' : 'Go to Personal Vault', icon: Trophy, action: () => onNavigate(View.VAULT) },
        { id: 'nav-dash', label: isZh ? '儀表板 (Dashboard)' : 'Go to Dashboard', icon: LayoutDashboard, action: () => onNavigate(View.DASHBOARD) },
        { id: 'nav-carbon', label: isZh ? '碳資產管理 (Carbon)' : 'Go to Carbon Assets', icon: Leaf, action: () => onNavigate(View.CARBON) },
        { id: 'nav-report', label: isZh ? '報告生成 (Report)' : 'Go to Report Gen', icon: FileText, action: () => onNavigate(View.REPORT) },
        { id: 'nav-academy', label: isZh ? '永續學院 (Academy)' : 'Go to Academy', icon: GraduationCap, action: () => onNavigate(View.ACADEMY) },
      ]
    },
    {
      section: isZh ? '系統動作' : 'System Actions',
      items: [
        { 
          id: 'act-gemini', 
          label: isZh ? 'Gemini 查詢' : 'Ask Gemini', 
          icon: BrainCircuit, 
          action: async () => {
            if (!query) {
              addToast('warning', isZh ? '請輸入查詢內容' : 'Please enter a query', 'System');
              return;
            }
            addToast('info', isZh ? '正在查詢 Gemini...' : 'Querying Gemini...', 'JunAiKey');
            const result = await runMcpAction('perform_deep_doc_analysis', { query }, language);
            if (result.success) {
              addToast('success', isZh ? 'Gemini 回應' : 'Gemini Response', JSON.stringify(result.result, null, 2));
            } else {
              addToast('error', isZh ? 'Gemini 查詢失敗' : 'Gemini Query Failed', result.error);
            }
          } 
        },
        { id: 'act-lang', label: isZh ? '切換語言 (Switch Language)' : 'Switch Language', icon: Globe, action: () => { toggleLanguage(); addToast('success', isZh ? '語言已切換' : 'Language Switched', 'System'); } },
        { id: 'act-scan', label: isZh ? '啟動 AI 診斷' : 'Run AI Diagnostics', icon: Zap, action: () => { onNavigate(View.DIAGNOSTICS); addToast('info', 'AI Diagnostics Started...', 'JunAiKey'); } },
        { id: 'act-settings', label: isZh ? '系統設定' : 'Open Settings', icon: Settings, action: () => onNavigate(View.SETTINGS) },
      ]
    }
  ];

  // Filter commands
  const filteredCommands = commands.map(section => ({
    ...section,
    items: section.items.filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
  })).filter(section => section.items.length > 0);

  // Flatten for keyboard navigation
  const flatItems = filteredCommands.flatMap(s => s.items);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.ctrlKey && e.key === 'v') {
        e.preventDefault();
        navigator.clipboard.readText().then(text => {
          setQuery(q => q + text);
        });
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % flatItems.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + flatItems.length) % flatItems.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (flatItems[selectedIndex]) {
          flatItems[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col ring-1 ring-white/10">
        
        {/* Input Header */}
        <div className="flex items-center px-4 py-4 border-b border-white/5 bg-white/5">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            placeholder={isZh ? "搜尋指令或頁面..." : "Type a command or search..."}
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-lg"
          />
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="bg-white/10 px-1.5 py-0.5 rounded border border-white/5">ESC</span>
            <span>to close</span>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
          {flatItems.length === 0 ? (
            <div className="p-8 text-center text-gray-500 text-sm">
              {isZh ? '找不到相關指令' : 'No commands found.'}
            </div>
          ) : (
            filteredCommands.map((section, sIdx) => (
              <div key={sIdx} className="mb-2">
                <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  {section.section}
                </div>
                {section.items.map((item) => {
                  // Find the global index of this item for highlighting
                  const globalIdx = flatItems.indexOf(item);
                  const isSelected = globalIdx === selectedIndex;

                  return (
                    <button
                      key={item.id}
                      onClick={() => { item.action(); onClose(); }}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group
                        ${isSelected 
                          ? 'bg-celestial-purple/20 text-white shadow-[0_0_15px_rgba(139,92,246,0.2)] border border-celestial-purple/30' 
                          : 'text-gray-400 hover:bg-white/5 border border-transparent'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-5 h-5 ${isSelected ? 'text-celestial-purple' : 'text-gray-500'}`} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {isSelected && <ArrowRight className="w-4 h-4 text-celestial-purple animate-pulse" />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-black/20 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500">
            <div className="flex items-center gap-2">
                <Command className="w-3 h-3" />
                <span>JunAiKey Command Nexus</span>
            </div>
            <div className="flex gap-4">
                <span><strong className="text-gray-400">↑↓</strong> to navigate</span>
                <span><strong className="text-gray-400">↵</strong> to select</span>
            </div>
        </div>
      </div>
    </div>
  );
};