// @ts-nocheck
/**
 * 平台版本全視圖（Platform Version Overview）
 * 
 * 展示 ESGGO 平台的所有版本資訊：
 * 1. 前端版本
 * 2. 後端版本
 * 3. API 版本
 * 4. 資料庫遷移版本
 * 5. 依賴套件版本
 * 6. 子代理版本
 * 7. 萬能元鑰版本
 * 8. 5T 協議版本
 */

import React, { useState, useEffect } from 'react';
import {
  Package, Server, Database, Cpu, Key, Shield,
  RefreshCw, CheckCircle2, AlertCircle, Info,
  GitBranch, Clock, Tag, Layers
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';
import { SectionHeader } from '@/components/ui/v2/Input';

interface VersionInfo {
  name: string;
  version: string;
  status: 'current' | 'outdated' | 'beta' | 'deprecated';
  lastUpdated: string;
  description: string;
  icon: React.ElementType;
  details?: Record<string, string>;
}

export default function PlatformVersionPage() {
  const [versions, setVersions] = useState<VersionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/platform/versions');
      if (res.ok) {
        const data = await res.json();
        setVersions(data.versions || getDefaultVersions());
      } else {
        setVersions(getDefaultVersions());
      }
    } catch {
      setVersions(getDefaultVersions());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultVersions = (): VersionInfo[] => [
    {
      name: 'ESGGO 前端',
      version: '8.5.2-Alpha',
      status: 'current',
      lastUpdated: '2026-06-20',
      description: 'Next.js 16 + React 18 + Tailwind CSS',
      icon: Package,
      details: {
        'Next.js': '16.2.9',
        'React': '18.3.31',
        'Tailwind CSS': '4.1.1',
        'TypeScript': '5.9.3',
        'UI 元件庫': 'v2.0 (Minimal Clean)',
      },
    },
    {
      name: 'ESGGO 後端',
      version: '3.2.0',
      status: 'current',
      lastUpdated: '2026-06-20',
      description: 'Node.js 22 + Next.js API Routes',
      icon: Server,
      details: {
        'Node.js': '22.x',
        'Next.js API': '16.2.9',
        'AI SDK': '6.0.207',
        'Supabase Client': '2.x',
      },
    },
    {
      name: 'OmniAgent',
      version: '2.0.0',
      status: 'current',
      lastUpdated: '2026-06-20',
      description: 'AI 代理控制台 · 多重步驟思考',
      icon: Cpu,
      details: {
        '聊天引擎': 'OpenRouter (Mistral Small)',
        '語音辨識': 'Whisper Large V3',
        '圖片生成': 'Stable Diffusion 3.5',
        'RAG 引擎': 'Supabase + pgvector',
        '子代理數': '7',
      },
    },
    {
      name: '萬能元鑰',
      version: '2.0.0',
      status: 'beta',
      lastUpdated: '2026-06-20',
      description: '統一身份驗證 · 一切未知的解答',
      icon: Key,
      details: {
        '等級數': '4 (探索者/創造者/領導者/無限)',
        '能力數': '6 (身份/存取/知識/執行/預測/互操作)',
        'ZKP 版本': 'v1.0 (簡化版)',
        '跨鏈支援': 'ESGGO Mainnet',
      },
    },
    {
      name: '5T 協議',
      version: '1.0.0',
      status: 'current',
      lastUpdated: '2026-06-18',
      description: '真善美信通 · 誠信驗證協議',
      icon: Shield,
      details: {
        'Truth (真)': '可感知/具體化',
        'Goodness (善)': '可溯源/透明',
        'Beauty (美)': '可追蹤/可感知',
        'Trust (信)': '不可篡改/信賴',
        'Transferful (通)': '可透明驗算',
      },
    },
    {
      name: '資料庫遷移',
      version: 'Migration #35',
      status: 'current',
      lastUpdated: '2026-06-20',
      description: 'Supabase PostgreSQL',
      icon: Database,
      details: {
        '遷移數量': '35',
        '最新遷移': '20260620000100_seed_reading_room',
        'RLS 政策': '已啟用',
        '表格數': '28',
      },
    },
    {
      name: '萬能日誌',
      version: '1.0.0',
      status: 'current',
      lastUpdated: '2026-06-20',
      description: '統一日誌系統 · 取代 console.log',
      icon: Layers,
      details: {
        '日誌級別': 'debug/info/warn/error',
        '模組標籤': '已啟用',
        '時間戳': '已啟用',
        'Emoji': '已啟用',
      },
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'success';
      case 'outdated': return 'warning';
      case 'beta': return 'info';
      case 'deprecated': return 'error';
      default: return 'neutral';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'current': return '最新';
      case 'outdated': return '過時';
      case 'beta': return '測試版';
      case 'deprecated': return '已棄用';
      default: return '未知';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* ─── Header ─── */}
        <Card variant="default" padding="md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center">
                <Tag size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-neutral-900">平台版本全視圖</h1>
                <p className="text-sm text-neutral-500">所有已安裝的版本資訊</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={fetchVersions} disabled={loading}>
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              重新載入
            </Button>
          </div>
        </Card>

        {/* ─── Summary ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: '總模組', value: versions.length, icon: Package },
            { label: '最新版本', value: versions.filter(v => v.status === 'current').length, icon: CheckCircle2 },
            { label: '測試版', value: versions.filter(v => v.status === 'beta').length, icon: Info },
            { label: '過時', value: versions.filter(v => v.status === 'outdated').length, icon: AlertCircle },
          ].map(stat => (
            <Card key={stat.label} variant="default" padding="sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center">
                  <stat.icon size={18} className="text-neutral-600" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">{stat.label}</p>
                  <p className="text-lg font-bold text-neutral-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* ─── Version List ─── */}
        <SectionHeader title="版本列表" subtitle={`${versions.length} 個模組`} />

        {loading ? (
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-center gap-3 py-8">
              <RefreshCw size={20} className="animate-spin text-neutral-400" />
              <span className="text-sm text-neutral-500">載入中...</span>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {versions.map(version => {
              const Icon = version.icon;
              const isExpanded = expandedItem === version.name;

              return (
                <Card key={version.name} variant="default" padding="md" hover>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center shrink-0">
                        <Icon size={18} className="text-neutral-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-bold text-neutral-900">{version.name}</h3>
                          <Badge variant={getStatusColor(version.status)} size="sm">
                            {getStatusLabel(version.status)}
                          </Badge>
                        </div>
                        <p className="text-xs text-neutral-500 mb-2">{version.description}</p>
                        <div className="flex items-center gap-3 text-[10px] text-neutral-400">
                          <span className="flex items-center gap-1">
                            <GitBranch size={8} />
                            v{version.version}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={8} />
                            {version.lastUpdated}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedItem(isExpanded ? null : version.name)}
                      className="text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
                    >
                      {isExpanded ? '收起' : '詳情'}
                    </button>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && version.details && (
                    <div className="mt-4 pt-4 border-t border-neutral-100">
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                        {Object.entries(version.details).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-50">
                            <span className="text-[10px] text-neutral-500">{key}</span>
                            <span className="text-[10px] font-mono font-medium text-neutral-700">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* ─── Footer ─── */}
        <Card variant="outlined" padding="md">
          <div className="text-center space-y-2 py-2">
            <p className="text-sm font-medium text-neutral-700">
              ESGGO 平台版本全視圖 v1.0
            </p>
            <p className="text-[10px] text-neutral-400">
              最後更新: {new Date().toLocaleString('zh-TW')} · 共 {versions.length} 個模組
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
