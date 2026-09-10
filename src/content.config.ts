import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { site } from './data/site';

const founderNames = site.founders.map((f) => f.name) as [string, ...string[]];

/**
 * Answer pages.
 *
 * The point of this collection is that the whole page — meta, structured data and
 * visible content — is derived from one typed front matter block, so adding the
 * fiftieth answer costs the same as adding the second and nothing can be
 * forgotten.
 */
const answers = defineCollection({
  loader: glob({ base: './src/content/answers', pattern: '**/*.md' }),
  schema: z
    .object({
      /** The question, written the way a buyer would ask it. Becomes the <h1>. */
      title: z.string().min(12).max(110),

      /** Meta description. One sentence, must stand on its own. */
      description: z.string().min(50).max(175),

      /**
       * The direct answer, in one or two sentences, before any elaboration.
       * Rendered immediately under the h1 and reused as the FAQ answer in schema.
       * This is the sentence an assistant is most likely to lift, so it has to be
       * true without the rest of the page around it.
       */
      answer: z.string().min(40).max(600),

      /** Real attribution. No anonymous "the team". */
      author: z.enum(founderNames),

      publishDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),

      /**
       * Article for an explanatory page, FAQPage for a page that is genuinely a
       * set of questions. Only use FAQPage when `faq` entries are rendered.
       */
      schemaType: z.enum(['Article', 'FAQPage']).default('Article'),

      /**
       * Rendered on the page AND emitted as FAQPage. Never add an entry here
       * that the page body does not show.
       */
      faq: z
        .array(z.object({ question: z.string(), answer: z.string() }))
        .default([]),

      /**
       * Named sources for every claim on the page, rendered visibly at the foot.
       * Generative engines cite pages that cite things; more practically, a
       * structured list makes every number on the page auditable before it ships.
       */
      sources: z
        .array(
          z.object({
            label: z.string(),
            url: z.string().url(),
            note: z.string().optional(),
          })
        )
        .default([]),

      /** Sibling answers to link to. Validated against the collection. */
      related: z.array(reference('answers')).default([]),

      draft: z.boolean().default(false),
    })
    .refine((data) => data.schemaType !== 'FAQPage' || data.faq.length > 0, {
      message: 'schemaType "FAQPage" requires at least one rendered faq entry',
      path: ['faq'],
    }),
});

export const collections = { answers };
