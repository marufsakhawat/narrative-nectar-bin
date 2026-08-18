import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublishedArticles } from "@/hooks/useArticles";

const HeroSection = () => {
  const { data, isLoading } = usePublishedArticles();
  const articles = data ?? [];
  const featured = articles[0];
  const featuredPosts = articles.slice(1, 6);

  if (isLoading) {
    return (
      <section className="container py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-4">
            <Skeleton className="w-full aspect-[16/9] rounded-xl" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="hidden lg:block space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!featured) {
    return (
      <section className="container py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground">No published articles yet</h1>
        <p className="mt-2 text-muted-foreground">
          New stories from the MsDevs Insights team are on the way — check back soon.
        </p>
      </section>
    );
  }

  return (
    <section className="container py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
        {/* Featured Article */}
        <Link to={`/article/${featured.slug}`} className="block">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="group cursor-pointer"
          >
            <div className="overflow-hidden rounded-xl">
              <motion.img
                src={featured.image}
                alt={featured.title}
                className="w-full aspect-[16/9] object-cover"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="mt-5 space-y-3">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
                {featured.title}
              </h1>
              <p className="text-muted-foreground text-base max-w-2xl">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{featured.author}</span>
                <span>{featured.dateShort}</span>
                <span>{featured.readTime}</span>
              </div>
            </div>
          </motion.article>
        </Link>

        {/* Featured Posts Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden lg:block"
        >
          <h2 className="text-lg font-bold text-foreground pb-3 border-b border-foreground">
            Featured Posts
          </h2>
          <ul className="divide-y divide-border">
            {featuredPosts.map((post) => (
              <li key={post.id} className="py-4 group cursor-pointer">
                <Link to={`/article/${post.slug}`} className="block">
                  <h3 className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <span>{post.dateShort}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </motion.aside>
      </div>
    </section>
  );
};

export default HeroSection;
