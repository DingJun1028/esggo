'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LucideIcon,
  StickyNote,
  Plus,
  Search,
  Trash2,
  Edit3,
  Save,
  X,
  Tag,
  Calendar,
  Clock,
  Filter,
  BookOpen,
  Lightbulb,
  Users,
  CheckSquare,
  Brain,
  FileText,
  Loader2,
  RefreshCw,
  ArrowRight,
  Pin,
  PinOff,
  Copy,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';
import { useOmniNotesStore, type NoteType, type OmniNote } from '@/store/useOmniNotesStore';

/* ─── Types ─── */
interface NoteFormData {
  content: string;
  type: NoteType;
  date: string;
}

type ViewMode = 'list' | 'editor' | 'search';
type FilterType = 'all' | NoteType;

/* ─── Constants ─── */
const NOTE_TYPES: {
  value: NoteType;
  label: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}[] = [
  { value: 'log', label: '日誌', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
  { value: 'idea', label: '靈感', icon: Lightbulb, color: 'text-amber-600', bg: 'bg-amber-50' },
  { value: 'meeting', label: '會議', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  {
    value: 'task',
    label: '任務',
    icon: CheckSquare,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  { value: 'research', label: '研究', icon: Brain, color: 'text-violet-600', bg: 'bg-violet-50' },
  { value: 'knowledge', label: '知識', icon: FileText, color: 'text-cyan-600', bg: 'bg-cyan-50' },
];

const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'all', label: '全部' },
  ...NOTE_TYPES.map((t) => ({ value: t.value, label: t.label })),
];

/* ─── Helpers ─── */
function getTypeInfo(type: NoteType) {
  return NOTE_TYPES.find((t) => t.value === type) || NOTE_TYPES[0];
}

function formatDate(timestamp: number): string {
  try {
    return new Date(timestamp).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return '';
  }
}

function formatTime(timestamp: number): string {
  try {
    return new Date(timestamp).toLocaleTimeString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return '';
  }
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return '剛剛';
  if (minutes < 60) return `${minutes} 分鐘前`;
  if (hours < 24) return `${hours} 小時前`;
  if (days < 7) return `${days} 天前`;
  return formatDate(timestamp);
}

/* ─── Components ─── */

function NoteTypeIcon({ type, size = 16 }: { type: NoteType; size?: number }) {
  const info = getTypeInfo(type);
  const Icon = info.icon as LucideIcon;
  return (
    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', info.bg)}>
      <Icon size={size} className={info.color} />
    </div>
  );
}

function NoteCard({
  note,
  onDelete,
  onEdit,
  onPin,
  isPinned,
}: {
  note: OmniNote;
  onDelete: (id: string) => void;
  onEdit: (note: OmniNote) => void;
  onPin: (id: string) => void;
  isPinned: boolean;
}) {
  const info = getTypeInfo(note.type);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(note.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'bg-white rounded-xl border p-4 hover:shadow-md transition-all duration-200 group',
        isPinned ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100'
      )}
    >
      <div className="flex items-start gap-3">
        <NoteTypeIcon type={note.type} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <OmniBadge variant="secondary" size="xs">
              {info.label}
            </OmniBadge>
            <span className="text-[10px] text-slate-400">{formatRelativeTime(note.createdAt)}</span>
            {note.source !== 'local' && (
              <OmniBadge variant="outline" size="xs">
                {note.source}
              </OmniBadge>
            )}
          </div>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap line-clamp-3">
            {note.content}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onPin(note.id)}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            isPinned
              ? 'text-amber-500 bg-amber-50'
              : 'text-slate-400 hover:text-amber-500 hover:bg-amber-50'
          )}
        >
          {isPinned ? <PinOff size={14} /> : <Pin size={14} />}
        </button>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
        >
          {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
        </button>
        <button
          onClick={() => onEdit(note)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <Edit3 size={14} />
        </button>
        <button
          onClick={() => onDelete(note.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </motion.div>
  );
}

function NoteEditor({
  note,
  onSave,
  onCancel,
}: {
  note?: OmniNote | null;
  onSave: (data: NoteFormData) => void;
  onCancel: () => void;
}) {
  const [content, setContent] = useState(note?.content || '');
  const [type, setType] = useState<NoteType>(note?.type || 'log');
  const [date, setDate] = useState(note?.date || new Date().toISOString().split('T')[0]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSave({ content: content.trim(), type, date });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-lg overflow-hidden"
    >
      {/* Editor Header */}
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Edit3 size={18} className="text-[#003262]" />
          <span className="text-sm font-bold text-[#003262]">{note ? '編輯筆記' : '新增筆記'}</span>
        </div>
        <button
          onClick={onCancel}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Type Selector */}
      <div className="px-5 py-3 border-b border-slate-50">
        <div className="flex flex-wrap gap-2">
          {NOTE_TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.value}
                onClick={() => setType(t.value)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                  type === t.value
                    ? cn(t.bg, t.color, 'ring-1', `ring-current`)
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                )}
              >
                <Icon size={12} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="輸入筆記內容..."
          rows={8}
          className="w-full resize-none text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none leading-relaxed"
        />
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-slate-400" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <OmniButton variant="ghost" size="sm" onClick={onCancel}>
            取消
          </OmniButton>
          <OmniButton
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={!content.trim()}
            icon={<Save size={14} />}
          >
            {note ? '更新' : '儲存'}
          </OmniButton>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function OmniNotesPage() {
  const { notes, isSyncing, addNote, deleteNote } = useOmniNotesStore();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState<OmniNote | null>(null);
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());

  // Filter & search
  const filteredNotes = React.useMemo(() => {
    let result = [...notes];

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter((n) => n.type === filterType);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.content.toLowerCase().includes(q) ||
          n.type.toLowerCase().includes(q) ||
          n.source.toLowerCase().includes(q)
      );
    }

    // Sort: pinned first, then by createdAt desc
    result.sort((a, b) => {
      const aPinned = pinnedIds.has(a.id) ? 1 : 0;
      const bPinned = pinnedIds.has(b.id) ? 1 : 0;
      if (aPinned !== bPinned) return bPinned - aPinned;
      return b.createdAt - a.createdAt;
    });

    return result;
  }, [notes, filterType, searchQuery, pinnedIds]);

  // Stats
  const stats = React.useMemo(
    () => ({
      total: notes.length,
      today: notes.filter((n) => {
        const today = new Date().toISOString().split('T')[0];
        return n.date === today;
      }).length,
      tasks: notes.filter((n) => n.type === 'task').length,
      pinned: pinnedIds.size,
    }),
    [notes, pinnedIds]
  );

  const handleSave = useCallback(
    (data: NoteFormData) => {
      if (editingNote) {
        // Update: delete old + add new (store doesn't have update)
        deleteNote(editingNote.id);
        addNote(data.content, data.type, data.date);
      } else {
        addNote(data.content, data.type, data.date);
      }
      setEditingNote(null);
      setViewMode('list');
    },
    [editingNote, addNote, deleteNote]
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteNote(id);
      setPinnedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [deleteNote]
  );

  const handlePin = useCallback((id: string) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleEdit = useCallback((note: OmniNote) => {
    setEditingNote(note);
    setViewMode('editor');
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
              <StickyNote size={24} className="text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-[#003262] tracking-tight">
                萬能筆記
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-0.5">OMNI NOTES · 完整集成</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isSyncing && (
              <div className="flex items-center gap-1.5 text-xs text-cyan-600">
                <Loader2 size={12} className="animate-spin" />
                同步中...
              </div>
            )}
            <OmniButton
              variant="primary"
              size="md"
              icon={<Plus size={14} />}
              onClick={() => {
                setEditingNote(null);
                setViewMode('editor');
              }}
              className="bg-[#003262] hover:bg-[#002244] text-white"
            >
              新增筆記
            </OmniButton>
          </div>
        </header>

        {/* ─── Stats ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <OmniBaseCard className="p-4 flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-black text-[#003262]">{stats.total}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                總筆記
              </p>
            </div>
          </OmniBaseCard>
          <OmniBaseCard className="p-4 flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <Calendar size={16} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xl font-black text-[#003262]">{stats.today}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">今日</p>
            </div>
          </OmniBaseCard>
          <OmniBaseCard className="p-4 flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg">
              <CheckSquare size={16} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xl font-black text-[#003262]">{stats.tasks}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">任務</p>
            </div>
          </OmniBaseCard>
          <OmniBaseCard className="p-4 flex items-center gap-3">
            <div className="p-2 bg-rose-50 rounded-lg">
              <Pin size={16} className="text-rose-600" />
            </div>
            <div>
              <p className="text-xl font-black text-[#003262]">{stats.pinned}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">置頂</p>
            </div>
          </OmniBaseCard>
        </div>

        {/* ─── Search & Filter ─── */}
        <OmniBaseCard padding="md">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋筆記內容..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-300 transition-all"
              />
            </div>
            {/* Filter chips - desktop */}
            <div className="hidden md:flex items-center gap-1.5 flex-wrap">
              {FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilterType(opt.value)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-bold rounded-lg transition-all',
                    filterType === opt.value
                      ? 'bg-[#003262] text-white'
                      : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {/* Filter dropdown - mobile */}
            <div className="md:hidden">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FilterType)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              >
                {FILTER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </OmniBaseCard>

        {/* ─── Content Area ─── */}
        <AnimatePresence mode="wait">
          {viewMode === 'editor' ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <NoteEditor
                note={editingNote}
                onSave={handleSave}
                onCancel={() => {
                  setEditingNote(null);
                  setViewMode('list');
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredNotes.length === 0 ? (
                <div className="py-16 text-center">
                  <StickyNote size={48} className="mx-auto mb-4 text-slate-200" />
                  <p className="text-sm text-slate-400 mb-2">
                    {searchQuery || filterType !== 'all' ? '找不到符合條件的筆記' : '還沒有筆記'}
                  </p>
                  <p className="text-xs text-slate-300">
                    {searchQuery || filterType !== 'all'
                      ? '試試其他搜尋條件'
                      : '點擊「新增筆記」開始記錄'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onDelete={handleDelete}
                      onEdit={handleEdit}
                      onPin={handlePin}
                      isPinned={pinnedIds.has(note.id)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Integration Info ─── */}
        <OmniBaseCard className="border-cyan-100 bg-cyan-50/30">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-100 rounded-lg">
                <RefreshCw size={16} className="text-cyan-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#003262]">完整集成</p>
                <p className="text-xs text-slate-500">
                  筆記自動同步至 OmniTable · 任務類型自動觸發 5T 驗證
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>localStorage 持久化</span>
              <ArrowRight size={12} />
              <span>Zustand Store</span>
              <ArrowRight size={12} />
              <span>OmniTable Sync</span>
            </div>
          </div>
        </OmniBaseCard>
      </div>
    </div>
  );
}
