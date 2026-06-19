
import React, { useState } from 'react';
import { Language } from '../types';
import { Heart, Target, Users, ArrowRight, Share2, CheckCircle, Leaf } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';

interface FundraisingProps {
  language: Language;
}

export const Fundraising: React.FC<FundraisingProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { goodwillBalance, updateGoodwillBalance, addAuditLog } = useCompany();

  const pageData = {
      title: { zh: '影響力募資', en: 'Impact Fundraising' },
      desc: { zh: '將您的善向幣投資於真實世界的永續專案', en: 'Invest your Goodwill Coins in real-world sustainability projects' },
      tag: { zh: '影響力核心', en: 'Impact Core' }
  };

  const projects = [
      {
          id: 1,
          title: isZh ? '海洋塑膠清理計畫' : 'Ocean Plastic Cleanup',
          org: 'Ocean Cleanup',
          desc: isZh ? '每 500 GWC 可協助清理 1 公斤海洋垃圾。目標清除太平洋垃圾帶。' : '500 GWC helps remove 1kg of ocean plastic. Targeting the Pacific Patch.',
          target: 50000,
          current: 32500,
          image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=800&q=80',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500',
          verified: true
      },
      {
          id: 2,
          title: isZh ? '紅樹林藍碳復育' : 'Mangrove Blue Carbon',
          org: 'Blue Planet Alliance',
          desc: isZh ? '種植紅樹林不僅能防護海岸線，固碳效率更是熱帶雨林的 4 倍。每 100 GWC 可復育 10 平方公尺。' : 'Mangroves sequester carbon 4x faster than rainforests. 100 GWC restores 10 sqm of coastal ecosystem.',
          target: 100000,
          current: 68900,
          // Fixed Image URL to a reliable Unsplash source
          image: 'https://images.unsplash.com/photo-1566808920959-16e678393c6f?w=800&q=80',
          color: 'text-emerald-400',
          bgColor: 'bg-emerald-500',
          verified: true
      },
      {
          id: 3,
          title: isZh ? '偏鄉綠能教育' : 'Rural Green Education',
          org: 'Teach For Earth',
          desc: isZh ? '為偏鄉學校安裝太陽能板並提供綠能教育課程。每 1000 GWC 贊助一位學童。' : 'Installing solar panels and providing green education in rural schools. 1000 GWC sponsors one student.',
          target: 20000,
          current: 15400,
          image: 'https://images.unsplash.com/photo-1509099836639-18ba4eb7b411?w=800&q=80',
          color: 'text-amber-400',
          bgColor: 'bg-amber-500',
          verified: true
      }
  ];

  const handleDonate = (projectTitle: string, amount: number) => {
      if (goodwillBalance < amount) {
          addToast('error', isZh ? '餘額不足' : 'Insufficient GWC', 'Fundraising');
          return;
      }
      updateGoodwillBalance(-amount);
      addAuditLog('Donation', `Donated ${amount} GWC to ${projectTitle}`);
      addToast('success', isZh ? `感謝您的支持！已捐贈 ${amount} GWC` : `Thank you! Donated ${amount} GWC`, 'Impact Made');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
        <UniversalPageHeader 
            icon={Heart}
            title={pageData.title}
            description={pageData.desc}
            language={language}
            tag={pageData.tag}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(project => (
                <div key={project.id} className="glass-panel rounded-2xl overflow-hidden border border-white/10 group hover:-translate-y-2 transition-transform duration-300">
                    <div className="h-48 relative">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-xl font-bold text-white mb-1 leading-tight">{project.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-300">
                                <span>{project.org}</span>
                                {project.verified && <CheckCircle className="w-3 h-3 text-celestial-blue" />}
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                        <p className="text-sm text-gray-300 leading-relaxed min-h-[60px]">
                            {project.desc}
                        </p>
                        
                        <div>
                            <div className="flex justify-between text-xs mb-2">
                                <span className={project.color}>{project.current.toLocaleString()} GWC</span>
                                <span className="text-gray-500">{Math.round((project.current / project.target) * 100)}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div className={`h-full ${project.bgColor}`} style={{ width: `${(project.current / project.target) * 100}%` }} />
                            </div>
                            <div className="text-right text-[10px] text-gray-500 mt-1">
                                Goal: {project.target.toLocaleString()} GWC
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button 
                                onClick={() => handleDonate(project.title, 100)}
                                className={`flex-1 py-2 rounded-lg border font-bold text-sm transition-all hover:bg-white/10 ${project.color.replace('text-', 'border-')} text-white`}
                            >
                                {isZh ? '捐贈 100' : 'Donate 100'}
                            </button>
                            <button className="p-2 rounded-lg border border-white/10 hover:bg-white/10 text-gray-400 transition-all">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
};
