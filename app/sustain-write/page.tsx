// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge, SectionHeader, Input } from '@/components/ui/v2/Input';
import { FiveTStrip } from '@/components/ui/v2/FiveTStrip';
import { Progress } from '@/components/ui/v2/Progress';
import { Tabs } from '@/components/ui/v2/Tabs';
import { OmniHeader } from '@/components/ui/v2/OmniHeader';
import {
  BookOpen,
  Sparkles,
  Layers,
  Cpu,
  Database,
  Eye,
  ShieldCheck,
  AlignLeft,
  RefreshCw,
  CheckCircle2,
  Undo2,
  Redo2,
  Wand2,
  Search,
  Plus,
  StickyNote,
  Trash2,
  ArrowRight,
  Pin,
  Loader2,
  X,
  FileText,
  Zap,
} from 'lucide-react';

const TRAITS_POOL = [
  '製造業',
  '服務業',
  '科技業',
  '金控業',
  '綜合企業',
  '能源密集',
  '淨零承諾',
  '注重人才',
  '初次編製',
];

const TEMPLATES = [
  {
    id: 't1',
    name: '氣候風險 TCFD 揭露模板',
    category: 'Environment',
    usage: 1240,
    difficulty: 'High',
  },
  {
    id: 't2',
    name: '重大性議題分析矩陣工具',
    category: 'Governance',
    usage: 3500,
    difficulty: 'Medium',
  },
  {
    id: 't3',
    name: '人權盡職調查 (HRDD) 清單',
    category: 'Social',
    usage: 890,
    difficulty: 'High',
  },
  {
    id: 't4',
    name: 'CBAM 碳邊境申報專用表',
    category: 'Environment',
    usage: 2100,
    difficulty: 'Medium',
  },
];

export default function SustainWritePage() {
  const [isWeaving, setIsWeaving] = useState(false);
  const [weavingProgress, setWeavingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'editor' | 'preview'>('blueprint');
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<(typeof TEMPLATES)[0] | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedHash, setPublishedHash] = useState<string | null>(null);
  const [content, setContent] = useState('');

  const toggleTrait = (trait: string) => {
    if (selectedTraits.includes(trait))
      setSelectedTraits((prev) => prev.filter((t) => t !== trait));
    else if (selectedTraits.length < 3) setSelectedTraits((prev) => [...prev, trait]);
  };

  const handleAiAnalysis = () => {
    if (selectedTraits.length === 0) return;
    setIsAiAnalyzing(true);
    setTimeout(() => {
      setActiveTemplate(TEMPLATES[0]);
      setIsAiAnalyzing(false);
    }, 1500);
  };

  const handleWeave = async () => {
    if (!activeTemplate) return;
    setIsWeaving(true);
    setWeavingProgress(0);
    setActiveTab('editor');
    // Simulate weaving
    for (let i = 0; i <= 100; i += 20) {
      await new Promise((r) => setTimeout(r, 300));
      setWeavingProgress(i);
    }
    setContent(
      `<h2>${activeTemplate.name}</h2><p>AI 正在根據您的產業特徵「${selectedTraits.join(
        '、'
      )}」生成專屬永續報告內容...</p>`
    );
    setIsWeaving(false);
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setPublishedHash('0x' + Math.random().toString(16).substring(2, 10) + '...sealed');
    setIsPublishing(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-neutral-200 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center border border-cyan-200">
              <BookOpen className="text-cyan-600" size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-neutral-500 flex items-center gap-1">
                  <Sparkles size={11} className="text-cyan-500" /> Cognitive Programming
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-cyan-100 text-cyan-800 rounded font-mono">
                  SW-850
                </span>
              </div>
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                SustainWrite 永續編織
              </h1>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Holographic Report Generation Engine
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={<ShieldCheck size={14} />}>
              實境審計
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Sparkles size={14} />}
              onClick={handleWeave}
              loading={isWeaving}
            >
              {isWeaving ? `編織中 ${weavingProgress}%` : '開始編織'}
            </Button>
          </div>
        </header>

        <Tabs
          tabs={[
            { id: 'blueprint', label: '報告藍圖', icon: <Layers size={14} /> },
            { id: 'editor', label: '編輯器', icon: <AlignLeft size={14} /> },
            { id: 'preview', label: '預覽', icon: <Eye size={14} /> },
          ]}
          activeTab={activeTab}
          onTabChange={(t) => setActiveTab(t as any)}
          variant="pill"
        />

        {activeTab === 'blueprint' && (
          <div className="space-y-6">
            <Card variant="default" padding="md">
              <SectionHeader
                title="產業特徵選擇"
                subtitle="選擇最多 3 個特徵，AI 將為您推薦最適合的報告模板"
              />
              <div className="flex flex-wrap gap-2 mt-4">
                {TRAITS_POOL.map((trait) => (
                  <button
                    key={trait}
                    onClick={() => toggleTrait(trait)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedTraits.includes(trait)
                        ? 'bg-cyan-600 text-white'
                        : 'bg-white text-neutral-600 border border-neutral-200 hover:border-cyan-300'
                    }`}
                  >
                    {trait}
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <Button
                  variant="primary"
                  onClick={handleAiAnalysis}
                  loading={isAiAnalyzing}
                  disabled={selectedTraits.length === 0}
                  icon={<Sparkles size={14} />}
                >
                  {isAiAnalyzing ? 'AI 分析中...' : 'AI 推薦模板'}
                </Button>
              </div>
            </Card>

            {activeTemplate && (
              <Card variant="default" padding="md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <FileText size={18} className="text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900">{activeTemplate.name}</h3>
                    <p className="text-xs text-neutral-400">
                      {activeTemplate.category} · {activeTemplate.difficulty} ·{' '}
                      {activeTemplate.usage} 次使用
                    </p>
                  </div>
                  <Badge variant="success" size="sm">
                    已選擇
                  </Badge>
                </div>
                <Progress value={weavingProgress} size="sm" color="auto" />
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TEMPLATES.map((t) => (
                <Card
                  key={t.id}
                  variant="outlined"
                  padding="md"
                  hover
                  onClick={() => setActiveTemplate(t)}
                  className={activeTemplate?.id === t.id ? 'border-cyan-400 bg-cyan-50/30' : ''}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-neutral-50 flex items-center justify-center">
                      <FileText size={20} className="text-neutral-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-neutral-900">{t.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-neutral-400">{t.category}</span>
                        <span className="text-[10px] text-neutral-300">·</span>
                        <span className="text-[10px] text-neutral-400">{t.difficulty}</span>
                        <span className="text-[10px] text-neutral-300">·</span>
                        <span className="text-[10px] text-neutral-400">{t.usage} 次</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'editor' && (
          <div className="space-y-4">
            <Card variant="default" padding="md">
              <div className="flex items-center justify-between mb-4">
                <SectionHeader
                  title="報告編輯器"
                  subtitle={activeTemplate ? activeTemplate.name : '請先選擇模板'}
                />
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" icon={<Undo2 size={14} />}>
                    復原
                  </Button>
                  <Button variant="ghost" size="sm" icon={<Redo2 size={14} />}>
                    重做
                  </Button>
                  <Button variant="secondary" size="sm" icon={<Wand2 size={14} />}>
                    AI 潤飾
                  </Button>
                </div>
              </div>
              <div className="border border-neutral-200 rounded-lg min-h-[400px] p-4 bg-white">
                {content ? (
                  <div
                    className="prose prose-sm max-w-none text-neutral-700"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-neutral-400">
                    <BookOpen size={32} className="mb-2 opacity-50" />
                    <p className="text-sm">選擇模板並點擊「開始編織」以生成報告內容</p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
                <FiveTStrip
                  status={[true, true, true, activeTemplate !== null, false]}
                  showLabels={false}
                />
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" icon={<AlignLeft size={14} />}>
                    儲存草稿
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<ShieldCheck size={14} />}
                    onClick={handlePublish}
                    loading={isPublishing}
                  >
                    {isPublishing ? '發布中...' : '發布封印'}
                  </Button>
                </div>
              </div>
              {publishedHash && (
                <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span className="text-xs font-mono text-emerald-700">
                    已發布並封印：{publishedHash}
                  </span>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'preview' && (
          <Card variant="default" padding="md">
            <SectionHeader title="報告預覽" />
            <div className="mt-4 p-6 bg-white border border-neutral-200 rounded-lg min-h-[400px]">
              {content ? (
                <div
                  className="prose prose-sm max-w-none text-neutral-700"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-neutral-400">
                  <Eye size={32} className="mb-2 opacity-50" />
                  <p className="text-sm">尚無內容可預覽</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
