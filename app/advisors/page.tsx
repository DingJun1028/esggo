'use client';
import { useState } from 'react';
import {
  Users, Star, Clock, CheckCircle, MessageCircle,
  Building2, Globe, Award, ChevronRight, Search,
  Shield, Zap, BarChart3, FileText, Plus, X,
  Calendar, Phone, Mail, MapPin, Filter
} from 'lucide-react';

interface Advisor {
  id: string;
  name: string;
  nameEn: string;
  title: string;
  org: string;
  country: string;
  avatar: string;
  expertise: string[];
  modules: string[];
  rating: number;
  sessions: number;
  available: boolean;
  fee: string;
  bio: string;
  tags: string[];
}

interface ConsultingRequest {
  id: string;
  advisorId: string;
  module: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  scheduledAt: string;
  notes: string;
}

const ADVISORS: Advisor[] = [
  {
    id: '1',
    name: '楊坤修 博士',
    nameEn: 'Dr. Kuen-Shiou Yang',
    title: '理事長',
    org: '台灣社會創新與永續發展協會 (TSISDA)',
    country: '台灣',
    avatar: 'YK',
    expertise: ['中小企業ESG轉型', 'GRI框架', '永續策略'],
    modules: ['健檢解讀', '揭露輔導', '1:1 Expert Hour'],
    rating: 4.9,
    sessions: 156,
    available: true,
    fee: '規格內免費 · 60分鐘/位',
    bio: '台灣社會創新與永續發展協會理事長，長期推動中小企業ESG轉型，與UC Berkeley Haas合作主持永續策略課程，具備豐富的GRI框架實務輔導經驗。',
    tags: ['GRI 2021', 'ESG轉型', '中小企業', '台灣在地'],
  },
  {
    id: '2',
    name: 'Ana Torres',
    nameEn: 'Ana Torres',
    title: 'Associate Director',
    org: 'Cleantech to Market (C2M), UC Berkeley',
    country: '美國',
    avatar: 'AT',
    expertise: ['清潔科技', '永續商業模式', '碳市場'],
    modules: ['資料盤點', '揭露輔導', '健檢解讀'],
    rating: 4.8,
    sessions: 98,
    available: true,
    fee: '規格外加購 · €150/小時',
    bio: 'UC Berkeley Haas清潔技術商業化計畫副主任，專注於協助企業將永續創新從概念落地成可交付、可規模化的商業成果。',
    tags: ['CleanTech', 'C2M', 'TCFD', '碳市場'],
  },
  {
    id: '3',
    name: 'Karin Li',
    nameEn: 'Karin Li',
    title: 'Behavioral Economist',
    org: 'Haas School of Business, UC Berkeley',
    country: '美國',
    avatar: 'KL',
    expertise: ['行為經濟學', 'ESG激勵設計', 'CBAM應對'],
    modules: ['客戶問卷/標案', '1:1 Expert Hour'],
    rating: 4.7,
    sessions: 73,
    available: false,
    fee: '規格外加購 · €180/小時',
    bio: '行為經濟學家，專長於設計有效的ESG行為激勵機制，協助企業應對CBAM碳邊境稅，並優化投標回覆策略。',
    tags: ['CBAM', '行為設計', '投標策略', '碳稅'],
  },
  {
    id: '4',
    name: 'Ann-Kristin Zobel',
    nameEn: 'Ann-Kristin Zobel',
    title: 'Associate Professor',
    org: 'University of St. Gallen',
    country: '瑞士',
    avatar: 'AZ',
    expertise: ['TCFD情境分析', '氣候財務風險', 'ISSB S2'],
    modules: ['揭露輔導', '資料盤點', '1:1 Expert Hour'],
    rating: 4.9,
    sessions: 112,
    available: true,
    fee: '規格外加購 · €200/小時',
    bio: '聖加侖大學管理學副教授，TCFD與ISSB S2氣候揭露領域專家，協助企業執行氣候情境分析並評估財務影響。',
    tags: ['TCFD', 'ISSB S2', '氣候情境', '財務揭露'],
  },
];

const MODULES = [
  { id: 'm1', name: '① 健檢解讀', desc: '解讀健檢結果、釐清缺口與優先序', output: 'Top3缺口 + 90天Roadmap', timing: '課前/課中/課後', color: '#003262' },
  { id: 'm2', name: '② 揭露輔導', desc: '揭露架構、章節建議、內容校準', output: '揭露大綱v1 + 章節清單', timing: '課中/課後', color: '#16a34a' },
  { id: 'm3', name: '③ 資料盤點', desc: '資料來源、權責、佐證邏輯', output: '資料清單模板 + RACI', timing: '課中', color: '#d97706' },
  { id: 'm4', name: '④ 客戶問卷/標案', desc: '拆解題目、回覆策略、風險提示', output: '回覆框架 + 缺口補件清單', timing: '課後/投標前', color: '#7c3aed' },
  { id: 'm5', name: '⑤ 1:1 Expert Hour', desc: '針對痛點解題、給下一步', output: '會後行動項目', timing: '任何時點', color: '#0369a1' },
];

const STATUS_CFG = {
  pending: { label: '待確認', color: '#d97706', bg: '#fef3c7' },
  confirmed: { label: '已排程', color: '#2563eb', bg: '#eff6ff' },
  completed: { label: '已完成', color: '#16a34a', bg: '#dcfce7' },
  cancelled: { label: '已取消', color: '#9ca3af', bg: '#f3f4f6' },
};

const MOCK_REQUESTS: ConsultingRequest[] = [
  { id: 'r1', advisorId: '1', module: '健檢解讀', status: 'completed', scheduledAt: '2026-05-15T10:00:00Z', notes: '已完成 Top3 缺口分析，生成 90 天改善路線圖。' },
  { id: 'r2', advisorId: '4', module: '揭露輔導', status: 'confirmed', scheduledAt: '2026-05-25T14:00:00Z', notes: '章節 3-5 揭露框架討論。' },
  { id: 'r3', advisorId: '2', module: '資料盤點', status: 'pending', scheduledAt: '2026-06-03T09:00:00Z', notes: '確認供應鏈 GRI 308 資料來源。' },
];

export default function AdvisorsPage() {
  const [activeTab, setActiveTab] = useState<'advisors' | 'modules' | 'bookings' | 'dashboard'>('advisors');
  const [search, setSearch] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [selectedModule, setSelectedModule] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [availFilter, setAvailFilter] = useState('all');

  const filtered = ADVISORS.filter(a => {
    if (availFilter === 'available' && !a.available) return false;
    if (search) {
      const q = search.toLowerCase();
      return a.name.toLowerCase().includes(q) ||
        a.org.toLowerCase().includes(q) ||
        a.expertise.some(e => e.toLowerCase().includes(q));
    }
    return true;
  });

  const tabs = [
    { id: 'advisors', label: '顧問陣容' },
    { id: 'modules', label: '服務模組' },
    { id: 'bookings', label: '我的預約' },
    { id: 'dashboard', label: '服務儀表板' },
  ] as const;

  const completedCount = MOCK_REQUESTS.filter(r => r.status === 'completed').length;

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #003262 0%, #1a4d7a 60%, #3b7ea1 100%)', borderRadius: '20px', padding: '28px 32px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(253,181,21,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-10px', left: '35%', width: '110px', height: '110px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '15px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={26} color="#FDB515" />
            </div>
            <div>
              <h1 style={{ fontSize: '22px', fontWeight: 900, color: 'white', lineHeight: 1 }}>顧問服務中心</h1>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>Advisory Council Zone · Berkeley Haas × TSISDA · 5大模組輔導</p>
            </div>
          </div>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {[
              { label: '認證顧問', value: ADVISORS.length, sub: '位', color: 'white' },
              { label: '可預約', value: ADVISORS.filter(a => a.available).length, sub: '位', color: '#86efac' },
              { label: '總諮詢場次', value: ADVISORS.reduce((a, b) => a + b.sessions, 0), sub: '場', color: '#FDB515' },
              { label: '平均評分', value: (ADVISORS.reduce((a, b) => a + b.rating, 0) / ADVISORS.length).toFixed(1), sub: '', color: '#93c5fd' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '11px', padding: '12px 14px', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}<span style={{ fontSize: '12px', marginLeft: '2px' }}>{s.sub}</span></div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginTop: '3px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: '#f3f4f6', padding: '4px', borderRadius: '10px', marginBottom: '20px', width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '8px 20px', borderRadius: '7px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', background: activeTab === t.id ? 'white' : 'transparent', color: activeTab === t.id ? '#003262' : '#6b7280', boxShadow: activeTab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none', whiteSpace: 'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── 顧問陣容 ── */}
      {activeTab === 'advisors' && (
        <>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '18px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋顧問姓名、專業領域…" style={{ width: '100%', paddingLeft: '32px', padding: '9px 12px 9px 32px', border: '1.5px solid #e5e7eb', borderRadius: '9px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: '4px', background: '#f3f4f6', padding: '3px', borderRadius: '8px' }}>
              {[{ k: 'all', l: '全部' }, { k: 'available', l: '可預約' }].map(f => (
                <button key={f.k} onClick={() => setAvailFilter(f.k)} style={{ padding: '6px 14px', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer', background: availFilter === f.k ? 'white' : 'transparent', color: availFilter === f.k ? '#003262' : '#6b7280', boxShadow: availFilter === f.k ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
                  {f.l}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {filtered.map(advisor => (
              <div key={advisor.id} style={{ background: 'white', borderRadius: '16px', border: '1.5px solid #e5e7eb', overflow: 'hidden', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,50,98,0.1)'; e.currentTarget.style.borderColor = '#003262'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ height: '4px', background: advisor.available ? 'linear-gradient(90deg, #003262, #22c55e)' : 'linear-gradient(90deg, #003262, #9ca3af)' }} />
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', alignItems: 'flex-start' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'linear-gradient(135deg, #003262, #3b7ea1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '16px', fontWeight: 800, flexShrink: 0 }}>
                      {advisor.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#1a1a2e', lineHeight: 1.2 }}>{advisor.name}</div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px' }}>{advisor.nameEn}</div>
                      <div style={{ fontSize: '12px', color: '#003262', fontWeight: 600, marginTop: '2px' }}>{advisor.title}</div>
                    </div>
                    <span style={{ padding: '3px 9px', borderRadius: '7px', fontSize: '11px', fontWeight: 700, background: advisor.available ? '#dcfce7' : '#f3f4f6', color: advisor.available ? '#16a34a' : '#9ca3af', flexShrink: 0 }}>
                      {advisor.available ? '可預約' : '已約滿'}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: '#6b7280', display: 'flex', alignItems: 'flex-start', gap: '5px', marginBottom: '10px' }}>
                    <Building2 size={11} style={{ flexShrink: 0, marginTop: '2px' }} />
                    {advisor.org}
                  </div>

                  <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5, marginBottom: '12px' }}>{advisor.bio}</p>

                  {/* Expertise Tags */}
                  <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '12px' }}>
                    {advisor.expertise.map(e => (
                      <span key={e} style={{ padding: '2px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: 600, background: '#f3f4f6', color: '#374151' }}>{e}</span>
                    ))}
                  </div>

                  {/* Modules */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#9ca3af', marginBottom: '6px' }}>可協助模組</div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {advisor.modules.map(m => (
                        <span key={m} style={{ padding: '2px 7px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, background: '#dbeafe', color: '#1d4ed8' }}>{m}</span>
                      ))}
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '14px', fontSize: '12px', color: '#6b7280' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={12} color="#FDB515" fill="#FDB515" />
                      <strong style={{ color: '#1a1a2e' }}>{advisor.rating}</strong>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MessageCircle size={12} />
                      {advisor.sessions} 場
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Globe size={12} />
                      {advisor.country}
                    </span>
                  </div>

                  {/* Fee & CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#9ca3af' }}>諮詢費用</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#003262' }}>{advisor.fee}</div>
                    </div>
                    <button
                      onClick={() => { setSelectedAdvisor(advisor); setShowBookingModal(true); }}
                      disabled={!advisor.available}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', background: advisor.available ? 'linear-gradient(135deg, #003262, #1a4d7a)' : '#e5e7eb', color: advisor.available ? 'white' : '#9ca3af', border: 'none', borderRadius: '9px', fontSize: '12px', fontWeight: 700, cursor: advisor.available ? 'pointer' : 'not-allowed' }}>
                      <Calendar size={12} />
                      {advisor.available ? '預約諮詢' : '已約滿'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── 服務模組 ── */}
      {activeTab === 'modules' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* 服務架構說明 */}
          <div style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #e5e7eb', padding: '22px 24px' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#1a1a2e', marginBottom: '10px' }}>🏗️ 服務架構（3層）</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { layer: 'Layer A', title: '企業健檢', desc: '同一套題庫貫穿 BD → 課程 → 結業後', icon: '🔍', color: '#003262' },
                { layer: 'Layer B', title: '平台工具', desc: '揭露 + 商情/風險偵測 + 中控儀表板', icon: '🛠️', color: '#16a34a' },
                { layer: 'Layer C', title: '顧問諮詢', desc: '配對/輪值/加購服務', icon: '👥', color: '#7c3aed' },
              ].map(l => (
                <div key={l.layer} style={{ padding: '14px 16px', borderRadius: '11px', border: `1.5px solid ${l.color}20`, background: `${l.color}06` }}>
                  <div style={{ fontSize: '18px', marginBottom: '6px' }}>{l.icon}</div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: l.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l.layer}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1a1a2e', marginTop: '3px' }}>{l.title}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280', lineHeight: 1.5, marginTop: '4px' }}>{l.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 5大模組 */}
          <div style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #e5e7eb', padding: '22px 24px' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#1a1a2e', marginBottom: '16px' }}>📦 5大服務模組（MECE）</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {MODULES.map((m, i) => (
                <div key={m.id} style={{ display: 'flex', gap: '14px', padding: '16px', borderRadius: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = m.color; e.currentTarget.style.background = `${m.color}06`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = '#f9fafb'; }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 800, flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e' }}>{m.name}</div>
                      <span style={{ padding: '2px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, background: '#f3f4f6', color: '#6b7280' }}>{m.timing}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5, marginTop: '3px' }}>{m.desc}</div>
                    <div style={{ marginTop: '7px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileText size={11} color={m.color} />
                      <span style={{ fontSize: '11px', fontWeight: 700, color: m.color }}>產出：{m.output}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 規格說明 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #86efac', padding: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#16a34a', marginBottom: '12px' }}>✅ 規格內（Included）</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  '健檢題庫使用權（同一套題庫）',
                  '平台使用權（依課程/版本逐步開放）',
                  '免費顧問諮詢時數：每位學員 1 小時（60分鐘）',
                  '形式：線上會議（輪值顧問）',
                  '輸出：會後重點 + Top 3 行動項目 + 下一步建議',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#374151', lineHeight: 1.5 }}>
                    <CheckCircle size={13} color="#22c55e" style={{ flexShrink: 0, marginTop: '1px' }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #bfdbfe', padding: '20px' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#2563eb', marginBottom: '12px' }}>🛒 規格外加購（Add-on）</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  '深度落地：代做/多次會議/產出文件',
                  '嚴選專家媒合（平台上架顧問）',
                  '計費：按小時/專案計價',
                  '分潤：平台與顧問依合作條件拆分',
                  '適合：需要更深度陪跑的企業',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#374151', lineHeight: 1.5 }}>
                    <Zap size={13} color="#2563eb" style={{ flexShrink: 0, marginTop: '1px' }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 我的預約 ── */}
      {activeTab === 'bookings' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#1a1a2e' }}>諮詢預約紀錄</div>
            <button onClick={() => setShowBookingModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 18px', background: '#003262', color: 'white', border: 'none', borderRadius: '9px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
              <Plus size={13} />新增預約
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {MOCK_REQUESTS.map(req => {
              const advisor = ADVISORS.find(a => a.id === req.advisorId);
              const stCfg = STATUS_CFG[req.status];
              if (!advisor) return null;
              return (
                <div key={req.id} style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #e5e7eb', padding: '18px 20px', display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #003262, #3b7ea1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 800, flexShrink: 0 }}>
                    {advisor.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#1a1a2e' }}>{advisor.name}</span>
                      <span style={{ padding: '1px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: 700, background: '#dbeafe', color: '#1d4ed8' }}>{req.module}</span>
                      <span style={{ padding: '1px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: 700, background: stCfg.bg, color: stCfg.color }}>{stCfg.label}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{req.notes}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '12px', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={11} />
                      {new Date(req.scheduledAt).toLocaleDateString('zh-TW', { month: '2-digit', day: '2-digit' })}
                    </div>
                    <div style={{ fontSize: '11px', color: '#c4c9d4', marginTop: '2px' }}>
                      {new Date(req.scheduledAt).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 服務儀表板 ── */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* KPIs */}
          <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {[
              { label: 'Roadmap 完成率', value: '65%', color: '#003262', desc: '改善里程碑進度' },
              { label: '資料齊備度', value: '78%', color: '#16a34a', desc: '可稽核指標比例' },
              { label: '揭露章節就緒度', value: '55%', color: '#d97706', desc: '14章節 / 25章節' },
              { label: '顧問互動', value: completedCount + '場', color: '#7c3aed', desc: '已完成諮詢' },
            ].map(kpi => (
              <div key={kpi.label} style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #e5e7eb', padding: '18px' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: kpi.color, lineHeight: 1 }}>{kpi.value}</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', marginTop: '5px' }}>{kpi.label}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{kpi.desc}</div>
              </div>
            ))}
          </div>
          {/* Roadmap Progress */}
          <div style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #e5e7eb', padding: '22px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a2e', marginBottom: '16px' }}>📍 待辦行動項目</div>
            {[
              { text: '確認 GRI 305-1 範疇一排放係數', priority: 'high', done: false },
              { text: '上傳 12 月份台電帳單至證據金庫', priority: 'high', done: false },
              { text: '完成利害關係人問卷統計', priority: 'medium', done: true },
              { text: '撰寫重大性評估報告摘要', priority: 'medium', done: false },
              { text: '董事會 ESG 培訓課程報名', priority: 'low', done: true },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', padding: '9px 0', borderBottom: '1px solid #f3f4f6', alignItems: 'center' }}>
                <CheckCircle size={15} color={item.done ? '#22c55e' : '#d1d5db'} fill={item.done ? '#22c55e' : 'none'} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: '13px', color: item.done ? '#9ca3af' : '#374151', textDecoration: item.done ? 'line-through' : 'none', lineHeight: 1.4 }}>{item.text}</span>
                <span style={{ padding: '2px 7px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, background: item.priority === 'high' ? '#fef2f2' : item.priority === 'medium' ? '#fef3c7' : '#f3f4f6', color: item.priority === 'high' ? '#dc2626' : item.priority === 'medium' ? '#d97706' : '#9ca3af' }}>
                  {item.priority === 'high' ? '高' : item.priority === 'medium' ? '中' : '低'}
                </span>
              </div>
            ))}
          </div>
          {/* Alert */}
          <div style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #e5e7eb', padding: '22px' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#1a1a2e', marginBottom: '14px' }}>⚠️ 風險提醒</div>
            {[
              { title: 'CBAM 申報截止', desc: '2026 Q2 申報截止 2026-07-31，還有 72 天', level: 'error' },
              { title: 'GRI 305-1 數據缺口', desc: '12 月份冷媒填充紀錄尚未上傳至證據金庫', level: 'warning' },
              { title: '第三方查證報告', desc: '建議在報告書發布前 30 天完成委託', level: 'info' },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', padding: '11px 14px', borderRadius: '10px', background: a.level === 'error' ? '#fef2f2' : a.level === 'warning' ? '#fef3c7' : '#eff6ff', marginBottom: '8px', border: `1px solid ${a.level === 'error' ? '#fca5a5' : a.level === 'warning' ? '#fde68a' : '#bfdbfe'}` }}>
                <div style={{ fontSize: '14px', flexShrink: 0 }}>{a.level === 'error' ? '🔴' : a.level === 'warning' ? '🟡' : 'ℹ️'}</div>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#1f2937' }}>{a.title}</div>
                  <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px', lineHeight: 1.4 }}>{a.desc}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: '14px', padding: '12px 14px', borderRadius: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '12px', color: '#374151', lineHeight: 1.6 }}>
              <strong>服務說明：</strong>顧問服務提供的是方法、框架與輔導，不保證特定得標/認證結果，但會讓您交付速度與品質顯著提升。
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setShowBookingModal(false)}>
          <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '480px', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '20px 24px', background: 'linear-gradient(135deg, #003262, #1a4d7a)', borderRadius: '20px 20px 0 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'white' }}>預約諮詢</div>
              <button onClick={() => setShowBookingModal(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '8px', width: '30px', height: '30px', cursor: 'pointer', color: 'white', fontSize: '16px' }}>×</button>
            </div>
            <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>選擇顧問</label>
                <select style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: '9px', fontSize: '13px', outline: 'none' }} onChange={e => setSelectedAdvisor(ADVISORS.find(a => a.id === e.target.value) || null)}>
                  <option value="">請選擇顧問…</option>
                  {ADVISORS.filter(a => a.available).map(a => (
                    <option key={a.id} value={a.id}>{a.name} — {a.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>諮詢模組</label>
                <select style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: '9px', fontSize: '13px', outline: 'none' }} onChange={e => setSelectedModule(e.target.value)}>
                  <option value="">請選擇模組…</option>
                  {MODULES.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>公司背景 / 痛點說明</label>
                <textarea value={bookingNotes} onChange={e => setBookingNotes(e.target.value)} rows={4} placeholder="請簡述公司基本背景、主要ESG痛點、期望產出…" style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: '9px', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.5 }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                <button onClick={() => setShowBookingModal(false)} style={{ flex: 1, padding: '11px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>取消</button>
                <button style={{ flex: 2, padding: '11px', background: 'linear-gradient(135deg, #003262, #1a4d7a)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <Calendar size={13} />提交預約申請
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}