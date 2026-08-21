export interface DiffSample {
  id: string;
  name: string;
  description: string;
  original: string;
  modified: string;
}

export const DIFF_SAMPLES: DiffSample[] = [
  {
    id: 'user-profile',
    name: 'User Profile Update',
    description: 'Profile updates showing added roles, updated age, and removed city',
    original: `{
  "name": "Alex",
  "age": 24,
  "city": "Lahore",
  "skills": ["React", "Node"],
  "settings": {
    "theme": "light",
    "notifications": true
  }
}`,
    modified: `{
  "name": "Alex",
  "age": 25,
  "role": "Lead Architect",
  "skills": ["React", "Node", "TypeScript"],
  "settings": {
    "theme": "dark",
    "notifications": true
  }
}`
  },
  {
    id: 'api-config',
    name: 'Service Config Drift',
    description: 'Server environment config changes and flag additions',
    original: `{
  "appName": "ToolMint",
  "port": 3000,
  "env": "development",
  "features": {
    "aiEnabled": false,
    "maxPayloadMb": 10
  },
  "allowedOrigins": [
    "http://localhost:3000"
  ]
}`,
    modified: `{
  "appName": "ToolMint",
  "port": 3000,
  "env": "production",
  "features": {
    "aiEnabled": false,
    "maxPayloadMb": 25,
    "rateLimiting": true
  },
  "allowedOrigins": [
    "http://localhost:3000",
    "https://toolmint.dev"
  ]
}`
  },
  {
    id: 'nested-data',
    name: 'E-commerce Order Changes',
    description: 'Complex nested items, price modifications, and shipping status',
    original: `{
  "orderId": "ord_9901",
  "customer": "Sarah Connor",
  "status": "pending",
  "items": [
    { "sku": "KB-900", "name": "Mechanical Keyboard", "qty": 1, "price": 120 }
  ],
  "discounts": []
}`,
    modified: `{
  "orderId": "ord_9901",
  "customer": "Sarah Connor",
  "status": "shipped",
  "trackingNumber": "TRK-983192",
  "items": [
    { "sku": "KB-900", "name": "Mechanical Keyboard", "qty": 2, "price": 110 },
    { "sku": "MS-200", "name": "Wireless Mouse", "qty": 1, "price": 45 }
  ],
  "discounts": [
    { "code": "FREESHIP", "amount": 15 }
  ]
}`
  }
];
