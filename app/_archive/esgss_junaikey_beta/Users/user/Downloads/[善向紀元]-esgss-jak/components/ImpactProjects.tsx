
import React, { useState, useEffect, useMemo } from 'react';
import { 
    Target, Plus, Search, Filter, ArrowRight, Loader2, Sparkles, 
    CheckCircle2, Activity, Globe, Heart, ShieldCheck, 
    Zap, Trash2, Calendar, Users, BarChart3, Info, Wand2, X, MoreVertical,
    TrendingUp, DollarSign, PieChart, Layout, Box, Gift, ChevronRight,
    PlayCircle, Save, FileText, Share2, Camera, ShieldAlert, FileSearch, Rocket,
    Medal, Trophy, AlertCircle
} from 'lucide-react';
import { Language, ImpactProject, ProjectMilestone } from '../types';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useToast } from '../contexts/ToastContext';
import { generateProjectTheoryOfChange, streamChat } from '../services/ai-service';
import { useCompany } from './providers/CompanyProvider';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { z } from 'zod';

// RPG-style Progress Bar
const ImpactProgressBar: React.FC<{ progress: number, color?: string, label?: string }> = ({ progress, color = "bg-emerald-500", label = "Progress" }) => (
    <div className="w-full">
        <div className="flex justify-between text-[10px] font-black mb-1.5 uppercase text-gray-500 tracking-tighter">
            <span>{label}</span>
            <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2.5 w-full bg-slate-800/50 rounded-full border border-white/5 overflow-hidden">
            <div 
                className={`h-full ${color} shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-all duration-1000 relative`} 
                style={{ width: `${progress}%` }} 
            >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
        </div>
    </div>
);

// SROI Component
const SroiIndicator: React.FC<{ value: number }> = ({ value }) => (
    <div className="p-5 bg-gradient-to-br from-celestial-gold/20 to-transparent border-2 border-celestial-gold/30 rounded-3xl flex items-center justify-between shadow-2xl group hover:scale-105 transition-all">
        <div>
            <div className="text-[9px] font-black text-celestial-gold uppercase tracking-[0.2em] mb-1">Impact Synergy (SROI)</div>
            <div className="text-4xl font-mono font-black text-white tracking-tighter group-hover:text-celestial-gold transition-colors">1:{value.toFixed(2)}</div>
        </div>
        <div className="p-4 bg-black/40 rounded-[1.5rem] border border-celestial-gold/20">
            <TrendingUp className="w-7 h-7 text-celestial-gold" />
        </div>
    </div>
);

export const ImpactProjects: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { awardXp, goodwillBalance, updateGoodwillBalance, addJournalEntry } = useCompany();
  const { observeAction } = useUniversalAgent();
  
  const [projects, setProjects] = useState<ImpactProject[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showForge, setShowForge] = useState(false);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState<string | null>(null);

  // Wizard State
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState({ title: '', desc: '' });
  const [aiProposal, setAiProposal] = useState<Partial<ImpactProject> | null>(null);
  const [wizardErrors, setWizardErrors] = useState<Record<string, string>>({});

  const projectSchema = useMemo(() => z.object({
    title: z.string().trim().min(5, isZh ? "專案標題至少需要 5 個字" : "Title must be at least 5 chars").max(100),
    desc: z.string().trim().min(20, isZh ? "請提供更詳細的專案描述 (至少 20 字)" : "Please provide more detail (min 20 chars)")
  }), [isZh]);

  const selectedProject = useMemo(() => projects.find(p => p.id === selectedProjectId), [projects, selectedProjectId]);

  const filteredProjects = projects.filter(p => {
      if (activeTab === 'all') return true;
      if (activeTab === 'active') return p.status === 'active';
      if (activeTab === 'completed') return p.status === 'completed';
      return true;
  });

  const handleStartForge = () => {
      setWizardStep(1);
      setWizardData({ title: '', desc: '' });
      setAiProposal(null);
      setWizardErrors({});
      setShowForge(true);
  };

  const handleRunAiGen = async () => {
      setWizardErrors({});
      const result = projectSchema.safeParse(wizardData);
      
      if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach(err => {
              if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setWizardErrors(fieldErrors);
          return;
      }

      setIsAiProcessing(true);
      addToast('info', isZh ? 'AI 正在編寫變革理論與獲利路徑...' : 'AI Manifesting Theory of Change & Profit Path...', 'Kernel');
      
      try {
          const result = await generateProjectTheoryOfChange(wizardData.title, wizardData.desc, language);
          setAiProposal(result);
          setWizardStep(2);
          addToast('success', isZh ? '專案藍圖已顯化' : 'Project Blueprint Manifested', 'System');
      } catch (e) {
          addToast('error', 'Forge Connection Interrupted', 'System');
      } finally {
          setIsAiProcessing(false);
      }
  };

  const handleConfirmProject = () => {
      if (!aiProposal) return;
      const newProject: ImpactProject = {
          id: `ip-${Date.now()}`,
          title: wizardData.title,
          description: wizardData.desc,
          status: 'active',
          progress: 5,
          impactXP: 0,
          sdgs: aiProposal.sdgs || [1],
          logicModel: aiProposal.logicModel || { inputs: [], activities: [], outputs: [], outcomes: [], impact: '' },
          milestones: [
              { id: 'm1', title: isZh ? '完成基線分析' : 'Baseline Analysis', status: 'pending', xpReward: 200, description: isZh ? '收集當前問題之初階數據與利害關係人反饋。' : 'Collect initial data and stakeholder feedback.' },
              { id: 'm2', title: isZh ? '原型方案驗證' : 'Prototype Validation', status: 'pending', xpReward: 500, description: isZh ? '實施試驗性方案並收集初步影響力證據。' : 'Implement pilot solution and gather impact evidence.' },
              { id: 'm3', title: isZh ? '規模化顯化' : 'Scaling Manifestation', status: 'pending', xpReward: 1000, description: isZh ? '全面擴散影響力並完成 SROI 終期評核。' : 'Full-scale rollout and final SROI audit.' },
          ],
          financials: { budget: 100000, spent: 0, revenue_projected: 150000, roi_projected: 1.5 },
          impactMetrics: aiProposal.impactMetrics || [],
          sroi: 1.2
      };
      
      setProjects([newProject, ...projects]);
      setShowForge(false);
      awardXp(500);
      observeAction('PROJECT_CREATED', newProject.title);
      addToast('reward', isZh ? '新影響力專案已啟動！獲得 500 XP' : 'New Impact Project Active! +500 XP', 'Evolution');
  };

  const handleExecuteMilestone = async (project: ImpactProject, milestone: ProjectMilestone) => {
      if (milestone.status !== 'pending') return;
      setIsVerifying(milestone.id);
      addToast('info', isZh ? `正在見證里程碑：${milestone.title}...` : `Witnessing Milestone: ${milestone.title}...`, 'Audit');
      
      // Simulate Verification
      await new Promise(r => setTimeout(r, 2000));
      
      const hash = '0x' + Math.random().toString(16).substr(2, 8).toUpperCase();
      
      const updatedProjects = projects.map(p => {
          if (p.id === project.id) {
              const updatedMilestones = p.milestones.map(m => 
                  m.id === milestone.id ? { ...m, status: 'completed' as const, verifiedHash: hash } : m
              );
              const completedCount = updatedMilestones.filter(m => m.status === 'completed').length;
              const newProgress = Math.min(100, (completedCount / updatedMilestones.length) * 100 + 5);
              
              return { 
                  ...p, 
                  milestones: updatedMilestones, 
                  progress: newProgress,
                  impactXP: p.impactXP + milestone.xpReward,
                  status: newProgress >= 100 ? 'completed' as const : 'active' as const
              };
          }
          return p;
      });

      setProjects(updatedProjects);
      awardXp(milestone.xpReward);
      addJournalEntry(
          isZh ? `里程碑達成：${milestone.title}` : `Milestone Achieved: ${milestone.title}`,
          isZh ? `專案「${project.title}」之證據已核驗成功。雜湊值: ${hash}` : `Evidence for "${project.title}" verified. Hash: ${hash}`,
          milestone.xpReward,
          'milestone',
          ['IPMS', 'Impact']
      );
      setIsVerifying(null);
      addToast('success', isZh ? '見證完成！數據已寫入稽核鏈' : 'Witness Complete. Data committed to chain.', 'Kernel');
  };

  const handleGenerateStoryReport = async () => {
      if (!selectedProject) return;
      addToast('info', isZh ? '正在將數據轉化為動人故事...' : 'Transforming data into narrative...', 'Scribe');
      setIsAiProcessing(true);
      
      try {
          const prompt = `你現在是 ESGss 故事顯化官。請為專案「${selectedProject.title}」撰寫一份「公眾視角」的影響力故事。專案背景：${selectedProject.description}。目前進度：${selectedProject.progress}%。SROI：1:${selectedProject.sroi}。請強調社會改變與利他精神。語系：${isZh ? '繁體中文' : 'English'}`;
          const stream = streamChat(prompt, language, "你擅長撰寫具有情感感染力且具備數據支撐的永續影響力報告。", [], [], 'gemini-3-flash-preview');
          
          let story = '';
          for await (const chunk of stream) {
              story += chunk.text || '';
          }
          
          addJournalEntry(
              isZh ? `生成專案故事：${selectedProject.title}` : `Generated Project Story: ${selectedProject.title}`,
              story.substring(0, 200) + '...',
              50,
              'insight',
              ['Report', 'Story']
          );
          addToast('success', isZh ? '故事報告已生成於您的日誌中' : 'Story report generated in your journal.', 'Success');
      } catch (e) {
          addToast('error', 'Story manifestation failed.', 'Error');
      } finally {
          setIsAiProcessing(false);
      }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in overflow-hidden">
        <UniversalPageHeader 
            icon={Rocket}
            title={{ zh: '影響力專案管理 (IPMS)', en: 'Impact Project System' }}
            description={{ zh: '從 ToC 生成到 SROI 顯化：中小企業永續創價的中樞', en: 'From ToC generation to SROI manifestation: The SME value hub.' }}
            language={language}
            tag={{ zh: '影響力內核 v1.2', en: 'IMPACT_CORE_v1.2' }}
        />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
            <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/10 w-fit backdrop-blur-xl shadow-xl">
                {[
                    { id: 'all', label: isZh ? '全部' : 'All' },
                    { id: 'active', label: isZh ? '進行中' : 'Active' },
                    { id: 'completed', label: isZh ? '已結案' : 'Completed' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id as any); setSelectedProjectId(null); }}
                        className={`px-8 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                        {tab.label.toUpperCase()}
                    </button>
                ))}
            </div>
            <button 
                onClick={handleStartForge}
                className="px-10 py-4 bg-gradient-to-r from-celestial-emerald to-emerald-600 text-white font-black rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-2xl active:scale-95 uppercase tracking-widest text-[11px] shadow-emerald-500/20"
            >
                <Plus className="w-5 h-5" /> {isZh ? '啟動新創價專案' : 'FORGE NEW PROJECT'}
            </button>
        </div>

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-hidden">
            {/* Left: Project Feed (4/12) */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 min-h-0 overflow-y-auto no-scrollbar">
                {filteredProjects.length === 0 ? (
                    <div className="flex-1 glass-bento border-dashed border-white/10 flex flex-col items-center justify-center p-12 text-center opacity-30 grayscale rounded-[3rem]">
                        <Box className="w-20 h-20 mb-6" />
                        <p className="zh-main text-lg uppercase tracking-widest">No Projects Found</p>
                        <p className="text-xs mt-2 italic">Initiate your first project to start earning Impact XP.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredProjects.map(project => (
                            <div 
                                key={project.id} 
                                onClick={() => setSelectedProjectId(project.id)}
                                className={`glass-bento p-8 bg-slate-900/40 border-white/5 rounded-[3rem] group transition-all cursor-pointer relative overflow-hidden shadow-2xl
                                    ${selectedProjectId === project.id ? 'border-celestial-emerald/40 bg-emerald-500/[0.03] scale-[1.02]' : 'hover:border-white/20'}
                                `}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${selectedProjectId === project.id ? 'text-emerald-400' : 'text-gray-500'} group-hover:text-emerald-400 transition-colors`}>
                                            <Globe className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{project.status}</div>
                                            <h3 className="zh-main text-xl text-white truncate max-w-[180px]">{project.title}</h3>
                                        </div>
                                    </div>
                                    <div className="uni-mini bg-black/40 text-emerald-500 border-emerald-500/20">XP: {project.impactXP}</div>
                                </div>
                                <ImpactProgressBar progress={project.progress} />
                                {project.status === 'completed' && (
                                    <div className="absolute top-4 right-4 rotate-12 opacity-30">
                                        <Trophy className="w-16 h-16 text-celestial-gold" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right: Detailed Dashboard & Theory of Change (8/12) */}
            <div className="col-span-12 lg:col-span-8 flex flex-col min-h-0 overflow-hidden">
                {selectedProject ? (
                    <div className="flex-1 glass-bento bg-slate-950/40 border-white/5 rounded-[3.5rem] p-10 flex flex-col overflow-y-auto no-scrollbar shadow-2xl animate-slide-up relative">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none"><Rocket className="w-96 h-96" /></div>
                        
                        {/* Header Info */}
                        <div className="flex justify-between items-start mb-12 border-b border-white/10 pb-10 shrink-0 relative z-10">
                            <div className="space-y-4 max-w-2xl">
                                <div className="flex items-center gap-3">
                                    <div className="px-3 py-1 bg-emerald-500 text-black text-[9px] font-black rounded uppercase tracking-widest">ACTIVE_STRATEGY</div>
                                    <div className="flex gap-1">
                                        {selectedProject.sdgs.map(s => (
                                            <span key={s} className="w-6 h-6 rounded bg-black border border-white/10 flex items-center justify-center text-[9px] font-bold text-white shadow-lg">S{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <h2 className="zh-main text-5xl text-white leading-tight tracking-tighter">{selectedProject.title}</h2>
                                <p className="text-gray-400 text-lg leading-relaxed font-light">{selectedProject.description}</p>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                                <SroiIndicator value={selectedProject.sroi + (selectedProject.progress / 50)} />
                                <div className="flex gap-2">
                                    <button onClick={handleGenerateStoryReport} disabled={isAiProcessing} className="px-6 py-2.5 bg-white text-black font-black rounded-xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-50">
                                        {isAiProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} STORY_GEN
                                    </button>
                                    <button className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-white border border-white/5 transition-all"><Share2 className="w-5 h-5"/></button>
                                </div>
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                            {/* Left Col: Logic Model & Milestones */}
                            <div className="space-y-10">
                                <section className="space-y-6">
                                    <h4 className="flex items-center gap-4 zh-main text-xl text-white uppercase tracking-widest border-l-4 border-celestial-emerald pl-6">
                                        <Layout className="w-6 h-6 text-celestial-emerald" />
                                        {isZh ? '變革理論：邏輯鏈路' : 'Theory of Change Chain'}
                                    </h4>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Inputs (投入)', data: selectedProject.logicModel.inputs, icon: Box, color: 'text-blue-400' },
                                            { label: 'Activities (活動)', data: selectedProject.logicModel.activities, icon: Activity, color: 'text-purple-400' },
                                            { label: 'Outputs (產出)', data: selectedProject.logicModel.outputs, icon: Target, color: 'text-emerald-400' }
                                        ].map(block => (
                                            <div key={block.label} className="p-5 bg-black/40 rounded-[2rem] border border-white/5 hover:border-white/20 transition-all group">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <block.icon className={`w-4 h-4 ${block.color}`} />
                                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{block.label}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {block.data.map((item, i) => (
                                                        <span key={i} className="px-3 py-1.5 bg-white/5 rounded-xl text-[11px] text-gray-300 border border-white/5 group-hover:border-white/10 transition-all">{item}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <h4 className="flex items-center gap-4 zh-main text-xl text-white uppercase tracking-widest border-l-4 border-celestial-purple pl-6">
                                        <Medal className="w-6 h-6 text-celestial-purple" />
                                        {isZh ? '行動里程碑與見證' : 'Action Milestones'}
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedProject.milestones.map((m, i) => (
                                            <div key={m.id} className={`p-6 rounded-[2rem] border transition-all flex items-center justify-between group relative overflow-hidden
                                                ${m.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-black/40 border-white/5 hover:border-white/20'}
                                            `}>
                                                <div className="flex items-center gap-4 relative z-10">
                                                    <div className={`p-3 rounded-2xl ${m.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-gray-600'}`}>
                                                        {m.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-white mb-0.5">{m.title}</div>
                                                        <div className="text-[10px] text-gray-500 italic max-w-[200px] truncate">{m.description}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 relative z-10">
                                                    {m.status === 'completed' ? (
                                                        <div className="text-right">
                                                            <div className="text-[10px] text-emerald-400 font-mono font-bold">VERIFIED</div>
                                                            <div className="text-[7px] text-gray-600 font-mono">HASH: {m.verifiedHash}</div>
                                                        </div>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleExecuteMilestone(selectedProject, m)}
                                                            disabled={isVerifying === m.id}
                                                            className="p-3 bg-white/5 hover:bg-celestial-purple hover:text-white rounded-2xl transition-all border border-white/10 group-hover:scale-110 active:scale-95"
                                                        >
                                                            {isVerifying === m.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Right Col: KPIs & Financials */}
                            <div className="space-y-10">
                                <section className="space-y-6">
                                    <h4 className="flex items-center gap-4 zh-main text-xl text-white uppercase tracking-widest border-l-4 border-celestial-gold pl-6">
                                        <TrendingUp className="w-6 h-6 text-celestial-gold" />
                                        {isZh ? '影響力績效指標' : 'Impact KPIs'}
                                    </h4>
                                    <div className="space-y-4">
                                        {selectedProject.impactMetrics.map((kpi, i) => (
                                            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.04] transition-all group">
                                                <div className="flex justify-between items-start mb-4">
                                                    <span className="zh-main text-base text-white group-hover:text-celestial-gold transition-colors">{kpi.label}</span>
                                                    <div className="text-right">
                                                        <div className="text-sm font-mono font-bold text-white">{kpi.current} / {kpi.target} <span className="text-[10px] text-gray-600 font-normal uppercase ml-1">{kpi.unit}</span></div>
                                                    </div>
                                                </div>
                                                <ImpactProgressBar progress={(kpi.current / kpi.target) * 100} color="bg-gradient-to-r from-celestial-gold to-amber-500" label="KPI_Progress" />
                                                <div className="mt-6 flex justify-between items-center text-[10px] font-mono text-gray-600 bg-black/40 p-3 rounded-xl border border-white/5">
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="w-3 h-3 text-emerald-400" />
                                                        <span>Proxy_Val: ${kpi.proxy_value}/unit</span>
                                                    </div>
                                                    <span className="text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-1.5"><Activity className="w-3 h-3"/> SYNC_ACTIVE</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <h4 className="flex items-center gap-4 zh-main text-xl text-white uppercase tracking-widest border-l-4 border-indigo-400 pl-6">
                                        <DollarSign className="w-6 h-6 text-indigo-400" />
                                        {isZh ? '資源與財務效能' : 'Resource Efficiency'}
                                    </h4>
                                    <div className="p-10 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[3.5rem] border border-indigo-500/20 shadow-inner space-y-8">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Budget_Utilization</div>
                                                <div className="text-4xl font-mono font-black text-white tracking-tighter">${(selectedProject.financials.spent / 1000).toFixed(1)}k</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] text-gray-500 uppercase font-black">Total_Cap</div>
                                                <div className="text-lg font-mono font-bold text-gray-400">${(selectedProject.financials.budget / 1000).toFixed(1)}k</div>
                                            </div>
                                        </div>
                                        <ImpactProgressBar progress={(selectedProject.financials.spent / selectedProject.financials.budget) * 100} color="bg-indigo-500" label="Budget_Burn" />
                                        
                                        <div className="p-5 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-indigo-500/20 rounded-xl"><TrendingUp className="w-5 h-5 text-indigo-400" /></div>
                                                <span className="text-xs font-bold text-gray-300">Projected_Revenue</span>
                                            </div>
                                            <span className="text-xl font-mono font-bold text-white">${(selectedProject.financials.revenue_projected / 1000).toFixed(1)}k</span>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>

                        {/* Story / Report Export Actions */}
                        <div className="mt-20 pt-12 border-t border-white/10 flex flex-col md:flex-row gap-8 relative z-10">
                            <div className="flex-1 p-8 bg-white/5 rounded-[3rem] border border-white/5 relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><FileText className="w-32 h-32" /></div>
                                <h5 className="zh-main text-2xl text-white mb-3">影響力故事報告 (Public)</h5>
                                <p className="text-sm text-gray-500 mb-8 leading-relaxed italic">一鍵將您的數據轉化為具備情感張力的社會價值故事，適合品牌公關與大眾社群分享。</p>
                                <button onClick={handleGenerateStoryReport} disabled={isAiProcessing} className="px-8 py-4 bg-white text-black font-black rounded-2xl flex items-center gap-3 hover:bg-celestial-gold transition-all text-xs uppercase tracking-widest shadow-xl">
                                    {isAiProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} GENERATE_STORY_REPORT
                                </button>
                            </div>
                            <div className="flex-1 p-8 bg-emerald-500/5 rounded-[3rem] border border-emerald-500/20 relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity"><ShieldCheck className="w-32 h-32 text-emerald-500" /></div>
                                <h5 className="zh-main text-2xl text-white mb-3">SROI 合規評核報表 (Audit)</h5>
                                <p className="text-sm text-gray-500 mb-8 leading-relaxed italic">生成符合社會價值國際標準之 SROI 完整報表，包含所有數據證跡與核驗雜湊。</p>
                                <button className="px-8 py-4 bg-emerald-500 text-black font-black rounded-2xl flex items-center gap-3 hover:bg-emerald-400 transition-all text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/10">
                                    <FileSearch className="w-4 h-4" /> COMPILE_SROI_AUDIT
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-10 select-none grayscale animate-pulse">
                        <Target className="w-64 h-64 text-gray-600 mb-8" />
                        <h3 className="zh-main text-5xl text-white uppercase tracking-[0.2em] mb-4">Select Project Shard</h3>
                        <p className="text-gray-500 text-xl max-w-sm font-light italic">"Choose an active manifest from the hub to access its full logic matrix and witness history."</p>
                    </div>
                )}
            </div>
        </div>

        {/* AI Forge Wizard (Modal) */}
        {showForge && (
            <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-2xl animate-fade-in">
                <div className="w-full max-w-4xl glass-bento bg-slate-900 border border-white/10 rounded-[4rem] shadow-[0_50px_150px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden h-[90vh]">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.05]"><Zap className="w-64 h-64" /></div>
                    <button onClick={() => setShowForge(false)} className="absolute top-10 right-10 p-4 hover:bg-white/5 rounded-3xl text-gray-500 transition-all z-[700]"><X className="w-8 h-8"/></button>
                    
                    <div className="flex-1 flex flex-col h-full overflow-hidden">
                        {/* Wizard Header */}
                        <div className="p-8 md:p-16 pb-0 shrink-0">
                            <div className="flex items-center gap-6 md:gap-8 mb-8 md:mb-10">
                                <div className="p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] bg-celestial-emerald/20 text-celestial-emerald border-2 border-celestial-emerald/30 shadow-[0_0_40px_rgba(16,185,129,0.3)] animate-ai-pulse">
                                    <Sparkles className={`w-8 h-8 md:w-10 md:h-10 ${isAiProcessing ? 'animate-spin' : 'animate-pulse'}`} />
                                </div>
                                <div>
                                    <h3 className="zh-main text-2xl md:text-5xl text-white tracking-tighter">創價專案顯化熔爐</h3>
                                    <p className="text-gray-500 uppercase tracking-[0.4em] font-black text-[8px] md:text-[10px] mt-2 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-celestial-gold animate-ping" />
                                        Impact_Manifestation_Reactor_v1.2
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 md:gap-6 mb-8 md:mb-16">
                                {[1, 2, 3].map(s => (
                                    <div key={s} className="flex items-center gap-4">
                                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl flex items-center justify-center text-xs md:sm font-black border-2 transition-all duration-700
                                            ${wizardStep === s ? 'bg-celestial-emerald border-celestial-emerald text-black shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-110' : 
                                              wizardStep > s ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-black/40 border-white/10 text-gray-700'}
                                        `}>
                                            {wizardStep > s ? <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" /> : `0${s}`}
                                        </div>
                                        {s < 3 && <div className={`h-0.5 w-12 md:w-20 rounded-full transition-all duration-1000 ${wizardStep > s ? 'bg-emerald-500' : 'bg-slate-800'}`} />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Wizard Body */}
                        <div className="flex-1 overflow-y-auto no-scrollbar p-8 md:p-16 pt-0">
                            {wizardStep === 1 && (
                                <div className="space-y-8 md:space-y-12 animate-fade-in">
                                    <div className="space-y-4">
                                        <label className="text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Visionary Project Title</label>
                                        <input 
                                            value={wizardData.title}
                                            onChange={e => { setWizardData({...wizardData, title: e.target.value}); if(wizardErrors.title) setWizardErrors({...wizardErrors, title: ''}); }}
                                            className={`w-full bg-black/60 border-2 rounded-[1.5rem] md:rounded-[2rem] px-6 md:px-10 py-4 md:py-6 text-xl md:text-3xl text-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-gray-800 shadow-inner ${wizardErrors.title ? 'border-rose-500/50' : 'border-white/10 focus:border-celestial-emerald'}`}
                                            placeholder="Enter project name..."
                                        />
                                        {wizardErrors.title && <div className="flex items-center gap-1.5 text-[10px] text-rose-400 font-bold uppercase pl-2 animate-fade-in"><AlertCircle className="w-3 h-3" /> {wizardErrors.title}</div>}
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] md:text-xs font-black text-gray-500 uppercase tracking-[0.3em] ml-1">The "Theory of Change" Input</label>
                                        <textarea 
                                            value={wizardData.desc}
                                            rows={5}
                                            onChange={e => { setWizardData({...wizardData, desc: e.target.value}); if(wizardErrors.desc) setWizardErrors({...wizardErrors, desc: ''}); }}
                                            className={`w-full bg-black/60 border-2 rounded-[2rem] md:rounded-[2.5rem] px-6 md:px-10 py-6 md:py-8 text-base md:text-xl text-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all resize-none placeholder:text-gray-800 leading-relaxed shadow-inner ${wizardErrors.desc ? 'border-rose-500/50' : 'border-white/10 focus:border-celestial-emerald'}`}
                                            placeholder="Describe the problem and your solving logic..."
                                        />
                                        {wizardErrors.desc && <div className="flex items-center gap-1.5 text-[10px] text-rose-400 font-bold uppercase pl-2 animate-fade-in"><AlertCircle className="w-3 h-3" /> {wizardErrors.desc}</div>}
                                    </div>
                                    <div className="flex flex-col gap-6">
                                        <button 
                                            onClick={handleRunAiGen}
                                            disabled={isAiProcessing || !wizardData.title || !wizardData.desc}
                                            className="w-full py-6 md:py-8 bg-white text-black font-black rounded-[2rem] md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 uppercase tracking-[0.4em] text-xs md:text-sm flex items-center justify-center gap-4"
                                        >
                                            {isAiProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Wand2 className="w-6 h-6" />}
                                            ACTIVATE_GENESIS_BLUEPRINT
                                        </button>
                                        <p className="text-center text-[8px] md:text-[10px] text-gray-600 uppercase tracking-widest italic">AI will automatically generate a full logic model based on your input.</p>
                                    </div>
                                </div>
                            )}

                            {wizardStep === 2 && aiProposal && (
                                <div className="space-y-12 animate-slide-up">
                                    <div className="glass-panel p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border-2 border-emerald-500/20 bg-emerald-500/[0.02] relative overflow-hidden shadow-2xl">
                                        <div className="absolute top-0 right-0 p-12 opacity-10 animate-prism-pulse"><ShieldCheck className="w-32 h-32 text-emerald-400" /></div>
                                        <h4 className="text-[11px] font-black text-celestial-gold uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                                            <Sparkles className="w-4 h-4" /> AI_MANIFESTED_THEORY_OF_CHANGE
                                        </h4>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-12">
                                            <div className="space-y-6">
                                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Impact_Narrative</div>
                                                <p className="text-gray-100 italic leading-relaxed text-lg font-light">"{aiProposal.logicModel?.impact}"</p>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Strategic_Alignment</div>
                                                <div className="flex flex-wrap gap-3">
                                                    {aiProposal.sdgs?.map(s => (
                                                        <div key={s} className="px-5 py-2.5 bg-black border border-white/10 rounded-2xl text-xs font-black text-white shadow-xl hover:border-celestial-gold transition-colors">SDG {s}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5 pb-2">Impact_Monetization_Proxies (SROI Base)</div>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                                {aiProposal.impactMetrics?.slice(0, 3).map((m, i) => (
                                                    <div key={i} className="p-6 bg-black/60 rounded-[1.8rem] border border-white/10 hover:border-celestial-gold/40 transition-all group">
                                                        <div className="text-[10px] font-bold text-gray-400 mb-2 truncate group-hover:text-white">{m.label}</div>
                                                        <div className="text-xl font-mono font-black text-emerald-400 tracking-tighter">${m.proxy_value}<span className="text-[8px] text-gray-600 ml-1">/UNIT</span></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 md:gap-8 pb-12">
                                        <button onClick={() => setWizardStep(1)} className="px-6 md:px-12 py-4 md:py-5 bg-white/5 border-2 border-white/10 text-white font-black rounded-[1.5rem] md:rounded-3xl hover:bg-white/10 transition-all uppercase tracking-[0.3em] text-[10px] md:text-xs">BACK_TO_REACTOR</button>
                                        <button 
                                            onClick={handleConfirmProject}
                                            className="flex-1 py-4 md:py-5 bg-gradient-to-r from-celestial-emerald to-emerald-600 text-white font-black rounded-[1.5rem] md:rounded-3xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.3em] text-[10px] md:text-xs flex items-center justify-center gap-4"
                                        >
                                            <Rocket className="w-5 h-5" /> REIFY_PROJECT_ENTITY
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
