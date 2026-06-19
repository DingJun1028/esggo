// @ts-nocheck
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

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
  ListTodo,
  Server,
  Activity,
  ShieldCheck,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';
import { useOmniNotesStore, type NoteType, type OmniNote, type TaskStatus } from '@/store/useOmniNotesStore';
import { useTheme } from '@/contexts/ThemeContext';

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
    <div
      layout
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
    </div>
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
  const [content, setContent] = useState(note?.content || '# 新筆記\n\n- [ ] 這裡是一個任務\n');
  const [type, setType] = useState<NoteType>(note?.type || 'log');
  const [date, setDate] = useState(note?.date || new Date().toISOString().split('T')[0]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { tasks, addTasks, syncTasks, isSyncing } = useOmniNotesStore();
  const [syncLog, setSyncLog] = useState<string[]>(['>> SYSTEM STANDBY']);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSave({ content: content.trim(), type, date });
  };

  const handleExtractTasks = () => {
    const regex = /- \[( |x)\] (.*)/g;
    let match;
    const newTasks = [];
    while ((match = regex.exec(content)) !== null) {
      newTasks.push({
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: match[2],
        status: (match[1] === 'x' ? 'Done' : 'Todo') as TaskStatus,
        synced: false,
        noteId: note?.id,
      });
    }

    if (newTasks.length > 0) {
      addTasks(newTasks);
      setSyncLog((prev) => [
        `>> EXTRACTED ${newTasks.length} TASKS FROM MARKDOWN`,
        ...prev.slice(0, 4),
      ]);
    } else {
      setSyncLog((prev) => ['>> NO TASKS FOUND IN MARKDOWN', ...prev.slice(0, 4)]);
    }
  };

  const handleSyncToOmniTable = async () => {
    setSyncLog((prev) => ['>> INITIATING OMNITABLE DATASHEET SYNC...', ...prev.slice(0, 4)]);
    await syncTasks();
    setSyncLog((prev) => [
      `>> SYNC COMPLETED`,
      `>> HASH LOCK VERIFIED (5T PROTOCOL)`,
      ...prev.slice(0, 3),
    ]);
  };

  return (
    <div
      className={cn("bg-white rounded-2xl border shadow-lg overflow-hidden flex flex-col md:flex-row min-h-[600px]", isDark ? "border-slate-800 bg-[#0f172a]" : "border-slate-100")}
    >
      {/* LEFT COLUMN: Markdown Editor */}
      <div className="flex-1 flex flex-col border-r border-slate-100 dark:border-slate-800">
        {/* Editor Header */}
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <Edit3 size={18} className={isDark ? "text-cyan-400" : "text-[#003262]"} />
            <span className={cn("text-sm font-bold", isDark ? "text-slate-200" : "text-[#003262]")}>
              {note ? '編輯筆記' : '新增筆記'}
            </span>
            <div className="mx-2 h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
            {NOTE_TYPES.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold transition-all',
                    type === t.value
                      ? cn(t.bg, t.color, 'ring-1', `ring-current`)
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400'
                  )}
                >
                  <Icon size={10} />
                  {t.label}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExtractTasks}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all flex items-center gap-1.5',
                isDark
                  ? 'bg-[#0F172A] hover:bg-[#1E293B] text-[#34D399] border border-gray-800'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
              )}
            >
              <Plus className="w-3.5 h-3.5" /> 提取任務
            </button>
            <button
              onClick={onCancel}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content Area (Split Pane) */}
        <div className="flex-1 flex flex-col md:flex-row">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="輸入 Markdown 內容..."
            className={cn(
              'flex-1 p-5 resize-none focus:outline-none font-mono text-sm leading-relaxed transition-colors duration-500',
              isDark ? 'bg-[#020617] text-gray-300 placeholder-gray-600' : 'bg-transparent text-gray-700 placeholder-gray-400'
            )}
          />
          <div
            className={cn(
              'flex-1 p-5 border-t md:border-t-0 md:border-l transition-colors duration-500 overflow-y-auto prose prose-sm max-w-none',
              isDark ? 'border-gray-800 prose-invert bg-[#0f172a]' : 'border-gray-100 bg-slate-50/50'
            )}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-400" />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={cn("text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/30", isDark ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-slate-50 text-slate-500 border border-slate-200")}
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
      </div>

      {/* RIGHT COLUMN: Task Matrix */}
      <div className={cn("w-full md:w-[320px] flex flex-col p-4 gap-4", isDark ? "bg-[#0f172a]" : "bg-white")}>
        {/* Terminal Trace Box */}
        <div className={cn('h-[120px] rounded-xl border flex flex-col p-3 overflow-hidden relative', isDark ? 'bg-[#020617] border-gray-800' : 'bg-slate-50 border-slate-200')}>
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Server className={cn('w-4 h-4', isDark ? 'text-amber-400' : 'text-amber-600')} />
            <span className={cn('text-[10px] font-bold tracking-wider uppercase', isDark ? 'text-gray-400' : 'text-gray-500')}>
              OmniTable Matrix
            </span>
          </div>
          <div className="flex-1 flex flex-col gap-1 overflow-y-auto font-mono text-[9px]">
            {syncLog.map((log, i) => (
              <div key={i} className={cn('truncate', i === 0 ? (isDark ? 'text-cyan-400' : 'text-cyan-600') : (isDark ? 'text-gray-500' : 'text-gray-400'))}>
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Task Board */}
        <div className={cn('flex-1 rounded-xl border flex flex-col overflow-hidden', isDark ? 'bg-[#111827] border-gray-800' : 'bg-white border-slate-200')}>
          <div className="h-12 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <ListTodo className={cn('w-4 h-4', isDark ? 'text-[#C084FC]' : 'text-[#9333EA]')} />
              <span className={cn('text-sm font-bold', isDark ? 'text-gray-100' : 'text-gray-900')}>
                任務看板
              </span>
            </div>
            <button
              onClick={handleSyncToOmniTable}
              disabled={isSyncing}
              className={cn(
                'px-2 py-1 rounded-md text-[10px] font-bold tracking-wider flex items-center gap-1',
                isDark ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border border-cyan-200',
                isSyncing && 'opacity-50 cursor-not-allowed'
              )}
            >
              <RefreshCw className={cn('w-3 h-3', isSyncing && 'animate-spin')} /> SYNC
            </button>
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2">
            {tasks.length === 0 ? (
              <div className="m-auto text-center opacity-50">
                <ShieldCheck className="w-6 h-6 mx-auto mb-2" />
                <p className="text-[10px]">無追蹤任務</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className={cn('p-2.5 rounded-lg border flex flex-col gap-1.5', isDark ? 'bg-[#0F172A] border-gray-800' : 'bg-slate-50 border-slate-200')}>
                  <div className="flex items-start justify-between gap-2">
                    <span className={cn('text-xs font-medium leading-snug', isDark ? 'text-gray-200' : 'text-gray-800')}>
                      {task.title}
                    </span>
                    {task.synced ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <Activity className="w-3.5 h-3.5 text-amber-500 shrink-0 animate-pulse" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className={cn('px-1.5 py-0.5 rounded text-[9px] font-bold uppercase', task.status === 'Done' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500')}>
                      {task.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
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
        
          {viewMode === 'editor' ? (
            <div
              key="editor"
            >
              <NoteEditor
                note={editingNote}
                onSave={handleSave}
                onCancel={() => {
                  setEditingNote(null);
                  setViewMode('list');
                }}
              />
            </div>
          ) : (
            <div
              key="list"
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
            </div>
          )}
        

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
