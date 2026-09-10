/**
 * The home page FAQ.
 *
 * Read by BOTH the visible <FaqSection> and the FAQPage JSON-LD, so the markup can
 * never describe a question that isn't on the page. Never add an entry here that
 * isn't rendered, and never render a question that isn't here.
 *
 * `answer` is plain text on purpose — FAQPage acceptedAnswer should be the same
 * words the reader sees, and plain text guarantees that.
 */
export interface FaqEntry {
  question: string;
  answer: string;
}

export const homeFaq: FaqEntry[] = [
  {
    question: 'How long am I locked in?',
    answer:
      'You are not. It is month to month. Tell us to stop and the next invoice does ' +
      'not go out. There is no contract to get out of and no cancellation fee, so ' +
      'the only thing keeping you here is whether the work is worth $1,500.',
  },
  {
    question: 'Who owns the website and the accounts?',
    answer:
      'You do, all of it. The domain is registered in your name, the Google Business ' +
      'Profile is your profile, and every account we touch is created under your ' +
      'email with us added as an admin. If we part ways you remove us as an admin and ' +
      'nothing moves. We do not hold your domain, your content or your reviews.',
  },
  {
    question: 'Can you guarantee I will show up in ChatGPT?',
    answer:
      'No, and anyone who tells you otherwise is selling something. Nobody controls ' +
      'what an AI assistant says. What we control is whether the answer to a buyer ' +
      'question exists on your site, whether it is structured so a machine can read ' +
      'it without guessing, and whether your business details are consistent ' +
      'everywhere a model might check. That is the work. The results follow it, but ' +
      'they are not ours to promise.',
  },
  {
    question: 'What if it does not work?',
    answer:
      'Then you stop paying, which is why it is month to month. Before that, you get ' +
      'a monthly report showing what actually changed — the questions you now answer, ' +
      'where you appear that you did not before, and what came in. If three or four ' +
      'months go by and the report is empty, we will tell you before you have to ask.',
  },
  {
    question: 'What do you need from me?',
    answer:
      'About an hour up front and roughly thirty minutes a month after that. Up front ' +
      'we need a call about the work you actually take. If you decorate that means ' +
      'presses, heads, minimums, run sizes and what you will not quote. If you ' +
      'distribute it means what you source, who you contract the decorating to, and ' +
      'the accounts you want more of. Plus admin access to your accounts. After that ' +
      'it is one call a month — we write the copy and you approve it.',
  },
  {
    question: 'Do you work with my competitors?',
    answer:
      'Not in your market. We take one supplier per metro per specialty, so we are ' +
      'not running two contract embroiderers — or two distributors chasing the same ' +
      'accounts — against each other. If someone in your area signs first, we will ' +
      'tell you that instead of taking your money.',
  },
];
