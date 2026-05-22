'use client';
import { useState } from 'react';
import { CheckCircle, AlertCircle, BarChart3, ArrowRight, Lightbulb, Shield, Users, Leaf } from 'lucide-react';

const questions = [
  { id: 1, category: 'E', gri: 'GRI 305-1', text: '貴公司是否已完成溫室氣體範疇一盤查？', weight: 10 },
  { id: 2, category: 'E', gri: 'GRI 302-1', text: '是否定期追蹤並申報能源消耗數據？', weight: 8 },
  { id: 3, category: 'E', gri: 'GRI 303-1', text: '是否建立用水量統計與節水目標？', weight: 7 },
  { id: 4, category: 'E', gri: 'GRI 306-2', text: '是否有廢棄物管理政策與紀錄？', weight: 6 },
  { id: 5, category: 'E', gri: 'TCFD', text: '是否進行氣候風險評估與情境分析？', weight: 9 },
  { id: 6, category: 'S', gri: 'GRI 401-1', text: '是否定期揭露員工新進與離職率？', weight: 7 },
  { id: 7, category: 'S', gri: 'GRI 403-1', text: '是否建立職業安全衛生管理系統？', weight: 9 },
  { id: 8, category: 'S', gri: 'GRI 404-1', text: '是否追蹤員工平均培訓時數？', weight: 6 },
  { id: 9, category: 'S', gri: 'GRI 405-1', text: '是否推動多元平等包容（DEI）政策？', weight: 7 },
  { id: 10, category: 'S', gri: 'GRI 413-1', text: '是否有社區投資與公益活動計畫？', weight: 5 },
  { id: 11, category: 'G', gri: 'GRI 2-9', text: '董事會是否具備獨立董事且定期開會？', weight: 9 },
  { id: 12, category: 'G', gri: 'GRI 205-1', text: '是否建立反貪腐政策與訓練機制？', weight: 8 },
  { id: 13, category: 'G', gri: 'GRI 207-1', text: '是否揭露稅務策略與繳稅地區分佈？', weight: 6 },
  { id: 14, category: 'G', gri: 'GRI 2-25', text: '是否設有吹哨者保護與申訴機制？', weight: 7 },
  { id: 15, category: 'G', gri: 'GRI 3-1', text: '是否完成重大性評估並建立矩陣？', weight: 8 },
];

const options = [
  { value: 'yes', label: '已完成', score: 1 },
  { value: 'partial', label: '部分完成', score: 0.5 },
  { value: 'no', label: '尚未開始', score: 0 },
];

export default function HealthCheckPage() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const handleAnswer = (id: number, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const calcTotal = () => {
    let earned = 0, total = 0;
    questions.forEach(q => {
      total += q.weight;
      const ans = answers[q.id];
      const opt = options.find(o => o.value === ans);
      if (opt) earned += q.weight * opt.score;
    });
    return total > 0 ? Math.round((earned / total) * 100) : 0;
  };

  const calcCategoryScore = (cat: string) => {
    const qs = questions.filter(q => q.category === cat);
    let earned = 0, total = 0;
    qs.forEach(q => {
      total += q.weight;
      const opt = options.find(o => o.value === answers[q.id]);
      if (opt) earned += q.weight * opt.score;
    });
    return total > 0 ? Math.round((earned / total) * 100) : 0;
  };

  const getGaps = () => questions.filter(q => !answers[q.id] || answers[q.id] === 'no');

  const filteredQuestions = activeCategory === 'ALL'
    ? questions
    : questions.filter(q => q.category === activeCategory);

  const score = calcTotal();
  const answeredCount = Object.keys(answers).length;

  if (submitted) {
    const gaps = getGaps();
    const eScore = calcCategoryScore('E');
    const sScore = calcCategoryScore('S');
    const gScore = calcCategoryScore('G');

    return (
      <div className="page-container">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">企業 ESG 健檢結果</h1>
            <p className="page-subtitle">Enterprise Health Check · GRI 2021 Framework · 5T Protocol</p>
          </div>
          <button onClick={() => { setSubmitted(false); setAnswers({}); }} className="btn btn-secondary">
            重新健檢
          </button>
        </div>

        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '1.5rem' }}>
          <div className="stat-card">
            <div className="stat-value" style={{ fontSize: '2.5rem', color: score >= 70 ? '#22c55e' : score >= 40 ? '#f59e0b' : '#ef4444' }}>
              {score}%
            </div>
            <div className="stat-label">綜合得分</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#003262' }}>{eScore}%</div>
            <div className="stat-label">環境面 (E)</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#3b7ea1' }}>{sScore}%</div>
            <div className="stat-label">社會面 (S)</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#FDB515' }}>{gScore}%</div>
            <div className="stat-label">治理面 (G)</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title"><AlertCircle size={16} style={{ display: 'inline', marginRight: 6 }} />缺口分析 ({gaps.length} 項)</h3>
            </div>
            <div className="card-body">
              {gaps.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#22c55e', padding: '2rem' }}>
                  <CheckCircle size={40} style={{ margin: '0 auto 1rem' }} />
                  <p>所有項目均已完成！</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {gaps.map(q => (
                    <div key={q.id} style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 8, borderLeft: '3px solid #ef4444' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span className="badge badge-red">{q.category}</span>
                        <span style={{ fontSize: '0.75rem', color: '#003262', fontWeight: 600 }}>{q.gri}</span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', margin: 0 }}>{q.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title"><ArrowRight size={16} style={{ display: 'inline', marginRight: 6 }} />90 天改善路線圖</h3>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { period: '第 1 個月', tasks: gaps.filter(q => q.category === 'G').slice(0, 2).map(q => q.gri), color: '#003262' },
                  { period: '第 2 個月', tasks: gaps.filter(q => q.category === 'E').slice(0, 2).map(q => q.gri), color: '#3b7ea1' },
                  { period: '第 3 個月', tasks: gaps.filter(q => q.category === 'S').slice(0, 2).map(q => q.gri), color: '#22c55e' },
                ].map(phase => (
                  <div key={phase.period} style={{ padding: '0.75rem', background: 'var(--bg-secondary)', borderRadius: 8 }}>
                    <div style={{ fontWeight: 600, color: phase.color, marginBottom: '0.5rem' }}>{phase.period}</div>
                    {phase.tasks.length > 0 ? (
                      phase.tasks.map(t => <div key={t} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>• 完成 {t} 相關揭露</div>)
                    ) : (
                      <div style={{ fontSize: '0.8rem', color: '#22c55e' }}>✓ 此面向已完善</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">企業 ESG 健檢</h1>
          <p className="page-subtitle">Enterprise Health Check · GRI 2021 · 15 題自評 · 5T Protocol</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {answeredCount} / {questions.length} 已作答
          </span>
          <button
            onClick={() => setSubmitted(true)}
            disabled={answeredCount < questions.length}
            className="btn btn-primary"
          >
            提交健檢
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { key: 'ALL', label: '全部', count: questions.length, icon: <BarChart3 size={16} /> },
          { key: 'E', label: '環境', count: questions.filter(q => q.category === 'E').length, icon: <Leaf size={16} /> },
          { key: 'S', label: '社會', count: questions.filter(q => q.category === 'S').length, icon: <Users size={16} /> },
          { key: 'G', label: '治理', count: questions.filter(q => q.category === 'G').length, icon: <Shield size={16} /> },
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className="stat-card"
            style={{
              cursor: 'pointer',
              border: activeCategory === cat.key ? '2px solid var(--berkeley-blue)' : '1px solid var(--border-light)',
              background: activeCategory === cat.key ? 'var(--berkeley-blue)' : 'var(--bg-card)',
              color: activeCategory === cat.key ? '#fff' : 'var(--text-primary)',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              {cat.icon}
              <span style={{ fontWeight: 600 }}>{cat.label}</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{cat.count} 題</div>
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredQuestions.map((q, idx) => (
          <div key={q.id} className="card">
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ minWidth: 32, height: 32, borderRadius: '50%', background: 'var(--berkeley-blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 700 }}>
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span className={`badge ${q.category === 'E' ? 'badge-green' : q.category === 'S' ? 'badge-blue' : 'badge-yellow'}`}>
                      {q.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#003262', fontWeight: 600 }}>{q.gri}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>權重 {q.weight}</span>
                  </div>
                  <p style={{ fontWeight: 500, marginBottom: '1rem', color: 'var(--text-primary)' }}>{q.text}</p>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {options.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(q.id, opt.value)}
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: 8,
                          border: answers[q.id] === opt.value ? '2px solid var(--berkeley-blue)' : '1px solid var(--border-light)',
                          background: answers[q.id] === opt.value
                            ? opt.value === 'yes' ? '#dcfce7' : opt.value === 'partial' ? '#fef9c3' : '#fee2e2'
                            : 'var(--bg-secondary)',
                          color: answers[q.id] === opt.value ? '#000' : 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontWeight: answers[q.id] === opt.value ? 600 : 400,
                          fontSize: '0.875rem',
                          transition: 'all 0.15s',
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                {answers[q.id] && (
                  <CheckCircle size={20} color={answers[q.id] === 'yes' ? '#22c55e' : answers[q.id] === 'partial' ? '#f59e0b' : '#ef4444'} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {answeredCount > 0 && (
        <div style={{ position: 'sticky', bottom: 24, marginTop: '2rem' }}>
          <div className="card" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 8px 32px rgba(0,50,98,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Lightbulb size={20} color="#FDB515" />
              <span style={{ fontWeight: 600 }}>目前預估得分：<span style={{ color: 'var(--berkeley-blue)', fontSize: '1.25rem' }}>{calcTotal()}%</span></span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>（已回答 {answeredCount}/{questions.length} 題）</span>
            </div>
            <button
              onClick={() => setSubmitted(true)}
              disabled={answeredCount < questions.length}
              className="btn btn-primary"
            >
              提交並查看結果
            </button>
          </div>
        </div>
      )}
    </div>
  );
}