"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface ZKPMaskProps {
  children: React.ReactNode;
  className?: string;
  label?: string;
}

export function ZKPMask({ children, className, label }: ZKPMaskProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={cn("relative group", className)}>
      <div className="flex items-center justify-between gap-2 mb-1">
        {label && (
          <span className="text-[10px] font-bold uppercase tracking-widest text-stitch-muted">
            {label}
          </span>
        )}
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="p-1 rounded-md hover:bg-stitch-shallow-gray transition-colors text-stitch-muted hover:text-stitch-text"
          title={isVisible ? "Hide sensitive data" : "Reveal sensitive data"}
        >
          {isVisible ? (
            <EyeOff className="w-3 h-3" />
          ) : (
            <Eye className="w-3 h-3" />
          )}
        </button>
      </div>
      
      <div className="relative min-h-[1.5rem] flex items-center">
        <AnimatePresence mode="wait">
          {isVisible ? (
            <motion.div
              key="visible"
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(8px)" }}
              className="w-full"
            >
              {children}
            </motion.div>
          ) : (
            <motion.div
              key="masked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex items-center gap-2 py-1 px-2 bg-stitch-shallow-gray rounded border border-stitch-border border-dashed"
            >
              <Lock className="w-3 h-3 text-stitch-teal-start/60" />
              <div className="flex gap-0.5">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 rounded-full bg-stitch-teal-start/40 "
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono text-stitch-teal-start/40 ml-auto uppercase tracking-widest">
                ZKP SECURE
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

