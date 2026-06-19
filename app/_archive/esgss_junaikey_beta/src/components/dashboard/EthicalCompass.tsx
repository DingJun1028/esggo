import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scale, Heart, Shield, Eye, Info } from 'lucide-react';
import { ethicalGuardianService, EthicalAlignment } from '@/services/EthicalGuardianService';

interface MetricRowProps {
  icon: any;
  label: string;
  value: number;
  color: string;
}

const MetricRow: React.FC<MetricRowProps> = ({ icon: Icon, label, value, color }) => (
  <div className="space-y-1">
    <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest italic">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={12} className={color} />
        {label}
      </div>
      <span className={color}>{Math.round(value)}%</span>
    </div>
    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className={`h-full transition-all duration-1000 ${color === 'text-[#0df2df]' ? 'bg-[#0df2df]' : color.replace('text-', 'bg-')
          }`}
      />
    </div>
  </div>
);

const EthicalCompass: React.FC = () => {
  const [alignment, setAlignment] = useState<EthicalAlignment>(
    ethicalGuardianService.getAlignment()
  );

  useEffect(() => {
    const unsubscribe = ethicalGuardianService.subscribe(setAlignment);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-[2.5rem] bg-black/40 border border-white/5 backdrop-blur-3xl premium-panel-glow flex flex-col gap-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-tighter text-[#0df2df]">
            Ethical Layer v1.0
          </p>
          <h3 className="text-sm font-black italic text-white tracking-widest uppercase flex items-center gap-2">
            Moral Compass
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          </h3>
        </div>
        <div className="p-2 bg-white/5 rounded-xl border border-white/10">
          <Scale size={16} className="text-[#0df2df]" />
        </div>
      </div>

      {/* Central Radar/Core Visualization */}
      <div className="relative h-32 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="size-32 rounded-full border border-white/10 animate-[spin_10s_linear_infinite]" />
          <div className="absolute size-24 rounded-full border border-white/5 animate-[spin_15s_linear_infinite_reverse]" />
        </div>

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="size-16 rounded-full bg-gradient-to-br from-[#0df2df]/20 to-purple-500/20 blur-xl absolute"
        />

        <div className="text-center relative z-10">
          <span className="text-3xl font-black text-white italic tracking-tighter">
            {Math.round(
              (alignment.transparency +
                alignment.altruism +
                alignment.sustainability +
                alignment.integrity) /
              4
            )}
          </span>
          <p className="text-[9px] font-mono text-[#0df2df] uppercase tracking-widest mt-1">
            Consistency
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <MetricRow
          icon={Eye}
          label="Transparency"
          value={alignment.transparency}
          color="text-cyan-400"
        />
        <MetricRow icon={Heart} label="Altruism" value={alignment.altruism} color="text-rose-400" />
        <MetricRow
          icon={Shield}
          label="Integrity"
          value={alignment.integrity}
          color="text-[#0df2df]"
        />
        <MetricRow
          icon={Info}
          label="Sustainability"
          value={alignment.sustainability}
          color="text-emerald-400"
        />
      </div>

      <div className="mt-2 p-3 rounded-2xl bg-white/5 border border-white/5 text-[9px] text-slate-400 text-center italic leading-tight">
        {'All Agent directives are currently aligned with the Sentient Constitution v7.0.'}
      </div>
    </motion.div>
  );
};

export default EthicalCompass;
