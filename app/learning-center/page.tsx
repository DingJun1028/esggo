'use client';

import { useAuth } from '@/components/AuthProvider';
import { useState, useEffect } from 'react';
import { signOut } from '@/lib/auth';

type ResourceItem = { id?: string; title: string; category?: string; url?: string };

export default function LearningCenterPage() {
  const { user } = useAuth();
  const [lang, setLang] = useState('zh-Hant');
  const [resources, setResources] = useState<ResourceItem[]>([]);

  useEffect(() => {
    const stored = (localStorage.getItem('lc_lang') as 'zh-Hant' | 'zh-Hans' | 'en') || 'zh-Hant';
    setLang(stored);
  }, []);

  useEffect(() => {
    if (!user) return;
    let canceled = false;
    fetch('/api/admin/resources')
      .then((r) => r.json())
      .then((data) => {
        if (!canceled && data?.ok) setResources(data.rows ?? []);
      })
      .catch(() => {});
    return () => {
      canceled = true;
    };
  }, [user]);

  const t = (key: string) => {
    const dict: Record<string, Record<string, string>> = {
      heroTitle: {
        'zh-Hant': '2026 柏克萊國際人才培育課程 學習中心',
        'zh-Hans': '2026 柏克莱国际人才培育课程 学习中心',
        en: '2026 Berkeley International Talent Program · Learning Center',
      },
      heroLead: {
        'zh-Hant': 'Berkeley Haas · ESGSunshine · 資源、作業、回放、諮詢、提問、滿意度。',
        'zh-Hans': 'Berkeley Haas · ESGSunshine · 资源、作业、回放、咨询、提问、满意度。',
        en: 'Berkeley Haas · ESGSunshine · resources, assignments, replays, consulting, questions, surveys.',
      },
      c1Title: { 'zh-Hant': '學員資源區', 'zh-Hans': '学员资源区', en: 'Resources' },
      c1Desc: { 'zh-Hant': '教材、筆記、公告與補充資料。', 'zh-Hans': '教材、笔记、公告与补充资料。', en: 'Materials, notes, announcements, and member assets.' },
      c2Title: { 'zh-Hant': '作業上傳', 'zh-Hans': '作业上传', en: 'Assignments' },
      c2Desc: { 'zh-Hant': '提交每週矩陣成果與反思。', 'zh-Hans': '提交每周矩阵成果与反思。', en: 'Submit weekly matrices and reflections.' },
      c3Title: { 'zh-Hant': '課程回放', 'zh-Hans': '课程回放', en: 'Replays' },
      c3Desc: { 'zh-Hant': '週六主課與週日諮詢錄影。', 'zh-Hans': '周六主课与周日咨询录影。', en: 'Saturday lectures and Sunday consulting lab recordings.' },
      c4Title: { 'zh-Hant': '諮詢預約', 'zh-Hans': '咨询预约', en: 'Consulting' },
      c4Desc: { 'zh-Hant': '與專屬顧問聯繫安排時段。', 'zh-Hans': '与专属顾问联系安排时段。', en: 'Book a session with a dedicated advisor.' },
      c5Title: { 'zh-Hant': '提問提交', 'zh-Hans': '提问提交', en: 'Questions' },
      c5Desc: { 'zh-Hant': '課程、技術、行政問題統一提交。', 'zh-Hans': '课程、技术、行政问题统一提交。', en: 'Submit course, technical, or admin questions.' },
      c6Title: { 'zh-Hant': '滿意調查', 'zh-Hans': '满意度调查', en: 'Survey' },
      c6Desc: { 'zh-Hant': '每週課後調查，協助持續改善。', 'zh-Hans': '每周课后调查，协助持续改善。', en: 'Weekly post-class survey to improve content and support.' },
      footer: { 'zh-Hant': '2026 Berkeley ESG Strategy &amp; Innovation Program', 'zh-Hans': '2026 Berkeley ESG Strategy &amp; Innovation Program', en: '2026 Berkeley ESG Strategy &amp; Innovation Program' },
      sectionResources: { 'zh-Hant': '已儲存資源', 'zh-Hans': '已保存资源', en: 'Saved resources' },
      login: { 'zh-Hant': '登入 / 註冊', 'zh-Hans': '登录 / 注册', en: 'Sign in' },
      logout: { 'zh-Hant': '登出', 'zh-Hans': '登出', en: 'Sign out' },
      resTitle: { 'zh-Hant': '資源名稱', 'zh-Hans': '资源名称', en: 'Resource title' },
      resUrl: { 'zh-Hant': '連結', 'zh-Hans': '链接', en: 'URL' },
      saveResource: { 'zh-Hant': '儲存資源', 'zh-Hans': '保存资源', en: 'Save resource' },
      recent: { 'zh-Hant': '最近存入', 'zh-Hans': '最近保存', en: 'Recent' },
      delete: { 'zh-Hant': '刪除', 'zh-Hans': '删除', en: 'Delete' },
      catShared: { 'zh-Hant': '共享資源', 'zh-Hans': '共享资源', en: 'Shared resource' },
      catAssignment: { 'zh-Hant': '作業', 'zh-Hans': '作业', en: 'Assignment' },
      catReplay: { 'zh-Hant': '回放', 'zh-Hans': '回放', en: 'Replay' },
      catConsulting: { 'zh-Hant': '諮詢', 'zh-Hans': '咨询', en: 'Consulting' },
      catQuestion: { 'zh-Hant': '提問', 'zh-Hans': '提问', en: 'Question' },
      catSurvey: { 'zh-Hant': '問卷', 'zh-Hans': '问卷', en: 'Survey' },
    };
    return dict[key]?.[lang] ?? dict[key]?.['zh-Hant'] ?? key;
  };

  return (
    <main style={{ minHeight: '100vh', background: '#f6f8fb', padding: '24px 18px 40px', fontFamily: "'Inter','Noto Sans TC','Noto Sans SC',system-ui,sans-serif", color: '#1e293b' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
          <select value={lang} onChange={(e) => { const v = e.target.value as 'zh-Hant' | 'zh-Hans' | 'en'; setLang(v); localStorage.setItem('lc_lang', v); }} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#fff', fontWeight: 600 }}>
            <option value="zh-Hant">繁體</option>
            <option value="zh-Hans">简体</option>
            <option value="en">EN</option>
          </select>
        </div>

        <div style={{ background: 'linear-gradient(125deg,#001f3f,#003262 55%,#0a3d7a)', borderRadius: 18, color: '#fff', padding: '36px 32px', marginBottom: 18 }}>
          <img src="/logo.png" alt="ESG SUNSHINE" style={{ height: 72, width: 'auto', marginBottom: 14, filter: 'drop-shadow(0 6px 18px rgba(0,0,0,.35))' }} />
          <h1 style={{ fontFamily: "'Noto Serif TC','Noto Sans SC',serif", fontWeight: 700, fontSize: 'clamp(20px,2vw,28px)', margin: '0 0 8px' }}>{t('heroTitle')}</h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,.88)', maxWidth: 860, lineHeight: 1.75 }}>{t('heroLead')}</p>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 14 }}>
            {user ? (
              <>
                <span style={{ background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.28)', backdropFilter: 'blur(6px)', padding: '8px 14px', borderRadius: 999, color: '#fff', fontWeight: 600, fontSize: 13.5 }}>{user.displayName || user.email}</span>
                <button onClick={() => signOut()} style={{ background: 'rgba(255,255,255,.10)', color: '#fff', border: '1px solid rgba(255,255,255,.35)', borderRadius: 10, padding: '8px 14px', fontWeight: 600, cursor: 'pointer' }}>{t('logout')}</button>
              </>
            ) : (
              <a href="/" style={{ color: '#fff', textDecoration: 'underline' }}>{t('login')}</a>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 16 }}>
          <Card titleKey="c1Title" descKey="c1Desc" icon="fa-folder-open" link="https://drive.google.com/drive/folders/1-ZOC6sPNGISeD7Rf6lYT3Q10yYZaTdAy?usp=sharing" linkKey="c1Link" t={t} />
          <Card titleKey="c2Title" descKey="c2Desc" icon="fa-cloud-arrow-up" gold link="https://forms.gle/1paHpA5xSSSZJSFy8" linkKey="c2Link" t={t} />
          <Card titleKey="c3Title" descKey="c3Desc" icon="fa-photo-film" link="https://drive.google.com/drive/folders/1-ZOC6sPNGISeD7Rf6lYT3Q10yYZaTdAy?usp=sharing" linkKey="c3Link" t={t} />
          <Card titleKey="c4Title" descKey="c4Desc" icon="fa-calendar-check" gold link="https://docs.google.com/forms/d/e/1FAIpQLSdqFeKkOJOrg0erjaP1EFG9zyj98I5E3GpA4m1Zlzy2ZATiEw/viewform" linkKey="c4Link" t={t} />
          <Card titleKey="c5Title" descKey="c5Desc" icon="fa-clipboard-question" link="https://forms.gle/ErFffsbVrmAgyFQJA" linkKey="c5Link" t={t} />
          <Card titleKey="c6Title" descKey="c6Desc" icon="fa-star-half-stroke" gold link="/satisfaction-survey/index.html" linkKey="c6Link" t={t} />
        </div>

        {user && (
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '18px 20px', marginTop: 14 }}>
            <h2 style={{ margin: '0 0 10px', fontSize: 17, fontWeight: 800, color: '#003262', display: 'flex', alignItems: 'center', gap: 10 }}>{t('sectionResources')}</h2>
            <ResourceForm t={t} onSaved={(row) => setResources((prev) => [row, ...prev])} />
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{t('recent')}</div>
              {resources.length === 0 ? (
                <p style={{ margin: 0, color: '#64748b' }}>—</p>
              ) : (
                <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6 }}>
                  {resources.slice(0, 20).map((item) => (
                    <li key={item.id} style={{ fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>
                        <a href={item.url || '#'} target="_blank" rel="noopener" style={{ color: '#003262', fontWeight: 600 }}>{item.title}</a>
                        {item.category ? <span style={{ color: '#64748b', marginLeft: 8 }}>({item.category})</span> : null}
                      </span>
                      <button data-id={item.id} className="deleteResourceBtn" style={{ background: 'transparent', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: 8, padding: '6px 10px', fontSize: 12, cursor: 'pointer' }}>{t('delete')}</button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', fontSize: 12.5, color: '#94a3b8', marginTop: 22 }}>{t('footer')}</div>
      </div>
    </main>
  );
}

function ResourceForm({ t, onSaved }: { t: (key: string) => string; onSaved: (row: ResourceItem) => void }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('shared_resource');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const handler = async (event: Event) => {
      const btn = (event.target as HTMLElement).closest('.deleteResourceBtn');
      if (!btn) return;
      const id = btn.getAttribute('data-id');
      if (!id) return;
      const res = await fetch('/api/admin/resources?id=' + encodeURIComponent(id), { method: 'DELETE' });
      const data = await res.json();
      if (data?.ok) {
        btn.closest('li')?.remove();
      }
    };
    const root = document.querySelector('main');
    if (!root) return;
    root.addEventListener('click', handler);
    return () => {
      root.removeEventListener('click', handler);
    };
  }, []);

  return (
    <form id="resourceForm" style={{ display: 'grid', gap: 10, maxWidth: 640, marginTop: 10 }}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t('resTitle')} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc' }} />
      <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc' }}>
        <option value="shared_resource">{t('catShared')}</option>
        <option value="assignment">{t('catAssignment')}</option>
        <option value="replay">{t('catReplay')}</option>
        <option value="consulting">{t('catConsulting')}</option>
        <option value="question">{t('catQuestion')}</option>
        <option value="survey">{t('catSurvey')}</option>
      </select>
      <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t('resUrl')} style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc' }} />
      <button
        type="submit"
        style={{ justifySelf: 'start', padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', background: 'linear-gradient(180deg,#FDB515,#f5b308)', color: '#003262', fontWeight: 700, cursor: 'pointer' }}
      >
        {t('saveResource')}
      </button>
      {error ? <span style={{ color: '#dc2626', fontSize: 13 }}>{error}</span> : null}
    </form>
  );
}

function Card({ titleKey, descKey, icon, link, linkKey, t, gold = false }: { titleKey: string; descKey: string; icon: string; link: string; linkKey: string; t: (key: string) => string; gold?: boolean }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: 22, display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,.06)' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: gold ? 'linear-gradient(90deg,#FDB515,#f59e0b)' : 'linear-gradient(90deg,#003262,#FDB515)' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, display: 'inline-grid', placeItems: 'center', background: gold ? 'linear-gradient(135deg,rgba(253,181,21,.12),#fff7e6)' : 'linear-gradient(135deg,rgba(0,50,98,.07),#eef4ff)', color: gold ? '#b45309' : '#003262', fontSize: 17, boxShadow: 'inset 0 0 0 1px rgba(0,50,98,.06)' }}><i className={'fa-solid ' + icon}></i></div>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#003262' }}>{t(titleKey)}</h3>
      </div>
      <p style={{ margin: '6px 0 14px', fontSize: 13.5, color: '#475569' }}>{t(descKey)}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 'auto' }}>
        <a href={link} target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none', padding: '10px 12px', borderRadius: 9, fontWeight: 600, fontSize: 13.5, border: '1px solid #e2e8f0', background: 'linear-gradient(180deg,#fff,#fafafa)', color: '#003262' }}>
          <span>{t(linkKey)}</span>
          <i className="fa-solid fa-arrow-up-right-from-square" style={{ color: '#64748b' }}></i>
        </a>
      </div>
    </div>
  );
}
