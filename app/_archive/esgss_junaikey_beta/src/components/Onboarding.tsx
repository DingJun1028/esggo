import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socialEconomyService } from '../services/socialEconomyService';
import { Sparkles, CheckCircle } from './icons';
import { AvatarCreationPortal } from './avatar/AvatarCreationPortal';
import { useOmniAvatar } from '../store/useOmniAvatar';
import { AvatarService } from '../services/AvatarService';
import { MissionService } from '../services/MissionService';
import { useMissionStore } from '../store/useMissionStore';

// SJT Assessment utilizing the "Ren-Du Meridians" (Compliance vs. Innovation) and Iceberg Theory
const SJT_QUESTIONS = [
  {
    id: 1,
    scenario:
      '【情境一：任脈 - 合規基礎】\n您發現公司的碳排放數據雖然符合法規下限，但在極端氣候下仍可能有環境風險。',
    question: '壽司博士請問您，此時您的「直覺判斷」是？',
    options: [
      { text: '優先確保合規，避免法律風險 (合規導向)', type: 'REN', score: 3 },
      { text: '主動提高標準，即使法規未要求 (創價導向)', type: 'DU', score: 5 },
      { text: '觀察同業做法，採取平均標準 (保守導向)', type: 'STABLE', score: 1 },
    ],
  },
  {
    id: 2,
    scenario:
      '【情境二：督脈 - 創價思維】\n公司有一筆預算，可以用來「購買碳權」達到碳中和，或者「投資研發」新的低碳製程（但風險較高）。',
    question: '您認為哪條路徑更能體現「文明永續」？',
    options: [
      { text: '購買碳權，快速達成顯著的 KPI (結果導向)', type: 'REN', score: 2 },
      { text: '投資研發，雖然慢但能從根本解決問題 (願景導向)', type: 'DU', score: 5 },
      { text: '兩者並行，分散風險 (平衡導向)', type: 'STABLE', score: 3 },
    ],
  },
  {
    id: 3,
    scenario:
      '【情境三：冰山之下 - 價值觀】\n在推動 ESG 專案時，遇到部門利益衝突，導致進度嚴重落後。',
    question: '您會如何運用「善向永續」的精神來解決？',
    options: [
      { text: '訴諸公司規定與高層命令，強制執行 (制度層)', type: 'REN', score: 2 },
      { text: '啟動對話，尋找能滿足雙方需求的第三條路 (創價層)', type: 'DU', score: 5 },
      { text: '暫緩計畫，等待更好的時機 (避險層)', type: 'STABLE', score: 1 },
    ],
  },
];

const LEGENDARY_CARDS = [
  {
    name: 'Ren-Du Harmony (任督調和)',
    partner: 'ESG Sunshine',
    desc: '一站式決策支持 (Platform Ultimate)',
    color: 'text-amber-400',
  },
  {
    name: 'Global Talent Ticket',
    partner: 'Berkeley',
    desc: '國際認證永續人才培力 Webinar',
    color: 'text-blue-400',
  },
  {
    name: 'Multilingual Matrix',
    partner: 'Lingostep',
    desc: '解鎖全球溝通能力',
    color: 'text-purple-400',
  },
  {
    name: 'Sustainable Governance',
    partner: 'Wangdao',
    desc: '+10% 資源產出效率',
    color: 'text-emerald-400',
  },
  {
    name: 'Structural Insight',
    partner: 'Samwells',
    desc: '辯論時預知怪獸意圖',
    color: 'text-cyan-400',
  },
  {
    name: "Explorer's Spirit",
    partner: 'Freetime Gears',
    desc: '任務 GSC 加成 50%',
    color: 'text-orange-400',
  },
];

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState('');
  const [language, setLanguage] = useState<'zh-TW' | 'en-US'>('zh-TW');
  const [selectedTrait, setSelectedTrait] = useState<string | null>(null);
  const { setPrimaryAvatar } = useOmniAvatar();
  const { addMission } = useMissionStore();

  // Assessment State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scores, setScores] = useState({ REN: 0, DU: 0, STABLE: 0 }); // 任脈(合規), 督脈(創價), 穩健
  const [assessmentComplete, setAssessmentComplete] = useState(false);

  const totalSteps = 8;

  const handleNext = () => setStep(s => Math.min(s + 1, totalSteps));

  const finishOnboarding = async () => {
    if (nickname) {
      await socialEconomyService.updateNickname('partner_1', nickname);
    }

    // Phase 105: Start First Quest
    if (selectedTrait) {
      const firstMission = MissionService.startFirstQuest(selectedTrait);
      addMission(firstMission);
    }

    navigate('/');
  };

  const handleAvatarComplete = (traitId: string) => {
    setSelectedTrait(traitId);
    const avatar = AvatarService.createPrimaryAvatar(traitId);
    setPrimaryAvatar(avatar);
    handleNext();
  };

  const handleAnswer = (type: string, score: number) => {
    setScores(prev => ({ ...prev, [type]: (prev as any)[type] + score }));

    if (currentQuestionIndex < SJT_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setAssessmentComplete(true);
    }
  };

  const getRecommendedPath = () => {
    if (scores.DU >= scores.REN + 3)
      return {
        title: '全人創價開拓者 (Holistic Innovator)',
        desc: '您已打通「督脈」，不滿足於現狀，致力於創造新的永續文明典範。',
        color: 'text-amber-400',
      };
    if (scores.REN >= scores.DU)
      return {
        title: '堅實合規守護者 (Compliance Guardian)',
        desc: '您的「任脈」深厚，重視基礎與風險，是組織最堅實的後盾。',
        color: 'text-blue-400',
      };
    return {
      title: '太極平衡策略家 (Balanced Strategist)',
      desc: '您在合規與創價間取得平衡，能穩健地推動組織轉型。',
      color: 'text-emerald-400',
    };
  };

  const renderStep = () => {
    switch (step) {
      case 1: // Language - Lingostep
        return (
          <div className="text-center animate-fadeIn max-w-2xl mx-auto">
            <div className="text-6xl mb-6">🌐</div>
            <h1 className="text-4xl font-bold mb-8 text-white">Select Language / 選擇語言</h1>
            <div className="grid grid-cols-2 gap-6 mb-12">
              <button
                onClick={() => setLanguage('zh-TW')}
                className={`p-8 rounded-2xl border-2 transition-all ${language === 'zh-TW' ? 'border-amber-500 bg-amber-500/20 shadow-lg shadow-amber-500/20' : 'border-slate-700 bg-slate-800 hover:border-slate-500'}`}
              >
                <div className="text-3xl mb-2">🇹🇼</div>
                <div className="text-xl font-bold text-white">繁體中文</div>
              </button>
              <button
                onClick={() => setLanguage('en-US')}
                className={`p-8 rounded-2xl border-2 transition-all ${language === 'en-US' ? 'border-cyan-500 bg-cyan-500/20 shadow-lg shadow-cyan-500/20' : 'border-slate-700 bg-slate-800 hover:border-slate-500'}`}
              >
                <div className="text-3xl mb-2">🇺🇸</div>
                <div className="text-xl font-bold text-white">English</div>
              </button>
            </div>
            <div className="flex items-center justify-center text-slate-500 space-x-2">
              <span>Powered by</span>
              <span className="font-bold text-purple-400 flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> Lingostep
              </span>
            </div>
          </div>
        );

      case 2: // Welcome - ESG Sunshine (Dr. Thoth)
        return (
          <div className="text-center animate-fadeIn max-w-3xl mx-auto">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-[#63a6b0] to-cyan-500 p-1 mb-6 shadow-2xl overflow-hidden relative border-2 border-white/20">
              <div className="absolute inset-0 bg-black/10 z-10 rounded-full"></div>
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-5xl relative z-20">
                🦉
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-4 text-white">
              我是 <span className="text-[#63a6b0]">壽司博士 (Dr. Thoth)</span>
            </h1>
            <h2 className="text-xl text-slate-300 font-bold mb-8">
              您的 <span className="text-[#63a6b0]">善向永續 (ESG Sunshine)</span> 引導導師
            </h2>

            <div className="bg-slate-800/80 p-8 rounded-2xl border border-[#63a6b0]/30 text-lg leading-relaxed text-slate-300 shadow-xl backdrop-blur-sm">
              <p className="mb-6">
                「歡迎來到 <span className="text-white font-bold">INFOONE 永續知識服務平台</span>。
                <br />
                在這裡，<span className="text-[#63a6b0] font-bold">服務即教學，知識即資產</span>。」
              </p>
              <p>
                我將引導您進入永續文明的修煉場，
                <br />
                將數據轉化為永恆的價值。
              </p>
            </div>
          </div>
        );

      case 3: // 5T Protocol - The Five Pillars
        return (
          <div className="text-center animate-fadeIn max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-white">核心準則：5T 誠信協議</h2>
            <div className="text-sm text-[#63a6b0] font-mono mb-10 flex items-center justify-center gap-2">
              <span>The Foundation of Digital Integrity</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { label: '可感知', en: 'Tangible', desc: '指標具體化', icon: '💎', color: 'border-cyan-500/50' },
                { label: '可溯源', en: 'Traceable', desc: '數據源頭清冊', icon: '🔗', color: 'border-blue-500/50' },
                { label: '可追蹤', en: 'Trackable', desc: '路徑動態紀錄', icon: '📈', color: 'border-emerald-500/50' },
                { label: '可驗算', en: 'Transparent', desc: '邏輯公開透明', icon: '🧮', color: 'border-purple-500/50' },
                { label: '不可篡改', en: 'Trustworthy', desc: '資產永久封印', icon: '🛡️', color: 'border-rose-500/50' },
              ].map((pill, i) => (
                <div key={i} className={`bg-slate-800/50 p-6 rounded-2xl border-2 ${pill.color} hover:bg-slate-800 transition-all group`}>
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{pill.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-1">{pill.label}</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-2">{pill.en}</p>
                  <p className="text-xs text-slate-500">{pill.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-10 text-slate-400 italic">
              「這五根支柱支撐著您在永續文明中的每一份貢獻。」
            </p>
          </div>
        );

      case 4: // Methodology - Wangdao
        return (
          <div className="text-center animate-fadeIn">
            <h2 className="text-3xl font-bold mb-2 text-white">核心方法論：王道與雙脈</h2>
            <div className="text-sm text-[#63a6b0] font-mono mb-10 flex items-center justify-center gap-2">
              <span>Methodology derived from</span>
              <span className="font-bold border-b border-[#63a6b0]/50">
                Wangdao Business Theory
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="bg-slate-800 p-8 rounded-2xl border border-blue-500/30 hover:border-blue-500 transition-colors group">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🌊</div>
                <h3 className="text-2xl font-bold text-blue-400 mb-3">任脈：合規永續</h3>
                <p className="text-slate-400 text-left">
                  建立在 <span className="text-white">GRI, IFRS, TCFD</span> 等國際標準之上。
                  <br />
                  這是企業生存的基礎，確保風險可控，合乎法規要求。
                </p>
              </div>
              <div className="bg-slate-800 p-8 rounded-2xl border border-[#63a6b0]/30 hover:border-[#63a6b0] transition-colors relative overflow-hidden group">
                <div className="absolute top-0 right-0 bg-[#63a6b0] text-black text-xs font-bold px-2 py-1">
                  目標
                </div>
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">☀️</div>
                <h3 className="text-2xl font-bold text-[#63a6b0] mb-3">督脈：創價永續</h3>
                <p className="text-slate-400 text-left">
                  超越框架，結合商業模式與社會創新。
                  <br />
                  創造價值、創造善、創造文明，將 ESG 轉化為競爭力。
                </p>
              </div>
            </div>
          </div>
        );

      case 5: // Assessment - Samwells
        if (assessmentComplete) {
          const role = getRecommendedPath();
          return (
            <div className="text-center animate-popIn">
              <h2 className="text-3xl font-bold mb-2 text-white">全人教育評測結果</h2>
              <div className="text-sm text-cyan-400 font-mono mb-8 flex items-center justify-center gap-2">
                <span>Analysis by</span>
                <span className="font-bold">Samwells Technology</span>
              </div>

              <div className="w-32 h-32 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-6xl mb-6 border-4 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                {role.title.includes('Innovator') || role.title.includes('開拓者')
                  ? '🚀'
                  : role.title.includes('Guardian') || role.title.includes('守護者')
                    ? '🛡️'
                    : '⚖️'}
              </div>
              <h3 className={`text-3xl font-bold mb-4 ${role.color}`}>{role.title}</h3>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
                {role.desc}
              </p>

              <div className="bg-slate-900/50 p-6 rounded-xl max-w-md mx-auto mb-8 border border-slate-700">
                <div className="flex justify-between mb-2 text-sm text-slate-400">
                  <span>合規傾向 (任脈)</span>
                  <span>平衡</span>
                  <span>創價傾向 (督脈)</span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    style={{
                      width: `${(scores.REN / (scores.REN + scores.DU + scores.STABLE)) * 100}%`,
                    }}
                    className="bg-blue-500 h-full"
                  ></div>
                  <div
                    style={{
                      width: `${(scores.STABLE / (scores.REN + scores.DU + scores.STABLE)) * 100}%`,
                    }}
                    className="bg-slate-500 h-full"
                  ></div>
                  <div
                    style={{
                      width: `${(scores.DU / (scores.REN + scores.DU + scores.STABLE)) * 100}%`,
                    }}
                    className="bg-[#63a6b0] h-full"
                  ></div>
                </div>
              </div>
            </div>
          );
        }

        const q = SJT_QUESTIONS[currentQuestionIndex];
        return (
          <div className="text-center animate-fadeIn max-w-3xl mx-auto">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#63a6b0] text-left">全人教育評測 (SJT)</h2>
                <div className="text-xs text-cyan-500 font-mono text-left flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3 h-3" /> Powered by Samwells
                </div>
              </div>
              <span className="text-slate-500 font-mono">
                Q{currentQuestionIndex + 1}/{SJT_QUESTIONS.length}
              </span>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 mb-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-[#63a6b0]"></div>
              {q && (
                <>
                  <p className="text-white/60 mb-2 text-sm text-left font-mono">
                    {q.scenario.split('\n')[0]}
                  </p>
                  <p className="text-xl mb-8 leading-relaxed font-medium text-left text-white">
                    {q.scenario.split('\n')[1]}
                  </p>
                  <p className="text-[#63a6b0] text-lg font-bold mb-6 text-left border-l-4 border-[#63a6b0] pl-4">
                    {q.question}
                  </p>

                  <div className="space-y-3">
                    {q.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(opt.type, opt.score)}
                        className="w-full p-5 bg-slate-700 hover:bg-slate-600 rounded-xl text-left transition-all border border-transparent hover:border-[#63a6b0] group flex items-center"
                      >
                        <span className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mr-4 group-hover:bg-[#63a6b0] group-hover:text-black transition-colors font-bold shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-slate-200 group-hover:text-white text-lg">
                          {opt.text}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case 6: // Chapter 1: Avatar Creation
        return <AvatarCreationPortal onComplete={handleAvatarComplete} />;

      case 7: // Identity - Freetime Gears
        return (
          <div className="text-center animate-pullUp">
            <h2 className="text-3xl font-bold mb-2 text-white">建立您的學員身分</h2>
            <div className="text-sm text-orange-400 font-mono mb-8 flex items-center justify-center gap-2">
              <span>Gear sponsored by</span>
              <span className="font-bold">Freetimegears</span>
            </div>

            <div className="max-w-md mx-auto bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
              <div className="text-6xl mb-6">🆔</div>
              <label className="block text-left text-slate-400 mb-2">
                請輸入您的代號 (Nickname)
              </label>
              <input
                type="text"
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="例如: Sustainability Pioneer"
                className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 text-xl text-white outline-none focus:border-orange-500 transition-colors mb-4"
              />

              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center gap-4">
                <div className="text-3xl">🎒</div>
                <div className="text-left">
                  <div className="text-orange-400 font-bold text-sm">新手好禮包含</div>
                  <div className="text-white">Freetime 背包 (虛擬家具資產)</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 8: // Rewards - Legendary Cards
        return (
          <div className="text-center animate-popIn">
            <div className="text-6xl mb-4 animate-bounce">🎁</div>
            <h2 className="text-4xl font-bold mb-2 text-white">歡迎加入 善向永續</h2>
            <p className="text-slate-400 mb-8">
              您已解鎖以下{' '}
              <span className="text-[#63a6b0] font-bold">傳說級奧秘卡牌 (Legendary OmniCards)</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 max-w-6xl mx-auto px-4">
              {LEGENDARY_CARDS.map((card, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800 p-4 rounded-xl border border-slate-700 hover:border-[#63a6b0] transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-[#63a6b0] text-black text-[10px] font-bold px-2 py-0.5 z-10">
                    LEGENDARY
                  </div>
                  <div className="text-left">
                    <div className={`text-sm font-bold opacity-70 mb-1 ${card.color}`}>
                      {card.partner}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 leading-tight">{card.name}</h3>
                    <p className="text-xs text-slate-400">{card.desc}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] text-slate-500">OmniCard #{100 + idx}</span>
                    <Sparkles className="w-4 h-4 text-[#63a6b0] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-slate-500 mb-8 animate-pulse">
              這些夥伴將在您的旅程中持續提供協助...
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        {renderStep()}

        {/* Navigation */}
        <div className="fixed bottom-8 left-0 w-full flex justify-center gap-4 z-50 px-4">
          {/* Only show next button if not in assessment or avatar creation, or if assessment is complete */}
          {(step !== 5 || assessmentComplete) && step !== 6 && (
            <button
              onClick={step === totalSteps ? finishOnboarding : handleNext}
              className={`
                                px-12 py-4 rounded-full font-bold text-xl shadow-lg transition-all
                                ${step === totalSteps
                  ? 'bg-gradient-to-r from-[#63a6b0] to-cyan-600 text-white hover:scale-105 hover:shadow-cyan-500/50'
                  : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-600'
                }
                            `}
            >
              {step === totalSteps ? '開始旅程 (Start Journey)' : '下一步 (Next)'}
            </button>
          )}
        </div>

        {/* Progress Indicators */}
        <div className="fixed top-8 left-0 w-full flex justify-center gap-2 z-50">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${step > i ? 'w-8 bg-[#63a6b0]' : 'w-2 bg-slate-700'}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};
