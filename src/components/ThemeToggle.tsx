import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-3 text-slate-600 hover:text-orange-500 hover:bg-orange-50 dark:text-slate-300 dark:hover:text-orange-400 dark:hover:bg-orange-900/20 rounded-xl transition-all duration-200 group"
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      {isDarkMode ? (
        <Sun className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      ) : (
        <Moon className="w-6 h-6 group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
};

export default ThemeToggle;
