import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapArticle, type Article } from "@/lib/articles";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const usePublishedArticles = () =>
  useQuery({
    queryKey: ["articles", "published"],
    queryFn: async (): Promise<Article[]> => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapArticle);
    },
  });

/** Look up a published article by slug (preferred) or by uuid. */
export const usePublishedArticle = (key: string | undefined) =>
  useQuery({
    queryKey: ["article", "public", key],
    enabled: !!key,
    queryFn: async (): Promise<Article | null> => {
      const column = UUID_RE.test(key!) ? "id" : "slug";
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .eq(column, key!)
        .maybeSingle();
      if (error) throw error;
      return data ? mapArticle(data) : null;
    },
  });

export const useArticleBySlug = (slug: string | undefined) => usePublishedArticle(slug);

/** All articles including drafts — only readable by admins/authors. */
export const useAllArticles = () =>
  useQuery({
    queryKey: ["articles", "all"],
    queryFn: async (): Promise<Article[]> => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapArticle);
    },
  });

export const useArticleById = (id: string | undefined) =>
  useQuery({
    queryKey: ["article", "id", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
