// @ts-nocheck
'use client';

import React, { useState, useEffect } from 'react';
import {
  Key,
  Shield,
  Zap,
  Brain,
  Globe,
  Lock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Sparkles,
  Crown,
  Search,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';
import { SectionHeader } from '@/components/ui/v2/Input';

/* ─── Types ─── */
interface OmniKeyData {
  id: string;
  owner: string;
  level: 'basic' | 'pro' | 'enterprise' | 'omniverse';
  permissions: string[];
  fiveTStatus: [boolean, boolean, boolean, boolean, boolean];
  capabilities: { id: string; name: string; icon: string; enabled: boolean; category: string }[];
  createdAt: string;
  expiresAt: string;
  metadata: { issuer: string; chain: string; zkpProof: string; version: string };
}

const LEVEL_CONFIG = {
  basic: {
    name: '探索者',
    icon: '🔍',
    color: 'neutral',
    gradient: 'from-neutral-500 to-neutral-600',
  },
  pro: { name: '創造者', icon: '⚡', color: 'info', gradient: 'from-blue-500 to-cyan-500' },
  enterprise: {
    name: '領導者',
    icon: '👑',
    color: 'warning',
    gradient: 'from-amber-500 to-orange-500',
  },
  omniverse: {
    name: '無限',
    icon: '🌌',
    color: 'success',
    gradient: 'from-violet-500 to-purple-500',
  },
};

const CAPABILITY_ICONS: Record<string, React.ElementType> = {
  identity: Key,
  access: Globe,
  knowledge: Brain,
  execution: Zap,
  prediction: Sparkles,
  interoperability: Lock,
};

export default function OmniKeyPage() {
  const [keys, setKeys] = useState<OmniKeyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<'basic' | 'pro' | 'enterprise' | 'omniverse'>(
    'basic'
  );
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/omni-key/list?owner=current_user');
      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys || []);
      }
    } catch {
      /* ignore */
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    try {
      const res = await fetch('/api/omni-key/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner: 'current_user', level: selectedLevel }),
      });
      if (res.ok) {
        const data = await res.json();
        setKeys((prev) => [data.omniKey, ...prev]);
        setShowCreate(false);
      }
    } catch {
      /* ignore */
    }
  };

  const handleRevoke = async (keyId: string) => {
    try {
      await fetch('/api/omni-key/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyId }),
      });
      setKeys((prev) => prev.filter((k) => k.id !== keyId));
    } catch {
      /* ignore */
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
                <Key size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-neutral-900">萬能元鑰</h1>
                <p className="text-sm text-neutral-500">一切未知的解答 · 能開啟一切可能</p>
              </div>
            </div>
            <Button variant="primary" size="sm" onClick={() => setShowCreate(!showCreate)}>
              <Plus size={14} />
              建立元鑰
            </Button>
          </div>
        </Card>

        {/* ─── Create Form ─── */}
        {showCreate && (
          <Card variant="default" padding="md">
            <SectionHeader title="建立新的萬能元鑰" subtitle="選擇你的等級，開啟對應的可能" />
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(LEVEL_CONFIG).map(([level, config]) => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level as any)}
                  className={cn(
                    'p-4 rounded-xl border-2 transition-all text-left',
                    selectedLevel === level
                      ? 'border-neutral-900 bg-neutral-50'
                      : 'border-neutral-100 hover:border-neutral-200'
                  )}
                >
                  <div className="text-2xl mb-2">{config.icon}</div>
                  <p className="text-sm font-bold text-neutral-900">{config.name}</p>
                  <p className="text-[10px] text-neutral-500 mt-1">
                    {level === 'basic' && '基礎功能存取'}
                    {level === 'pro' && '進階 + AI 代理'}
                    {level === 'enterprise' && '完整 + 多租戶'}
                    {level === 'omniverse' && '無限制 + 跨鏈'}
                  </p>
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>
                取消
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreate}>
                <Key size={14} />
                建立元鑰
              </Button>
            </div>
          </Card>
        )}

        {/* ─── Keys List ─── */}
        <SectionHeader title="我的元鑰" subtitle={`${keys.length} 個元鑰`} />

        {loading ? (
          <Card variant="default" padding="lg">
            <div className="flex items-center justify-center gap-3 py-8">
              <RefreshCw size={20} className="animate-spin text-neutral-400" />
              <span className="text-sm text-neutral-500">載入中...</span>
            </div>
          </Card>
        ) : keys.length === 0 ? (
          <Card variant="default" padding="lg">
            <div className="text-center space-y-4 py-8">
              <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto">
                <Key size={28} className="text-neutral-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500">尚無萬能元鑰</p>
                <p className="text-xs text-neutral-400 mt-1">建立你的第一個元鑰，開啟無限可能</p>
              </div>
              <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>
                <Plus size={14} />
                建立元鑰
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {keys.map((key) => {
              const levelConfig = LEVEL_CONFIG[key.level];
              const isExpanded = expandedKey === key.id;
              const isActive = new Date(key.expiresAt) > new Date();

              return (
                <Card key={key.id} variant="default" padding="md" hover>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center text-lg bg-gradient-to-br',
                          levelConfig.gradient
                        )}
                      >
                        {levelConfig.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-neutral-900">{levelConfig.name}</h3>
                        <p className="text-[10px] text-neutral-400 font-mono">
                          {key.id.substring(0, 16)}...
                        </p>
                      </div>
                    </div>
                    <Badge variant={isActive ? 'success' : 'error'} size="sm">
                      {isActive ? '有效' : '已過期'}
                    </Badge>
                  </div>

                  {/* 5T Status */}
                  <div className="flex items-center gap-2 mb-3">
                    {['真', '善', '美', '信', '通'].map((t, i) => (
                      <div
                        key={t}
                        className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold',
                          key.fiveTStatus[i]
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-neutral-100 text-neutral-400'
                        )}
                      >
                        {t}
                      </div>
                    ))}
                  </div>

                  {/* Capabilities */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {key.capabilities?.slice(0, 4).map((cap) => {
                      const Icon = CAPABILITY_ICONS[cap.category] || Key;
                      return (
                        <div
                          key={cap.id}
                          className={cn(
                            'flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px]',
                            cap.enabled
                              ? 'bg-neutral-100 text-neutral-600'
                              : 'bg-neutral-50 text-neutral-400'
                          )}
                        >
                          <Icon size={8} />
                          {cap.name}
                        </div>
                      );
                    })}
                  </div>

                  {/* Expiry */}
                  <p className="text-[10px] text-neutral-400 mb-3">
                    到期: {new Date(key.expiresAt).toLocaleDateString('zh-TW')}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedKey(isExpanded ? null : key.id)}
                      className="flex-1"
                    >
                      {isExpanded ? (
                        <>
                          <EyeOff size={12} />
                          收起
                        </>
                      ) : (
                        <>
                          <Eye size={12} />
                          詳情
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevoke(key.id)}
                      disabled={!isActive}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-neutral-100 space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <span className="text-neutral-400">發行者</span>
                          <p className="text-neutral-700 font-mono">
                            {key.metadata?.issuer || '—'}
                          </p>
                        </div>
                        <div>
                          <span className="text-neutral-400">鏈</span>
                          <p className="text-neutral-700 font-mono">{key.metadata?.chain || '—'}</p>
                        </div>
                        <div>
                          <span className="text-neutral-400">權限</span>
                          <p className="text-neutral-700">{key.permissions?.join(', ') || '—'}</p>
                        </div>
                        <div>
                          <span className="text-neutral-400">版本</span>
                          <p className="text-neutral-700">{key.metadata?.version || '—'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* ─── Philosophy ─── */}
        <Card variant="outlined" padding="md">
          <div className="text-center space-y-3 py-4">
            <p className="text-lg font-bold text-neutral-900">「一切未知的解答，能開啟一切可能」</p>
            <p className="text-sm text-neutral-500 max-w-lg mx-auto">
              萬能元鑰不僅是身份驗證機制，更是通往所有知識、所有功能、所有可能性的鑰匙。 遵循 5T
              協議（真、善、美、信、通），確保每一次開啟都是正向的。
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              {['🔑 身份', '🌐 存取', '🧠 知識', '⚡ 執行', '🔮 預測', '🌍 互操作'].map((item) => (
                <span key={item} className="text-xs text-neutral-400">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
