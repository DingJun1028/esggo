import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNoteSystem, NoteData } from '@/store/useNoteSystem';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  RotateCw,
  Settings,
  HelpCircle,
  Sparkles,
  LayoutGrid,
  List,
  Moon,
  Sun,
  X,
  Edit,
  Trash2,
  ShieldCheck,
  Link as LinkIcon,
  Activity,
  Award,
  Network,
  Users,
  Briefcase,
  Lightbulb,
  CheckSquare,
  StickyNote,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import { omniCapacitiesService, OmniObject, OmniObjectType } from '../../services/OmniCapacitiesService';

// 擴展型定義以相容於 UI
type NoteCategory = OmniObjectType | 'INSIGHT' | 'ESG' | 'TECHNICAL' | 'BUSINESS' | 'PERSONAL';
type ViewMode = 'grid' | 'list';
type ExportFormat = 'markdown' | 'json' | 'pdf' | 'html';

// UI 專用的筆記顯示介面
interface OmniNote extends NoteData {
  title: string;
  category: NoteCategory;
}

// 類別配置
const CATEGORY_CONFIG: Record<NoteCategory, { label: string; color: string; icon: string }> = {
  INSIGHT: { label: '洞察', color: 'bg-purple-500', icon: '💡' },
  ESG: { label: 'ESG', color: 'bg-green-500', icon: '🌱' },
  TECHNICAL: { label: '技術', color: 'bg-blue-500', icon: '⚙️' },
  BUSINESS: { label: '商業', color: 'bg-orange-500', icon: '💼' },
  PERSONAL: { label: '個人', color: 'bg-pink-500', icon: '👤' },
  // Phase 28: OmniCapacities
  PERSON: { label: '人員', color: 'bg-indigo-500', icon: '👤' },
  PROJECT: { label: '項目', color: 'bg-cyan-500', icon: '🚀' },
  CONCEPT: { label: '概念', color: 'bg-yellow-500', icon: '🧠' },
  MEETING: { label: '會議', color: 'bg-slate-500', icon: '📅' },
  EVENT: { label: '事件', color: 'bg-rose-500', icon: '🔔' },
  TASK: { label: '任務', color: 'bg-amber-500', icon: '✅' },
  MEMO: { label: '備忘', color: 'bg-emerald-500', icon: '📝' },
};

export default function OmniNotesPage() {
  // 狀態管理 - 使用 OmniCircle 筆記系統
  const { notes: storeNotes, saveNote, deleteNote, updateNoteMetadata } = useNoteSystem();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory | 'ALL'>('ALL');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [darkMode, setDarkMode] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState<OmniNote | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | OmniObjectType>('ALL');
  const [showGraph, setShowGraph] = useState(false);

  // OmniCapacities Integration
  const [capacitiesObjects, setCapacitiesObjects] = useState<OmniObject[]>([]);

  useEffect(() => {
    // 獲取現有對象
    const serviceObjects = omniCapacitiesService.getAllObjects();

    const allNotes = Object.values(storeNotes || {});
    allNotes.forEach(note => {
      const exists = serviceObjects.find(o => o.id === note.id || o.title === (note as any).title);
      const category = (note.knowledgeCategory || 'PERSONAL') as NoteCategory;
      const config = CATEGORY_CONFIG[category];
      if (!exists && config?.label) {
        // 僅同步屬於對象類期的筆記
        const objType = category as any;
        if (['PERSON', 'PROJECT', 'CONCEPT', 'MEETING', 'EVENT', 'TASK', 'MEMO'].includes(objType)) {
          // 這裡可以選擇性地調用 service.createObject，但先只做 UI 層同步
        }
      }
    });

    setCapacitiesObjects(serviceObjects);
  }, [storeNotes]); // Re-sync when notes change

  // 將 Store 數據轉換為 UI 渲染格式
  const notes: OmniNote[] = Object.values(storeNotes || {}).map(n => {
    const lines = (n.content || '').split('\n');
    const firstLine = lines[0] || '';
    return {
      ...n,
      title: firstLine.replace(/^#\s*/, '') || n.contextId || '無標題',
      category: (n.knowledgeCategory || 'PERSONAL') as NoteCategory
    };
  });

  // 導入筆記邏輯
  const importNote = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        if (file.name.endsWith('.json')) {
          const imported = JSON.parse(content);
          const notesToImport = Array.isArray(imported) ? imported : [imported];

          notesToImport.forEach(note => {
            const contextId = note.contextId || `imported_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
            saveNote(contextId, (note as any).content || '', {
              ...note,
              updatedAt: Date.now()
            });
          });
        } else {
          // Markdown 導入
          const contextId = `md_${Date.now()}`;
          saveNote(contextId, content, {
            knowledgeCategory: 'PERSONAL',
            updatedAt: Date.now(),
            tags: ['imported', 'markdown']
          });
        }
        setShowImportModal(false);
      } catch (err) {
        console.error('Failed to import note:', err);
        alert('導入失敗，請檢查文件格式');
      }
    };
    reader.readAsText(file);
  };

  // 導出筆記邏輯
  const exportNote = (note: OmniNote, format: ExportFormat) => {
    let content = '';
    let mimeType = 'text/plain';
    const fileName = `${note.title}.${format === 'markdown' ? 'md' : format}`;

    switch (format) {
      case 'json':
        content = JSON.stringify(note, null, 2);
        mimeType = 'application/json';
        break;
      case 'markdown':
        content = note.content;
        mimeType = 'text/markdown';
        break;
      case 'html':
        content = `<html><body><h1>${note.title}</h1><div>${note.content.replace(/\n/g, '<br>')}</div></body></html>`;
        mimeType = 'text/html';
        break;
      default:
        content = note.content;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
  };

  // 過濾與統計邏輯
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags || [])));

  const filteredNotes = notes.filter(note => {
    // 類別過濾
    if (selectedCategory !== 'ALL' && note.category !== selectedCategory) {
      return false;
    }

    // 標籤過濾
    if (selectedTags.length > 0) {
      const noteTags = note.tags || [];
      const hasAllTags = selectedTags.every(tag => noteTags.includes(tag));
      if (!hasAllTags) return false;
    }

    // 搜索過濾
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const noteTags = note.tags || [];
      const searchText = `${note.title} ${note.content} ${noteTags.join(' ')}`.toLowerCase();
      if (!searchText.includes(query)) return false;
    }

    // [Phase 28] 對象類型過濾
    if (activeTab !== 'ALL' && note.category.toUpperCase() !== activeTab) {
      // Find if any capacities object matches this note
      const capObj = capacitiesObjects.find(o => o.title === note.title || (note as any).content?.includes(o.content));
      if (!capObj || capObj.type !== activeTab) return false;
    }

    return true;
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* 頂部導航欄 */}
      <header className={`sticky top-0 z-50 backdrop-blur-lg border-b ${darkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Omni 筆記</h1>
                <p className="text-xs text-gray-500">Omni Notes</p>
              </div>
            </div>

            {/* 搜索欄 */}
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="搜索筆記..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 rounded-lg border ${darkMode
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-purple-500'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                />
              </div>
            </div>

            {/* 操作按鈕 */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowGraph(!showGraph)}
                className={`p-2 rounded-lg transition-colors ${showGraph ? 'bg-purple-500/10 text-purple-500' : darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                title="可視化圖譜"
              >
                <Network className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                title={viewMode === 'grid' ? '列表視圖' : '網格視圖'}
              >
                {viewMode === 'grid' ? <List className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                  }`}
                title={darkMode ? '淺色模式' : '深色模式'}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="w-5 h-5" />
                <span>新建筆記</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主內容區 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 過濾器 */}
        <div className={`mb-6 p-4 rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex flex-wrap items-center gap-4">
            {/* 類別過濾 */}
            <div className="flex items-center space-x-2">
              <Filter className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as NoteCategory | 'ALL')}
                className={`px-3 py-2 rounded-lg border ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              >
                <option value="ALL">所有類別</option>
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.icon} {config.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 標籤過濾 */}
            <div className="flex items-center space-x-2 flex-wrap">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedTags(
                      selectedTags.includes(tag)
                        ? selectedTags.filter(t => t !== tag)
                        : [...selectedTags, tag]
                    );
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedTags.includes(tag)
                    ? 'bg-purple-500 text-white'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* 清除過濾 */}
            {(selectedCategory !== 'ALL' || selectedTags.length > 0) && (
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedTags([]);
                }}
                className="text-sm text-purple-500 hover:text-purple-600"
              >
                清除過濾
              </button>
            )}
          </div>
        </div>

        {/* 統計信息 */}
        <div className="mb-6 flex items-center justify-between">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            顯示 {filteredNotes.length} 筆記，共 {notes.length} 筆
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowImportModal(true)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
            >
              <Upload className="w-4 h-4" />
              <span className="text-sm">導入</span>
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
            >
              <Download className="w-4 h-4" />
              <span className="text-sm">導出</span>
            </button>
            <button
              onClick={() => setIsSyncing(true)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                }`}
            >
              <RotateCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="text-sm">同步</span>
            </button>
          </div>
        </div>

        {/* 對象分類導航 (Phase 28) */}
        <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <TabButton active={activeTab === 'ALL'} onClick={() => setActiveTab('ALL')} icon={<LayoutGrid size={18} />} label="全部" />
          <TabButton active={activeTab === 'PERSON'} onClick={() => setActiveTab('PERSON')} icon={<Users size={18} />} label="人員" />
          <TabButton active={activeTab === 'PROJECT'} onClick={() => setActiveTab('PROJECT')} icon={<Briefcase size={18} />} label="項目" />
          <TabButton active={activeTab === 'CONCEPT'} onClick={() => setActiveTab('CONCEPT')} icon={<Lightbulb size={18} />} label="概念" />
          <TabButton active={activeTab === 'TASK'} onClick={() => setActiveTab('TASK')} icon={<CheckSquare size={18} />} label="任務" />
          <TabButton active={activeTab === 'MEMO'} onClick={() => setActiveTab('MEMO')} icon={<StickyNote size={18} />} label="備忘" />
        </div>

        {/* 筆記列表 */}
        {showGraph ? (
          <NetworkGraph
            notes={filteredNotes}
            darkMode={darkMode}
            onNodeClick={(note) => setSelectedNote(note)}
          />
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note as any}
                darkMode={darkMode}
                onClick={() => setSelectedNote(note as any)}
                onExport={(format) => exportNote(note as any, format)}
              />
            ))}
          </div>
        ) : (
          <div className={`rounded-xl border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            {filteredNotes.map(note => (
              <NoteListItem
                key={note.id}
                note={note as any}
                darkMode={darkMode}
                onClick={() => setSelectedNote(note as any)}
                onExport={(format) => exportNote(note as any, format)}
              />
            ))}
          </div>
        )}

        {/* 空狀態 */}
        {filteredNotes.length === 0 && (
          <div className="text-center py-16">
            <FileText className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
            <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              沒有找到筆記
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              嘗試調整搜索條件或創建新筆記
            </p>
          </div>
        )}
      </main>

      {/* 筆記詳情模態框 */}
      {selectedNote && (
        <NoteDetailModal
          note={selectedNote as any}
          darkMode={darkMode}
          onClose={() => setSelectedNote(null)}
          onSave={(updatedNote) => {
            saveNote(updatedNote.contextId, updatedNote.content, updatedNote);
            setSelectedNote(updatedNote);
          }}
          onDelete={(id) => {
            // 注意：store 使用 contextId，UI 可能需要轉換
            const noteToDelete = Object.values(storeNotes).find(n => n.id === id);
            if (noteToDelete) {
              deleteNote(noteToDelete.contextId);
            }
            setSelectedNote(null);
          }}
          onExport={(format) => exportNote(selectedNote as any, format)}
        />
      )}

      {/* 創建筆記模態框 */}
      {showCreateModal && (
        <CreateNoteModal
          darkMode={darkMode}
          onClose={() => setShowCreateModal(false)}
          onSave={(newNote) => {
            saveNote(newNote.contextId, newNote.content, newNote);
            setShowCreateModal(false);
          }}
        />
      )}

      {/* 導入模態框 */}
      {showImportModal && (
        <ImportModal
          darkMode={darkMode}
          onClose={() => setShowImportModal(false)}
          onImport={importNote}
        />
      )}

      {/* 導出模態框 */}
      {showExportModal && (
        <ExportModal
          darkMode={darkMode}
          notes={filteredNotes}
          onClose={() => setShowExportModal(false)}
          onExport={(note, format) => exportNote(note, format)}
        />
      )}
    </div>
  );
}

// Phase 28: 標籤切換按鈕
function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-all whitespace-nowrap ${active
        ? 'bg-purple-500 text-white border-purple-500 shadow-md'
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-500'
        }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

// 筆記卡片組件
function NoteCard({ note, darkMode, onClick, onExport }: {
  note: OmniNote;
  darkMode: boolean;
  onClick: () => void;
  onExport: (format: ExportFormat) => void;
}) {
  const category = (note.knowledgeCategory || 'PERSONAL') as NoteCategory;
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG['PERSONAL'];
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`group relative p-6 rounded-xl border cursor-pointer transition-all hover:shadow-lg ${darkMode
        ? 'bg-gray-800 border-gray-700 hover:border-purple-500'
        : 'bg-white border-gray-200 hover:border-purple-500'
        }`}
    >
      {/* 類別標籤 */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        {note.investigationStatus && (
          <span className={`p-1 rounded-full ${note.investigationStatus === 'resolved' ? 'text-green-500' : 'text-orange-500'}`} title={`調查狀態: ${note.investigationStatus}`}>
            <ShieldCheck className="w-4 h-4" />
          </span>
        )}
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs text-white ${config.color}`}>
          {config.icon} {config.label}
        </span>
      </div>

      {/* 標題 */}
      <h3 className={`text-lg font-semibold mb-2 pr-20 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        {note.title}
      </h3>

      {/* 內容預覽 */}
      <p className={`text-sm mb-4 line-clamp-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {note.content.split('\n').slice(1).join('\n').substring(0, 150)}...
      </p>

      {/* 標籤與元數據 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {note.tags?.slice(0, 3).map(tag => (
          <span
            key={tag}
            className={`px-2 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
              }`}
          >
            {tag}
          </span>
        ))}
        {note.linkedLogIds && note.linkedLogIds.length > 0 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <LinkIcon className="w-3 h-3 mr-1" />
            {note.linkedLogIds.length} Logs
          </span>
        )}
      </div>

      {/* 底部信息 */}
      <div className={`flex items-center justify-between text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        <span>{new Date(note.updatedAt).toLocaleDateString('zh-TW')}</span>
        <div className="flex items-center space-x-2">
          {note.isKnowledgeAsset && (
            <Award className="w-4 h-4 text-yellow-500" title="知識資產" />
          )}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowExportMenu(!showExportMenu);
              }}
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700`}
            >
              <Download className="w-4 h-4" />
            </button>
            {showExportMenu && (
              <div className={`absolute right-0 bottom-full mb-1 w-32 rounded-lg shadow-lg border z-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                {(['markdown', 'json', 'html', 'pdf'] as ExportFormat[]).map(format => (
                  <button
                    key={format}
                    onClick={(e) => {
                      e.stopPropagation();
                      onExport(format);
                      setShowExportMenu(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                  >
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 筆記列表項組件
function NoteListItem({ note, darkMode, onClick, onExport }: {
  note: OmniNote;
  darkMode: boolean;
  onClick: () => void;
  onExport: (format: ExportFormat) => void;
}) {
  const category = (note.knowledgeCategory || 'PERSONAL') as NoteCategory;
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG['PERSONAL'];
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <div
      onClick={onClick}
      className={`group flex items-center p-4 border-b last:border-b-0 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}
    >
      {/* 類別圖標 */}
      <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center text-white mr-4 shadow-sm`}>
        <span className="text-lg">{config.icon}</span>
      </div>

      {/* 內容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <h3 className={`text-sm font-bold truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {note.title}
          </h3>
          {note.isKnowledgeAsset && <Award className="w-3 h-3 text-yellow-500" />}
        </div>
        <p className={`text-xs line-clamp-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {note.content.split('\n').slice(1).join(' ').substring(0, 100)}...
        </p>
        <div className="flex items-center gap-2 mt-2">
          {note.tags?.slice(0, 2).map(tag => (
            <span
              key={tag}
              className={`px-2 py-0.5 rounded-full text-[10px] ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}
            >
              {tag}
            </span>
          ))}
          {note.linkedLogIds && note.linkedLogIds.length > 0 && (
            <span className="text-[10px] text-blue-500 flex items-center">
              <LinkIcon className="w-2 h-2 mr-0.5" />
              {note.linkedLogIds.length}
            </span>
          )}
        </div>
      </div>

      {/* 元數據 */}
      <div className={`text-[10px] text-right ml-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        <div>{new Date(note.updatedAt).toLocaleDateString('zh-TW')}</div>
        <div className="relative mt-2 flex justify-end items-center space-x-2">
          {note.investigationStatus === 'investigating' && <Activity className="w-3 h-3 text-orange-500 animate-pulse" />}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowExportMenu(!showExportMenu);
            }}
            className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700`}
          >
            <Download className="w-4 h-4" />
          </button>
          {showExportMenu && (
            <div className={`absolute right-0 top-full mt-1 w-32 rounded-lg shadow-lg border z-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
              {(['markdown', 'json', 'html', 'pdf'] as ExportFormat[]).map(format => (
                <button
                  key={format}
                  onClick={(e) => {
                    e.stopPropagation();
                    onExport(format);
                    setShowExportMenu(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 筆記詳情模態框
function NoteDetailModal({ note, darkMode, onClose, onSave, onDelete, onExport }: {
  note: OmniNote;
  darkMode: boolean;
  onClose: () => void;
  onSave: (note: OmniNote) => void;
  onDelete: (contextId: string) => void;
  onExport: (format: ExportFormat) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedNote, setEditedNote] = useState<OmniNote>(note);

  const handleSave = () => {
    onSave({
      ...editedNote,
      updatedAt: Date.now(),
    });
    setIsEditing(false);
  };

  const category = (note.knowledgeCategory || 'PERSONAL') as NoteCategory;
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG['PERSONAL'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
        {/* 頭部 */}
        <div className={`sticky top-0 z-10 p-6 border-b flex items-center justify-between ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm text-white ${config.color}`}>
              {config.icon} {config.label}
            </span>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {new Date(note.updatedAt).toLocaleDateString('zh-TW')}
            </span>
            {note.isKnowledgeAsset && (
              <Award className="w-4 h-4 text-yellow-500" title="知識資產" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onExport('markdown')}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              title="導出為 Markdown"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              title={isEditing ? '取消編輯' : '編輯'}
            >
              {isEditing ? <X className="w-5 h-5" /> : <Edit className="w-5 h-5" />}
            </button>
            <button
              onClick={() => {
                if (confirm('確定要刪除這個筆記嗎？')) {
                  onDelete(note.contextId);
                }
              }}
              className={`p-2 rounded-lg transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20`}
              title="刪除"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 內容區域 - 使用兩欄佈局以支持屬性面板 (Phase 28) */}
        <div className="flex flex-col lg:flex-row h-[calc(90vh-80px)] overflow-hidden">
          {/* 左側：主內容與編輯器 */}
          <div className="flex-1 overflow-y-auto p-6 border-r border-gray-200 dark:border-gray-700">
            {isEditing ? (
              <div className="space-y-4">
                <textarea
                  value={editedNote.content}
                  onChange={(e) => setEditedNote({ ...editedNote, content: e.target.value })}
                  rows={20}
                  className={`w-full px-4 py-3 rounded-lg border font-mono ${darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                  placeholder="在此編輯內容（支持 Markdown）..."
                />
              </div>
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                <h1 className="text-3xl font-bold mb-4">{note.title}</h1>
                <div className="whitespace-pre-wrap">{note.content}</div>
              </div>
            )}
          </div>

          {/* 右側：屬性面板 (Phase 28 Properties Panel) */}
          <div className={`w-full lg:w-80 overflow-y-auto p-6 ${darkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-6 flex items-center">
              <Settings className="w-4 h-4 mr-2" /> 奧秘屬性
            </h3>

            <div className="space-y-6">
              {/* 類型與同步狀態 */}
              <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5">
                <label className="text-xs text-gray-400 block mb-2">對象類型</label>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-500">{note.category}</span>
                  {note.isKnowledgeAsset && <ShieldCheck className="w-5 h-5 text-green-500" />}
                </div>
              </div>

              {/* Tomemo 動作 */}
              {(note.category as any) === 'TASK' && !note.isKnowledgeAsset && (
                <button
                  onClick={async () => {
                    const result = await omniCapacitiesService.convertToMemo(note.id);
                    if (result) {
                      onSave({ ...note, category: 'MEMO' as NoteCategory, knowledgeCategory: 'MEMO', isKnowledgeAsset: true });
                      alert('任務已結晶化為知識備忘！');
                    }
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:opacity-90 transition-all font-bold shadow-lg"
                >
                  <Sparkles size={18} />
                  <span>結晶化 (Tomemo)</span>
                </button>
              )}

              {/* 關聯圖譜預覽 */}
              <div>
                <label className="text-xs text-gray-400 block mb-2">雙向連結</label>
                <div className="space-y-2">
                  {note.linkedLogIds && note.linkedLogIds.length > 0 && (
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-xs">
                      <span className="text-blue-500 font-bold">Outgoing:</span> {note.linkedLogIds.length} 個節點
                    </div>
                  )}
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-xs text-gray-400 text-center italic">
                    正在掃描反向連結...
                  </div>
                </div>
              </div>

              {/* AI 共鳴掃描器 (Phase 28 AI Resonance) */}
              <ResonanceScanner
                currentNote={note}
                allNotes={Object.values(useNoteSystem.getState().notes) as any}
                darkMode={darkMode}
              />
            </div>
          </div>
        </div>

        {/* 底部操作欄（僅編輯時顯示） */}
        {isEditing && (
          <div className={`p-4 border-t flex justify-end space-x-2 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <button
              onClick={() => {
                setEditedNote(note);
                setIsEditing(false);
              }}
              className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              保存
            </button>
          </div>
        )}

        {/* 標籤 */}
        <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex flex-wrap gap-2">
            {note.tags.map(tag => (
              <span
                key={tag}
                className={`px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 創建筆記模態框
function CreateNoteModal({ darkMode, onClose, onSave }: {
  darkMode: boolean;
  onClose: () => void;
  onSave: (note: Partial<NoteData> & { contextId: string; content: string }) => void;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoteCategory>('PERSONAL');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleSave = () => {
    if (!content.trim()) return;

    const contextId = `note_${Date.now()}`;
    onSave({
      contextId,
      content: content.trim(),
      knowledgeCategory: category,
      tags,
      updatedAt: Date.now()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
        {/* 頭部 */}
        <div className={`p-6 border-b flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
          <h2 className="text-xl font-semibold">創建新筆記</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 表單 */}
        <div className="p-6 space-y-4">
          <div>
            <p className={`text-xs mb-4 p-3 rounded bg-blue-500/10 border border-blue-500/20 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
              提示：內容的第一行將自動作為標題。支持 Markdown 格式。
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              類別
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as NoteCategory)}
              className={`w-full px-4 py-3 rounded-lg border ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
            >
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.icon} {config.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              內容
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className={`w-full px-4 py-3 rounded-lg border ${darkMode
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
              placeholder="輸入筆記內容（支持 Markdown 格式）..."
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              標籤
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className={`flex-1 px-4 py-3 rounded-lg border ${darkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
                placeholder="輸入標籤後按 Enter 添加..."
              />
              <button
                onClick={handleAddTag}
                className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                添加
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <span
                  key={tag}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}
                >
                  {tag}
                  <button
                    onClick={() => setTags(tags.filter(t => t !== tag))}
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 底部按鈕 */}
        <div className={`p-6 border-t flex justify-end space-x-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            創建筆記
          </button>
        </div>
      </div>
    </div>
  );
}

// 導入模態框
function ImportModal({ darkMode, onClose, onImport }: {
  darkMode: boolean;
  onClose: () => void;
  onImport: (file: File) => void;
}) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
        <div className={`p-6 border-b flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
          <h2 className="text-xl font-semibold">導入筆記</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${darkMode
              ? 'border-gray-600 hover:border-purple-500'
              : 'border-gray-300 hover:border-purple-500'
              }`}
          >
            <Upload className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <p className={`mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              點擊或拖拽文件到這裡
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              支持 Markdown (.md)、JSON (.json) 格式
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.json,.txt"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}

// 導出模態框
function ExportModal({ darkMode, notes, onClose, onExport }: {
  darkMode: boolean;
  notes: OmniNote[];
  onClose: () => void;
  onExport: (note: OmniNote, format: ExportFormat) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
        <div className={`p-6 border-b flex items-center justify-between ${darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
          <h2 className="text-xl font-semibold">導出筆記</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {notes.map(note => (
            <div
              key={note.id}
              className={`p-4 rounded-lg border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <h3 className={`font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {note.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {(['markdown', 'json', 'html', 'pdf'] as ExportFormat[]).map(format => (
                  <button
                    key={format}
                    onClick={() => onExport(note, format)}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${darkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// --- Phase 28: Network Visualization Components ---

interface NodePosition {
  id: string;
  x: number;
  y: number;
  label: string;
  category: NoteCategory;
}

interface Link {
  source: string;
  target: string;
}

function NetworkGraph({ notes, darkMode, onNodeClick }: { notes: OmniNote[], darkMode: boolean, onNodeClick: (note: OmniNote) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<NodePosition[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // 初始化節點位置與連結
  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setDimensions({ width: clientWidth, height: clientHeight });

      // 創建節點：使用圓形佈局作為初始位置
      const newNodes = notes.map((note, i) => {
        const angle = (i / notes.length) * 2 * Math.PI;
        const radius = Math.min(clientWidth, clientHeight) * 0.35;
        return {
          id: note.id,
          label: note.title,
          category: note.category,
          x: clientWidth / 2 + radius * Math.cos(angle),
          y: clientHeight / 2 + radius * Math.sin(angle),
          note // 保存原始筆記引用
        };
      });

      // 創建連結：基於標籤共振與 linkedLogIds
      const newLinks: Link[] = [];
      notes.forEach(note => {
        // 出向連結
        if (note.linkedLogIds) {
          note.linkedLogIds.forEach(logId => {
            // 尋找關聯到相同 Log 的其他筆記
            notes.forEach(other => {
              if (other.id !== note.id && other.linkedLogIds?.includes(logId)) {
                if (!newLinks.some(l => (l.source === note.id && l.target === other.id) || (l.source === other.id && l.target === note.id))) {
                  newLinks.push({ source: note.id, target: other.id });
                }
              }
            });
          });
        }

        // 標籤連結
        note.tags?.forEach(tag => {
          notes.forEach(other => {
            if (other.id !== note.id && other.tags?.includes(tag)) {
              if (!newLinks.some(l => (l.source === note.id && l.target === other.id) || (l.source === other.id && l.target === note.id))) {
                newLinks.push({ source: note.id, target: other.id });
              }
            }
          });
        });
      });

      setNodes(newNodes as any);
      setLinks(newLinks);
    }
  }, [notes]);

  // 簡單的力導向模擬 (位移迭代)
  useEffect(() => {
    if (nodes.length === 0) return;

    let iteration = 0;
    const maxIterations = 50;
    const interval = setInterval(() => {
      if (iteration >= maxIterations) {
        clearInterval(interval);
        return;
      }

      setNodes(prevNodes => {
        return prevNodes.map(node => {
          let fx = 0;
          let fy = 0;

          // 1. 斥力 (Repulsion) - 讓所有節點互相推開
          prevNodes.forEach(other => {
            if (node.id === other.id) return;
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const distSq = dx * dx + dy * dy || 1;
            const force = 2000 / distSq;
            fx += (dx / Math.sqrt(distSq)) * force;
            fy += (dy / Math.sqrt(distSq)) * force;
          });

          // 2. 引力 (Attraction) - 連結的節點互相吸引
          links.forEach(link => {
            let otherId = '';
            if (link.source === node.id) otherId = link.target;
            else if (link.target === node.id) otherId = link.source;

            if (otherId) {
              const other = prevNodes.find(n => n.id === otherId);
              if (other) {
                const dx = other.x - node.x;
                const dy = other.y - node.y;
                const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                const force = (dist - 100) * 0.05;
                fx += (dx / dist) * force;
                fy += (dy / dist) * force;
              }
            }
          });

          // 3. 中心引力 (Gravity to center)
          const cdx = dimensions.width / 2 - node.x;
          const cdy = dimensions.height / 2 - node.y;
          fx += cdx * 0.01;
          fy += cdy * 0.01;

          // 限制單次移動量
          const limit = 5;
          const moveX = Math.max(-limit, Math.min(limit, fx));
          const moveY = Math.max(-limit, Math.min(limit, fy));

          return {
            ...node,
            x: Math.max(50, Math.min(dimensions.width - 50, node.x + moveX)),
            y: Math.max(50, Math.min(dimensions.height - 50, node.y + moveY))
          };
        });
      });

      iteration++;
    }, 30);

    return () => clearInterval(interval);
  }, [links, dimensions]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[600px] rounded-2xl border overflow-hidden cursor-grab active:cursor-grabbing ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}
    >
      <svg width="100%" height="100%" className="absolute inset-0">
        <AnimatePresence>
          {links.map((link, i) => {
            const source = nodes.find(n => n.id === link.source);
            const target = nodes.find(n => n.id === link.target);
            if (!source || !target) return null;
            return (
              <motion.line
                key={`link-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke={darkMode ? '#4B5563' : '#9CA3AF'}
                strokeWidth="1"
              />
            );
          })}
        </AnimatePresence>
      </svg>

      {nodes.map((node) => {
        const config = CATEGORY_CONFIG[node.category] || CATEGORY_CONFIG['PERSONAL'];
        return (
          <motion.div
            key={node.id}
            layoutId={node.id}
            initial={{ scale: 0 }}
            animate={{ x: node.x - 20, y: node.y - 20, scale: 1 }}
            onClick={() => onNodeClick((node as any).note)}
            className={`absolute w-10 h-10 rounded-full flex items-center justify-center cursor-pointer shadow-lg border-2 z-10 ${config.color} border-white dark:border-gray-800 hover:scale-125 transition-transform`}
            style={{ left: 0, top: 0 }}
            title={node.label}
          >
            <span className="text-lg">{config.icon}</span>
            <div className={`absolute top-full mt-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] whitespace-nowrap bg-black/50 text-white backdrop-blur-sm pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity`}>
              {node.label}
            </div>
          </motion.div>
        );
      })}

      <div className="absolute bottom-4 right-4 flex flex-col items-end space-y-2">
        <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] text-gray-400 border border-white/10 uppercase tracking-widest">
          Resonance Visualization v1.0
        </div>
        <div className="flex items-center space-x-2">
          {Object.entries(CATEGORY_CONFIG).slice(0, 5).map(([key, config]) => (
            <div key={key} className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${config.color}`} />
              <span className="text-[10px] text-gray-500">{config.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Phase 28: AI Resonance Scanner Component ---

function ResonanceScanner({ currentNote, allNotes, darkMode }: { currentNote: OmniNote, allNotes: OmniNote[], darkMode: boolean }) {
  const [scanning, setScanning] = useState(true);
  const [suggestions, setSuggestions] = useState<OmniNote[]>([]);

  useEffect(() => {
    setScanning(true);
    // 模擬 AI 掃描延遲
    const timer = setTimeout(() => {
      const results = allNotes.filter(n => {
        if (n.id === currentNote.id) return false;

        // 1. 標籤重疊
        const tagOverlap = n.tags?.some(t => currentNote.tags?.includes(t));
        // 2. 標題關鍵字匹配 (排除小詞)
        const keywords = currentNote.title.split(/[\s,，、]+/).filter(k => k.length > 1);
        const titleMatch = keywords.some(k => n.title.includes(k));

        return tagOverlap || titleMatch;
      }).slice(0, 3);

      setSuggestions(results);
      setScanning(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentNote, allNotes]);

  return (
    <div className={`mt-6 p-4 rounded-xl border ${darkMode ? 'bg-purple-900/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold text-purple-500 flex items-center">
          <Sparkles className="w-3 h-3 mr-1 animate-pulse" /> AI 共鳴建議
        </h4>
        {scanning && (
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </div>

      <div className="space-y-3">
        {scanning ? (
          <div className="text-[10px] text-gray-400 italic py-2">
            正在分析神經網絡連結...
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-2 rounded-lg border text-[10px] flex items-center justify-between group cursor-pointer ${darkMode ? 'bg-gray-800 border-gray-700 hover:border-purple-500' : 'bg-white border-gray-200 hover:border-purple-500'
                }`}
            >
              <div className="flex items-center space-x-2 truncate">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                <span className="truncate font-medium">{s.title}</span>
              </div>
              <button className="opacity-0 group-hover:opacity-100 p-1 text-purple-500 hover:bg-purple-500/10 rounded">
                <LinkIcon className="w-3 h-3" />
              </button>
            </motion.div>
          ))
        ) : (
          <div className="text-[10px] text-gray-400 italic py-2">
            尚未發現相關共鳴節點
          </div>
        )}
      </div>
    </div>
  );
}
