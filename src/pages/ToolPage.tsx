import React from 'react';
import { 
  ChevronRight, 
  ShieldCheck, 
  ArrowLeft,
  Share2,
  FileJson,
  GitCompare,
  Regex,
  Clock,
  Sparkles
} from 'lucide-react';
import { ToolDefinition } from '../types';
import { ACTIVE_TOOLS } from '../registry/tools';
import { JsonErrorFinder } from '../tools/json-error-finder/JsonErrorFinder';
import { JsonDiff } from '../tools/json-diff/JsonDiff';
import { RegexPlayground } from '../tools/regex-playground/RegexPlayground';
import { TimestampTranslator } from '../tools/timestamp-translator/TimestampTranslator';
import { useToast } from '../context/ToastContext';

interface ToolPageProps {
  tool: ToolDefinition;
  onNavigate: (path: string) => void;
}

export const ToolPage: React.FC<ToolPageProps> = ({ tool, onNavigate }) => {
  const { success } = useToast();

  const handleShareTool = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      success(`Copied link to ${tool.name}`);
    } catch {
      // ignore
    }
  };

  const renderToolComponent = () => {
    switch (tool.id) {
      case 'json-error-finder':
        return <JsonErrorFinder />;
      case 'json-diff':
        return <JsonDiff />;
      case 'regex-playground':
        return <RegexPlayground />;
      case 'timestamp':
        return <TimestampTranslator />;
      default:
        return (
          <div className="py-12 text-center text-sm text-stone-500">
            This tool is currently in active development.
          </div>
        );
    }
  };

  return (
    <div id={`tool-page-${tool.id}`} className="max-w-7xl mx-auto px-4 sm:px-8 py-6 flex flex-col gap-6">
      
      {/* Breadcrumb & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
        
        <div className="flex items-center gap-1.5 font-medium">
          <button
            onClick={() => onNavigate('/')}
            className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span>{tool.category}</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-900 dark:text-slate-100 font-semibold">{tool.name}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Tool Switcher Pills */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
            {ACTIVE_TOOLS.map(t => (
              <button
                key={t.id}
                onClick={() => onNavigate(t.route)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                  t.id === tool.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                {t.symbol} {t.name}
              </button>
            ))}
          </div>

          <button
            onClick={handleShareTool}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Copy shareable tool URL"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Tool Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
              {tool.symbol}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {tool.name}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {tool.tagline}
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-mono font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Runs 100% In-Browser</span>
        </div>
      </div>

      {/* Main Tool Component Content */}
      <main className="w-full">
        {renderToolComponent()}
      </main>

    </div>
  );
};
