import { RegexTokenExplanation } from '../../types/regex';

/**
 * Deterministic breakdown of regex syntax patterns into human-readable explanations.
 * This runs entirely client-side with zero external API calls.
 */
export function explainRegexPattern(pattern: string): RegexTokenExplanation[] {
  if (!pattern) return [];

  const explanations: RegexTokenExplanation[] = [];
  const visited = new Set<string>();

  const addUnique = (item: RegexTokenExplanation) => {
    const key = `${item.token}-${item.title}`;
    if (!visited.has(key)) {
      visited.add(key);
      explanations.push(item);
    }
  };

  // 1. Anchors
  if (pattern.includes('^')) {
    addUnique({
      token: '^',
      type: 'anchor',
      title: 'Start of line / string',
      description: 'Asserts position at the beginning of the string (or beginning of a line when multiline flag "m" is enabled).'
    });
  }
  if (pattern.includes('$')) {
    addUnique({
      token: '$',
      type: 'anchor',
      title: 'End of line / string',
      description: 'Asserts position at the end of the string (or before a newline when multiline flag "m" is enabled).'
    });
  }
  if (pattern.includes('\\b')) {
    addUnique({
      token: '\\b',
      type: 'anchor',
      title: 'Word boundary',
      description: 'Matches a zero-width boundary position between a word character (\\w) and a non-word character or start/end of string.'
    });
  }

  // 2. Character Classes & Escapes
  if (pattern.includes('\\d')) {
    addUnique({
      token: '\\d',
      type: 'escape',
      title: 'Digit character [0-9]',
      description: 'Matches any single ASCII numeric digit (0 through 9).'
    });
  }
  if (pattern.includes('\\D')) {
    addUnique({
      token: '\\D',
      type: 'escape',
      title: 'Non-digit character',
      description: 'Matches any character that is NOT a numeric digit.'
    });
  }
  if (pattern.includes('\\w')) {
    addUnique({
      token: '\\w',
      type: 'escape',
      title: 'Word character [a-zA-Z0-9_]',
      description: 'Matches any alphanumeric character (letters, numbers) or underscore.'
    });
  }
  if (pattern.includes('\\W')) {
    addUnique({
      token: '\\W',
      type: 'escape',
      title: 'Non-word character',
      description: 'Matches any character that is NOT a word character (e.g. whitespace, symbols).'
    });
  }
  if (pattern.includes('\\s')) {
    addUnique({
      token: '\\s',
      type: 'escape',
      title: 'Whitespace character',
      description: 'Matches spaces, tabs, carriage returns, newlines, and form feeds.'
    });
  }
  if (pattern.includes('.')) {
    addUnique({
      token: '.',
      type: 'character',
      title: 'Any character (wildcard)',
      description: 'Matches any single character except line breaks (or including line breaks if "s" dotAll flag is set).'
    });
  }

  // 3. Custom Character Classes [ ... ]
  const classMatches = pattern.match(/\[([^\]]+)\]/g);
  if (classMatches) {
    for (const charClass of classMatches) {
      if (charClass.startsWith('[^')) {
        addUnique({
          token: charClass,
          type: 'class',
          title: `Negated character set ${charClass}`,
          description: `Matches any character NOT listed within the brackets: ${charClass.slice(2, -1)}.`
        });
      } else {
        addUnique({
          token: charClass,
          type: 'class',
          title: `Character set ${charClass}`,
          description: `Matches any single character listed within the brackets: ${charClass.slice(1, -1)}.`
        });
      }
    }
  }

  // 4. Quantifiers
  if (pattern.includes('+')) {
    addUnique({
      token: '+',
      type: 'quantifier',
      title: 'One or more times (+)',
      description: 'Matches 1 or more occurrences of the preceding token (greedy by default).'
    });
  }
  if (pattern.includes('*')) {
    addUnique({
      token: '*',
      type: 'quantifier',
      title: 'Zero or more times (*)',
      description: 'Matches 0 or more occurrences of the preceding token (greedy by default).'
    });
  }
  if (pattern.includes('?')) {
    addUnique({
      token: '?',
      type: 'quantifier',
      title: 'Optional / Zero or one (?)',
      description: 'Matches 0 or 1 occurrence of preceding token, or makes a preceding quantifier non-greedy/lazy.'
    });
  }

  const rangeQuantifiers = pattern.match(/\{(\d+)(,(\d*))?\}/g);
  if (rangeQuantifiers) {
    for (const q of rangeQuantifiers) {
      addUnique({
        token: q,
        type: 'quantifier',
        title: `Explicit count quantifier ${q}`,
        description: `Specifies an exact count or minimum/maximum repetition range.`
      });
    }
  }

  // 5. Groups & Lookarounds
  if (pattern.includes('(?<')) {
    addUnique({
      token: '(?<name>...)',
      type: 'group',
      title: 'Named capture group',
      description: 'Creates a named capturing group whose matched content can be accessed by key.'
    });
  } else if (pattern.includes('(?:')) {
    addUnique({
      token: '(?:...)',
      type: 'group',
      title: 'Non-capturing group',
      description: 'Groups sub-patterns for quantifier application without saving the match in result group indexes.'
    });
  } else if (pattern.includes('(')) {
    addUnique({
      token: '(...)',
      type: 'group',
      title: 'Capturing group',
      description: 'Groups tokens together and creates a backreferenced capture group numbered sequentially.'
    });
  }

  if (pattern.includes('(?=')) {
    addUnique({
      token: '(?=...)',
      type: 'lookaround',
      title: 'Positive Lookahead',
      description: 'Asserts that the given subpattern immediately follows the current position without including it in the match.'
    });
  }
  if (pattern.includes('(?!')) {
    addUnique({
      token: '(?!...)',
      type: 'lookaround',
      title: 'Negative Lookahead',
      description: 'Asserts that the given subpattern does NOT follow the current position.'
    });
  }

  // 6. Alternation
  if (pattern.includes('|')) {
    addUnique({
      token: '|',
      type: 'character',
      title: 'Alternation (OR operator)',
      description: 'Acts like a boolean OR, matching either the expression before or the expression after.'
    });
  }

  return explanations;
}
