import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useOmniTheme } from '../../omni/infrastructure/ui/OmniThemeProvider';

export const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useOmniTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.1, rotate: 5 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="relative p-3 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg group overflow-hidden"
      title={theme === 'moon' ? 'Switch to Sun Mode' : 'Switch to Moon Mode'}
    >
      {/* Liquid Background Flow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00FFFF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10 flex items-center justify-center">
        {theme === 'moon' ? (
          <motion.div
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            className="text-[#00FFFF]"
          >
            <Moon className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
            className="text-amber-500"
          >
            <Sun className="w-5 h-5" />
          </motion.div>
        )}
      </div>

      {/* Optical Sparkle Effect */}
      <motion.div
        animate={{
          opacity: [0, 1, 0],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -top-1 -right-1 text-[#00FFFF]/40"
      >
        <Sparkles className="w-3 h-3" />
      </motion.div>
    </motion.button>
  );
};

