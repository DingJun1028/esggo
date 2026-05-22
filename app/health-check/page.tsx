'use client';
import { useState } from 'react';
import { CheckCircle, AlertCircle, BarChart3, ArrowRight, Lightbulb, Shield, Users, Leaf } from 'lucide-react';
import { BrandCard, BrandButton, BrandBadge, BrandProgress } from '../../components/brand';

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
      <div className="page-container max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#003262]">企業 ESG 健檢結果</h1>
            <p className="text-slate-500">Enterprise Health Check · Phase 2 Active</p>
          </div>
          <BrandButton variant="secondary" onClick={() => { setSubmitted(false); setAnswers({}); }}>
            重新健檢
          </BrandButton>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <BrandCard padding="md" className="text-center">
            <div style={{ fontSize: '2rem', fontWeight: 800, color: score >= 70 ? 'var(--green-600)' : score >= 40 ? 'var(--gold-600)' : 'var(--red-600)' }}>
              {score}%
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase">綜合得分</p>
          </BrandCard>
          <BrandCard padding="md" className="text-center">
            <div className="text-xl font-bold text-[#003262]">{eScore}%</div>
            <p className="text-xs font-bold text-slate-400 uppercase">環境面 (E)</p>
          </BrandCard>
          <BrandCard padding="md" className="text-center">
            <div className="text-xl font-bold text-[#3b7ea1]">{sScore}%</div>
            <p className="text-xs font-bold text-slate-400 uppercase">社會面 (S)</p>
          </BrandCard>
          <BrandCard padding="md" className="text-center">
            <div className="text-xl font-bold text-[#FDB515]">{gScore}%</div>
            <p className="text-xs font-bold text-slate-400 uppercase">治理面 (G)</p>
          </BrandCard>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BrandCard padding="md">
            <div className="mb-4 text-lg font-bold text-[#003262]">缺口分析</div>
            {gaps.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle size={40} className="mx-auto text-green-500 mb-2" />
                <p className="text-green-600 font-bold">所有項目均已完成！</p>
              </div>
            ) : (
              <div className="space-y-3">
                {gaps.slice(0, 5).map(q => (
                  <div key={q.id} className="p-3 bg-slate-50 rounded-lg border-l-4 border-red-500">
                    <div className="flex items-center gap-2 mb-1">
                      <BrandBadge variant="error" size="xs">{q.category}</BrandBadge>
                      <span className="text-[10px] font-bold text-slate-400">{q.gri}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">{q.text}</p>
                  </div>
                ))}
                {gaps.length > 5 && <p className="text-center text-[10px] text-slate-400">...以及另外 {gaps.length - 5} 項缺口</p>}
              </div>
            )}
          </BrandCard>

          <BrandCard padding="md">
             <div className="mb-4 text-lg font-bold text-[#003262]">90 天改善建議</div>
             <div className="space-y-4">
                {[
                  { period: '第 1 個月', tasks: gaps.filter(q => q.category === 'G').slice(0, 2).map(q => q.gri), variant: 'gold' },
                  { period: '第 2 個月', tasks: gaps.filter(q => q.category === 'E').slice(0, 2).map(q => q.gri), variant: 'success' },
                  { period: '第 3 個月', tasks: gaps.filter(q => q.category === 'S').slice(0, 2).map(q => q.gri), variant: 'purple' },
                ].map(phase => (
                  <div key={phase.period}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-slate-300" />
                      <span className="text-sm font-bold text-slate-700">{phase.period}</span>
                    </div>
                    <div className="pl-4 space-y-1">
                      {phase.tasks.length > 0 ? (
                        phase.tasks.map(t => <p key={t} className="text-xs text-slate-500">• 完成 {t} 揭露與存證</p>)
                      ) : (
                        <p className="text-xs text-green-500">✓ 此面向無明顯缺口</p>
                      )}
                    </div>
                  </div>
                ))}
             </div>
          </BrandCard>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#003262] mb-1">企業 ESG 健檢</h1>
          <p className="text-sm text-slate-500">遵循 Berkeley Design System · Phase 2 治理架構</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase">進度</p>
            <p className="text-sm font-bold text-[#003262]">{answeredCount} / {questions.length}</p>
          </div>
          <BrandButton
            variant="primary"
            onClick={() => setSubmitted(true)}
            disabled={answeredCount < questions.length}
          >
            提交分析
          </BrandButton>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { key: 'ALL', label: '全部', icon: <BarChart3 size={14} />, variant: 'outline' },
          { key: 'E', label: '環境', icon: <Leaf size={14} />, variant: 'success' },
          { key: 'S', label: '社會', icon: <Users size={14} />, variant: 'purple' },
          { key: 'G', label: '治理', icon: <Shield size={14} />, variant: 'gold' },
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
              activeCategory === cat.key ? 'border-[#003262] bg-[#EBF2FA]' : 'border-slate-100 bg-white hover:border-slate-200'
            }`}
          >
            <div className={activeCategory === cat.key ? 'text-[#003262]' : 'text-slate-400'}>{cat.icon}</div>
            <span className={`text-xs font-bold mt-1 ${activeCategory === cat.key ? 'text-[#003262]' : 'text-slate-500'}`}>{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredQuestions.map((q, idx) => (
          <BrandCard key={q.id} hover padding="md" className={answers[q.id] ? 'border-l-4 border-green-500' : ''}>
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                {idx + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BrandBadge variant={q.category === 'E' ? 'success' : q.category === 'S' ? 'purple' : 'gold'} size="xs">
                    {q.category} 類別
                  </BrandBadge>
                  <span className="text-[10px] font-bold text-slate-400">{q.gri}</span>
                </div>
                <p className="text-slate-800 font-semibold text-sm mb-4">{q.text}</p>
                <div className="flex gap-2">
                  {options.map(opt => (
                    <BrandButton
                      key={opt.value}
                      variant={answers[q.id] === opt.value ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => handleAnswer(q.id, opt.value)}
                    >
                      {opt.label}
                    </BrandButton>
                  ))}
                </div>
              </div>
              {answers[q.id] && <CheckCircle size={18} className="text-green-500 mt-1" />}
            </div>
          </BrandCard>
        ))}
      </div>

      {answeredCount > 0 && !submitted && (
        <div className="sticky bottom-6 mt-12">
          <BrandCard padding="sm" shadow="lg" className="bg-[#003262] text-white border-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Lightbulb size={20} className="text-[#FDB515]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/60 uppercase">預估得分</p>
                  <p className="text-xl font-bold">{calcTotal()}%</p>
                </div>
              </div>
              <BrandButton variant="secondary" onClick={() => setSubmitted(true)} disabled={answeredCount < questions.length}>
                立即提交分析
              </BrandButton>
            </div>
          </BrandCard>
        </div>
      )}
    </div>
  );
}
