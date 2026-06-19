"use client";

import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";
import { useAppContext } from "@/lib/context/app-context";
import { useEffect, useState } from "react";

export function FloatingOmni() {
  const { isOmniOpen, setIsOmniOpen, setActiveTab, lang, setLang } = useAppContext();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Rebrand handling for language or other triggers if needed
  }, [isOmniOpen, setIsOmniOpen, setActiveTab, lang, setLang]);

  if (isOmniOpen) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-24 right-6 z-[90] md:bottom-8 md:right-8 group"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-stitch-teal-start/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <button
        onClick={() => setIsOmniOpen(true)}
        className="relative w-16 h-16 md:w-20 md:h-20 bg-white border border-stitch-border/50 rounded-full shadow-2xl flex items-center justify-center overflow-hidden active:scale-95 transition-transform"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-stitch-teal-start/10 to-transparent" />

        {/* Animated Rings */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 border border-dashed border-stitch-teal-start/20 rounded-full"
        />

        <div className="relative z-10">
          <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-stitch-teal-start animate-pulse" />
        </div>

        {/* Pulsing indicator */}
        <div className="absolute top-4 right-4 w-3 h-3 bg-stitch-teal-start rounded-full shadow-[0_0_10px_rgba(0,158,157,0.8)]" />
      </button>

      {/* Professional Tooltip */}
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none hidden md:block">
        <div className="bg-stitch-bg border border-stitch-border px-4 py-2 rounded-xl shadow-xl whitespace-nowrap">
          <p className="text-xs font-black text-stitch-text uppercase tracking-widest">
            {lang === "zh" ? "呼叫 Omni 數據助理" : "Call Omni Assistant"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

