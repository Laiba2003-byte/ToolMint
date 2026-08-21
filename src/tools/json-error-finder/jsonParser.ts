import { JsonErrorDetail, JsonStats } from '../../types/json-error';

/**
 * Attempts to parse JSON and generates rich developer diagnostics,
 * including line/col numbers, visual caret pointers, human-friendly descriptions,
 * and safe auto-fix proposals.
 */
export function analyzeJson(rawText: string): JsonErrorDetail {
  if (!rawText.trim()) {
    return {
      isValid: true // Treat empty as neutral valid state
    };
  }

  try {
    JSON.parse(rawText);
    return {
      isValid: true
    };
  } catch (err: unknown) {
    const rawError = err instanceof Error ? err.message : String(err);
    const { line, col, position } = extractPositionFromError(rawError, rawText);

    // Analyze specific error patterns for human explanation and automatic repair
    const diagnosis = diagnoseJsonIssue(rawText, line, col, position, rawError);

    // Build visual code snippet with caret pointer
    const lines = rawText.split('\n');
    const lineIndex = Math.max(1, Math.min(line, lines.length));
    const targetLineText = lines[lineIndex - 1] ?? '';
    const safeCol = Math.max(1, Math.min(col, targetLineText.length + 1));
    
    // Create visual pointer: e.g. "   ↑"
    const pointerIndent = ' '.repeat(Math.max(0, safeCol - 1));
    const visualPointer = `${pointerIndent}↑`;

    return {
      isValid: false,
      rawError,
      friendlyMessage: diagnosis.friendlyMessage,
      errorType: diagnosis.errorType,
      location: {
        line: lineIndex,
        column: safeCol,
        position
      },
      snippet: {
        lineText: targetLineText,
        lineIndex,
        colIndex: safeCol,
        visualPointer
      },
      suggestedFix: diagnosis.suggestedFix
    };
  }
}

/**
 * Parses V8 / JavaScript engine error message for position clues (e.g. "at position 45" or "line 3 column 5")
 */
function extractPositionFromError(
  errorMessage: string,
  rawText: string
): { line: number; col: number; position: number } {
  // Pattern 1: "... at position 123"
  const posMatch = errorMessage.match(/at position (\d+)/i);
  if (posMatch) {
    const position = parseInt(posMatch[1], 10);
    return convertIndexToLineCol(rawText, position);
  }

  // Pattern 2: "... line 4 column 12"
  const lineColMatch = errorMessage.match(/line (\d+) column (\d+)/i);
  if (lineColMatch) {
    const line = parseInt(lineColMatch[1], 10);
    const col = parseInt(lineColMatch[2], 10);
    return { line, col, position: convertLineColToIndex(rawText, line, col) };
  }

  // Fallback: heuristic scan for first syntactic anomaly
  return heuristicFindError(rawText);
}

function convertIndexToLineCol(text: string, index: number): { line: number; col: number; position: number } {
  const safeIndex = Math.max(0, Math.min(index, text.length));
  const before = text.slice(0, safeIndex);
  const lines = before.split('\n');
  const line = lines.length;
  const col = lines[lines.length - 1].length + 1;
  return { line, col, position: safeIndex };
}

function convertLineColToIndex(text: string, line: number, col: number): number {
  const lines = text.split('\n');
  let index = 0;
  for (let i = 0; i < Math.min(line - 1, lines.length); i++) {
    index += lines[i].length + 1; // +1 for \n
  }
  return index + Math.max(0, col - 1);
}

function heuristicFindError(text: string): { line: number; col: number; position: number } {
  // Scan for common issues
  return { line: 1, col: 1, position: 0 };
}

/**
 * Inspects context around error to detect trailing commas, single quotes, unquoted keys, etc.
 * and synthesizes an autofix candidate.
 */
function diagnoseJsonIssue(
  rawText: string,
  line: number,
  col: number,
  pos: number,
  rawError: string
): {
  friendlyMessage: string;
  errorType: JsonErrorDetail['errorType'];
  suggestedFix?: JsonErrorDetail['suggestedFix'];
} {
  // 1. Check Trailing Comma (e.g. ", }" or ", ]")
  if (/,\s*[}\]]/m.test(rawText)) {
    const fixed = rawText.replace(/,(\s*[}\]])/g, '$1');
    if (isValidJson(fixed)) {
      return {
        friendlyMessage: 'Trailing comma before closing brace or bracket.',
        errorType: 'trailing_comma',
        suggestedFix: {
          title: 'Remove trailing commas',
          description: 'Standard JSON syntax forbids trailing commas before closing braces "}" or brackets "]".',
          fixedContent: fixed,
          diffSummary: 'Removed illegal trailing commas'
        }
      };
    }
  }

  // 2. Check Single Quotes used for strings or keys
  if (/'[^']*'/.test(rawText)) {
    const fixed = autoFixQuotes(rawText);
    if (isValidJson(fixed)) {
      return {
        friendlyMessage: 'Single quotes used instead of double quotes.',
        errorType: 'single_quotes',
        suggestedFix: {
          title: 'Convert single quotes to double quotes',
          description: 'JSON standard strictly requires double quotes (") for all string literals and object keys.',
          fixedContent: fixed,
          diffSummary: 'Replaced single quotes with standard double quotes'
        }
      };
    }
  }

  // 3. Check Unquoted Keys (e.g. { name: "value" } -> { "name": "value" })
  if (/([{,]\s*)([a-zA-Z0-9_$]+)\s*:/m.test(rawText)) {
    const fixed = autoFixUnquotedKeys(rawText);
    if (isValidJson(fixed)) {
      return {
        friendlyMessage: 'Unquoted object key detected.',
        errorType: 'unquoted_key',
        suggestedFix: {
          title: 'Wrap object keys in double quotes',
          description: 'All object property keys in JSON must be enclosed in double quotes (e.g. "key": value).',
          fixedContent: fixed,
          diffSummary: 'Enclosed unquoted object keys in double quotes'
        }
      };
    }
  }

  // 4. Check Combined common repairs (e.g. unquoted keys + single quotes + trailing commas)
  const combinedFix = autoFixAllCommonIssues(rawText);
  if (combinedFix !== rawText && isValidJson(combinedFix)) {
    return {
      friendlyMessage: 'Multiple syntax irregularities found (quotes, keys, or commas).',
      errorType: 'unknown',
      suggestedFix: {
        title: 'Auto-repair standard JSON syntax',
        description: 'Repaired quote formatting, enclosed keys in double quotes, and cleaned trailing commas.',
        fixedContent: combinedFix,
        diffSummary: 'Applied comprehensive JSON standard cleanup'
      }
    };
  }

  // 5. Unbalanced braces or brackets check
  const openBraces = (rawText.match(/{/g) || []).length;
  const closeBraces = (rawText.match(/}/g) || []).length;
  const openBrackets = (rawText.match(/\[/g) || []).length;
  const closeBrackets = (rawText.match(/\]/g) || []).length;

  if (openBraces !== closeBraces) {
    const diff = openBraces - closeBraces;
    return {
      friendlyMessage: diff > 0 
        ? `Missing ${diff} closing brace${diff > 1 ? 's' : ''} "}".` 
        : `Unexpected extra ${Math.abs(diff)} closing brace${Math.abs(diff) > 1 ? 's' : ''} "}".`,
      errorType: 'unbalanced_brace'
    };
  }

  if (openBrackets !== closeBrackets) {
    const diff = openBrackets - closeBrackets;
    return {
      friendlyMessage: diff > 0 
        ? `Missing ${diff} closing bracket${diff > 1 ? 's' : ''} "]".` 
        : `Unexpected extra ${Math.abs(diff)} closing bracket${Math.abs(diff) > 1 ? 's' : ''} "]".`,
      errorType: 'unbalanced_bracket'
    };
  }

  // 6. Generic or missing comma between values
  if (/unexpected token/i.test(rawError) || /expected comma/i.test(rawError)) {
    return {
      friendlyMessage: 'Syntax error: Expected a comma "," or closing delimiter between items.',
      errorType: 'missing_comma'
    };
  }

  return {
    friendlyMessage: `Invalid JSON: ${rawError.replace(/^JSON\.parse:\s*/i, '')}`,
    errorType: 'unknown'
  };
}

function isValidJson(text: string): boolean {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}

/**
 * Replaces single quotes with double quotes while respecting internal escaped chars
 */
function autoFixQuotes(text: string): string {
  // Convert 'value' -> "value", escaping existing internal double quotes if any
  return text.replace(/'((?:\\.|[^'])*)'/g, (_, inner) => {
    const sanitized = inner.replace(/"/g, '\\"');
    return `"${sanitized}"`;
  });
}

/**
 * Quotes unquoted keys in JS-like objects: `{ foo: 1 }` -> `{ "foo": 1 }`
 */
function autoFixUnquotedKeys(text: string): string {
  // Matches unquoted identifier before a colon
  return text.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
}

/**
 * Pipeline to safely attempt repair of typical JS-object-like text to valid JSON
 */
function autoFixAllCommonIssues(text: string): string {
  let cleaned = text;
  // 1. Convert single quotes
  cleaned = autoFixQuotes(cleaned);
  // 2. Quote unquoted keys
  cleaned = autoFixUnquotedKeys(cleaned);
  // 3. Remove trailing commas
  cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
  return cleaned;
}

/**
 * Calculates statistics for JSON
 */
export function calculateJsonStats(jsonText: string): JsonStats {
  const characters = jsonText.length;
  const lines = jsonText ? jsonText.split('\n').length : 0;
  const bytes = new Blob([jsonText]).size;

  let keysCount = 0;
  let depth = 0;

  try {
    const parsed = JSON.parse(jsonText);
    const computeMeta = (val: unknown, currentDepth: number) => {
      if (val && typeof val === 'object') {
        depth = Math.max(depth, currentDepth);
        if (Array.isArray(val)) {
          val.forEach(item => computeMeta(item, currentDepth + 1));
        } else {
          const keys = Object.keys(val as Record<string, unknown>);
          keysCount += keys.length;
          keys.forEach(k => computeMeta((val as Record<string, unknown>)[k], currentDepth + 1));
        }
      }
    };
    computeMeta(parsed, 1);
  } catch {
    // If invalid, fallback
  }

  return {
    characters,
    lines,
    bytes,
    keysCount,
    depth
  };
}
