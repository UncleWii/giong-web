import type { ImageSlug } from "./images";

export interface Section {
  id: string;
  order: number;
  label: string;
  headline: string;
  /** Paragraphs in reading order. A paragraph starting with "• " renders as a list item. */
  body: string[];
  /** Very short (5-7 word) blurb for compact teaser layouts — distinct from `body`, which stays the full sheet copy. */
  teaser?: string;
  image?: ImageSlug;
  /** Extra images to auto-rotate through alongside `image` (compact teaser layouts). */
  images?: ImageSlug[];
  /** Title shown inside the ribbon banner (ThienLySection). */
  ribbon?: string;
  /** Large accent line beside the copy (ThienLySection). "\n" breaks the line. */
  accent?: string;
  /** Auto-advance interval (ms) for `images` in StorySection. */
  rotateMs?: number;
  cta?: string;
  ctaHref?: string;
}

export interface PageContent {
  page: string;
  sections: Section[];
}
