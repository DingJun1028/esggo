'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Leaf, Shield, CheckCircle, Activity, Database, Star,
  Search, Settings, BarChart3, Target, Award, Zap, Globe, Lock,
  FileText, Users, TrendingUp, Plus, Save, Trash2, Heart,
  Download, RefreshCw, Filter, Tag, Layers, Package, X, Edit3,
  Hash, AlertTriangle, Info
} from 'lucide-react';
import {
  getBrandComponents, getBrandTokens, getBrandStats,
  upsertBrandComponent, toggleFavoriteComponent,
  deleteBrandComponent, logComponentUsage,
  type BrandComponent, type BrandToken
} from '../../lib/brand-db';

const CATEGORIES = [
  { id: 'all', label: '全部', color: '#003262' },
  { id: 'atomic', label: '原子 Atomic', color: '#3B7EA1' },
  { id: 'molecular', label: '分子 Molecular', color: '#22c55e' },
  { id: 'organism', label: '有機體 Organism', color: '#FDB515' },
];

const ICON_MAP: Record<string, React.ReactNode> = {
  BrandBadge: <Tag size={14} />,
  BrandButton: <Zap size={14} />,
  BrandCard: <Layers size={14} />,
  BrandInput: <Edit3 size={14} />,
  BrandModal: <Package size={14} />,
  BrandTable: <BarChart3 size={14} />,
  BrandTabs: <Filter size={14} />,
  BrandProgress: <TrendingUp size={14} />,
  BrandKpiCard: <Award size={14} />,
  BrandPageHeader: <Globe size={14} />,
  BrandT5Strip: <Shield size={14} />,
  BrandStatusDot: <Activity size={14} />,
  BrandAlert: <AlertTriangle size={14} />,
  BrandSkeleton: <RefreshCw size={14} />,
  BrandEmptyState: <Database size={14} />,
  BrandAvatar: <Users size={14} />,
  BrandTooltip: <Info size={14} />,
  BrandSearchBar: <Search size={14} />,
  BrandFilterChip: <Filter size={14} />,
  BrandTimeline: <Activity size={14} />,
  BrandStepWizard: <Target size={14} />,
  BrandChartCard: <BarChart3 size={14} />,
  BrandDataCard: <Database size={14} />,
  BrandGRITag: <Hash size={14} />,
  BrandScoreRing: <Award size={14} />,
};

function StatCard({ value, label, color = '#003262' }: { value: number | string; label: string; color?: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
      <div className="text-2xl font-bold" style={{ color }}>{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}

function ComponentCard({
  component,
  onToggleFavorite,
  onDelete,
  onLog,
}: {
  component: BrandComponent;
  onToggleFavorite: (id: string, val: boolean) => void;
  onDelete: (id: string) => void;
  onLog: (component: BrandComponent) => void;
}) {
  const catColor = CATEGORIES.find(c => c.id === component.category)?.color || '#003262';
  const icon = ICON_MAP[component.name] || <Package size={14} />;

  return (
    <div
      className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-[#003262]/20 transition-all duration-200 group cursor-pointer"
      onClick={() => onLog(component)}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${catColor}15`, color: catColor }}
        >
          {icon}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); if (component.id) onToggleFavorite(component.id, !component.is_favorite); }}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${component.is_favorite ? 'text-red-400 bg-red-50' : 'text-slate-300 hover:text-red-400 hover:bg-red-50'}`}
          >
            <Heart size={12} fill={component.is_favorite ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); if (component.id) onDelete(component.id); }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-sm font-semibold text-[#0F172A]">{component.name}</span>
          {component.is_favorite && <Heart size={10} className="text-red-400" fill="currentColor" />}
        </div>
        <span
          className="inline-block text-[10px] px-2 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: `${catColor}15`, color: catColor }}
        >
          {component.category}
        </span>
      </div>

      {component.description && (
        <p className="text-xs text-slate-500 mb-2 line-clamp-2">{component.description}</p>
      )}

      <div className="flex flex-wrap gap-1">
        {(component.tags || []).slice(0, 3).map(tag => (
          <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">
            {tag}
          </span>
        ))}
        {component.version && (
          <span className="text-[10px] px-1.5 py-0.5 bg-[#EBF2FA] text-[#003262] rounded ml-auto">
            v{component.version}
          </span>
        )}
      </div>
    </div>
  );
}

function AddComponentModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (c: BrandComponent) => Promise<void>;
}) {
  const [form, setForm] = useState<Partial<BrandComponent>>({
    name: '',
    category: 'atomic',
    variant: 'default',
    description: '',
    tags: [],
    version: '9.0.0',
  });
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const handleSave = async () => {
    if (!form.name || !form.category) return;
    setSaving(true);
    await onSave(form as BrandComponent);
    setSaving(false);
    onClose();
    setForm({ name: '', category: 'atomic', variant: 'default', description: '', tags: [], version: '9.0.0' });
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setForm(f => ({ ...f, tags: [...(f.tags || []), tagInput.trim()] }));
      setTagInput('');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-[#0F172A]">新增元件至資料庫</h2>
            <p className="text-xs text-slate-500 mt-0.5">儲存至 Supabase 永久保存</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center">
            <X size={15} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">元件名稱 *</label>
            <input
              value={form.name || ''}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. BrandNewComponent"
              className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#003262]/20 focus:border-[#003262]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">類別 *</label>
              <select
                value={form.category || 'atomic'}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#003262]/20"
              >
                <option value="atomic">原子 Atomic</option>
                <option value="molecular">分子 Molecular</option>
                <option value="organism">有機體 Organism</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">版本</label>
              <input
                value={form.version || ''}
                onChange={e => setForm(f => ({ ...f, version: e.target.value }))}
                placeholder="9.0.0"
                className="w-full h-9 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#003262]/20"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">說明</label>
            <textarea
              value={form.description || ''}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="元件功能說明..."
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#003262]/20"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">標籤</label>
            <div className="flex gap-2 mb-2">
              <input
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTag()}
                placeholder="輸入後按 Enter"
                className="flex-1 h-8 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#003262]/20"
              />
              <button onClick={addTag} className="px-3 h-8 bg-[#003262] text-white rounded-lg text-xs hover:bg-[#001F3F]">
                加入
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {(form.tags || []).map((tag, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-xs bg-[#EBF2FA] text-[#003262] px-2 py-0.5 rounded-full">
                  {tag}
                  <button onClick={() => setForm(f => ({ ...f, tags: f.tags?.filter((_, j) => j !== i) }))} className="hover:text-red-500">
                    <X size={9} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-slate-100 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 h-9 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50">
            取消
          </button>
          <button
            onClick={handleSave}
            disabled={!form.name || saving}
            className="px-4 h-9 rounded-lg bg-[#003262] text-white text-sm font-medium hover:bg-[#001F3F] disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? <RefreshCw size={13} className="animate-spin" /> : <Save size={13} />}
            {saving ? '儲存中...' : '儲存至 Supabase'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DesignLibraryPage() {
  const [components, setComponents] = useState<BrandComponent[]>([]);
  const [tokens, setTokens] = useState<BrandToken[]>([]);
  const [stats, setStats] = useState({ total: 0, atomic: 0, molecular: 0, organism: 0, favorites: 0, tokens: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'components' | 'tokens' | 'preview'>('components');
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [syncing, setSyncing] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    const [comps, toks, st] = await Promise.all([
      getBrandComponents(activeCategory === 'all' ? undefined : activeCategory, search || undefined),
      getBrandTokens(),
      getBrandStats(),
    ]);
    setComponents(comps);
    setTokens(toks);
    setStats(st);
    setLoading(false);
  }, [activeCategory, search]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSync = async () => {
    setSyncing(true);
    await loadData();
    setSyncing(false);
    showToast('已從 Supabase 同步最新資料');
  };

  const handleSaveComponent = async (comp: BrandComponent) => {
    const result = await upsertBrandComponent(comp);
    if (result) {
      showToast(`✅ ${comp.name} 已儲存至 Supabase`);
      await loadData();
    } else {
      showToast('儲存失敗，請確認 Supabase 連線', 'error');
    }
  };

  const handleToggleFavorite = async (id: string, val: boolean) => {
    await toggleFavoriteComponent(id, val);
    setComponents(prev => prev.map(c => c.id === id ? { ...c, is_favorite: val } : c));
    showToast(val ? '❤️ 已加入收藏' : '移除收藏');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除此元件紀錄嗎？')) return;
    const ok = await deleteBrandComponent(id);
    if (ok) {
      setComponents(prev => prev.filter(c => c.id !== id));
      showToast('已刪除元件紀錄');
    }
  };

  const handleLog = async (comp: BrandComponent) => {
    await logComponentUsage({
      component_id: comp.id,
      page_path: '/design-library',
      action: 'view',
      metadata: { name: comp.name, category: comp.category },
    });
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ components, tokens }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'brand-atomic-db.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('已匯出 JSON 檔案');
  };

  const filtered = components.filter(c => {
    const matchSearch = !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (c.tags || []).some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = activeCategory === 'all' || c.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${toast.type === 'success' ? 'bg-[#003262] text-white' : 'bg-red-500 text-white'}`}>
          {toast.msg}
        </div>
      )}

      <div className="page-container">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-[#003262] to-[#005DAA] rounded-2xl px-6 py-5 mb-6 text-white">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <Package size={22} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-white">萬能元件品牌原子資料庫</h1>
                  <span className="text-[10px] bg-[#FDB515] text-[#003262] px-2 py-0.5 rounded-full font-bold">v9.0</span>
                  <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full">Supabase 持久化</span>
                </div>
                <p className="text-sm text-blue-200 mt-1">
                  Berkeley Design System · ESG GO 善向永續 · 原子 / 分子 / 有機體 三層架構
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleSync}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm text-white transition-colors"
              >
                <RefreshCw size={13} className={syncing ? 'animate-spin' : ''} />
                同步
              </button>
              <button
                onClick={exportJSON}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm text-white transition-colors"
              >
                <Download size={13} />
                匯出 JSON
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#FDB515] hover:bg-yellow-400 rounded-lg text-sm text-[#003262] font-semibold transition-colors"
              >
                <Plus size={13} />
                新增元件
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
          <StatCard value={stats.total} label="元件總數" />
          <StatCard value={stats.atomic} label="原子層" color="#3B7EA1" />
          <StatCard value={stats.molecular} label="分子層" color="#22c55e" />
          <StatCard value={stats.organism} label="有機體" color="#FDB515" />
          <StatCard value={stats.favorites} label="收藏" color="#ef4444" />
          <StatCard value={stats.tokens} label="設計代幣" color="#8b5cf6" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200 mb-5">
          {[
            { id: 'components', label: '元件庫', icon: <Package size={13} /> },
            { id: 'tokens', label: '設計代幣', icon: <Zap size={13} /> },
            { id: 'preview', label: '預覽展示', icon: <Star size={13} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px ${
                activeTab === tab.id
                  ? 'border-[#003262] text-[#003262]'
                  : 'border-transparent text-slate-500 hover:text-[#003262]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Components Tab */}
        {activeTab === 'components' && (
          <div>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="搜尋元件名稱、說明、標籤..."
                  className="w-full h-9 pl-8 pr-4 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#003262]/20 focus:border-[#003262] bg-white"
                />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeCategory === cat.id
                        ? 'text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-[#003262]/30'
                    }`}
                    style={activeCategory === cat.id ? { backgroundColor: cat.color } : {}}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
                    <div className="w-9 h-9 bg-slate-200 rounded-xl mb-3" />
                    <div className="h-3 bg-slate-200 rounded mb-2 w-3/4" />
                    <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
                <Database size={36} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-medium text-slate-500">沒有符合的元件</p>
                <p className="text-xs text-slate-400 mt-1">嘗試不同的搜尋條件，或新增元件</p>
                <button onClick={() => setShowAddModal(true)} className="mt-4 px-4 py-2 bg-[#003262] text-white rounded-lg text-sm">
                  新增元件
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-400 mb-3">顯示 {filtered.length} / {stats.total} 個元件</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filtered.map((comp, i) => (
                    <ComponentCard
                      key={comp.id || i}
                      component={comp}
                      onToggleFavorite={handleToggleFavorite}
                      onDelete={handleDelete}
                      onLog={handleLog}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Tokens Tab */}
        {activeTab === 'tokens' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tokens.length === 0 && !loading && (
              <div className="col-span-full bg-white rounded-xl border border-slate-200 py-12 text-center">
                <Zap size={32} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm text-slate-500">請先執行 SQL 腳本以載入設計代幣</p>
              </div>
            )}
            {tokens.map((token, i) => (
              <div key={token.id || i} className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3 mb-2">
                  {token.category === 'color' ? (
                    <div className="w-8 h-8 rounded-lg border border-slate-200 flex-shrink-0" style={{ backgroundColor: token.token_value }} />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <Tag size={14} className="text-slate-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#0F172A] truncate">{token.token_key}</p>
                    <span className="text-[10px] text-slate-400">{token.category}</span>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg px-3 py-1.5 font-mono text-xs text-[#003262]">
                  {token.token_value}
                </div>
                {token.description && (
                  <p className="text-xs text-slate-500 mt-1.5">{token.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Preview Tab */}
        {activeTab === 'preview' && (
          <div className="space-y-6">
            {/* Badges Preview */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                <Tag size={14} className="text-[#003262]" /> 標籤 BrandBadge
              </h3>
              <div className="flex flex-wrap gap-2">
                {['default','success','warning','error','info','gold','blue','purple'].map(v => (
                  <span key={v} className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                    v === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
                    v === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    v === 'error'   ? 'bg-red-50 text-red-700 border-red-200' :
                    v === 'info'    ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    v === 'gold'    ? 'bg-yellow-50 text-yellow-800 border-yellow-200' :
                    v === 'blue'    ? 'bg-[#EBF2FA] text-[#003262] border-[#D4E4F7]' :
                    v === 'purple'  ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>{v}</span>
                ))}
              </div>
            </div>

            {/* Buttons Preview */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                <Zap size={14} className="text-[#003262]" /> 按鈕 BrandButton
              </h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: 'Primary', cls: 'bg-[#003262] text-white hover:bg-[#001F3F]' },
                  { label: 'Secondary', cls: 'bg-[#EBF2FA] text-[#003262] border border-[#D4E4F7]' },
                  { label: 'Ghost', cls: 'text-[#003262] hover:bg-[#EBF2FA]' },
                  { label: 'Gold', cls: 'bg-[#FDB515] text-[#003262] font-semibold' },
                  { label: 'Outline', cls: 'border border-[#003262] text-[#003262]' },
                  { label: 'Danger', cls: 'bg-red-500 text-white' },
                ].map(b => (
                  <button key={b.label} className={`px-4 h-9 rounded-lg text-sm font-medium transition-all ${b.cls}`}>
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Preview */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                <TrendingUp size={14} className="text-[#003262]" /> 進度條 BrandProgress
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'GRI 合規率', value: 82, color: '#003262' },
                  { label: '碳減量進度', value: 65, color: '#22c55e' },
                  { label: '報告完成度', value: 40, color: '#FDB515' },
                ].map(p => (
                  <div key={p.label} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-24 flex-shrink-0">{p.label}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${p.value}%`, backgroundColor: p.color }} />
                    </div>
                    <span className="text-xs font-semibold w-8 text-right" style={{ color: p.color }}>{p.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5T Strip Preview */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                <Shield size={14} className="text-[#003262]" /> 5T 協議條帶 BrandT5Strip
              </h3>
              <div className="space-y-2">
                {[
                  { code: 'T1', label: '可溯源 Traceable', color: '#3B7EA1', bg: '#EBF2FA' },
                  { code: 'T2', label: '透明 Transparent', color: '#22c55e', bg: '#f0fdf4' },
                  { code: 'T3', label: '可感知 Tangible', color: '#FDB515', bg: '#fefce8' },
                  { code: 'T4', label: '不可篡改 Trustworthy', color: '#ef4444', bg: '#fff1f2' },
                  { code: 'T5', label: '可追蹤 Trackable', color: '#8b5cf6', bg: '#f5f3ff' },
                ].map(t => (
                  <div key={t.code} className="flex items-center gap-3">
                    <span className="text-[11px] px-2.5 py-1 rounded-full font-bold border" style={{ backgroundColor: t.bg, color: t.color, borderColor: `${t.color}40` }}>
                      {t.code}
                    </span>
                    <span className="text-xs text-slate-600">{t.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* GRI Tags Preview */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-[#0F172A] mb-3 flex items-center gap-2">
                <Hash size={14} className="text-[#003262]" /> GRI 標籤 BrandGRITag
              </h3>
              <div className="flex flex-wrap gap-2">
                {['GRI 2-1', 'GRI 305-1', 'GRI 302-1', 'GRI 303-1', 'GRI 403-2', 'GRI 405-1', 'TCFD', 'SASB', 'ISSB S2', 'ISO 14064'].map(code => (
                  <span key={code} className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-[#EBF2FA] text-[#003262] border border-[#D4E4F7]">
                    {code}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <AddComponentModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleSaveComponent}
      />
    </div>
  );
}