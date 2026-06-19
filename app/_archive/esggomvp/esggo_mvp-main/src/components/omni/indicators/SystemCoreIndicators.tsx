"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * SystemCoreIndicators - ESG GO Sustainability Edition
 * 扁平化系統指標：負載平衡、運行時間、5T 健康度。
 */

interface IndicatorProps {
  label: string;
  value: number; // 0-100
  suffix?: string;
  status?: "optimal" | "critical" | "lethal";
}

const IndicatorBar: React.FC<IndicatorProps> = ({ label, value, suffix = "%", status = "optimal" }) => {
  const statusColors = {
    optimal: "bg-[var(--color-optimal)]",
    critical: "bg-[var(--color-critical)]",
    lethal: "bg-[var(--color-lethal)]",
  };

  return (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-text-muted)]">
          {label}
        </span>
        <span className="text-xs font-bold text-[var(--theme-text-main)]">
          {value}{suffix}
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "circOut" }}
          className={cn("h-full", statusColors[status])}
        />
      </div>
    </div>
  );
};

export const SystemCoreIndicators: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
      <IndicatorBar label="Load Balance" value={42} />
      <IndicatorBar label="System Uptime" value={99.9} suffix="%" />
      <IndicatorBar label="Memory Usage" value={28} />
      <IndicatorBar label="5T Integrity" value={100} status="optimal" />
    </div>
  );
};
