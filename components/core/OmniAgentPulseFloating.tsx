'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, X, Maximize2, Minimize2 } from 'lucide-react'; // Added X, Maximize2, Minimize2 for close/resize
import { cn } from '../../lib/utils';
import { useTheme } from '../../contexts/ThemeContext'; // Import useTheme
import BrandStatusDot from '../brand/BrandStatusDot';

type PulseSize = 'sm' | 'md' | 'lg';

export default function OmniAgentPulseFloating() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [isVisible, setIsVisible] = useState(true);
  const [currentSize, setCurrentSize] = useState<PulseSize>('md');
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Load state from localStorage on mount
    const savedVisibility = localStorage.getItem('omniagent_pulse_visible');
    if (savedVisibility !== null) setIsVisible(JSON.parse(savedVisibility));

    const savedSize = localStorage.getItem('omniagent_pulse_size');
    if (savedSize) setCurrentSize(savedSize as PulseSize);

    const savedPosition = localStorage.getItem('omniagent_pulse_position');
    if (savedPosition) setPosition(JSON.parse(savedPosition));
  }, []);

  useEffect(() => {
    localStorage.setItem('omniagent_pulse_visible', JSON.stringify(isVisible));
  }, [isVisible]);

  useEffect(() => {
    localStorage.setItem('omniagent_pulse_size', currentSize);
  }, [currentSize]);

  // Update localStorage only after drag ends
  const handleDragEnd = (_: any, info: any) => {
    const newPosition = { x: info.offset.x + position.x, y: info.offset.y + position.y };
    setPosition(newPosition);
  };

  const toggleVisibility = () => setIsVisible(!isVisible);
  const cycleSize = () => {
    if (currentSize === 'sm') setCurrentSize('md');
    else if (currentSize === 'md') setCurrentSize('lg');
    else setCurrentSize('sm');
  };

  if (!isVisible) return null;

  const sizeClasses = {
    sm: "px-4 py-2 text-sm gap-3", // Smaller padding, font for compact view
    md: "px-8 py-4 text-base gap-5", // Default padding
    lg: "px-10 py-5 text-lg gap-6", // Larger padding, font for expanded view
  };

  const dotIconSize = {
    sm: 18,
    md: 24,
    lg: 30,
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      // initial={{ x: position.x, y: position.y }} // Framer Motion handles initial position with drag better without this
      // style={{ x: position.x, y: position.y }} // Let drag handle the style update
      className="hidden md:flex fixed bottom-12 right-12 z-[60] group cursor-grab"
    >
      <motion.div
        whileHover={{ scale: 1.05, y: -5 }}
        className={cn(
          "rounded-[2.5rem] border backdrop-blur-3xl shadow-2xl flex items-center transition-all duration-500",
          sizeClasses[currentSize], // Apply dynamic size classes
          isDark
            ? "bg-[#003262]/60 border-[#FDB515]/30 shadow-[#FDB515]/5"
            : "bg-white/80 border-[#003262]/20 shadow-xl"
        )}
      >
        <div className="relative">
          <div className={cn(
            "p-3 rounded-2xl transition-colors",
            isDark ? "bg-[#FDB515]/10 text-[#FDB515]" : "bg-[#003262] text-white shadow-lg"
          )}>
            <Bot size={dotIconSize[currentSize]} className="group-hover:rotate-12 transition-transform" />
          </div>
          <div className="absolute -top-1 -right-1">
            <BrandStatusDot
              status="active"
              pulse={true}
              sizeClassName={
                currentSize === 'sm' ? 'w-3 h-3' :
                currentSize === 'md' ? 'w-4 h-4' :
                'w-5 h-5'
              }
              borderClassName="border-2 border-white"
              shadowClassName="shadow-[0_0_10px_#10b981]"
              colorClassName="bg-emerald-500" // Explicitly set color as BrandStatusDot's active is green-500
              dotOnly={true}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <span className={cn(
            "font-black uppercase tracking-[0.25em]",
            currentSize === 'sm' ? "text-[9px]" : currentSize === 'md' ? "text-[11px]" : "text-xs",
            isDark ? "text-[#FDB515]" : "text-[#003262]"
          )}>OmniAgent Pulse</span>
          <div className="flex items-center gap-3 mt-1.5">
            <div className="h-1.5 w-32 bg-slate-200/20 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: '92.4%' }}
                className="h-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"
              />
            </div>
            <span className="text-[10px] font-mono font-black opacity-60">92.4%</span>
          </div>
        </div>
        {/* Controls for Close and Resize */}
        <div className="absolute -top-3 -right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={cycleSize} className="bg-slate-700/50 hover:bg-slate-600/70 p-1 rounded-full text-white">
            {currentSize === 'lg' ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button onClick={toggleVisibility} className="bg-red-500/80 hover:bg-red-600/90 p-1 rounded-full text-white">
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}