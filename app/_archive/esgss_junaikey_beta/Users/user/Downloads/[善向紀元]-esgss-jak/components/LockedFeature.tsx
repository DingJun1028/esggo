
import React from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { UserTier } from '../types';
import { useCompany } from './providers/CompanyProvider';

interface LockedFeatureProps {
  children: React.ReactNode;
  featureName: string;
  minTier?: UserTier;
  onUnlock?: () => void;
}

export const LockedFeature: React.FC<LockedFeatureProps> = ({ 
  children, 
  featureName, 
  minTier = 'Pro', 
  onUnlock 
}) => {
  const { tier } = useCompany();

  // Tier Levels: Free = 0, Pro = 1, Enterprise = 2
  const getTierLevel = (t: string) => {
      switch(t) {
          case 'Free': return 0;
          case 'Pro': return 1;
          case 'Enterprise': return 2;
          default: return 0;
      }
  };

  const isUnlocked = getTierLevel(tier) >= getTierLevel(minTier);

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative group overflow-hidden rounded-2xl h-full">
      {/* Blurred Content */}
      <div className="absolute inset-0 bg-slate-900/10 blur-[8px] z-0 pointer-events-none opacity-50 grayscale">
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/80 to-slate-950/90 z-10 flex flex-col items-center justify-center text-center p-6 backdrop-blur-sm border border-white/10 rounded-2xl">
          <div className="p-4 bg-celestial-gold/10 rounded-full border border-celestial-gold/30 mb-4 shadow-[0_0_20px_rgba(251,191,36,0.15)] animate-float">
              <Lock className="w-8 h-8 text-celestial-gold" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">{featureName}</h3>
          <p className="text-sm text-gray-400 mb-6 max-w-xs">
              This feature requires a <span className="text-celestial-gold font-bold">{minTier}</span> subscription. Unlock advanced reasoning and unlimited data capacity.
          </p>
          
          <button 
            onClick={onUnlock}
            className="group relative px-6 py-3 bg-gradient-to-r from-celestial-gold to-amber-600 text-black font-bold rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all hover:scale-105 overflow-hidden"
          >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <div className="relative flex items-center gap-2">
                  <Sparkles className="w-4 h-4 fill-black/20" />
                  <span>Upgrade to {minTier}</span>
              </div>
          </button>
      </div>
      
      {/* Fake underlying content container to maintain height */}
      <div className="invisible" aria-hidden="true">
          {children}
      </div>
    </div>
  );
};
