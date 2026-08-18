import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSection from "@/components/NewsletterSection";
import Seo from "@/components/Seo";
import ArticleCardGrid, { ArticleGridSkeleton } from "@/components/ArticleCardGrid";
import { usePublishedArticles } from "@/hooks/useArticles";

const Author = () => {
  const { authorName } = useParams();
  const author = authorName ? decodeURIComponent(authorName) : "";
  const { data, isLoading } = usePublishedArticles();

  const articles = (data ?? []).filter((a) => a.author === author);
  const role = articles[0]?.role ?? "";
  const authorPath = `/author/${encodeURIComponent(author)}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Seo title={author ? `${author} — Articles` : "Author"} path={authorPath} />
        <Header />
        <main className="container py-10">
          <div className="h-9 w-64 animate-pulse rounded bg-muted" />
          <ArticleGridSkeleton count={3} />
        </main>
        <Footer />
      </div>
    );
  }

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

          <ArticleCardGrid articles={articles} />
        </section>
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Author;
