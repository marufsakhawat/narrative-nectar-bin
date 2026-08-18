import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import type { Article } from "@/lib/articles";

export const ArticleGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="space-y-3">
        <Skeleton className="w-full aspect-[16/10] rounded-xl" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    ))}
  </div>
);

const ArticleCardGrid = ({ articles }: { articles: Article[] }) => (
  <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {articles.map((post, i) => (
      <motion.article
        key={post.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: Math.min(i * 0.05, 0.4) }}
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group"
      >
        <Link to={`/article/${post.slug}`} className="block">
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
);

export default ArticleCardGrid;
