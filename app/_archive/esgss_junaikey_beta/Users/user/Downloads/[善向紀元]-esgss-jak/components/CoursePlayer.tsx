
import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle, BrainCircuit, MessageSquare, Award } from 'lucide-react';
import { Course } from '../types';
import { useCompany } from './providers/CompanyProvider';
import { useToast } from '../contexts/ToastContext';

interface CoursePlayerProps {
  course: Course;
  onClose: () => void;
  onComplete: () => void;
}

export const CoursePlayer: React.FC<CoursePlayerProps> = ({ course, onClose, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const { awardXp, companyName } = useCompany();
  const { addToast } = useToast();

  useEffect(() => {
    let interval: any;
    if (isPlaying && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            if (!isCompleted) {
                setIsCompleted(true);
                // Trigger rewards
                setTimeout(onComplete, 500); 
            }
            return 100;
          }
          return prev + 0.5; // Simulate play progress
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying, progress, isCompleted, onComplete]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col animate-fade-in">
      {/* Header */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md">
        <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-celestial-purple text-white">LEARNING MODE</span>
                {course.title}
            </h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left: Video Area */}
          <div className="flex-1 bg-black relative flex flex-col justify-center items-center group">
              {/* Simulated Video Content */}
              <div className="absolute inset-0 opacity-30">
                  <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-950 to-black animate-pulse" />
                  {/* Grid Lines for tech feel */}
                  <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(255,255,255,.05)_25%,rgba(255,255,255,.05)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.05)_75%,rgba(255,255,255,.05)_76%,transparent_77%,transparent)] bg-[length:50px_50px]" />
              </div>

              {/* Central Play Controls */}
              <button 
                onClick={togglePlay}
                className="z-20 w-20 h-20 rounded-full bg-white/10 border-2 border-white/20 backdrop-blur-md flex items-center justify-center hover:scale-110 hover:bg-white/20 transition-all group/btn"
              >
                  {isCompleted ? <RotateCcw className="w-8 h-8 text-white" /> : isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
              </button>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-800">
                  <div 
                    className="h-full bg-celestial-emerald relative"
                    style={{ width: `${progress}%` }}
                  >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform" />
                  </div>
              </div>
          </div>

          {/* Right: AI Tutor & Syllabus */}
          <div className="w-full md:w-96 border-l border-white/10 bg-slate-900/80 backdrop-blur-xl flex flex-col">
              <div className="p-4 border-b border-white/10 bg-white/5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <BrainCircuit className="w-4 h-4 text-celestial-gold" />
                      JunAiKey Tutor
                  </h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                  {/* AI Generated Notes */}
                  <div className="bg-celestial-purple/10 border border-celestial-purple/20 rounded-xl p-4">
                      <div className="text-xs font-bold text-celestial-purple mb-2 uppercase tracking-wider">Key Takeaways</div>
                      <ul className="text-xs text-gray-300 space-y-2 list-disc list-inside leading-relaxed">
                          <li><strong className="text-white">Scope 3</strong> accounts for ~70% of typical corporate emissions.</li>
                          <li>Accurate data collection requires supplier engagement.</li>
                          <li>{companyName} should prioritize category 1 (Purchased Goods).</li>
                      </ul>
                  </div>

                  {/* Transcript / Interaction */}
                  <div className="space-y-3">
                      <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-gray-400">0:15</div>
                          <div className="flex-1 text-sm text-gray-400">Welcome to the advanced module on GHG Protocol...</div>
                      </div>
                      <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-gray-400">1:20</div>
                          <div className={`flex-1 text-sm ${progress > 20 ? 'text-white' : 'text-gray-500'}`}>Defining organizational boundaries: Control vs Equity Share.</div>
                      </div>
                      <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-gray-400">3:45</div>
                          <div className={`flex-1 text-sm ${progress > 50 ? 'text-white' : 'text-gray-500'}`}>Case Study: Apple's supply chain decarbonization strategy.</div>
                      </div>
                  </div>
              </div>

              {/* Action Area */}
              <div className="p-4 border-t border-white/10 bg-black/20">
                  {isCompleted ? (
                      <button 
                        onClick={onClose}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                          <CheckCircle className="w-5 h-5" />
                          Lesson Completed
                      </button>
                  ) : (
                      <div className="text-center text-xs text-gray-500">
                          Complete video to earn <span className="text-celestial-gold font-bold">500 XP</span> & Certificate
                      </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};
