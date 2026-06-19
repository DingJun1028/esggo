
import React, { useState, useEffect, useRef } from 'react';
import { Language, View, AgentCertification } from '../types';
import { 
    Sword, Shield, BrainCircuit, Star, Zap, Bot, MessageSquare, 
    ChevronRight, Trophy, Target, Award, Loader2, Play, Lock, 
    Flame, Sparkles, Send, X, CheckCircle, RefreshCw, Layers, Users, Activity
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';
import { streamChat } from '../services/ai-service';
import { marked } from 'marked';

interface AgentArenaProps {
  language: Language;
  onNavigate?: (view: View) => void;
}

const MOCK_CERTS: AgentCertification[] = [
    { id: 'c1', title: 'Carbon Scout L1', status: 'Certified', progress: 100, skillsUnlocked: ['Emission Tracking'] },
    { id: 'c2', title: 'Risk Oracle L1', status: 'In_Progress', progress: 45, skillsUnlocked: ['Impact Analysis'] },
    { id: 'c3', title: 'MECE Strategist', status: 'Locked', progress: 0, skillsUnlocked: [] }
];

export const AgentArena: React.FC<AgentArenaProps> = ({ language, onNavigate }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  // Added comment above fix: correct destructuring of awardXp from useCompany
  const { activePersona } = useUniversalAgent();
  const { awardXp } = useCompany();
  
  const [activeTab, setActiveTab] = useState<'trials' | 'certs'>('trials');
  const [trialStep, setTrialStep] = useState(0);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [debateHistory, setDebateHistory] = useState<{ role: 'user' | 'opponent', text: string }[]>([]);
  const [isOpponentThinking, setIsOpponentThinking] = useState(false);
  const [trialResult, setTrialResult] = useState<any | null>(null);

  const debateEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    debateEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [debateHistory, isOpponentThinking]);

  const initiateTrial = () => {
    setIsTrialActive(true);
    setTrialStep(0);
    setDebateHistory([{ 
        role: 'opponent', 
        text: isZh 
            ? "我是你的試煉對手：核心鏡像 v15。當前主題：**「碳排數據的誠實性悖論」**。假設你的企業剛在報告中宣稱減碳 40%，但其中 30% 來自未經核證的碳權抵換。你將如何應對環境稽核員的深度質疑？" 
            : "I am your trial opponent: Kernel_Mirror_v15. Topic: **'The Paradox of Carbon Integrity'**. Your company claims a 40% reduction, but 30% is unverified offsets. How do you defend this against a critical audit?"
    }]);
  };

  const handleSendResponse = async () => {
    if (!userInput.trim() || isOpponentThinking) return;
    
    const userText = userInput;
    setDebateHistory(prev => [...prev, { role: 'user', text: userText }]);
    setUserInput('');
    setIsOpponentThinking(true);

    try {
        const prompt = `試煉主題：漂綠悖論。用戶回答：${userText}。請作為嚴厲的稽核員給予回應，並在對話結束時給予評分（若對話超過2輪）。請以 ${isZh ? '繁體中文' : 'English'} 回答。`;
        const stream = streamChat(prompt, language, "你是一位嚴厲的 ESG 稽核員，負責測試代理人的應對邏輯。", [], [], 'gemini-3-flash-preview');
        
        let fullResponse = '';
        for await (const chunk of stream) {
            fullResponse += chunk.text || '';
        }
        
        setDebateHistory(prev => [...prev, { role: 'opponent', text: fullResponse }]);
        setTrialStep(prev => prev + 1);

        if (trialStep >= 2) {
            finishTrial();
        }
    } catch (e) {
        addToast('error', 'Simulation connection lost.', 'Error');
    } finally {
        setIsOpponentThinking(false);
    }
  };

  const finishTrial = () => {
      const score = 85 + Math.floor(Math.random() * 10);
      setTrialResult({
          score,
          xp: score * 5,
          feedback: isZh ? "邏輯一致性良好，但在數據透明度維度仍有提升空間。" : "Strong consistency, but needs better transparency detail."
      });
      awardXp(score * 5);
  };

  return (
    <div className="h-full flex flex-col space-y-2 animate-fade-in overflow-hidden">
        <UniversalPageHeader 
            icon={Sword}
            title={{ zh: '光之試煉場', en: 'Trial Arena' }}
            description={{ zh: '透過 AI 模擬對抗提升你的權能等級', en: 'Level up your authority via AI simulations.' }}
            language={language}
            tag={{ zh: '代理人訓練', en: 'AGENT_TRAIN' }}
        />

        <div className="flex bg-slate-900/50 p-1.5 rounded-xl border border-white/10 w-fit backdrop-blur-xl mb-1 shrink-0">
            <button onClick={() => setActiveTab('trials')} className={`px-5 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-2 ${activeTab === 'trials' ? 'bg-celestial-gold text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}>
                <Zap className="w-3 h-3" /> {isZh ? '今日試煉' : 'DAILY TRIALS'}
            </button>
            <button onClick={() => setActiveTab('certs')} className={`px-5 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-2 ${activeTab === 'certs' ? 'bg-celestial-purple text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>
                <Award className="w-3 h-3" /> {isZh ? '代理人認證' : 'CERTIFICATIONS'}
            </button>
        </div>

        <div className="flex-1 min-h-0">
            {activeTab === 'certs' ? (
                <div className="h-full grid grid-cols-12 gap-2 overflow-hidden">
                    <div className="col-span-12 lg:col-span-8 flex flex-col gap-2 overflow-y-auto no-scrollbar">
                        <div className="grid grid-cols-2 gap-2">
                            {MOCK_CERTS.map(cert => (
                                <div key={cert.id} className={`glass-bento p-5 border-white/10 group transition-all duration-500 relative overflow-hidden
                                    ${cert.status === 'Locked' ? 'opacity-40 grayscale' : 'hover:border-celestial-gold/50'}
                                `}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-2 rounded-lg ${cert.status === 'Certified' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-gray-500'}`}>
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <div className="uni-mini bg-black/40 text-gray-500">{cert.status}</div>
                                    </div>
                                    <h4 className="zh-main text-sm text-white mb-2">{cert.title}</h4>
                                    <div className="space-y-2">
                                        <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden">
                                            <div className="h-full bg-celestial-gold transition-all duration-1000" style={{ width: `${cert.progress}%` }} />
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {cert.skillsUnlocked.map(skill => (
                                                <span key={skill} className="en-sub text-[6px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">{skill}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-span-12 lg:col-span-4 glass-bento p-6 flex flex-col items-center justify-center text-center bg-slate-900/40">
                        <Trophy className="w-12 h-12 text-celestial-gold mb-4 opacity-20" />
                        <span className="zh-main text-lg text-white">王者之殿</span>
                        <span className="en-sub mt-2">Hall of Excellence</span>
                        <p className="text-[10px] text-gray-600 mt-4 leading-relaxed">解鎖所有 L1 認證以啟動高階決策矩陣。</p>
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col glass-bento border-celestial-gold/20 bg-slate-950 relative overflow-hidden">
                    {!isTrialActive ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                            <div className="relative mb-8">
                                <Sword className="w-20 h-20 text-gray-800 animate-pulse" />
                                <Sparkles className="absolute -top-2 -right-2 w-10 h-10 text-celestial-gold animate-ai-pulse" />
                            </div>
                            <h3 className="zh-main text-2xl text-white mb-4">準備好接受試煉了嗎？</h3>
                            <p className="en-sub max-w-sm mx-auto mb-10 leading-relaxed opacity-60">透過高壓模擬提升你的 MECE 邏輯與權能權限。</p>
                            <button onClick={initiateTrial} className="px-10 py-4 bg-celestial-gold text-black font-black rounded-xl hover:scale-105 transition-all shadow-xl shadow-amber-500/20 uppercase tracking-widest text-xs">
                                啟動：漂綠悖論試煉
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full overflow-hidden">
                            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-celestial-gold/30 flex items-center justify-center">
                                        <Bot className="w-6 h-6 text-celestial-gold" />
                                    </div>
                                    <div>
                                        <span className="zh-main text-xs text-white">對戰中：Kernel_Mirror_v15</span>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="en-sub opacity-100 text-[6px]">Syncing_Logical_Bridges</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="en-sub">TRIAL_STEP</div>
                                        <div className="zh-main text-sm text-white">{trialStep + 1} / 3</div>
                                    </div>
                                    <button onClick={() => setIsTrialActive(false)} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 transition-all"><X className="w-4 h-4"/></button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.05)_0%,transparent_70%)]">
                                {debateHistory.map((msg, i) => (
                                    <div key={i} className={`flex gap-4 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-[10px] font-black border ${msg.role === 'user' ? 'bg-celestial-blue/20 border-celestial-blue/40 text-celestial-blue' : 'bg-slate-900 border-white/10 text-gray-500'}`}>
                                            {msg.role === 'user' ? 'YOU' : 'OPP'}
                                        </div>
                                        <div className={`max-w-[80%] p-4 rounded-2xl text-[10.5px] leading-relaxed border ${msg.role === 'user' ? 'bg-white text-black border-white/20' : 'bg-slate-900/60 text-gray-200 border-white/5 shadow-lg'}`} dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) as string }} />
                                    </div>
                                ))}
                                {isOpponentThinking && (
                                    <div className="flex gap-4 animate-pulse">
                                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center"><Loader2 className="w-4 h-4 animate-spin text-gray-700"/></div>
                                        <div className="w-24 h-8 bg-white/5 rounded-2xl border border-white/5" />
                                    </div>
                                )}
                                <div ref={debateEndRef} />
                            </div>

                            {trialResult ? (
                                <div className="p-8 bg-slate-950 border-t border-celestial-gold/30 animate-fade-in flex flex-col items-center">
                                    <div className="text-4xl font-black text-celestial-gold mb-2">{trialResult.score}</div>
                                    <div className="en-sub opacity-100 text-[10px] mb-4">Trial_Efficiency_Score</div>
                                    <p className="zh-main text-[11px] text-gray-300 mb-8 text-center max-w-md">{trialResult.feedback}</p>
                                    <div className="flex gap-3">
                                        <button onClick={() => setIsTrialActive(false)} className="px-8 py-2 bg-white text-black font-black rounded-lg text-[10px] uppercase">回到首頁</button>
                                        <button onClick={initiateTrial} className="px-8 py-2 bg-white/10 text-white font-black rounded-lg text-[10px] uppercase border border-white/10">再戰一場</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 bg-black/40 border-t border-white/10">
                                    <div className="relative flex items-center gap-3">
                                        <input 
                                            value={userInput} 
                                            onChange={e => setUserInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleSendResponse()}
                                            disabled={isOpponentThinking}
                                            className="w-full bg-slate-900 border border-white/10 rounded-xl px-6 py-4 text-[10.5px] text-white outline-none focus:border-celestial-gold/50 placeholder:text-gray-700" 
                                            placeholder={isZh ? "輸入你的反駁策略..." : "Enter your strategic rebuttal..."} 
                                        />
                                        <button 
                                            onClick={handleSendResponse}
                                            disabled={!userInput.trim() || isOpponentThinking}
                                            className="p-4 bg-celestial-gold text-black rounded-xl hover:scale-105 transition-all disabled:opacity-30"
                                        >
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
};
