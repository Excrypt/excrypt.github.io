/**
 * The study behind the research section and its read-more page.
 *
 * One place for every number, so the section and the page cannot disagree.
 *
 * WHAT IT IS AND WHAT IT IS NOT. G2 surveyed business buyers of SOFTWARE, not
 * buyers of printed apparel. It is used here because it is the most direct,
 * most recent measurement of the thing this site sells against — buyers asking
 * an AI assistant instead of searching — and because it is a named study with a
 * named lead and a stated method, which is the only kind of number worth putting
 * on a page that asks machines to trust it. Every place a figure is shown says
 * whose buyers they were.
 *
 * Every figure below is as G2 states it, cross-checked between G2's news post,
 * its press release and the report's landing page (links in `sources`). A figure
 * that appeared in only one of them, or differently in two, is left out rather
 * than rounded to agree.
 */

export interface Stat {
  value: string;
  label: string;
}

export interface Finding {
  title: string;
  body: string;
  stats: Stat[];
}

export const answerEconomy = {
  path: '/research/answer-economy/',

  /** The report's own name, as G2 titles it. */
  reportTitle: 'The Answer Economy: How AI Search Is Rewiring B2B Software Buying',
  shortTitle: 'The Answer Economy',
  publisher: 'G2',
  lead: 'Tim Sanders',
  leadRole: 'Chief Innovation Officer at G2',
  published: new Date('2026-04-15T00:00:00Z'),

  fieldwork: 'March 2026',
  sampleSize: '1,076',
  sample: '1,076 B2B software buyers and decision-makers, from individual contributors to the C-suite',
  regions: 'North America, EMEA and APAC',
  interviews: '39 interviews with B2B software marketers',

  /** Same question, a year apart — G2's 2025 figure is the one its release compares against. */
  trend: [
    { when: 'Apr 2025', value: 29, tone: 'periwinkle' as const },
    { when: 'Mar 2026', value: 51, tone: 'accent' as const },
  ],

  cards: [
    { value: '69%', label: 'Chose a different vendor than they planned', tint: 'pink' },
    { value: '85%', label: 'Think more of a vendor the AI names', tint: 'grey' },
    { value: '1 in 3', label: 'Bought from a vendor they had never heard of', tint: 'cream' },
    { value: '71%', label: 'Use AI chatbots in their research', tint: 'blue' },
  ],

  points: [
    '53% say it beats searching Google',
    '64% have caught it being wrong',
    '45% trust review sites most when they check',
    '41% run Deep Research to compare vendors',
  ],

  /** Seven words from G2's release — the one direct quote the page carries. */
  quote: 'Buyers have moved from reference to inference.',

  /**
   * The read-more page, in the order of the report's own four key findings.
   * Titles and prose are ours; the figures are G2's.
   */
  findings: [
    {
      title: 'The search bar has a rival',
      body:
        'Half the buyers G2 asked now open an AI chatbot before Google more often than ' +
        'not. A year earlier it was 29%. Google has not gone away — most still use it ' +
        'somewhere along the way — but it has moved from the first stop to a place to check.',
      stats: [
        { value: '51%', label: 'start research with an AI chatbot more often than Google (29% in April 2025)' },
        { value: '71%', label: 'rely on AI chatbots for software research (60% seven months earlier)' },
        { value: '93%', label: 'say chatbots have fundamentally changed how they research' },
        { value: '80%', label: 'still use Google somewhere in the buying journey' },
      ],
    },
    {
      title: 'The answer writes the shortlist',
      body:
        'Buyers do not stop at one prompt. They ask for comparisons, and the comparison ' +
        'becomes the decision. Two in three ended up with a vendor they had not planned ' +
        'on, a third bought from a company they had never heard of, and being named in ' +
        'the answer made buyers think better of a vendor.',
      stats: [
        { value: '69%', label: 'chose a different vendor than they first planned' },
        { value: '1 in 3', label: 'bought from a vendor they were not familiar with' },
        { value: '85%', label: 'think more highly of a vendor an AI chatbot recommends' },
        { value: '4 in 5', label: 'say AI chatbots sped up their purchasing decision' },
      ],
    },
    {
      title: 'Buyers check the answer',
      body:
        'Most buyers have caught a chatbot getting it wrong, so they look for something ' +
        'to back it up. The signal they trust most inside an AI answer is a citation to ' +
        'a review site, and when the answer contradicts a brand they already trust, a ' +
        'quarter go to peer reviews next.',
      stats: [
        { value: '64%', label: 'meet inaccurate AI recommendations often or very often' },
        { value: '45%', label: 'say review-site citations are the most confidence-inspiring signal' },
        { value: '50%', label: 'of daily power users say the same' },
        { value: '24%', label: 'turn to peer reviews when the answer conflicts with a brand they trust' },
      ],
    },
    {
      title: 'It is a habit now, not a trial',
      body:
        'Use is growing and getting heavier. Most buyers increased their use in the past ' +
        'year and nearly two in three spend six or more hours a week in these tools. They ' +
        'also think the research is simply better than what it replaced.',
      stats: [
        { value: '86%', label: 'increased their use of AI chatbots for research in the past year' },
        { value: '2 in 3', label: 'spend six or more hours a week using AI chatbots for work' },
        { value: '40%+', label: 'call themselves daily power users' },
        { value: '53%', label: 'find AI research more productive than search (36% seven months earlier)' },
      ],
    },
  ] satisfies Finding[],

  /** Two independent studies that point the same way, for the page's cross-check. */
  others: [
    {
      name: 'Forrester — The State of Business Buying, 2026',
      detail:
        'Barbara Winters, VP and principal analyst. Published January 21, 2026, from ' +
        "Forrester's survey of nearly 18,000 business buyers worldwide.",
      finding:
        '94% of business buyers use AI somewhere in their purchasing, and they go on to ' +
        'confirm what it tells them with peers, product experts and analysts.',
      url: 'https://www.forrester.com/blogs/state-of-business-buying-2026/',
    },
    {
      name: 'TrustRadius — 2026 B2B Buying Disconnect',
      detail: 'Published July 15, 2026, from 1,862 technology buyers and 444 technology vendors.',
      finding:
        '63% of buyers used AI during their purchase, and 94% of those fact-check its ' +
        'answers at least some of the time.',
      url: 'https://www.prnewswire.com/news-releases/trustradius-2026-b2b-buying-disconnect-report-reveals-ai-has-changed-how-buyers-research-but-not-what-they-trust-302825792.html',
    },
  ],

  sources: [
    {
      label: 'G2 — The Answer Economy (report page; full report is behind a form)',
      url: 'https://learn.g2.com/g2-2026-ai-search-insight-report',
    },
    {
      label: 'G2 — "In the Answer Economy, don\'t win the click, win the answer"',
      url: 'https://company.g2.com/news/g2-research-the-answer-economy',
    },
    {
      label: 'G2 press release, April 15, 2026',
      url: 'https://www.prnewswire.com/news-releases/new-g2-research-half-of-b2b-software-buyers-now-start-their-research-with-ai-chatbots-302742807.html',
    },
  ],
};
