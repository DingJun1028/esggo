import { useState, useEffect } from 'react';
import { useOmniRealtime } from './useOmniRealtime';

export function useOmniResonance() {
  const { events } = useOmniRealtime();
  const [rs, setRs] = useState(0.92); 
  const [streamStatus, setStreamStatus] = useState<{ ren: number; du: number }>({ ren: 100, du: 100 });
  const [isCrystallizing, setIsCrystallizing] = useState(false);

  useEffect(() => {
    if (events.length > 0) {
      // 模擬 Rs 計算邏輯：當有新事件時會略微提升共鳴率，展現協作熱度
      const baseRs = 0.95 + (Math.random() * 0.04); 
      setRs(Math.min(Math.max(baseRs, 0), 1.0));
      
      setStreamStatus({
        ren: 85 + Math.random() * 15, 
        du: 80 + Math.random() * 20   
      });
    } else {
      // 閒置時的生命感微擾
      const interval = setInterval(() => {
        setRs(prev => {
          const noise = (Math.random() - 0.5) * 0.01;
          return Math.min(Math.max(prev + noise, 0.88), 1.0);
        });
        setStreamStatus({
          ren: 90 + Math.random() * 10, 
          du: 85 + Math.random() * 15   
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [events]);

  const triggerCrystallization = async () => {
    setIsCrystallizing(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsCrystallizing(false);
    return true;
  };

  return {
    rs,
    streamStatus,
    isCrystallizing,
    triggerCrystallization,
    status: rs >= 0.9 ? 'Stable Crystal' : rs >= 0.7 ? 'Harmonizing' : 'Entropy Warning'
  };
}
