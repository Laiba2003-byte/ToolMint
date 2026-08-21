import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Layers, 
  Sparkles, 
  BookOpen, 
  ListOrdered,
  HelpCircle,
  Hash,
  Terminal
} from 'lucide-react';
import { RegexFlags, RegexMatchItem } from '../../types/regex';
import { explainRegexPattern } from './regexExplainer';
import { REGEX_SAMPLES } from './samples';
import { useToast } from '../../context/ToastContext';

export const RegexPlayground: React.FC = () => {
  const [pattern, setPattern] = useState<string>(() => REGEX_SAMPLES[0].pattern);
  const [flags, setFlags] = useState<RegexFlags>({
    g: true,
    i: false,
    m: false,
    s: false,
    u: false
  });
  const [testText, setTestText] = useState<string>(() => REGEX_SAMPLES[0].testString);
  const [activeTab, setActiveTab] = useState<'matches' | 'explanation'>('matches');

  const { success, error } = useToast();

  // Combine flag string
  const flagString = useMemo(() => {
    let s = '';
    if (flags.g) s += 'g';
    if (flags.i) s += 'i';
    if (flags.m) s += 'm';
    if (flags.s) s += 's';
    if (flags.u) s += 'u';
    return s;
  }, [flags]);

  // Compile regex & extract matches safely
  const { regexObj, regexError, matches } = useMemo(() => {
    if (!pattern) {
      return { regexObj: null, regexError: null, matches: [] };
    }

    try {
      const reg = new RegExp(pattern, flagString);
      const extractedMatches: RegexMatchItem[] = [];

      if (flags.g) {
        let match: RegExpExecArray | null;
        let count = 0;
        const maxMatches = 500; // safety ceiling for catastrophic backtracking

        while ((match = reg.exec(testText)) !== null && count < maxMatches) {
          count++;
          const groups = [];
          if (match.length > 1) {
            for (let i = 1; i < match.length; i++) {
              groups.push({
                index: i,
                value: match[i] ?? '',
                start: match.index,
                end: match.index + (match[i]?.length || 0)
              });
            }
          }

          extractedMatches.push({
            index: match.index,
            matchNumber: count,
            fullMatch: match[0],
            start: match.index,
            end: match.index + match[0].length,
            groups
          });

          // Prevent zero-length infinite loops (e.g. /^/)
          if (match[0].length === 0) {
            reg.lastIndex++;
          }
        }
      } else {
        const match = reg.exec(testText);
        if (match) {
          const groups = [];
          if (match.length > 1) {
            for (let i = 1; i < match.length; i++) {
              groups.push({
                index: i,
                value: match[i] ?? '',
                start: match.index,
                end: match.index + (match[i]?.length || 0)
              });
            }
          }
          extractedMatches.push({
            index: match.index,
            matchNumber: 1,
            fullMatch: match[0],
            start: match.index,
            end: match.index + match[0].length,
            groups
          });
        }
      }

      return { regexObj: reg, regexError: null, matches: extractedMatches };
    } catch (err: unknown) {
      return {
        regexObj: null,
        regexError: err instanceof Error ? err.message : String(err),
        matches: []
      };
    }
  }, [pattern, flagString, testText, flags.g]);

  const explanations = useMemo(() => explainRegexPattern(pattern), [pattern]);

  // Generate highlighted text segments
  const highlightedSegments = useMemo(() => {
    if (!matches.length || !testText) {
      return [{ text: testText, isMatch: false, matchNum: 0 }];
    }

    const segments: Array<{ text: string; isMatch: boolean; matchNum: number }> = [];
    let lastIndex = 0;

    matches.forEach(m => {
      if (m.start > lastIndex) {
        segments.push({
          text: testText.slice(lastIndex, m.start),
          isMatch: false,
          matchNum: 0
        });
      }
      segments.push({
        text: testText.slice(m.start, m.end),
        isMatch: true,
        matchNum: m.matchNumber
      });
      lastIndex = m.end;
    });

    if (lastIndex < testText.length) {
      segments.push({
        text: testText.slice(lastIndex),
        isMatch: false,
        matchNum: 0
      });
    }

    return segments;
  }, [matches, testText]);

  const toggleFlag = (flagKey: keyof RegexFlags) => {
    setFlags(prev => ({ ...prev, [flagKey]: !prev[flagKey] }));
  };

  const handleLoadSample = (sampleId: string) => {
    const s = REGEX_SAMPLES.find(item => item.id === sampleId);
    if (s) {
      setPattern(s.pattern);
      setTestText(s.testString);
      setFlags({
        g: s.flags.includes('g'),
        i: s.flags.includes('i'),
        m: s.flags.includes('m'),
        s: s.flags.includes('s'),
        u: s.flags.includes('u')
      });
      success(`Loaded ${s.name} sample`);
    }
  };

  const handleCopyPattern = async () => {
    if (!pattern) return;
    try {
      await navigator.clipboard.writeText(`/${pattern}/${flagString}`);
      success('Copied full regex literal');
    } catch {
      error('Failed to copy');
    }
  };

  return (
    <div id="regex-playground-tool" className="flex flex-col gap-6">
      
      {/* Samples Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">
            Common Patterns:
          </span>
          {REGEX_SAMPLES.map(sample => (
            <button
              key={sample.id}
              id={`regex-sample-${sample.id}`}
              onClick={() => handleLoadSample(sample.id)}
              className="px-2.5 py-1 text-xs rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs font-mono"
            >
              {sample.name}
            </button>
          ))}
        </div>
      </div>

      {/* Pattern Input & Flags Row */}
      <div className="flex flex-col gap-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center justify-between">
          <label htmlFor="regex-pattern-input" className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">/</span>
            <span>Regular Expression Pattern</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">/{flagString}</span>
          </label>

          <button
            id="copy-regex-literal-btn"
            onClick={handleCopyPattern}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <Copy className="w-3 h-3" />
            <span>Copy Literal</span>
          </button>
        </div>

        {/* Pattern bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 flex items-center rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 focus-within:ring-2 focus-within:ring-emerald-500">
            <span className="text-slate-400 font-mono text-sm select-none mr-2">/</span>
            <input
              id="regex-pattern-input"
              type="text"
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              placeholder="e.g. [\w.-]+@[\w.-]+\.\w+"
              className="w-full bg-transparent font-mono text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              spellCheck="false"
            />
            <span className="text-slate-400 font-mono text-sm select-none ml-2">/</span>
          </div>

          {/* Flag Toggle Pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-lg border border-slate-200 dark:border-slate-700/60 self-start sm:self-auto">
            {(['g', 'i', 'm', 's', 'u'] as const).map(flag => {
              const active = flags[flag];
              const descriptions: Record<string, string> = {
                g: 'Global: match all occurrences',
                i: 'Insensitive: ignore case',
                m: 'Multiline: ^ and $ match start/end of line',
                s: 'DotAll: . matches newlines',
                u: 'Unicode: full unicode handling'
              };

              return (
                <button
                  key={flag}
                  id={`flag-btn-${flag}`}
                  onClick={() => toggleFlag(flag)}
                  title={`${flag.toUpperCase()} — ${descriptions[flag]}`}
                  className={`w-7 h-7 rounded-md font-mono text-xs font-semibold transition-colors flex items-center justify-center ${
                    active
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {flag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Error notification if regex syntax is invalid */}
        {regexError && (
          <div className="mt-2 p-2.5 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{regexError}</span>
          </div>
        )}
      </div>

      {/* Main Workspace: Left Editor + Right Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Test string editor & Live preview */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          
          {/* Synchronized Live Highlighting Preview */}
          <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="px-3.5 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span>Match Highlights Preview</span>
                <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold ${
                  matches.length > 0
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {matches.length} {matches.length === 1 ? 'match' : 'matches'}
                </span>
              </span>
            </div>

            <div className="p-3.5 font-mono text-[12.5px] leading-6 min-h-[140px] max-h-56 overflow-y-auto whitespace-pre-wrap break-all bg-slate-950 text-slate-200 border-b border-slate-800 select-text">
              {highlightedSegments.map((seg, idx) => (
                seg.isMatch ? (
                  <mark
                    key={idx}
                    className="bg-emerald-500/30 text-emerald-300 font-semibold px-0.5 rounded border-b border-emerald-400"
                    title={`Match #${seg.matchNum}`}
                  >
                    {seg.text}
                  </mark>
                ) : (
                  <span key={idx} className="text-slate-300">{seg.text}</span>
                )
              ))}
            </div>

            {/* Test Text Input Area */}
            <div className="p-3 bg-slate-50/50 dark:bg-slate-900/50">
              <label htmlFor="regex-test-text" className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1.5">
                Editable Test String:
              </label>
              <textarea
                id="regex-test-text"
                value={testText}
                onChange={e => setTestText(e.target.value)}
                placeholder="Type or paste your test text here..."
                rows={6}
                spellCheck="false"
                className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-slate-100 leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

        </div>

        {/* Right column: Matches Inspector & Syntax Explanation */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            
            {/* Inspector Tabs */}
            <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900">
              <button
                id="tab-matches-btn"
                onClick={() => setActiveTab('matches')}
                className={`flex-1 py-2.5 text-xs font-medium text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'matches'
                    ? 'border-emerald-500 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Matches ({matches.length})</span>
              </button>

              <button
                id="tab-explanation-btn"
                onClick={() => setActiveTab('explanation')}
                className={`flex-1 py-2.5 text-xs font-medium text-center border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                  activeTab === 'explanation'
                    ? 'border-emerald-500 text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Syntax Breakdown ({explanations.length})</span>
              </button>
            </div>

            {/* Tab Body: Matches */}
            {activeTab === 'matches' && (
              <div className="p-3 max-h-[460px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {matches.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-slate-400" />
                    <span>No matches found in the current test string.</span>
                  </div>
                ) : (
                  matches.map(m => (
                    <div key={m.matchNumber} className="py-2.5 first:pt-0 last:pb-0 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-emerald-700 dark:text-emerald-400 font-mono text-[11px]">
                          Match #{m.matchNumber}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          Index {m.start}–{m.end} · length {m.fullMatch.length}
                        </span>
                      </div>

                      <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-950 font-mono text-xs text-slate-900 dark:text-slate-100 break-all select-all border border-slate-200/60 dark:border-slate-800/60">
                        {m.fullMatch}
                      </div>

                      {/* Capture groups if any */}
                      {m.groups.length > 0 && (
                        <div className="pl-3 mt-1 flex flex-col gap-1 border-l-2 border-emerald-400/40">
                          {m.groups.map(grp => (
                            <div key={grp.index} className="text-[11px] flex items-baseline gap-2 font-mono">
                              <span className="text-slate-500 dark:text-slate-400 shrink-0">Group {grp.index}:</span>
                              <span className="text-slate-800 dark:text-slate-200 bg-slate-200/50 dark:bg-slate-800/60 px-1.5 py-0.5 rounded break-all">
                                {grp.value || '<empty>'}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab Body: Deterministic Token Explanations */}
            {activeTab === 'explanation' && (
              <div className="p-3 max-h-[460px] overflow-y-auto flex flex-col gap-2.5">
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                  Deterministic token explanation for the current regular expression:
                </div>

                {explanations.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    Enter regex tokens above to see syntax breakdown.
                  </div>
                ) : (
                  explanations.map((exp, i) => (
                    <div 
                      key={i} 
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex items-start gap-2.5"
                    >
                      <div className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold shrink-0 border border-emerald-200 dark:border-emerald-800/50">
                        {exp.token}
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                          {exp.title}
                        </h5>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-normal">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
