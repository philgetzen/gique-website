import { defineCollection, z } from 'astro:content';

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.string(),
    author: z.string(),
  }),
});

const programs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.string(),
    author: z.string(),
  }),
});

const interviews = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    date: z.string(),
    author: z.string(),
  }),
});

export const collections = {
  pages,
  programs,
  interviews,
};
