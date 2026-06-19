
import React, { useState, useEffect, useMemo } from 'react';
import { Language, SoulForgeConfig, DigitalSoulAsset } from '../types';
import { 
    Hammer, Sparkles, Heart, Zap, Shield, Cpu, 
    ArrowRight, Loader2, Coins, UserCircle, Star,
    Database, Activity, Hexagon, Fingerprint, Lock, Layers, FlaskConical, Save, CheckCircle, Plus, AlertCircle
} from 'lucide-react';
import { useUniversalAgent } from '../contexts/UniversalAgentContext';
import { UniversalPageHeader } from './UniversalPageHeader';
import { QuantumSlider } from './minimal/QuantumSlider';
import { useCompany } from './providers/CompanyProvider';
import { z } from 'zod';

interface DigitalSoulForgeProps {
  language: Language;
}

export const DigitalSoulForge: React.FC<DigitalSoulForgeProps> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const { forgeSoul, forgedSouls, equipSoul, activeSoulAsset, isProcessing } = useUniversalAgent();
  const { goodwillBalance, updateGoodwillBalance } = useCompany();
  
  const [soulName, setSoulName] = useState('');
  const [config, setConfig] = useState<SoulForgeConfig>({
      altruism: 50,
      pragmatism: 50,
      innovation: 50,
      stability: 50
  });

  const [editingSoulId, setEditingSoulId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const soulSchema = useMemo(() => z.object({
      name: z.string().trim().min(2, isZh ? "名稱太短 (至少 2 字)" : "Name too short (min 2)").max(30, isZh ? "名稱太長 (上限 30 字)" : "Name too long (max 30)"),
      altruism: z.number().min(0).max(100),
      pragmatism: z.number().min(0).max(100),
      innovation: z.number().min(0).max(100),
      stability: z.number().min(0).max(100)
  }), [isZh]);

  const FORGE_COST = 500;

  const handleForge = async () => {
      setErrors({});
      const result = soulSchema.safeParse({ name: soulName, ...config });
      
      if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach(err => {
              if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
          });
          setErrors(fieldErrors);
          return;
      }

      if (!editingSoulId) {
          if (goodwillBalance < FORGE_COST) return;
          updateGoodwillBalance(-FORGE_COST);
      }
      
      const res = await forgeSoul(soulName, config, editingSoulId || undefined);
      setEditingSoulId(res.id);
  };

  const handleSelectSoul = (soul: DigitalSoulAsset) => {
      setErrors({});
      setEditingSoulId(soul.id);
      setSoulName(soul.name);
      setConfig({ ...soul.traits });
  };

  const handleReset = () => {
      setErrors({});
      setEditingSoulId(null);
      setSoulName('');
      setConfig({ altruism: 50, pragmatism: 50, innovation: 50, stability: 50 });
  };

  const handleEquip = () => {
      if (editingSoulId) {
          equipSoul(editingSoulId);
      }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-24 max-w-7xl mx-auto">
        <UniversalPageHeader 
            icon={Hammer}
            title={{ zh: '數位靈魂熔爐', en: 'Digital Soul Forge' }}
            description={{ zh: '調整參數並封裝為靈魂資產，裝備後即可改變 AI 之意志', en: 'Sculpt AI persona assets and equip them to sync your kernel.' }}
            language={language}
            tag={{ zh: '資產合成', en: 'ASSET_SYNTH' }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Personality Reactor (Editor) */}
            <div className="lg:col-span-7 space-y-6">
                <div className={`glass-panel p-8 rounded-[3rem] border transition-all duration-500 bg-slate-900/40 relative overflow-hidden group shadow-2xl
                    ${errors.name ? 'border-rose-500/50 ring-1 ring-rose-500/10' : activeSoulAsset?.id === editingSoulId ? 'border-celestial-gold/50 shadow-amber-500/10' : 'border-white/10'}
                `}>
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.07] transition-opacity">
                        <FlaskConical className="w-64 h-64" />
                    </div>

                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-2xl border transition-all ${activeSoulAsset?.id === editingSoulId ? 'bg-celestial-gold/20 border-celestial-gold/40' : 'bg-white/5 border-white/10'}`}>
                                <Zap className={`w-6 h-6 ${activeSoulAsset?.id === editingSoulId ? 'text-celestial-gold' : 'text-gray-400'}`} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">
                                    {isZh ? (editingSoulId ? '正在編輯靈魂 Shard' : '人格特質共鳴器') : (editingSoulId ? 'Editing Soul Shard' : 'Personality Reactor')}
                                </h3>
                            </div>
                        </div>
                        <div className="flex gap-2">
                             <button onClick={handleReset} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-gray-400 hover:text-white transition-all" title="New Soul">
                                 <Plus className="w-5 h-5" />
                             </button>
                             <div className="px-5 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 backdrop-blur-md">
                                <Coins className="w-4 h-4 text-celestial-gold" />
                                <span className="text-base font-mono font-bold text-white">{goodwillBalance.toLocaleString()} GWC</span>
                             </div>
                        </div>
                    </div>

                    <div className="space-y-10 relative z-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Soul_Designation</label>
                            <input 
                                type="text" 
                                value={soulName} 
                                onChange={(e) => { setSoulName(e.target.value); if(errors.name) setErrors({...errors, name: ''}); }}
                                placeholder={isZh ? "賦予此人格一個標識..." : "Enter personality ID..."}
                                className={`w-full bg-black/40 border rounded-2xl px-6 py-4 text-white focus:ring-1 outline-none text-xl placeholder:text-gray-700 transition-all ${errors.name ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-white/10 focus:ring-celestial-gold'}`}
                            />
                            {errors.name && (
                                <div className="flex items-center gap-1.5 px-1 text-[10px] text-rose-400 font-bold uppercase animate-fade-in">
                                    <AlertCircle className="w-3 h-3" /> {errors.name}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                            {[
                                { label: isZh ? '利他主義 (Altruism)' : 'Altruism', key: 'altruism', color: 'emerald' },
                                { label: isZh ? '實用主義 (Pragmatism)' : 'Pragmatism', key: 'pragmatism', color: 'gold' },
                                { label: isZh ? '創新突破 (Innovation)' : 'Innovation', key: 'innovation', color: 'purple' },
                                { label: isZh ? '穩健守成 (Stability)' : 'Stability', key: 'stability', color: 'blue' }
                            ].map(trait => (
                                <QuantumSlider 
                                    key={trait.key}
                                    label={trait.label}
                                    value={(config as any)[trait.key]} min={0} max={100} unit="%" color={trait.color as any}
                                    onChange={(val) => setConfig({...config, [trait.key]: val})}
                                />
                            ))}
                        </div>

                        <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button 
                                onClick={handleForge}
                                disabled={isProcessing || !soulName.trim() || (!editingSoulId && goodwillBalance < FORGE_COST)}
                                className={`py-5 font-black rounded-3xl border border-white/10 transition-all flex flex-col items-center justify-center gap-1 disabled:opacity-30 group/forge
                                    ${editingSoulId ? 'bg-indigo-500/20 text-indigo-200 border-indigo-500/40 hover:bg-indigo-500/30' : 'bg-white/10 hover:bg-white/15 text-white'}
                                `}
                            >
                                <div className="flex items-center gap-2">
                                    {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    <span className="text-sm uppercase tracking-tighter">
                                        {isZh ? (editingSoulId ? '更新靈魂資產' : '儲存靈魂資產') : (editingSoulId ? 'Update Soul Asset' : 'Forge & Save Soul')}
                                    </span>
                                </div>
                                {!editingSoulId && <span className="text-[8px] text-gray-500 uppercase">Cost: 500 GWC</span>}
                            </button>

                            {editingSoulId && (
                                <button 
                                    onClick={handleEquip}
                                    disabled={activeSoulAsset?.id === editingSoulId}
                                    className={`py-5 font-black rounded-3xl shadow-xl transition-all flex flex-col items-center justify-center gap-1 animate-fade-in
                                        ${activeSoulAsset?.id === editingSoulId 
                                            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 cursor-default' 
                                            : 'bg-gradient-to-r from-celestial-gold to-amber-600 text-black hover:scale-[1.02] shadow-amber-500/20 active:scale-95'}
                                    `}
                                >
                                    <div className="flex items-center gap-2">
                                        <Zap className={`w-5 h-5 ${activeSoulAsset?.id === editingSoulId ? 'animate-pulse' : ''}`} />
                                        <span className="text-sm uppercase tracking-tighter">
                                            {activeSoulAsset?.id === editingSoulId ? (isZh ? '核心同步中' : 'Kernel Active') : (isZh ? '立即裝備至內核' : 'Equip to Kernel')}
                                        </span>
                                    </div>
                                    <span className="text-[8px] opacity-60 uppercase">Sync Persona to AI Assistant</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Soul Vault (Inventory) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="glass-panel p-8 rounded-[3rem] border border-white/10 bg-slate-950/80 flex flex-col h-full shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                        <Layers className="w-48 h-48" />
                    </div>
                    
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h3 className="text-sm font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-3">
                            <Database className="w-5 h-5 text-celestial-purple" /> IDENTITY_VAULT
                        </h3>
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono text-gray-400">
                            {forgedSouls.length} SHARDS
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                        {forgedSouls.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                <Fingerprint className="w-12 h-12 text-gray-800 mb-4" />
                                <p className="text-xs font-bold text-gray-600 uppercase tracking-widest max-w-[180px]">
                                    No identity shards forged yet.
                                </p>
                            </div>
                        ) : forgedSouls.map((soulAsset) => (
                            <div 
                                key={soulAsset.id} 
                                onClick={() => handleSelectSoul(soulAsset)}
                                className={`p-6 rounded-[2.2rem] border transition-all cursor-pointer group relative overflow-hidden
                                    ${editingSoulId === soulAsset.id ? 'bg-white/10 border-white/30' : 'bg-white/5 border-white/5 hover:border-white/20'}
                                `}
                            >
                                <div className="flex justify-between items-start relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl bg-black/40 border flex items-center justify-center transition-colors
                                            ${activeSoulAsset?.id === soulAsset.id ? 'border-celestial-gold text-celestial-gold shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'border-white/10 text-gray-600 group-hover:text-gray-400'}
                                        `}>
                                            <UserCircle className="w-7 h-7" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-black text-white text-lg tracking-tight mb-0.5 truncate">{soulAsset.name}</h4>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[8px] font-black uppercase tracking-widest
                                                    ${soulAsset.rarity === 'Legendary' ? 'text-celestial-gold' : 'text-gray-500'}
                                                `}>
                                                    {soulAsset.rarity}
                                                </span>
                                                <div className="flex gap-1.5">
                                                    <div className="text-[8px] text-emerald-400 font-mono">A:{soulAsset.traits.altruism}</div>
                                                    <div className="text-[8px] text-purple-400 font-mono">I:{soulAsset.traits.innovation}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {activeSoulAsset?.id === soulAsset.id && (
                                        <div className="px-2 py-0.5 bg-celestial-gold text-black text-[7px] font-black rounded-full shadow-lg">ACTIVE</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
