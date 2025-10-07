import { defineCollection, z } from 'astro:content';

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.string().optional(),
    author: z.string().optional(),
  }),
});

const programs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.string().optional(),
    author: z.string().optional(),
  }),
});

const interviews = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.string().optional(),
    author: z.string().optional(),
  }),
});

export const collections = {
  pages,
  programs,
  interviews,
};
