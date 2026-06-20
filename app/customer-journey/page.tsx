// @ts-nocheck
'use client';

/**
 * 顧客旅程中心（Customer Journey Center）
 * 
 * 按照顧客使用流程排列所有頁面：
 * 
 * 1. 探索與認識（Awareness）
 *    - 首頁、關於、平台版本
 * 
 * 2. 評估與入門（Evaluation）
 *    - 演示、教學、指南、學院
 * 
 * 3. 開始使用（Onboarding）
 *    - 登入、註冊、API 設定
 * 
 * 4. 核心功能（Core Experience）
 *    - 儀表板、數據分析、報告
 * 
 * 5. 進階功能（Advanced）
 *    - 子代理、AI 平台、數位分身
 * 
 * 6. 協作與生態（Collaboration）
 *    - 利害關係人、顧問、社群
 * 
 * 7. 管理與設定（Management）
 *    - 個人資料、通知、系統狀態
 * 
 * 8. 價值與成長（Value & Growth）
 *    - 價值階梯、訂閱、永續學院
 */

import React from 'react';
import Link from 'next/link';
import {
  Home, Search, BookOpen, LogIn, LayoutDashboard, Bot,
  Users, Settings, TrendingUp, Shield, Zap, Globe,
  FileText, BarChart3, Lock, Key, Eye, Play,
  GraduationCap, Award, Heart, Sparkles, ArrowRight,
  ChevronRight, Star, CheckCircle2, Target, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';

interface JourneyStage {
  id: string;
  name: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  description: string;
  pages: JourneyPage[];
}

interface JourneyPage {
  name: string;
  path: string;
  description: string;
  icon: React.ElementType;
  isNew?: boolean;
  isPro?: boolean;
}

const JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 'awareness',
    name: '探索與認識',
    subtitle: 'Awareness',
    icon: Eye,
    color: 'from-blue-500 to-cyan-500',
    description: '了解 ESGGO 平台，探索永續治理的可能性',
    pages: [
      { name: '首頁', path: '/', description: '平台入口 · 即時數據預覽', icon: Home },
      { name: '平台版本', path: '/platform-versions', description: '所有模組版本資訊', icon: Layers, isNew: true },
      { name: '搜尋', path: '/search', description: '全站智慧搜尋', icon: Search },
    ],
  },
  {
    id: 'evaluation',
    name: '評估與入門',
    subtitle: 'Evaluation',
    icon: BookOpen,
    color: 'from-emerald-500 to-teal-500',
    description: '學習 ESG 知識，評估平台功能',
    pages: [
      { name: '學院', path: '/academy', description: 'ESG 學習中心', icon: GraduationCap },
      { name: '指南', path: '/guide', description: '使用指南與教學', icon: BookOpen },
      { name: '最佳實踐', path: '/best-practice', description: 'ESG 最佳實踐案例', icon: Star },
      { name: '標準', path: '/standards', description: 'ESG 標準與法規', icon: Award },
      { name: '範本', path: '/templates', description: '報告範本庫', icon: FileText },
      { name: '設計庫', path: '/design-library', description: 'UI 設計資源', icon: Sparkles },
    ],
  },
  {
    id: 'onboarding',
    name: '開始使用',
    subtitle: 'Onboarding',
    icon: LogIn,
    color: 'from-violet-500 to-purple-500',
    description: '建立帳號，設定平台',
    pages: [
      { name: '登入', path: '/login', description: '帳號登入 · 萬能元鑰', icon: LogIn },
      { name: 'OAuth 授權', path: '/oauth/consent', description: '第三方授權', icon: Lock },
      { name: 'API 設定', path: '/api-setup', description: 'API 金鑰設定', icon: Key },
      { name: '資料連接', path: '/data-connect', description: '資料來源連接', icon: Globe },
    ],
  },
  {
    id: 'core',
    name: '核心功能',
    subtitle: 'Core Experience',
    icon: LayoutDashboard,
    color: 'from-amber-500 to-orange-500',
    description: '數據分析、報告撰寫、合規檢查',
    pages: [
      { name: '儀表板', path: '/dashboard', description: '永續數據儀表板', icon: LayoutDashboard },
      { name: '環境數據', path: '/dashboard/metrics/environmental', description: '環境指標分析', icon: BarChart3 },
      { name: '社會數據', path: '/dashboard/metrics/social', description: '社會指標分析', icon: Users },
      { name: '治理數據', path: '/dashboard/metrics/governance', description: '治理指標分析', icon: Shield },
      { name: '報告撰寫', path: '/sustain-write', description: 'AI 永續報告撰寫', icon: FileText },
      { name: '報告產生', path: '/report', description: '自動報告產生', icon: FileText },
      { name: '報告建構器', path: '/dashboard/report-builder', description: '互動式報告建構', icon: Layers },
      { name: '合規檢查', path: '/compliance-check', description: '合規性檢查', icon: CheckCircle2 },
      { name: '稽核驗證', path: '/audit-verify', description: '數據稽核驗證', icon: Shield },
      { name: '稽核日誌', path: '/audit-log', description: '操作稽核日誌', icon: FileText },
      { name: '文件清單', path: '/document-checklist', description: '合規文件清單', icon: FileText },
      { name: 'CBAM 計算機', path: '/cbam-calculator', description: 'CBAM 碳關稅計算', icon: BarChart3 },
      { name: 'GRI 追蹤', path: '/gri-tracker', description: 'GRI 標準追蹤', icon: Target },
      { name: '重大性分析', path: '/materiality', description: '重大性矩陣分析', icon: Target },
      { name: '財務', path: '/finance', description: '永續財務分析', icon: BarChart3 },
    ],
  },
  {
    id: 'advanced',
    name: '進階功能',
    subtitle: 'Advanced',
    icon: Bot,
    color: 'from-rose-500 to-pink-500',
    description: 'AI 代理、數位分身、智能分析',
    pages: [
      { name: 'OmniAgent', path: '/omni-agent', description: 'AI 代理控制台', icon: Bot, isNew: true },
      { name: '子代理管理', path: '/agents', description: '子代理管理', icon: Bot },
      { name: 'AI 平台', path: '/ai-platform', description: 'AI 模型平台', icon: Sparkles },
      { name: '數位分身', path: '/digital-twin', description: '企業數位分身', icon: Globe },
      { name: '智能分析', path: '/intelligence', description: 'AI 智能分析', icon: Sparkles },
      { name: '矩陣', path: '/matrix', description: 'ESG 矩陣分析', icon: Layers },
      { name: 'Apollo 工作室', path: '/apollo-studio', description: 'GraphQL 工作室', icon: Sparkles },
    ],
  },
  {
    id: 'collaboration',
    name: '協作與生態',
    subtitle: 'Collaboration',
    icon: Users,
    color: 'from-cyan-500 to-blue-500',
    description: '利害關係人、顧問、社群協作',
    pages: [
      { name: '利害關係人', path: '/stakeholders', description: '利害關係人管理', icon: Users },
      { name: '利害關係人調查', path: '/stakeholder-survey', description: '調查問卷', icon: FileText },
      { name: '顧問', path: '/advisors', description: 'ESG 顧問', icon: Users },
      { name: '諮詢', path: '/advisory', description: '專業諮詢', icon: Users },
      { name: '社群', path: '/social', description: '社群互動', icon: Heart },
      { name: '閱讀室', path: '/reading-room', description: '永續閱讀室', icon: BookOpen },
      { name: '智庫', path: '/think-tank', description: '永續智庫', icon: Sparkles },
      { name: '證明中心', path: '/proof-center', description: '誠信證明中心', icon: Award },
      { name: '註冊', path: '/registry', description: '區塊鏈註冊', icon: Globe },
      { name: '發佈', path: '/publish', description: '報告發佈', icon: FileText },
    ],
  },
  {
    id: 'management',
    name: '管理與設定',
    subtitle: 'Management',
    icon: Settings,
    color: 'from-neutral-500 to-neutral-600',
    description: '個人資料、通知、系統管理',
    pages: [
      { name: '個人資料', path: '/profile', description: '個人設定', icon: Settings },
      { name: '通知', path: '/notifications', description: '通知中心', icon: Settings },
      { name: '系統狀態', path: '/system-status', description: '系統狀態監控', icon: Settings },
      { name: '系統測試', path: '/system-test', description: '系統測試', icon: Settings },
      { name: '超級管理員', path: '/super-admin', description: '管理員後台', icon: Lock },
      { name: '健康檢查', path: '/health-check', description: '系統健康檢查', icon: CheckCircle2 },
      { name: '完整性', path: '/integrity', description: '數據完整性', icon: Shield },
      { name: '任務', path: '/tasks', description: '任務管理', icon: Target },
      { name: '地圖', path: '/map', description: 'ESG 地圖', icon: Globe },
      { name: '圖書館', path: '/library', description: '資源圖書館', icon: BookOpen },
      { name: '資料來源', path: '/data-sources', description: '資料來源管理', icon: Database },
      { name: 'OmniSpace', path: '/omnispace', description: '共振空間', icon: Sparkles },
    ],
  },
  {
    id: 'value',
    name: '價值與成長',
    subtitle: 'Value & Growth',
    icon: TrendingUp,
    color: 'from-yellow-500 to-amber-500',
    description: '價值階梯、訂閱升級、永續成長',
    pages: [
      { name: '價值階梯', path: '/value-ladder', description: '價值階梯', icon: TrendingUp, isPro: true },
      { name: '價值等級', path: '/value-levels', description: '價值等級', icon: TrendingUp, isPro: true },
      { name: '價值路徑', path: '/value-path', description: '價值路徑', icon: TrendingUp, isPro: true },
      { name: '高級訂閱', path: '/dashboard/premium', description: 'Premium 功能', icon: Star, isPro: true },
      { name: '路線圖', path: '/roadmap', description: '產品路線圖', icon: Target },
      { name: '演練', path: '/walkthrough', description: '互動式演練', icon: Play },
      { name: '靈魂', path: '/soul', description: '平台靈魂', icon: Heart },
      { name: '環境', path: '/environmental', description: '環境頁面', icon: Globe },
      { name: '治理', path: '/governance', description: '治理頁面', icon: Shield },
    ],
  },
];

export default function CustomerJourneyCenterPage() {
  const totalPages = JOURNEY_STAGES.reduce((sum, stage) => sum + stage.pages.length, 0);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ─── Header ─── */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-full text-sm font-medium">
            <Target size={16} />
            顧客旅程中心
          </div>
          <h1 className="text-3xl font-black text-neutral-900">
            Customer Journey Center
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl mx-auto">
            以客戶需求為同心圓中心，從探索到價值成長的完整旅程
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-neutral-400">
            <span className="flex items-center gap-1">
              <Layers size={14} />
              {JOURNEY_STAGES.length} 個階段
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <FileText size={14} />
              {totalPages} 個頁面
            </span>
          </div>
        </div>

        {/* ─── Journey Stages ─── */}
        {JOURNEY_STAGES.map((stage, index) => {
          const Icon = stage.icon;
          return (
            <div key={stage.id} className="space-y-4">
              {/* Stage Header */}
              <div className="flex items-center gap-4">
                <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white', stage.color)}>
                  <Icon size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-neutral-900">{stage.name}</h2>
                    <span className="text-xs text-neutral-400">{stage.subtitle}</span>
                    <Badge variant="neutral" size="sm">{stage.pages.length}</Badge>
                  </div>
                  <p className="text-sm text-neutral-500">{stage.description}</p>
                </div>
              </div>

              {/* Pages Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 ml-16">
                {stage.pages.map(page => {
                  const PageIcon = page.icon;
                  return (
                    <Link key={page.path} href={page.path}>
                      <Card variant="default" padding="sm" hover className="h-full">
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center shrink-0">
                            <PageIcon size={14} className="text-neutral-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <h3 className="text-xs font-bold text-neutral-900 truncate">{page.name}</h3>
                              {page.isNew && <Badge variant="info" size="sm">New</Badge>}
                              {page.isPro && <Badge variant="warning" size="sm">Pro</Badge>}
                            </div>
                            <p className="text-[10px] text-neutral-500 mt-0.5 line-clamp-2">{page.description}</p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>

              {/* Connector */}
              {index < JOURNEY_STAGES.length - 1 && (
                <div className="flex items-center justify-center py-2">
                  <ChevronRight size={20} className="text-neutral-300 rotate-90" />
                </div>
              )}
            </div>
          );
        })}

        {/* ─── Footer ─── */}
        <Card variant="outlined" padding="md">
          <div className="text-center space-y-2 py-2">
            <p className="text-sm font-medium text-neutral-700">
              以客戶需求為同心圓中心
            </p>
            <p className="text-[10px] text-neutral-400">
              從探索到價值成長的完整顧客旅程 · 共 {totalPages} 個頁面
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
