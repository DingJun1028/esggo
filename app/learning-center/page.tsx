'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type Section = {
  id: string;
  title: string;
  description: string;
};

type QuickLink = {
  title: string;
  description: string;
  href: string;
  status: 'ready' | 'pending';
  note?: string;
};

type CourseRecord = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  programName?: string;
  term?: string;
  startAt?: string;
  endAt?: string;
  status?: string;
  coverImageUrl?: string;
  metadata?: Record<string, unknown>;
  weeks?: Array<{
    id: string;
    weekNumber: number;
    title: string;
    topic: string;
    instructor?: string;
    materialIds?: string[];
    surveyTemplateId?: string;
    scheduledAt?: string;
  }>;
};

const SECTIONS: Section[] = [
  {
    id: 'overview',
    title: '學習中心 Overview',
    description: 'Berkeley 國際人才培育課程的線上服務總覽，專注於課程、教材、問卷與行政協助。',
  },
  {
    id: 'program',
    title: '課程总览',
    description: '查看目前開放的課程與每週學習路徑。',
  },
  {
    id: 'survey',
    title: '每週滿意度調查',
    description: '每週提交回饋，協助改善內容、講師、教材與學習支持。',
  },
  {
    id: 'support',
    title: '課程支援 / AnyDesk',
    description: '課前安裝遠端支援工具，僅在學員同意且有需要時，由工作人員協助。',
  },
];

const QUICK_LINKS: QuickLink[] = [
  {
    title: '進入線上課程',
    description: 'Berkeley 線上課程主入口',
    href: 'http://berkeley.esgsunshine.com/esg-program',
    status: 'ready',
  },
  {
    title: '學員共享雲端',
    description: '教材、講義、影片與成果',
    href: 'https://drive.google.com/drive/folders/1-ZOC6sPNGISeD7Rf6lYT3Q10yYZaTdAy?usp=drive_link',
    status: 'ready',
  },
  {
    title: '填寫滿意度問卷',
    description: '每週課後問卷，可匿名提交',
    href: '/satisfaction-survey',
    status: 'ready',
  },
  {
    title: '群組 QR Code / 連結',
    description: '公告、上課通知、教材更新',
    href: '#',
    status: 'pending',
    note: '待補實際連結或 QR 圖檔',
  },
  {
    title: '學員服務中心',
    description: '作業繳交、教材下載、回放、預約 Office Hour',
    href: '#',
    status: 'pending',
    note: '待補服務中心網址',
  },
  {
    title: 'AnyDesk 官方下載',
    description: '遠端協助工具下載',
    href: 'https://anydesk.com/zht/downloads',
    status: 'ready',
  },
];

function BrandMark({ className = '' }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl border border-[rgba(253,181,21,0.4)] bg-[rgba(0,50,98,0.55)] text-white font-black ${className}`}
      aria-label="Berkeley ESG Student Center"
    >
      <span className="text-[10px] font-bold tracking-widest leading-none opacity-90">Berkeley</span>
      <span className="mx-1 h-4 w-px bg-[rgba(253,181,21,0.7)]" aria-hidden="true" />
      <span className="text-[10px] font-bold tracking-widest leading-none text-[#FDB515]">ESG</span>
    </div>
  );
}

function StatusDot({ ready }: { ready: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold text-textSecondary">
      <span
        className="inline-block h-2 w-2 rounded-full"
        style={{ backgroundColor: ready ? '#059669' : '#94a3b8' }}
        aria-hidden="true"
      />
      {ready ? '連線可用' : '待補資料'}
    </span>
  );
}

function ChevronRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="opacity-70"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function LearningCenterPage() {
  const [active, setActive] = useState<string>('overview');
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const sectionLookup = useMemo(() => Object.fromEntries(SECTIONS.map((s) => [s.id, s])), []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch('/api/learning-center');
        const json = await res.json();
        if (!cancelled && json?.ok) {
          setCourses(Array.isArray(json.data) ? json.data : []);
        }
      } catch (error) {
        console.error('Failed to load learning center courses', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      const el = document.getElementById('lc-top');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="lc-root min-h-screen bg-[#f1f5f9] text-slate-800">
      <style>{`
        .lc-root {
          font-family: "Inter", "Noto Sans TC", system-ui, -apple-system, "Segoe UI Roboto", sans-serif;
        }
        .lc-shell {
          max-width: 1200px;
          margin: 0 auto;
          padding: 28px 18px 72px;
        }
        @media (max-width: 980px) {
          .lc-shell {
            padding: 20px 12px 56px;
          }
        }
        .lc-card {
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 22px;
          box-shadow: 0 2px 12px rgba(15, 23, 42, 0.06);
        }
        .lc-surface {
          background: #ffffff;
          border: 1px solid #e7ecf3;
          border-radius: 18px;
        }
        .lc-frame {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          isolation: isolate;
        }
        .lc-frame-a {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #001f3f 0%, #003262 50%, #0a3d7a 100%);
        }
        .lc-frame-b {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(700px 220px at 14% 38%, rgba(253, 181, 21, 0.22), transparent 65%), radial-gradient(560px 220px at 86% 58%, rgba(59, 130, 246, 0.22), transparent 70%);
          mix-blend-mode: screen;
        }
        .lc-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(255, 255, 255, 96%);
          box-shadow: 0 1px 10px rgba(15, 23, 42, 0.05);
          backdrop-filter: blur(8px);
          color: #003262;
          font-weight: 700;
          font-size: 13px;
        }
        .lc-side-nav {
          position: sticky;
          top: 18px;
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid #e7ecf3;
          border-radius: 18px;
          padding: 16px;
          max-height: calc(100vh - 36px);
          overflow: auto;
          box-shadow: 0 4px 18px rgba(15, 23, 42, 0.05);
          backdrop-filter: blur(14px);
        }
        .lc-side-nav a, .lc-side-nav button {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #334155;
          font-size: 13px;
          font-weight: 500;
          padding: 9px 11px;
          border-radius: 12px;
          border: none;
          background: transparent;
          width: 100%;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .lc-side-nav a:hover, .lc-side-nav button:hover {
          background: #eef6fb;
          color: #003262;
        }
        .lc-side-nav a.lc-active, .lc-side-nav button.lc-active {
          background: linear-gradient(135deg, #003262, #0a3d7a);
          color: #fff;
          box-shadow: 0 8px 18px rgba(0, 50, 98, 0.28);
        }
        .lc-pill {
          width: 24px;
          height: 24px;
          display: inline-grid;
          place-items: center;
          border-radius: 8px;
          background: rgba(253, 181, 21, 0.18);
          color: #92400e;
          font-weight: 900;
          font-size: 12px;
          flex: none;
        }
        .lc-section {
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid #e7ecf3;
          border-radius: 18px;
          padding: 24px;
          margin-bottom: 18px;
          box-shadow: 0 2px 14px rgba(15, 23, 42, 0.05);
        }
        .lc-quick {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .lc-quick a, .lc-quick button {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px;
          border-radius: 14px;
          background: #fff;
          border: 1px solid #e7ecf3;
          box-shadow: 0 1px 10px rgba(15, 23, 42, 0.05);
          text-align: left;
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
          text-decoration: none;
          color: inherit;
        }
        .lc-quick a:hover, .lc-quick button:hover {
          transform: translateY(-2px);
          border-color: rgba(0, 50, 98, 0.22);
          box-shadow: 0 10px 26px rgba(15, 23, 42, 0.07);
        }
        .lc-quick a[aria-disabled="true"] {
          opacity: 0.75;
          cursor: not-allowed;
        }
        .lc-quick a[aria-disabled="true"]:hover {
          transform: none;
          border-color: #e7ecf3;
          box-shadow: 0 1px 10px rgba(15, 23, 42, 0.05);
        }
        .lc-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 110;
          border-top: 1px solid #e7ecf3;
          background: rgba(255, 255, 255, 0.84);
          box-shadow: 0 1px 0 rgba(15, 23, 42, 0.04);
          text-align: center;
          padding: 10px 18px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.3px;
          color: #475569;
          backdrop-filter: blur(12px);
        }
      `}</style>
      <div id="lc-top" />

      <div className="lc-shell">
        <div className="lc-frame" style={{ marginBottom: 22 }}>
          <div className="lc-frame-a" aria-hidden="true" />
          <div className="lc-frame-b" aria-hidden="true" />
          <div className="relative z-10 px-5 py-6 md:px-8 md:py-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <BrandMark className="h-10 w-10 text-sm" />
                <div>
                  <div className="text-[11.5px] font-bold uppercase tracking-wider text-[rgba(255,255,255,0.85)]">
                    2026 國際永續策略人才培訓課程
                  </div>
                  <h1 className="text-[22px] md:text-[30px] font-black leading-tight text-white">
                    2026 <span className="text-[#FDB515]">Berkeley 國際永續策略人才培育課程</span> 學習中心
                  </h1>
                </div>
              </div>

              <nav className="flex flex-wrap items-center gap-2" aria-label="快捷連結">
                <Link
                  href="/"
                  className="rounded-full border border-[rgba(255,255,255,0.45)] bg-[rgba(255,255,255,0.08)] px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition hover:border-[#FDB515]"
                >
                  ESGGO Dashboard
                </Link>
                <Link
                  href="/satisfaction-survey"
                  className="rounded-full border border-[rgba(255,255,255,0.45)] bg-[rgba(255,255,255,0.08)] px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition hover:border-[#FDB515]"
                >
                  滿意度問卷
                </Link>
              </nav>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="lc-chip">Berkeley Haas</span>
              <span className="lc-chip">TSISDA</span>
              <span className="lc-chip">ESG SUNSHINE</span>
              <span className="lc-chip">W1–W6 Pathway</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '236px 1fr', gap: 24 }}>
          <aside>
            <nav className="lc-side-nav" aria-label="學習中心目錄">
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', color: '#64748b', marginBottom: 10 }}>
                目錄
              </div>
              {SECTIONS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={`${active === item.id ? 'lc-active' : ''}`}
                  aria-current={active === item.id ? 'true' : undefined}
                >
                  <span className={`lc-pill ${active === item.id ? '!bg-[rgba(254,243,199,0.35)] !text-[#FDB515]' : ''}`}>
                    {item.id === 'overview' ? '0' : item.id === 'survey' ? 'S' : '?'}
                  </span>
                  <span>{item.title}</span>
                </button>
              ))}
            </nav>
          </aside>

          <div className="main">
            <div className="flex flex-col gap-5">
              {active === 'overview' && (
                <section className="lc-section">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span
                      style={{
                        display: 'inline-block',
                        height: 6,
                        width: 6,
                        borderRadius: 5,
                        background: 'linear-gradient(180deg, #003262, #FDB515)',
                      }}
                      aria-hidden="true"
                    />
                    <h2 className="font-black text-slate-900" style={{ fontSize: 20 }}>{sectionLookup.overview.title}</h2>
                  </div>
                  <p className="text-sm text-slate-600" style={{ lineHeight: 1.7 }}>
                    {sectionLookup.overview.description}
                  </p>
                  <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14 }}>
                    {[
                      { k: '班期', v: 'Summer 2026 | 07/11 – 08/15' },
                      { k: '主軸', v: '合規 ·  Innovation · 策略 · 商模 · 市場成長' },
                      { k: '執行單位', v: 'UC Berkeley Haas IBI × TSISDA × ESG SUNSHINE' },
                    ].map((row) => (
                      <div key={row.k} className="lc-card" style={{ padding: 16 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.4px' }}>{row.k}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginTop: 4 }}>{row.v}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {active === 'program' && (
                <section className="lc-section">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span
                      style={{
                        display: 'inline-block',
                        height: 6,
                        width: 6,
                        borderRadius: 5,
                        background: 'linear-gradient(180deg, #003262, #FDB515)',
                      }}
                      aria-hidden="true"
                    />
                    <h2 className="font-black text-slate-900" style={{ fontSize: 20 }}>{sectionLookup.program.title}</h2>
                  </div>
                  <p className="text-sm text-slate-600" style={{ lineHeight: 1.7 }}>
                    {sectionLookup.program.description}
                  </p>

                  <div style={{ marginTop: 16 }}>
                    {loading ? (
                      <div className="lc-card">載入課程中...</div>
                    ) : courses.length === 0 ? (
                      <div className="lc-card">目前尚無已發佈課程。</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {courses.map((course) => (
                          <article key={course.id} className="lc-card">
                            <div style={{ fontSize: 12, fontWeight: 800, color: '#64748b', letterSpacing: '0.4px' }}>
                              {course.term ?? 'program'}
                            </div>
                            <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginTop: 6 }}>
                              {course.title}
                            </div>
                            {course.subtitle && (
                              <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>{course.subtitle}</div>
                            )}
                            <div style={{ fontSize: 13, color: '#334155', marginTop: 8, lineHeight: 1.7 }}>
                              {course.description}
                            </div>
                            <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 10 }}>
                              <div className="lc-card" style={{ padding: 14 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>狀態</div>
                                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{course.status ?? 'published'}</div>
                              </div>
                              <div className="lc-card" style={{ padding: 14 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>更新時間</div>
                                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{course.metadata?.updatedAt as string ?? '-'}</div>
                              </div>
                              <div className="lc-card" style={{ padding: 14 }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b' }}>ID</div>
                                <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{course.id}</div>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {active === 'survey' && (
                <section className="lc-section">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span
                      style={{
                        display: 'inline-block',
                        height: 6,
                        width: 6,
                        borderRadius: 5,
                        background: 'linear-gradient(180deg, #003262, #FDB515)',
                      }}
                      aria-hidden="true"
                    />
                    <h2 className="font-black text-slate-900" style={{ fontSize: 20 }}>{sectionLookup.survey.title}</h2>
                  </div>
                  <p className="text-sm text-slate-600" style={{ lineHeight: 1.7 }}>
                    {sectionLookup.survey.description}
                  </p>
                  <div
                    style={{
                      marginTop: 14,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12,
                    }}
                  >
                    {[
                      { label: '我要填寫本週問卷', href: '/satisfaction-survey', button: true },
                      { label: '查看問卷資料', href: '/api/surveys', button: false },
                    ].map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        target={item.button ? undefined : '_blank'}
                        rel={item.button ? undefined : 'noopener'}
                        className="lc-card"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          padding: 18,
                          textDecoration: 'none',
                          color: '#0f172a',
                        }}
                      >
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 12,
                            display: 'grid',
                            placeItems: 'center',
                            background: 'rgba(0, 50, 98, 0.08)',
                            color: '#003262',
                            fontWeight: 900,
                            fontSize: 12,
                            flex: 'none',
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 800 }}>{item.label}</div>
                          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                            後端以 Firestore OmniData 儲存作答。
                          </div>
                        </div>
                        <ChevronRight />
                      </a>
                    ))}
                  </div>
                </section>
              )}

              {active === 'support' && (
                <section className="lc-section">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span
                      style={{
                        display: 'inline-block',
                        height: 6,
                        width: 6,
                        borderRadius: 5,
                        background: 'linear-gradient(180deg, #003262, #FDB515)',
                      }}
                      aria-hidden="true"
                    />
                    <h2 className="font-black text-slate-900" style={{ fontSize: 20 }}>{sectionLookup.support.title}</h2>
                  </div>
                  <p className="text-sm text-slate-600" style={{ lineHeight: 1.7, marginBottom: 6 }}>
                    全線上授課，課前請安裝 AnyDesk；僅於學員同意且有需求時由工作人員遠端協助，不會未經同意連線。
                  </p>
                  <p className="text-xs text-slate-500" style={{ lineHeight: 1.7 }}>
                    若任何服務中心連結尚未到位，請保留掲示，直到實際 URL/QR Code 補齊後再對外公告。
                  </p>
                  <div style={{ marginTop: 18 }}>
                    <SupportForm />
                  </div>
                </section>
              )}

              <section className="lc-section">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span
                    style={{
                      display: 'inline-block',
                      height: 6,
                      width: 6,
                      borderRadius: 5,
                      background: '#F59E0B',
                    }}
                    aria-hidden="true"
                  />
                  <h2 className="font-black text-slate-900" style={{ fontSize: 18 }}>常見連結與服務狀態</h2>
                </div>
                <div className="lc-quick">
                  {QUICK_LINKS.map((item) =>
                    item.status === 'ready' ? (
                      <a
                        key={item.title}
                        href={item.href}
                        target="_blank"
                        rel="noopener"
                        style={{ color: 'inherit' }}
                      >
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 13,
                            display: 'grid',
                            placeItems: 'center',
                            background: 'rgba(0, 50, 98, 0.06)',
                            color: '#003262',
                            fontWeight: 900,
                            fontSize: 12,
                            flex: 'none',
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{item.title}</div>
                          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{item.description}</div>
                        </div>
                        <StatusDot ready />
                        <ChevronRight />
                      </a>
                    ) : (
                      <button
                        key={item.title}
                        disabled
                        aria-disabled="true"
                        className="lc-card"
                        style={{ cursor: 'not-allowed', color: 'inherit' }}
                      >
                        <div
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 13,
                            display: 'grid',
                            placeItems: 'center',
                            background: 'rgba(100, 116, 139, 0.08)',
                            color: '#64748b',
                            fontWeight: 900,
                            fontSize: 12,
                            flex: 'none',
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="3" y="3" width="18" height="18" rx="4" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                          </svg>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{item.title}</div>
                          <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                            {item.note ?? '待補資料'}
                          </div>
                        </div>
                        <StatusDot ready={false} />
                      </button>
                    )
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <footer className="lc-footer">2026 Berkeley ESG Strategy &amp; Innovation Program</footer>
    </div>
  );
}

function SupportForm() {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('submitting');
    setError(null);

    try {
      const res = await fetch('/api/learning-center/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.trim(),
          category: 'other',
          description: description.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json?.ok) {
        throw new Error(json?.message || '提交失敗');
      }

      setStatus('success');
      setSubject('');
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '提交失敗');
      setStatus('error');
    }
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <input
        value={subject}
        onChange={(event) => setSubject(event.target.value)}
        placeholder="主旨"
        required
        style={{ padding: '12px 14px', borderRadius: 14, border: '1px solid #e7ecf3' }}
      />
      <textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="請描述遇到的問題"
        required
        rows={4}
        style={{ padding: '12px 14px', borderRadius: 14, border: '1px solid #e7ecf3' }}
      />
      <button
        type="submit"
        disabled={status === 'submitting'}
        style={{
          alignSelf: 'flex-start',
          padding: '12px 18px',
          borderRadius: 14,
          border: 'none',
          background: '#003262',
          color: '#fff',
          fontWeight: 800,
          opacity: status === 'submitting' ? 0.8 : 1,
        }}
      >
        {status === 'submitting' ? '送出中...' : '送出名單'}
      </button>
      {status === 'success' && <p style={{ fontSize: 13, color: '#047857' }}>已提交支援需求。</p>}
      {status === 'error' && <p style={{ fontSize: 13, color: '#b91c1c' }}>{error}</p>}
    </form>
  );
}
