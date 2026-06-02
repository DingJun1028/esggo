import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Shield, Activity, Fingerprint, Database, Zap } from 'lucide-react';

export interface OmniAgentCardProps {
  id: string;
  name: string;
  role: string;
  rarity?: 'verified' | 'awakened' | 'experimental';
  imageUrl?: string;
  fiveTStatus?: [boolean, boolean, boolean, boolean, boolean]; // 真、善、美、信、通
  confidenceScore?: number;
  skills?: string[];
  jsonSchema?: string;
}

export default function OmniAgentCard({
  id,
  name,
  role,
  rarity = 'verified',
  imageUrl = '/assets/agents/placeholder.webp', // Default fallback
  fiveTStatus = [true, true, true, false, false],
  confidenceScore = 95,
  skills = ['Data Parsing', 'ZKP Validation'],
  jsonSchema = '{\n  "version": "1.0",\n  "status": "active"\n}'
}: OmniAgentCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  // Colors based on rarity
  const rarityColors = {
    verified: 'from-emerald-500/20 to-cyan-500/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]',
    awakened: 'from-purple-600/30 to-amber-500/30 border-purple-500/60 shadow-[0_0_20px_rgba(139,92,246,0.6)]',
    experimental: 'from-amber-500/20 to-orange-500/20 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
  };

  const rarityText = {
    verified: 'text-emerald-400',
    awakened: 'text-purple-400',
    experimental: 'text-amber-400'
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isFlipped) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (-10 to 10 degrees)
    const rotX = -((y - centerY) / centerY) * 10;
    const rotY = ((x - centerX) / centerX) * 10;
    
    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div className="relative w-80 h-[28rem] perspective-1000 group">
      <motion.div
        className="w-full h-full relative preserve-3d cursor-pointer"
        animate={{ 
          rotateY: isFlipped ? 180 : rotateY,
          rotateX: isFlipped ? 0 : rotateX
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        onClick={flipCard}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* ================= FRONT SIDE ================= */}
        <div 
          className={`absolute inset-0 backface-hidden rounded-xl border backdrop-blur-xl bg-slate-950/60 overflow-hidden flex flex-col justify-end bg-gradient-to-b ${rarityColors[rarity]} transition-all duration-300`}
        >
          {/* Sci-fi Cut Corners Effect via SVG or absolute divs */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/30 rounded-tl-xl"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/30 rounded-tr-xl"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/30 rounded-bl-xl"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/30 rounded-br-xl"></div>

          {/* Out-of-bounds Portrait (Middle Layer) */}
          <div className="absolute inset-0 z-10 flex justify-center items-end pb-24 pointer-events-none">
             {/* Aura Glow */}
             <div className={`absolute bottom-12 w-48 h-48 rounded-full blur-3xl opacity-50 bg-cyan-500`}></div>
             
             {/* Character Image - translating Y on hover for parallax */}
             <motion.img 
                src={imageUrl} 
                alt={name}
                className="relative z-10 w-full h-[120%] object-cover object-bottom transition-transform duration-500 group-hover:-translate-y-4"
             />
          </div>

          {/* Foreground UI Panel (Top Layer) */}
          <div className="relative z-20 bg-slate-900/80 backdrop-blur-md border-t border-white/10 p-4 h-1/3 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wider">{name}</h3>
                  <p className={`text-xs font-medium uppercase tracking-widest ${rarityText[rarity]}`}>{role}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-xs font-mono font-bold ${confidenceScore >= 85 ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]' : 'text-amber-400'}`}>
                    {confidenceScore}%
                  </span>
                  <span className="text-[10px] text-slate-400">Confidence</span>
                </div>
              </div>
            </div>

            {/* 5T Protocol Indicators */}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
              <span className="text-xs text-slate-400 font-mono">5T SYNC</span>
              <div className="flex space-x-1.5">
                {fiveTStatus.map((status, index) => {
                  const labels = ['真', '善', '美', '信', '通'];
                  return (
                    <div key={index} className="flex flex-col items-center group/tooltip relative">
                      <div className={`w-2.5 h-2.5 rounded-full ${status ? 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-slate-700'}`}></div>
                      <span className="absolute -top-6 text-[10px] opacity-0 group-hover/tooltip:opacity-100 transition-opacity bg-slate-800 px-1 rounded text-white">{labels[index]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ================= BACK SIDE ================= */}
        <div 
          className={`absolute inset-0 backface-hidden rounded-xl border backdrop-blur-xl bg-slate-950/90 overflow-hidden flex flex-col p-5 bg-gradient-to-b ${rarityColors[rarity]}`}
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Database className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">Memory & Schema</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar mb-4">
            <div className="mb-4">
              <h4 className="text-xs text-slate-400 mb-2 font-mono flex items-center"><Zap className="w-3 h-3 mr-1"/> CORE SKILLS</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs text-slate-400 mb-2 font-mono flex items-center"><Fingerprint className="w-3 h-3 mr-1"/> JSON SPEC</h4>
              <pre className="text-[10px] text-emerald-400 font-mono bg-slate-900/50 p-2 rounded border border-white/5 whitespace-pre-wrap">
                {jsonSchema}
              </pre>
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 text-center">
            <span className="text-[10px] text-slate-500 font-mono animate-pulse">CLICK TO RETURN</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
