import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { blogSchema } from './lib/content-schemas';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/blog' }),
  schema: blogSchema,
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    subtitle: z.string().optional(),
    tags: z.array(z.string()),
    context: z.string().optional(),
    coverImage: z.string().optional(),
    heroImage: z.string().optional(),
    heroImageWidth: z.number().optional(),
    heroImageHeight: z.number().optional(),
    url: z.string().optional(),
    slug: z.string(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    pageNumber: z.string().default('200'),
    archive: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pageNumber: z.string().optional(),
  }),
});

export const collections = { blog, projects, pages };
