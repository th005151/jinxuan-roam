import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD");

export const ArticleFrontmatterSchema = z.object({
  title: z.string().min(1).max(30, "Title must be <= 30 characters"),
  description: z.string().min(1).max(70, "Description must be <= 70 characters"),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  publishedAt: isoDate,
  updatedAt: isoDate,
  author: z.string().min(1),
  keywords: z.array(z.string().min(1)).min(1).max(8),
  ogImage: z.string().optional(),
  canonical: z.url(),
  hasAffiliate: z.boolean(),
  relatedSlugs: z.tuple([z.string(), z.string(), z.string()]),
});

export type ArticleFrontmatter = z.infer<typeof ArticleFrontmatterSchema>;
