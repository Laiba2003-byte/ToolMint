import { ToolDefinition } from '../types';

export const TOOLS_REGISTRY: ToolDefinition[] = [
  {
    id: 'json-error-finder',
    name: 'JSON Error Finder',
    slug: 'json-error-finder',
    route: '/tools/json-error-finder',
    tagline: 'Find exactly where your JSON broke.',
    description: 'Pinpoint precise syntax errors with line & column markers, visual caret highlights, and safe one-click autofix suggestions.',
    category: 'JSON',
    icon: 'FileJson',
    symbol: '{ }',
    keywords: ['json', 'lint', 'syntax error', 'validator', 'fix json', 'trailing comma', 'format json', 'minify', 'repair'],
    isAvailable: true,
    status: 'active',
    seoTitle: 'JSON Error Finder — Find & Fix Invalid JSON Online | ToolMint',
    seoDescription: 'Find and fix broken JSON with exact line & column error markers, visual caret pointer, and instant one-click auto-repair. 100% private in-browser tool.',
    shortcut: '1'
  },
  {
    id: 'json-diff',
    name: 'JSON Diff',
    slug: 'json-diff',
    route: '/tools/json-diff',
    tagline: 'See exactly what changed between two JSON objects.',
    description: 'Deep recursive JSON comparison with side-by-side & unified views, structural highlights for added, removed, and changed keys, and order-insensitive diffing.',
    category: 'JSON',
    icon: 'GitCompare',
    symbol: '⇄',
    keywords: ['diff', 'compare json', 'json diff', 'semantic diff', 'side by side', 'unified diff', 'delta', 'object compare'],
    isAvailable: true,
    status: 'active',
    seoTitle: 'JSON Diff — Compare JSON Online | ToolMint',
    seoDescription: 'Compare two JSON objects with deep structural diffing, side-by-side and unified views, key sorting, and collapse unchanged sections. 100% private.',
    shortcut: '2'
  },
  {
    id: 'regex-playground',
    name: 'Regex Playground',
    slug: 'regex-playground',
    route: '/tools/regex-playground',
    tagline: 'Build, test, and understand regular expressions.',
    description: 'Live regular expression debugger with interactive flag controls, synchronized inline match highlights, capture group inspector, and deterministic syntax explanations.',
    category: 'Regex',
    icon: 'Regex',
    symbol: '.*',
    keywords: ['regex', 'regular expression', 'regex tester', 'pattern matcher', 'capture groups', 'flags', 'regex debugger', 'parse regex'],
    isAvailable: true,
    status: 'active',
    seoTitle: 'Regex Playground — Test & Debug Regular Expressions Online | ToolMint',
    seoDescription: 'Test and debug regex patterns in real-time with capture groups, live inline match highlighting, and token-by-token syntax breakdown. Runs 100% client-side.',
    shortcut: '3'
  },
  {
    id: 'timestamp',
    name: 'Timestamp Translator',
    slug: 'timestamp',
    route: '/tools/timestamp',
    tagline: 'Turn machine time into human time.',
    description: 'Auto-detect Unix seconds, milliseconds, ISO 8601, and datetime strings. Convert with live ticking clocks and interactive IANA timezone conversions.',
    category: 'Time & Date',
    icon: 'Clock',
    symbol: '🕒',
    keywords: ['timestamp', 'unix time', 'epoch', 'iso 8601', 'date converter', 'timezone', 'utc', 'dst', 'human date', 'relative time'],
    isAvailable: true,
    status: 'active',
    seoTitle: 'Timestamp Translator — Unix Epoch & ISO Time Converter | ToolMint',
    seoDescription: 'Auto-detect and convert Unix timestamps (seconds & millis), ISO 8601, and date strings. Real-time timezone conversions with automatic DST handling.',
    shortcut: '4'
  },
  // Upcoming Roadmap Tools for Future-Proof Registry
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    slug: 'jwt-decoder',
    route: '/tools/jwt-decoder',
    tagline: 'Decode & inspect JSON Web Tokens safely.',
    description: 'Decode header, payload, timestamps (issued at, expires), and verify claims client-side without sending tokens over the wire.',
    category: 'Security',
    icon: 'Key',
    symbol: 'JWT',
    keywords: ['jwt', 'token', 'decode', 'bearer', 'auth', 'claims'],
    isAvailable: false,
    status: 'upcoming',
    seoTitle: 'JWT Decoder — Inspect JSON Web Tokens | ToolMint',
    seoDescription: 'Decode and inspect JWT headers, payloads, and signatures client-side.'
  },
  {
    id: 'base64',
    name: 'Base64 & URL Encoder',
    slug: 'base64',
    route: '/tools/base64',
    tagline: 'Encode and decode Base64, Hex, & URL entities.',
    description: 'Instant multi-format text & byte encoder/decoder with UTF-8, URL safe base64, and binary views.',
    category: 'Formatters',
    icon: 'Binary',
    symbol: '64',
    keywords: ['base64', 'url encode', 'uri', 'hex', 'decode', 'encode', 'utf8'],
    isAvailable: false,
    status: 'upcoming',
    seoTitle: 'Base64 & URL Encoder/Decoder | ToolMint',
    seoDescription: 'Fast client-side Base64, URL, and Hex encoding and decoding.'
  },
  {
    id: 'uuid-generator',
    name: 'UUID & Hash Generator',
    slug: 'uuid-generator',
    route: '/tools/uuid-generator',
    tagline: 'Generate v4/v7 UUIDs, NanoIDs, and cryptographic hashes.',
    description: 'Cryptographically secure random UUIDs, ULIDs, SHA-256, MD5, and HMAC hashes completely in your browser.',
    category: 'Generators',
    icon: 'Hash',
    symbol: '#',
    keywords: ['uuid', 'guid', 'v4', 'v7', 'nanoid', 'sha256', 'hash', 'generator'],
    isAvailable: false,
    status: 'upcoming',
    seoTitle: 'UUID & Hash Generator | ToolMint',
    seoDescription: 'Generate secure UUIDs and compute crypto hashes in browser.'
  },
  {
    id: 'cron-builder',
    name: 'Cron Expression Builder',
    slug: 'cron-builder',
    route: '/tools/cron-builder',
    tagline: 'Build, translate, and verify cron schedules.',
    description: 'Interactive visual cron builder with natural language schedule descriptions and next 10 execution time previews.',
    category: 'Time & Date',
    icon: 'Calendar',
    symbol: '* *',
    keywords: ['cron', 'schedule', 'cronjob', 'crontab', 'time', 'interval'],
    isAvailable: false,
    status: 'upcoming',
    seoTitle: 'Cron Expression Builder & Tester | ToolMint',
    seoDescription: 'Build and translate cron schedules with live next run predictions.'
  }
];

export const ACTIVE_TOOLS = TOOLS_REGISTRY.filter(t => t.isAvailable);
export const UPCOMING_TOOLS = TOOLS_REGISTRY.filter(t => !t.isAvailable);

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS_REGISTRY.find(t => t.slug === slug || t.id === slug);
}

export function getToolByRoute(route: string): ToolDefinition | undefined {
  return TOOLS_REGISTRY.find(t => t.route === route || route.startsWith(t.route));
}
