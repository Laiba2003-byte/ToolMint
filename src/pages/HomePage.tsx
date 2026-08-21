import React from 'react';
import { 
  FileJson, 
  GitCompare, 
  Regex, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  Cpu, 
  Sparkles,
  Search,
  Key,
  Binary,
  Hash,
  Calendar,
  Layers
} from 'lucide-react';
import { ACTIVE_TOOLS, UPCOMING_TOOLS } from '../registry/tools';
import { ToolDefinition } from '../types';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onOpenCommandPalette: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  onNavigate, 
  onOpenCommandPalette 
}) => {
  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  return (
    <div id="home-page-container" className="flex flex-col gap-12 py-8 sm:py-12">
      
      {/* Sleek Hero Section */}
      <section id="hero-section" className="text-center max-w-4xl mx-auto px-4 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-mono font-medium shadow-2xs mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>100% In-Browser Execution · Zero Data Leaves Machine</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4">
          Tiny tools. <span className="text-emerald-500">Zero friction.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          Fast, privacy-first utilities for developers. No login, no clutter — just the tool you need to get back to coding.
        </p>

        {/* Quick search shortcut button */}
        <div className="mt-6 flex items-center gap-3">
          <button
            id="hero-quick-search-btn"
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2.5 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all shadow-xs"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Search all tools</span>
            <kbd className="font-sans text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              {isMac ? '⌘K' : 'Ctrl+K'}
            </kbd>
          </button>
        </div>
      </section>

      {/* Available Tools Grid */}
      <section id="available-tools-section" className="max-w-4xl mx-auto w-full px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ACTIVE_TOOLS.map((tool, idx) => (
            <ToolCard 
              key={tool.id} 
              tool={tool} 
              isMostPopular={idx === 0}
              onNavigate={onNavigate} 
            />
          ))}
        </div>
      </section>

      {/* Compact Privacy & Trust Section */}
      <section id="privacy-section" className="max-w-4xl mx-auto w-full px-4">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Your data stays yours.
              </h3>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                100% Client-Side
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              ToolMint processes your data locally in your browser. Your JSON, regex patterns, timestamps, and other inputs aren&apos;t uploaded to any servers.
            </p>
            <div className="mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>🔒 Your data never leaves your browser. All processing happens locally.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Tools Roadmap Section */}
      <section id="upcoming-roadmap-section" className="max-w-4xl mx-auto w-full px-4 pb-6">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Future Tool Registry (Roadmap)
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              More zero-friction privacy tools currently in development:
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {UPCOMING_TOOLS.length} upcoming
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {UPCOMING_TOOLS.map((tool) => (
            <div
              key={tool.id}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 flex flex-col justify-between gap-3 shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {tool.symbol}
                  </span>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {tool.category}
                  </span>
                </div>
                <h5 className="font-semibold text-xs text-slate-800 dark:text-slate-200 mt-2">
                  {tool.name}
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                  {tool.tagline}
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono font-medium">Coming Soon</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

interface ToolCardProps {
  tool: ToolDefinition;
  isMostPopular?: boolean;
  onNavigate: (path: string) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, isMostPopular, onNavigate }) => {
  const getActionLabel = (toolId: string) => {
    switch (toolId) {
      case 'json-error-finder':
        return 'Open Tool →';
      case 'json-diff':
        return 'Compare JSON →';
      case 'regex-playground':
        return 'Test Regex →';
      case 'timestamp':
        return 'Translate Time →';
      default:
        return 'Open Tool →';
    }
  };

  const renderIconContent = (toolId: string, symbol: string) => {
    if (toolId === 'timestamp') {
      return <Clock className="w-5 h-5" />;
    }
    return <span>{symbol}</span>;
  };

  return (
    <div
      id={`home-tool-card-${tool.id}`}
      onClick={() => onNavigate(tool.route)}
      className="group bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Card Header: Icon & Category/Popular Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-300 text-xl font-mono group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/60 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {renderIconContent(tool.id, tool.symbol)}
          </div>

          {isMostPopular ? (
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
              Most Popular
            </span>
          ) : (
            <span className="text-[10px] font-mono font-medium px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
              {tool.category}
            </span>
          )}
        </div>

        {/* Title & Tagline */}
        <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {tool.name}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          {tool.tagline}
        </p>
      </div>

      {/* Action Footer */}
      <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-semibold text-sm group-hover:translate-x-0.5 transition-transform">
        <span>{getActionLabel(tool.id)}</span>
      </div>
    </div>
  );
};
