import React from 'react';
import { Sun, Moon, Sparkles, Box } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const StyleSwitcher: React.FC = () => {
  const { mode, style, toggleMode, toggleStyle } = useTheme();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {/* Mode Toggle */}
      <button
        onClick={toggleMode}
        className="w-12 h-12 flex-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all shadow-lg"
        title={(mode === 'sun' || mode === 'glass') ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      >
        {(mode === 'sun' || mode === 'glass') ? (
          <Moon className="w-5 h-5 text-indigo-400" />
        ) : (
          <Sun className="w-5 h-5 text-yellow-400" />
        )}
      </button>

      {/* Style Toggle */}
      <button
        onClick={toggleStyle}
        className="w-12 h-12 flex-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all shadow-lg"
        title={style === 'glass' ? 'Switch to Minimal Optics' : 'Switch to Liquid Glass'}
      >
        {style === 'glass' ? (
          <Box className="w-5 h-5 text-cyan-400" />
        ) : (
          <Sparkles className="w-5 h-5 text-purple-400" />
        )}
      </button>
    </div>
  );
};

export default StyleSwitcher;
