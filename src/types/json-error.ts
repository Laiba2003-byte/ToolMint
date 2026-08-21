export interface JsonLocation {
  line: number;
  column: number;
  position: number;
}

export interface JsonErrorDetail {
  isValid: boolean;
  rawError?: string;
  friendlyMessage?: string;
  errorType?: 'trailing_comma' | 'single_quotes' | 'unquoted_key' | 'missing_comma' | 'unbalanced_brace' | 'unbalanced_bracket' | 'invalid_number' | 'unknown';
  location?: JsonLocation;
  snippet?: {
    lineText: string;
    lineIndex: number;
    colIndex: number;
    visualPointer: string;
  };
  suggestedFix?: {
    title: string;
    description: string;
    fixedContent: string;
    diffSummary?: string;
  };
}

export interface JsonStats {
  characters: number;
  lines: number;
  bytes: number;
  keysCount: number;
  depth: number;
}
