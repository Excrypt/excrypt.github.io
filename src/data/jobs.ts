/**
 * The three jobs the retainer does every month.
 *
 * Read by BOTH the home page's WhatWeDo section — which adds its own
 * demonstration pane per job — and the standalone /what-we-do/ page, so the
 * description of the work lives in one place.
 */
export interface Job {
  label: string;
  title: string;
  body: string;
  /** Which demonstration pane the home section draws for this job. */
  pane: 'answer' | 'schema' | 'listings';
}

export const jobs: Job[] = [
  {
    label: 'Answers',
    title: 'Answer the questions buyers type',
    body:
      'We write pages that answer real sourcing questions in the words buyers use — ' +
      'minimums, turnaround, what you will and will not take on. Those pages are what ' +
      'a model reads when someone goes looking for what you sell.',
    pane: 'answer',
  },
  {
    label: 'Structure',
    title: 'Make the shop legible to a machine',
    body:
      'Methods, run sizes, minimums and in-hands turnaround stated plainly and marked ' +
      'up in structured data — or, if you distribute, what you source and how fast you ' +
      'quote. An assistant should not have to infer any of it from a gallery page.',
    pane: 'schema',
  },
  {
    label: 'Consistency',
    title: 'Keep the record straight everywhere',
    body:
      'Your site, your Google Business Profile and the industry directories say the ' +
      'same thing about address, hours and what you handle. Contradictions are a ' +
      'common reason a supplier gets left out of an answer.',
    pane: 'listings',
  },
];
