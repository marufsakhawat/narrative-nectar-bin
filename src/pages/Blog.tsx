import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSection from "@/components/NewsletterSection";
import Seo from "@/components/Seo";
import ArticleCardGrid, { ArticleGridSkeleton } from "@/components/ArticleCardGrid";
import { Link, useSearchParams } from "react-router-dom";
import { Search as SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { categories } from "@/lib/articles";
import { usePublishedArticles } from "@/hooks/useArticles";

const PAGE_SIZE = 6;

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState<string | null>(
    initialCategory && categories.includes(initialCategory) ? initialCategory : null,
  );
  const [page, setPage] = useState(1);
  const { data: articles, isLoading, error } = usePublishedArticles();

  // Keep state in sync if the user navigates with a new ?category=
  useEffect(() => {
    const c = searchParams.get("category");
    setActiveCategory(c && categories.includes(c) ? c : null);
    setPage(1);
  }, [searchParams]);

  const selectCategory = (cat: string | null) => {
    setActiveCategory(cat);
    setPage(1);
    if (cat) setSearchParams({ category: cat });
    else setSearchParams({});
  };

  const filtered = useMemo(() => {
    const base = articles ?? [];
    return activeCategory ? base.filter((a) => a.category === activeCategory) : base;
  }, [activeCategory, articles]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Blog"
        description="Insights, strategies, and deep dives from the MsDevs Insights team and guest contributors."
        path="/blog"
      />
      <Header />
      <main>
        <section className="container py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Blog</h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              Insights, strategies, and deep dives from the MsDevs Insights team and guest contributors.
            </p>
          </motion.div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => selectCategory(null)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => selectCategory(activeCategory === cat ? null : cat)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <SearchIcon className="h-4 w-4" /> Search
            </Link>
          </div>

          {isLoading ? (
            <ArticleGridSkeleton />
          ) : error ? (
            <p className="mt-16 text-center text-sm text-muted-foreground">
              We couldn&apos;t load articles right now. Please try again later.
            </p>
          ) : paginated.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="text-lg font-medium text-foreground">No published articles yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {activeCategory
                  ? "Nothing in this category yet — try another one."
                  : "Check back soon for new stories."}
              </p>
            </div>
          ) : (
            <ArticleCardGrid articles={paginated} />
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:hover:bg-transparent"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </section>
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
