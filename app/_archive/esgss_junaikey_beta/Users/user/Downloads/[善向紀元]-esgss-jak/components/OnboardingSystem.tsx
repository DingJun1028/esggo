
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Database, Zap, Cpu, CheckCircle, Globe, Lock, ArrowRight } from 'lucide-react';
import { useCompany } from './providers/CompanyProvider';

export const OnboardingSystem: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const { userName } = useCompany();

  const finishBoot = () => {
      setIsVisible(false);
      sessionStorage.setItem('esgss_boot_sequence_v15_final', 'true');
  };

  useEffect(() => {
      const hasSeen = sessionStorage.getItem('esgss_boot_sequence_v15_final');
      if (hasSeen) {
          setIsVisible(false);
          return;
      }
      
      // Force end after 2 seconds safety
      const safetyTimeout = setTimeout(finishBoot, 2000);

      const interval = setInterval(() => {
          setProgress(prev => {
              if (prev >= 100) {
                  clearInterval(interval);
                  return 100;
              }
              const increment = 20 + Math.random() * 20; // Aggressive progress
              return Math.min(prev + increment, 100);
          });
      }, 100); 

      return () => {
          clearInterval(interval);
          clearTimeout(safetyTimeout);
      };
  }, []);

  useEffect(() => {
      if (progress < 30) setStep(0);
      else if (progress < 60) setStep(1);
      else if (progress < 90) setStep(2);
      else setStep(3);
  }, [progress]);

  if (!isVisible) return null;

  const steps = [
      { text: "INITIALIZING KERNEL...", sub: "Loading Omni-Components", icon: Cpu },
      { text: "ESTABLISHING PROTOCOL...", sub: "Syncing with StarGate", icon: Globe },
      { text: "INJECTING GENESIS SEEDS...", sub: "Simple. Fast. Perfect.", icon: Zap },
      { text: `WELCOME, ${userName?.toUpperCase() || 'COMMANDER'}`, sub: "System Ready", icon: CheckCircle },
  ];

  const CurrentIcon = steps[step].icon;

  return (
    <div 
        className="fixed inset-0 z-[2000] bg-slate-950 flex flex-col items-center justify-center cursor-pointer"
        onClick={finishBoot}
    >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[length:40px_40px] pointer-events-none" />
        
        <div className="relative z-10 w-full max-w-md p-8 flex flex-col items-center">
            <div className="relative mb-12">
                <div className="w-24 h-24 rounded-full border-2 border-celestial-emerald/20 border-t-celestial-emerald animate-spin flex items-center justify-center">
                    <CurrentIcon className="w-8 h-8 text-white animate-pulse" />
                </div>
            </div>

            <div className="w-full space-y-2 mb-8 px-8">
                <div className="flex justify-between text-[10px] font-mono text-celestial-emerald uppercase tracking-widest">
                    <span>BOOT_SEQUENCE</span>
                    <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-[1px] w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-celestial-emerald transition-all duration-200" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className="text-center space-y-1">
                <h2 className="text-lg font-bold text-white tracking-[0.2em] uppercase">
                    {steps[step].text}
                </h2>
                <p className="text-[10px] text-gray-500 font-mono animate-pulse uppercase">
                    {steps[step].sub}
                </p>
            </div>
        </div>
    </div>
  );
};
