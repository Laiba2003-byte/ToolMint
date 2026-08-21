import { DiffLine, DiffSummary, DiffOptions, DiffType } from '../../types/json-diff';

/**
 * Normalizes and parses JSON, optionally sorting object keys recursively
 */
export function normalizeJson(jsonStr: string, sortKeys: boolean): { parsed: unknown; error?: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    if (sortKeys) {
      return { parsed: sortObjectKeys(parsed) };
    }
    return { parsed };
  } catch (err) {
    return { parsed: null, error: err instanceof Error ? err.message : String(err) };
  }
}

function sortObjectKeys(obj: unknown): unknown {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sortObjectKeys(item));
  }
  const sorted: Record<string, unknown> = {};
  const keys = Object.keys(obj as Record<string, unknown>).sort();
  for (const k of keys) {
    sorted[k] = sortObjectKeys((obj as Record<string, unknown>)[k]);
  }
  return sorted;
}

/**
 * Computes deep structural differences between original and modified JSON objects
 */
export function computeJsonDiff(
  originalObj: unknown,
  modifiedObj: unknown,
  options: DiffOptions
): { lines: DiffLine[]; summary: DiffSummary } {
  const lines: DiffLine[] = [];
  const summary: DiffSummary = {
    added: 0,
    removed: 0,
    changed: 0,
    unchanged: 0,
    isIdentical: true
  };

  let lineCounter = 1;

  function diffRecursive(
    left: unknown,
    right: unknown,
    path: string,
    keyName: string | undefined,
    depth: number
  ) {
    const leftType = getType(left);
    const rightType = getType(right);

    // Case 1: Both values are undefined/omitted
    if (left === undefined && right === undefined) return;

    // Case 2: Left exists, Right omitted -> REMOVED
    if (left !== undefined && right === undefined) {
      summary.removed++;
      summary.isIdentical = false;
      lines.push({
        id: `diff-${lineCounter++}`,
        type: 'removed',
        path,
        leftKey: keyName,
        leftValue: formatValue(left),
        depth
      });
      return;
    }

    // Case 3: Left omitted, Right exists -> ADDED
    if (left === undefined && right !== undefined) {
      summary.added++;
      summary.isIdentical = false;
      lines.push({
        id: `diff-${lineCounter++}`,
        type: 'added',
        path,
        rightKey: keyName,
        rightValue: formatValue(right),
        depth
      });
      return;
    }

    // Case 4: Types differ -> CHANGED
    if (leftType !== rightType) {
      summary.changed++;
      summary.isIdentical = false;
      lines.push({
        id: `diff-${lineCounter++}`,
        type: 'changed',
        path,
        leftKey: keyName,
        leftValue: formatValue(left),
        rightKey: keyName,
        rightValue: formatValue(right),
        depth
      });
      return;
    }

    // Case 5: Both are Objects
    if (leftType === 'object' && left !== null && right !== null) {
      const leftObj = left as Record<string, unknown>;
      const rightObj = right as Record<string, unknown>;
      
      const allKeys = Array.from(
        new Set([...Object.keys(leftObj), ...Object.keys(rightObj)])
      );
      
      if (options.ignoreKeyOrder) {
        allKeys.sort();
      }

      // Check if objects are deeply equal
      const areObjectsEqual = JSON.stringify(leftObj) === JSON.stringify(rightObj);
      if (areObjectsEqual) {
        summary.unchanged++;
        if (!options.collapseUnchanged) {
          lines.push({
            id: `diff-${lineCounter++}`,
            type: 'unchanged',
            path,
            leftKey: keyName,
            leftValue: formatValue(left),
            rightKey: keyName,
            rightValue: formatValue(right),
            depth
          });
        }
        return;
      }

      // Record object open line
      lines.push({
        id: `diff-${lineCounter++}`,
        type: 'unchanged',
        path,
        leftKey: keyName,
        leftValue: '{',
        rightKey: keyName,
        rightValue: '{',
        depth
      });

      for (const k of allKeys) {
        const subPath = path ? `${path}.${k}` : k;
        diffRecursive(leftObj[k], rightObj[k], subPath, k, depth + 1);
      }

      // Record object close line
      lines.push({
        id: `diff-${lineCounter++}`,
        type: 'unchanged',
        path,
        leftValue: '}',
        rightValue: '}',
        depth
      });
      return;
    }

    // Case 6: Both are Arrays
    if (leftType === 'array') {
      const leftArr = left as unknown[];
      const rightArr = right as unknown[];
      const maxLen = Math.max(leftArr.length, rightArr.length);

      const areArraysEqual = JSON.stringify(leftArr) === JSON.stringify(rightArr);
      if (areArraysEqual) {
        summary.unchanged++;
        if (!options.collapseUnchanged) {
          lines.push({
            id: `diff-${lineCounter++}`,
            type: 'unchanged',
            path,
            leftKey: keyName,
            leftValue: formatValue(left),
            rightKey: keyName,
            rightValue: formatValue(right),
            depth
          });
        }
        return;
      }

      lines.push({
        id: `diff-${lineCounter++}`,
        type: 'unchanged',
        path,
        leftKey: keyName,
        leftValue: '[',
        rightKey: keyName,
        rightValue: '[',
        depth
      });

      for (let i = 0; i < maxLen; i++) {
        const subPath = `${path}[${i}]`;
        diffRecursive(leftArr[i], rightArr[i], subPath, `[${i}]`, depth + 1);
      }

      lines.push({
        id: `diff-${lineCounter++}`,
        type: 'unchanged',
        path,
        leftValue: ']',
        rightValue: ']',
        depth
      });
      return;
    }

    // Case 7: Primitive values
    if (left === right) {
      summary.unchanged++;
      if (!options.collapseUnchanged) {
        lines.push({
          id: `diff-${lineCounter++}`,
          type: 'unchanged',
          path,
          leftKey: keyName,
          leftValue: formatValue(left),
          rightKey: keyName,
          rightValue: formatValue(right),
          depth
        });
      }
    } else {
      summary.changed++;
      summary.isIdentical = false;
      lines.push({
        id: `diff-${lineCounter++}`,
        type: 'changed',
        path,
        leftKey: keyName,
        leftValue: formatValue(left),
        rightKey: keyName,
        rightValue: formatValue(right),
        depth
      });
    }
  }

  diffRecursive(originalObj, modifiedObj, '', undefined, 0);

  return { lines, summary };
}

function getType(val: unknown): string {
  if (val === null) return 'null';
  if (Array.isArray(val)) return 'array';
  return typeof val;
}

function formatValue(val: unknown): string {
  if (val === undefined) return '';
  if (typeof val === 'string') return `"${val}"`;
  if (typeof val === 'object' && val !== null) {
    try {
      return JSON.stringify(val);
    } catch {
      return String(val);
    }
  }
  return String(val);
}

/**
 * Generates a textual patch / diff suitable for copying
 */
export function generateDiffText(lines: DiffLine[]): string {
  return lines.map(line => {
    const indent = '  '.repeat(line.depth);
    if (line.type === 'added') {
      return `+ ${indent}${line.rightKey ? `${line.rightKey}: ` : ''}${line.rightValue}`;
    }
    if (line.type === 'removed') {
      return `- ${indent}${line.leftKey ? `${line.leftKey}: ` : ''}${line.leftValue}`;
    }
    if (line.type === 'changed') {
      return `~ ${indent}${line.leftKey || line.rightKey}: ${line.leftValue} -> ${line.rightValue}`;
    }
    return `  ${indent}${line.leftKey ? `${line.leftKey}: ` : ''}${line.leftValue || line.rightValue}`;
  }).join('\n');
}
