
import React, { useState } from 'react';
import { Lock, Box, Loader2, Maximize2, Shield, Zap, Triangle } from 'lucide-react';
import { EsgCard, MasteryLevel } from '../types';
import { generateLegoImage } from '../services/ai-service';
import { useToast } from '../contexts/ToastContext';

interface UniversalCardProps {
  card: EsgCard;
  isLocked: boolean;
  isSealed: boolean;
  masteryLevel: MasteryLevel;
  onKnowledgeInteraction: () => void;
  onPurifyRequest: () => void;
  onClick: () => void;
  onPrismRequest?: () => void;
}

export const UniversalCard: React.FC<UniversalCardProps> = ({
  card,
  isLocked,
  isSealed,
  masteryLevel,
  onKnowledgeInteraction,
  onPurifyRequest,
  onClick,
  onPrismRequest
}) => {
  const { addToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedImages, setSavedImages] = useState<string[]>([]);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'border-amber-500 shadow-amber-500/30 from-amber-500/10 to-amber-900/20';
      case 'Epic': return 'border-purple-500 shadow-purple-500/30 from-purple-500/10 to-purple-900/20';
      case 'Rare': return 'border-blue-500 shadow-blue-500/30 from-blue-500/10 to-blue-900/20';
      default: return 'border-emerald-500 shadow-emerald-500/30 from-emerald-500/10 to-emerald-900/20';
    }
  };

  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary': return 'text-amber-400';
      case 'Epic': return 'text-purple-400';
      case 'Rare': return 'text-blue-400';
      default: return 'text-emerald-400';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (isLocked) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
      const rotateY = ((x - centerX) / centerX) * 10;

      setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
      setRotate({ x: 0, y: 0 });
  };

  const handleLegoize = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isProcessing) return;
    setIsProcessing(true);
    addToast('info', 'Generating AI Lego visualization...', 'Creative Agent');
    
    try {
        const image = await generateLegoImage(card.title, card.description);
        if (image) {
            setSavedImages(prev => [...prev, image]);
            addToast('success', 'Lego Model Generated!', 'Creative Agent');
        } else {
            addToast('error', 'Generation failed.', 'System');
        }
    } catch (e) {
        addToast('error', 'AI Service Unavailable', 'Error');
    } finally {
        setIsProcessing(false);
    }
  };

  // --- RENDER LOCKED STATE (The Album Hole) ---
  if (isLocked) {
      return (
        <div 
            onClick={onClick}
            className="relative w-64 h-96 rounded-2xl bg-slate-800 shadow-[inset_0_6px_20px_rgba(0,0,0,0.9),0_2px_4px_rgba(255,255,255,0.05)] flex flex-col items-center justify-center p-6 border-b border-b-white/10 opacity-100 group cursor-not-allowed transition-all duration-300"
        >
            {/* Inner "Card Slot" Feel */}
            <div className="absolute inset-2 rounded-xl border border-dashed border-white/5 pointer-events-none" />

            {/* Embossed Logo Effect */}
            <div 
                className="text-4xl font-bold text-slate-700/80 text-center tracking-widest font-mono select-none pointer-events-none group-hover:text-slate-600 transition-colors"
                style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(255,255,255,0.05)' }}
            >
                ESG<br/>SUNSHINE
            </div>
            
            <div className="mt-6 flex flex-col items-center gap-2 opacity-50 group-hover:opacity-80 transition-opacity">
                <Lock className="w-4 h-4 text-slate-500" />
                <span className="text-[10px] text-slate-500 font-mono tracking-[0.2em] uppercase">
                    Slot Empty
                </span>
            </div>

            {/* Collection Hint */}
            <div className="absolute bottom-6 text-[9px] text-slate-600 font-bold uppercase tracking-wider">
                {card.collectionSet}
            </div>
        </div>
      );
  }

  // --- RENDER UNLOCKED CARD (Holographic) ---
  return (
    <div 
        className={`relative w-64 h-96 rounded-2xl transition-all duration-200 cursor-pointer group hover:z-50
            ${getRarityColor(card.rarity)} bg-slate-900 border-2
        `}
        style={{
            transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.02, 1.02, 1.02)`,
            transition: 'transform 0.1s ease-out'
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
    >
      {/* Holographic Sheen Overlay */}
      <div 
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-40 pointer-events-none z-20 transition-opacity duration-300"
        style={{
            background: `linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)`,
            backgroundSize: '200% 200%',
            backgroundPosition: `${50 + rotate.y}% ${50 + rotate.x}%`,
            mixBlendMode: 'overlay'
        }}
      />
      
      {/* Prismatic Border Glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-30 pointer-events-none" />

      {/* Content Container with Background Gradient */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${getThemeGradient(card.rarity)} opacity-20 pointer-events-none`} />

      {/* Header - Fixed Height Area */}
      <div className="relative z-10 p-4 flex justify-between items-start shrink-0">
          <div className={`text-xs font-bold uppercase tracking-wider ${getRarityTextColor(card.rarity)} drop-shadow-md`}>
              {card.rarity}
          </div>
          {masteryLevel !== 'Novice' && (
              <div className="px-2 py-0.5 rounded-full bg-white/10 text-[9px] font-bold text-white border border-white/20 backdrop-blur-sm">
                  {masteryLevel}
              </div>
          )}
      </div>

      {/* Card Image Area - Fixed Height */}
      <div className="relative h-40 mx-4 rounded-xl bg-black/40 border border-white/10 overflow-hidden flex items-center justify-center group/img shrink-0 shadow-inner">
          {savedImages.length > 0 ? (
              <img src={savedImages[savedImages.length - 1]} alt="Lego Art" className="w-full h-full object-cover" />
          ) : card.imageUrl ? (
              <img src={card.imageUrl} alt={card.title} className="w-full h-full object-cover opacity-90 group-hover/img:scale-110 transition-transform duration-700" />
          ) : (
              <Box className={`w-16 h-16 ${getRarityTextColor(card.rarity)} opacity-50`} />
          )}
          
          {/* Sealed Overlay */}
          {isSealed && (
              <div className="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center backdrop-blur-sm">
                  <Shield className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-xs text-gray-400 font-mono">KNOWLEDGE SEALED</span>
              </div>
          )}
      </div>

      {/* Content - Flex Grow to Fill */}
      <div className="relative z-10 p-4 pt-3 flex flex-col flex-1 min-h-0">
          {/* Title - Line Clamped */}
          <div className="min-h-[2.5rem] mb-1 flex items-center">
            <h3 className={`text-lg font-bold text-white leading-tight line-clamp-2 drop-shadow-sm ${isSealed ? 'blur-sm' : ''}`}>
                {card.title}
            </h3>
          </div>
          
          {/* Description - Takes available space but clamped */}
          <p className={`text-xs text-gray-300 line-clamp-3 mb-2 leading-relaxed ${isSealed ? 'blur-sm' : ''}`}>
              {card.description}
          </p>

          {/* Stats Bar - Pushed to Bottom */}
          <div className="mt-auto flex justify-between items-center text-[10px] font-mono text-gray-400 border-t border-white/10 pt-2">
              <div className="flex gap-3">
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3"/> {card.stats.defense}</span>
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3"/> {card.stats.offense}</span>
              </div>
              <div className="opacity-70">{card.attribute.substring(0,3).toUpperCase()}</div>
          </div>
      </div>

      {/* Actions (Hover) - Absolute Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-between items-center z-20 rounded-b-2xl">
          {!isSealed && (
              <div className="flex items-center gap-1">
                  <button 
                      onClick={(e) => { e.stopPropagation(); onKnowledgeInteraction(); }}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="Study Card"
                  >
                      <Maximize2 className="w-4 h-4" />
                  </button>
                  {onPrismRequest && (
                      <button 
                          onClick={(e) => { e.stopPropagation(); onPrismRequest(); }}
                          className="p-2 rounded-full bg-white/10 hover:bg-celestial-gold/20 text-celestial-gold transition-colors ml-1"
                          title="Intel Prism (AI Real-time)"
                      >
                          <Triangle className="w-4 h-4" />
                      </button>
                  )}
              </div>
          )}
          
          {/* Lego Generation Button (Only if purified and slots available) */}
          {!isSealed && savedImages.length < 3 && (
              <button 
                  onClick={handleLegoize}
                  className={`ml-2 p-2 rounded-lg border transition-all group/btn ${
                      isProcessing 
                      ? 'bg-celestial-gold/20 border-celestial-gold/50 animate-pulse' 
                      : 'bg-white/10 border-white/20 hover:bg-white/20 hover:border-celestial-gold/50'
                  } backdrop-blur-md shadow-lg flex items-center gap-1`}
                  title="Generate AI Lego Visual (Max 3)"
              >
                  {isProcessing ? (
                      <Loader2 className="w-3 h-3 text-celestial-gold animate-spin" />
                  ) : (
                      <>
                          <Box className="w-3 h-3 text-gray-200 group-hover/btn:text-celestial-gold transition-colors" />
                          <span className="text-[8px] font-bold text-gray-300 group-hover/btn:text-celestial-gold hidden group-hover/btn:inline-block transition-all">
                              LEGO
                          </span>
                      </>
                  )}
              </button>
          )}
          
          {/* Purify Button (Only if sealed) */}
          {isSealed && (
              <button 
                  onClick={(e) => { e.stopPropagation(); onPurifyRequest(); }}
                  className="w-full py-2 bg-celestial-purple text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 hover:bg-purple-600 transition-colors animate-pulse shadow-lg shadow-purple-500/20"
              >
                  <Zap className="w-3 h-3" /> Purify
              </button>
          )}
      </div>
    </div>
  );
};

const getThemeGradient = (rarity: string) => {
    switch (rarity) {
        case 'Legendary': return 'from-amber-500/20 to-transparent';
        case 'Epic': return 'from-purple-500/20 to-transparent';
        case 'Rare': return 'from-blue-500/20 to-transparent';
        default: return 'from-emerald-500/20 to-transparent';
    }
}
