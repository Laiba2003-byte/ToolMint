import React, { useState, useEffect, useMemo } from 'react';
import { 
  Clock, 
  Copy, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  ArrowRightLeft, 
  Calendar, 
  Globe, 
  Sparkles,
  ArrowRight,
  HelpCircle,
  Timer
} from 'lucide-react';
import { 
  parseAndTranslateTimestamp, 
  formatInTimezone, 
  COMMON_TIMEZONES 
} from './dateUtils';
import { TIMESTAMP_SAMPLES } from './samples';
import { useToast } from '../../context/ToastContext';

export const TimestampTranslator: React.FC = () => {
  const [inputVal, setInputVal] = useState<string>(() => TIMESTAMP_SAMPLES[0].value);
  const [liveNow, setLiveNow] = useState<Date>(() => new Date());

  // Timezone Converter State
  const defaultLocalTz = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
    } catch {
      return 'UTC';
    }
  }, []);

  const [fromTz, setFromTz] = useState<string>('Asia/Karachi');
  const [toTz, setToTz] = useState<string>('America/New_York');

  const { success, error } = useToast();

  // Keep live clock ticking every second
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Parse input
  const translation = useMemo(() => parseAndTranslateTimestamp(inputVal), [inputVal]);

  const handleCopy = async (text: string, label: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      success(`Copied ${label} to clipboard`);
    } catch {
      error(`Failed to copy ${label}`);
    }
  };

  const handleUseCurrentTime = () => {
    const nowSecs = Math.floor(Date.now() / 1000).toString();
    setInputVal(nowSecs);
    success('Loaded current Unix timestamp');
  };

  const handleSwapTimezones = () => {
    const temp = fromTz;
    setFromTz(toTz);
    setToTz(temp);
    success('Swapped timezones');
  };

  const convertedFromTzDate = useMemo(() => {
    const targetDate = translation.isValid && translation.dateObj ? translation.dateObj : liveNow;
    return formatInTimezone(targetDate, fromTz);
  }, [translation, liveNow, fromTz]);

  const convertedToTzDate = useMemo(() => {
    const targetDate = translation.isValid && translation.dateObj ? translation.dateObj : liveNow;
    return formatInTimezone(targetDate, toTz);
  }, [translation, liveNow, toTz]);

  return (
    <div id="timestamp-translator-tool" className="flex flex-col gap-6">
      
      {/* Live Current Time Status Bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Live Current Time (Real-Time Clock)
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
              UTC: {liveNow.toUTCString()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-start">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
            <span>{Math.floor(liveNow.getTime() / 1000)}</span>
            <button
              onClick={() => handleCopy(Math.floor(liveNow.getTime() / 1000).toString(), 'Current Seconds')}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5"
              title="Copy current Unix seconds"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>

          <button
            id="use-now-btn"
            onClick={handleUseCurrentTime}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs transition-colors"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Use Current Time</span>
          </button>
        </div>
      </div>

      {/* Main Input & Samples */}
      <div className="flex flex-col gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        
        {/* Sample Pills */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1">
            Samples:
          </span>
          {TIMESTAMP_SAMPLES.map(sample => (
            <button
              key={sample.id}
              id={`ts-sample-${sample.id}`}
              onClick={() => {
                setInputVal(sample.value);
                success(`Loaded ${sample.name}`);
              }}
              className="px-2.5 py-1 text-xs rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-2xs font-mono text-[11px]"
            >
              {sample.name}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div>
          <label htmlFor="timestamp-input" className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Timestamp / ISO 8601 / Datetime String:
          </label>
          <div className="flex items-center gap-2">
            <input
              id="timestamp-input"
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              placeholder="e.g. 1787315400, 1787315400000, 2026-08-21T09:30:00Z"
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {inputVal && (
              <button
                onClick={() => setInputVal('')}
                className="px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 text-xs transition-colors shrink-0"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Detected Format Badge */}
        {translation.isValid && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] font-medium text-slate-500">Detected format:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-mono text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {translation.formatDescription}
            </span>
          </div>
        )}

        {!translation.isValid && inputVal.trim() && (
          <div className="flex items-center gap-2 pt-1 text-xs text-rose-600 dark:text-rose-400 font-mono">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{translation.formatDescription}</span>
          </div>
        )}
      </div>

      {/* Converted Results Grid */}
      {translation.isValid && (
        <div id="timestamp-results-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Local Time */}
          <ResultCard
            label="Local Time"
            value={translation.localString}
            badge={translation.timezoneOffsetName}
            onCopy={() => handleCopy(translation.localString, 'Local Time')}
          />

          {/* Card 2: UTC */}
          <ResultCard
            label="UTC (Coordinated Universal Time)"
            value={translation.utcString}
            badge="GMT / +00:00"
            onCopy={() => handleCopy(translation.utcString, 'UTC')}
          />

          {/* Card 3: ISO 8601 */}
          <ResultCard
            label="ISO 8601 Format"
            value={translation.iso8601}
            badge="Standard"
            onCopy={() => handleCopy(translation.iso8601, 'ISO 8601')}
          />

          {/* Card 4: Relative Time */}
          <ResultCard
            label="Relative Time"
            value={translation.relativeTime}
            badge="Human"
            onCopy={() => handleCopy(translation.relativeTime, 'Relative Time')}
          />

          {/* Card 5: Unix Seconds */}
          <ResultCard
            label="Unix Epoch Seconds"
            value={translation.unixSeconds.toString()}
            badge="10 digits"
            onCopy={() => handleCopy(translation.unixSeconds.toString(), 'Unix Seconds')}
          />

          {/* Card 6: Unix Milliseconds */}
          <ResultCard
            label="Unix Epoch Milliseconds"
            value={translation.unixMilliseconds.toString()}
            badge="13 digits"
            onCopy={() => handleCopy(translation.unixMilliseconds.toString(), 'Unix Milliseconds')}
          />

        </div>
      )}

      {/* Calendar & Date Metadata */}
      {translation.isValid && (
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">Date Metadata:</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] text-slate-600 dark:text-slate-400">
            <span>Day: <strong className="text-slate-900 dark:text-slate-100">{translation.dayOfWeek}</strong></span>
            <span>·</span>
            <span>Day of Year: <strong className="text-slate-900 dark:text-slate-100">{translation.dayOfYear} / 365</strong></span>
            <span>·</span>
            <span>Leap Year: <strong className="text-slate-900 dark:text-slate-100">{translation.isLeapYear ? 'Yes' : 'No'}</strong></span>
          </div>
        </div>
      )}

      {/* Timezone Converter Widget */}
      <div id="timezone-converter-section" className="flex flex-col gap-4 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                Interactive Timezone Converter
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Converts timestamp between global timezones with automatic Daylight Saving Time (DST) calculation.
              </p>
            </div>
          </div>

          <button
            onClick={handleSwapTimezones}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Swap timezones"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Swap</span>
          </button>
        </div>

        {/* Timezone Pickers & Realtime Displays */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Source Timezone */}
          <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col gap-2">
            <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              From Timezone:
            </label>
            <select
              value={fromTz}
              onChange={e => setFromTz(e.target.value)}
              className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {COMMON_TIMEZONES.map(tz => (
                <option key={tz.id} value={tz.id}>{tz.label}</option>
              ))}
            </select>

            <div className="mt-2 flex items-center justify-between p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="font-mono text-xs text-slate-900 dark:text-slate-100">
                {convertedFromTzDate}
              </span>
              <button
                onClick={() => handleCopy(convertedFromTzDate, fromTz)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
                title="Copy datetime"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Destination Timezone */}
          <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col gap-2">
            <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              To Timezone:
            </label>
            <select
              value={toTz}
              onChange={e => setToTz(e.target.value)}
              className="w-full p-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {COMMON_TIMEZONES.map(tz => (
                <option key={tz.id} value={tz.id}>{tz.label}</option>
              ))}
            </select>

            <div className="mt-2 flex items-center justify-between p-2 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                {convertedToTzDate}
              </span>
              <button
                onClick={() => handleCopy(convertedToTzDate, toTz)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1"
                title="Copy datetime"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

interface ResultCardProps {
  label: string;
  value: string;
  badge?: string;
  onCopy: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ label, value, badge, onCopy }) => {
  return (
    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {label}
        </span>
        {badge && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 break-all select-all">
          {value}
        </span>
        <button
          onClick={onCopy}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          title="Copy value"
          aria-label={`Copy ${label}`}
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
