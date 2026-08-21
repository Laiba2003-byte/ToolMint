import React, { useState, useMemo } from 'react';
import { 
  ArrowLeftRight, 
  Columns, 
  AlignJustify, 
  Copy, 
  CheckCircle2, 
  AlertCircle, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { CodeEditor } from '../../components/common/CodeEditor';
import { normalizeJson, computeJsonDiff, generateDiffText } from './diffEngine';
import { DIFF_SAMPLES } from './samples';
import { DiffViewMode, DiffOptions } from '../../types/json-diff';
import { useToast } from '../../context/ToastContext';

export const JsonDiff: React.FC = () => {
  const [originalText, setOriginalText] = useState<string>(() => DIFF_SAMPLES[0].original);
  const [modifiedText, setModifiedText] = useState<string>(() => DIFF_SAMPLES[0].modified);
  const [viewMode, setViewMode] = useState<DiffViewMode>('side-by-side');
  const [options, setOptions] = useState<DiffOptions>({
    ignoreKeyOrder: true,
    collapseUnchanged: false,
    caseSensitive: true
  });

  const { success, error } = useToast();

  // Validate inputs
  const originalNorm = useMemo(() => normalizeJson(originalText, options.ignoreKeyOrder), [originalText, options.ignoreKeyOrder]);
  const modifiedNorm = useMemo(() => normalizeJson(modifiedText, options.ignoreKeyOrder), [modifiedText, options.ignoreKeyOrder]);

  const isValidBoth = Boolean(originalText.trim() && modifiedText.trim() && !originalNorm.error && !modifiedNorm.error);

  // Compute diff
  const diffResult = useMemo(() => {
    if (!isValidBoth) {
      return null;
    }
    return computeJsonDiff(originalNorm.parsed, modifiedNorm.parsed, options);
  }, [isValidBoth, originalNorm.parsed, modifiedNorm.parsed, options]);

  const handleSwap = () => {
    const temp = originalText;
    setOriginalText(modifiedText);
    setModifiedText(temp);
    success('Swapped Original and Modified JSON');
  };

  const handleCopyDiff = async () => {
    if (!diffResult) return;
    try {
      const text = generateDiffText(diffResult.lines);
      await navigator.clipboard.writeText(text);
      success('Copied diff to clipboard');
    } catch {
      error('Failed to copy diff');
    }
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = DIFF_SAMPLES.find(s => s.id === sampleId);
    if (sample) {
      setOriginalText(sample.original);
      setModifiedText(sample.modified);
      success(`Loaded sample: ${sample.name}`);
    }
  };

  return (
    <div id="json-diff-tool" className="flex flex-col gap-6">
      
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        
        {/* Sample Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">
            Samples:
          </span>
          {DIFF_SAMPLES.map(sample => (
            <button
              key={sample.id}
              id={`diff-sample-btn-${sample.id}`}
              onClick={() => handleLoadSample(sample.id)}
              className="px-2.5 py-1 text-xs rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs font-mono"
            >
              {sample.name}
            </button>
          ))}
        </div>

        {/* View Controls & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Side-by-side vs Unified view switch */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-100 dark:bg-slate-900">
            <button
              id="view-side-by-side-btn"
              onClick={() => setViewMode('side-by-side')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'side-by-side'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
            <button
              id="view-unified-btn"
              onClick={() => setViewMode('unified')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'unified'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <AlignJustify className="w-3.5 h-3.5" />
              <span>Unified</span>
            </button>
          </div>

          {/* Ignore Key Order toggle */}
          <label className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <input
              type="checkbox"
              id="ignore-key-order-check"
              checked={options.ignoreKeyOrder}
              onChange={e => setOptions(prev => ({ ...prev, ignoreKeyOrder: e.target.checked }))}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            <span>Ignore Key Order</span>
          </label>

          {/* Swap Button */}
          <button
            id="swap-json-btn"
            onClick={handleSwap}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
            title="Swap Original and Modified inputs"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Swap</span>
          </button>

          {/* Copy Diff */}
          {diffResult && (
            <button
              id="copy-diff-btn"
              onClick={handleCopyDiff}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-slate-100 dark:bg-slate-100 dark:text-slate-900 text-xs font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Diff</span>
            </button>
          )}

        </div>
      </div>

      {/* Dual Input Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <CodeEditor
            id="original-json-input"
            label="Original JSON (Before)"
            value={originalText}
            onChange={setOriginalText}
            placeholder="Paste original JSON..."
            heightClass="h-56 sm:h-64"
            badge={
              originalNorm.error ? (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                  INVALID JSON
                </span>
              ) : (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  ORIGINAL
                </span>
              )
            }
          />
          {originalNorm.error && (
            <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Original JSON error: {originalNorm.error}</span>
            </p>
          )}
        </div>

        <div>
          <CodeEditor
            id="modified-json-input"
            label="Modified JSON (After)"
            value={modifiedText}
            onChange={setModifiedText}
            placeholder="Paste modified JSON..."
            heightClass="h-56 sm:h-64"
            badge={
              modifiedNorm.error ? (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                  INVALID JSON
                </span>
              ) : (
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  MODIFIED
                </span>
              )
            }
          />
          {modifiedNorm.error && (
            <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Modified JSON error: {modifiedNorm.error}</span>
            </p>
          )}
        </div>
      </div>

      {/* Comparison Results Section */}
      {diffResult && (
        <div id="diff-results-container" className="flex flex-col gap-3">
          
          {/* Summary Badges Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                Diff Summary:
              </h3>
              {diffResult.summary.isIdentical ? (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Objects are identical (No differences detected)
                </span>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                <Plus className="w-3 h-3" />
                {diffResult.summary.added} Added
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                <Minus className="w-3 h-3" />
                {diffResult.summary.removed} Removed
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-medium bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                <span className="font-bold">~</span>
                {diffResult.summary.changed} Changed
              </span>

              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800">
                {diffResult.summary.unchanged} Unchanged
              </span>
            </div>
          </div>

          {/* Visual Diff View Display */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 dark:bg-black text-slate-100 font-mono text-xs overflow-hidden shadow-inner">
            
            {/* Diff Header */}
            <div className="px-4 py-2 border-b border-slate-800 bg-slate-950/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span className="font-semibold uppercase tracking-wider text-slate-300">
                {viewMode === 'side-by-side' ? 'Side-by-Side Comparison' : 'Unified Diff View'}
              </span>
              <span className="text-[10px] text-slate-500">
                {diffResult.lines.length} rendered lines
              </span>
            </div>

            {/* Diff Content Lines */}
            <div className="max-h-[460px] overflow-y-auto overflow-x-auto divide-y divide-slate-800/40">
              {diffResult.lines.map((line) => {
                const indentPx = line.depth * 16;

                if (viewMode === 'side-by-side') {
                  return (
                    <div 
                      key={line.id} 
                      className={`grid grid-cols-2 divide-x divide-slate-800 text-[12px] leading-relaxed transition-colors ${
                        line.type === 'added'
                          ? 'bg-emerald-950/30'
                          : line.type === 'removed'
                          ? 'bg-rose-950/30'
                          : line.type === 'changed'
                          ? 'bg-amber-950/20'
                          : 'hover:bg-slate-800/20'
                      }`}
                    >
                      {/* Left / Original side */}
                      <div className="px-3 py-1 flex items-start gap-2 overflow-x-auto min-w-0">
                        <span className="w-4 shrink-0 text-center font-bold select-none text-[11px]">
                          {line.type === 'removed' ? (
                            <span className="text-rose-400">-</span>
                          ) : line.type === 'changed' ? (
                            <span className="text-amber-400">~</span>
                          ) : ' '}
                        </span>
                        <div style={{ paddingLeft: `${indentPx}px` }} className="truncate">
                          {line.type !== 'added' ? (
                            <span className={line.type === 'removed' ? 'text-rose-300 line-through opacity-80' : line.type === 'changed' ? 'text-amber-300' : 'text-slate-300'}>
                              {line.leftKey ? <span className="text-slate-400">{line.leftKey}: </span> : null}
                              <span>{line.leftValue}</span>
                            </span>
                          ) : (
                            <span className="text-slate-700 select-none">···</span>
                          )}
                        </div>
                      </div>

                      {/* Right / Modified side */}
                      <div className="px-3 py-1 flex items-start gap-2 overflow-x-auto min-w-0">
                        <span className="w-4 shrink-0 text-center font-bold select-none text-[11px]">
                          {line.type === 'added' ? (
                            <span className="text-emerald-400">+</span>
                          ) : line.type === 'changed' ? (
                            <span className="text-amber-400">~</span>
                          ) : ' '}
                        </span>
                        <div style={{ paddingLeft: `${indentPx}px` }} className="truncate">
                          {line.type !== 'removed' ? (
                            <span className={line.type === 'added' ? 'text-emerald-300 font-medium' : line.type === 'changed' ? 'text-amber-300 font-medium' : 'text-slate-300'}>
                              {line.rightKey ? <span className="text-slate-400">{line.rightKey}: </span> : null}
                              <span>{line.rightValue}</span>
                            </span>
                          ) : (
                            <span className="text-slate-700 select-none">···</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Unified View
                return (
                  <div 
                    key={line.id} 
                    className={`px-3 py-1 flex items-center gap-2 text-[12px] leading-relaxed ${
                      line.type === 'added'
                        ? 'bg-emerald-950/30 text-emerald-300'
                        : line.type === 'removed'
                        ? 'bg-rose-950/30 text-rose-300 line-through'
                        : line.type === 'changed'
                        ? 'bg-amber-950/25 text-amber-200'
                        : 'text-slate-300 hover:bg-slate-800/30'
                    }`}
                  >
                    <span className="w-4 text-center font-bold select-none shrink-0">
                      {line.type === 'added' && '+'}
                      {line.type === 'removed' && '-'}
                      {line.type === 'changed' && '~'}
                      {line.type === 'unchanged' && ' '}
                    </span>

                    <div style={{ paddingLeft: `${indentPx}px` }} className="truncate">
                      {line.type === 'added' && (
                        <span>{line.rightKey ? `${line.rightKey}: ` : ''}{line.rightValue}</span>
                      )}
                      {line.type === 'removed' && (
                        <span>{line.leftKey ? `${line.leftKey}: ` : ''}{line.leftValue}</span>
                      )}
                      {line.type === 'changed' && (
                        <span>
                          {line.leftKey || line.rightKey}: <span className="line-through text-rose-400 opacity-80">{line.leftValue}</span> → <span className="text-emerald-400 font-semibold">{line.rightValue}</span>
                        </span>
                      )}
                      {line.type === 'unchanged' && (
                        <span>{line.leftKey ? `${line.leftKey}: ` : ''}{line.leftValue || line.rightValue}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
