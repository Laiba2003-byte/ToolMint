export type DiffType = 'added' | 'removed' | 'changed' | 'unchanged';

export interface DiffLine {
  id: string;
  type: DiffType;
  path: string;
  leftLineNumber?: number;
  rightLineNumber?: number;
  leftKey?: string;
  leftValue?: string;
  rightKey?: string;
  rightValue?: string;
  depth: number;
  isFoldable?: boolean;
  isCollapsed?: boolean;
}

export interface DiffSummary {
  added: number;
  removed: number;
  changed: number;
  unchanged: number;
  isIdentical: boolean;
}

export type DiffViewMode = 'side-by-side' | 'unified';

export interface DiffOptions {
  ignoreKeyOrder: boolean;
  collapseUnchanged: boolean;
  caseSensitive: boolean;
}
