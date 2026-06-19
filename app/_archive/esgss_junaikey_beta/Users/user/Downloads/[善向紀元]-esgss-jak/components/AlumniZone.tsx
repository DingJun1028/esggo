import React, { useState, useRef } from 'react';
import { Language, AppFile } from '../types';
import { 
    Users, Briefcase, GraduationCap, ArrowRight, MessageSquare, 
    UserPlus, Settings, BarChart, Activity, CheckCircle, Search, 
    Filter, FileUp, X, Plus, Layout, Palette, Save, Trash2, 
    FileText, Image as ImageIcon, Sparkles, Globe, Target, RefreshCw,
    Trophy, Award, Heart, ShieldCheck, Zap, Handshake, ChevronRight
} from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useToast } from '../contexts/ToastContext';
import { OmniEsgCell } from './OmniEsgCell';

export const AlumniZone: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { userRole, addFile, files, removeFile } = useCompany();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'network' | 'collaboration' | 'partners'>('network');
  const [showCanvas, setShowCanvas] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  
  const [proposalData, setProposalData] = useState({ title: '', desc: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derive role for view logic
  const currentRole = ['Admin', 'Partner', 'Agent', 'Parent'].includes(userRole) ? userRole : 'Student';

  const pageData = {
      title: { zh: '校友與生態夥伴專區', en: 'Alumni & Partner Nexus' },
      desc: { zh: '連結全球永續領袖，啟動跨界價值共創路徑', en: 'Connect global sustainability leaders & launch value co-creation paths.' },
      tag: { zh: '生態核心 v16.1', en: 'ECO_CORE_v16.1' }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          addFile(file, 'Collaboration');
          addToast('success', isZh ? '檔案已成功上傳至提案附件' : 'File uploaded to proposal attachments', 'Upload');
      }
  };

  const submitProposal = () => {
      addToast('reward', isZh ? '提案已提交！我們將在 3 個工作天內回覆。' : 'Proposal submitted! We will respond within 3 working days.', 'Success');
      setShowApplyForm(false);
      setProposalData({ title: '', desc: '' });
  };

  const CanvasManager = () => {
      const [layout, setLayout] = useState('Standard');
      return (
          <div className="fixed inset-0 z-[200] bg-slate-950 flex flex-col animate-fade-in font-sans">
              <div className="h-20 border-b border-white/10 flex items-center justify-between px-10 bg-slate-900/50 backdrop-blur-3xl">
                  <div className="flex items-center gap-6">
                      <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400 border border-emerald-500/30 shadow-lg">
                          <Palette className="w-7 h-7" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{isZh ? '合作夥伴畫布空間' : 'Partner Canvas Space'}</h3>
                        <span className="en-sub !mt-0.5 text-gray-500">CANVAS_EDITOR_v1.2_LIVE</span>
                      </div>
                  </div>
                  <div className="flex gap-4">
                      <button className="flex items-center gap-3 px-8 py-3 bg-white/5 hover:bg-white/10 rounded-2xl text-xs font-black text-white border border-white/10 transition-all uppercase tracking-widest">
                          <Save className="w-4 h-4" /> {isZh ? '儲存草稿' : 'Save Draft'}
                      </button>
                      <button 
                        onClick={() => setShowCanvas(false)} 
                        className="px-8 py-3 bg-emerald-500 text-black font-black rounded-2xl hover:scale-105 transition-all text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20"
                      >
                          COMMIT_PUBLISH
                      </button>
                      <button onClick={() => setShowCanvas(false)} className="p-3 hover:bg-white/5 rounded-2xl text-gray-500 transition-colors">
                          <X className="w-6 h-6" />
                      </button>
                  </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                  <div className="w-80 border-r border-white/10 bg-slate-900/30 p-8 space-y-10 overflow-y-auto no-scrollbar shrink-0">
                      <div>
                          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-6">{isZh ? '佈局模板' : 'Layout Presets'}</h4>
                          <div className="grid grid-cols-2 gap-3">
                              {['Standard', 'Dynamic', 'Grid', 'Focused'].map(p => (
                                  <button 
                                    key={p} 
                                    onClick={() => setLayout(p)}
                                    className={`p-5 rounded-2xl border transition-all flex flex-col items-center gap-3 ${layout === p ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-2xl' : 'bg-white/5 border-white/5 text-gray-700 hover:border-white/20'}`}
                                  >
                                      <Layout className="w-6 h-6" />
                                      <span className="text-[10px] font-black uppercase tracking-widest">{p}</span>
                                  </button>
                              ))}
                          </div>
                      </div>

                      <div className="space-y-6">
                          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-6">{isZh ? '可用組件' : 'Available Widgets'}</h4>
                          <div className="space-y-3">
                              {['Carbon Matrix', 'Risk Radar', 'Value Flow', 'Social Feed'].map(w => (
                                  <div key={w} className="p-4 bg-black/40 border border-white/5 rounded-2xl text-xs text-gray-300 flex justify-between items-center group cursor-grab hover:border-white/20 transition-all">
                                      <span className="font-bold">{w}</span>
                                      <Plus className="w-4 h-4 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>

                  <div className="flex-1 p-12 bg-[#020617] relative overflow-y-auto no-scrollbar">
                      <div className="max-w-6xl mx-auto space-y-12">
                          <div className="flex justify-between items-end border-b border-white/5 pb-10">
                              <div className="space-y-2">
                                  <div className="text-[11px] text-emerald-500 font-black uppercase tracking-[0.4em] flex items-center gap-3"><Sparkles className="w-4 h-4" /> Canvas_Preview_Active</div>
                                  <h2 className="zh-main text-5xl text-white tracking-tighter">Sustainability Ecosystem <span className="text-emerald-500 opacity-30">v1.0</span></h2>
                              </div>
                              <div className="flex gap-10">
                                  <div className="text-right">
                                      <div className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Global_Alignment</div>
                                      <div className="text-4xl font-mono font-black text-emerald-400 tracking-widest">92.4%</div>
                                  </div>
                              </div>
                          </div>

                          <div className="grid grid-cols-12 gap-8 h-[650px]">
                              <div className="col-span-8 bg-slate-900/40 rounded-[3rem] border-2 border-dashed border-white/5 p-12 relative flex items-center justify-center group/drop">
                                  <div className="absolute inset-0 bg-white/[0.01] rounded-[3rem] opacity-0 group-hover/drop:opacity-100 transition-opacity" />
                                  <div className="flex flex-col items-center gap-6 text-center">
                                      <div className="p-8 rounded-full bg-white/5 border border-white/10 group-hover/drop:scale-110 transition-transform duration-700">
                                        <Plus className="w-16 h-16 text-gray-800" />
                                      </div>
                                      <p className="text-[10px] text-gray-600 uppercase font-black tracking-[0.5em]">Drag components into primary nexus</p>
                                  </div>
                              </div>
                              <div className="col-span-4 flex flex-col gap-8">
                                  <div className="bg-slate-900/60 rounded-[2.5rem] border border-white/10 flex-1 p-10 shadow-2xl relative overflow-hidden">
                                      <div className="absolute top-0 right-0 p-6 opacity-5"><Activity className="w-32 h-32 text-emerald-400" /></div>
                                      <div className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-8 border-b border-white/5 pb-4">Live_Vitals_Telemetry</div>
                                      <div className="space-y-6">
                                          <OmniEsgCell mode="list" label="Network Health" value="OPTIMAL" color="emerald" className="!bg-black/40" />
                                          <OmniEsgCell mode="list" label="GWC Velocity" value="12.5k / hr" color="gold" className="!bg-black/40" />
                                      </div>
                                  </div>
                                  <div className="bg-black/60 rounded-[2.5rem] border border-white/5 flex-1 p-10 flex flex-col justify-center">
                                      <div className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-4">AI_Orchestrator_Note</div>
                                      <div className="text-sm text-gray-400 leading-relaxed italic font-light">
                                        "Detected high resonance in Social Shards. Consider scaling 'Community Feed' component to maximize stakeholder interaction."
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  const CollaborationTab = () => (
      <div className="space-y-8 animate-fade-in">
          <div className="flex justify-between items-end mb-4 px-2">
                <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white flex items-center gap-4 uppercase tracking-tighter">
                        <Handshake className="w-8 h-8 text-emerald-400" />
                        {isZh ? '異業價值共創機會' : 'Cross-Industry Opportunity'}
                    </h3>
                    <p className="text-sm text-gray-500 font-light italic">"Link existing assets to new sustainability projects."</p>
                </div>
                <button 
                    onClick={() => setShowApplyForm(true)}
                    className="flex items-center gap-3 px-8 py-4 bg-emerald-500 text-black font-black rounded-2xl hover:scale-105 transition-all text-xs uppercase tracking-widest shadow-2xl shadow-emerald-500/20 active:scale-95"
                >
                    <Plus className="w-4 h-4" /> {isZh ? '發起新提案' : 'NEW_PROPOSAL'}
                </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-bento p-10 rounded-[3rem] border-white/5 bg-slate-900/60 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5"><Zap className="w-32 h-32 text-celestial-gold" /></div>
                  <h4 className="text-xl font-black text-white mb-8 border-l-4 border-celestial-gold pl-6 uppercase tracking-widest">{isZh ? '推薦共創專案' : 'Hot Projects'}</h4>
                  <div className="space-y-6">
                      {[1].map(i => (
                        <div key={i} className="p-8 bg-black/40 rounded-[2.5rem] border border-white/10 hover:border-celestial-gold/40 transition-all cursor-pointer group shadow-xl">
                            <div className="flex justify-between items-start mb-6">
                                <div className="px-4 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase border border-emerald-500/30">OPEN_FOR_LINK</div>
                                <span className="text-[10px] font-mono text-gray-700 tracking-tighter">PROJECT_SME_0x8B32</span>
                            </div>
                            <h5 className="zh-main text-2xl text-white mb-3 group-hover:text-celestial-gold transition-colors leading-tight">SME Carbon Inventory 2.0</h5>
                            <p className="text-sm text-gray-400 mb-8 font-light leading-relaxed">Seeking partners to implement IoT monitoring for specialized textile plants in Northern Taiwan. Requires data bridge expertise.</p>
                            <div className="flex items-center justify-between border-t border-white/5 pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-gray-500">EC</div>
                                    <span className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">Partner: EcoSync</span>
                                </div>
                                {/* Fix: ChevronRight is now imported correctly from lucide-react */}
                                <ChevronRight className="w-5 h-5 text-gray-700 group-hover:translate-x-2 group-hover:text-celestial-gold transition-all" />
                            </div>
                        </div>
                      ))}
                  </div>
              </div>

              <div className="glass-bento p-10 rounded-[3rem] border-white/5 bg-slate-900/40 shadow-2xl flex flex-col">
                  <h4 className="text-xl font-black text-white mb-8 border-l-4 border-celestial-purple pl-6 uppercase tracking-widest">{isZh ? '活躍協作工作流' : 'Active Workflows'}</h4>
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 grayscale py-20">
                      <MessageSquare className="w-24 h-24 text-white mb-6" />
                      <p className="zh-main text-lg uppercase tracking-widest">{isZh ? '尚無活躍中的協作' : 'Awaiting Signals'}</p>
                      <p className="text-[10px] mt-2 italic">Connect with partners to start value-adding flows.</p>
                  </div>
              </div>
          </div>

          {showApplyForm && (
              <div className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6 animate-fade-in">
                  <div className="w-full max-w-3xl glass-bento rounded-[4rem] border border-white/10 bg-slate-900 overflow-hidden shadow-[0_50px_150px_rgba(0,0,0,0.8)] flex flex-col relative">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.05]"><Plus className="w-64 h-64 text-emerald-400" /></div>
                      <button onClick={() => setShowApplyForm(false)} className="absolute top-10 right-10 p-4 hover:bg-white/5 rounded-3xl text-gray-500 transition-all z-10"><X className="w-8 h-8"/></button>
                      
                      <div className="p-12 pb-0 shrink-0">
                          <div className="flex items-center gap-6 mb-8">
                              <div className="p-4 bg-emerald-500/20 rounded-3xl text-emerald-400 border border-emerald-500/30 shadow-2xl">
                                  <Handshake className="w-8 h-8" />
                              </div>
                              <div>
                                <h4 className="text-3xl font-black text-white tracking-tighter uppercase">{isZh ? '提交異業合作提案' : 'Forge Collaboration'}</h4>
                                <span className="en-sub !mt-0.5 text-emerald-500 font-black">PROPOSAL_ENGINE_v1.0</span>
                              </div>
                          </div>
                          <div className="h-px bg-white/5 w-full" />
                      </div>
                      
                      <div className="p-12 space-y-8 flex-1 overflow-y-auto no-scrollbar">
                          <div className="space-y-3">
                              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Directive_Title</label>
                              <input 
                                  value={proposalData.title}
                                  onChange={(e) => setProposalData({...proposalData, title: e.target.value})}
                                  className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-5 text-xl text-white focus:border-emerald-500/50 outline-none transition-all shadow-inner"
                                  placeholder="Enter project name..."
                              />
                          </div>

                          <div className="space-y-3">
                              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-1">Execution_Logic & Mission</label>
                              <textarea 
                                  rows={5}
                                  value={proposalData.desc}
                                  onChange={(e) => setProposalData({...proposalData, desc: e.target.value})}
                                  className="w-full bg-black/60 border border-white/10 rounded-3xl px-6 py-6 text-sm text-gray-200 outline-none focus:border-emerald-500/50 transition-all resize-none shadow-inner leading-relaxed"
                                  placeholder="Describe the co-creation mission..."
                              />
                          </div>

                          <div className="space-y-4">
                              <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] ml-1">Asset_Evidence_Upload</label>
                              <div 
                                  onClick={() => fileInputRef.current?.click()}
                                  className="border-2 border-dashed border-white/5 rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 hover:bg-white/5 transition-all group shadow-inner"
                              >
                                  <FileUp className="w-12 h-12 text-gray-800 group-hover:text-emerald-400 transition-colors mb-4" />
                                  <span className="text-xs font-black text-gray-600 uppercase tracking-widest">{isZh ? '拖曳附件至此 (企劃書/報價)' : 'DRAG_MANIFESTO_HERE'}</span>
                                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                              </div>
                              
                              {files.length > 0 && (
                                  <div className="flex flex-wrap gap-2 pt-2">
                                      {files.map(file => (
                                          <div key={file.id} className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-[10px] font-bold text-emerald-400 shadow-lg">
                                              <FileText className="w-3.5 h-3.5" />
                                              {file.name}
                                              <button onClick={(e) => { e.stopPropagation(); removeFile(file.id); }} className="ml-1 text-emerald-700 hover:text-rose-400 transition-colors"><X className="w-3 h-3" /></button>
                                          </div>
                                      ))}
                                  </div>
                              )}
                          </div>
                      </div>

                      <div className="p-10 bg-black/40 border-t border-white/10 flex justify-end gap-4 shrink-0">
                          <button onClick={() => setShowApplyForm(false)} className="px-10 py-3 text-[10px] font-black text-gray-600 hover:text-white transition-all uppercase tracking-widest">DISCARD</button>
                          <button 
                            onClick={submitProposal}
                            disabled={!proposalData.title || !proposalData.desc}
                            className="px-12 py-3 bg-white text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest disabled:opacity-30 shadow-2xl"
                          >
                            COMMIT_PROPOSAL
                          </button>
                      </div>
                  </div>
              </div>
          )}
      </div>
  );

  const PartnerZoneTab = () => (
      <div className="space-y-8 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-4 px-2">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white flex items-center gap-4 uppercase tracking-tighter">
                    <Globe className="w-8 h-8 text-celestial-gold" />
                    {isZh ? '全球生態夥伴名錄' : 'Global Ecosystem Registry'}
                </h3>
                <p className="text-sm text-gray-500 font-light italic">"Verified institutional nodes in the JAK network."</p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:flex-none">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input className="bg-slate-900 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-xs text-white focus:border-celestial-gold outline-none w-full md:w-72 shadow-inner" placeholder={isZh ? "搜尋核心節點..." : "Search nodes..."} />
                  </div>
                  <button className="p-3 bg-white/5 rounded-2xl text-gray-500 hover:text-white border border-white/10 transition-all"><Filter className="w-5 h-5" /></button>
              </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                  { name: 'EcoTech Solutions', cat: 'IoT & Monitoring', icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
                  { name: 'PureFlow Logistics', cat: 'Circular Supply Chain', icon: RefreshCw, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
                  { name: 'Impact Capital', cat: 'Green Investment', icon: BarChart, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
              ].map((p, i) => (
                  <div key={i} className="glass-bento p-10 rounded-[3.5rem] border border-white/5 bg-slate-900/40 hover:border-white/20 transition-all flex flex-col items-center text-center group shadow-2xl relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${p.bg} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000`} />
                      <div className={`w-24 h-24 rounded-[2rem] bg-black/60 border ${p.border} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 shadow-2xl relative z-10`}>
                          <p.icon className={`w-12 h-12 ${p.color}`} />
                      </div>
                      <h4 aria-label="Section Title" className="zh-main text-2xl text-white mb-2 relative z-10">{p.name}</h4>
                      <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-10 relative z-10">{p.cat}</p>
                      <button className="px-10 py-4 bg-white text-black font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all w-full flex items-center justify-center gap-3 relative z-10 hover:bg-celestial-gold active:scale-95 shadow-xl">
                          {isZh ? '建立神經連結' : 'ESTABLISH_LINK'} <ArrowRight className="w-4 h-4" />
                      </button>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderContent = () => {
      if (currentRole === 'Partner') {
          return (
              <div className="space-y-10 animate-fade-in">
                  <div className="p-10 rounded-[3.5rem] bg-gradient-to-r from-emerald-500/20 to-transparent border-2 border-emerald-500/30 flex items-center justify-between shadow-2xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(16,185,129,0.1)_0%,transparent_70%)]" />
                      <div className="flex items-center gap-8 relative z-10">
                          <div className="w-20 h-20 bg-emerald-500 text-black rounded-[2rem] flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                             <Briefcase className="w-10 h-10" />
                          </div>
                          <div>
                            <span className="zh-main text-3xl text-white block">{isZh ? '歡迎回來，合作夥伴' : 'Welcome, Partner Node'}</span>
                            <span className="en-sub !mt-1 !text-xs text-emerald-400 font-black tracking-widest">ECO_SYSTEM_AUTHORITY_L1</span>
                          </div>
                      </div>
                      <button 
                        onClick={() => setShowCanvas(true)} 
                        className="px-10 py-5 bg-white text-black font-black rounded-[2rem] hover:scale-105 transition-all text-xs uppercase tracking-widest shadow-2xl shadow-white/10 relative z-10 active:scale-95"
                      >
                          {isZh ? '進入畫布管理' : 'ACCESS_CANVAS'}
                      </button>
                  </div>
                  {activeTab === 'partners' ? <PartnerZoneTab /> : <CollaborationTab />} 
              </div>
          );
      }

      if (currentRole === 'Admin') {
          return (
              <div className="space-y-10 animate-fade-in">
                  <div className="p-10 bg-rose-500/10 border-2 border-rose-500/30 rounded-[4rem] flex items-center justify-between shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.03]"><Settings className="w-64 h-64 text-rose-500" /></div>
                      <div className="flex items-center gap-10 relative z-10">
                         <div className="p-6 bg-rose-500 text-white rounded-[2.5rem] shadow-[0_0_40px_rgba(244,63,94,0.3)]">
                            <Settings className="w-12 h-12" />
                         </div>
                         <div>
                            <h3 className="zh-main text-4xl text-white tracking-tighter uppercase mb-2">{isZh ? '行政管理中控台' : 'Kernel Admin'}</h3>
                            <p className="text-lg text-gray-500 font-light italic">{isZh ? '監控全體學員進度與系統生態演化指標。' : 'Monitoring alumni progress & ecosystem vitals.'}</p>
                         </div>
                      </div>
                      <div className="flex flex-col gap-4 relative z-10">
                         <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Audit_Trail_Log</button>
                         <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Node_Management</button>
                      </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      {[
                        { label: 'Network_Size', value: '1,245', icon: Users, color: 'emerald' },
                        { label: 'Active_Courses', value: '12', icon: GraduationCap, color: 'blue' },
                        { label: 'Waitlist', value: '8', icon: FileUp, color: 'gold' },
                        { label: 'Ecosystem_Value', value: '850k', icon: Activity, color: 'purple' }
                      ].map(stat => (
                        <div key={stat.label} className="glass-bento p-8 rounded-[2.5rem] border-white/10 bg-slate-900/40 flex flex-col justify-between h-40 shadow-xl group hover:border-white/20 transition-all">
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest group-hover:text-white transition-colors">{stat.label}</span>
                                <stat.icon className={`w-5 h-5 text-${stat.color}-400 group-hover:scale-110 transition-transform`} />
                            </div>
                            <div className="text-4xl font-mono font-black text-white tracking-tighter">{stat.value}</div>
                        </div>
                      ))}
                  </div>
              </div>
          );
      }

      if (currentRole === 'Agent') {
          return (
              <div className="space-y-10 animate-fade-in">
                  <div className="p-10 bg-blue-500/10 border-2 border-blue-500/30 rounded-[4rem] flex items-center justify-between shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-12 opacity-5"><BarChart className="w-64 h-64 text-blue-400" /></div>
                      <div className="flex items-center gap-10 relative z-10">
                         <div className="p-6 bg-blue-500 text-white rounded-[2.5rem] shadow-[0_0_40px_rgba(59,130,246,0.3)]">
                            <Briefcase className="w-12 h-12" />
                         </div>
                         <div>
                            <h3 className="zh-main text-4xl text-white tracking-tighter uppercase mb-2">{isZh ? '代理商業務中心' : 'Agent Sales Center'}</h3>
                            <p className="text-lg text-gray-500 font-light italic">{isZh ? '追蹤推廣成效、GWC 結算與引薦矩陣。' : 'Tracking performance, GWC sharing & referral matrix.'}</p>
                         </div>
                      </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-8 glass-bento p-10 rounded-[3rem] border border-white/5 bg-slate-900/60 shadow-2xl flex flex-col min-h-[400px]">
                        <div className="flex justify-between items-center mb-10">
                            <h4 className="zh-main text-xl text-white uppercase tracking-widest">Share_Performance_Analytics</h4>
                            <div className="uni-mini bg-blue-500/10 text-blue-400 border-none">Real-time</div>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center border border-white/5 border-dashed rounded-[2.5rem] bg-black/20">
                             <BarChart className="w-20 h-20 text-gray-800 opacity-20 mb-4" />
                             <p className="text-[10px] text-gray-600 uppercase font-black tracking-[0.4em]">Analytics Engine Initializing</p>
                        </div>
                    </div>
                    <div className="lg:col-span-4 glass-bento p-8 rounded-[3rem] border border-white/10 bg-slate-900/40 flex flex-col shadow-xl">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8 border-b border-white/5 pb-4">Top_Referral_Nodes</h4>
                        <div className="space-y-4 flex-1">
                            {[
                                { n: "ESG Strategy Q3", c: 14, g: "+450" },
                                { n: "Net Zero Masterclass", c: 28, g: "+1200" },
                                { n: "SME Audit Package", c: 9, g: "+300" }
                            ].map((item, i) => (
                                <div key={i} className="p-6 bg-white/5 rounded-2xl flex justify-between items-center border border-white/5 group hover:border-blue-400 transition-all">
                                    <div>
                                        <span className="text-xs font-bold text-gray-300 block mb-1 group-hover:text-white transition-colors">{item.n}</span>
                                        <span className="text-[10px] text-gray-600 font-mono uppercase">{item.c} Conversions</span>
                                    </div>
                                    <span className="text-xs text-emerald-400 font-mono font-black">{item.g} GWC</span>
                                </div>
                            ))}
                        </div>
                    </div>
                  </div>
              </div>
          );
      }

      if (currentRole === 'Parent') {
          return (
              <div className="space-y-10 animate-fade-in">
                  <div className="p-10 bg-purple-500/10 border-2 border-purple-500/30 rounded-[4rem] flex items-center justify-between shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-12 opacity-5"><Users className="w-64 h-64 text-purple-400" /></div>
                      <div className="flex items-center gap-10 relative z-10">
                         <div className="p-6 bg-purple-500 text-white rounded-[2.5rem] shadow-[0_0_40px_rgba(168,85,247,0.3)]">
                            <Heart className="w-12 h-12 fill-current" />
                         </div>
                         <div>
                            <h3 className="zh-main text-4xl text-white tracking-tighter uppercase mb-2">{isZh ? '家長監護中心' : 'Parent Dashboard'}</h3>
                            <p className="text-lg text-gray-500 font-light italic">{isZh ? '查看子女的學習路徑、成就證書與影響力足跡。' : "Monitoring your child's learning journey & impact footprint."}</p>
                         </div>
                      </div>
                  </div>
                  <div className="glass-bento p-10 rounded-[3.5rem] border border-white/5 bg-slate-900/40 shadow-2xl">
                      <div className="flex justify-between items-center mb-12">
                        <h4 className="zh-main text-2xl text-white tracking-widest uppercase">Learning_Dynamics_Stream</h4>
                        <div className="uni-mini bg-emerald-500/10 text-emerald-400 border-none">Synced</div>
                      </div>
                      <div className="space-y-6">
                          <div className="flex items-center gap-8 p-8 bg-black/40 rounded-[3rem] border border-white/5 group hover:border-emerald-500/30 transition-all">
                              <div className="p-5 bg-emerald-500/10 text-emerald-400 rounded-3xl border border-emerald-500/20 shadow-xl group-hover:scale-110 transition-transform">
                                <CheckCircle className="w-10 h-10" />
                              </div>
                              <div className="flex-1">
                                 <div className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">Course Completed: Carbon Footprint Basics</div>
                                 <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Verified Certificate Issued on 2024.05.12</div>
                              </div>
                              <button className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all">View_Cert</button>
                          </div>
                          <div className="flex items-center gap-8 p-8 bg-black/40 rounded-[3rem] border border-white/5 group hover:border-amber-500/30 transition-all">
                              <div className="p-5 bg-amber-500/10 text-amber-400 rounded-3xl border border-amber-500/20 shadow-xl group-hover:scale-110 transition-transform">
                                <Activity className="w-10 h-10" />
                              </div>
                              <div className="flex-1">
                                 <div className="text-xl font-black text-white group-hover:text-amber-400 transition-colors">Learning: SDG Leadership Module</div>
                                 <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Current Progress: 45% • Next: Global Equity Seminar</div>
                              </div>
                              <div className="w-48">
                                 <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                     <div className="h-full bg-amber-500" style={{ width: '45%' }} />
                                 </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          );
      }

      // Default Student/Consultant View
      if (activeTab === 'collaboration') return <CollaborationTab />;
      if (activeTab === 'partners') return <PartnerZoneTab />;

      return (
          <div className="space-y-10 animate-fade-in pb-12">
              <div className="p-8 rounded-[3.5rem] bg-gradient-to-r from-celestial-gold/20 to-transparent border-2 border-celestial-gold/30 mb-2 flex items-center justify-between shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(251,191,36,0.1)_0%,transparent_70%)]" />
                  <div className="flex items-center gap-8 relative z-10">
                      <div className="p-5 bg-celestial-gold text-black rounded-[2.5rem] shadow-[0_0_40px_rgba(251,191,36,0.3)]">
                          <GraduationCap className="w-12 h-12" />
                      </div>
                      <div>
                          <span className="zh-main text-3xl text-white block">{isZh ? '學員/顧問專屬視角' : 'Consultant_Level_Authority'}</span>
                          <span className="en-sub !mt-1 !text-xs text-celestial-gold font-black tracking-widest">ECO_DYNAMICS_NEXUS_v1.0</span>
                      </div>
                  </div>
                  <div className="flex gap-4 relative z-10">
                      <div className="text-right">
                          <div className="text-[10px] text-gray-500 uppercase font-black">Connection_Sync</div>
                          <div className="text-2xl font-mono font-bold text-white">99.4%</div>
                      </div>
                  </div>
              </div>
              
              <div className="glass-bento p-20 rounded-[4rem] border border-white/10 flex flex-col items-center justify-center text-center relative overflow-hidden group shadow-2xl bg-slate-900/60">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.03)_0%,transparent_70%)]" />
                  <div className="relative mb-12">
                      <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full scale-150 animate-pulse" />
                      <Users className="w-32 h-32 text-gray-700 relative z-10 group-hover:text-white group-hover:scale-110 transition-all duration-1000" />
                  </div>
                  <h3 className="zh-main text-5xl text-white tracking-tighter mb-6">{isZh ? '全球校友價值網絡' : 'Global Alumni Value Network'}</h3>
                  <p className="text-gray-400 text-xl font-light leading-relaxed max-w-2xl mb-12">
                    {isZh ? '連結來自全球的永續領袖與實踐者，啟動跨界專案共創與知識摺疊。' : 'Connect with sustainability pioneers globally to share projects, insights, and logic folding.'}
                  </p>
                  <button className="px-16 py-6 bg-white text-black font-black rounded-3xl hover:scale-105 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] uppercase tracking-[0.4em] text-xs active:scale-95">
                      {isZh ? '進入人脈矩陣' : 'ENTER_CONNECTION_MATRIX'}
                  </button>
              </div>
          </div>
      );
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in overflow-hidden pb-4">
        <UniversalPageHeader 
            icon={Users}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        <div className="flex bg-slate-900/50 p-1.5 rounded-2xl border border-white/10 w-fit backdrop-blur-xl shrink-0 px-2 ml-2">
            {[
                { id: 'network', label: isZh ? '人脈網絡' : 'Network', icon: Users },
                { id: 'collaboration', label: isZh ? '異業合作' : 'Collaboration', icon: Briefcase },
                { id: 'partners', label: isZh ? '生態夥伴' : 'Partners', icon: Globe },
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    <tab.icon className="w-4 h-4" />
                    {tab.label.toUpperCase()}
                </button>
            ))}
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-2">
            {renderContent()}
        </div>

        {showCanvas && <CanvasManager />}
    </div>
  );
};