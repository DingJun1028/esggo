'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardStats, Regulation, CompanyReport, ESGRadarData, TimelineItem } from '@/types/esg-sonar';
import { RegulationCard } from '@/components/esg-sonar/RegulationCard';
import { CompanyReportCard } from '@/components/esg-sonar/CompanyReportCard';
import { Timeline } from '@/components/esg-sonar/Timeline';
import { useTheme } from '@/components/esg-sonar/DarkThemeProvider';

interface DashboardData {
  stats: DashboardStats;
  radarData: ESGRadarData[];
  recentRegulations: Regulation[];
  recentReports: CompanyReport[];
  timeline: TimelineItem[];
}

export default function ESGSonarDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/esg-sonar/dashboard');
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 導航到法規搜尋頁面
      window.location.href = `/esg-sonar/regulations?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[var(--esg-bg)]">
      {/* 背景裝飾 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--esg-primary)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--esg-accent)]/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 頁面標題 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[var(--esg-text-main)] flex items-center gap-3">
              <span className="text-4xl">🔍</span>
              ESGSonar
            </h1>
            <p className="text-[var(--esg-text-muted)] mt-1">
              ESG 法規監測與企業報告書追蹤系統
            </p>
          </div>
          
          {/* 主題切換 */}
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-[var(--esg-card-bg)] border border-[var(--esg-glass-border)] hover:border-[var(--esg-primary)] transition-all"
            aria-label="切換主題"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

        {/* 快速搜尋 */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
              🔎
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜尋法規、、企業或報告書..."
              className="
                w-full pl-12 pr-4 py-4 rounded-xl text-lg
                bg-[var(--esg-card-bg)] border border-[var(--esg-glass-border)]
                text-[var(--esg-text-main)] placeholder-[var(--esg-text-muted)]
                focus:outline-none focus:ring-2 focus:ring-[var(--esg-primary)] focus:border-transparent
                transition-all shadow-lg
              "
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-[var(--esg-primary)] text-white font-medium hover:bg-[var(--esg-primary)]/90 transition-colors"
            >
              搜尋
            </button>
          </form>
        </div>

        {/* 統計數據卡片 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard
            icon="📜"
            label="法規總數"
            value={data?.stats.totalRegulations || 0}
            color="var(--esg-primary)"
          />
          <StatCard
            icon="✅"
            label="生效中"
            value={data?.stats.activeRegulations || 0}
            color="var(--esg-success)"
          />
          <StatCard
            icon="📄"
            label="報告書"
            value={data?.stats.totalReports || 0}
            color="var(--esg-accent)"
          />
          <StatCard
            icon="⏳"
            label="待處理"
            value={data?.stats.pendingReports || 0}
            color="var(--esg-warning)"
          />
          <StatCard
            icon="🏢"
            label="企業數"
            value={data?.stats.totalCompanies || 0}
            color="var(--esg-info)"
          />
          <StatCard
            icon="🔄"
            label="近期變更"
            value={data?.stats.recentChanges || 0}
            color="var(--esg-error)"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 左側：法規和報告書 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 最新法規 */}
            <section className="bg-[var(--esg-card-bg)] rounded-2xl border border-[var(--esg-glass-border)] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[var(--esg-text-main)] flex items-center gap-2">
                  <span>📜</span> 最新法規
                </h2>
                <Link
                  href="/esg-sonar/regulations"
                  className="text-sm text-[var(--esg-primary)] hover:underline"
                >
                  查看全部 →
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {data?.recentRegulations.slice(0, 4).map(regulation => (
                  <RegulationCard key={regulation.id} regulation={regulation} />
                ))}
              </div>
            </section>

            {/* 企業報告書狀態 */}
            <section className="bg-[var(--esg-card-bg)] rounded-2xl border border-[var(--esg-glass-border)] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[var(--esg-text-main)] flex items-center gap-2">
                  <span>📄</span> 企業報告書
                </h2>
                <Link
                  href="/esg-sonar/reports"
                  className="text-sm text-[var(--esg-primary)] hover:underline"
                >
                  查看全部 →
                </Link>
              </div>
              <div className="space-y-3">
                {data?.recentReports.slice(0, 4).map(report => (
                  <CompanyReportCardCompact key={report.id} report={report} />
                ))}
              </div>
            </section>
          </div>

          {/* 右側：雷達圖和時間軸 */}
          <div className="space-y-8">
            {/* ESG 雷達圖 */}
            <section className="bg-[var(--esg-card-bg)] rounded-2xl border border-[var(--esg-glass-border)] p-6">
              <h2 className="text-xl font-semibold text-[var(--esg-text-main)] flex items-center gap-2 mb-6">
                <span>📊</span> ESG 趨勢
              </h2>
              <ESGRadarChart data={data?.radarData || []} />
            </section>

            {/* 法規沿革時間軸 */}
            <section className="bg-[var(--esg-card-bg)] rounded-2xl border border-[var(--esg-glass-border)] p-6">
              <h2 className="text-xl font-semibold text-[var(--esg-text-main)] flex items-center gap-2 mb-6">
                <span>📅</span> 近期動態
              </h2>
              <Timeline items={data?.timeline || []} />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// 統計卡片元件
function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className="p-4 rounded-xl bg-[var(--esg-card-bg)] border border-[var(--esg-glass-border)] hover:border-[var(--esg-primary)] transition-all group">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-2xl font-bold" style={{ color }}>{value}</span>
      </div>
      <p className="text-sm text-[var(--esg-text-muted)]">{label}</p>
    </div>
  );
}

// 精簡版報告書卡片
function CompanyReportCardCompact({ report }: { report: CompanyReport }) {
  return (
    <Link
      href={`/esg-sonar/reports/${report.id}`}
      className="block p-3 rounded-lg border border-[var(--esg-glass-border)] hover:border-[var(--esg-primary)] hover:bg-[var(--esg-surface-2)] transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--esg-primary)]/50 to-[var(--esg-accent)]/50 flex items-center justify-center text-lg flex-shrink-0">
          {report.companyName.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[var(--esg-text-main)] truncate">{report.companyName}</p>
          <p className="text-xs text-[var(--esg-text-muted)]">
            {report.reportType} · {report.reportYear}年度
          </p>
        </div>
        <StatusIndicator status={report.status} />
      </div>
    </Link>
  );
}

function StatusIndicator({ status }: { status: string }) {
  const colors: Record<string, string> = {
    COMPLETED: 'var(--esg-success)',
    PROCESSING: 'var(--esg-info)',
    PENDING: 'var(--esg-text-muted)',
    FAILED: 'var(--esg-error)'
  };
  
  return (
    <span
      className="w-2 h-2 rounded-full"
      style={{ backgroundColor: colors[status] || 'var(--esg-text-muted)' }}
    />
  );
}

// ESG 雷達圖（使用 CSS 實現的簡化版）
function ESGRadarChart({ data }: { data: ESGRadarData[] }) {
  const maxValue = 100;
  
  return (
    <div className="relative aspect-square max-w-xs mx-auto">
      {/* 背景網格 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full border border-[var(--esg-glass-border)] rounded-full opacity-30" />
        <div className="w-3/4 h-3/4 border border-[var(--esg-glass-border)] rounded-full opacity-30" />
        <div className="w-1/2 h-1/2 border border-[var(--esg-glass-border)] rounded-full opacity-30" />
        <div className="w-1/4 h-1/4 border border-[var(--esg-glass-border)] rounded-full opacity-30" />
      </div>
      
      {/* 雷達圖資料 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          {data.map((item, index) => {
            const angle = (index * 120 - 90) * (Math.PI / 180);
            const radius = (item.value / maxValue) * 40;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);
            
            return (
              <div key={item.category}>
                {/* 軸線 */}
                <div
                  className="absolute left-1/2 top-1/2 w-0.5 h-[40%] bg-[var(--esg-glass-border)] origin-bottom"
                  style={{ transform: `rotate(${index * 120 - 90}deg)` }}
                />
                {/* 資料點 */}
                <div
                  className="absolute w-4 h-4 rounded-full bg-[var(--esg-primary)] border-2 border-white shadow-lg"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
                {/* 標籤 */}
                <div
                  className="absolute text-xs font-medium text-[var(--esg-text-sub)] whitespace-nowrap"
                  style={{
                    left: `${50 + 45 * Math.cos(angle)}%`,
                    top: `${50 + 45 * Math.sin(angle)}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {item.label} {item.value}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 載入骨架
function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--esg-bg)] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-[var(--esg-surface)] rounded animate-pulse mb-8" />
        
        <div className="grid grid-cols-6 gap-4 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-[var(--esg-surface)] rounded-xl animate-pulse" />
          ))}
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="h-96 bg-[var(--esg-surface)] rounded-2xl animate-pulse" />
            <div className="h-64 bg-[var(--esg-surface)] rounded-2xl animate-pulse" />
          </div>
          <div className="space-y-8">
            <div className="h-64 bg-[var(--esg-surface)] rounded-2xl animate-pulse" />
            <div className="h-80 bg-[var(--esg-surface)] rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}