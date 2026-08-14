import { z } from 'zod';

export const idParamSchema = z.coerce.number().int().positive();

export const postCreateSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase, alphanumeric, hyphen-separated'),
  title: z.string().min(1).max(300),
  author: z.string().min(1).max(200),
  publishedAt: z.coerce.date(),
  category: z.string().min(1).max(100),
  summary: z.string().min(1),
  body: z.string().min(1),
  imageUrl: z.string().url().max(2000).nullable().optional(),
  link: z.string().url().max(2000).nullable().optional(),
  readTime: z.string().max(50).nullable().optional(),
  feedSourceId: z.coerce.number().int().positive().nullable().optional(),
  authorId: z.coerce.number().int().positive().nullable().optional(),
});

export const postUpdateSchema = postCreateSchema.partial();

export const feedSourceCreateSchema = z.object({
  name: z.string().min(1).max(200),
  url: z.string().url().max(2000),
});

export const feedSourceUpdateSchema = feedSourceCreateSchema.partial();

export const authorCreateSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320).nullable().optional(),
});

export const authorUpdateSchema = authorCreateSchema.partial();
