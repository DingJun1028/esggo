"use client";

import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  noHover?: boolean;
}

export function GlassCard({ children, className, noHover = false, ...props }: GlassCardProps) {
  return (
    <motion.div
      whileHover={noHover ? {} : { y: -6, boxShadow: "0 30px 60px -12px rgba(10, 20, 40, 0.08)" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "bg-white border border-slate-200/50 rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.02)]",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
