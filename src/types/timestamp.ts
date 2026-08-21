export type DetectedTimeFormat = 
  | 'unix-seconds'
  | 'unix-milliseconds'
  | 'unix-microseconds'
  | 'iso-8601'
  | 'date-string'
  | 'sql-datetime'
  | 'rfc-2822'
  | 'unknown';

export interface TimestampTranslationResult {
  isValid: boolean;
  rawInput: string;
  detectedFormat: DetectedTimeFormat;
  formatDescription: string;
  dateObj: Date | null;
  unixSeconds: number;
  unixMilliseconds: number;
  iso8601: string;
  utcString: string;
  localString: string;
  relativeTime: string;
  dayOfWeek: string;
  isLeapYear: boolean;
  dayOfYear: number;
  timezoneOffsetName: string;
}

export interface TimezoneInfo {
  name: string; // e.g. "America/New_York"
  label: string; // e.g. "New York (UTC-5 / EDT)"
  city: string;
  region: string;
  offsetString: string;
}
