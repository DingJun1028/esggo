'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap, Award, Users, Star, Globe, ExternalLink,
  ChevronDown, ChevronRight, CheckCircle, MapPin, Mail, Phone,
  TrendingUp, ArrowRight
} from 'lucide-react';

const COURSE = {
  title: '柏克萊國際永續策略創新認證課程',
  titleEn: 'Berkeley Haas × YUNUS × TSISDA ESG Strategy & Innovation Program',
  subtitle: '全球唯一「策略 × 合規 × 創新 × 創價 × 顧問」五合一永續轉型訓練',
  cohorts: [
    { name: 'A 組', dates: '2026年6月6日 — 7月11日' },
    { name: 'B 組', dates: '2026年8月1日 — 9月5日' },
  ],
  url: 'https://corporateinnovation.berkeley.edu/students/business-model-practicum-2026/',
  highlights: [
    '全球唯一：Berkeley Haas IBI 八大機構 × 永續策略整合課程',
    '五合一訓練：策略 × 合規 × 創新 × 創價 × 顧問',
    '三項重量級成果直接帶走（策略藍圖/報告骨架/創新提案）',
    'Berkeley 師資 × 矽谷業師全程參與',
    'Berkeley × YUNUS × TSISDA 三證書制度',
    '矽谷式 Consulting Office Hour',
    '課程加贈：市價 NT$29,000 ESG 轉型健檢 × 顧問諮詢',
    '首期成果：學員專案共獲得 NT$3,265 萬之政府計畫與新創投資',
  ],
  modules: [
    {
      title: 'Berkeley IBI 模組（週六，36 小時）',
      color: '#003262',
      sessions: [
        'Purpose × 北極星願景設計', 'Materiality 2.0', 'Strategy House 2.0',
        'KPI Tier 0–3 架構', 'Innovation Matrix × ESG Portfolio',
        'Ecosystem Strategy', 'Impact Logic Model', 'ESG Dashboard & Data Architecture',
      ],
    },
    {
      title: 'TSISDA 任脈（合規，18 小時）',
      color: '#2E8B57',
      sessions: [
        'ESG 全球趨勢 × 三大議題', 'GRI × IFRS 永續揭露標準',
        'TCFD/TNFD/TISFD', '永續重大性 × 永續治理', 'ESG CHECK 工具', '永續報告架構與策略設計',
      ],
    },
    {
      title: 'TSISDA 督脈（創價，18 小時）',
      color: '#FDB515',
      sessions: [
        '永續新典範策略 × 創價型 ESG', '社會創新方法論', '社會影響力分析',
        '永續商業模式設計（SBMC）', 'ESG 創新解方', '國際精實落地（Silicon Valley Lean Launch）',
      ],
    },
  ],
  deliverables: [
    '完整的《永續策略藍圖 2.0》（含 9 大 Canvas）',
    '企業永續報告骨架 × 策略框架（合規成果）',
    '創價型 ESG 新創提案原型（Prototype）',
    '市價 NT$29,000 的 ESG 轉型健檢 × 顧問諮詢',
  ],
  certs: [
    'UC Berkeley Haas IBI 國際永續策略創新師證書',
    '台灣尤努斯基金會 × TSISDA 國際永續轉型規劃師證書',
  ],
};

const INSTRUCTORS = [
  { name: 'Ganesh Iyer', title: 'Faculty Director, Center for Growth Markets', org: 'UC Berkeley Haas', country: '美國', av: 'GI', available: true },
  { name: 'Ana Torres', title: 'Associate Director, C2M Program', org: 'UC Berkeley Haas', country: '美國', av: 'AT', available: true },
  { name: '楊坤修 博士 Dr. Kuen-Shiou Yang', title: '理事長 Chairman', org: 'TSISDA 台灣社會創新與永續發展協會', country: '台灣', av: 'YK', available: true },
  { name: 'Stan Shih', title: 'Founder of Acer Group & Chairman, StanShih Foundation', org: 'StanShih Foundation / Acer Group', country: '台灣', av: 'SS', available: true },
  { name: 'Dr. Rey-Sheng Her', title: 'Deputy CEO', org: '慈濟基金會 Tzu Chi Foundation', country: '台灣', av: 'RH', available: true },
  { name: 'Chandra Vadhana Radhakrishnan', title: 'Senior Lecturer · Stanford ESG Scholar', org: 'Monash University', country: '澳洲', av: 'CV', available: true },
  { name: 'Ann-Kristin Zobel', title: 'Associate Professor of Management', org: 'University of St. Gallen', country: '瑞士', av: 'AZ', available: false },
  { name: 'Dave Rochlin', title: 'Executive Director, Innovation & Design', org: 'UC Berkeley Haas', country: '美國', av: 'DR', available: true },
  { name: 'Chris Bush', title: 'Executive Director, IBI', org: 'UC Berkeley Haas IBI', country: '美國', av: 'CB', available: true },
  { name: 'Karin Li', title: 'Behavioral Economist', org: 'Haas School of Business', country: '美國', av: 'KL', available: true },
];

const SV_MENTORS = [
  { name: 'Dr. Herbert Wu', org: 'Apple 前董事 · 昇陽電腦前董事', av: 'HW', tag: 'Apple' },
  { name: 'Dr. Xiao Ge', org: 'Stanford 資料驅動 AI 研究學者', av: 'XG', tag: 'Stanford' },
  { name: 'Dr. Jim Spohrer', org: 'IBM 前開放技術總監 · Apple 傑出科學家', av: 'JS', tag: 'IBM' },
  { name: 'Dr. Gautam Bandyopadhyay', org: 'Siemens 前創新與技術管理總監', av: 'GB', tag: 'Siemens' },
  { name: 'Dr. Deepu Rathi', org: 'Cisco 前高級總監', av: 'DR', tag: 'Cisco' },
  { name: 'Dr. Pradeep Iyer', org: 'Avery Dennison 前全球高級總監', av: 'PI', tag: 'Avery' },
  { name: 'Dr. Brinda Wiita', org: 'Johnson & Johnson 前總監', av: 'BW', tag: 'J&J' },
  { name: 'Olga Diamandis', org: 'Disney 創新總監', av: 'OD', tag: 'Disney' },
  { name: 'Dan Yu', org: 'Siemens AI 和機器學習解決方案總監', av: 'DY', tag: 'Siemens' },
  { name: 'Piyush Malik', org: 'IBM 與 Google 前雲端總監', av: 'PM', tag: 'Google' },
  { name: 'Srikanth Nandi Raju', org: 'Experian 工程總監 · PayPal 前工程主管', av: 'SR', tag: 'Experian' },
  { name: 'Janaki Kowtha', org: 'IBM 科技業務負責人', av: 'JK', tag: 'IBM' },
  { name: 'Veronica Pettit', org: 'Siemens Energy 研究員', av: 'VP', tag: 'Siemens' },
];

const STUDENTS = [
  { name: '陳佳瑩', company: '台達電子', role: '永續策略主管', cohort: 'A 組', progress: 85, status: 'active' },
  { name: '林宗翰', company: '研華科技', role: '企業永續長', cohort: 'A 組', progress: 72, status: 'active' },
  { name: '王雅婷', company: '緯創資通', role: 'ESG 專員', cohort: 'A 組', progress: 91, status: 'active' },
  { name: '李建志', company: '台灣大哥大', role: '策略規劃處長', cohort: 'A 組', progress: 68, status: 'active' },
  { name: '張美雲', company: '富邦金控', role: '永續發展部協理', cohort: 'B 組', progress: 0, status: 'pending' },
];

const TABS = ['認證課程', '師資陣容', '矽谷業師', '學員專區'];
const BLUE = '#003262';
const GOLD = '#FDB515';

const FAQ = [
  { q: 'Q1 這門課程對企業最大的價值是什麼？', a: '全球唯一整合 Berkeley IBI 八大機構 × ESG Strategy × Compliance × Innovation × Consulting 的課程。企業能一次獲得：永續策略設計能力、完整永續報告骨架、創價型 ESG 專案提案、國際合規能力（IFRS S1/S2、GRI、TCFD）、矽谷式顧問諮詢。' },
  { q: 'Q2 課程與一般 ESG/永續課程有什麼不同？', a: '一般課程：講概念、講框架。本課程：從策略、到合規、到創新、到落地、到顧問，一次打通永續任督二脈。唯一能培育完整 ESG 即戰力的課程。' },
  { q: 'Q3 完成課程後，學員能替公司做什麼？', a: '具備：完成企業永續策略藍圖 Blueprint 2.0、完成永續報告書初稿、設計 1-2 個創價 ESG 專案、進行 KPI 架構/Dashboard 架構/資料盤點。= 第一線可用的 ESG 策略即戰力。' },
  { q: 'Q4 我沒有 ESG 背景，可以參加嗎？', a: '完全可以！課程從 0 → 1 完成永續報告骨架、從 1 → 2 完成永續策略藍圖、從 2 → 3 完成創新 ESG 專案提案。非常適合 ESG 新手、企業轉職者、管理職、新創創辦人。' },
  { q: 'Q5 我們可以派多位員工同時參加嗎？', a: '可以，且強烈建議企業 2-4 人小組一起參加。可以團隊方式完成創價專案、公司回去後可立即啟動 ESG 工作小組、可提供企業採購優惠。' },
];

function Avatar({ initials, color = BLUE, size = 40 }: { initials: string; color?: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `linear-gradient(135deg, ${color}, ${color}99)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: 800, fontSize: size * 0.33, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

export default function AcademyPage() {
  const [tab, setTab] = useState(0);
  const [openMod, setOpenMod] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ background: '#F4F6F9', minHeight: '100vh' }}>
      {/* Header */}
      <div className="page-header">
        <div style={{ maxWidth: 1050, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <GraduationCap size={20} color={GOLD} />
            <span style={{ color: '#A8C8E8', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
              ESG Academy · Berkeley × YUNUS × TSISDA
            </span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 'clamp(1.1rem,2.5vw,1.5rem)', fontWeight: 800, margin: '0 0 8px' }}>
            永續學院 ESG Academy
          </h1>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { l: '認證學員', v: '284+' },
              { l: '師資業師', v: '24+' },
              { l: '認證課程', v: '1' },
              { l: '合作機構', v: '4' },
            ].map(s => (
              <div key={s.l} style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: GOLD, fontWeight: 800, fontSize: 15 }}>{s.v}</span>
                <span style={{ color: '#A8C8E8', fontSize: 12 }}>{s.l}</span>
              </div>
            ))}
            <Link
              href="/academy/whitepaper"
              style={{
                background: '#FFFFFF',
                color: BLUE,
                borderRadius: 8,
                padding: '6px 14px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 12,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <Award size={14} />
              設計白皮書
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: 1050, margin: '0 auto', display: 'flex', padding: '0 24px', overflowX: 'auto' }}>
          {TABS.map((t, i) => (
            <button key={i} onClick={() => setTab(i)} style={{
              padding: '12px 18px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, color: tab === i ? BLUE : '#64748B',
              borderBottom: tab === i ? `3px solid ${GOLD}` : '3px solid transparent',
              whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1050, margin: '0 auto', padding: '24px' }}>

        {/* ── Course Tab ── */}
        {tab === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Hero Card */}
            <div style={{
              background: `linear-gradient(135deg, ${BLUE} 0%, #1B4F8A 60%, #3B7EA1 100%)`,
              borderRadius: 16, padding: '28px', border: `3px solid ${GOLD}`,
            }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                {['UC Berkeley Haas IBI', '台灣尤努斯基金會', 'TSISDA', 'ESG Sunshine'].map(p => (
                  <span key={p} style={{ background: 'rgba(253,181,21,0.2)', border: `1px solid ${GOLD}`, color: GOLD, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{p}</span>
                ))}
              </div>
              <h2 style={{ color: '#fff', fontSize: 'clamp(1rem,2.5vw,1.4rem)', fontWeight: 800, margin: '0 0 6px' }}>{COURSE.title}</h2>
              <p style={{ color: '#A8C8E8', fontSize: 11, fontStyle: 'italic', margin: '0 0 10px' }}>{COURSE.titleEn}</p>
              <div style={{ background: 'rgba(253,181,21,0.15)', border: `1px solid ${GOLD}40`, borderRadius: 9, padding: '10px 14px', marginBottom: 16 }}>
                <p style={{ color: '#FDE68A', fontSize: 12, margin: 0, fontWeight: 600 }}>{COURSE.subtitle}</p>
              </div>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 16 }}>
                <div style={{ color: '#A8C8E8', fontSize: 12 }}>⏱ 6 週 · 72 小時</div>
                <div style={{ color: '#A8C8E8', fontSize: 12 }}>🌐 線上 × 實體混合式</div>
                <div style={{ color: '#A8C8E8', fontSize: 12 }}>🏆 3 大國際證書</div>
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ color: GOLD, fontWeight: 700, fontSize: 12 }}>📅 2026 年夏季學期：</span>
                {COURSE.cohorts.map(c => (
                  <div key={c.name} style={{ background: 'rgba(253,181,21,0.15)', border: `1px solid ${GOLD}`, borderRadius: 7, padding: '5px 12px' }}>
                    <span style={{ color: GOLD, fontWeight: 700, fontSize: 11 }}>{c.name}</span>
                    <span style={{ color: '#fff', fontSize: 11, marginLeft: 8 }}>{c.dates}</span>
                  </div>
                ))}
                <a href={COURSE.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', background: GOLD, color: BLUE, borderRadius: 8, padding: '8px 16px', fontWeight: 800, fontSize: 12, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <ExternalLink size={12} />柏克萊官網
                </a>
              </div>
            </div>

            {/* Highlights */}
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: BLUE, marginBottom: 12 }}>課程亮點</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
                {COURSE.highlights.map((h, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 10, padding: '14px 16px', border: '1.5px solid #E2E8F0', display: 'flex', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: '#EBF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 800, fontSize: 12, color: BLUE }}>{i + 1}</div>
                    <span style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modules */}
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: BLUE, marginBottom: 12 }}>課程模組</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {COURSE.modules.map((mod, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 12, border: `2px solid ${openMod === i ? mod.color : '#E2E8F0'}`, overflow: 'hidden' }}>
                    <button onClick={() => setOpenMod(openMod === i ? null : i)} style={{ width: '100%', padding: '13px 18px', background: openMod === i ? `${mod.color}10` : '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ background: mod.color, color: mod.color === '#FDB515' ? BLUE : '#fff', borderRadius: 5, padding: '2px 10px', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                        {i === 0 ? '36h' : '18h'}
                      </span>
                      <span style={{ fontWeight: 700, color: '#111', fontSize: 13, flex: 1, textAlign: 'left' }}>{mod.title}</span>
                      {openMod === i ? <ChevronDown size={15} color={mod.color} /> : <ChevronRight size={15} color="#94A3B8" />}
                    </button>
                    {openMod === i && (
                      <div style={{ padding: '10px 18px 14px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 7 }}>
                        {mod.sessions.map((s, si) => (
                          <div key={si} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, background: `${mod.color}08`, borderRadius: 7, padding: '8px 10px' }}>
                            <CheckCircle size={12} color={mod.color} style={{ marginTop: 2, flexShrink: 0 }} />
                            <span style={{ fontSize: 11, color: '#374151', lineHeight: 1.4 }}>{s}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables + Certs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
              <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #E2E8F0', padding: 18 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: BLUE, marginBottom: 12 }}>學員帶走三大成果</h4>
                {COURSE.deliverables.map((d, i) => (
                  <div key={i} style={{ display: 'flex', gap: 9, marginBottom: 9 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 5, background: '#EBF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontWeight: 800, fontSize: 10, color: BLUE }}>{i + 1}</div>
                    <span style={{ fontSize: 11, color: '#374151', lineHeight: 1.5 }}>{d}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff', borderRadius: 12, border: `2px solid ${GOLD}`, padding: 18 }}>
                <h4 style={{ fontSize: 13, fontWeight: 700, color: BLUE, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Award size={14} color={GOLD} />三大正式證書
                </h4>
                {['UC Berkeley Haas IBI 國際永續策略創新師證書', '台灣尤努斯基金會永續轉型規劃師證書', 'TSISDA 國際永續轉型規劃師證書'].map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 9, background: '#FFFBEB', borderRadius: 7, padding: '9px 11px' }}>
                    <Award size={13} color={GOLD} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 11, color: '#374151', lineHeight: 1.4, fontWeight: 600 }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: BLUE, marginBottom: 12 }}>常見問題</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {FAQ.map((f, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 10, border: `1.5px solid ${openFaq === i ? BLUE : '#E2E8F0'}`, overflow: 'hidden' }}>
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', padding: '13px 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, color: '#111', fontSize: 12, textAlign: 'left' }}>{f.q}</span>
                      {openFaq === i ? <ChevronDown size={14} color={BLUE} /> : <ChevronRight size={14} color="#94A3B8" />}
                    </button>
                    {openFaq === i && (
                      <div style={{ padding: '0 16px 13px', borderTop: '1px solid #F1F5F9' }}>
                        <p style={{ fontSize: 12, color: '#64748B', lineHeight: 1.7, margin: '10px 0 0' }}>{f.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ background: `linear-gradient(135deg, ${BLUE} 0%, #1B4F8A 100%)`, borderRadius: 14, padding: '24px', textAlign: 'center', border: `2px solid ${GOLD}` }}>
              <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 800, margin: '0 0 6px' }}>開啟您的國際永續策略人才之旅</h3>
              <p style={{ color: '#A8C8E8', fontSize: 12, margin: '0 0 18px' }}>成為具備國際視野與實務能力的永續策略領袖</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href={COURSE.url} target="_blank" rel="noopener noreferrer" style={{ background: GOLD, color: BLUE, borderRadius: 8, padding: '10px 22px', fontWeight: 800, fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <ExternalLink size={14} />柏克萊官網
                </a>
                <a href="mailto:kevin@esgsunshine.com" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: 13, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Mail size={14} />立即報名
                </a>
                <a href="mailto:kevin@esgsunshine.com?subject=索取簡章" style={{ background: 'rgba(255,255,255,0.1)', color: '#A8C8E8', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: 13, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.2)' }}>
                  索取簡章
                </a>
              </div>
              <div style={{ marginTop: 14, display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { icon: Phone, text: '(02)2599-6799' },
                  { icon: Mail, text: 'kevin@esgsunshine.com' },
                  { icon: MapPin, text: '臺北市中山區中山北路三段40號' },
                ].map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <c.icon size={11} color={GOLD} />
                    <span style={{ color: '#A8C8E8', fontSize: 11 }}>{c.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Instructors Tab ── */}
        {tab === 1 && (
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: BLUE, marginBottom: 14 }}>Berkeley Haas IBI 師資團隊</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {INSTRUCTORS.map((inst, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 16, border: '1.5px solid #E2E8F0', display: 'flex', gap: 12 }}>
                  <Avatar initials={inst.av} color={BLUE} size={48} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: '#111', fontSize: 13, lineHeight: 1.3 }}>{inst.name}</div>
                    <div style={{ fontSize: 11, color: '#3B7EA1', fontWeight: 600, marginTop: 1 }}>{inst.title}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>{inst.org}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 5 }}>
                      <MapPin size={10} color="#94A3B8" />
                      <span style={{ fontSize: 10, color: '#94A3B8' }}>{inst.country}</span>
                      {inst.available && (
                        <span style={{ background: '#DCFCE7', color: '#16A34A', borderRadius: 4, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>可預約</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Silicon Valley Mentors Tab ── */}
        {tab === 2 && (
          <div>
            <div style={{ background: '#FFFBEB', borderRadius: 12, border: '1.5px solid #FDB51540', padding: '14px 18px', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: '#92400E', fontSize: 13, marginBottom: 6 }}>矽谷歷屆輔導業師</div>
              <p style={{ fontSize: 12, color: '#78350F', margin: '0 0 10px' }}>來自 Apple、Siemens、IBM、Disney、Stanford、Google 等世界頂尖機構的資深業師</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['Apple', 'Siemens', 'IBM', 'Disney', 'Stanford', 'Google', 'Cisco', 'Goodyear', 'J&J', 'Experian', 'PayPal', 'Avery'].map(t => (
                  <span key={t} style={{ background: '#fff', border: '1px solid #FDB515', color: '#92400E', borderRadius: 5, padding: '2px 9px', fontSize: 11, fontWeight: 700 }}>{t}</span>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
              {SV_MENTORS.map((m, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 10, padding: '13px 15px', border: '1.5px solid #E2E8F0', display: 'flex', gap: 10, alignItems: 'center' }}>
                  <Avatar initials={m.av} color="#B8860B" size={40} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#111', fontSize: 12 }}>{m.name}</div>
                    <div style={{ fontSize: 11, color: '#64748B', lineHeight: 1.4 }}>{m.org}</div>
                    <span style={{ background: '#FFFBEB', color: '#92400E', border: '1px solid #FDB51540', borderRadius: 4, padding: '1px 6px', fontSize: 9, fontWeight: 700 }}>{m.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Students Tab ── */}
        {tab === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
              {[
                { l: '總學員', v: '284', c: BLUE },
                { l: '進行中', v: '47', c: '#2E8B57' },
                { l: '已結業', v: '237', c: '#3B7EA1' },
                { l: '平均評分', v: '4.9★', c: '#B8860B' },
              ].map(s => (
                <div key={s.l} style={{ background: '#fff', borderRadius: 11, padding: '16px 14px', border: '1.5px solid #E2E8F0', textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: s.c }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Achievement Banner */}
            <div style={{ background: '#FFFBEB', border: `2px solid ${GOLD}`, borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <TrendingUp size={22} color="#B8860B" />
              <div>
                <div style={{ fontWeight: 800, color: '#92400E', fontSize: 14 }}>首期學員成果亮眼</div>
                <div style={{ fontSize: 12, color: '#78350F' }}>
                  學員專案共獲得 <strong>NT$3,265 萬</strong>之政府計畫與新創投資
                </div>
              </div>
            </div>

            {/* Student Table */}
            <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #E2E8F0', overflow: 'hidden' }}>
              <div style={{ padding: '12px 18px', background: BLUE, color: '#fff', fontSize: 13, fontWeight: 700 }}>
                學員名單（部分展示）
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC' }}>
                      {['姓名', '企業', '職稱', '班別', '完成度', '狀態'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#64748B', borderBottom: '2px solid #E2E8F0' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {STUDENTS.map((s, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #F8FAFC', background: i % 2 === 0 ? '#FAFAFA' : '#fff' }}>
                        <td style={{ padding: '10px 14px', fontWeight: 600, color: '#111' }}>{s.name}</td>
                        <td style={{ padding: '10px 14px', color: '#4B5563' }}>{s.company}</td>
                        <td style={{ padding: '10px 14px', color: '#6B7280' }}>{s.role}</td>
                        <td style={{ padding: '10px 14px', color: '#6B7280' }}>{s.cohort}</td>
                        <td style={{ padding: '10px 14px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 5, background: '#F1F5F9', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${s.progress}%`, background: s.progress >= 80 ? '#16A34A' : s.progress >= 50 ? '#3B7EA1' : '#FDB515', borderRadius: 3 }} />
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#374151', width: 32 }}>{s.progress}%</span>
                          </div>
                        </td>
                        <td style={{ padding: '10px 14px' }}>
                          <span style={{
                            borderRadius: 5, padding: '2px 8px', fontSize: 10, fontWeight: 700,
                            background: s.status === 'active' ? '#DCFCE7' : '#FFFBEB',
                            color: s.status === 'active' ? '#16A34A' : '#D97706',
                          }}>
                            {s.status === 'active' ? '進行中' : '待開課'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Enroll CTA */}
            <div style={{ background: '#fff', borderRadius: 12, border: `2px solid ${BLUE}`, padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
              <div>
                <div style={{ fontWeight: 800, color: BLUE, fontSize: 14, marginBottom: 3 }}>加入下一期課程</div>
                <div style={{ fontSize: 12, color: '#64748B' }}>B 組：2026年8月1日 — 9月5日 · 限額招收，採審核制</div>
              </div>
              <a href="mailto:kevin@esgsunshine.com?subject=課程報名" style={{ background: BLUE, color: '#fff', borderRadius: 8, padding: '10px 20px', fontWeight: 700, fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <ArrowRight size={14} />立即報名
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
