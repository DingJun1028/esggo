'use client';

import React, { useState } from 'react';
// framer-motion 已移除，改用原生 CSS transition 避免 SSR 崩潰
import {
  LucideIcon,
  Users,
  Globe,
  Building2,
  Leaf,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Play,
  Target,
  Award,
  BarChart3,
  TrendingUp,
  Zap,
  Clock,
  MessageSquare,
  Link as Handshake,
  Factory,
  GraduationCap,
  Landmark,
  Star,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';

/* ─── Types ─── */
interface Partner {
  id: string;
  name: string;
  type: 'supplier' | 'government' | 'ngo' | 'academic' | 'industry';
  description: string;
  icon: string;
  status: 'active' | 'pending' | 'invited';
  esgScore: number;
  collaboration: string[];
}

interface CollaborationArea {
  id: string;
  subtitle?: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  benefits: string[];
  metrics: { label: string; value: string }[];
}

/* ─── Data ─── */
const PARTNERS: Partner[] = [
  {
    id: 'partner-001',
    name: '供應商 A',
    type: 'supplier',
    description: '主要原材料供應商',
    icon: '🏭',
    status: 'active',
    esgScore: 92,
    collaboration: ['數據共享', '聯合稽核', '減排計劃'],
  },
  {
    id: 'partner-002',
    name: '供應商 B',
    type: 'supplier',
    description: '製造合作夥伴',
    icon: '⚙️',
    status: 'active',
    esgScore: 78,
    collaboration: ['數據共享', '風險評估'],
  },
  {
    id: 'partner-003',
    name: '環保局',
    type: 'government',
    description: '政府環保部門',
    icon: '🏛️',
    status: 'active',
    esgScore: 95,
    collaboration: ['政策對接', '合規指導', '補助申請'],
  },
  {
    id: 'partner-004',
    name: '綠色和平',
    type: 'ngo',
    description: '國際環保組織',
    icon: '🌿',
    status: 'pending',
    esgScore: 88,
    collaboration: ['項目合作', '認證審核'],
  },
  {
    id: 'partner-005',
    name: '台灣大學',
    type: 'academic',
    description: '學術研究機構',
    icon: '🎓',
    status: 'active',
    esgScore: 90,
    collaboration: ['研究合作', '人才培育', '技術開發'],
  },
  {
    id: 'partner-006',
    name: '產業協會',
    type: 'industry',
    description: '行業協會',
    icon: '🏢',
    status: 'active',
    esgScore: 85,
    collaboration: ['標準制定', '行業報告', '最佳實踐'],
  },
];

const COLLABORATION_AREAS: CollaborationArea[] = [
  {
    id: 'area-01',
    title: '數據共享',
    subtitle: 'Data Sharing',
    description: '與供應鏈夥伴安全共享 ESG 數據，實現透明化的供應鏈管理。',
    icon: BarChart3,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    benefits: ['即時數據同步', '安全數據交換', '權限管理', '審計追蹤'],
    metrics: [
      { label: '數據共享率', value: '95%' },
      { label: '夥伴滿意度', value: '4.8/5' },
    ],
  },
  {
    id: 'area-02',
    title: '聯合稽核',
    subtitle: 'Joint Audit',
    description: '與合作夥伴進行聯合 ESG 稽核，降低稽核成本，提高稽核效率。',
    icon: ShieldCheck,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    benefits: ['稽核成本降低 50%', '稽核效率提升 3x', '數據一致性', '風險共同承擔'],
    metrics: [
      { label: '稽核成本', value: '-50%' },
      { label: '稽核效率', value: '+3x' },
    ],
  },
  {
    id: 'area-03',
    title: '減排計劃',
    subtitle: 'Emission Reduction',
    description: '與供應鏈夥伴共同制定和執行減排計劃，實現碳中和目標。',
    icon: Leaf,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    benefits: ['共同減排目標', '技術共享', '碳配額交易', '碳中和路徑'],
    metrics: [
      { label: '減排目標', value: '30%' },
      { label: '碳配額', value: '$5M' },
    ],
  },
  {
    id: 'area-04',
    title: '標準制定',
    subtitle: 'Standard Setting',
    description: '與行業協會和學術機構共同制定 ESG 行業標準。',
    icon: Award,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    benefits: ['行業標準制定', '最佳實踐分享', '國際標準對接', '政策影響'],
    metrics: [
      { label: '標準制定', value: '3 項' },
      { label: '行業影響', value: 'Top 5' },
    ],
  },
];

const ALLIANCE_STATS = [
  { label: '合作夥伴', value: '50+', description: '活躍夥伴', icon: Users, color: 'text-blue-600' },
  {
    label: '數據共享率',
    value: '95%',
    description: '即時同步',
    icon: BarChart3,
    color: 'text-emerald-600',
  },
  {
    label: '聯合稽核',
    value: '20+',
    description: '次/年',
    icon: ShieldCheck,
    color: 'text-cyan-600',
  },
  { label: '減排協作', value: '30%', description: '共同減排', icon: Leaf, color: 'text-green-600' },
];

const PARTNER_TYPES = [
  { type: 'supplier', label: '供應商', icon: '🏭', count: 250, color: 'bg-blue-500' },
  { type: 'government', label: '政府機構', icon: '🏛️', count: 15, color: 'bg-emerald-500' },
  { type: 'ngo', label: 'NGO', icon: '🌿', count: 20, color: 'bg-green-500' },
  { type: 'academic', label: '學術機構', icon: '🎓', count: 30, color: 'bg-violet-500' },
  { type: 'industry', label: '行業協會', icon: '🏢', count: 10, color: 'bg-amber-500' },
];

const COLLABORATION_FLOW = [
  {
    step: '01',
    title: '夥伴邀請',
    description: '邀請合作夥伴加入聯盟',
    icon: Users,
    color: 'text-blue-600',
  },
  {
    step: '02',
    title: '協議簽署',
    description: '簽署數據共享與協作協議',
    icon: Handshake,
    color: 'text-emerald-600',
  },
  {
    step: '03',
    title: '數據對接',
    description: '建立數據連接與同步機制',
    icon: BarChart3,
    color: 'text-violet-600',
  },
  {
    step: '04',
    title: '聯合稽核',
    description: '進行聯合 ESG 稽核',
    icon: ShieldCheck,
    color: 'text-amber-600',
  },
  {
    step: '05',
    title: '協作執行',
    description: '執行減排計劃與標準制定',
    icon: Leaf,
    color: 'text-green-600',
  },
  {
    step: '06',
    title: '成果共享',
    description: '共享協作成果與最佳實踐',
    icon: Award,
    color: 'text-rose-600',
  },
];

/* ─── Components ─── */

function PartnerCard({ partner }: { partner: Partner }) {
  const typeConfig = {
    supplier: { label: '供應商', color: 'bg-blue-50 text-blue-600' },
    government: { label: '政府', color: 'bg-emerald-50 text-emerald-600' },
    ngo: { label: 'NGO', color: 'bg-green-50 text-green-600' },
    academic: { label: '學術', color: 'bg-violet-50 text-violet-600' },
    industry: { label: '行業', color: 'bg-amber-50 text-amber-600' },
  };
  const type = typeConfig[partner.type];

  // 使用原生 div + CSS transition 取代 motion.div，避免 SSR 崩潰
  return (
    <div
      style={{ transition: 'all 0.4s ease' }}
      className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{partner.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h4 className="text-sm font-bold text-[#003262]">{partner.name}</h4>
            <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded', type.color)}>
              {type.label}
            </span>
          </div>
          <p className="text-[10px] text-slate-400">{partner.description}</p>
        </div>
        <Badge
          variant={
            partner.status === 'active'
              ? 'success'
              : partner.status === 'pending'
              ? 'warning'
              : 'secondary'
          }
          size="xs"
        >
          {partner.status === 'active' ? '活躍' : partner.status === 'pending' ? '待定' : '已邀請'}
        </Badge>
      </div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-[#003262]">{partner.esgScore}</span>
          <span className="text-[9px] text-slate-400">ESG</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {partner.collaboration.map((item) => (
          <span key={item} className="text-[9px] px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function AreaCard({ area, index }: { area: CollaborationArea; index: number }) {
  const Icon = area.icon;
  // 使用原生 div + CSS transition 取代 motion.div，避免 SSR 崩潰
  return (
    <div
      style={{ transition: 'all 0.4s ease' }}
      className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', area.bgColor)}>
          <Icon size={20} className={area.color} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#003262]">{area.title}</h3>
          <p className="text-[9px] text-slate-400">{area.subtitle}</p>
        </div>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed mb-3">{area.description}</p>
      <div className="space-y-1.5 mb-3">
        {area.benefits.map((benefit, i) => (
          <div key={i} className="flex items-center gap-2">
            <CheckCircle2 size={10} className="text-emerald-500 shrink-0" />
            <span className="text-[10px] text-slate-600">{benefit}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {area.metrics.map((metric) => (
          <div key={metric.label} className="bg-slate-50 rounded-lg p-2 text-center">
            <p className="text-sm font-black text-[#003262]">{metric.value}</p>
            <p className="text-[8px] text-slate-400">{metric.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowStep({ step, index }: { step: (typeof COLLABORATION_FLOW)[0]; index: number }) {
  const Icon = step.icon;
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200">
          <Icon size={16} className={step.color} />
        </div>
        {index < COLLABORATION_FLOW.length - 1 && <div className="w-0.5 h-6 bg-slate-200 mt-2" />}
      </div>
      <div className="pt-2">
        <h4 className="text-xs font-bold text-[#003262]">{step.title}</h4>
        <p className="text-[10px] text-slate-400">{step.description}</p>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function AllianceCollaborationPage() {
  const [activeTab, setActiveTab] = useState<'partners' | 'areas' | 'flow'>('partners');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPartners = PARTNERS.filter(
    (p) => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activePartners = PARTNERS.filter((p) => p.status === 'active').length;
  const avgScore = Math.round(PARTNERS.reduce((sum, p) => sum + p.esgScore, 0) / PARTNERS.length);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl breathing-glow-emerald" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg breathing-glow-emerald">
                <Handshake size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">聯盟協作</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Alliance Collaboration · 供應鏈夥伴 · 產業聯盟
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              通過 ESGGO
              聯盟協作平台，企業可以與供應鏈夥伴、政府機構、NGO、學術機構和行業協會建立協作關係，
              共同推動永續發展，實現碳中和目標。
            </p>
          </div>
        </header>

        {/* ─── Stats ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ALLIANCE_STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              /* 使用原生 div + CSS transition 取代 motion.div，避免 SSR 崩潰 */
              <div
                key={stat.label}
                style={{ transition: 'all 0.4s ease' }}
                className="bg-white rounded-xl border border-slate-100 p-4 text-center"
              >
                <Icon size={20} className={cn('mx-auto mb-2', stat.color)} />
                <p className="text-xl font-black text-[#003262]">{stat.value}</p>
                <p className="text-[10px] text-slate-400 font-medium">{stat.label}</p>
                <p className="text-[9px] text-slate-300 mt-0.5">{stat.description}</p>
              </div>
            );
          })}
        </div>

        {/* ─── Summary ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Users size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-black text-[#003262]">
                  {activePartners}/{PARTNERS.length}
                </p>
                <p className="text-[10px] text-slate-400">活躍夥伴</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Star size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-black text-[#003262]">{avgScore}</p>
                <p className="text-[10px] text-slate-400">平均 ESG 評分</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-50 rounded-lg">
                <Globe size={18} className="text-violet-600" />
              </div>
              <div>
                <p className="text-lg font-black text-[#003262]">5</p>
                <p className="text-[10px] text-slate-400">夥伴類型</p>
              </div>
            </div>
          </Card>
        </div>

        {/* ─── Partner Types ─── */}
        <div className="flex gap-2 flex-wrap">
          {PARTNER_TYPES.map((type) => (
            <div
              key={type.type}
              className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-100"
            >
              <span className="text-sm">{type.icon}</span>
              <span className="text-xs text-slate-600">{type.label}</span>
              <span className="text-xs font-bold text-[#003262]">{type.count}</span>
            </div>
          ))}
        </div>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2">
          {[
            { id: 'partners' as const, label: '合作夥伴', icon: Users, count: PARTNERS.length },
            {
              id: 'areas' as const,
              label: '協作領域',
              icon: Target,
              count: COLLABORATION_AREAS.length,
            },
            {
              id: 'flow' as const,
              label: '協作流程',
              icon: Handshake,
              count: COLLABORATION_FLOW.length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all',
                activeTab === tab.id
                  ? 'bg-[#003262] text-white shadow-md'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              )}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center',
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ─── Content ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* 使用條件渲染取代 AnimatePresence，避免 SSR 崩潰 */}
            {activeTab === 'partners' && (
              <div
                style={{ transition: 'all 0.4s ease' }}
                className="space-y-4"
              >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[#003262]">合作夥伴</h2>
                    <div className="relative">
                      <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="搜尋夥伴..."
                        className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/30 w-40"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPartners.map((partner) => (
                      <PartnerCard key={partner.id} partner={partner} />
                    ))}
                  </div>
              </div>
            )}

            {activeTab === 'areas' && (
              <div
                style={{ transition: 'all 0.4s ease' }}
                className="space-y-4"
              >
                  <div>
                    <h2 className="text-lg font-bold text-[#003262] mb-1">協作領域</h2>
                    <p className="text-xs text-slate-400">與合作夥伴的共同協作領域</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {COLLABORATION_AREAS.map((area, i) => (
                      <AreaCard key={area.id} area={area} index={i} />
                    ))}
                  </div>
              </div>
            )}

            {activeTab === 'flow' && (
              <div
                style={{ transition: 'all 0.4s ease' }}
              >
                  <Card className="p-5">
                    <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                      <Handshake size={14} className="text-emerald-500" />
                      協作流程
                    </h3>
                    <div className="space-y-2">
                      {COLLABORATION_FLOW.map((step, i) => (
                        <FlowStep key={i} step={step} index={i} />
                      ))}
                    </div>
                  </Card>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Partner Distribution */}
            <Card className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3">夥伴分佈</h3>
              <div className="space-y-2">
                {PARTNER_TYPES.map((type) => (
                  <div key={type.type} className="flex items-center gap-2">
                    <span className="text-sm">{type.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] text-slate-600">{type.label}</span>
                        <span className="text-[10px] font-bold text-[#003262]">{type.count}</span>
                      </div>
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn('h-full rounded-full', type.color)}
                          style={{ width: `${(type.count / 325) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activities */}
            <Card className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3">近期活動</h3>
              <div className="space-y-2">
                {[
                  { action: '供應商 A 完成 ESG 數據上傳', time: '2 小時前', icon: '📤' },
                  { action: '與環保局完成政策對接', time: '1 天前', icon: '🏛️' },
                  { action: '台灣大學研究合作協議簽署', time: '3 天前', icon: '🎓' },
                  { action: '產業協會標準制定會議', time: '1 週前', icon: '🏢' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg">
                    <span className="text-sm">{activity.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-slate-600">{activity.action}</p>
                      <p className="text-[9px] text-slate-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* CTA */}
            <Card className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <h3 className="text-sm font-bold text-[#003262] mb-2">邀請合作夥伴</h3>
              <p className="text-[11px] text-slate-500 mb-3">
                邀請供應鏈夥伴加入聯盟，共同推動永續發展
              </p>
              <Button
                variant="primary"
                size="sm"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                發送邀請
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
