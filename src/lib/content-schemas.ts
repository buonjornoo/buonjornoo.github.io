import { z } from 'astro/zod';

/**
 * Split out of content.config.ts (which imports the `astro:content` virtual
 * module, unresolvable outside Astro's own Vite pipeline) so the blog
 * schema can be unit-tested directly with plain vitest — see
 * tests/unit/content-schema.test.ts.
 */
export const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  pageNumber: z.string().optional(),
  // Soft convention: at most one post carries this at a time, not schema-enforced.
  featured: z.boolean().default(false),
});
