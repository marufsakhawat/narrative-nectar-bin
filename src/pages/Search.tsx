import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search as SearchIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import NewsletterSection from "@/components/NewsletterSection";
import { Link } from "react-router-dom";
import { searchArticles, sortByDateDesc, categories } from "@/data/articles";

const Search = () => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const results = useMemo(() => {
    let matches = searchArticles(query);
    if (activeCategory) {
      matches = matches.filter((a) => a.category === activeCategory);
    }
    return sortByDateDesc(matches);
  }, [query, activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Search Articles"
        description="Search the MSD Insights library of marketing, sales, and customer success articles."
        path="/search"
      />
      <Header />
      <main>
        <section className="container py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Search</h1>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              Find articles, deep dives, and resources across the MSD Insights library.
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

          <p className="mt-6 text-sm text-muted-foreground">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.4) }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group"
              >
                <Link to={`/article/${post.id}`} className="block">
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full aspect-[16/10] object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-3 space-y-2">
                    <span className="text-xs font-semibold text-primary">{post.category}</span>
                    <h2 className="text-base font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                      <span className="font-medium">{post.author}</span>
                      <span>{post.dateShort}</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {results.length === 0 && (
            <div className="mt-16 text-center">
              <p className="text-lg font-medium text-foreground">No results found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different search term or browse all categories.
              </p>
            </div>
          )}
        </section>
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Search;
