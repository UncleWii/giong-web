import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// Kiến thức cà phê: one Markdown file per article in src/content/kien-thuc/.
// `title` and `description` are the SEO title/description (edit them freely later).
const kienThuc = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/kien-thuc" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      cover: image(),
      coverAlt: z.string().default(""),
      draft: z.boolean().default(false),
    }),
});

// Hành trình Thiên Lý: one Markdown file per chặng (leg) of the journey, in src/content/thien-ly/.
// `order` fixes the narrative sequence (01, 02, 03…) independent of `date`.
const thienLy = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/thien-ly" }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      cover: image(),
      coverAlt: z.string().default(""),
      draft: z.boolean().default(false),
    }),
});

export const collections = { kienThuc, thienLy };
