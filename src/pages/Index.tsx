import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import TopicClusters from "@/components/TopicClusters";
import ContentGrid from "@/components/ContentGrid";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";

const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "MSD Insights",
  url: "/",
  description: "B2B marketing, sales enablement, and customer success insights.",
};

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="MSD Insights — Marketing Insights & Strategy"
        description="Your central hub for marketing strategy, sales enablement, and customer success insights from the MSD Insights team."
        path="/"
        jsonLd={websiteLd}
      />
      <Header />
      <main>
        <HeroSection />
        <TopicClusters />
        <ContentGrid />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
