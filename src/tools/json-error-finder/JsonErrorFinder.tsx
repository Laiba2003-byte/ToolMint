import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Wand2, 
  Minimize2, 
  Maximize2, 
  Copy, 
  FileJson, 
  Trash2, 
  Sparkles, 
  ArrowRight,
  Layers,
  Hash,
  FileText,
  HelpCircle
} from 'lucide-react';
import { CodeEditor } from '../../components/common/CodeEditor';
import { analyzeJson, calculateJsonStats } from './jsonParser';
import { JSON_SAMPLES } from './samples';
import { useToast } from '../../context/ToastContext';

export const JsonErrorFinder: React.FC = () => {
  const [jsonText, setJsonText] = useState<string>(() => JSON_SAMPLES[0].code);
  const { success, error } = useToast();

  const analysis = useMemo(() => analyzeJson(jsonText), [jsonText]);
  const stats = useMemo(() => calculateJsonStats(jsonText), [jsonText]);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonText(formatted);
      success('Formatted JSON (2 spaces indentation)');
    } catch {
      error('Cannot format invalid JSON. Fix syntax errors first.');
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const minified = JSON.stringify(parsed);
      setJsonText(minified);
      success('Minified JSON to single line');
    } catch {
      error('Cannot minify invalid JSON. Fix syntax errors first.');
    }
  };

  const handleApplyFix = () => {
    if (analysis.suggestedFix) {
      setJsonText(analysis.suggestedFix.fixedContent);
      success('Auto-fix applied successfully');
    }
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = JSON_SAMPLES.find(s => s.id === sampleId);
    if (sample) {
      setJsonText(sample.code);
      success(`Loaded sample: ${sample.name}`);
    }
  };

  return (
    <div id="json-error-finder-tool" className="flex flex-col gap-6">
      
      {/* Top Controls & Sample Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">
            Load Sample:
          </span>
          {JSON_SAMPLES.map(sample => (
            <button
              key={sample.id}
              id={`sample-btn-${sample.id}`}
              onClick={() => handleLoadSample(sample.id)}
              className="px-2.5 py-1 text-xs rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs font-mono"
            >
              {sample.name}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="format-json-btn"
            onClick={handleFormat}
            disabled={!analysis.isValid || !jsonText.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 text-slate-100 dark:bg-slate-100 dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
            title="Format with 2-space indentation"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Format</span>
          </button>

          <button
            id="minify-json-btn"
            onClick={handleMinify}
            disabled={!analysis.isValid || !jsonText.trim()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
            title="Minify JSON (remove whitespace)"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Minify</span>
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div id="json-status-banner">
        {!jsonText.trim() ? (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/40 text-xs text-slate-600 dark:text-slate-400">
            <HelpCircle className="w-4 h-4 text-slate-400 shrink-0" />
            <span>Paste your JSON into the editor below to validate and diagnose syntax issues.</span>
          </div>
        ) : analysis.isValid ? (
          <div className="flex items-center justify-between flex-wrap gap-3 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/20 text-xs text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Valid JSON — Syntax is compliant with RFC 8259</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-emerald-700 dark:text-emerald-400/90">
              <span>{stats.keysCount} keys</span>
              <span>·</span>
              <span>depth: {stats.depth}</span>
              <span>·</span>
              <span>{stats.bytes} bytes</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/20 text-rose-900 dark:text-rose-200">
            
            {/* Header & Location */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-rose-900 dark:text-rose-200">
                    Invalid JSON Syntax
                  </h4>
                  <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                    {analysis.friendlyMessage}
                  </p>
                </div>
              </div>

              {analysis.location && (
                <div className="px-2.5 py-1 rounded-md bg-rose-100 dark:bg-rose-900/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 font-mono text-xs shrink-0 font-medium">
                  Line {analysis.location.line} · Column {analysis.location.column}
                </div>
              )}
            </div>

            {/* Visual Error Pointer Snippet */}
            {analysis.snippet && (
              <div className="mt-1 p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                <div className="text-slate-500 select-none text-[10px] uppercase mb-1">
                  Line {analysis.snippet.lineIndex}:
                </div>
                <div className="text-rose-300 whitespace-pre">
                  {analysis.snippet.lineText || ' '}
                </div>
                <div className="text-rose-400 font-bold whitespace-pre">
                  {analysis.snippet.visualPointer}
                </div>
              </div>
            )}

            {/* Proposed Safe Fix Banner */}
            {analysis.suggestedFix && (
              <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-rose-200/80 dark:border-rose-900/40">
                <div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Suggested Fix: {analysis.suggestedFix.title}
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                    {analysis.suggestedFix.description}
                  </p>
                </div>

                <button
                  id="apply-autofix-btn"
                  onClick={handleApplyFix}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors shrink-0"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Apply Fix</span>
                </button>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Main Code Editor */}
      <CodeEditor
        id="json-error-finder-input"
        label="JSON Document"
        value={jsonText}
        onChange={setJsonText}
        errorLine={!analysis.isValid ? analysis.location?.line : undefined}
        errorColumn={!analysis.isValid ? analysis.location?.column : undefined}
        placeholder="Paste your JSON here to detect errors..."
        heightClass="h-96 sm:h-[480px]"
        badge={
          analysis.isValid ? (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-medium">
              VALID
            </span>
          ) : (
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-medium">
              ERROR AT L{analysis.location?.line || 1}:C{analysis.location?.column || 1}
            </span>
          )
        }
      />

    </div>
  );
};
