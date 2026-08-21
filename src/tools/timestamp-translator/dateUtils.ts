import { DetectedTimeFormat, TimestampTranslationResult, TimezoneInfo } from '../../types/timestamp';

/**
 * Intelligent timestamp and date string parser with auto-format detection
 */
export function parseAndTranslateTimestamp(input: string): TimestampTranslationResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      isValid: false,
      rawInput: '',
      detectedFormat: 'unknown',
      formatDescription: 'Please enter a timestamp or date string',
      dateObj: null,
      unixSeconds: 0,
      unixMilliseconds: 0,
      iso8601: '',
      utcString: '',
      localString: '',
      relativeTime: '',
      dayOfWeek: '',
      isLeapYear: false,
      dayOfYear: 0,
      timezoneOffsetName: ''
    };
  }

  let date: Date | null = null;
  let detectedFormat: DetectedTimeFormat = 'unknown';
  let formatDescription = '';

  // 1. Check if purely numeric
  if (/^-?\d+$/.test(trimmed)) {
    const num = parseInt(trimmed, 10);
    const len = trimmed.replace(/^-/, '').length;

    if (len <= 10) {
      // Unix Seconds (e.g. 1787315400)
      date = new Date(num * 1000);
      detectedFormat = 'unix-seconds';
      formatDescription = 'Unix Timestamp (Seconds since Unix Epoch: Jan 1, 1970)';
    } else if (len <= 13) {
      // Unix Milliseconds (e.g. 1787315400000)
      date = new Date(num);
      detectedFormat = 'unix-milliseconds';
      formatDescription = 'Unix Timestamp (Milliseconds)';
    } else if (len <= 16) {
      // Microseconds
      date = new Date(Math.floor(num / 1000));
      detectedFormat = 'unix-microseconds';
      formatDescription = 'Unix Timestamp (Microseconds — scaled to ms)';
    } else {
      date = new Date(num);
      detectedFormat = 'unknown';
      formatDescription = 'Numeric timestamp';
    }
  } else {
    // 2. Check ISO 8601 (e.g. 2026-08-21T09:30:00Z)
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(trimmed)) {
      const parsed = Date.parse(trimmed);
      if (!isNaN(parsed)) {
        date = new Date(parsed);
        detectedFormat = 'iso-8601';
        formatDescription = 'ISO 8601 Extended Datetime String';
      }
    }

    // 3. Check SQL Datetime (e.g. 2026-08-21 09:30:00)
    if (!date && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(trimmed)) {
      const parsed = Date.parse(trimmed.replace(' ', 'T'));
      if (!isNaN(parsed)) {
        date = new Date(parsed);
        detectedFormat = 'sql-datetime';
        formatDescription = 'SQL / Standard Datetime String';
      }
    }

    // 4. Fallback: standard Date.parse
    if (!date) {
      const parsed = Date.parse(trimmed);
      if (!isNaN(parsed)) {
        date = new Date(parsed);
        detectedFormat = 'date-string';
        formatDescription = 'Human Date / Time String';
      }
    }
  }

  if (!date || isNaN(date.getTime())) {
    return {
      isValid: false,
      rawInput: input,
      detectedFormat: 'unknown',
      formatDescription: 'Unrecognized or invalid date format',
      dateObj: null,
      unixSeconds: 0,
      unixMilliseconds: 0,
      iso8601: '',
      utcString: '',
      localString: '',
      relativeTime: '',
      dayOfWeek: '',
      isLeapYear: false,
      dayOfYear: 0,
      timezoneOffsetName: ''
    };
  }

  const unixMillis = date.getTime();
  const unixSecs = Math.floor(unixMillis / 1000);
  const isoStr = date.toISOString();
  const utcStr = date.toUTCString();
  const localStr = formatLocalDateTime(date);
  const relTime = getRelativeTime(date);
  const dayOfWeek = date.toLocaleDateString(undefined, { weekday: 'long' });
  const year = date.getFullYear();
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  const dayOfYear = calculateDayOfYear(date);
  const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return {
    isValid: true,
    rawInput: input,
    detectedFormat,
    formatDescription,
    dateObj: date,
    unixSeconds: unixSecs,
    unixMilliseconds: unixMillis,
    iso8601: isoStr,
    utcString: utcStr,
    localString: localStr,
    relativeTime: relTime,
    dayOfWeek,
    isLeapYear: isLeap,
    dayOfYear,
    timezoneOffsetName: tzName
  };
}

export function formatLocalDateTime(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  }).format(date);
}

export function formatInTimezone(date: Date, timeZone: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      timeZone,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

export function getRelativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = date.getTime() - now;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHours = Math.round(diffMin / 60);
  const diffDays = Math.round(diffHours / 24);

  if (Math.abs(diffSec) < 10) return 'just now';

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second');
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
  if (Math.abs(diffHours) < 24) return rtf.format(diffHours, 'hour');
  if (Math.abs(diffDays) < 30) return rtf.format(diffDays, 'day');
  if (Math.abs(diffDays) < 365) return rtf.format(Math.round(diffDays / 30), 'month');
  return rtf.format(Math.round(diffDays / 365), 'year');
}

function calculateDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export const COMMON_TIMEZONES: { id: string; label: string }[] = [
  { id: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { id: 'America/New_York', label: 'New York (Eastern Time / EDT/EST)' },
  { id: 'America/Chicago', label: 'Chicago (Central Time / CDT/CST)' },
  { id: 'America/Denver', label: 'Denver (Mountain Time / MDT/MST)' },
  { id: 'America/Los_Angeles', label: 'Los Angeles / San Francisco (Pacific / PDT/PST)' },
  { id: 'Europe/London', label: 'London (GMT / BST)' },
  { id: 'Europe/Paris', label: 'Paris / Berlin / Rome (CET / CEST)' },
  { id: 'Asia/Karachi', label: 'Pakistan (Asia/Karachi / PKT)' },
  { id: 'Asia/Dubai', label: 'Dubai / UAE (GST)' },
  { id: 'Asia/Kolkata', label: 'India (IST)' },
  { id: 'Asia/Singapore', label: 'Singapore (SGT)' },
  { id: 'Asia/Tokyo', label: 'Tokyo / Japan (JST)' },
  { id: 'Australia/Sydney', label: 'Sydney / Melbourne (AEST / AEDT)' },
  { id: 'Pacific/Auckland', label: 'Auckland / New Zealand (NZST / NZDT)' }
];
