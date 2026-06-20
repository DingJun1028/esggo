// @ts-nocheck
/**
 * ESGGO v2.0 版本發布頁面
 * 
 * 展示所有新功能、改進項目、已知問題
 */

import React from 'react';
import {
  Rocket, CheckCircle2, AlertCircle, Star, Zap,
  Shield, Bot, Key, FileText, Database, Globe,
  Users, Settings, TrendingUp, Eye, Layers
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/v2/Card';
import { Badge } from '@/components/ui/v2/Input';
import { SectionHeader } from '@/components/ui/v2/Input';

interface ReleaseItem {
  title: string;
  description: string;
  icon: React.ElementType;
  status: 'completed' | 'in-progress' | 'planned';
  category: string;
}

const RELEASE_ITEMS: ReleaseItem[] = [
  // 核心功能
  { title: 'OmniAgent 控制台', description: '語音指令 + 終端機 + 多媒體回應 + 萬能筆記', icon: Bot, status: 'completed', category: '核心功能' },
  { title: '萬能元鑰 (OmniKey)', description: '統一身份驗證 · 一切未知的解答，能開啟一切可能', icon: Key, status: 'completed', category: '核心功能' },
  { title: '萬能日誌 (OmniLogger)', description: '統一日誌系統 · 取代所有 console.log', icon: FileText, status: 'completed', category: '核心功能' },
  { title: '平台版本全視圖', description: '所有模組版本資訊一目了然', icon: Layers, status: 'completed', category: '核心功能' },
  { title: '顧客旅程中心', description: '8 階段 73 頁面 · 以客戶需求為同心圓中心', icon: Globe, status: 'completed', category: '核心功能' },
  
  // UI v2
  { title: 'UI v2 全面遷移', description: '所有頁面升級為 UI v2 元件 · 移除漸層色、framer-motion', icon: Eye, status: 'completed', category: 'UI v2' },
  { title: 'UI 設計十大原則', description: '極簡美學、服務教學、高資訊量、實用高效、操作簡單、正確合規、全域 RWD、進步成長、最佳實踐化、以客戶需求為同心圓中心', icon: Star, status: 'completed', category: 'UI v2' },
  { title: '刪除 67 個純展示頁面', description: '減少約 30,000 行無用代碼', icon: CheckCircle2, status: 'completed', category: 'UI v2' },
  
  // 數據
  { title: 'Reading Room', description: '32 筆 ESG 文件 · 含 Environmental/Social/Governance 三分類', icon: Database, status: 'in-progress', category: '數據' },
  { title: 'Dashboard 數據圖表', description: '碳排放趨勢、5T 分析、數據來源分佈', icon: TrendingUp, status: 'completed', category: '數據' },
  
  // API
  { title: 'OmniKey API', description: '建立、驗證、列表、撤銷', icon: Shield, status: 'completed', category: 'API' },
  { title: 'Reading Room API', description: '文件列表、搜尋、分類篩選', icon: Database, status: 'completed', category: 'API' },
  
  // 待處理
  { title: 'VPS 設定遠端倉庫', description: '等待 VPS 恢復', icon: Settings, status: 'planned', category: '待處理' },
  { title: 'Supabase Seed 資料', description: '需要在控制台手動執行 SQL', icon: Database, status: 'planned', category: '待處理' },
];

const STATUS_CONFIG = {
  completed: { label: '已完成', color: 'success' },
  'in-progress': { label: '進行中', color: 'warning' },
  planned: { label: '計劃中', color: 'neutral' },
};

export default function ReleaseV2Page() {
  const completed = RELEASE_ITEMS.filter(i => i.status === 'completed').length;
  const inProgress = RELEASE_ITEMS.filter(i => i.status === 'in-progress').length;
  const planned = RELEASE_ITEMS.filter(i => i.status === 'planned').length;
  
  const categories = [...new Set(RELEASE_ITEMS.map(i => i.category))];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* ─── Header ─── */}
        <Card variant="default" padding="lg">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-full text-sm font-medium">
              <Rocket size={16} />
              ESGGO v2.0 版本發布
            </div>
            <h1 className="text-3xl font-black text-neutral-900">
              Platform v2.0 Release
            </h1>
            <p className="text-base text-neutral-500 max-w-2xl mx-auto">
              以客戶需求為同心圓中心，從探索到價值成長的完整顧客旅程
            </p>
            <div className="flex items-center justify-center gap-4 text-sm">
              <Badge variant="success" size="md">{completed} 已完成</Badge>
              <Badge variant="warning" size="md">{inProgress} 進行中</Badge>
              <Badge variant="neutral" size="md">{planned} 計劃中</Badge>
            </div>
          </div>
        </Card>

        {/* ─── Progress ─── */}
        <Card variant="default" padding="md">
          <SectionHeader title="開發進度" subtitle={`${completed}/${RELEASE_ITEMS.length} 項目完成`} />
          <div className="mt-4 h-3 bg-neutral-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-neutral-900 rounded-full transition-all duration-500"
              style={{ width: `${(completed / RELEASE_ITEMS.length) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-neutral-400">
            <span>{Math.round((completed / RELEASE_ITEMS.length) * 100)}% 完成</span>
            <span>{RELEASE_ITEMS.length} 個項目</span>
          </div>
        </Card>

        {/* ─── Release Items by Category ─── */}
        {categories.map(category => {
          const items = RELEASE_ITEMS.filter(i => i.category === category);
          return (
            <div key={category} className="space-y-3">
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                {category}
                <Badge variant="neutral" size="sm">{items.length}</Badge>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map(item => {
                  const Icon = item.icon;
                  const statusConfig = STATUS_CONFIG[item.status];
                  return (
                    <Card key={item.title} variant="default" padding="sm" hover>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-neutral-50 flex items-center justify-center shrink-0">
                          <Icon size={16} className="text-neutral-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-bold text-neutral-900">{item.title}</h3>
                            <Badge variant={statusConfig.color} size="sm">{statusConfig.label}</Badge>
                          </div>
                          <p className="text-xs text-neutral-500">{item.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* ─── UI Design Principles ─── */}
        <Card variant="outlined" padding="md">
          <SectionHeader title="UI 設計十大原則" subtitle="所有頁面必須符合的設計規範" />
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
            {[
              '極簡美學', '服務教學', '高資訊量', '實用高效', '操作簡單',
              '正確合規', '全域 RWD', '進步成長', '最佳實踐化', '以客戶需求為同心圓中心'
            ].map((principle, i) => (
              <div key={principle} className="px-3 py-2 rounded-lg bg-neutral-50 text-center">
                <span className="text-[10px] text-neutral-400">#{i + 1}</span>
                <p className="text-xs font-medium text-neutral-700">{principle}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* ─── Footer ─── */}
        <Card variant="outlined" padding="md">
          <div className="text-center space-y-2 py-2">
            <p className="text-sm font-medium text-neutral-700">
              ESGGO Platform v2.0 · 以客戶需求為同心圓中心
            </p>
            <p className="text-[10px] text-neutral-400">
              最後更新: {new Date().toLocaleString('zh-TW')} · 共 {RELEASE_ITEMS.length} 個項目
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
