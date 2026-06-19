import React, { useState, useEffect } from 'react';
import { socialEconomyService } from '../services/socialEconomyService';
import { type CareerProfile, CareerPath } from '../../shared/types';
import { useNavigate } from 'react-router-dom';

// SJT (Situational Judgement Test) Questions - 2024 Focus: Autonomous Action
const ASSESSMENT_QUESTIONS = [
  {
    id: 1,
    scenario:
      '【情境一：社區衝突】\n您的團隊正計劃在一個老舊社區推動「綠色屋頂」計畫，但遭到當地居民強烈反對，認為會影響建築結構安全。',
    question: '作為專案負責人，您當下的第一反應行動是？',
    options: [
      {
        text: '立即暫停計畫，邀請結構技師進行第三方檢測，並公開數據報告。',
        type: 'Competence', // 側重專業職能
        score: { e: 2, s: 1, g: 2 },
      },
      {
        text: '舉辦居民座談會，深入了解他們的恐懼源頭，並尋找共贏的替代方案。',
        type: 'Values', // 側重價值觀
        score: { e: 1, s: 3, g: 1 },
      },
      {
        text: '重新檢視法規與補助條款，確保計畫執行的合法性與強制力。',
        type: 'Behavior', // 側重外顯行為 (合規)
        score: { e: 0, s: 1, g: 4 },
      },
    ],
  },
  {
    id: 2,
    scenario:
      '【情境二：道德困境】\n您的供應商被爆出使用童工，但他們提供的原料是目前市場上最環保且成本最低的選擇，更換供應商將導致公司虧損。',
    question: '面對這個兩難，您會如何抉擇？',
    options: [
      {
        text: '堅守道德底線，立即終止合約，並對外說明原因承擔短期虧損。',
        type: 'Values',
        score: { e: 1, s: 2, g: 3 }, // High G/S
      },
      {
        text: '暫維持合約，但要求供應商限期改善，並派駐人員進行現場輔導。',
        type: 'Competence',
        score: { e: 2, s: 3, g: 1 }, // High S (Engagement)
      },
      {
        text: '加速研發替代原料技術，試圖從根本上解決對特定供應商的依賴。',
        type: 'Behavior',
        score: { e: 4, s: 0, g: 1 }, // High E (Tech)
      },
    ],
  },
  {
    id: 3,
    scenario:
      '【情境三：自主行動】\n公司給予您一筆預算進行 ESG 專案，沒有任何限制與 KPI，完全由您自主決定。',
    question: '您會優先投入哪個方向？',
    options: [
      {
        text: '投入碳捕捉技術研發，這是對未來地球最迫切的投資。',
        type: 'Behavior',
        score: { e: 5, s: 0, g: 0 },
      },
      {
        text: '建立員工心理健康支持系統，因為人才是企業永續的根本。',
        type: 'Values',
        score: { e: 0, s: 5, g: 0 },
      },
      {
        text: '優化供應鏈透明度平台，建立業界信任的標竿。',
        type: 'Competence',
        score: { e: 0, s: 0, g: 5 },
      },
    ],
  },
  {
    id: 4,
    scenario:
      '【情境四：冰山之下】\n在面試一位能力極強但曾經有過誠信爭議的求職者時，您最看重的是？',
    question: '您會如何評估是否錄用？',
    options: [
      {
        text: '看重其專業能力能否為公司帶來立即效益，並透過嚴格合約約束。',
        type: 'Behavior',
        score: { e: 3, s: 0, g: 1 },
      },
      {
        text: '深入面談其過去爭議的動機與反思，確認其價值觀是否已轉變。',
        type: 'Values',
        score: { e: 1, s: 2, g: 4 },
      },
      {
        text: '諮詢團隊成員意見，評估其加入對團隊氛圍的潛在影響。',
        type: 'Competence',
        score: { e: 0, s: 4, g: 1 },
      },
    ],
  },
];

export const CareerCenter: React.FC = () => {
  const navigate = useNavigate();
  const [career, setCareer] = useState<CareerProfile | null>(null);
  const [step, setStep] = useState<'welcome' | 'quiz' | 'analyzing' | 'result' | 'dashboard'>(
    'welcome'
  );
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [accumulatedScore, setAccumulatedScore] = useState({ e: 0, s: 0, g: 0 });

  const loadData = async () => {
    const c = await socialEconomyService.getCareerProfile('partner_1');
    if (c) {
      setCareer(c);
      setStep('dashboard'); // User already has career
    } else {
      setStep('welcome'); // User needs assessment
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAnswer = (score: { e: number; s: number; g: number }) => {
    const newScore = {
      e: accumulatedScore.e + score.e,
      s: accumulatedScore.s + score.s,
      g: accumulatedScore.g + score.g,
    };
    setAccumulatedScore(newScore);

    if (currentQIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      finishAssessment(newScore);
    }
  };

  const finishAssessment = async (finalScore: { e: number; s: number; g: number }) => {
    setStep('analyzing');

    // Mock analyzing delay (longer for Iceberg effect)
    await new Promise(r => setTimeout(r, 4000));

    try {
      const newCareer = await socialEconomyService.submitAssessment('partner_1', finalScore);
      setCareer(newCareer);
      setStep('result');
    } catch (e: any) {
      alert(e.message);
      setStep('welcome');
    }
  };

  // --- RENDERERS ---

  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto px-4">
      <div className="mb-4 inline-block px-4 py-1 rounded-full border border-emerald-500/30 text-emerald-400 text-sm tracking-wider uppercase">
        Since 2004 • Holistic Education
      </div>

      <h1 className="text-5xl md:text-6xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-500 max-w-2xl leading-tight">
        全人教育測評系統
        <span className="block text-xl md:text-2xl font-normal text-slate-400 mt-4 tracking-normal">
          Holistic Education Assessment
        </span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
          <div className="text-4xl mb-4">🌱</div>
          <h3 className="text-xl font-bold text-white mb-2">身心靈整全</h3>
          <p className="text-slate-400 text-sm">Wholeness</p>
          <div className="mt-2 text-xs text-slate-500">內在價值與外顯行為的一致性</div>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
          <div className="text-4xl mb-4">🤝</div>
          <h3 className="text-xl font-bold text-white mb-2">相互成全</h3>
          <p className="text-slate-400 text-sm">Synergy</p>
          <div className="mt-2 text-xs text-slate-500">人際協作與組織價值鏈結</div>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
          <div className="text-4xl mb-4">🌍</div>
          <h3 className="text-xl font-bold text-white mb-2">影響全部人</h3>
          <p className="text-slate-400 text-sm">Impact</p>
          <div className="mt-2 text-xs text-slate-500">社會創新與全域影響力</div>
        </div>
      </div>

      <div className="bg-slate-900/80 p-6 rounded-xl border-l-4 border-amber-400 text-left max-w-2xl mb-8">
        <h4 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
          <span className="text-xl">⚠️</span> SJT 情境式測評說明
        </h4>
        <p className="text-slate-300 text-sm leading-relaxed">
          本測評採用 **SJT (Situational Judgement Test)** 方法論，源自1873年美國文官體系。
          請根據您在真實情境下的 **「直覺行動」**
          作答。我們將分析您的冰山下潛能，而非社會期許的標準答案。
          <br />
          <br />
          <span className="text-white font-bold">2024 年度重點：年輕世代自主行動力</span>
        </p>
      </div>

      <button
        onClick={() => setStep('quiz')}
        className="group relative px-10 py-5 bg-emerald-600 rounded-full text-xl font-bold shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] hover:scale-105 transition-all overflow-hidden"
      >
        <span className="relative z-10 text-white group-hover:tracking-widest transition-all">
          開始測評
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </button>
    </div>
  );

  const renderQuiz = () => {
    const q = ASSESSMENT_QUESTIONS[currentQIndex];
    if (!q) return null;
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto px-4">
        {/* Progress */}
        <div className="w-full mb-8 max-w-2xl">
          <div className="flex justify-between text-xs text-slate-500 mb-2 font-mono">
            <span>
              SCENARIO {currentQIndex + 1} / {ASSESSMENT_QUESTIONS.length}
            </span>
            <span>SJT PROTOCOL</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${((currentQIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="w-full bg-slate-800 rounded-2xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <span className="text-9xl font-serif">Q{currentQIndex + 1}</span>
          </div>

          <div className="relative z-10">
            <h3 className="text-slate-400 text-sm mb-4 font-bold tracking-wider">CONTEXT</h3>
            <p className="text-xl text-white leading-relaxed whitespace-pre-line mb-8 border-l-4 border-cyan-500 pl-4">
              {q.scenario}
            </p>

            <h3 className="text-emerald-400 text-lg font-bold mb-6 flex items-center gap-2">
              <span>⚡</span> {q.question}
            </h3>

            <div className="space-y-4">
              {q.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt.score)}
                  className="w-full p-5 bg-slate-700/50 border border-white/5 rounded-xl text-left hover:bg-slate-600 hover:border-emerald-500 transition-all group flex items-start gap-4"
                >
                  <span className="block w-6 h-6 rounded-full bg-slate-600 flex-shrink-0 mt-0.5 group-hover:bg-emerald-500 transition-colors"></span>
                  <div>
                    <span className="block text-slate-200 group-hover:text-white text-lg transition-colors">
                      {opt.text}
                    </span>
                    {process.env.NODE_ENV === 'development' && (
                      <span className="text-xs text-slate-600 mt-1 block">Type: {opt.type}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalyzing = () => (
    <div className="flex flex-col items-center justify-center h-full max-w-4xl mx-auto text-center px-4">
      {/* Iceberg Animation */}
      <div className="relative w-96 h-96 mb-8 flex items-center justify-center">
        {/* Water Level */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-cyan-500/30 z-10"></div>

        {/* Iceberg Tip (Behavior) */}
        <div className="absolute top-20 w-32 h-32 bg-white/20 blur-md rounded-t-full animate-bounce duration-[3000ms]"></div>
        <div className="absolute top-1/3 text-white font-bold z-20">外顯行為 (Behavior)</div>

        {/* Iceberg Bottom (Values) */}
        <div className="absolute bottom-20 w-64 h-48 bg-blue-900/40 blur-xl rounded-b-full animate-pulse"></div>
        <div className="absolute bottom-1/3 text-cyan-300 font-bold z-20 opacity-80">
          內在價值 (Values)
        </div>
        <div className="absolute bottom-1/4 text-purple-400 font-bold z-20 opacity-60">
          潛在動機 (Motives)
        </div>

        {/* Scan Line */}
        <div className="absolute top-0 w-full h-1 bg-emerald-500 box-shadow-[0_0_20px_emerald] animate-[scan_3s_ease-in-out_infinite]"></div>
      </div>

      <h2 className="text-4xl font-bold mb-4 text-white">冰山理論分析中...</h2>
      <p className="text-xl text-slate-400 mb-8 max-w-lg">
        正在穿透外顯行為，解讀因應社會期許而隱藏的真實特質。
        <br />
        <span className="text-sm text-slate-600 mt-2 block">
          Analzying Situational Judgement Data...
        </span>
      </p>

      <div className="flex gap-4 text-xs font-mono text-slate-500">
        <span className="animate-pulse">E_SCORE: calculating...</span>
        <span className="animate-pulse delay-100">S_SCORE: verifying...</span>
        <span className="animate-pulse delay-200">G_SCORE: calibrating...</span>
      </div>
    </div>
  );

  const renderResult = () => {
    if (!career) return null;
    return (
      // Just keep the original simple result for now, but polished
      <div className="flex flex-col items-center justify-center h-full text-center max-w-3xl mx-auto animate-fadeIn px-4">
        <div className="text-sm text-emerald-400 mb-2 uppercase tracking-[0.3em] font-bold">
          Analysis Complete
        </div>
        <div className="text-6xl mb-6">
          {career.path === CareerPath.CARBON_AUDITOR
            ? '🌿'
            : career.path === CareerPath.IMPACT_INVESTOR
              ? '💫'
              : career.path === CareerPath.ETHICS_COMPLIANCE
                ? '⚖️'
                : '🌟'}
        </div>

        <h1 className="text-6xl font-black mb-6 text-white drop-shadow-2xl">{career.path}</h1>
        <div className="text-3xl mb-10 font-light text-slate-300">{career.title}</div>

        <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-8 rounded-2xl border border-white/10 mb-10 shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-center gap-2">
            <span>🎯</span> 系統配對報告
          </h3>
          <p className="text-lg text-slate-300 leading-relaxed max-w-xl mx-auto">
            經由 SJT 情境分析，您展現了高度的 **
            {career.path === CareerPath.CARBON_AUDITOR
              ? '環境敏銳度 (E-Type)'
              : career.path === CareerPath.IMPACT_INVESTOR
                ? '社會共感力 (S-Type)'
                : '治理嚴謹度 (G-Type)'}
            **。
            <br />
            <br />
            您的內在價值觀傾向於「
            {career.path === CareerPath.CARBON_AUDITOR
              ? '科學實證與生態永續'
              : career.path === CareerPath.IMPACT_INVESTOR
                ? '人本關懷與互助共好'
                : '正直誠信與制度建立'}
            」，這正是本職位所需的關鍵特質。
          </p>
        </div>

        <button
          onClick={() => setStep('dashboard')}
          className="px-12 py-4 bg-white text-slate-900 rounded-full text-xl font-bold hover:bg-emerald-400 hover:text-white transition-colors shadow-2xl"
        >
          前往職涯儀表板
        </button>
      </div>
    );
  };

  const renderDashboard = () => {
    if (!career) return null;
    return (
      <div className="max-w-5xl mx-auto px-4">
        <header className="mb-12 flex items-end justify-between border-b border-white/10 pb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
              職涯發展中心
            </h1>
            <p className="text-slate-400">Career Development Center</p>
          </div>
          <div className="text-right">
            <span className="block text-sm text-slate-500 uppercase tracking-wider mb-1">
              Current Title
            </span>
            <span className="text-2xl font-bold text-white bg-slate-800 px-4 py-2 rounded-lg border border-white/10">
              {career.title}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Career Card */}
          <div className="bg-slate-800 rounded-3xl p-8 border border-white/10 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
            <div className="absolute top-0 right-0 p-8 opacity-10 font-serif text-9xl group-hover:scale-110 transition-transform select-none">
              {career.level}
            </div>

            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 relative z-10">
              <span>🆔</span> 職業檔案
            </h2>

            <div className="space-y-6 relative z-10">
              <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl">
                <span className="text-slate-400">專屬稱號</span>
                <span className="font-bold text-xl text-white">{career.title}</span>
              </div>
              <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-xl">
                <span className="text-slate-400">被動加成</span>
                <span className="font-bold text-emerald-400">
                  {career.passiveBonuses.map(b => `${b.stat} +${b.value}`).join(', ')}
                </span>
              </div>
              <div className="bg-slate-900/50 p-4 rounded-xl">
                <div className="flex justify-between mb-3">
                  <span className="text-slate-400">經驗值 (Exp)</span>
                  <span className="text-sm font-mono text-emerald-500">
                    {career.experience} / 1000
                  </span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 w-[5%] animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quests */}
          <div className="bg-slate-800 rounded-3xl p-8 border border-white/10 flex flex-col">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span>🚀</span> 本週重點行動
            </h2>
            <ul className="space-y-4 flex-1">
              <li className="flex items-center gap-4 bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20">
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black font-bold text-sm">
                  ✓
                </div>
                <div>
                  <span className="block text-emerald-200 font-bold">完成全人教育測評</span>
                  <span className="text-xs text-emerald-500/70">獲得身份認證</span>
                </div>
              </li>
              <li className="flex items-center gap-4 bg-slate-700/30 p-4 rounded-xl border border-white/5 opacity-50">
                <div className="w-8 h-8 rounded-full border-2 border-slate-600 flex items-center justify-center text-xs text-slate-500">
                  2
                </div>
                <div>
                  <span className="block text-slate-300">升級至 Lv.5</span>
                  <span className="text-xs text-slate-500">解鎖職業專屬技能樹</span>
                </div>
              </li>
              <li className="flex items-center gap-4 bg-slate-700/30 p-4 rounded-xl border border-white/5 opacity-50">
                <div className="w-8 h-8 rounded-full border-2 border-slate-600 flex items-center justify-center text-xs text-slate-500">
                  3
                </div>
                <div>
                  <span className="block text-slate-300">參與 1 次學會專案</span>
                  <span className="text-xs text-slate-500">累積實戰經驗</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-900 text-white font-sans selection:bg-emerald-500/30">
      {step === 'welcome' && renderWelcome()}
      {step === 'quiz' && renderQuiz()}
      {step === 'analyzing' && renderAnalyzing()}
      {step === 'result' && renderResult()}
      {step === 'dashboard' && renderDashboard()}
    </div>
  );
};
