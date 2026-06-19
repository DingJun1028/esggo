import { useState, useEffect } from 'react';

export const usePartnerAffinity = () => {
  const [affinities, setAffinities] = useState<Record<string, { level: number; exp: number }>>(
    () => {
      const saved = localStorage.getItem('partner_affinities');
      return saved ? JSON.parse(saved) : {};
    }
  );

  const boostAffinity = (partnerId: string, amount: number) => {
    setAffinities(prev => {
      const current = prev[partnerId] || { level: 0, exp: 0 };
      let newLevel = current.level;
      let newExp = current.exp + amount;

      // Simple leveling: 100 XP = 1 Level
      if (newExp >= 100 && newLevel < 10) {
        newLevel++;
        newExp -= 100;
        // Trigger level up animation/toast here in real app
      }

      const next = { ...prev, [partnerId]: { level: newLevel, exp: newExp } };
      localStorage.setItem('partner_affinities', JSON.stringify(next));
      return next;
    });
  };

  return { affinities, boostAffinity };
};
