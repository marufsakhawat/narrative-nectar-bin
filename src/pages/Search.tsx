import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import NewsletterSection from "@/components/NewsletterSection";
import ArticleCardGrid, { ArticleGridSkeleton } from "@/components/ArticleCardGrid";
import { categories, matchesQuery } from "@/lib/articles";
import { usePublishedArticles } from "@/hooks/useArticles";

const Search = () => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { data: articles, isLoading, error } = usePublishedArticles();

  const results = useMemo(() => {
    let matches = (articles ?? []).filter((a) => matchesQuery(a, query));
    if (activeCategory) matches = matches.filter((a) => a.category === activeCategory);
    return matches;
  }, [query, activeCategory, articles]);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Search Articles"
        description="Search the MsDevs Insights library of marketing, sales, and customer success articles."
        path="/search"
      />
      <Header />
      <main>
        <section className="container py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Search</h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              Find articles, deep dives, and resources across the MsDevs Insights library.
            </p>
          </motion.div>

          <div className="relative mt-8 max-w-2xl">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="search"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author, or topic…"
              className="w-full rounded-lg border border-border bg-card pl-12 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory(null)}
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
                onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
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

          {isLoading ? (
            <ArticleGridSkeleton />
          ) : error ? (
            <p className="mt-16 text-center text-sm text-muted-foreground">
              We couldn&apos;t load articles right now. Please try again later.
            </p>
          ) : (
            <>
              <p className="mt-6 text-sm text-muted-foreground">
                {results.length} {results.length === 1 ? "result" : "results"}
              </p>
              <ArticleCardGrid articles={results} />
              {results.length === 0 && (
                <div className="mt-16 text-center">
                  <p className="text-lg font-medium text-foreground">No results found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try a different search term or browse all categories.
                  </p>
                </div>
              )}
            </>
          )}
        </section>
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Search;
