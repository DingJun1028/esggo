
import React, { useState } from 'react';
import { X, Check, Star, Zap, ShieldCheck, Crown, Briefcase, User, Building } from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';
import { Language } from '../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, language }) => {
  const { tier, upgradeTier } = useCompany();
  const { addToast } = useToast();
  const isZh = language === 'zh-TW';
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'enterprise'>('personal');

  if (!isOpen) return null;

  const handleUpgrade = (targetTier: 'Pro' | 'Enterprise') => {
      setProcessing(true);
      setTimeout(() => {
          upgradeTier(targetTier);
          addToast('success', isZh ? `歡迎加入 ${targetTier} 會員！` : `Welcome to ${targetTier}!`, 'Upgrade Successful');
          setProcessing(false);
          onClose();
      }, 1500);
  };

  const personalFeatures = [
      { name: isZh ? '基本學習路徑 (Academy)' : 'Basic Learning Paths', free: true },
      { name: isZh ? '每日任務與成就系統' : 'Daily Quests & Badges', free: true },
      { name: isZh ? '社群論壇與活動參與' : 'Community & Events', free: true },
      { name: isZh ? '基礎儀表板 (Dashboard)' : 'Basic Dashboard', free: true },
      { name: isZh ? 'AI 報告助理 (基礎版)' : 'AI Report Assistant (Basic)', free: false, pro: true },
      { name: isZh ? '完整 ESG 認證課程' : 'Full Certification Courses', free: false, pro: true },
      { name: isZh ? '進階職涯星系' : 'Advanced Career Galaxy', free: false, pro: true },
  ];

  const enterpriseFeatures = [
      { name: isZh ? '多帳號管理' : 'Multi-seat Management', pro: false, ent: true },
      { name: isZh ? 'API 整合 (ERP/IoT)' : 'API Integration', pro: false, ent: true },
      { name: isZh ? '深度合規稽核 (Audit)' : 'Deep Compliance Audit', pro: false, ent: true },
      { name: isZh ? '供應鏈數據協作' : 'Supply Chain Collab', pro: false, ent: true },
      { name: isZh ? '客製化報告模版' : 'Custom Report Templates', pro: false, ent: true },
      { name: isZh ? 'SLA 專屬支援' : 'SLA Support', pro: false, ent: true },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
        <div className="relative w-full max-w-5xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[80vh]">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white z-20 transition-colors">
                <X className="w-5 h-5" />
            </button>

            {/* Header Area */}
            <div className="p-8 pb-0 text-center relative z-10">
                <h2 className="text-3xl font-bold text-white mb-2">{isZh ? '解鎖完整 ESG 潛能' : 'Unlock Full ESG Potential'}</h2>
                <p className="text-gray-400 mb-6">
                    {isZh ? '80% 功能永久免費。升級解鎖 20% 核心 AI 與企業級功能。' : '80% Features Forever Free. Upgrade for top 20% AI & Enterprise Power.'}
                </p>
                
                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex">
                        <button 
                            onClick={() => setActiveTab('personal')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'personal' ? 'bg-celestial-purple text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <User className="w-4 h-4" /> {isZh ? '個人成長' : 'Personal Growth'}
                        </button>
                        <button 
                            onClick={() => setActiveTab('enterprise')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'enterprise' ? 'bg-celestial-gold text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Building className="w-4 h-4" /> {isZh ? '企業解決方案' : 'Enterprise Solutions'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 pt-0">
                {activeTab === 'personal' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {/* Free Plan */}
                        <div className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col hover:border-white/20 transition-all">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-white">Starter</h3>
                                <div className="text-3xl font-bold text-emerald-400 mt-2">$0 <span className="text-sm text-gray-400 font-normal">/ mo</span></div>
                                <p className="text-xs text-gray-400 mt-2">{isZh ? '適合 ESG 初學者與學生' : 'For beginners & students'}</p>
                            </div>
                            <div className="flex-1 space-y-3">
                                {personalFeatures.map((f, i) => (
                                    <div key={i} className={`flex items-center gap-3 text-sm ${f.free ? 'text-white' : 'text-gray-600'}`}>
                                        {f.free ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4" />}
                                        {f.name}
                                    </div>
                                ))}
                            </div>
                            <button className="mt-8 w-full py-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 font-bold text-sm cursor-default">
                                {isZh ? '當前方案' : 'Current Plan'}
                            </button>
                        </div>

                        {/* Pro Plan */}
                        <div className="p-6 rounded-2xl border border-celestial-purple/50 bg-gradient-to-b from-celestial-purple/10 to-transparent flex flex-col relative shadow-xl shadow-purple-900/20">
                            <div className="absolute top-0 right-0 bg-celestial-purple text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    Pro <Zap className="w-5 h-5 text-celestial-purple fill-current" />
                                </h3>
                                <div className="text-3xl font-bold text-white mt-2">$19 <span className="text-sm text-gray-400 font-normal">/ mo</span></div>
                                <p className="text-xs text-gray-400 mt-2">{isZh ? '適合專業顧問與求職者' : 'For consultants & job seekers'}</p>
                            </div>
                            <div className="flex-1 space-y-3">
                                {personalFeatures.map((f, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm text-white">
                                        <Check className="w-4 h-4 text-celestial-purple" />
                                        {f.name}
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => handleUpgrade('Pro')}
                                disabled={processing || tier === 'Pro'}
                                className="mt-8 w-full py-3 rounded-xl bg-celestial-purple hover:bg-purple-600 text-white font-bold text-sm transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50"
                            >
                                {processing ? 'Processing...' : (tier === 'Pro' ? 'Active' : (isZh ? '立即升級 Pro' : 'Upgrade to Pro'))}
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'enterprise' && (
                    <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-celestial-gold/30 p-8 flex flex-col md:flex-row gap-8 shadow-2xl">
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                                Enterprise <Crown className="w-6 h-6 text-celestial-gold fill-current" />
                            </h3>
                            <p className="text-gray-300 mb-6">
                                {isZh 
                                    ? '為大型組織量身打造的 AI 決策系統。包含所有 Pro 功能以及：' 
                                    : 'AI Decision System tailored for large organizations. Includes all Pro features plus:'}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {enterpriseFeatures.map((f, i) => (
                                    <div key={i} className="flex items-center gap-3 text-sm text-white">
                                        <div className="p-1 rounded-full bg-celestial-gold/20 text-celestial-gold">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        {f.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="md:w-64 flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-8">
                            <div className="text-center mb-6">
                                <span className="text-3xl font-bold text-white">Custom</span>
                                <p className="text-xs text-gray-400 mt-1">{isZh ? '年繳 / 專案報價' : 'Annual / Project based'}</p>
                            </div>
                            <button 
                                onClick={() => handleUpgrade('Enterprise')} // Simulating contact flow
                                className="w-full py-3 rounded-xl bg-celestial-gold hover:bg-amber-400 text-black font-bold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                            >
                                <Briefcase className="w-4 h-4" />
                                {isZh ? '聯絡業務' : 'Contact Sales'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
