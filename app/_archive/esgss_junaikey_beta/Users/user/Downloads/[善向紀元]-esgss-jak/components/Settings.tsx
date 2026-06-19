
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { Language } from '../types';
import { 
  Settings as SettingsIcon, Save, RotateCcw, User, Building, 
  PlayCircle, Factory, ChevronDown, HelpCircle, Layout, Github, Zap,
  AlertCircle, Globe, Link as LinkIcon, Activity as ActivityIcon
} from 'lucide-react';
import { UniversalPageHeader } from './UniversalPageHeader';
import { z } from 'zod';

export const Settings: React.FC<{ language: Language }> = ({ language }) => {
  const { 
    companyName, setCompanyName, 
    industrySector, setIndustrySector,
    userName, setUserName,
    userRole, setUserRole,
    externalUrl, setExternalUrl,
    budget, setBudget,
    carbonCredits, setCarbonCredits,
    esgScores, updateEsgScore,
    resetData,
    addAuditLog,
    externalApiKeys,
    updateExternalApiKeys
  } = useCompany();
  
  const { addToast } = useToast();
  const isZh = language === 'zh-TW';

  const [formData, setFormData] = useState({
    companyName,
    industrySector,
    userName,
    userRole,
    externalUrl,
    budget,
    carbonCredits,
    envScore: esgScores.environmental,
    socScore: esgScores.social,
    govScore: esgScores.governance,
    openaiKey: externalApiKeys.openai || '',
    straicoKey: externalApiKeys.straico || '',
    githubKey: externalApiKeys.github || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const settingsSchema = useMemo(() => z.object({
    companyName: z.string().trim().min(2, isZh ? "企業名稱太短" : "Company name too short").max(50),
    industrySector: z.string().trim().min(2, isZh ? "請輸入產業別" : "Sector required"),
    userName: z.string().trim().min(2, isZh ? "名字太短" : "Name too short"),
    userRole: z.string().trim().min(2, isZh ? "職稱太短" : "Role too short"),
    externalUrl: z.string().url(isZh ? "請輸入有效的 URL 格式" : "Invalid URL format").or(z.literal('')),
    budget: z.number().min(0, isZh ? "預算不可為負數" : "Budget cannot be negative"),
    carbonCredits: z.number().min(0, isZh ? "碳權不可為負數" : "Credits cannot be negative"),
    envScore: z.number().min(0).max(100, isZh ? "數值必須在 0-100 之間" : "Value must be 0-100"),
    socScore: z.number().min(0).max(100),
    govScore: z.number().min(0).max(100),
    openaiKey: z.string().optional(),
    straicoKey: z.string().optional(),
    githubKey: z.string().refine(val => !val || val.startsWith('ghp_'), isZh ? "GitHub Token 格式不正確 (需以 ghp_ 開頭)" : "Invalid GitHub token format (must start with ghp_)").optional()
  }), [isZh]);

  const handleSave = () => {
    const result = settingsSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      addToast('error', isZh ? '數據檢核未通過' : 'Data validation failed', 'Validation Failed');
      return;
    }

    setErrors({});
    setCompanyName(formData.companyName);
    setIndustrySector(formData.industrySector);
    setUserName(formData.userName);
    setUserRole(formData.userRole);
    setExternalUrl(formData.externalUrl);
    setBudget(formData.budget);
    setCarbonCredits(formData.carbonCredits);
    
    updateEsgScore('environmental', formData.envScore);
    updateEsgScore('social', formData.socScore);
    updateEsgScore('governance', formData.govScore);

    updateExternalApiKeys({
        openai: formData.openaiKey,
        straico: formData.straicoKey,
        github: formData.githubKey
    });
    
    addAuditLog('System Configuration Update', `Modified system profile and parameters.`);
    addToast('success', isZh ? '系統參數已同步至內核' : 'Settings synchronized to kernel', 'Success');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? Number(value) : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const ErrorDisplay = ({ name }: { name: string }) => errors[name] ? (
    <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-rose-400 font-bold uppercase animate-fade-in px-1">
        <AlertCircle className="w-3 h-3" />
        {errors[name]}
    </div>
  ) : null;

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-32 overflow-y-auto no-scrollbar h-full">
      <UniversalPageHeader 
          icon={SettingsIcon}
          title={{ zh: '系統參數與內核配置', en: 'System & Kernel Config' }}
          description={{ zh: '管理個人檔案、企業實體、外部 API 與數據地景參數', en: 'Manage profile, enterprise, APIs, and landscape parameters.' }}
          language={language}
          tag={{ zh: '配置中心', en: 'CONFIG_CTRL' }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Profile Section */}
        <div className={`glass-panel p-8 rounded-[3rem] border transition-all duration-500 bg-slate-900/40 ${errors.userName || errors.userRole ? 'border-rose-500/30 ring-1 ring-rose-500/10' : 'border-white/10'}`}>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <User className="w-5 h-5 text-celestial-purple" />
                {isZh ? '個人與角色身份' : 'Identity Shard'}
            </h3>
            <div className="space-y-6">
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-black uppercase ml-1 tracking-widest">Display_Name</label>
                    <input 
                        type="text" name="userName" value={formData.userName} onChange={handleChange}
                        className={`w-full bg-slate-950 border rounded-xl px-5 py-3.5 text-white focus:ring-1 focus:ring-celestial-purple outline-none transition-all ${errors.userName ? 'border-rose-500/50' : 'border-white/10'}`}
                    />
                    <ErrorDisplay name="userName" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-black uppercase ml-1 tracking-widest">Vocation_Title</label>
                    <input 
                        type="text" name="userRole" value={formData.userRole} onChange={handleChange}
                        className={`w-full bg-slate-950 border rounded-xl px-5 py-3.5 text-white focus:ring-1 focus:ring-celestial-purple outline-none transition-all ${errors.userRole ? 'border-rose-500/50' : 'border-white/10'}`}
                    />
                    <ErrorDisplay name="userRole" />
                </div>
            </div>
        </div>

        {/* API Integration Section */}
        <div className={`glass-panel p-8 rounded-[3rem] border transition-all duration-500 bg-slate-900/40 ${errors.githubKey ? 'border-rose-500/30' : 'border-white/10'}`}>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <Zap className="w-5 h-5 text-celestial-gold" />
                {isZh ? '外部 API 深度整合' : 'Nexus Integrations'}
            </h3>
            <div className="space-y-6">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">GitHub_PAT (ghp_*)</label>
                    <div className="relative">
                        <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                        <input 
                            type="password" name="githubKey" value={formData.githubKey} onChange={handleChange}
                            placeholder="ghp_xxxxxxxxxxxx"
                            className={`w-full bg-slate-950 border rounded-xl pl-12 pr-4 py-3.5 text-white focus:ring-1 focus:ring-celestial-gold outline-none transition-all ${errors.githubKey ? 'border-rose-500/50' : 'border-white/10'}`}
                        />
                    </div>
                    <ErrorDisplay name="githubKey" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Straico_Service_Key</label>
                    <input 
                        type="password" name="straicoKey" value={formData.straicoKey} onChange={handleChange}
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-5 py-3.5 text-white focus:ring-1 focus:ring-celestial-gold outline-none"
                    />
                </div>
            </div>
        </div>

        {/* Enterprise Section */}
        <div className={`glass-panel p-10 rounded-[3.5rem] border transition-all duration-500 bg-slate-900/40 md:col-span-2 ${errors.companyName || errors.industrySector || errors.externalUrl ? 'border-rose-500/30' : 'border-white/10'}`}>
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-4">
                <Building className="w-6 h-6 text-celestial-blue" />
                {isZh ? '企業實體與數位足跡' : 'Enterprise Entity & Footprint'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Entity_Legal_Name</label>
                    <input 
                        type="text" name="companyName" value={formData.companyName} onChange={handleChange}
                        className={`w-full bg-slate-950 border rounded-2xl px-5 py-4 text-white focus:ring-1 focus:ring-celestial-blue outline-none transition-all ${errors.companyName ? 'border-rose-500/50' : 'border-white/10'}`}
                    />
                    <ErrorDisplay name="companyName" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Industry_Sector</label>
                    <div className="relative">
                        <Factory className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                        <input 
                            type="text" name="industrySector" value={formData.industrySector} onChange={handleChange}
                            className={`w-full bg-slate-950 border rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-1 focus:ring-celestial-blue outline-none transition-all ${errors.industrySector ? 'border-rose-500/50' : 'border-white/10'}`}
                        />
                    </div>
                    <ErrorDisplay name="industrySector" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Global_Web_Narrative (URL)</label>
                    <div className="relative">
                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                        <input 
                            type="text" name="externalUrl" value={formData.externalUrl} onChange={handleChange}
                            placeholder="https://..."
                            className={`w-full bg-slate-950 border rounded-2xl pl-12 pr-4 py-4 text-white focus:ring-1 focus:ring-celestial-blue outline-none transition-all ${errors.externalUrl ? 'border-rose-500/50' : 'border-white/10'}`}
                        />
                    </div>
                    <ErrorDisplay name="externalUrl" />
                </div>
            </div>
        </div>

        {/* Financial & Performance Section */}
        <div className={`glass-panel p-10 rounded-[3.5rem] border transition-all duration-500 bg-slate-950 md:col-span-2 ${errors.budget || errors.carbonCredits || errors.envScore ? 'border-rose-500/30' : 'border-emerald-500/10'}`}>
            <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xl font-bold text-white flex items-center gap-4">
                    {/* Added comment above fix: Activity icon was previously used as ActivityIcon without being imported. */}
                    <ActivityIcon className="w-6 h-6 text-emerald-400" />
                    {isZh ? '財務配置與預期績效' : 'Financials & Target Metrics'}
                </h3>
                <div className="uni-mini bg-emerald-500/10 text-emerald-400 border-none">Simulation_Active</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-black uppercase ml-1 tracking-widest">Total_Budget (USD)</label>
                    <input 
                        type="number" name="budget" value={formData.budget} onChange={handleChange}
                        className={`w-full bg-black/40 border rounded-2xl px-5 py-4 text-xl font-mono font-bold text-white focus:ring-1 focus:ring-emerald-500 outline-none transition-all ${errors.budget ? 'border-rose-500/50' : 'border-white/5'}`}
                    />
                    <ErrorDisplay name="budget" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-black uppercase ml-1 tracking-widest">Carbon_Quota (tCO2e)</label>
                    <input 
                        type="number" name="carbonCredits" value={formData.carbonCredits} onChange={handleChange}
                        className={`w-full bg-black/40 border rounded-2xl px-5 py-4 text-xl font-mono font-bold text-celestial-gold focus:ring-1 focus:ring-emerald-500 outline-none transition-all ${errors.carbonCredits ? 'border-rose-500/50' : 'border-white/5'}`}
                    />
                    <ErrorDisplay name="carbonCredits" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-black uppercase ml-1 tracking-widest">Target_Env_Score (%)</label>
                    <input 
                        type="number" name="envScore" value={formData.envScore} onChange={handleChange}
                        className={`w-full bg-black/40 border rounded-2xl px-5 py-4 text-xl font-mono font-bold text-emerald-400 focus:ring-1 focus:ring-emerald-500 outline-none transition-all ${errors.envScore ? 'border-rose-500/50' : 'border-white/5'}`}
                    />
                    <ErrorDisplay name="envScore" />
                </div>
                <div className="flex flex-col justify-center gap-2">
                     <div className="text-[9px] text-gray-600 leading-relaxed font-light">
                        * 指標變更將影響 AI 決策模型的優先級矩陣與建議生成的「熵減」策略。
                     </div>
                </div>
            </div>
        </div>
      </div>

      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] animate-slide-up flex gap-4">
          <button 
            onClick={resetData}
            className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-rose-500/20 text-rose-400 font-black rounded-2xl border border-rose-500/20 transition-all uppercase tracking-widest text-xs"
          >
            <RotateCcw className="w-5 h-5" /> {isZh ? '重置數據' : 'RESET'}
          </button>
          <button 
            onClick={handleSave}
            className="flex items-center gap-4 px-16 py-5 bg-gradient-to-r from-celestial-emerald to-celestial-blue text-white font-black rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.3em] text-sm"
          >
            <Save className="w-6 h-6" />
            {isZh ? '同步內核設定' : 'COMMIT CONFIG'}
          </button>
      </div>
    </div>
  );
};
