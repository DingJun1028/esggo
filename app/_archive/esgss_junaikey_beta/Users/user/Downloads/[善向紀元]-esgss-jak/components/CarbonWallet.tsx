
import React, { useState, useEffect } from 'react';
import { Language, CarbonMarketHistory, CarbonAssetPackage } from '../types';
import { 
    Gem, TrendingUp, Loader2, Zap, ShieldCheck, Globe, Activity, Flame,
    ArrowUpRight, ShoppingCart, RefreshCw, BarChart3, Wallet, Star
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '../contexts/ToastContext';
import { runMcpAction } from '../services/ai-service';
import { useCompany } from './providers/CompanyProvider';
import { UniversalPageHeader } from './UniversalPageHeader';

export const CarbonWallet: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { addToast } = useToast();
  const { awardXp, addJournalEntry } = useCompany();
  
  const [isMinting, setIsMinting] = useState(false);
  const [manifestedAsset, setManifestedAsset] = useState<any>(null);
  const [marketData, setMarketData] = useState<any[]>([]);

  useEffect(() => {
      setMarketData(Array.from({ length: 20 }).map((_, i) => ({
          time: `${i}:00`,
          price: 85 + Math.sin(i * 0.5) * 10 + Math.random() * 5
      })));
  }, []);

  const handleMintAsset = async () => {
    setIsMinting(true);
    setManifestedAsset(null);
    addToast('info', isZh ? '執行 [動作 10：數位資產煉金]...' : 'Initiating [Action 10: Digital Asset Alchemistry]...', 'Market Liaison');
    
    try {
        const res = await runMcpAction('list_carbon_credits', {
            verifiedReduction: 12450,
            projectMeta: { region: 'Taiwan', type: 'Energy Efficiency' }
        }, language);

        if (res.success) {
            setManifestedAsset(res.result);
            awardXp(1500);
            addJournalEntry(
                isZh ? '完成碳資產國際掛牌' : 'Carbon Asset Listed',
                isZh ? `成功將減碳成果轉化為可交易資產。掛牌量: 12,450 tCO2e。` : `Reduction manifested as tradable asset. Volume: 12,450.`,
                1500, 'milestone', ['CarbonMarket']
            );
            addToast('reward', isZh ? `資產已上架，預計價值 $${res.result.totalValue.toLocaleString()}` : `Manifestation Successful!`, 'Market');
        }
    } catch (e) {
        addToast('error', 'Market Sync Fault', 'Error');
    } finally {
        setIsMinting(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in overflow-hidden pb-12 p-6 bg-slate-50 text-slate-800">
        <UniversalPageHeader 
            icon={Gem}
            title={{ zh: '國際碳資產錢包', en: 'Global Carbon Wallet' }}
            description={{ zh: '減碳數據的直接資產化與國際交易對接中心', en: 'Carbon Tokenization & Global Listing Center.' }}
            language={language}
            tag={{ zh: '財富內核 v1.0', en: 'WEALTH_v1.0' }}
        />

        <div className="flex-1 grid grid-cols-12 gap-6 min-h-0 overflow-hidden">
            <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 overflow-hidden">
                <div className="bg-slate-900 text-white rounded-[4rem] p-12 shadow-2xl flex flex-col min-h-0 overflow-hidden relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(251,191,36,0.1)_0%,transparent_70%)] pointer-events-none" />
                    
                    <div className="flex justify-between items-start mb-12 shrink-0 relative z-10">
                        <div className="space-y-4">
                            <h3 className="zh-main text-4xl tracking-tighter uppercase">動作 10：數據套現協定</h3>
                            <p className="text-slate-400 text-lg leading-relaxed font-light italic max-w-xl">
                                「將您的減碳實績正式鑄造為可交易資產。一鍵對接 ACX 交易所。」
                            </p>
                        </div>
                        <button 
                            onClick={handleMintAsset}
                            disabled={isMinting}
                            className="px-16 py-6 bg-white text-black font-black rounded-[2.5rem] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.2)] flex flex-col items-center gap-2 uppercase tracking-[0.3em] text-xs"
                        >
                            {isMinting ? <Loader2 className="w-8 h-8 animate-spin" /> : <Flame className="w-8 h-8 fill-current" />}
                            MINT_ASSET
                        </button>
                    </div>

                    <div className="flex-1 min-h-0 w-full relative z-10 bg-black/40 rounded-[2.5rem] border border-white/5 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ACX_Market_Index</span>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height="80%" minWidth={0} minHeight={200}>
                            <AreaChart data={marketData}>
                                <Area type="monotone" dataKey="price" stroke="#fbbf24" fill="rgba(251,191,36,0.1)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {manifestedAsset && (
                        <div className="mt-8 p-10 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-[3rem] animate-slide-up flex justify-between items-center">
                            <div className="space-y-2">
                                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">ASSET_MANIFESTED</div>
                                <h5 className="zh-main text-3xl text-white">ID: {manifestedAsset.assetId}</h5>
                                <p className="text-slate-400 italic">Est. Value: ${manifestedAsset.totalValue.toLocaleString()}</p>
                            </div>
                            <button className="px-10 py-3 bg-white text-black font-black rounded-xl text-xs uppercase tracking-widest shadow-xl">Execute_Listing</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col items-center text-center flex-1">
                    <div className="w-20 h-20 bg-amber-100 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl">
                        <Wallet className="w-10 h-10 text-amber-600" />
                    </div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Total_Wallet_Value</h4>
                    <div className="text-5xl font-mono font-black text-slate-800 tracking-tighter">
                        ${manifestedAsset ? (manifestedAsset.totalValue + 194450).toLocaleString() : '194,450'}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
