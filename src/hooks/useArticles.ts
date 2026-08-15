import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapArticle, type Article } from "@/lib/articles";

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

export const useArticleBySlug = (slug: string | undefined) =>
  useQuery({
    queryKey: ["article", slug],
    enabled: !!slug,
    queryFn: async (): Promise<Article | null> => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("slug", slug!)
        .eq("status", "published")
        .maybeSingle();
      if (error) throw error;
      return data ? mapArticle(data) : null;
    },
  });

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
