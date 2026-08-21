export interface JsonSample {
  id: string;
  name: string;
  category: 'Broken (Test Fixes)' | 'Valid Examples';
  code: string;
  description: string;
}

export const JSON_SAMPLES: JsonSample[] = [
  {
    id: 'trailing-comma',
    name: 'Trailing Comma',
    category: 'Broken (Test Fixes)',
    description: 'Common issue when copying array items or objects in JS/TypeScript',
    code: `{
  "name": "Alex",
  "age": 24,
  "skills": [
    "React",
    "Node",
    "TypeScript",
  ],
}`
  },
  {
    id: 'single-quotes',
    name: 'Single Quotes',
    category: 'Broken (Test Fixes)',
    description: 'JavaScript object notation using single quotes instead of standard JSON double quotes',
    code: `{
  'project': 'ToolMint',
  'version': '1.0.0',
  'tags': ['developer', 'utility', 'privacy']
}`
  },
  {
    id: 'unquoted-keys',
    name: 'Unquoted Keys',
    category: 'Broken (Test Fixes)',
    description: 'JavaScript literal object keys copied without enclosing double quotes',
    code: `{
  name: "ToolMint",
  description: "Tiny tools. Zero friction.",
  clientSideOnly: true,
  toolCount: 4
}`
  },
  {
    id: 'missing-comma',
    name: 'Missing Comma',
    category: 'Broken (Test Fixes)',
    description: 'Missing comma delimiter between properties',
    code: `{
  "id": "item_9012",
  "title": "Developer Toolsuite"
  "status": "ready",
  "author": "ToolMint"
}`
  },
  {
    id: 'valid-api-response',
    name: 'REST API Payload',
    category: 'Valid Examples',
    description: 'Standard nested API response payload with metadata and lists',
    code: `{
  "status": "success",
  "data": {
    "user": {
      "id": "usr_8832",
      "username": "alex_dev",
      "email": "alex@toolmint.dev",
      "preferences": {
        "theme": "dark",
        "notifications": false,
        "editor": {
          "tabSize": 2,
          "fontFamily": "JetBrains Mono"
        }
      }
    },
    "tokens": [
      { "id": "tok_1", "name": "CI/CD Pipeline", "lastUsed": "2026-08-20T10:15:00Z" },
      { "id": "tok_2", "name": "Local CLI", "lastUsed": "2026-08-21T02:30:00Z" }
    ]
  },
  "timestamp": 1787315400
}`
  }
];
