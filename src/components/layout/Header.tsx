import React from 'react';
import { 
  Terminal, 
  Search, 
  Sun, 
  Moon, 
  Github, 
  ShieldCheck, 
  ChevronDown,
  Sparkles,
  Layers
} from 'lucide-react';
import { ACTIVE_TOOLS } from '../../registry/tools';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentPath, 
  onNavigate, 
  onOpenCommandPalette 
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  return (
    <header 
      id="main-header" 
      className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-6">
          <button
            id="brand-logo-btn"
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg p-1 -m-1"
            aria-label="ToolMint Homepage"
          >
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-xs group-hover:scale-105 transition-transform">
              <span>M</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              ToolMint
            </span>
          </button>

          {/* Desktop Tools Navigation Menu */}
          <nav className="hidden md:flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-5">
            <button
              onClick={() => onNavigate('/')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                currentPath === '/'
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50/80 dark:bg-emerald-950/50'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
              }`}
            >
              Tools
            </button>
            {ACTIVE_TOOLS.map((tool) => {
              const isActive = currentPath === tool.route;
              return (
                <button
                  key={tool.id}
                  id={`nav-tool-${tool.id}`}
                  onClick={() => onNavigate(tool.route)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className="font-mono text-[11px] opacity-75">{tool.symbol}</span>
                  <span>{tool.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          
          {/* Quick Search / Command Palette Button */}
          <div
            id="cmd-palette-trigger-btn"
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-400 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600 text-xs transition-colors cursor-pointer shadow-xs"
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onOpenCommandPalette(); }}
            aria-label="Search tools"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search tools...</span>
            <kbd className="hidden sm:inline-flex items-center font-sans text-[10px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 px-1 rounded shadow-xs text-slate-600 dark:text-slate-400">
              {isMac ? '⌘K' : 'Ctrl+K'}
            </kbd>
          </div>

          {/* GitHub Link */}
          <a
            id="github-link-btn"
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            title="GitHub Repository"
            aria-label="GitHub Repository"
          >
            <span className="hidden sm:inline">GitHub</span>
            <Github className="w-4 h-4 sm:hidden" />
          </a>

          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
