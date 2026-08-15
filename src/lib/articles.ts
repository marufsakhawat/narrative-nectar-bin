import type { Database } from "@/integrations/supabase/types";

export type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  role: string;
  category: string;
  image: string;
  publishedAt: string;
  date: string;
  dateShort: string;
  readTime: string;
  body: string[];
  status: string;
}

export const categories = [
  "Marketing Strategy",
  "Sales Enablement",
  "Customer Success",
  "Product Management",
];

const FALLBACK_IMAGE = "/images/hero-featured.jpg";

export const mapArticle = (row: ArticleRow): Article => {
  const published = new Date(row.published_at);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    author: row.author ?? "",
    role: row.author_role ?? "",
    category: row.category ?? "",
    image: row.featured_image_url || FALLBACK_IMAGE,
    publishedAt: row.published_at,
    date: published.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    dateShort: published.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
    }),
    readTime: row.read_time ?? "",
    body: (row.content ?? "").split(/\n{2,}/).filter(Boolean),
    status: row.status,
  };
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 70)
    .replace(/-+$/, "");

export const authorSlug = (author: string) => slugify(author);

export const matchesQuery = (article: Article, query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [article.title, article.excerpt, article.author, article.category, article.body.join(" ")]
    .join(" ")
    .toLowerCase()
    .includes(q);
};
