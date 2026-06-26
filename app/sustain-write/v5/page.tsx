'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * ESGGO v5.1 — OmniBase Style Frontend
 * Design: White background, no glass, left Gold border accent
 * Grid stats, chapter navigation, 5T badges, ZKP seal row
 * Integrates with async task API + OmniAgent
 */

// ─── Types ───────────────────────────────────────────────────────────
type FiveTGate = 'traceable' | 'transparent' | 'tangible' | 'trustworthy' | 'trackable';
type TaskStatus = 'idle' | 'pending' | 'running' | 'completed' | 'failed';

interface Company {
  id: string;
  name: string;
  shortName: string;
  industry: string;
}

interface TaskProgress {
  taskId: string;
  status: TaskStatus;
  currentChapter: number;
  totalChapters: number;
  chapterTitle: string;
  wordsSoFar: number;
  fiveTGate: string;
  tagsCreated: number;
  decisionsCount: number;
  percent: number;
  result?: {
    totalWords: number;
    totalTags: number;
    trinityHash: string;
    durationMs: number;
  };
}

// ─── Constants ───────────────────────────────────────────────────────
const GATE_COLORS: Record<FiveTGate, string> = {
  traceable: 'bg-blue-500',
  transparent: 'bg-emerald-500',
  tangible: 'bg-amber-500',
  trustworthy: 'bg-purple-500',
  trackable: 'bg-cyan-500',
};

const GATE_LABELS: Record<FiveTGate, string> = {
  traceable: '真',
  transparent: '善',
  tangible: '美',
  trustworthy: '信',
  trackable: '通',
};

const GATE_BG: Record<FiveTGate, string> = {
  traceable: 'bg-blue-50 border-blue-200',
  transparent: 'bg-emerald-50 border-emerald-200',
  tangible: 'bg-amber-50 border-amber-200',
  trustworthy: 'bg-purple-50 border-purple-200',
  trackable: 'bg-cyan-50 border-cyan-200',
};

// ─── API Helpers ─────────────────────────────────────────────────────
async function fetchCompanies(): Promise<Company[]> {
  const res = await fetch('/api/sustain-write/v5');
  const data = await res.json();
  return data.companies || [];
}

async function startAsyncReport(companyId: string): Promise<{ taskId: string }> {
  const res = await fetch('/api/sustain-write/v5/async', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ companyId }),
  });
  return res.json();
}

async function fetchTaskProgress(taskId: string): Promise<TaskProgress> {
  const res = await fetch(`/api/sustain-write/v5/progress/${taskId}`);
  return res.json();
}

// ─── Components ──────────────────────────────────────────────────────

function StatCard({ value, label, accent }: { value: string | number; label: string; accent: string }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 text-center">
      <div className={`text-2xl font-bold ${accent}`}>{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </div>
  );
}

function FiveTBadge({ gate }: { gate: FiveTGate }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white ${GATE_COLORS[gate]}`}>
      {GATE_LABELS[gate]}
    </span>
  );
}

function ProgressBar({ progress }: { progress: TaskProgress }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">
          第 {progress.currentChapter}/{progress.totalChapters} 章：{progress.chapterTitle}
        </span>
        <span className="font-medium text-teal-600">{progress.percent}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div
          className="bg-teal-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
      <div className="grid grid-cols-4 gap-3 text-xs text-slate-500">
        <div><span className="font-medium text-slate-700">{progress.wordsSoFar.toLocaleString()}</span> 字</div>
        <div><span className="font-medium text-slate-700">{progress.tagsCreated}</span> 標籤</div>
        <div><span className="font-medium text-slate-700">{progress.decisionsCount}</span> 決策</div>
        <div>
          <FiveTBadge gate={progress.fiveTGate as FiveTGate} />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────

export default function SustainWriteV5Page() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [taskProgress, setTaskProgress] = useState<TaskProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load companies on mount
  useEffect(() => {
    fetchCompanies()
      .then(setCompanies)
      .catch(() => setError('無法載入公司列表'));
  }, []);

  // Poll task progress
  const startPolling = useCallback((taskId: string) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      try {
        const progress = await fetchTaskProgress(taskId);
        setTaskProgress(progress);

        if (progress.status === 'completed' || progress.status === 'failed') {
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setLoading(false);
        }
      } catch {
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        setLoading(false);
        setError('查詢進度失敗');
      }
    }, 500);
  }, []);

  // Start report generation
  const handleGenerate = async () => {
    if (!selectedCompany) return;
    setLoading(true);
    setError(null);
    setTaskProgress(null);

    try {
      const { taskId } = await startAsyncReport(selectedCompany);
      startPolling(taskId);
    } catch {
      setLoading(false);
      setError('啟動任務失敗');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <h1 className="text-lg font-semibold text-slate-800">ESGGO v5.1</h1>
          </div>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
            OmniBase · 零算力報告
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard value={28} label="章節數" accent="text-teal-600" />
          <StatCard value="280K" label="總字數目標" accent="text-amber-600" />
          <StatCard value="5T" label="真善美信通" accent="text-blue-600" />
          <StatCard value="ZKP" label="零知識證明" accent="text-purple-600" />
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
          <div className="border-l-4 border-amber-400 pl-4 mb-4">
            <h2 className="text-base font-semibold text-slate-800">報告生成器</h2>
            <p className="text-sm text-slate-500 mt-1">選擇公司，啟動非同步 28 章永續報告生成</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            >
              <option value="">選擇公司...</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}（{c.industry}）
                </option>
              ))}
            </select>

            <button
              onClick={handleGenerate}
              disabled={!selectedCompany || loading}
              className="px-6 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '生成中...' : '一鍵生成報告'}
            </button>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Progress Panel */}
        {taskProgress && (
          <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-800">生成進度</h3>
              <span className={`text-xs px-2 py-1 rounded font-medium ${
                taskProgress.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                taskProgress.status === 'failed' ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {taskProgress.status === 'completed' ? '已完成' :
                 taskProgress.status === 'failed' ? '失敗' : '生成中'}
              </span>
            </div>

            <ProgressBar progress={taskProgress} />

            {taskProgress.result && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-slate-500">總字數</span>
                    <div className="font-semibold text-slate-800">{taskProgress.result.totalWords.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">標籤數</span>
                    <div className="font-semibold text-slate-800">{taskProgress.result.totalTags}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">耗時</span>
                    <div className="font-semibold text-slate-800">{(taskProgress.result.durationMs / 1000).toFixed(1)}s</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Trinity Hash</span>
                    <div className="font-mono text-xs text-slate-600 truncate">{taskProgress.result.trinityHash}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 5T Protocol Overview */}
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-base font-semibold text-slate-800 mb-4">5T 協議閘門</h3>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {(['traceable', 'transparent', 'tangible', 'trustworthy', 'trackable'] as FiveTGate[]).map((gate, i) => (
              <div key={gate} className={`p-3 rounded-lg border ${GATE_BG[gate]}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-bold text-slate-700">{i + 1}</span>
                  <FiveTBadge gate={gate} />
                </div>
                <div className="text-xs text-slate-600">
                  {gate === 'traceable' && '數據可溯源追蹤'}
                  {gate === 'transparent' && '算法公開可驗算'}
                  {gate === 'tangible' && '抽象願景具體化'}
                  {gate === 'trustworthy' && 'Hash Lock 不可篡改'}
                  {gate === 'trackable' && '生命週期即時記錄'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-xs text-slate-500">
          ESGGO v5.1 · OmniBase 萬能系統 · 28 章 × 10K 字 = 280,000 字零算力報告
        </div>
      </footer>
    </div>
  );
}
