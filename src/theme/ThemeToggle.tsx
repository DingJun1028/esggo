import React from 'react';
import { useOmniTheme } from './OmniThemeProvider';

// Assuming icon components exist elsewhere or are simple for now
const SunIcon = () => <span>☀️</span>; // Placeholder
const MoonIcon = () => <span>🌙</span>; // Placeholder

export const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useOmniTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};
