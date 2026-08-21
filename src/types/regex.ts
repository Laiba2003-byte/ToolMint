export interface RegexFlags {
  g: boolean; // global
  i: boolean; // case insensitive
  m: boolean; // multiline
  s: boolean; // dotAll
  u: boolean; // unicode
}

export interface RegexCaptureGroup {
  index: number;
  name?: string;
  value: string;
  start: number;
  end: number;
}

export interface RegexMatchItem {
  index: number; // match index in string
  matchNumber: number; // 1-based match sequence
  fullMatch: string;
  start: number;
  end: number;
  groups: RegexCaptureGroup[];
}

export interface RegexTokenExplanation {
  token: string;
  type: 'anchor' | 'character' | 'group' | 'quantifier' | 'lookaround' | 'flag' | 'escape' | 'class';
  title: string;
  description: string;
  example?: string;
}

export interface RegexSample {
  id: string;
  name: string;
  category: string;
  pattern: string;
  flags: string;
  testString: string;
  description: string;
}
