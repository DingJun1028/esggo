import React, { useState, useEffect } from 'react';
import { socialEconomyService } from '../services/socialEconomyService';
import { type SocialUserSubscription, SubscriptionTier } from '@/types/social';
import { Link } from 'react-router-dom';

export const VIPStatus: React.FC = () => {
  const [sub, setSub] = useState<SocialUserSubscription | null>(null);

  useEffect(() => {
    // Poll for updates (simplified for demo)
    const interval = setInterval(async () => {
      const data = await socialEconomyService.getUserSubscription('partner_1');
      setSub({ ...data }); // Clone to trigger re-render
    }, 2000);

    // Initial load
    socialEconomyService.getUserSubscription('partner_1').then(setSub);

    return () => clearInterval(interval);
  }, []);

  if (!sub) return null;

  const getEnergyColor = () => {
    const ratio = sub.currentEnergy / sub.limits.dailyEnergyMax;
    if (ratio > 0.5) return 'bg-emerald-500';
    if (ratio > 0.2) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTierBadge = () => {
    switch (sub.tier) {
      case SubscriptionTier.SOVEREIGN:
        return '👑 SOVEREIGN';
      case SubscriptionTier.SUBSCRIBER:
        return '🌿 SUBSCRIBER';
      default:
        return '🌱 FREE';
    }
  };

  const getTierStyle = () => {
    switch (sub.tier) {
      case SubscriptionTier.SOVEREIGN:
        return 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-amber-500/20';
      case SubscriptionTier.SUBSCRIBER:
        return 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/20';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="flex items-center gap-4 bg-slate-800/50 backdrop-blur rounded-full px-4 py-2 border border-white/10">
      {/* Tier Badge */}
      <Link to="/subscription">
        <div
          className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg cursor-pointer hover:scale-105 transition-transform ${getTierStyle()}`}
        >
          {getTierBadge()}
        </div>
      </Link>

      {/* Energy Bar */}
      <div className="flex items-center gap-2" title="每日體力">
        <span className="text-lg">⚡</span>
        <div className="flex flex-col w-24">
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getEnergyColor()}`}
              style={{
                width: `${Math.min(100, (sub.currentEnergy / sub.limits.dailyEnergyMax) * 100)}%`,
              }}
            />
          </div>
          <div className="text-[10px] text-right text-slate-400 mt-0.5 leading-none">
            {sub.limits.dailyEnergyMax > 100
              ? '∞' // Unlimited
              : `${sub.currentEnergy}/${sub.limits.dailyEnergyMax}`}
          </div>
        </div>
      </div>

      {/* GSC Wallet */}
      <div className="flex items-center gap-2 px-3 py-1 bg-slate-700/50 rounded-lg border border-yellow-500/20">
        <span className="text-lg">🪙</span>
        <span className="text-yellow-400 font-bold font-mono">{sub.wallet?.balance || 0}</span>
        <span className="text-[10px] text-slate-400">GSC</span>
      </div>

      {/* Quick Actions */}
      {sub.tier === SubscriptionTier.SOVEREIGN && (
        <div
          title="VIP 特權生效中"
          className="text-amber-400 text-xs flex items-center gap-1 border-l border-white/10 pl-3"
        >
          <span className="animate-pulse">✨</span>
          <span>優先通道</span>
        </div>
      )}
    </div>
  );
};
