import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSection from "@/components/NewsletterSection";
import Seo from "@/components/Seo";
import { allArticles, sortByDateDesc } from "@/data/articles";

const Author = () => {
  const { authorName } = useParams();
  const author = authorName ? decodeURIComponent(authorName) : "";

  const articles = sortByDateDesc(
    allArticles.filter((a) => a.author === author),
  );
  const role = articles[0]?.role ?? "";
  const authorPath = `/author/${encodeURIComponent(author)}`;

  if (!author || articles.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Seo
          title={author ? `${author} — Articles` : "Author not found"}
          path={authorPath}
          description={`No articles found for ${author || "this author"} on MsDevs Insights.`}
        />
        <Header />
        <main className="container max-w-3xl mx-auto py-20 px-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">
            {author ? "No articles found" : "Author not found"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {author
              ? `We couldn't find any articles by ${author}.`
              : "We couldn't find the author you're looking for."}
          </p>
          <Link to="/blog" className="mt-4 inline-block text-primary hover:underline">
            ← Browse all articles
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={`${author} — Articles`}
        path={authorPath}
        description={`Articles written by ${author}${role ? `, ${role}` : ""} on MsDevs Insights.`}
      />
      <Header />
      <main>
        <section className="container py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link
              to="/blog"
              className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              ← Back to Blog
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">{author}</h1>
            {role && <p className="mt-2 text-muted-foreground">{role}</p>}
            <p className="mt-1 text-sm text-muted-foreground">
              {articles.length} {articles.length === 1 ? "article" : "articles"}
            </p>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
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
        </section>
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Author;
