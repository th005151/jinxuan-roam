import { z } from "zod";
import { PARTNER_KEYS } from "@/lib/config/partners";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD");

export const ArticleFrontmatterSchema = z.object({
  title: z.string().min(1).max(40, "Title must be <= 40 characters"),
  description: z.string().min(1).max(80, "Description must be <= 80 characters"),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must be lowercase kebab-case"),
  publishedAt: isoDate,
  updatedAt: isoDate,
  author: z.string().min(1),
  keywords: z.array(z.string().min(1)).min(1).max(10),
  ogImage: z.string().optional(),
  canonical: z.url(),
  hasAffiliate: z.boolean(),
  relatedSlugs: z.tuple([z.string(), z.string(), z.string()]),

  // Travel-specific (all optional — pure遊記不需要 partner)
  country: z.string().optional(),
  location: z.string().optional(),
  tripType: z.string().optional(),
  travelDate: isoDate.optional(),

  // Affiliate (all optional)
  partner: z.enum(PARTNER_KEYS).optional(),
  partnerLink: z.url().optional(),
});

export type ArticleFrontmatter = z.infer<typeof ArticleFrontmatterSchema>;
