import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const books = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/books' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    status: z.enum(['reading', 'finished', 'to-read']).default('to-read'),
    rating: z.number().min(1).max(5).optional(),
    finished: z.coerce.date().optional(),
    cover: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const music = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/music' }),
  schema: z.object({
    title: z.string(),
    artist: z.string().optional(),
    kind: z.enum(['album', 'artist', 'playlist']).default('album'),
    // Albums are either on repeat right now or part of the favorites shelf.
    status: z.enum(['on-repeat', 'favorite']).default('favorite'),
    cover: z.string().optional(),
    description: z.string().optional(),
    order: z.number().optional(),
    year: z.number().optional(),
    rating: z.number().min(1).max(5).optional(),
    link: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog, books, music };
