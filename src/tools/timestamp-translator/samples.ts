export interface TimestampSample {
  id: string;
  name: string;
  value: string;
  description: string;
}

export const TIMESTAMP_SAMPLES: TimestampSample[] = [
  {
    id: 'unix-seconds',
    name: 'Unix Seconds (2026)',
    value: '1787315400',
    description: 'Standard 10-digit epoch timestamp'
  },
  {
    id: 'unix-millis',
    name: 'Unix Milliseconds',
    value: '1787315400000',
    description: '13-digit JavaScript Date.now() representation'
  },
  {
    id: 'iso-utc',
    name: 'ISO 8601 UTC',
    value: '2026-08-21T09:30:00Z',
    description: 'Standard ISO UTC datetime format'
  },
  {
    id: 'iso-offset',
    name: 'ISO with Timezone Offset',
    value: '2026-08-21T14:30:00+05:00',
    description: 'ISO datetime with positive UTC offset'
  },
  {
    id: 'human-date',
    name: 'Human Date String',
    value: 'Aug 21, 2026 2:30 PM',
    description: 'Formatted human readable date string'
  }
];
