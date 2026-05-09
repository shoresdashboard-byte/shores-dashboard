import { defineCollection, z } from 'astro:content';

const recaps = defineCollection({
  type: 'content',
  schema: z.object({
    headline: z.string().max(140),
    dek: z.string().max(280),
    date: z.coerce.date(),
    readTime: z.number().int().positive().default(3),
    placeholder: z.boolean().default(false)
  })
});

export const collections = { recaps };
