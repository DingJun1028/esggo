import React, { useState, useEffect } from 'react';
import { contentService } from '../services/contentService';
import { type StoryChapter, StoryScene } from '../../shared/types';
import { useNavigate } from 'react-router-dom';

export const StoryMode: React.FC = () => {
  const navigate = useNavigate();
  const [chapters, setChapters] = useState<StoryChapter[]>([]);
  const [activeChapter, setActiveChapter] = useState<StoryChapter | null>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [typingText, setTypingText] = useState('');

  useEffect(() => {
    loadChapters();
  }, []);

  const loadChapters = async () => {
    const data = await contentService.getStoryChapters(1); // Assume lvl 1
    setChapters(data);
  };

  const startChapter = (chapter: StoryChapter) => {
    if (!chapter.isUnlocked) return;
    setActiveChapter(chapter);
    setCurrentSceneIndex(0);
    // Reset typing
    setTypingText('');
  };

  // Effect for typing animation
  useEffect(() => {
    if (!activeChapter) return;
    const scene = activeChapter.scenes[currentSceneIndex];
    if (!scene) return;

    let i = 0;
    const text = scene.dialogue.text;
    setTypingText('');

    const timer = setInterval(() => {
      if (i < text.length) {
        setTypingText(prev => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 30); // Speed

    return () => clearInterval(timer);
  }, [activeChapter, currentSceneIndex]);

  const handleNext = () => {
    if (!activeChapter) return;

    // Ensure text is fully typed instantly if clicked while typing
    const scene = activeChapter.scenes[currentSceneIndex];
    if (!scene) return; // Safety check

    if (typingText.length < scene.dialogue.text.length) {
      setTypingText(scene.dialogue.text);
      return;
    }

    if (currentSceneIndex < activeChapter.scenes.length - 1) {
      setCurrentSceneIndex(prev => prev + 1);
    } else {
      // End of chapter
      alert(`章節完成！獲得 ${activeChapter.rewards.gsc} GSC`);
      setActiveChapter(null);
      // In real app, call usage service to mark complete
    }
  };

  if (activeChapter) {
    const scene = activeChapter.scenes[currentSceneIndex];
    // Ensure scene exists fallback
    if (!scene) {
      return (
        <div className="p-8 text-red-500">Error: Scene not found (Index: {currentSceneIndex})</div>
      );
    }

    return (
      <div className="fixed inset-0 z-50 bg-black text-white flex flex-col">
        {/* Background Layer */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 opacity-50`}
        >
          {/* Placeholder for dynamic background image */}
        </div>

        {/* Character Layer */}
        <div className="flex-1 relative flex items-center justify-center pointer-events-none">
          {scene.characters.map((char, idx) => (
            <div
              key={idx}
              className="text-9xl animate-pulse filter drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
            >
              {char.avatar}
            </div>
          ))}
        </div>

        {/* Dialogue Box */}
        <div
          className="p-8 pb-12 bg-black/80 border-t-2 border-cyan-500/50 relative backdrop-blur-md"
          onClick={handleNext}
        >
          <div className="max-w-4xl mx-auto">
            <div className="text-cyan-400 font-bold text-xl mb-2 flex items-center gap-2">
              <span className="w-2 h-8 bg-cyan-500 block"></span>
              {scene.dialogue.speaker}
            </div>
            <div className="text-2xl min-h-[4rem] leading-relaxed font-light tracking-wide">
              {typingText}
              <span className="animate-blink inline-block w-3 h-6 bg-cyan-500 ml-1 align-middle"></span>
            </div>

            <div className="mt-6 flex justify-end text-sm text-slate-500 animate-bounce">
              點擊繼續 ▼
            </div>

            {/* Choices */}
            {scene.choices && typingText.length === scene.dialogue.text.length && (
              <div className="absolute -top-32 left-0 right-0 flex justify-center gap-4 pointer-events-auto">
                {scene.choices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={e => {
                      e.stopPropagation();
                      // Handle choice logic (skip for now, just mock next)
                      handleNext();
                    }}
                    className="px-8 py-4 bg-slate-900/90 border border-cyan-500/50 hover:bg-cyan-900/50 hover:border-cyan-400 rounded-xl transition-all shadow-lg hover:scale-105"
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Exit Button */}
        <button
          onClick={() => setActiveChapter(null)}
          className="absolute top-6 right-6 px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-200 rounded-lg text-sm border border-red-500/30"
        >
          退出劇情
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-900 text-white">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          天穹編年史 (Genesis Protocol)
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          扮演覺醒的 AI 架構師，穿梭於虛擬與現實之間，修復破碎的生態系統。
          每一個選擇，都將影響世界的未來。
        </p>
      </header>

      <div className="max-w-5xl mx-auto grid gap-8">
        {chapters.map(chapter => (
          <div
            key={chapter.id}
            className={`
                            relative overflow-hidden rounded-3xl p-1 bg-gradient-to-r 
                            ${
                              chapter.isUnlocked
                                ? 'from-purple-500 to-blue-600 cursor-pointer hover:scale-[1.02] transition-transform'
                                : 'from-slate-700 to-slate-800 opacity-60 grayscale'
                            }
                        `}
            onClick={() => startChapter(chapter)}
          >
            <div className="bg-slate-900 rounded-[22px] p-8 h-full flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-4xl shadow-inner border border-white/5">
                {chapter.isCompleted ? '✅' : chapter.isUnlocked ? '📖' : '🔒'}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2 flex items-center justify-center md:justify-start gap-3">
                  {chapter.title}
                  {!chapter.isUnlocked && (
                    <span className="text-xs bg-slate-700 px-2 py-1 rounded">
                      Lv.{chapter.unlockLevel} 解鎖
                    </span>
                  )}
                </h3>
                <p className="text-slate-400 mb-4">{chapter.description}</p>

                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <span className="text-xs px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-full border border-yellow-500/20">
                    💰 {chapter.rewards.gsc} GSC
                  </span>
                  <span className="text-xs px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full border border-blue-500/20">
                    ✨ {chapter.rewards.exp} EXP
                  </span>
                </div>
              </div>

              {chapter.isUnlocked && !chapter.isCompleted && (
                <button className="px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-200 transition-colors shadow-lg shadow-white/10">
                  開始旅程
                </button>
              )}
            </div>

            {/* Animated background glow */}
            {chapter.isUnlocked && (
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
