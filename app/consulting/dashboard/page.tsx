'use client';

import React, { useState, Suspense } from 'react';
import {
  TrendingUp, CheckCircle2, AlertTriangle, Clock, FileText,
  BarChart3, Target, MessageSquare, Download, ArrowRight,
  Shield, ChevronRight, Zap, Calendar, Users,
} from 'lucide-react';
import {
  MOCK_HEALTH_CHECK,
  MOCK_DASHBOARD,
  MOCK_REQUESTS,
  CONSULTANTS,
  type RoadmapItem,
} from '../../../lib/consulting-data';

function RadarBar({ label, score, max }: { label: string; score: number; max: number }) {
  const pct = Math.round((score / max) * 100);
  const color = pct >= 70 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-700 font-medium">{label}</span>
        <span className={`font-bold ${pct >= 70 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-red-500'}`}>{pct}%</span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function RoadmapRow({ item }: { item: RoadmapItem }) {
  const statusIcon = {
    done: <CheckCircle2 size={16} className="text-emerald-500" />,
    'in-progress': <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />,
    todo: <div className="w-4 h-4 border-2 border-slate-300 rounded-full" />,
  }[item.status];

  const statusLabel = { done: '已完成', 'in-progress': '進行中', todo: '待辦' }[item.status];
  const rowBg = item.status === 'done' ? 'bg-emerald-50' : item.status === 'in-progress' ? 'bg-blue-50' : 'bg-white';

  return (
    <div className={`flex items-start gap-4 p-4 rounded-xl border border-slate-100 ${rowBg} transition-colors`}>
      <div className="flex-shrink-0 mt-0.5">{statusIcon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="text-xs font-semibold text-slate-500">{item.week}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            item.status === 'done' ? 'bg-emerald-100 text-emerald-700' :
            item.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
            'bg-slate-100 text-slate-500'
          }`}>{statusLabel}</span>
        </div>
        <p className="text-sm text-slate-700 font-medium mb-1">{item.action}</p>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span>負責：{item.owner}</span>
          <span className="flex items-center gap-1">
            <FileText size={11} />
            {item.deliverable}
          </span>
        </div>
      </div>
    </div>
  );
}

function DashboardContent() {
  const [activeSection, setActiveSection] = useState<'overview' | 'roadmap' | 'health'>('overview');
  const d = MOCK_DASHBOARD;
  const hc = MOCK_HEALTH_CHECK;

  const riskColor = {
    low: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    medium: 'text-amber-600 bg-amber-50 border-amber-200',
    high: 'text-red-600 bg-red-50 border-red-200',
  }[d.riskLevel];
  const riskLabel = { low: '低風險', medium: '中風險', high: '高風險' }[d.riskLevel];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <BarChart3 size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">中控儀表板</h1>
              <p className="text-sm text-slate-500">Consulting Dashboard</p>
            </div>
          </div>
          <p className="text-sm text-slate-500">即時查看您的 ESG 落地進度、資料齊備度與顧問互動紀錄</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors">
          <Download size={15} />
          匯出交付框架
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { label: 'Roadmap 完成率', value: `${d.roadmapCompletion}%`, sub: `${d.completedDeliverables} / 6 里程碑`, color: 'border-blue-300 bg-blue-50', val: 'text-blue-700' },
          { label: '資料齊備度', value: `${d.dataReadiness}%`, sub: '可稽核 / 不可稽核', color: 'border-emerald-300 bg-emerald-50', val: 'text-emerald-700' },
          { label: '揭露章節就緒', value: `${d.disclosureReadiness}%`, sub: 'GRI 章節完整度', color: 'border-indigo-300 bg-indigo-50', val: 'text-indigo-700' },
          { label: '風險等級', value: riskLabel, sub: '漂綠/問卷風險', color: `border ${riskColor}`, val: '' },
          { label: '顧問時數', value: `${60 - d.consultingHoursUsed * 60}分`, sub: '規格內剩餘', color: 'border-teal-300 bg-teal-50', val: 'text-teal-700' },
          { label: '待辦任務', value: `${d.pendingTasks}`, sub: '項目未完成', color: 'border-amber-300 bg-amber-50', val: 'text-amber-700' },
        ].map((m, i) => (
          <div key={i} className={`rounded-xl border p-3 text-center ${m.color}`}>
            <p className={`text-2xl font-bold ${m.val}`}>{m.value}</p>
            <p className="text-xs font-semibold text-slate-600 mt-0.5">{m.label}</p>
            <p className="text-xs text-slate-400 mt-0.5">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Next Milestone Alert */}
      <div className="mb-6 flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <Calendar size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-blue-800">下一個里程碑</p>
          <p className="text-sm text-blue-600">{d.nextMilestone}</p>
        </div>
        <span className="text-xs text-blue-500 font-medium bg-blue-100 px-2 py-1 rounded-lg">
          {new Date(d.nextMilestoneDate).toLocaleDateString('zh-TW')}
        </span>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 rounded-xl p-1">
        {[
          { id: 'overview', label: '落地總覽' },
          { id: 'roadmap', label: '90 天 Roadmap' },
          { id: 'health', label: '健檢結果' },
        ].map(s => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id as typeof activeSection)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeSection === s.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Section: Overview */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Bars */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-600" />
              揭露就緒度分析
            </h2>
            {hc.dimensions.map(dim => (
              <RadarBar key={dim.name} label={dim.name} score={dim.score} max={dim.max} />
            ))}
          </div>

          {/* Top 3 Gaps + Consulting Activity */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" />
                Top 3 優先缺口
              </h2>
              <div className="space-y-3">
                {hc.top3Gaps.map((gap, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm text-amber-800 leading-relaxed">{gap}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MessageSquare size={16} className="text-blue-600" />
                顧問互動紀錄
              </h2>
              <div className="space-y-3">
                {MOCK_REQUESTS.slice(0, 2).map(req => {
                  const consultant = CONSULTANTS.find(c => c.id === req.assignedConsultant);
                  return (
                    <div key={req.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      {consultant && (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {consultant.avatar}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{req.module}</p>
                        <p className="text-xs text-slate-500">{consultant?.name} · {new Date(req.createdAt).toLocaleDateString('zh-TW')}</p>
                        {req.status === 'completed' && (
                          <span className="text-xs text-emerald-600 font-medium">✓ 已完成</span>
                        )}
                      </div>
                    </div>
                  );
                })}
                <button className="w-full text-sm text-emerald-600 font-medium py-2 hover:bg-emerald-50 rounded-lg transition-colors flex items-center justify-center gap-1">
                  查看全部預約 <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section: Roadmap */}
      {activeSection === 'roadmap' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Target size={18} className="text-blue-600" />
              90 天改善路線圖
            </h2>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500" />已完成</span>
              <span className="flex items-center gap-1.5"><div className="w-3 h-3 border-2 border-blue-500 rounded-full" />進行中</span>
              <span className="flex items-center gap-1.5"><div className="w-3 h-3 border-2 border-slate-300 rounded-full" />待辦</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">整體進度</span>
              <span className="font-bold text-blue-600">{d.roadmapCompletion}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700" style={{ width: `${d.roadmapCompletion}%` }} />
            </div>
          </div>

          <div className="space-y-3">
            {hc.roadmap90Days.map((item, i) => (
              <RoadmapRow key={i} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* Section: Health Check */}
      {activeSection === 'health' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Shield size={18} className="text-emerald-600" />
                企業永續健檢結果
              </h2>
              <div className="text-center">
                <p className="text-3xl font-bold text-emerald-600">{hc.percentage}</p>
                <p className="text-xs text-slate-400">/ 100 分</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hc.dimensions.map(dim => {
                const pct = Math.round((dim.score / dim.max) * 100);
                const color = pct >= 70 ? 'border-emerald-200 bg-emerald-50' : pct >= 50 ? 'border-amber-200 bg-amber-50' : 'border-red-200 bg-red-50';
                const valColor = pct >= 70 ? 'text-emerald-600' : pct >= 50 ? 'text-amber-600' : 'text-red-500';
                return (
                  <div key={dim.name} className={`rounded-xl border p-4 ${color}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-semibold text-slate-700 text-sm">{dim.name}</span>
                      <span className={`text-lg font-bold ${valColor}`}>{pct}%</span>
                    </div>
                    <div className="h-2 bg-white/60 rounded-full overflow-hidden mb-2">
                      <div className={`h-full rounded-full ${pct >= 70 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-slate-500">主要缺口：{dim.gap}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Zap size={16} className="text-amber-500" />
              建議下一步行動
            </h2>
            <div className="space-y-3">
              {hc.top3Gaps.map((gap, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all cursor-pointer group">
                  <span className="w-7 h-7 rounded-full bg-slate-200 group-hover:bg-emerald-200 text-slate-600 group-hover:text-emerald-700 text-sm font-bold flex items-center justify-center flex-shrink-0 transition-colors">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-slate-700 leading-relaxed">{gap}</p>
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-emerald-500 transition-colors flex-shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConsultingDashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}