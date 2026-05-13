'use client';
import React, { useState } from 'react';
import { Stethoscope, ChevronRight, CheckCircle, AlertTriangle, XCircle, RotateCcw, Download, TrendingUp, Target, ArrowRight } from 'lucide-react';
import { logAudit } from '../../lib/db';

interface Question {
  id: string;
  category: 'E' | 'S' | 'G';
  text: string;
  gri: string;
  weight: number;
  hint: string;
}

const questions: Question[] = [
  { id: 'e1', category: 'E', text: '是否完成溫室氣體（範疇一、二）盤查並取得第三方查證？', gri: 'GRI 305-1', weight: 10, hint: 'ISO 14064-1 盤查清冊 + 查證聲明書' },
  { id: 'e2', category: 'E', text: '是否有系統化追蹤每月用電量，並設定年度節能目標？', gri: 'GRI 302-1', weight: 8, hint: '台電帳單 + 能源管理系統' },
  { id: 'e3', category: 'E', text: '是否監測總取水量與廢水排放量，並有水資源管理計畫？', gri: 'GRI 303-3', weight: 7, hint: '自來水帳單 + 廢水處理報告' },
  { id: 'e4', category: 'E', text: '是否建立廢棄物分類制度，並定期量化有害/一般廢棄物？', gri: 'GRI 306-3', weight: 6, hint: '廢棄物清運聯單 + 過磅單' },
  { id: 'e5', category: 'E', text: '是否有再生能源使用計畫，或已採購 T-REC 綠電憑證？', gri: 'GRI 302-1', weight: 7, hint: 'T-REC 憑證 + 綠電採購合約' },
  { id: 's1', category: 'S', text: '是否定期統計員工結構（性別、年齡層）並揭露離職率？', gri: 'GRI 401-1', weight: 8, hint: '人資系統匯出報表 + 員工名冊' },
  { id: 's2', category: 'S', text: '是否每年計算失能傷害頻率(FR)並進行工安改善？', gri: 'GRI 403-2', weight: 9, hint: 'ISO 45001 證書 + 職災申報單' },
  { id: 's3', category: 'S', text: '是否有正式的員工培訓制度，並追蹤人均受訓時數？', gri: 'GRI 404-1', weight: 7, hint: '教育訓練簽到表 + 線上課程完課紀錄' },
  { id: 's4', category: 'S', text: '是否對關鍵供應商執行 ESG 評估，並要求簽署永續承諾書？', gri: 'GRI 308-1', weight: 7, hint: '供應商行為準則簽署書 + 稽核評分表' },
  { id: 's5', category: 'S', text: '是否建立多元共融(DEI)政策，並監測男女薪酬比？', gri: 'GRI 405-2', weight: 6, hint: '薪資結算表 + DEI 政策文件' },
  { id: 'g1', category: 'G', text: '是否有獨立董事，且董事會定期審查 ESG 風險與績效？', gri: 'GRI 2-9', weight: 9, hint: '董事會名冊 + 會議紀錄' },
  { id: 'g2', category: 'G', text: '是否有正式的反腐敗政策，並對員工進行誠信培訓？', gri: 'GRI 205-2', weight: 8, hint: '內部稽核報告 + 申訴管道紀錄' },
  { id: 'g3', category: 'G', text: '是否完成重大性評估，識別利害關係人最關注的 ESG 議題？', gri: 'GRI 3-1', weight: 9, hint: '利害關係人問卷 + 重大議題決策紀錄' },
  { id: 'g4', category: 'G', text: '是否揭露稅務資訊（有效稅率、各司法管轄區繳稅情形）？', gri: 'GRI 207-1', weight: 6, hint: '財務報告 + 稅務申報書' },
  { id: 'g5', category: 'G', text: '是否有資訊安全管理制度（如 ISO 27001）並定期進行演練？', gri: 'GRI 418-1', weight: 7, hint: 'ISO 27001 證書 + 資安演練紀錄' },
];

type Answer = 'yes' | 'partial' | 'no' | null;

const answerConfig = {
  yes:     { label: '已完成',   score: 1.0,  color: 'var(--success)',  bg: 'var(--success-light)',  icon: CheckCircle },
  partial: { label: '部分完成', score: 0.5,  color: 'var(--warning)',  bg: 'var(--warning-light)',  icon: AlertTriangle },
  no:      { label: '尚未完成', score: 0.0,  color: 'var(--danger)',   bg: 'var(--danger-light)',   icon: XCircle },
};

export default function HealthCheckPage() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleAnswer = (id: string, val: Answer) => {
    setAnswers(prev => ({ ...prev, [id]: val }));
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(s => s + 1), 280);
    }
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    await logAudit({
      action: 'HEALTH_CHECK',
      resource: 'ESG 企業健檢',
      user_name: 'User',
      t5_tag: 'T1+T5',
      details: `完成 15 題健檢，得分 ${calcTotal().toFixed(0)}%`,
    });
  };

  const calcCategory = (cat: 'E' | 'S' | 'G') => {
    const qs = questions.filter(q => q.category === cat);
    const total = qs.reduce((s, q) => s + q.weight, 0);
    const score = qs.reduce((s, q) => {
      const a = answers[q.id];
      return s + q.weight * (a ? answerConfig[a].score : 0);
    }, 0);
    return total > 0 ? Math.round((score / total) * 100) : 0;
  };

  const calcTotal = () => {
    const total = questions.reduce((s, q) => s + q.weight, 0);
    const score = questions.reduce((s, q) => {
      const a = answers[q.id];
      return s + q.weight * (a ? answerConfig[a].score : 0);
    }, 0);
    return total > 0 ? Math.round((score / total) * 100) : 0;
  };

  const gaps = questions.filter(q => answers[q.id] === 'no' || answers[q.id] === 'partial')
    .sort((a, b) => b.weight - a.weight).slice(0, 5);

  const totalScore = calcTotal();
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / questions.length) * 100);

  const scoreLevel = totalScore >= 80 ? { label: '優異', color: 'var(--success)', bg: 'var(--success-light)' }
    : totalScore >= 60 ? { label: '良好', color: 'var(--warning)', bg: 'var(--warning-light)' }
    : totalScore >= 40 ? { label: '需改善', color: '#d97706', bg: '#fef3cd' }
    : { label: '急需補強', color: 'var(--danger)', bg: 'var(--danger-light)' };

  if (submitted) {
    return (
      <div className="page-container animate-fade-in">
        <div className="page-header">
          <div className="page-header-inner">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--berkeley-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Stethoscope size={18} color="#fff" />
                </div>
                <h1 className="page-title">健檢報告</h1>
              </div>
              <div className="page-subtitle">
                <span className="badge badge-green">評估完成</span>
                <span className="gri-chip">GRI 2021</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => { setSubmitted(false); setAnswers({}); setCurrentStep(0); }}>
                <RotateCcw size={14} />重新評估
              </button>
              <button className="btn btn-primary btn-sm"><Download size={14} />下載報告</button>
            </div>
          </div>
        </div>

        {/* Score Banner */}
        <div style={{ background: 'var(--berkeley-blue)', borderRadius: 16, padding: '28px 32px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 64, fontWeight: 800, color: 'var(--california-gold)', lineHeight: 1 }}>{totalScore}</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>總分 / 100</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, padding: '4px 12px', background: scoreLevel.bg, borderRadius: 20 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: scoreLevel.color }}>{scoreLevel.label}</span>
            </div>
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {(['E', 'S', 'G'] as const).map(cat => {
              const score = calcCategory(cat);
              const labels = { E: '環境面', S: '社會面', G: '治理面' };
              const colors = { E: '#4ade80', S: '#60a5fa', G: '#c084fc' };
              return (
                <div key={cat} style={{ textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.08)', borderRadius: 12 }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: colors[cat] }}>{score}%</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{labels[cat]}</div>
                  <div style={{ marginTop: 8, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${score}%`, background: colors[cat], borderRadius: 2, transition: 'width 1s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
          {/* Gap Analysis */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>缺口分析與改善建議</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>依權重排序的前 5 大改善優先項目</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {gaps.map((q, i) => {
                const a = answers[q.id] || 'no';
                const ac = answerConfig[a];
                return (
                  <div key={q.id} style={{ display: 'flex', gap: 14, padding: '14px 16px', background: 'var(--bg-tertiary)', borderRadius: 10, border: `1px solid ${ac.color}30` }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: ac.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: ac.color }}>#{i + 1}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{q.text}</span>
                        <span className="gri-chip">{q.gri}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                        <span style={{ color: ac.color, fontWeight: 600 }}>{ac.label}</span> · 建議文件：{q.hint}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className={`badge ${a === 'partial' ? 'badge-gold' : 'badge-red'}`}>權重 {q.weight}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <ArrowRight size={11} />前往改善
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 90-Day Roadmap */}
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Target size={15} color="var(--berkeley-blue)" />90 天改善路線圖
            </h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>依優先序排列的行動計畫</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { phase: '第 1-30 天', label: '立即行動', items: gaps.slice(0, 2).map(g => g.gri), color: 'var(--danger)' },
                { phase: '第 31-60 天', label: '短期改善', items: gaps.slice(2, 4).map(g => g.gri), color: 'var(--warning)' },
                { phase: '第 61-90 天', label: '中期佈局', items: gaps.slice(4, 5).map(g => g.gri), color: 'var(--success)' },
              ].map((phase, i) => (
                <div key={i} style={{ padding: '12px 14px', background: 'var(--bg-tertiary)', borderRadius: 8, borderLeft: `3px solid ${phase.color}` }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: phase.color, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 4 }}>{phase.phase}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{phase.label}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {phase.items.length > 0 ? phase.items.map(g => <span key={g} className="gri-chip">{g}</span>) : <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>無待改善項目</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="alert alert-info" style={{ marginTop: 16, fontSize: 12 }}>
              <TrendingUp size={13} />
              <span>預估完成後合規率可提升至 <strong>{Math.min(95, totalScore + 20)}%</strong></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentStep];

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <div className="page-header-inner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--berkeley-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Stethoscope size={18} color="#fff" />
              </div>
              <h1 className="page-title">ESG 企業健檢</h1>
            </div>
            <div className="page-subtitle">
              <span className="badge badge-blue">Health Check</span>
              <span className="badge badge-gold">15 題評估</span>
              <span style={{ color: 'var(--text-muted)' }}>· 90 天改善路線圖</span>
            </div>
          </div>
          {answeredCount === questions.length && (
            <button className="btn btn-primary" onClick={handleSubmit}>
              <TrendingUp size={14} />查看健檢報告
            </button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500 }}>評估進度</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--berkeley-blue)' }}>{answeredCount} / {questions.length}</span>
        </div>
        <div className="progress-bar" style={{ height: 8 }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          {(['E', 'S', 'G'] as const).map(cat => {
            const catQs = questions.filter(q => q.category === cat);
            const catAnswered = catQs.filter(q => answers[q.id]).length;
            const labels = { E: '環境', S: '社會', G: '治理' };
            const colors = { E: '#059669', S: '#2563eb', G: '#7c3aed' };
            return (
              <div key={cat} style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{labels[cat]}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: colors[cat] }}>{catAnswered}/{catQs.length}</span>
                </div>
                <div className="progress-bar" style={{ height: 4 }}>
                  <div className="progress-fill" style={{ width: `${(catAnswered / catQs.length) * 100}%`, background: colors[cat] }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20 }}>
        {/* Current Question */}
        <div>
          <div className="card" style={{ padding: 28, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <span style={{ width: 28, height: 28, borderRadius: 7, background: currentQ.category === 'E' ? '#e8f5ee' : currentQ.category === 'S' ? '#e8f0fb' : '#f0e8f7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: currentQ.category === 'E' ? '#059669' : currentQ.category === 'S' ? '#2563eb' : '#7c3aed' }}>{currentQ.category}</span>
              <span className="gri-chip">{currentQ.gri}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>第 {currentStep + 1} / {questions.length} 題</span>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.5, color: 'var(--text-primary)', marginBottom: 24 }}>{currentQ.text}</h2>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 24, padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 8 }}>
              <span style={{ fontWeight: 600 }}>佐證文件：</span>{currentQ.hint}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {(['yes', 'partial', 'no'] as const).map(val => {
                const ac = answerConfig[val];
                const selected = answers[currentQ.id] === val;
                const Icon = ac.icon;
                return (
                  <button key={val} onClick={() => handleAnswer(currentQ.id, val)} style={{
                    padding: '16px 12px',
                    border: `2px solid ${selected ? ac.color : 'var(--border-light)'}`,
                    borderRadius: 12,
                    background: selected ? ac.bg : 'var(--bg-card)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit',
                  }}>
                    <Icon size={22} color={selected ? ac.color : 'var(--text-muted)'} style={{ marginBottom: 8 }} />
                    <div style={{ fontSize: 13, fontWeight: 600, color: selected ? ac.color : 'var(--text-secondary)' }}>{ac.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn btn-secondary" onClick={() => setCurrentStep(s => Math.max(0, s - 1))} disabled={currentStep === 0}>
              ← 上一題
            </button>
            <div style={{ display: 'flex', gap: 6 }}>
              {questions.map((q, i) => (
                <button key={q.id} onClick={() => setCurrentStep(i)} style={{
                  width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 700,
                  background: i === currentStep ? 'var(--berkeley-blue)' : answers[q.id] ? (answers[q.id] === 'yes' ? 'var(--success)' : answers[q.id] === 'partial' ? 'var(--california-gold)' : 'var(--danger)') : 'var(--bg-tertiary)',
                  color: i === currentStep || answers[q.id] ? '#fff' : 'var(--text-muted)',
                }} title={q.gri}>{i + 1}</button>
              ))}
            </div>
            <button className="btn btn-primary" onClick={() => setCurrentStep(s => Math.min(questions.length - 1, s + 1))} disabled={currentStep === questions.length - 1}>
              下一題 →
            </button>
          </div>
        </div>

        {/* Score Preview */}
        <div className="card" style={{ padding: 20, height: 'fit-content' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>即時分數預覽</h3>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 52, fontWeight: 800, color: totalScore >= 60 ? 'var(--success)' : totalScore >= 40 ? 'var(--warning)' : 'var(--danger)', lineHeight: 1 }}>{totalScore}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>預估總分</div>
          </div>
          {(['E', 'S', 'G'] as const).map(cat => {
            const score = calcCategory(cat);
            const labels = { E: '環境', S: '社會', G: '治理' };
            const colors = { E: '#059669', S: '#2563eb', G: '#7c3aed' };
            return (
              <div key={cat} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{labels[cat]} ({cat})</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: colors[cat] }}>{score}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${score}%`, background: colors[cat] }} />
                </div>
              </div>
            );
          })}
          {answeredCount === questions.length && (
            <button className="btn btn-primary w-full" style={{ marginTop: 16 }} onClick={handleSubmit}>
              <ChevronRight size={16} />生成健檢報告
            </button>
          )}
        </div>
      </div>
    </div>
  );
}