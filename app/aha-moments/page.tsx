'use client';

import React, { useState } from 'react';

import {
  LucideIcon,
  Lightbulb,
  Zap,
  TrendingUp,
  ShieldCheck,
  Eye,
  Star,
  ArrowRight,
  CheckCircle2,
  Clock,
  Target,
  Award,
  Users,
  Leaf,
  Globe,
  BarChart3,
  Sparkles,
  Heart,
  Rocket,
  ChevronDown,
  ChevronRight,
  Play,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/v2/Card';
import { Badge } from '@/components/ui/v2/Input';
import { Button } from '@/components/ui/v2/Button';

/* ─── Types ─── */
interface AhaMoment {
  id: string;
  day: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  quote: string;
  quoteAuthor: string;
  impact: string;
  metrics: { label: string; value: string; trend?: string }[];
  features: string[];
  userSegment: string;
}

/* ─── Data ─── */
const AHA_MOMENTS: AhaMoment[] = [
  {
    id: 'aha-01',
    day: 'Day 3',
    title: '首次 AI 洞察',
    subtitle: '發現隱藏的碳排熱點',
    description:
      '當用戶第一次看到 AI 自動分析出的碳排熱點時，他們會驚訝地發現自己從未注意到的數據模式。這不是簡單的數字，而是可行動的洞察。',
    icon: Lightbulb,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    quote: '「我從來不知道我們的物流碳排佔比這麼高！AI 的洞察讓我們找到了最大的減排機會。」',
    quoteAuthor: '某製造業 CSO',
    impact: '用戶開始主動探索數據，平均停留時間增加 300%',
    metrics: [
      { label: '洞察發現率', value: '89%' },
      { label: '用戶參與度', value: '+300%' },
      { label: '回訪率', value: '92%' },
    ],
    features: ['AI 碳排熱點識別', '自動化數據分析', '可行動建議生成'],
    userSegment: '所有用戶',
  },
  {
    id: 'aha-02',
    day: 'Day 7',
    title: '5T 驗證通過',
    subtitle: '數據獲得「不可篡改」認證',
    description:
      '當用戶第一次看到自己的數據通過 5T 協議驗證，獲得 Hash Lock 封印時，他們會感受到數據從「普通」變成「可信」的轉變。',
    icon: ShieldCheck,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    quote: '「看到那個綠色的 Trustworthy 標誌，我知道我們的數據現在是真正可信的。」',
    quoteAuthor: '某金融業 CFO',
    impact: '用戶對平台的信任度大幅提升，付費轉化率提高 45%',
    metrics: [
      { label: '驗證通過率', value: '98.5%' },
      { label: '信任度提升', value: '+45%' },
      { label: '付費轉化', value: '+32%' },
    ],
    features: ['5T 協議自動驗證', 'ZKP 證明生成', 'Hash Lock 封印'],
    userSegment: '數據管理員',
  },
  {
    id: 'aha-03',
    day: 'Day 14',
    title: '一鍵生成報告',
    subtitle: '15 分鐘完成過去 3 個月的工作',
    description:
      '當用戶第一次使用 AI 自動生成永續報告時，他們會被速度和品質震驚。過去需要數週的工作，現在只需 15 分鐘。',
    icon: Zap,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    quote: '「我花了 3 個月寫的報告，AI 在 15 分鐘內完成了，而且品質更好！」',
    quoteAuthor: '某中小企業 ESG 專員',
    impact: '用戶開始依賴平台進行報告生成，月活躍率提升 60%',
    metrics: [
      { label: '報告生成速度', value: '15 分鐘', trend: '-95%' },
      { label: '用戶滿意度', value: '4.8/5' },
      { label: '月活躍率', value: '+60%' },
    ],
    features: ['AI 自動撰寫', '多框架支持', '一鍵導出'],
    userSegment: 'ESG 專員、顧問',
  },
  {
    id: 'aha-04',
    day: 'Day 21',
    title: '供應鏈風險可視化',
    subtitle: '第一次「看見」供應鏈的全貌',
    description:
      '當用戶第一次在 War Room 中看到供應鏈的 3D 風險地圖時，他們會直觀地理解供應鏈的複雜性和潛在風險。',
    icon: Eye,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    quote: '「原來我們的供應鏈有這麼多隱藏風險！現在我可以在問題發生前就採取行動。」',
    quoteAuthor: '某零售業供應鏈總監',
    impact: '用戶開始主動管理供應鏈風險，風險事件減少 40%',
    metrics: [
      { label: '風險識別率', value: '89%' },
      { label: '風險事件減少', value: '-40%' },
      { label: '決策速度', value: '+5x' },
    ],
    features: ['3D 供應鏈地圖', '即時風險評估', 'PESTEL 分析'],
    userSegment: '供應鏈管理者',
  },
  {
    id: 'aha-05',
    day: 'Day 30',
    title: '社群共鳴',
    subtitle: '發現自己不是孤獨的 ESG 實踐者',
    description:
      '當用戶第一次在社群村落中分享自己的 ESG 經驗，並獲得其他用戶的共鳴和支持時，他們會感受到歸屬感。',
    icon: Heart,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    quote: '「原來有這麼多人在做同樣的事！我從社群學到了很多實用的技巧。」',
    quoteAuthor: '某中小企業主',
    impact: '用戶留存率大幅提升，社群活躍度增加 200%',
    metrics: [
      { label: '社群活躍度', value: '+200%' },
      { label: '用戶留存率', value: '85%' },
      { label: 'UGC 內容', value: '1,247 篇' },
    ],
    features: ['社群動態', '經驗分享', '問答互動'],
    userSegment: '所有用戶',
  },
  {
    id: 'aha-06',
    day: 'Day 60',
    title: '柏克萊認證',
    subtitle: '獲得國際認可的 ESG 專業認證',
    description:
      '當用戶完成所有課程並獲得 Berkeley Haas 與 TSISDA 聯合認證時，他們的專業能力得到了國際認可。',
    icon: Award,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    quote: '「這張認證讓我在職場上更有信心，也證明了我們在 ESG 方面的專業能力。」',
    quoteAuthor: '某企業永續經理',
    impact: '用戶成為平台的品牌大使，推薦轉化率提高 35%',
    metrics: [
      { label: '認證通過率', value: '95%' },
      { label: '推薦轉化率', value: '+35%' },
      { label: '職業提升', value: '78%' },
    ],
    features: ['柏克萊課程', 'TSISDA 認證', '區塊鏈證書'],
    userSegment: '專業人士',
  },
];

const JOURNEY_STATS = [
  {
    label: '平均 Aha 時刻',
    value: '3.2 次',
    description: '每位用戶在使用過程中',
    icon: Sparkles,
    color: 'text-amber-600',
  },
  {
    label: '首次洞察時間',
    value: 'Day 3',
    description: '從註冊到首次 AI 洞察',
    icon: Clock,
    color: 'text-cyan-600',
  },
  {
    label: '報告生成時間',
    value: '15 分鐘',
    description: '從數據到完整報告',
    icon: Zap,
    color: 'text-violet-600',
  },
  {
    label: '用戶滿意度',
    value: '4.8/5',
    description: '基於 Aha 時刻體驗',
    icon: Star,
    color: 'text-rose-600',
  },
];

/* ─── Components ─── */

function AhaMomentCard({
  moment,
  index,
  isExpanded,
  onToggle,
}: {
  moment: AhaMoment;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const Icon = moment.icon;

  return (
    <div
      className="relative"
    >
      {/* Timeline Line */}
      {index < AHA_MOMENTS.length - 1 && (
        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-amber-200 to-rose-200 z-0" />
      )}

      <div className="relative z-10">
        <button
          onClick={onToggle}
          className={cn(
            'w-full bg-white rounded-2xl border p-5 text-left hover:shadow-lg transition-all',
            isExpanded ? 'border-amber-200 shadow-md' : 'border-slate-100'
          )}
        >
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 relative',
                moment.bgColor
              )}
            >
              <Icon size={24} className={moment.color} />
              {isExpanded && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white" />
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={cn(
                    'text-[10px] font-bold px-2 py-0.5 rounded-full',
                    moment.bgColor,
                    moment.color
                  )}
                >
                  {moment.day}
                </span>
                <span className="text-[10px] text-slate-400">{moment.userSegment}</span>
              </div>
              <h3 className="text-base font-bold text-[#003262]">{moment.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{moment.subtitle}</p>
            </div>

            {isExpanded ? (
              <ChevronDown size={16} className="text-slate-400 shrink-0" />
            ) : (
              <ChevronRight size={16} className="text-slate-400 shrink-0" />
            )}
          </div>
        </button>

        
          {isExpanded && (
            <div
              className="overflow-hidden"
            >
              <div className="bg-white rounded-b-2xl border border-t-0 border-slate-100 p-5 -mt-2 space-y-4">
                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed">{moment.description}</p>

                {/* Quote */}
                <div className="bg-slate-50 rounded-xl p-4 border-l-4 border-amber-400">
                  <p className="text-sm text-slate-700 italic mb-2">{moment.quote}</p>
                  <p className="text-[10px] text-slate-400 font-medium">— {moment.quoteAuthor}</p>
                </div>

                {/* Impact */}
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-emerald-500" />
                  <span className="text-xs text-emerald-600 font-medium">{moment.impact}</span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2">
                  {moment.metrics.map((metric) => (
                    <div key={metric.label} className="text-center p-2 bg-slate-50 rounded-lg">
                      <p className="text-base font-black text-[#003262]">{metric.value}</p>
                      <p className="text-[9px] text-slate-400">{metric.label}</p>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div>
                  <h4 className="text-xs font-bold text-slate-600 mb-2">相關功能</h4>
                  <div className="flex flex-wrap gap-2">
                    {moment.features.map((feature) => (
                      <span
                        key={feature}
                        className="text-[10px] px-2 py-1 bg-cyan-50 text-cyan-600 rounded-full font-medium"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function AhaMomentsPage() {
  const [expandedMoment, setExpandedMoment] = useState<string | null>('aha-01');

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1000px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-50 rounded-full blur-3xl breathing-glow-amber" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg breathing-glow-amber">
                <Sparkles size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">Aha Moment</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">頓悟時刻 · 用戶體驗里程碑</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              Aha Moment 是用戶在使用產品過程中，突然理解產品價值的關鍵時刻。
              這些時刻不僅讓用戶感受到產品的價值，更促使他們成為活躍用戶和品牌大使。
            </p>
          </div>
        </header>

        {/* ─── Stats ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {JOURNEY_STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
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

        {/* ─── Aha Moments Timeline ─── */}
        <div>
          <h2 className="text-lg font-bold text-[#003262] mb-4 flex items-center gap-2">
            <Lightbulb size={18} className="text-amber-500" />6 個關鍵頓悟時刻
          </h2>
          <div className="space-y-4">
            {AHA_MOMENTS.map((moment, i) => (
              <AhaMomentCard
                key={moment.id}
                moment={moment}
                index={i}
                isExpanded={expandedMoment === moment.id}
                onToggle={() => setExpandedMoment(expandedMoment === moment.id ? null : moment.id)}
              />
            ))}
          </div>
        </div>

        {/* ─── Design Principles ─── */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-[#003262] mb-4 flex items-center gap-2">
            <Target size={16} className="text-cyan-500" />
            Aha Moment 設計原則
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: '即時反饋',
                desc: '用戶操作後立即看到結果，不超過 3 秒',
                icon: Zap,
                color: 'text-amber-600',
              },
              {
                title: '個人化',
                desc: '根據用戶的行業和角色提供定制化洞察',
                icon: Users,
                color: 'text-blue-600',
              },
              {
                title: '可視化',
                desc: '複雜數據轉化為直觀的圖表和地圖',
                icon: Eye,
                color: 'text-emerald-600',
              },
              {
                title: '可行動',
                desc: '每個洞察都附帶具體的行動建議',
                icon: Rocket,
                color: 'text-violet-600',
              },
            ].map((principle) => {
              const Icon = principle.icon;
              return (
                <div
                  key={principle.title}
                  className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl"
                >
                  <div className="p-2 bg-white rounded-lg shrink-0">
                    <Icon size={16} className={principle.color} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#003262]">{principle.title}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{principle.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* ─── CTA ─── */}
        <Card className="p-6 text-center">
          <h3 className="text-lg font-bold text-[#003262] mb-2">準備體驗您的 Aha Moment？</h3>
          <p className="text-xs text-slate-400 mb-4">註冊即可在 Day 3 體驗首次 AI 洞察的驚喜</p>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              icon={<Rocket size={16} />}
              className="bg-[#003262] hover:bg-[#002244] text-white"
            >
              立即開始
            </Button>
            <Button variant="outline" size="md" icon={<Play size={16} />}>
              觀看演示
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
