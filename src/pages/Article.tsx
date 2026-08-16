import { useParams, Link } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterSection from "@/components/NewsletterSection";
import Seo from "@/components/Seo";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { getArticleById, getRelatedArticles } from "@/data/articles";

const Article = () => {
  const { id } = useParams();
  const article = getArticleById(id ?? "");
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Seo title="Article not found" path={`/article/${id ?? ""}`} />
        <Header />
        <main className="container max-w-3xl mx-auto py-20 px-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">Article not found</h1>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">
            ← Back to Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const related = getRelatedArticles(article.id, 3);
  const articlePath = `/article/${article.id}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    author: { "@type": "Person", name: article.author, jobTitle: article.role },
    datePublished: article.date,
    articleSection: article.category,
    image: article.image,
    publisher: {
      "@type": "Organization",
      name: "MsDevs Insights",
    },
    mainEntityOfPage: articlePath,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "/blog" },
      { "@type": "ListItem", position: 3, name: article.title, item: articlePath },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={article.title}
        description={article.excerpt}
        path={articlePath}
        type="article"
        image={article.image}
        jsonLd={[articleLd, breadcrumbLd]}
      />
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[60] origin-left"
        style={{ scaleX }}
      />
      <Header />
      <main>
        <article className="container max-w-3xl mx-auto py-10 px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link
              to="/blog"
              className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </Link>

            <span className="text-sm font-semibold text-primary">{article.category}</span>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold text-foreground leading-tight">
              {article.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium text-foreground">{article.author}</span>
                <span className="block text-xs">{article.role}</span>
              </div>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {article.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {article.readTime}
              </span>
            </div>

            <div className="mt-8 overflow-hidden rounded-xl">
              <img
                src={article.image}
                alt={article.title}
                className="w-full aspect-[16/9] object-cover"
              />
            </div>

            <div className="mt-10 space-y-5">
              {article.body.map((paragraph, i) => {
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={i} className="text-2xl font-bold text-foreground pt-4">
                      {paragraph.replace("## ", "")}
                    </h2>
                  );
                }
                return (
                  <p key={i} className="text-lg leading-relaxed text-foreground/90">
                    {paragraph}
                  </p>
                );
              })}
            </div>

            <div className="mt-12 rounded-xl bg-primary/10 border-2 border-primary/30 p-6 text-center">
              <h3 className="text-lg font-bold text-foreground">Want more insights like this?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Join 25,000+ marketers getting weekly strategy breakdowns.
              </p>
              <Link
                to="/#newsletter"
                className="mt-4 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
              >
                Subscribe Free
              </Link>
            </div>
          </motion.div>
        </article>

        {related.length > 0 && (
          <section className="container max-w-4xl mx-auto py-12 px-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Related articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((rel, i) => (
                <motion.article
                  key={rel.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <Link to={`/article/${rel.id}`} className="block">
                    <div className="overflow-hidden rounded-xl">
                      <img
                        src={rel.image}
                        alt={rel.title}
                        className="w-full aspect-[16/10] object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="mt-3 space-y-1.5">
                      <span className="text-xs font-semibold text-primary">{rel.category}</span>
                      <h3 className="text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {rel.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-medium">{rel.author}</span>
                        <span>{rel.dateShort}</span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </section>
        )}

        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Article;
