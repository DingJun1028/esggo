"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface ServiceExplanationCardProps {
  title: string;
  description: React.ReactNode;
  icon: React.ReactNode;
  color?: string;
  features?: string[];
  actionText?: string;
  onAction?: () => void;
  onFetch?: () => void;
  className?: string;
  stats?: {
    label: string;
    value: string | number;
    unit?: string;
  };
}

export function ServiceExplanationCard({
  title,
  description,
  icon,
  color = "#D4AF37",
  features,
  actionText = "了解更多",
  onAction,
  onFetch,
  className,
  stats
}: ServiceExplanationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative p-10 rounded-lg overflow-hidden snappy-transition",
        "bg-white border border-outline-variant shadow-minimal",
        "hover:border-primary-teal-start/30",
        className
      )}
    >
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-start justify-between mb-6">
          <div
            className="p-4 rounded-md bg-surface-container border border-outline-variant"
            style={{ color: color }}
          >
            {icon}
          </div>
          <div className="flex flex-col items-end gap-2">
            {stats && (
              <div className="text-right">
                <div className="text-2xl font-black tracking-tighter" style={{ color: color }}>
                  {stats.value}
                  {stats.unit && <span className="text-[10px] ml-1 opacity-60 font-bold uppercase tracking-widest text-on-surface-variant">{stats.unit}</span>}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  {stats.label}
                </div>
              </div>
            )}
            {onFetch && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFetch?.();
                }}
                className="px-3 py-1 text-[8px] font-bold uppercase tracking-widest bg-surface-container hover:bg-surface-container/80 rounded-sm border border-outline-variant snappy-transition"
                style={{ color: color }}
              >
                獲取最新數據
              </button>
            )}
          </div>
        </div>

        <h3 className="text-lg font-bold text-on-surface mb-3 tracking-tight group-hover:text-primary-teal-start snappy-transition uppercase">
          {title}
        </h3>

        <div className="text-on-surface-variant text-sm leading-relaxed mb-6 flex-1 font-medium">
          {description}
        </div>

        {features && (
          <div className="space-y-2 mb-8">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center gap-2 text-[10px] text-on-surface/80 font-bold uppercase tracking-widest">
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: color }} />
                {feature}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onAction}
          className="group/btn flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all"
          style={{ color: color }}
        >
          {actionText}
          <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}
