import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  ArrowRight, 
  CornerDownLeft, 
  FileJson, 
  GitCompare, 
  Regex, 
  Clock, 
  Key, 
  Binary, 
  Hash, 
  Calendar,
  Sparkles,
  X
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { TOOLS_REGISTRY } from '../../registry/tools';
import { ToolDefinition } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (route: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  FileJson: <FileJson className="w-4 h-4" />,
  GitCompare: <GitCompare className="w-4 h-4" />,
  Regex: <Regex className="w-4 h-4" />,
  Clock: <Clock className="w-4 h-4" />,
  Key: <Key className="w-4 h-4" />,
  Binary: <Binary className="w-4 h-4" />,
  Hash: <Hash className="w-4 h-4" />,
  Calendar: <Calendar className="w-4 h-4" />
};

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTool
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredTools = TOOLS_REGISTRY.filter(tool => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      tool.name.toLowerCase().includes(q) ||
      tool.tagline.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q) ||
      tool.keywords.some(k => k.toLowerCase().includes(q)) ||
      (tool.symbol && tool.symbol.toLowerCase().includes(q))
    );
  });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filteredTools.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredTools.length) % (filteredTools.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredTools[selectedIndex]) {
          const selected = filteredTools[selectedIndex];
          if (selected.isAvailable) {
            onSelectTool(selected.route);
            onClose();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredTools, onClose, onSelectTool]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          id="command-palette-backdrop"
          className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-stone-950/50 dark:bg-black/70 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
            id="command-palette-modal"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search tools by name, tag, or shortcut (e.g., json, diff, regex, epoch)..."
                className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              />
              {query && (
                <button 
                  onClick={() => setQuery('')}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results List */}
            <div 
              ref={listRef}
              className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 dark:divide-slate-800/50"
            >
              {filteredTools.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No tools found matching &quot;{query}&quot;
                </div>
              ) : (
                filteredTools.map((tool, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <button
                      key={tool.id}
                      id={`cmd-tool-${tool.id}`}
                      disabled={!tool.isAvailable}
                      onClick={() => {
                        if (tool.isAvailable) {
                          onSelectTool(tool.route);
                          onClose();
                        }
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors ${
                        isSelected && tool.isAvailable
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-slate-900 dark:text-slate-100'
                          : isSelected && !tool.isAvailable
                          ? 'bg-slate-100 dark:bg-slate-800/60'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-800/40'
                      } ${!tool.isAvailable ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-mono text-xs font-semibold ${
                          tool.isAvailable 
                            ? 'bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}>
                          {tool.symbol || (tool.icon && ICON_MAP[tool.icon]) || <FileJson className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-xs truncate">{tool.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700">
                              {tool.category}
                            </span>
                            {!tool.isAvailable && (
                              <span className="text-[9px] uppercase tracking-wider px-1 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 font-semibold">
                                Upcoming
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {tool.tagline}
                          </p>
                        </div>
                      </div>

                      {tool.isAvailable ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 shrink-0 text-xs">
                          {isSelected && <CornerDownLeft className="w-3.5 h-3.5" />}
                        </div>
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer helper */}
            <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-sans text-[10px]">↑↓</kbd> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-sans text-[10px]">Enter</kbd> Open
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-sans text-[10px]">Esc</kbd> Close
                </span>
              </div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                🔒 In-Browser
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
