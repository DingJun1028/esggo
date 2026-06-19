"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ShieldCheck, Eye, Activity, Link, Target, Zap, Layers, Cpu, Sparkles } from "lucide-react";
import { FIVE_T_PROTOCOL, IOmniHeart, getTrinityContext } from "@/lib/omni-heart";

interface OmniTagBadgeProps {
  heart?: IOmniHeart;
  className?: string;
  showDetails?: boolean;
}

export function OmniTagBadge({ heart, className, showDetails = false }: OmniTagBadgeProps) {
  if (!heart) return null;

  const trinity = getTrinityContext(heart);
  const isTrinity = trinity.divinity >= 90;
  const isChain = !!heart.A_Tagging?.parent_hash;

  const protocols = [
    { ...FIVE_T_PROTOCOL.TRUTH, active: !!heart.C_Tag?.source_origin, icon: Link },
    { ...FIVE_T_PROTOCOL.GOODNESS, active: !!heart.B_Label?.iso_ref, icon: Eye },
    { ...FIVE_T_PROTOCOL.BEAUTY, active: heart.B_Label?.ui === 'LiquidGlass_v3', icon: Zap },
    { ...FIVE_T_PROTOCOL.TRUST, active: heart.A_Tagging?.is_trustworthy, icon: ShieldCheck },
    { ...FIVE_T_PROTOCOL.THROUGH, active: (heart.C_Tag?.trace_path?.length || 0) > 0, icon: Activity },
  ];

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className={cn(
        "flex items-center gap-1.5 p-1 bg-black/5 rounded-full w-fit border border-black/5 relative transition-all duration-700",
        isTrinity && "bg-stitch-teal-start/5 border-stitch-teal-start/20 shadow-[0_0_15px_rgba(0,158,157,0.1)]"
      )}>
        {/* Trinity Aura Background */}
        {isTrinity && (
          <motion.div
            layoutId="trinity-aura"
            className="absolute inset-0 rounded-full bg-gradient-to-r from-stitch-teal-start/5 via-optimal/5 to-indigo-500/5 blur-sm"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        )}
        {protocols.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.key}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              title={`${p.label}: ${p.status} (${p.means})`}
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 relative",
                p.active
                  ? "bg-white text-stitch-teal-start border border-stitch-teal-start/30 shadow-[0_4px_12px_rgba(0,158,157,0.15)]"
                  : "bg-transparent text-stitch-muted opacity-40"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {p.key === "Tw" && isChain && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-optimal rounded-full border border-white flex items-center justify-center">
                  <Layers className="w-1.5 h-1.5 text-white" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-[9px] font-black uppercase tracking-widest bg-white/60 backdrop-blur-sm p-4 rounded-[16px] border border-black/5 shadow-minimal space-y-3"
        >
          {isTrinity && (
            <div className="flex items-center gap-2 p-2 bg-stitch-teal-start/10 rounded-xl border border-stitch-teal-start/20 mb-2">
              <Sparkles className="w-4 h-4 text-stitch-teal-start animate-pulse" />
              <span className="text-stitch-teal-start font-black">Trinity Verified (三位一體驗證)</span>
            </div>
          )}
          <div className="flex justify-between items-center border-b border-black/5 pb-2">
            <span className="text-stitch-muted">Omni UUID</span>
            <span className="text-stitch-text font-mono truncate max-w-full md:w-[140px] bg-black/5 px-2 py-0.5 rounded-md">{heart.uuid}</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-stitch-muted flex items-center gap-1">
                <Cpu className="w-3 h-3 text-stitch-teal-start" /> HASH LOCK
              </span>
              <span className="text-stitch-teal-start font-mono truncate max-w-full md:w-[140px] font-black">{heart.A_Tagging?.hash_lock}</span>
            </div>
            {heart.A_Tagging?.parent_hash && (
              <div className="flex justify-between items-center opacity-70">
                <span className="text-stitch-muted flex items-center gap-1 pl-4">
                  <Link className="w-2.5 h-2.5" /> PARENT
                </span>
                <span className="text-stitch-muted font-mono truncate max-w-full md:w-[120px]">{heart.A_Tagging.parent_hash}</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-stitch-muted">Classification</span>
            <span className="text-stitch-text font-black">{heart.D_MECE?.domain} <span className="opacity-30 mx-1">/</span> {heart.D_MECE?.subCategory}</span>
          </div>

          {heart.D_MECE?.gri_mapping && heart.D_MECE.gri_mapping.length > 0 && (
            <div className="pt-2 border-t border-black/5">
              <span className="text-[8px] font-black text-stitch-muted block mb-2 tracking-[0.2em]">Semantic GRI Mapping</span>
              <div className="flex flex-wrap gap-1.5">
                {heart.D_MECE.gri_mapping.map((std, i) => (
                  <span key={i} className="bg-optimal/10 text-optimal px-2 py-1 rounded-full text-[8px] font-black border border-optimal/10">
                    {std}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 mt-2 border-t border-black/5 opacity-80">
            <span className="text-stitch-muted">Trace Origin</span>
            <span className="text-stitch-text font-bold">{heart.C_Tag?.source_origin}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
