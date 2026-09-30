import React from 'react';
import { Sun, Moon, ArrowRight, Sparkles } from 'lucide-react';
import { QBuddyLogo } from './Logo';

interface HeaderProps {
  onNavClick: (sectionId: string) => void;
  onLaunchSystem: () => void;
  activeSection?: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavClick,
  onLaunchSystem,
  activeSection = 'satellite-map',
  theme,
  onToggleTheme,
}) => {
  return (
    <header className={`sticky top-0 z-50 w-full h-20 px-6 sm:px-10 md:px-14 flex items-center justify-between backdrop-blur-md border-b select-none transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-slate-950/85 border-slate-800/80 text-white' 
        : 'bg-white/90 border-slate-200/90 text-slate-900 shadow-sm'
    }`}>
      {/* Left: Brand Logo & Title */}
      <div 
        onClick={() => onNavClick('hero')} 
        className="flex items-center gap-3 cursor-pointer group"
      >
        <QBuddyLogo size="md" showText={true} theme={theme} />
      </div>

      {/* Center: Consolidated Core Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-8">
        <button
          onClick={() => onNavClick('cinematic-preview')}
          className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
            theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          CINEMATIC PREVIEW
        </button>

        <button
          onClick={() => onNavClick('application-model')}
          className={`text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1 ${
            theme === 'dark' ? 'text-cyan-400 hover:text-cyan-300' : 'text-cyan-700 hover:text-cyan-900'
          }`}
        >
          <span>APPLICATION MODEL</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        </button>

        <button
          onClick={() => onNavClick('satellite-map')}
          className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
            theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          SATELLITE MAP
        </button>

        <button
          onClick={() => onNavClick('ecosystem')}
          className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
            theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          ECOSYSTEM
        </button>

        <button
          onClick={() => onNavClick('the-team')}
          className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
            theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-950'
          }`}
        >
          THE TEAM
        </button>
      </nav>

      {/* Right Action Group: Working Theme Toggle & Single Pill CTA */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Working Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          type="button"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          className={`p-2.5 rounded-full border transition-all duration-200 flex items-center justify-center cursor-pointer ${
            theme === 'dark'
              ? 'bg-slate-900 text-amber-400 border-slate-700/80 hover:bg-slate-800 hover:scale-105 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
              : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200 hover:scale-105 shadow-sm'
          }`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" />
          )}
        </button>

        {/* Single Prominent Pill-Shaped CTA Button */}
        <button
          onClick={onLaunchSystem}
          className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-lg ${
            theme === 'dark'
              ? 'bg-white text-slate-950 hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
              : 'bg-slate-900 text-white hover:bg-slate-800 shadow-md'
          }`}
        >
          <span>LAUNCH SYSTEM</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
