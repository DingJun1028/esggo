'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// ESGGO v5.0 — Solid Card Style Frontend (RWD Optimized)
// Design: High contrast, no gradients, glass blur(12px)
// Colors: Teal #009EB0, Gold #D4AF37, ZKP Blue #3B82F6, Purple #8B5CF6, Lethal #FF4D6D
// Radii: Atom 8px, Molecule 12px, Organism 16px
// ═══════════════════════════════════════════════════════════════════════════

// ─── Color Tokens ────────────────────────────────────────────────────────
const COLORS = {
  teal: '#009EB0',
  gold: '#D4AF37',
  zkpBlue: '#3B82F6',
  purple: '#8B5CF6',
  lethal: '#FF4D6D',
  darkBg: '#0D0D0D',
  cardBg: 'rgba(20, 20, 24, 0.85)',
  cardBorder: 'rgba(0, 158, 176, 0.2)',
  textPrimary: '#E8E8E8',
  textSecondary: '#9CA3AF',
  surface: '#1A1A1F',
  surfaceLight: '#252530',
} as const;

type FiveTGate = 'traceable' | 'transparent' | 'tangible' | 'trustworthy' | 'trackable';

const FIVE_T_COLORS: Record<FiveTGate, string> = {
  traceable: '#3B82F6',
  transparent: '#009EB0',
  tangible: '#D4AF37',
  trustworthy: '#8B5CF6',
  trackable: '#FF4D6D',
};

const FIVE_T_LABELS: Record<FiveTGate, string> = {
  traceable: '可追溯',
  transparent: '透明化',
  tangible: '具體化',
  trustworthy: '可信賴',
  trackable: '可追蹤',
};

// ─── 28 Chapter Definitions ─────────────────────────────────────────────
interface ChapterDef {
  num: number;
  title: string;
  gate: FiveTGate;
}

const CHAPTERS: ChapterDef[] = [
  { num: 1, title: '組織溯源與報告邊界', gate: 'traceable' },
  { num: 2, title: '永續治理架構', gate: 'transparent' },
  { num: 3, title: '重大性分析與利害關係人', gate: 'transparent' },
  { num: 4, title: '經濟績效與誠信經營', gate: 'tangible' },
  { num: 5, title: '氣候策略與淨零轉型', gate: 'tangible' },
  { num: 6, title: '能源管理與碳排放', gate: 'tangible' },
  { num: 7, title: '水資源與廢棄物管理', gate: 'tangible' },
  { num: 8, title: '生物多樣性與自然資本', gate: 'tangible' },
  { num: 9, title: '循環經濟與產品生命週期', gate: 'tangible' },
  { num: 10, title: '員工結構與人才發展', gate: 'tangible' },
  { num: 11, title: '職業安全與人權', gate: 'trustworthy' },
  { num: 12, title: '供應鏈永續管理', gate: 'trackable' },
  { num: 13, title: '產品責任與客戶關係', gate: 'trustworthy' },
  { num: 14, title: '資訊安全與數據隱私', gate: 'trustworthy' },
  { num: 15, title: '董事會治理與薪酬', gate: 'transparent' },
  { num: 16, title: '風險管理與TCFD治理', gate: 'trustworthy' },
  { num: 17, title: '氣候情境分析與機會', gate: 'transparent' },
  { num: 18, title: '內部碳定價與碳市場', gate: 'tangible' },
  { num: 19, title: '綠色金融與ESG投資', gate: 'transparent' },
  { num: 20, title: '數位轉型與AI創新', gate: 'tangible' },
  { num: 21, title: '智財權與研發創新', gate: 'tangible' },
  { num: 22, title: '客戶關係與數據隱私', gate: 'trustworthy' },
  { num: 23, title: '社區參與與社會影響', gate: 'tangible' },
  { num: 24, title: '勞動權益與多元平等', gate: 'trustworthy' },
  { num: 25, title: '反貪腐與法規遵循', gate: 'transparent' },
  { num: 26, title: 'GRI內容索引與確信', gate: 'traceable' },
  { num: 27, title: 'SDGs對應與永續路徑', gate: 'trackable' },
  { num: 28, title: '未來展望與承諾', gate: 'trackable' },
];

// ─── Interfaces ──────────────────────────────────────────────────────────
interface Company {
  id: string;
  name: string;
  shortName: string;
  industry: string;
}

interface Chapter {
  id: string;
  num: number;
  title: string;
  griCodes: string[];
  fiveTGate: FiveTGate;
  content: string;
  paragraphs: Array<{ content: string }>;
  wordCount: number;
  zkpHash: string;
  omniTagUuid: string;
  evidenceCount: number;
}

interface FiveTStatus {
  traceable: boolean;
  transparent: boolean;
  tangible: boolean;
  trustworthy: boolean;
  trackable: boolean;
}

interface V5Report {
  companyId: string;
  companyName: string;
  industry: string;
  chapters: Chapter[];
  totalWords: number;
  totalParagraphs: number;
  totalOmniTags: number;
  totalEvidence: number;
  fiveTStatus: FiveTStatus;
  trinityHash: string;
  generatedAt: string;
  reportVersion: '5.0';
}

interface TrinityData {
  vaultSeals: number;
  userMilestones: number;
  agentGates: number;
  allPassed: boolean;
}

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

// ─── Hook: Viewport Detection ────────────────────────────────────────────
function useViewport(): ViewportSize {
  const [vp, setVp] = useState<ViewportSize>('desktop');

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      if (w < 640) setVp('mobile');
      else if (w < 1024) setVp('tablet');
      else setVp('desktop');
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return vp;
}

// ─── Component: TopNavBar ────────────────────────────────────────────────
interface TopNavProps {
  companies: Company[];
  selectedCompany: string;
  onSelectCompany: (id: string) => void;
  report: V5Report | null;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

function TopNav({ companies, selectedCompany, onSelectCompany, report, onToggleSidebar, sidebarOpen }: TopNavProps) {
  return (
    <nav
      role="navigation"
      aria-label="主導覽列"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(13, 13, 13, 0.88)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${COLORS.cardBorder}`,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}
    >
      {/* Left: Logo + Hamburger */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Hamburger — visible on mobile/tablet */}
        <button
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? '關閉章節選單' : '開啟章節選單'}
          aria-expanded={sidebarOpen}
          style={{
            display: 'none',
            background: 'transparent',
            border: `1px solid ${COLORS.cardBorder}`,
            borderRadius: 8,
            color: COLORS.teal,
            width: 36,
            height: 36,
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 16,
          }}
          className="hamburger-btn"
        >
          <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'}`} />
        </button>

        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: COLORS.teal,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            fontSize: 16,
            color: '#000',
            flexShrink: 0,
          }}
        >
          E5
        </div>
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
            fontSize: 18,
            color: COLORS.teal,
            whiteSpace: 'nowrap',
          }}
        >
          ESGGO
        </span>
        <span
          style={{
            background: COLORS.gold,
            color: '#000',
            padding: '2px 8px',
            borderRadius: 8,
            fontFamily: "'Fira Code', monospace",
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          v5.0
        </span>
      </div>

      {/* Right: Company Selector + Word Count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <i className="fas fa-building" style={{ color: COLORS.textSecondary, fontSize: 14, flexShrink: 0 }} />
        <select
          value={selectedCompany}
          onChange={(e) => onSelectCompany(e.target.value)}
          aria-label="選擇公司"
          style={{
            background: COLORS.surface,
            color: COLORS.textPrimary,
            border: `1px solid ${COLORS.cardBorder}`,
            borderRadius: 8,
            padding: '6px 12px',
            fontFamily: "'Noto Sans TC', sans-serif",
            fontSize: 13,
            cursor: 'pointer',
            outline: 'none',
            maxWidth: 200,
            minWidth: 0,
          }}
        >
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name || c.shortName}
            </option>
          ))}
        </select>
        {report && (
          <span
            style={{
              fontFamily: "'Fira Code', monospace",
              fontSize: 11,
              color: COLORS.textSecondary,
              whiteSpace: 'nowrap',
              display: 'none',
            }}
            className="word-count-badge"
          >
            {report.totalWords.toLocaleString()} 字
          </span>
        )}
      </div>
    </nav>
  );
}

// ─── Component: ProgressBar ──────────────────────────────────────────────
function ProgressBar({ progress, loading }: { progress: number; loading: boolean }) {
  if (!loading) return null;
  return (
    <div style={{ height: 3, background: COLORS.surface, width: '100%' }}>
      <div
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="報告產生進度"
        style={{
          height: '100%',
          width: `${progress}%`,
          background: COLORS.teal,
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  );
}

// ─── Component: ChapterSidebar ───────────────────────────────────────────
interface SidebarProps {
  activeChapter: number;
  onScrollToChapter: (num: number) => void;
  chapterRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>;
  open: boolean;
  onClose: () => void;
}

function ChapterSidebar({ activeChapter, onScrollToChapter, chapterRefs, open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay backdrop */}
      {open && (
        <div
          onClick={onClose}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 90,
          }}
          className="sidebar-backdrop"
        />
      )}
      <aside
        role="complementary"
        aria-label="章節導航"
        style={{
          width: 220,
          minWidth: 220,
          background: 'rgba(20, 20, 24, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRight: `1px solid ${COLORS.cardBorder}`,
          overflowY: 'auto',
          padding: '16px 0',
          maxHeight: 'calc(100vh - 60px)',
          position: 'sticky',
          top: 60,
          transition: 'transform 0.3s ease',
          zIndex: 95,
        }}
        className={`chapter-sidebar ${open ? 'sidebar-open' : ''}`}
      >
        <div
          style={{
            padding: '0 12px 12px',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: COLORS.textSecondary,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          28 章節導航
        </div>
        {CHAPTERS.map((ch) => {
          const gateColor = FIVE_T_COLORS[ch.gate];
          const isActive = activeChapter === ch.num - 1;
          return (
            <button
              key={ch.num}
              onClick={() => {
                onScrollToChapter(ch.num);
                onClose();
              }}
              ref={(el) => {
                // We use a wrapper div ref approach for scroll targets
                if (el) {
                  // Store reference for scroll
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '8px 12px',
                background: isActive ? `${gateColor}15` : 'transparent',
                border: 'none',
                borderLeft: `3px solid ${isActive ? gateColor : 'transparent'}`,
                color: isActive ? gateColor : COLORS.textSecondary,
                fontFamily: "'Noto Sans TC', sans-serif",
                fontSize: 12,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <span
                style={{
                  fontFamily: "'Fira Code', monospace",
                  fontSize: 10,
                  opacity: 0.6,
                  width: 20,
                  flexShrink: 0,
                }}
              >
                {String(ch.num).padStart(2, '0')}
              </span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {ch.title}
              </span>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: gateColor,
                  flexShrink: 0,
                }}
              />
            </button>
          );
        })}
      </aside>
    </>
  );
}

// ─── Component: StatsCards ───────────────────────────────────────────────
function StatsCards({ report }: { report: V5Report }) {
  const stats = [
    { label: '章節數', value: '28', icon: 'fa-book', color: COLORS.teal },
    { label: '5T 協議', value: '5', icon: 'fa-layer-group', color: COLORS.gold },
    { label: 'ZKP 封印', value: report.totalEvidence, icon: 'fa-lock', color: COLORS.zkpBlue },
    { label: 'GRI 指標', value: report.totalOmniTags, icon: 'fa-tags', color: COLORS.purple },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 12,
        marginBottom: 20,
      }}
    >
      {stats.map((s) => (
        <div
          key={s.label}
          style={{
            background: COLORS.cardBg,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: `1px solid ${COLORS.cardBorder}`,
            borderRadius: 12,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <i className={`fas ${s.icon}`} style={{ color: s.color, fontSize: 18 }} />
          <div>
            <div
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: 20,
                fontWeight: 700,
                color: s.color,
                lineHeight: 1.2,
              }}
            >
              {s.value}
            </div>
            <div style={{ color: COLORS.textSecondary, fontSize: 11 }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Component: ReportHeader ─────────────────────────────────────────────
function ReportHeader({ report }: { report: V5Report }) {
  return (
    <div
      style={{
        background: COLORS.cardBg,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${COLORS.cardBorder}`,
        borderRadius: 16,
        padding: '20px 24px',
        marginBottom: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 14,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: COLORS.teal,
              margin: 0,
            }}
          >
            {report.companyName}
          </h1>
          <span style={{ color: COLORS.textSecondary, fontSize: 12 }}>
            {report.industry} | ESGGO v5.0 | {report.generatedAt?.slice(0, 10)}
          </span>
        </div>
        {/* 5T Status Badges */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {(Object.entries(report.fiveTStatus) as [FiveTGate, boolean][]).map(([gate, passed]) => (
            <span
              key={gate}
              style={{
                background: passed ? FIVE_T_COLORS[gate] : COLORS.lethal,
                color: '#fff',
                padding: '3px 8px',
                borderRadius: 8,
                fontFamily: "'Fira Code', monospace",
                fontSize: 10,
                fontWeight: 600,
              }}
            >
              {FIVE_T_LABELS[gate]} {passed ? '✓' : '✗'}
            </span>
          ))}
        </div>
      </div>
      {/* Stats Row */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {[
          { label: '總字數', value: report.totalWords.toLocaleString(), icon: 'fa-align-left' },
          { label: '段落', value: report.totalParagraphs, icon: 'fa-paragraph' },
          { label: 'OmniTags', value: report.totalOmniTags, icon: 'fa-tags' },
          { label: '證據', value: report.totalEvidence, icon: 'fa-shield-alt' },
        ].map((stat) => (
          <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className={`fas ${stat.icon}`} style={{ color: COLORS.gold, fontSize: 12 }} />
            <span
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: 13,
                color: COLORS.textPrimary,
              }}
            >
              {stat.value}
            </span>
            <span style={{ color: COLORS.textSecondary, fontSize: 11 }}>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Component: ChapterCard ──────────────────────────────────────────────
interface ChapterCardProps {
  ch: Chapter;
  idx: number;
  chapterRefs: React.MutableRefObject<Record<number, HTMLDivElement | null>>;
}

function ChapterCard({ ch, idx, chapterRefs }: ChapterCardProps) {
  const gateColor = FIVE_T_COLORS[ch.fiveTGate] || COLORS.teal;

  return (
    <div
      ref={(el) => {
        chapterRefs.current[idx] = el;
      }}
      id={`chapter-${idx}`}
      style={{
        background: COLORS.cardBg,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: `1px solid ${COLORS.cardBorder}`,
        borderRadius: 16,
        padding: '20px 24px',
        marginBottom: 16,
        transition: 'border-color 0.3s',
      }}
    >
      {/* Chapter Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 14,
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <h2
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 16,
            fontWeight: 600,
            color: gateColor,
            margin: 0,
          }}
        >
          CH.{String(ch.num).padStart(2, '0')} {ch.title}
        </h2>
        <span
          style={{
            background: gateColor,
            color: '#000',
            padding: '3px 10px',
            borderRadius: 8,
            fontFamily: "'Fira Code', monospace",
            fontSize: 10,
            fontWeight: 600,
          }}
        >
          {FIVE_T_LABELS[ch.fiveTGate]}
        </span>
      </div>

      {/* GRI Codes */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {ch.griCodes.map((gri) => (
          <span
            key={gri}
            style={{
              background: COLORS.surface,
              border: `1px solid ${COLORS.cardBorder}`,
              color: COLORS.textSecondary,
              padding: '2px 8px',
              borderRadius: 8,
              fontFamily: "'Fira Code', monospace",
              fontSize: 11,
            }}
          >
            {gri}
          </span>
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          fontSize: 14,
          lineHeight: 1.8,
          color: COLORS.textPrimary,
          whiteSpace: 'pre-wrap',
          marginBottom: 14,
        }}
      >
        {ch.content || '（本章內容產生中...）'}
      </div>

      {/* Footer: ZKP Hash + OmniTag */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: `1px solid ${COLORS.cardBorder}`,
          paddingTop: 10,
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: "'Fira Code', monospace",
              fontSize: 10,
              color: COLORS.zkpBlue,
            }}
          >
            <i className="fas fa-lock" style={{ fontSize: 10 }} />
            ZKP: {ch.zkpHash}
          </span>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontFamily: "'Fira Code', monospace",
              fontSize: 10,
              color: COLORS.purple,
            }}
          >
            <i className="fas fa-tag" style={{ fontSize: 10 }} />
            OmniTag: {ch.omniTagUuid}
          </span>
        </div>
        <span style={{ color: COLORS.textSecondary, fontSize: 10 }}>
          {ch.wordCount} 字 | {ch.paragraphs?.length || 0} 段落
        </span>
      </div>
    </div>
  );
}

// ─── Component: TrinityPanel ─────────────────────────────────────────────
interface TrinityPanelProps {
  trinity: TrinityData;
  simulating: boolean;
  onRunSimulator: () => void;
}

function TrinityPanel({ trinity, simulating, onRunSimulator }: TrinityPanelProps) {
  return (
    <aside
      role="complementary"
      aria-label="OmniBase 三庫面板"
      style={{
        width: 260,
        minWidth: 260,
        background: 'rgba(20, 20, 24, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderLeft: `1px solid ${COLORS.cardBorder}`,
        padding: '16px',
        maxHeight: 'calc(100vh - 60px)',
        position: 'sticky',
        top: 60,
        overflowY: 'auto',
      }}
      className="trinity-panel"
    >
      <div
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 11,
          fontWeight: 600,
          color: COLORS.textSecondary,
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 14,
        }}
      >
        OmniBase 三庫
      </div>

      {/* Vault Seals */}
      <div
        style={{
          background: COLORS.cardBg,
          border: `1px solid ${COLORS.cardBorder}`,
          borderRadius: 12,
          padding: 14,
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <i className="fas fa-vault" style={{ color: COLORS.gold, fontSize: 14 }} />
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: COLORS.gold,
            }}
          >
            金庫封印
          </span>
        </div>
        <div
          style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: 24,
            fontWeight: 700,
            color: COLORS.gold,
          }}
        >
          {trinity.vaultSeals}
        </div>
        <div style={{ color: COLORS.textSecondary, fontSize: 10, marginTop: 2 }}>/ 28 章節已封印</div>
        <div
          style={{
            height: 4,
            borderRadius: 2,
            background: COLORS.surface,
            marginTop: 6,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${(trinity.vaultSeals / 28) * 100}%`,
              background: COLORS.gold,
              transition: 'width 0.5s ease',
            }}
          />
        </div>
      </div>

      {/* User Milestones */}
      <div
        style={{
          background: COLORS.cardBg,
          border: `1px solid ${COLORS.cardBorder}`,
          borderRadius: 12,
          padding: 14,
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <i className="fas fa-flag-checkered" style={{ color: COLORS.purple, fontSize: 14 }} />
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: COLORS.purple,
            }}
          >
            用戶里程碑
          </span>
        </div>
        <div
          style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: 24,
            fontWeight: 700,
            color: COLORS.purple,
          }}
        >
          {trinity.userMilestones}
        </div>
        <div style={{ color: COLORS.textSecondary, fontSize: 10, marginTop: 2 }}>已達成里程碑</div>
      </div>

      {/* Agent Gates */}
      <div
        style={{
          background: COLORS.cardBg,
          border: `1px solid ${COLORS.cardBorder}`,
          borderRadius: 12,
          padding: 14,
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <i className="fas fa-robot" style={{ color: COLORS.zkpBlue, fontSize: 14 }} />
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              color: COLORS.zkpBlue,
            }}
          >
            智能閘門
          </span>
        </div>
        <div
          style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: 24,
            fontWeight: 700,
            color: COLORS.zkpBlue,
          }}
        >
          {trinity.agentGates}
        </div>
        <div style={{ color: COLORS.textSecondary, fontSize: 10, marginTop: 2 }}>/ 5T 閘門已通過</div>
        {/* Gate indicators */}
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 6,
                borderRadius: 3,
                background: i < trinity.agentGates ? COLORS.zkpBlue : COLORS.surface,
                transition: 'background 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Simulator Button */}
      <button
        onClick={onRunSimulator}
        disabled={simulating}
        aria-label="執行三庫聯動模擬"
        style={{
          width: '100%',
          background: simulating ? COLORS.surface : COLORS.lethal,
          color: '#fff',
          border: 'none',
          borderRadius: 12,
          padding: '10px 14px',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: 12,
          fontWeight: 600,
          cursor: simulating ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          transition: 'all 0.2s',
          opacity: simulating ? 0.7 : 1,
        }}
      >
        <i className={`fas ${simulating ? 'fa-spinner fa-spin' : 'fa-play'}`} style={{ fontSize: 12 }} />
        {simulating ? '模擬中...' : '三庫聯動模擬'}
      </button>

      {/* Trinity Status */}
      <div
        style={{
          marginTop: 10,
          padding: 10,
          background: trinity.allPassed ? 'rgba(0, 158, 176, 0.1)' : 'rgba(255, 77, 109, 0.1)',
          border: `1px solid ${trinity.allPassed ? COLORS.teal : COLORS.lethal}`,
          borderRadius: 12,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: "'Fira Code', monospace",
            fontSize: 10,
            color: trinity.allPassed ? COLORS.teal : COLORS.lethal,
          }}
        >
          {trinity.allPassed ? '◈ 三庫已同步' : '◈ 三庫同步中'}
        </div>
      </div>
    </aside>
  );
}

// ─── Component: BottomFooter ─────────────────────────────────────────────
interface FooterProps {
  report: V5Report | null;
  onDownloadHtml: () => void;
  onDownloadMarkdown: () => void;
}

function BottomFooter({ report, onDownloadHtml, onDownloadMarkdown }: FooterProps) {
  return (
    <footer
      role="contentinfo"
      style={{
        position: 'sticky',
        bottom: 0,
        background: 'rgba(13, 13, 13, 0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: `1px solid ${COLORS.cardBorder}`,
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        flexWrap: 'wrap',
      }}
    >
      {/* 5T Status */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
        <span
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 10,
            color: COLORS.textSecondary,
            fontWeight: 600,
          }}
        >
          5T:
        </span>
        {(Object.entries(FIVE_T_COLORS) as [FiveTGate, string][]).map(([gate, color]) => (
          <div key={gate} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: report?.fiveTStatus?.[gate] ? color : COLORS.surface,
                boxShadow: report?.fiveTStatus?.[gate] ? `0 0 6px ${color}` : 'none',
              }}
            />
            <span
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: 9,
                color: report?.fiveTStatus?.[gate] ? color : COLORS.textSecondary,
              }}
            >
              {FIVE_T_LABELS[gate]}
            </span>
          </div>
        ))}
      </div>

      {/* Trinity Hash */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontFamily: "'Fira Code', monospace",
          fontSize: 10,
          color: COLORS.textSecondary,
          minWidth: 0,
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <i className="fas fa-fingerprint" style={{ color: COLORS.teal, fontSize: 11 }} />
        <span style={{ color: COLORS.teal }}>Trinity:</span>
        <span
          style={{
            maxWidth: 160,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {report?.trinityHash || '---'}
        </span>
      </div>

      {/* Download Buttons */}
      <div style={{ display: 'flex', gap: 6 }}>
        <button
          onClick={onDownloadHtml}
          disabled={!report}
          aria-label="下載 HTML 報告"
          style={{
            background: 'transparent',
            border: `1px solid ${COLORS.teal}`,
            color: COLORS.teal,
            borderRadius: 8,
            padding: '5px 12px',
            fontFamily: "'Fira Code', monospace",
            fontSize: 10,
            cursor: report ? 'pointer' : 'not-allowed',
            opacity: report ? 1 : 0.4,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <i className="fas fa-file-code" style={{ fontSize: 10 }} />
          HTML
        </button>
        <button
          onClick={onDownloadMarkdown}
          disabled={!report}
          aria-label="下載 Markdown 報告"
          style={{
            background: 'transparent',
            border: `1px solid ${COLORS.gold}`,
            color: COLORS.gold,
            borderRadius: 8,
            padding: '5px 12px',
            fontFamily: "'Fira Code', monospace",
            fontSize: 10,
            cursor: report ? 'pointer' : 'not-allowed',
            opacity: report ? 1 : 0.4,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <i className="fas fa-file-alt" style={{ fontSize: 10 }} />
          Markdown
        </button>
      </div>
    </footer>
  );
}

// ─── Main Page Component ─────────────────────────────────────────────────
export default function SustainWriteV5Page() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  const [report, setReport] = useState<V5Report | null>(null);
  const [activeChapter, setActiveChapter] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [trinity, setTrinity] = useState<TrinityData>({
    vaultSeals: 0,
    userMilestones: 0,
    agentGates: 0,
    allPassed: false,
  });
  const [simulating, setSimulating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const viewport = useViewport();

  // Fetch companies on mount
  useEffect(() => {
    fetch('/api/sustain-write/v5')
      .then((r) => r.json())
      .then((data: { companies?: Company[] }) => {
        setCompanies(data.companies || []);
        if (data.companies && data.companies.length > 0) {
          setSelectedCompany(data.companies[0].id);
        }
      })
      .catch(() => {
        /* silent fail */
      });
  }, []);

  // Generate report
  const generateReport = useCallback(
    async (companyId: string) => {
      if (!companyId) return;
      setLoading(true);
      setProgress(0);
      setReport(null);

      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + Math.random() * 15, 90));
      }, 200);

      try {
        const res = await fetch('/api/sustain-write/v5', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ companyId, format: 'json', mode: 'full' }),
        });
        const data: V5Report = await res.json();
        if ('error' in data) {
          console.error(data);
        } else {
          setReport(data);
          setProgress(100);
          setTrinity({
            vaultSeals: data.totalEvidence || 28,
            userMilestones: Math.floor(data.totalParagraphs / 3) || 9,
            agentGates: 5,
            allPassed: true,
          });
        }
      } catch (err) {
        console.error('產生報告失敗:', err);
      } finally {
        clearInterval(progressInterval);
        setTimeout(() => setProgress(100), 100);
        setTimeout(() => setLoading(false), 500);
      }
    },
    []
  );

  // Auto-generate on company selection
  useEffect(() => {
    if (selectedCompany) {
      generateReport(selectedCompany);
    }
  }, [selectedCompany, generateReport]);

  // Scroll to chapter
  const scrollToChapter = useCallback((num: number) => {
    setActiveChapter(num - 1);
    chapterRefs.current[num - 1]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Download handlers
  const downloadHtml = useCallback(() => {
    if (!report) return;
    fetch('/api/sustain-write/v5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyId: selectedCompany, format: 'html' }),
    })
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `esggo-v5-${selectedCompany}.html`;
        a.click();
        URL.revokeObjectURL(url);
      });
  }, [report, selectedCompany]);

  const downloadMarkdown = useCallback(() => {
    if (!report) return;
    fetch('/api/sustain-write/v5', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyId: selectedCompany, format: 'markdown' }),
    })
      .then((r) => r.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `esggo-v5-${selectedCompany}.md`;
        a.click();
        URL.revokeObjectURL(url);
      });
  }, [report, selectedCompany]);

  // Simulator animation
  const runSimulator = useCallback(() => {
    setSimulating(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setTrinity((prev) => ({
        vaultSeals: Math.min(prev.vaultSeals + 1, 28),
        userMilestones: Math.min(prev.userMilestones + 1, 12),
        agentGates: Math.min(prev.agentGates + (step % 2 === 0 ? 1 : 0), 5),
        allPassed: step >= 5,
      }));
      if (step >= 10) {
        clearInterval(interval);
        setSimulating(false);
      }
    }, 300);
  }, []);

  // Determine layout mode
  const isMobile = viewport === 'mobile';
  const isTablet = viewport === 'tablet';
  const showSidebar = !isMobile && !isTablet; // Desktop always shows sidebar
  const showTrinity = !isMobile; // Trinity panel hidden on mobile

  return (
    <div
      style={{
        minHeight: '100vh',
        background: COLORS.darkBg,
        color: COLORS.textPrimary,
        fontFamily: "'Noto Sans TC', sans-serif",
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ═══ 1. TOP NAVIGATION BAR ═══ */}
      <TopNav
        companies={companies}
        selectedCompany={selectedCompany}
        onSelectCompany={setSelectedCompany}
        report={report}
        onToggleSidebar={() => setSidebarOpen((p) => !p)}
        sidebarOpen={sidebarOpen}
      />

      {/* Progress Bar */}
      <ProgressBar progress={progress} loading={loading} />

      {/* ═══ MAIN LAYOUT ═══ */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* ═══ 2. LEFT SIDEBAR — 28 Chapter Navigation ═══ */}
        {/* On mobile/tablet: overlay sidebar; on desktop: always visible */}
        {(showSidebar || sidebarOpen) && (
          <ChapterSidebar
            activeChapter={activeChapter}
            onScrollToChapter={scrollToChapter}
            chapterRefs={chapterRefs}
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {/* ═══ 3. CENTER — Report Content ═══ */}
        <main
          ref={contentRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: isMobile ? '16px 12px' : '20px 24px',
            maxHeight: 'calc(100vh - 60px)',
            minWidth: 0,
          }}
        >
          {!report ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '60vh',
                gap: 16,
              }}
            >
              <i
                className="fas fa-file-alt"
                style={{ fontSize: 48, color: COLORS.teal, opacity: 0.5 }}
              />
              <span style={{ color: COLORS.textSecondary, fontSize: 15 }}>
                選擇公司產生 ESGGO v5.0 報告
              </span>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <StatsCards report={report} />

              {/* Report Header Card */}
              <ReportHeader report={report} />

              {/* Chapter Cards */}
              {report.chapters.map((ch, idx) => (
                <ChapterCard key={ch.id} ch={ch} idx={idx} chapterRefs={chapterRefs} />
              ))}
            </>
          )}
        </main>

        {/* ═══ 4. RIGHT SIDEBAR — OmniBase Trinity Panel ═══ */}
        {showTrinity && (
          <TrinityPanel
            trinity={trinity}
            simulating={simulating}
            onRunSimulator={runSimulator}
          />
        )}
      </div>

      {/* ═══ 5. BOTTOM STATUS BAR ═══ */}
      <BottomFooter
        report={report}
        onDownloadHtml={downloadHtml}
        onDownloadMarkdown={downloadMarkdown}
      />

      {/* ═══ Global Styles for RWD ═══ */}
      <style jsx global>{`
        /* Reset & base */
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        /* Mobile hamburger button visible on < 1024px */
        @media (max-width: 1023px) {
          .hamburger-btn {
            display: flex !important;
          }
        }

        /* Chapter sidebar: overlay on mobile/tablet */
        @media (max-width: 1023px) {
          .chapter-sidebar {
            position: fixed !important;
            top: 60px !important;
            left: 0 !important;
            bottom: 0 !important;
            transform: translateX(-100%) !important;
            width: 260px !important;
            min-width: 260px !important;
            border-right: 1px solid rgba(0, 158, 176, 0.2) !important;
            max-height: none !important;
          }
          .chapter-sidebar.sidebar-open {
            transform: translateX(0) !important;
          }
          .sidebar-backdrop {
            display: block !important;
          }
        }

        @media (min-width: 1024px) {
          .sidebar-backdrop {
            display: none !important;
          }
        }

        /* Trinity panel: hide on mobile */
        @media (max-width: 639px) {
          .trinity-panel {
            display: none !important;
          }
        }

        /* Word count badge: show on tablet+ */
        @media (min-width: 640px) {
          .word-count-badge {
            display: inline !important;
          }
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Focus visible for accessibility */
        :focus-visible {
          outline: 2px solid #009eb0;
          outline-offset: 2px;
        }

        /* Scrollbar styling */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #1a1a1f;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(0, 158, 176, 0.3);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 158, 176, 0.5);
        }

        /* Selection color */
        ::selection {
          background: rgba(0, 158, 176, 0.3);
          color: #e8e8e8;
        }
      `}</style>
    </div>
  );
}
