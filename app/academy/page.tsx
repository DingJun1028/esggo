'use client';
import { useState } from 'react';
import {
  GraduationCap, BookOpen, Users, Award, Clock, Star,
  ChevronRight, Play, CheckCircle, Lock, Globe, Zap,
  Calendar, User, Building2, Mail, Phone, MapPin,
  TrendingUp, BarChart3, Shield
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  titleEn: string;
  instructor: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'E' | 'S' | 'G' | 'General';
  enrolled: number;
  rating: number;
  progress: number;
  locked: boolean;
  tags: string[];
  description: string;
  modules: string[];
}

const COURSES: Course[] = [
  {
    id: '1', title: 'GRI 2021 完整框架入門', titleEn: 'GRI 2021 Complete Framework',
    instructor: 'Dr. Kuen-Shiou Yang', duration: '6 小時', level: 'beginner',
    category: 'General', enrolled: 247, rating: 4.8, progress: 100, locked: false,
    tags: ['GRI', 'ESG', '入門'], description: '從零開始學習 GRI 2021 通用準則，掌握永續報告書的核心架構與揭露要求。',
    modules: ['GRI 框架概論', '通用準則詳解', '重大性評估流程', '利害關係人議合', '實作演練'],
  },
  {
    id: '2', title: '溫室氣體盤查實戰', titleEn: 'GHG Inventory Masterclass',
    instructor: 'Ana Torres', duration: '8 小時', level: 'intermediate',
    category: 'E', enrolled: 183, rating: 4.9, progress: 65, locked: false,
    tags: ['ISO 14064', 'GHG', 'Scope 1/2/3'], description: '依據 ISO 14064-1 執行完整的溫室氣體盤查，包含範疇一、二、三排放量計算。',
    modules: ['ISO 14064-1 標準解析', '排放係數選用', '範疇一計算', '範疇二計算', '範疇三評估', '查證準備'],
  },
  {
    id: '3', title: 'TCFD 氣候情境分析', titleEn: 'TCFD Climate Scenario Analysis',
    instructor: 'Ann-Kristin Zobel', duration: '5 小時', level: 'advanced',
    category: 'E', enrolled: 98, rating: 4.7, progress: 20, locked: false,
    tags: ['TCFD', 'ISSB S2', '氣候風險'], description: '掌握 TCFD 四大支柱揭露框架，執行 1.5°C 與 4°C 氣候情境分析，評估財務影響。',
    modules: ['TCFD 架構解析', '實體風險評估', '轉型風險評估', '1.5°C 情境建模', '財務影響試算'],
  },
  {
    id: '4', title: 'CBAM 碳邊境稅應對策略', titleEn: 'CBAM Compliance Strategy',
    instructor: 'Karin Li', duration: '4 小時', level: 'intermediate',
    category: 'E', enrolled: 156, rating: 4.6, progress: 0, locked: false,
    tags: ['CBAM', 'EU', '碳稅'], description: '了解歐盟 CBAM 機制，學習碳足跡計算與申報策略，降低出口成本風險。',
    modules: ['CBAM 制度介紹', '適用產業認識', '碳足跡計算', '申報流程', '減量策略'],
  },
  {
    id: '5', title: '勞工人權盡職調查', titleEn: 'Human Rights Due Diligence',
    instructor: 'Dave Rochlin', duration: '5 小時', level: 'intermediate',
    category: 'S', enrolled: 112, rating: 4.5, progress: 0, locked: false,
    tags: ['GRI 408-414', '人權', '供應鏈'], description: '依據 UN UNGP 執行人權盡職調查，識別供應鏈中的人權風險並建立因應機制。',
    modules: ['人權框架概論', 'UNGP 解析', '供應鏈風險評估', '救濟機制建立', '揭露準備'],
  },
  {
    id: '6', title: '董事會 ESG 治理', titleEn: 'Board-Level ESG Governance',
    instructor: 'Stan Shih', duration: '3 小時', level: 'advanced',
    category: 'G', enrolled: 67, rating: 4.9, progress: 0, locked: true,
    tags: ['GRI 2-9', '治理', '董事會'], description: '協助董事會成員理解 ESG 責任，建立永續治理架構，整合 ESG KPI 至薪酬連結機制。',
    modules: ['ESG 董事會職責', '治理架構設計', 'ESG KPI 建立', '薪酬連結策略'],
  },
];

const INSTRUCTORS = [
  { name: 'Dr. Kuen-Shiou Yang', nameZh: '楊坤修 博士', title: '理事長', org: '台灣社會創新與永續發展協會 (TSISDA)', country: '台灣', expertise: ['GRI', '中小企業ESG轉型', '永續策略'], avatar: 'YK' },
  { name: 'Ana Torres', nameZh: 'Ana Torres', title: 'Associate Director', org: 'Cleantech to Market (C2M), UC Berkeley', country: '美國', expertise: ['清潔能源', '創業創新', '永續商業模式'], avatar: 'AT' },
  { name: 'Ann-Kristin Zobel', nameZh: 'Ann-Kristin Zobel', title: 'Associate Professor', org: 'University of St. Gallen', country: '瑞士', expertise: ['TCFD', '企業策略', '可持續發展'], avatar: 'AZ' },
  { name: 'Karin Li', nameZh: 'Karin Li', title: 'Behavioral Economist', org: 'Haas School of Business, UC Berkeley', country: '美國', expertise: ['行為經濟學', 'ESG激勵', '碳稅政策'], avatar: 'KL' },
  { name: 'Stan Shih', nameZh: '施振榮', title: 'Chairman', org: 'StanShih Foundation / Acer Group', country: '台灣', expertise: ['企業治理', '微笑曲線', '永續轉型'], avatar: 'SS' },
  { name: 'Dave Rochlin', nameZh: 'Dave Rochlin', title: 'Executive Director', org: 'Innovation, Creativity & Design, UC Berkeley', country: '美國', expertise: ['設計思維', '社會創新', '人權合規'], avatar: 'DR' },
];

const LEVEL_CFG = {
  beginner: { label: '入門', color: '#16a34a', bg: '#dcfce7' },
  intermediate: { label: '進階', color: '#d97706', bg: '#fef3c7' },
  advanced: { label: '高階', color: '#dc2626', bg: '#fef2f2' },
};

const CAT_CFG = {
  E: { label: 'E 環境', color: '#16a34a', bg: '#dcfce7' },
  S: { label: 'S 社會', color: '#7c3aed', bg: '#ede9fe' },
  G: { label: 'G 治理', color: '#d97706', bg: '#fef3c7' },
  General: { label: '通用', color: '#003262', bg: '#dbeafe' },
};

export default function AcademyPage() {
  const [activeTab, setActiveTab] = useState<'courses' | 'instructors' | 'certificate'>('courses');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [catFilter, setCatFilter] = useState('all');

  const filtered = COURSES.filter(c => catFilter === 'all' || c.category === catFilter);
  const completedCount = COURSES.filter(c => c.progress === 100).length;
  const totalHours = COURSES.filter(c => c.progress > 0).reduce((acc, c) => acc + parseInt(c.duration), 0);

  const tabs = [
    { id: 'courses', label: '課程總覽' },
    { id: 'instructors', label: '師資陣容' },
    { id: 'certificate', label: '學習紀錄' },
  ] as const;

  return (
    <div style={{ padding: '24px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #003262, #1a4d7a)', borderRadius: '18px', padding: '28px 32px', marginBottom: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(253,181,21,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-10px', left: '30%', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '15px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={26} color="#FDB515" />
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 900, color: 'white', lineHeight: 1 }}>永續學院</h1>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', marginTop: '4px' }}>Berkeley Haas × TSISDA · ESG Strategy & Innovation Program 2026</p>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            {[
              { label: '課程總數', value: COURSES.length, sub: '門', color: 'white' },
              { label: '已完成', value: completedCount, sub: '門', color: '#86efac' },
              { label: '學習時數', value: totalHours, sub: '小時', color: '#FDB515' },
              { label: '師資', value: INSTRUCTORS.length, sub: '位', color: '#93c5fd' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 14px', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.15)' }}>
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
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: '8px 20px', borderRadius: '7px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', background: activeTab === t.id ? 'white' : 'transparent', color: activeTab === t.id ? '#003262' : '#6b7280', boxShadow: activeTab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── 課程 ── */}
      {activeTab === 'courses' && (
        <>
          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '18px', flexWrap: 'wrap' }}>
            {['all', 'General', 'E', 'S', 'G'].map(c => (
              <button key={c} onClick={() => setCatFilter(c)} style={{ padding: '6px 16px', borderRadius: '8px', border: '1.5px solid', borderColor: catFilter === c ? '#003262' : '#e5e7eb', background: catFilter === c ? '#003262' : 'white', color: catFilter === c ? 'white' : '#374151', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                {c === 'all' ? '全部' : CAT_CFG[c as keyof typeof CAT_CFG].label}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
            {filtered.map(course => {
              const levelCfg = LEVEL_CFG[course.level];
              const catCfg = CAT_CFG[course.category];
              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  style={{ background: 'white', borderRadius: '16px', border: '1.5px solid #e5e7eb', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.2s', opacity: course.locked ? 0.7 : 1 }}
                  onMouseEnter={e => { if (!course.locked) { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,50,98,0.1)'; e.currentTarget.style.borderColor = '#003262'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.transform = 'none'; }}
                >
                  {/* Course Color Bar */}
                  <div style={{ height: '4px', background: `linear-gradient(90deg, #003262, ${course.category === 'E' ? '#22c55e' : course.category === 'S' ? '#7c3aed' : course.category === 'G' ? '#d97706' : '#3b7ea1'})` }} />
                  <div style={{ padding: '18px' }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      <span style={{ padding: '2px 7px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, background: catCfg.bg, color: catCfg.color }}>{catCfg.label}</span>
                      <span style={{ padding: '2px 7px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, background: levelCfg.bg, color: levelCfg.color }}>{levelCfg.label}</span>
                      {course.locked && <span style={{ padding: '2px 7px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, background: '#f3f4f6', color: '#9ca3af' }}>🔒 需解鎖</span>}
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#1a1a2e', marginBottom: '6px', lineHeight: 1.3 }}>{course.title}</h3>
                    <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5, marginBottom: '12px' }}>{course.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#9ca3af', marginBottom: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><User size={11} />{course.instructor}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Clock size={11} />{course.duration}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}><Users size={11} />{course.enrolled}</span>
                    </div>
                    {/* Progress */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', color: '#9ca3af' }}>學習進度</span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: course.progress === 100 ? '#16a34a' : '#003262' }}>{course.progress}%</span>
                      </div>
                      <div style={{ height: '5px', background: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${course.progress}%`, background: course.progress === 100 ? '#22c55e' : 'linear-gradient(90deg, #003262, #3b7ea1)', borderRadius: '3px' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Star size={12} color="#FDB515" fill="#FDB515" />
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#374151' }}>{course.rating}</span>
                      </div>
                      <button style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 14px', background: course.locked ? '#f3f4f6' : course.progress === 100 ? '#dcfce7' : '#003262', color: course.locked ? '#9ca3af' : course.progress === 100 ? '#16a34a' : 'white', border: 'none', borderRadius: '7px', fontSize: '11px', fontWeight: 700, cursor: course.locked ? 'not-allowed' : 'pointer' }}>
                        {course.locked ? <Lock size={11} /> : course.progress === 100 ? <CheckCircle size={11} /> : <Play size={11} />}
                        {course.locked ? '解鎖課程' : course.progress === 100 ? '已完成' : course.progress > 0 ? '繼續學習' : '開始學習'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── 師資 ── */}
      {activeTab === 'instructors' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {INSTRUCTORS.map(ins => (
            <div key={ins.name} style={{ background: 'white', borderRadius: '16px', border: '1.5px solid #e5e7eb', padding: '22px', transition: 'all 0.2s', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,50,98,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ display: 'flex', gap: '14px', marginBottom: '14px' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #003262, #3b7ea1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '16px', fontWeight: 800, flexShrink: 0 }}>
                  {ins.avatar}
                </div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#1a1a2e' }}>{ins.nameZh !== ins.name ? ins.nameZh : ins.name}</div>
                  {ins.nameZh !== ins.name && <div style={{ fontSize: '11px', color: '#9ca3af' }}>{ins.name}</div>}
                  <div style={{ fontSize: '12px', color: '#003262', fontWeight: 600, marginTop: '2px' }}>{ins.title}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '10px', fontSize: '12px', color: '#6b7280' }}>
                <Building2 size={12} style={{ flexShrink: 0, marginTop: '1px' }} />
                {ins.org}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '12px', fontSize: '12px', color: '#9ca3af' }}>
                <Globe size={11} />{ins.country}
              </div>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {ins.expertise.map(e => (
                  <span key={e} style={{ padding: '2px 8px', borderRadius: '5px', fontSize: '11px', fontWeight: 600, background: '#f3f4f6', color: '#374151' }}>{e}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── 學習紀錄 ── */}
      {activeTab === 'certificate' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ background: 'white', borderRadius: '14px', border: '1.5px solid #e5e7eb', padding: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#1a1a2e', marginBottom: '18px' }}>📚 學習進度追蹤</h2>
            {COURSES.map(c => (
              <div key={c.id} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>{c.title}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: c.progress === 100 ? '#16a34a' : '#003262' }}>{c.progress}%</span>
                </div>
                <div style={{ height: '7px', background: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${c.progress}%`, background: c.progress === 100 ? '#22c55e' : 'linear-gradient(90deg, #003262, #3b7ea1)', borderRadius: '4px', transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ background: 'linear-gradient(135deg, #003262, #1a4d7a)', borderRadius: '14px', padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Award size={36} color="#FDB515" />
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: 'white', textAlign: 'center', marginBottom: '6px' }}>永續治理認證</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', textAlign: 'center', marginBottom: '20px' }}>Berkeley Haas × TSISDA ESG Certificate</div>
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '14px 20px', textAlign: 'center', width: '100%' }}>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#FDB515' }}>{completedCount}/{COURSES.length}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', marginTop: '3px' }}>課程完成度</div>
              <div style={{ marginTop: '12px', height: '6px', background: 'rgba(255,255,255,0.15)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(completedCount / COURSES.length) * 100}%`, background: '#FDB515', borderRadius: '3px' }} />
              </div>
            </div>
            <button style={{ marginTop: '16px', padding: '10px 28px', background: '#FDB515', color: '#003262', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}>
              下載結業證書
            </button>
          </div>
        </div>
      )}

      {/* Course Detail Modal */}
      {selectedCourse && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }} onClick={() => setSelectedCourse(null)}>
          <div style={{ background: 'white', borderRadius: '20px', width: '100%', maxWidth: '560px', maxHeight: '85vh', overflow: 'auto', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }} onClick={e => e.stopPropagation()}>
            <div style={{ height: '5px', background: `linear-gradient(90deg, #003262, ${selectedCourse.category === 'E' ? '#22c55e' : selectedCourse.category === 'S' ? '#7c3aed' : '#d97706'})`, borderRadius: '20px 20px 0 0' }} />
            <div style={{ padding: '22px 26px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                  <span style={{ padding: '2px 7px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, background: CAT_CFG[selectedCourse.category].bg, color: CAT_CFG[selectedCourse.category].color }}>{CAT_CFG[selectedCourse.category].label}</span>
                  <span style={{ padding: '2px 7px', borderRadius: '5px', fontSize: '10px', fontWeight: 700, background: LEVEL_CFG[selectedCourse.level].bg, color: LEVEL_CFG[selectedCourse.level].color }}>{LEVEL_CFG[selectedCourse.level].label}</span>
                </div>
                <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#1a1a2e' }}>{selectedCourse.title}</h2>
              </div>
              <button onClick={() => setSelectedCourse(null)} style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', width: '30px', height: '30px', cursor: 'pointer', color: '#6b7280', fontSize: '16px', flexShrink: 0 }}>×</button>
            </div>
            <div style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.6 }}>{selectedCourse.description}</p>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '10px' }}>課程模組 ({selectedCourse.modules.length} 個)</div>
                {selectedCourse.modules.map((m, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', background: '#f9fafb', marginBottom: '6px', fontSize: '13px', color: '#374151' }}>
                    <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#003262', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, flexShrink: 0 }}>{i + 1}</span>
                    {m}
                    {i === 0 && selectedCourse.progress > 0 && <CheckCircle size={13} color="#22c55e" style={{ marginLeft: 'auto' }} />}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                <button style={{ flex: 1, padding: '11px', background: selectedCourse.locked ? '#f3f4f6' : 'linear-gradient(135deg, #003262, #1a4d7a)', color: selectedCourse.locked ? '#9ca3af' : 'white', border: 'none', borderRadius: '10px', fontSize: '13px', fontWeight: 700, cursor: selectedCourse.locked ? 'not-allowed' : 'pointer' }}>
                  {selectedCourse.locked ? '🔒 解鎖課程' : selectedCourse.progress === 100 ? '✅ 重看課程' : selectedCourse.progress > 0 ? '▶ 繼續學習' : '▶ 開始學習'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}