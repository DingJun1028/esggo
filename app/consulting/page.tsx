'use client';

import React, { useState, Suspense } from 'react';
import {
  Users, Clock, Star, CheckCircle2, ArrowRight, Shield,
  BookOpen, FileText, BarChart3, MessageSquare, Zap,
  ChevronDown, ChevronUp, AlertTriangle, Award, Target,
  Calendar, Package, TrendingUp, Search, Filter, ExternalLink,
} from 'lucide-react';
import {
  CONSULTING_MODULES,
  CONSULTANTS,
  MOCK_REQUESTS,
  ADDON_SERVICES,
  getStatusColor,
  getStatusLabel,
  getTierLabel,
  getTierColor,
  type ConsultingModule,
  type Consultant,
  type AddOnService,
} from '../../lib/consulting-data';

// ─── Sub-components ────────────────────────────────────────────────────────

function ModuleCard({ module, isActive, onClick }: {
  module: ConsultingModule;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
        isActive
          ? 'border-emerald-500 bg-emerald-50 shadow-md'
          : 'border-slate-200 bg-white hover:border-emerald-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{module.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-slate-800 text-sm">{module.index}. {module.name}</span>
            {module.isIncluded ? (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">規格內</span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">加購</span>
            )}
          </div>
          <p className="text-xs text-slate-500 line-clamp-2">{module.description}</p>
        </div>
      </div>
    </button>
  );
}

function ConsultantCard({ consultant }: { consultant: Consultant }) {
  const [expanded, setExpanded] = useState(false);
  const availabilityColor = {
    available: 'text-emerald-600 bg-emerald-50',
    busy: 'text-red-600 bg-red-50',
    scheduled: 'text-amber-600 bg-amber-50',
  }[consultant.availability];
  const availabilityLabel = {
    available: '可預約',
    busy: '繁忙中',
    scheduled: '已排程',
  }[consultant.availability];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {consultant.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-bold text-slate-800 text-base">{consultant.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTierColor(consultant.tier)}`}>
                {getTierLabel(consultant.tier)}
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate">{consultant.title}</p>
            <p className="text-xs text-emerald-600 font-medium">{consultant.organization}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-lg font-medium flex-shrink-0 ${availabilityColor}`}>
            {availabilityLabel}
          </span>
        </div>

        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold text-slate-700">{consultant.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span className="text-xs text-slate-500">{consultant.sessionsCompleted} 場諮詢</span>
          </div>
          {consultant.hourlyRate && (
            <div className="ml-auto text-sm font-bold text-slate-700">
              NT$ {consultant.hourlyRate.toLocaleString()}<span className="text-xs font-normal text-slate-400">/hr</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {consultant.expertise.map(exp => (
            <span key={exp} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{exp}</span>
          ))}
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-sm text-slate-600 leading-relaxed mb-3">{consultant.bio}</p>
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-1">服務產業</p>
              <p className="text-xs text-slate-600">{consultant.industries.join('、')}</p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? '收起' : '查看詳情'}
          </button>
          {consultant.availability === 'available' && (
            <button className="ml-auto px-3 py-1.5 bg-emerald-500 text-white text-xs rounded-lg font-medium hover:bg-emerald-600 transition-colors">
              立即預約
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AddOnCard({ service }: { service: AddOnService }) {
  return (
    <div className={`bg-white rounded-2xl border-2 overflow-hidden transition-all duration-200 hover:shadow-md ${service.isPopular ? 'border-emerald-300' : 'border-slate-200'}`}>
      {service.isPopular && (
        <div className="bg-emerald-500 text-white text-xs text-center py-1.5 font-semibold tracking-wide">
          🔥 熱門加購
        </div>
      )}
      <div className="p-5">
        <h3 className="font-bold text-slate-800 text-base mb-2">{service.name}</h3>
        <p className="text-sm text-slate-500 leading-relaxed mb-4">{service.description}</p>

        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-500 mb-2">交付物包含</p>
          <ul className="space-y-1">
            {service.deliverables.map((d, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {service.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{tag}</span>
          ))}
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-0.5">預估工期：{service.duration}</p>
            <p className="text-lg font-bold text-emerald-600">{service.price}</p>
          </div>
          <button className="px-4 py-2 bg-slate-800 text-white text-sm rounded-xl font-medium hover:bg-slate-700 transition-colors">
            洽詢報價
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────
function ConsultingContent() {
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'consultants' | 'requests' | 'addons'>('overview');
  const [activeModule, setActiveModule] = useState<string>('health-check');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [requestForm, setRequestForm] = useState({
    company: '',
    module: '',
    painPoints: '',
    timeline: '',
    preferredTime: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const selectedModule = CONSULTING_MODULES.find(m => m.id === activeModule);
  const filteredConsultants = tierFilter === 'all'
    ? CONSULTANTS
    : CONSULTANTS.filter(c => c.tier === tierFilter);

  const tabs = [
    { id: 'overview', label: '服務總覽', icon: BookOpen },
    { id: 'modules', label: '諮詢模組', icon: Package },
    { id: 'consultants', label: '顧問配對', icon: Users },
    { id: 'requests', label: '我的預約', icon: Calendar },
    { id: 'addons', label: '加購市集', icon: Zap },
  ] as const;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 4000);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">顧問服務中心</h1>
                <p className="text-sm text-slate-500">Consulting Service Portal</p>
              </div>
            </div>
            <p className="text-slate-600 text-sm max-w-2xl leading-relaxed">
              協助您把永續工作轉化為<strong>可交付、可追蹤、可複製</strong>的成果，降低客戶問卷、投標與揭露的風險與時間成本。
            </p>
          </div>
          <div className="flex gap-3">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold text-emerald-600">1hr</p>
              <p className="text-xs text-slate-500">規格內免費諮詢</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold text-blue-600">5</p>
              <p className="text-xs text-slate-500">諮詢模組</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold text-amber-600">3</p>
              <p className="text-xs text-slate-500">服務層級</p>
            </div>
          </div>
        </div>

        {/* Risk Disclaimer */}
        <div className="mt-4 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertTriangle size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-700 leading-relaxed">
            <strong>服務聲明：</strong>我們提供方法、框架與輔導，不保證特定得標、認證通過或法遵結果。
            所有對外宣稱內容需經內部審核，以避免漂綠風險。可量化承諾：會後行動項目、Roadmap、框架與模板。
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-slate-100 rounded-xl p-1 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─── Tab: Overview ─────────────────────────────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 3-Layer Architecture */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
              <BarChart3 size={18} className="text-emerald-600" />
              三層服務架構
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  layer: 'A',
                  name: '企業健檢',
                  desc: '同一套題庫貫穿 BD → 課程 → 結業後，形成企業永續缺口診斷基準',
                  color: 'from-blue-500 to-indigo-600',
                  items: ['自評題庫', '雷達圖分析', '90 天 Roadmap'],
                },
                {
                  layer: 'B',
                  name: '平台工具',
                  desc: '揭露填寫、商情風險偵測、中控儀表板，讓永續任務可視化',
                  color: 'from-emerald-500 to-teal-600',
                  items: ['揭露框架填寫', '資料清單管理', '任務里程碑追蹤'],
                },
                {
                  layer: 'C',
                  name: '顧問諮詢',
                  desc: '配對/輪值顧問加購制度，把工具與方法實際用起來',
                  color: 'from-amber-500 to-orange-600',
                  items: ['輪值顧問 1:1', '文件批註服務', '會後行動項目'],
                },
              ].map(l => (
                <div key={l.layer} className="rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                  <div className={`bg-gradient-to-r ${l.color} px-5 py-4`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white/60 text-xs font-semibold">LAYER {l.layer}</span>
                    </div>
                    <h3 className="text-white font-bold text-lg">{l.name}</h3>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-sm text-slate-500 leading-relaxed mb-3">{l.desc}</p>
                    <ul className="space-y-1.5">
                      {l.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-slate-700">
                          <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Spec: Included vs Add-on */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-2xl border-2 border-emerald-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={20} className="text-emerald-600" />
                <h3 className="font-bold text-emerald-800 text-lg">規格內（免費）</h3>
              </div>
              <p className="text-sm text-emerald-700 mb-4">對象：完成結業條件之學員</p>
              <ul className="space-y-2.5">
                {[
                  '健檢題庫使用權（同一套題庫）',
                  '平台使用權（依課程版本逐步開放）',
                  '免費顧問諮詢時數：每位學員 1 小時',
                  '形式：線上會議（輪值顧問）',
                  '輸出：會後重點 + Top 3 行動項目 + 下一步建議',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-emerald-700">
                    <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-50 rounded-2xl border-2 border-amber-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={20} className="text-amber-600" />
                <h3 className="font-bold text-amber-800 text-lg">規格外（加購）</h3>
              </div>
              <p className="text-sm text-amber-700 mb-4">對象：需要深度落地之學員或企業</p>
              <ul className="space-y-2.5">
                {[
                  '平台嚴選專家（如 Tino、資深顧問）',
                  '代做/多次會議/產出文件服務',
                  '按小時或專案計價（業務報價）',
                  '平台與顧問依合作條件分潤',
                  '客戶問卷/標案緊急回覆包',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                    <ArrowRight size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-600" />
              中控儀表板預覽
            </h2>
            <p className="text-sm text-slate-500 mb-5">「你會清楚看到：我做到哪、缺什麼、下一步做什麼，並可匯出可交付文件框架。」</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: 'Roadmap 完成率', value: '33%', color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: '資料齊備度', value: '58%', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                { label: '揭露章節就緒', value: '42%', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                { label: '風險等級', value: '中', color: 'text-amber-600', bg: 'bg-amber-50' },
                { label: '顧問時數剩餘', value: '30 分', color: 'text-teal-600', bg: 'bg-teal-50' },
                { label: '待辦任務', value: '4 項', color: 'text-red-500', bg: 'bg-red-50' },
              ].map((m, i) => (
                <div key={i} className={`${m.bg} rounded-xl p-3 text-center`}>
                  <p className={`text-2xl font-bold ${m.color}`}>{m.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab: Modules ──────────────────────────────────────────────────── */}
      {activeTab === 'modules' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            {CONSULTING_MODULES.map(module => (
              <ModuleCard
                key={module.id}
                module={module}
                isActive={activeModule === module.id}
                onClick={() => setActiveModule(module.id)}
              />
            ))}
          </div>
          {selectedModule && (
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 h-fit">
              <div className="flex items-start gap-4 mb-6">
                <span className="text-4xl">{selectedModule.icon}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-slate-800">
                      模組 {selectedModule.index}：{selectedModule.name}
                    </h2>
                    {selectedModule.isIncluded ? (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-semibold">規格內</span>
                    ) : (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold">加購</span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 italic">{selectedModule.nameEn}</p>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed mb-6">{selectedModule.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-700 text-sm mb-3 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    交付物
                  </h3>
                  <ul className="space-y-2">
                    {selectedModule.deliverables.map((d, i) => (
                      <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="font-semibold text-slate-700 text-sm mb-3 flex items-center gap-2">
                    <Target size={16} className="text-blue-500" />
                    服務細節
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">典型交付物</span>
                      <span className="text-slate-700 font-medium">{selectedModule.typicalOutput}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">適用時點</span>
                      <span className="text-slate-700 font-medium">{selectedModule.applicableTiming}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">標準時長</span>
                      <span className="text-slate-700 font-medium">{selectedModule.duration}</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('requests')}
                className="w-full py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
              >
                預約此模組諮詢
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─── Tab: Consultants ──────────────────────────────────────────────── */}
      {activeTab === 'consultants' && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2">
              <Filter size={15} className="text-slate-400" />
              <select
                value={tierFilter}
                onChange={e => setTierFilter(e.target.value)}
                className="text-sm text-slate-700 bg-transparent outline-none"
              >
                <option value="all">全部顧問</option>
                <option value="rotating">輪值顧問（規格內）</option>
                <option value="expert">嚴選專家（加購）</option>
                <option value="senior">資深顧問（加購）</option>
              </select>
            </div>
            <div className="text-sm text-slate-500">
              共 {filteredConsultants.length} 位顧問
            </div>
          </div>

          {/* Matching Logic Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <Users size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold text-blue-800 mb-1">配對三元素機制</p>
              <p className="text-xs text-blue-600">
                <strong>痛點模組</strong> × <strong>產業別</strong> × <strong>可用時段</strong>
                —— 系統自動依您的事前收集表分配最適合的輪值顧問，專家配對需額外申請。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredConsultants.map(c => (
              <ConsultantCard key={c.id} consultant={c} />
            ))}
          </div>
        </div>
      )}

      {/* ─── Tab: My Requests ──────────────────────────────────────────────── */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          {/* Request Form */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
              <MessageSquare size={18} className="text-emerald-600" />
              提交諮詢需求
            </h2>
            <p className="text-sm text-slate-500 mb-5">系統將依您填寫的資訊自動配對最適合的輪值顧問</p>

            {formSubmitted && (
              <div className="mb-4 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-emerald-800">需求提交成功！</p>
                  <p className="text-xs text-emerald-600">顧問團隊將於 1 個工作天內與您確認預約時段。</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">公司名稱 *</label>
                <input
                  type="text"
                  required
                  value={requestForm.company}
                  onChange={e => setRequestForm({ ...requestForm, company: e.target.value })}
                  placeholder="台灣精密科技股份有限公司"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">諮詢模組 *</label>
                <select
                  required
                  value={requestForm.module}
                  onChange={e => setRequestForm({ ...requestForm, module: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-400 transition-all"
                >
                  <option value="">請選擇模組</option>
                  {CONSULTING_MODULES.map(m => (
                    <option key={m.id} value={m.name}>{m.index}. {m.name} {m.isIncluded ? '（規格內）' : '（加購）'}</option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">主要痛點描述 *</label>
                <textarea
                  required
                  value={requestForm.painPoints}
                  onChange={e => setRequestForm({ ...requestForm, painPoints: e.target.value })}
                  placeholder="例如：不知從哪個指標開始、客戶要求 ESG 問卷無法回覆、報告書內容擔心漂綠風險..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-400 resize-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">交付期限</label>
                <input
                  type="date"
                  value={requestForm.timeline}
                  onChange={e => setRequestForm({ ...requestForm, timeline: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">偏好時段</label>
                <input
                  type="text"
                  value={requestForm.preferredTime}
                  onChange={e => setRequestForm({ ...requestForm, preferredTime: e.target.value })}
                  placeholder="例如：週二、四下午 2-5PM"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-400 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors flex items-center gap-2"
                >
                  提交諮詢需求
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </div>

          {/* Existing Requests */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" />
              預約記錄
            </h2>
            <div className="space-y-4">
              {MOCK_REQUESTS.map(req => {
                const consultant = CONSULTANTS.find(c => c.id === req.assignedConsultant);
                return (
                  <div key={req.id} className="border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-800 text-sm">{req.company}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getStatusColor(req.status)}`}>
                            {getStatusLabel(req.status)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          模組：{req.module} · 提交於 {new Date(req.createdAt).toLocaleDateString('zh-TW')}
                        </p>
                      </div>
                      {consultant && (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
                            {consultant.avatar}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-700">{consultant.name}</p>
                            <p className="text-xs text-slate-400">{getTierLabel(consultant.tier)}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {req.actionItems && req.actionItems.length > 0 && (
                      <div className="bg-emerald-50 rounded-lg p-3">
                        <p className="text-xs font-semibold text-emerald-700 mb-2">📋 會後行動項目</p>
                        <ul className="space-y-1">
                          {req.actionItems.map((item, i) => (
                            <li key={i} className="text-xs text-emerald-600 flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab: Add-ons ──────────────────────────────────────────────────── */}
      {activeTab === 'addons' && (
        <div className="space-y-5">
          <div className="bg-slate-800 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Zap size={20} className="text-amber-400" />
              <h2 className="text-lg font-bold">加購市集 Marketplace</h2>
            </div>
            <p className="text-slate-300 text-sm">
              由平台嚴選專家提供深度落地服務，按小時或專案計價。平台與顧問依合作條件分潤（6/4、7/3 等）。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ADDON_SERVICES.map(service => (
              <AddOnCard key={service.id} service={service} />
            ))}
          </div>

          {/* Decision Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Award size={18} className="text-amber-600" />
              決策對齊清單（內部用）
            </h2>
            <div className="space-y-3">
              {[
                { q: '規格內免費時數', detail: '每人 1 小時是否確定？可否拆成 2×30 分？' },
                { q: '結業條件定義', detail: '什麼叫完成？（出席率/作業/測驗/專題）' },
                { q: '規格外加購定價', detail: '按小時 or 專案包？由誰定價？' },
                { q: '分潤區間', detail: '平台/顧問/引薦方（7/3、6/4）如何定？' },
                { q: '平台揭露功能開放', detail: '招生期間可說到哪個程度（示意圖/截圖是否提供）' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{item.q}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConsultingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ConsultingContent />
    </Suspense>
  );
}