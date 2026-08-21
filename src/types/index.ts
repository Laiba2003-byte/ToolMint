export interface ToolDefinition {
  id: string;
  name: string;
  slug: string;
  route: string;
  tagline: string;
  description: string;
  category: 'JSON' | 'Regex' | 'Time & Date' | 'Security' | 'Formatters' | 'Generators';
  icon: string; // lucide icon identifier or symbol
  symbol?: string; // Short code display like '{ }', '⇄', '.*'
  keywords: string[];
  isAvailable: boolean;
  status?: 'active' | 'upcoming';
  seoTitle: string;
  seoDescription: string;
  shortcut?: string;
}

export type Theme = 'light' | 'dark' | 'system';
