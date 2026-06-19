"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ShieldCheck, Link } from "lucide-react";

interface LiquidGlassCardProps {
  title: string;
  value: string | number;
  unit?: string;
  status: "draft" | "validated" | "locked";
  source: string;
  className?: string;
}

export function LiquidGlassCard({
  title,
  value,
  unit,
  status,
  source,
  className
}: LiquidGlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative p-8 rounded-lg overflow-hidden transition-all duration-300",
        "stitch-glass shadow-minimal",
        status === "locked" ? "border-stitch-teal-start/50" : "hover:bg-stitch-bg hover:border-stitch-teal-start/20",
        className
      )}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stitch-muted flex items-center gap-1">
            <Link className="w-3 h-3" /> {source}
          </span>
          {status === "locked" && (
            <span className="bg-stitch-teal-start/10 text-stitch-teal-start text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" /> TRUST LOCKED
            </span>
          )}
        </div>

        <h3 className="text-stitch-muted font-bold text-xs mb-1 uppercase tracking-widest">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-stitch-text tracking-tighter">
            {value}
          </span>
          {unit && <span className="text-stitch-muted text-[10px] font-bold uppercase tracking-widest">{unit}</span>}
        </div>

        {/* 5T ??? */}
        <div className="mt-6 flex gap-1">
          {["T", "T", "T", "T", "T"].map((t, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full",
                i < (status === "locked" ? 5 : status === "validated" ? 4 : 2)
                  ? "bg-stitch-teal-start"
                  : "bg-stitch-shallow-gray"
              )}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[8px] font-bold text-stitch-muted uppercase tracking-widest">
          <span>Traceable</span>
          <span>Trustworthy</span>
        </div>
      </div>
    </motion.div>
  );
}

