
import React, { useState } from 'react';
import { Language, ProxyProduct, View } from '../types';
import { 
    Package, Search, Zap, DollarSign, ArrowRight, ShieldCheck, 
    Layers, Globe, Layout, Briefcase, FileText, Sparkles, 
    BookOpen, MessageSquare, Plus, Check, Filter, Lock, X, Terminal
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { useCompany } from './providers/CompanyProvider';

interface ProxyMarketplaceProps {
  language: Language;
}

const MOCK_PRODUCTS: ProxyProduct[] = [
    { 
        id: 'p1', name: 'Carbon Ledger Pro', category: 'SaaS', tier: 1, 
        basePrice: '$299/mo', commission: 15, knowledgeTags: ['GHG', 'SBTi'], 
        pitchScript: 'The ultimate tool for verified carbon accounting.' 
    },
    { 
        id: 'p2', name: 'IoT Energy Node X', category: 'Hardware', tier: 2, 
        basePrice: '$899', commission: 10, knowledgeTags: ['IoT', 'Energy'], 
        pitchScript: 'Real-time monitoring for factory floor efficiency.' 
    }
];

export const ProxyMarketplace: React.FC<ProxyMarketplaceProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { level } = useCompany();
  
  const [activeCategory, setActiveCategory] = useState<'All' | 'SaaS' | 'Hardware' | 'Consulting'>('All');

  const pageData = {
      title: { zh: '聖典智庫 (產品矩陣)', en: 'Product Matrix (Artifacts)' },
      desc: { zh: '探索並代理最先進的永續解決方案', en: 'Explore and proxy advanced sustainability solutions.' },
      tag: { zh: '代理核心', en: 'Proxy Core' }
  };

  const handleProxyRequest = (product: ProxyProduct) => {
      if (level < product.tier) {
          addToast('error', isZh ? `等級不足！需要 Lv.${product.tier}` : `Level too low! Requires Lv.${product.tier}`, 'Proxy Lock');
          return;
      }
      addToast('success', isZh ? `代理合約已生成：${product.name}` : `Proxy contract generated: ${product.name}`, 'Contract Forge');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <UniversalPageHeader 
            icon={Package}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/10 w-fit">
            {(['All', 'SaaS', 'Hardware', 'Consulting'] as const).map(cat => (
                <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeCategory === cat ? 'bg-celestial-purple text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                    {cat}
                </button>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {MOCK_PRODUCTS.filter(p => activeCategory === 'All' || p.category === activeCategory).map(product => (
                <div key={product.id} className="glass-panel p-6 rounded-[2rem] border border-white/10 hover:border-celestial-purple/40 transition-all flex flex-col group relative overflow-hidden">
                    {level < product.tier && (
                        <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                            <Lock className="w-10 h-10 text-gray-500 mb-2" />
                            <h4 className="text-white font-bold">LOCKED</h4>
                            <p className="text-xs text-gray-500">Requires Lv.{product.tier} Agent Status</p>
                        </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 rounded-2xl bg-celestial-purple/10 text-celestial-purple">
                            <Briefcase className="w-6 h-6" />
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{product.category}</div>
                            <div className="text-lg font-bold text-white">{product.basePrice}</div>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-celestial-purple transition-colors">{product.name}</h3>
                    <p className="text-xs text-gray-400 mb-6 leading-relaxed">{product.pitchScript}</p>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {product.knowledgeTags.map(tag => (
                            <span key={tag} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] text-gray-500 uppercase">{tag}</span>
                        ))}
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="text-xs">
                            <span className="text-gray-500">Commission: </span>
                            <span className="text-emerald-400 font-bold">{product.commission}%</span>
                        </div>
                        <button 
                            onClick={() => handleProxyRequest(product)}
                            className="flex items-center gap-2 px-4 py-2 bg-celestial-purple text-white rounded-xl text-xs font-bold hover:scale-105 transition-all shadow-lg shadow-purple-500/20"
                        >
                            <Zap className="w-3 h-3" /> Proxy Artifact
                        </button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
