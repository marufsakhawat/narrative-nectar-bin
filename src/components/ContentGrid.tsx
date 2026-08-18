import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublishedArticles } from "@/hooks/useArticles";

const ContentGrid = () => {
  const { data, isLoading } = usePublishedArticles();
  const latest = (data ?? []).slice(0, 4);

  if (isLoading) {
    return (
      <section className="container py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="w-full aspect-square rounded-xl" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (latest.length === 0) return null;

  return (
    <section className="container py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {latest.map((article, i) => (
          <Link key={article.id} to={`/article/${article.slug}`}>
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group cursor-pointer"
            >
              <div className="overflow-hidden rounded-xl">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="mt-3 space-y-2">
                <span className="text-xs font-semibold text-primary">
                  {article.category}
                </span>
                <h3 className="text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                  <span className="font-medium">{article.author}</span>
                  <span>{article.dateShort}</span>
                </div>
              </div>
            </motion.article>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ContentGrid;
