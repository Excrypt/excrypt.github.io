/**
 * How a buyer used to find a shop, and how they find one now.
 *
 * Read by BOTH the home page's Shift section and the standalone /the-shift/
 * page, so the two can never describe a different change.
 */
export interface ShiftRow {
  before: string;
  now: string;
}

export const shiftRows: ShiftRow[] = [
  {
    before: 'Called a distributor rep he had worked with before.',
    now: 'Asks ChatGPT for three shops that can hit his in-hands date.',
  },
  {
    before: 'Searched "screen printing near me" and opened five tabs.',
    now: 'Reads the answer. Never opens a results page.',
  },
  {
    before: 'Called around for minimums, turnaround and a price.',
    now: 'Gets minimums and turnaround summarised before he calls anyone.',
  },
  {
    before: 'Asked a Facebook group who can run 300 hoodies by Friday.',
    now: 'Asks a follow-up: "which of those does DTF under 24 pieces?"',
  },
  {
    before: 'Found you because you were on page one.',
    now: 'Finds you only if the model has something to read about you.',
  },
];
