import { RegexSample } from '../../types/regex';

export const REGEX_SAMPLES: RegexSample[] = [
  {
    id: 'email',
    name: 'Email Address',
    category: 'Common',
    pattern: '[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}',
    flags: 'g',
    testString: `Contact our team at hello@toolmint.dev or support@company.org.
Invalid addresses: user@, @domain.com, broken.email.
Alternative contact: alex_dev.99@subdomain.example.co.uk`,
    description: 'Starting pattern for matching typical email addresses.'
  },
  {
    id: 'url',
    name: 'HTTP/HTTPS URLs',
    category: 'Web',
    pattern: 'https?:\\/\\/(?:[\\w-]+\\.)+[\\w-]+(?:\\/[\\w-./?%&=]*)?',
    flags: 'gi',
    testString: `Check our repository at https://github.com/toolmint/core or visit http://localhost:3000/tools/regex-playground.
Docs are at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions?ref=toolmint#guide`,
    description: 'Matches standard web URLs with protocol, domain, and optional paths/query parameters.'
  },
  {
    id: 'ipv4',
    name: 'IPv4 Address',
    category: 'Networking',
    pattern: '\\b(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)){3}\\b',
    flags: 'g',
    testString: `Server cluster IP assignments:
Router: 192.168.1.1
Gateway: 10.0.0.254
Loopback: 127.0.0.1
Public DNS: 8.8.8.8 and 1.1.1.1
Invalid IPs: 999.12.3.4, 256.0.0.1`,
    description: 'Validates 0.0.0.0 through 255.255.255.255 IPv4 dotted octets.'
  },
  {
    id: 'hex-color',
    name: 'Hex Color Codes',
    category: 'Design',
    pattern: '#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\b',
    flags: 'g',
    testString: `Primary brand color: #10b981 (Emerald)
Secondary: #0f172a (Dark stone)
Short hex: #fff, #333, #e11
With alpha: #10b981cc, #00000080
Invalid: #xyz123, #12345`,
    description: 'Matches 3, 4, 6, and 8-digit hexadecimal CSS color codes.'
  },
  {
    id: 'numbers-only',
    name: 'Numbers & Decimals',
    category: 'Data',
    pattern: '-?\\d+(?:\\.\\d+)?',
    flags: 'g',
    testString: `Order #1234 summary:
Subtotal: $45.99
Tax: $3.68
Discount: -10.50
Total: $39.17
Qty: 4 units`,
    description: 'Extracts positive and negative integers and floating point numbers.'
  },
  {
    id: 'username',
    name: 'Username Identifier',
    category: 'Auth',
    pattern: '^[a-zA-Z0-9_]{3,16}$',
    flags: 'm',
    testString: `alex_dev
johnDoe99
tool_mint_admin
x
super_long_username_that_is_way_too_long
invalid-username-with-hyphens
valid_user_123`,
    description: 'Validates 3 to 16 alphanumeric characters and underscores.'
  }
];
