
import React, { useState } from 'react';
import { 
    FileUp, Zap, ShieldCheck, CheckCircle, Info, 
    Loader2, Save, Send, ArrowRight, X, AlertTriangle,
    Leaf, Heart, Scale, Globe, Star, Activity, ShieldAlert
} from 'lucide-react';
import { Language } from '../types';
import { useToast } from '../contexts/ToastContext';
import { LogoIcon } from './Layout';
import { runMcpAction } from '../services/ai-service';

export const SupplierSurvey: React.FC<{ language: Language, onComplete?: () => void }> = ({ language, onComplete }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOcrRunning, setIsOcrRunning] = useState(false);
  const [purityResult, setPurityResult] = useState<any>(null);

  const [formData, setFormData] = useState({
      taxId: '',
      contact: '',
      elec: '',
      renew: '0',
      incidents: '0'
  });

  const handleOcrSim = async () => {
      setIsOcrRunning(true);
      setPurityResult(null);
      addToast('info', isZh ? '正在分析單據物理特徵與合規性...' : 'Analyzing document characteristics...', 'AI Auditor');
      
      try {
          const res = await runMcpAction('verify_data_purity', {}, language);
          if (res.success) {
              await new Promise(r => setTimeout(r, 2000));
              setPurityResult(res.result);
              
              if (res.result.clarity >= 80 && res.result.alignment >= 80) {
                  setFormData(prev => ({ ...prev, elec: '42850' }));
                  addToast('success', isZh ? '數據提純完成：42,850 度' : 'Data purified: 42,850 kWh', 'Action 05');
              } else {
                  addToast('warning', isZh ? '偵測到光學迷霧：請參考 AI 指引重拍' : 'Optical blur detected: see AI guidance', 'System');
              }
          }
      } catch (e) {
          addToast('error', 'Purification sequence interrupted', 'Fault');
      } finally {
          setIsOcrRunning(false);
      }
  };

  const handleFinalSubmit = () => {
      setIsSubmitting(true);
      setTimeout(() => {
          setIsSubmitting(false);
          setStep(4);
          addToast('reward', isZh ? '感謝提交！數據已刻印於永續中樞。' : 'Submission Complete! Data engraved.', 'Success');
      }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-[#020617] flex flex-col items-center justify-center p-4 md:p-12 overflow-hidden font-sans">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
        
        <div className="w-full max-w-2xl glass-bento bg-slate-900 border-white/10 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col h-full max-h-[850px]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-celestial-emerald to-celestial-blue opacity-50" />
            
            {/* Header */}
            <div className="p-10 pb-6 border-b border-white/5 bg-slate-950/40 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-5">
                    <LogoIcon className="w-10 h-10" />
                    <div>
                        <h2 className="zh-main text-xl text-white uppercase tracking-tighter">供應商數據採集門戶</h2>
                        <span className="en-sub !mt-0 text-[8px] text-emerald-400 font-black">ESGss_COLLECT_v2.0_SYNC</span>
                    </div>
                </div>
                <div className="flex gap-1.5">
                    {[1, 2, 3].map(s => (
                        <div key={s} className={`w-6 h-1 rounded-full transition-all duration-700 ${step >= s ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-white/10'}`} />
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-10">
                {step === 1 && (
                    <div className="space-y-10 animate-fade-in">
                        <div className="space-y-4">
                            <h3 className="zh-main text-3xl text-white tracking-tighter uppercase flex items-center gap-4">
                                <span className="p-3 rounded-2xl bg-white/5 text-gray-500">01</span>
                                {isZh ? '身分與聯繫驗證' : 'Identify Shard'}
                            </h3>
                            <p className="text-gray-400 leading-relaxed italic">「確保我們締結的數據契約具備正確的實體主權。」</p>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Enterprise_Tax_ID (統一編號)</label>
                                <input value={formData.taxId} onChange={e => setFormData({...formData, taxId: e.target.value})} className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-xl text-white focus:border-celestial-gold outline-none shadow-inner" placeholder="88888888" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Liaison_Oracle (永續聯絡人)</label>
                                <input value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-xl text-white focus:border-celestial-gold outline-none shadow-inner" placeholder="Name or Email" />
                            </div>
                        </div>
                        <button onClick={() => setStep(2)} disabled={!formData.taxId} className="w-full py-5 bg-white text-black font-black rounded-2xl hover:bg-celestial-gold transition-all active:scale-95 disabled:opacity-30 shadow-xl uppercase tracking-widest text-xs flex items-center justify-center gap-3">
                            CONTINUE_TO_ENVIRONMENT <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-10 animate-fade-in">
                        <div className="space-y-4">
                            <h3 className="zh-main text-3xl text-white tracking-tighter uppercase flex items-center gap-4">
                                <span className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">02</span>
                                {isZh ? '環境維度數據 (E)' : 'Environmental Shard'}
                            </h3>
                        </div>
                        <div className="space-y-8">
                            <div 
                                onClick={handleOcrSim}
                                className={`border-2 border-dashed rounded-[2.5rem] p-10 transition-all flex flex-col items-center justify-center text-center cursor-pointer group relative overflow-hidden
                                    ${isOcrRunning ? 'border-celestial-gold bg-celestial-gold/5' : 'border-white/10 bg-black/40 hover:border-emerald-500/40'}
                                `}
                            >
                                {isOcrRunning ? (
                                    <div className="flex flex-col items-center gap-4 animate-pulse relative z-10">
                                        <Loader2 className="w-12 h-12 text-celestial-gold animate-spin" />
                                        <span className="text-xs font-black text-celestial-gold uppercase tracking-widest">AI_PURIFYING_RAW_MEDIA...</span>
                                    </div>
                                ) : (
                                    <div className="relative z-10">
                                        <FileUp className="w-12 h-12 text-gray-700 mb-4 group-hover:text-emerald-400 group-hover:scale-110 transition-all" />
                                        <span className="zh-main text-white mb-1 uppercase tracking-widest">{isZh ? '點擊或拖曳上傳電費單' : 'UPLOAD_UTILITY_BILL'}</span>
                                        <p className="text-[10px] text-gray-600 uppercase font-black">AI will auto-extract metrics (Action 05)</p>
                                    </div>
                                )}
                            </div>

                            {purityResult && (
                                <div className="p-6 bg-black/60 border border-white/5 rounded-3xl space-y-6 animate-slide-up">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><ShieldCheck className="w-3 h-3"/> AI_PURITY_SCORECARD</span>
                                        <div className="flex gap-2">
                                            {purityResult.clarity >= 80 ? <CheckCircle className="w-3 h-3 text-emerald-500"/> : <ShieldAlert className="w-3 h-3 text-rose-500"/>}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-6">
                                        {[
                                            { label: 'Clarity', val: purityResult.clarity, c: 'emerald' },
                                            { label: 'Alignment', val: purityResult.alignment, c: 'blue' },
                                            { label: 'Validity', val: purityResult.validity, c: 'purple' }
                                        ].map(s => (
                                            <div key={s.label} className="space-y-1.5">
                                                <div className="flex justify-between text-[8px] font-black text-gray-600 uppercase"><span>{s.label}</span><span>{s.val}%</span></div>
                                                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div className={`h-full bg-${s.val >= 80 ? 'emerald' : 'rose'}-500 transition-all duration-1000`} style={{ width: `${s.val}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {purityResult.guidance_text && purityResult.clarity < 80 && (
                                        <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl flex gap-3 items-start animate-pulse">
                                            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                                            <p className="text-[11px] text-rose-300 leading-relaxed italic">"{purityResult.guidance_text}"</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest ml-1">Annual_Electricity_Usage (kWh)</label>
                                <input value={formData.elec} onChange={e => setFormData({...formData, elec: e.target.value})} className="w-full bg-black/60 border border-white/10 rounded-2xl px-6 py-4 text-2xl font-mono font-bold text-emerald-400 focus:border-emerald-500 outline-none shadow-inner" placeholder="0.00" />
                            </div>
                        </div>
                        <div className="flex gap-4">
                             <button onClick={() => setStep(1)} className="px-10 py-5 bg-white/5 text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all uppercase tracking-widest text-xs">BACK</button>
                             <button onClick={() => setStep(3)} disabled={!formData.elec} className="flex-1 py-5 bg-white text-black font-black rounded-2xl hover:bg-celestial-gold transition-all shadow-xl uppercase tracking-widest text-xs flex items-center justify-center gap-3">NEXT_PHASE <ArrowRight className="w-4 h-4"/></button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-10 animate-fade-in">
                        <div className="space-y-4">
                            <h3 className="zh-main text-3xl text-white tracking-tighter uppercase flex items-center gap-4">
                                <span className="p-3 rounded-2xl bg-purple-500/10 text-purple-400">03</span>
                                {isZh ? '治理與合規聲明 (G)' : 'Governance Shard'}
                            </h3>
                        </div>
                        <div className="p-8 bg-black/40 rounded-[2.5rem] border border-white/5 space-y-6">
                            <div className="flex gap-4 items-start group cursor-pointer" onClick={() => setFormData({...formData, incidents: '0'})}>
                                <div className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-all ${formData.incidents === '0' ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-white/20'}`}>
                                    {formData.incidents === '0' && <CheckCircle className="w-4 h-4" />}
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">過去一年無重大職災事件發生</div>
                                    <p className="text-[10px] text-gray-500 mt-1 italic">I certify that zero safety incidents occurred in 2025.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start group cursor-pointer">
                                <div className="w-6 h-6 rounded-lg border border-emerald-500 bg-emerald-500 text-black flex items-center justify-center shrink-0">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">同意簽署反貪腐與誠信經營承諾書</div>
                                    <p className="text-[10px] text-gray-500 mt-1 italic">Authorized digital signature for Anti-Corruption protocol.</p>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={handleFinalSubmit}
                            disabled={isSubmitting}
                            className="w-full py-6 bg-gradient-to-r from-celestial-emerald to-emerald-600 text-white font-black rounded-3xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.4em] text-sm flex items-center justify-center gap-4"
                        >
                            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <ShieldCheck className="w-6 h-6" />}
                            COMMIT_SACRED_DATA
                        </button>
                    </div>
                )}

                {step === 4 && (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20 animate-slide-up">
                        <div className="p-10 rounded-[3rem] bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 mb-10 shadow-2xl relative overflow-hidden">
                             <div className="absolute inset-0 bg-emerald-500 opacity-10 animate-pulse" />
                             <CheckCircle className="w-24 h-24 relative z-10" />
                        </div>
                        <h3 className="zh-main text-5xl text-white tracking-tighter mb-4 uppercase">數據已刻印 (Eternalized)</h3>
                        <p className="text-gray-400 text-xl font-light italic max-w-md">感謝您協助完成文明永續進度的採集。您的「信任分」已更新，並將直接影響未來之採購優先級。</p>
                        <button onClick={() => window.close()} className="mt-12 text-gray-600 hover:text-white transition-colors text-xs font-black uppercase tracking-widest border-b border-gray-800 pb-1">DISCONNECT_SESSION</button>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-slate-950/60 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-2 text-[9px] text-gray-700 font-mono uppercase tracking-[0.2em]">
                    <ShieldCheck className="w-3 h-3 text-emerald-500/50" /> Secure_Channel_Established
                </div>
                <div className="text-[9px] text-gray-800 font-mono">HASH: 0x8B32F...E02</div>
            </div>
        </div>
    </div>
  );
};
