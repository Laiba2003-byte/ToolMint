import React, { useRef, useEffect } from 'react';
import { Copy, Trash2, Clipboard, Sparkles, Check, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface CodeEditorProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  errorLine?: number;
  errorColumn?: number;
  highlightLine?: number;
  label?: string;
  actions?: React.ReactNode;
  heightClass?: string;
  badge?: React.ReactNode;
  statusText?: string;
  showLineNumbers?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  id,
  value,
  onChange,
  placeholder = 'Paste or type code here...',
  readOnly = false,
  errorLine,
  errorColumn,
  highlightLine,
  label,
  actions,
  heightClass = 'h-96 sm:h-[480px]',
  badge,
  statusText,
  showLineNumbers = true,
  onKeyDown
}) => {
  const { success, error } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = value.split('\n');
  const lineCount = Math.max(lines.length, 1);
  const charCount = value.length;

  // Sync line numbers scrolling with textarea
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Handle Tab key indentation
  const handleKeyDownInternal = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }

    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      success('Copied to clipboard');
    } catch {
      error('Failed to copy to clipboard');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      onChange(text);
      success('Pasted from clipboard');
    } catch {
      error('Clipboard access denied. Please use Ctrl/Cmd+V');
    }
  };

  const handleClear = () => {
    onChange('');
    textareaRef.current?.focus();
  };

  return (
    <div 
      id={`${id}-wrapper`}
      className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs overflow-hidden transition-colors"
    >
      {/* Editor Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2.5">
          {label && (
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {label}
            </span>
          )}
          {badge}
        </div>

        <div className="flex items-center gap-1.5">
          {actions}

          {!readOnly && (
            <button
              id={`${id}-paste-btn`}
              onClick={handlePaste}
              className="p-1.5 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              title="Paste from clipboard"
              aria-label="Paste from clipboard"
            >
              <Clipboard className="w-3.5 h-3.5" />
            </button>
          )}

          {value && (
            <button
              id={`${id}-copy-btn`}
              onClick={handleCopy}
              className="p-1.5 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              title="Copy to clipboard"
              aria-label="Copy to clipboard"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}

          {!readOnly && value && (
            <button
              id={`${id}-clear-btn`}
              onClick={handleClear}
              className="p-1.5 rounded-md hover:bg-rose-100 dark:hover:bg-rose-950/50 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              title="Clear input"
              aria-label="Clear input"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Editor Body */}
      <div className={`relative flex ${heightClass} bg-slate-50/30 dark:bg-slate-950/60`}>
        
        {/* Line Numbers Column */}
        {showLineNumbers && (
          <div
            ref={lineNumbersRef}
            className="w-11 sm:w-12 shrink-0 py-3 select-none text-right font-mono text-[11px] text-slate-400 dark:text-slate-600 bg-slate-100/40 dark:bg-slate-950/40 border-r border-slate-200/60 dark:border-slate-800/60 overflow-hidden leading-5"
            aria-hidden="true"
          >
            {Array.from({ length: lineCount }).map((_, i) => {
              const lineNum = i + 1;
              const isError = errorLine === lineNum;
              const isHighlight = highlightLine === lineNum;

              return (
                <div 
                  key={lineNum} 
                  className={`pr-2.5 ${
                    isError 
                      ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold' 
                      : isHighlight 
                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-medium' 
                      : ''
                  }`}
                >
                  {lineNum}
                </div>
              );
            })}
          </div>
        )}

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={e => onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDownInternal}
          placeholder={placeholder}
          readOnly={readOnly}
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className="w-full h-full p-3 font-mono text-[12.5px] leading-5 text-slate-900 dark:text-slate-100 bg-transparent resize-none focus:outline-none placeholder-slate-400/70 whitespace-pre overflow-auto"
        />
      </div>

      {/* Editor Footer / Stats Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 text-[11px] text-slate-500 dark:text-slate-400 font-mono">
        <div className="flex items-center gap-3">
          <span>{lineCount} {lineCount === 1 ? 'line' : 'lines'}</span>
          <span>·</span>
          <span>{charCount.toLocaleString()} {charCount === 1 ? 'char' : 'chars'}</span>
        </div>

        {statusText && (
          <div className="truncate text-slate-500 dark:text-slate-400">
            {statusText}
          </div>
        )}
      </div>
    </div>
  );
};
