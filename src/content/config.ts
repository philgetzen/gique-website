import { defineCollection, z } from 'astro:content';

const interviews = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string().optional(),
    author: z.string().optional(),
  }),
});

export const collections = {
  interviews,
};
