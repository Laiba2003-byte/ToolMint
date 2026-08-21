import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { ACTIVE_TOOLS } from '../../registry/tools';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer 
      id="main-footer" 
      className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        
        {/* Trust & Privacy Banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
            <div className="w-5 h-5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span>
              <strong className="font-semibold text-slate-900 dark:text-slate-200">100% Client-Side Privacy:</strong> Your JSON, regex, and timestamps are processed purely in browser memory.
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
              <span>Zero network payloads</span>
            </span>
          </div>
        </div>

        {/* Quick Links & Brand */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 bg-emerald-500 rounded flex items-center justify-center text-white text-[10px] font-bold">
              M
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">ToolMint</span>
            <span className="text-slate-300 dark:text-slate-700">—</span>
            <span>Tiny tools. Zero friction.</span>
          </div>

          {/* Tool shortcuts list */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 justify-center">
            {ACTIVE_TOOLS.map(t => (
              <button
                key={t.id}
                onClick={() => onNavigate(t.route)}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                {t.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[11px] font-mono">
            <span>© {new Date().getFullYear()} ToolMint</span>
            <span>·</span>
            <span>v1.0.4</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
