import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { Headphones, Play, Clock, ChevronDown, Music, Youtube } from "lucide-react";
import article1 from "@/assets/article-1.jpg";
import article2 from "@/assets/article-2.jpg";
import article3 from "@/assets/article-3.jpg";
import article4 from "@/assets/article-4.jpg";

// Real public sample audio tracks (SoundHelix) — cycled so episodes vary.
const audioTracks = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
];

// Real public YouTube video IDs — cycled so episodes vary.
const youtubeIds = [
  "aqz-KE-bpKQ",
  "LXb3EKWsInQ",
  "jNQXAC9IVRw",
  "9bZkp7q19f0",
  "kJQP7kiw5Fk",
  "AdUw5RdyZxI",
];

const episodes = [
  { id: 1, title: "The AI Content Revolution: Hype vs. Reality", guest: "Sarah Chen, VP of Content at Jasper", duration: "42 min", date: "Feb 24, 2026", description: "Sarah shares how her team uses AI to produce 3x more content without sacrificing quality, and the guardrails they've put in place.", image: article1 },
  { id: 2, title: "Building a Media Company Inside Your SaaS", guest: "James Patterson, CMO at Drift", duration: "38 min", date: "Feb 17, 2026", description: "Why Drift invested in becoming a media brand, and how their podcast and video content drives 40% of pipeline.", image: article2 },
  { id: 3, title: "From 0 to 100K Subscribers: A Newsletter Growth Story", guest: "Lenny Rachitsky, Lenny's Newsletter", duration: "55 min", date: "Feb 10, 2026", description: "Lenny breaks down his exact growth playbook, monetization strategy, and the systems that keep his newsletter running.", image: article3 },
  { id: 4, title: "The Future of SEO After AI Overviews", guest: "Lily Ray, VP of SEO at Amsive Digital", duration: "47 min", date: "Feb 3, 2026", description: "With Google's AI reshaping search results, Lily explains what content teams need to do differently to maintain organic visibility.", image: article4 },
  { id: 5, title: "Community-Led Growth: More Than a Buzzword", guest: "Kathleen Booth, SVP of Marketing at Pavilion", duration: "36 min", date: "Jan 27, 2026", description: "Kathleen shares how Pavilion built a thriving community of 10,000+ executives and turned it into their primary growth engine.", image: article1 },
  { id: 6, title: "Content Operations at Scale: Lessons from Enterprise", guest: "Robert Rose, Chief Strategy Advisor at CMI", duration: "51 min", date: "Jan 20, 2026", description: "Robert discusses the operational frameworks that separate mature content organizations from those still stuck in ad-hoc production.", image: article2 },
];

const Podcasts = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleEpisode = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Podcasts"
        description="The MsDevs Insights Podcast — weekly conversations with the minds shaping modern marketing."
        path="/podcasts"
      />
      <Header />
      <main>
        <section className="container py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <Headphones className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">The MsDevs Insights Podcast</h1>
              <p className="mt-1 text-muted-foreground">Weekly conversations with the minds shaping modern marketing.</p>
            </div>
          </motion.div>

          <div className="mt-10 space-y-4">
            {episodes.map((ep, i) => {
              const isExpanded = expandedId === ep.id;
              const audioSrc = audioTracks[(ep.id - 1) % audioTracks.length];
              const youtubeId = youtubeIds[(ep.id - 1) % youtubeIds.length];

              return (
                <motion.div
                  key={ep.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`rounded-xl border bg-card transition-shadow ${isExpanded ? "border-primary shadow-lg" : "border-border hover:shadow-lg"}`}
                >
                  <button
                    type="button"
                    onClick={() => toggleEpisode(ep.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`episode-panel-${ep.id}`}
                    className="flex w-full gap-5 p-4 text-left group cursor-pointer rounded-xl"
                  >
                    <div className="relative shrink-0 w-28 h-28 rounded-lg overflow-hidden">
                      <img src={ep.image} alt={ep.title} className="w-full h-full object-cover" />
                      <div className={`absolute inset-0 bg-foreground/30 flex items-center justify-center transition-opacity ${isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
                        <Play className="h-8 w-8 text-primary-foreground fill-current" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>Episode {ep.id}</span>
                        <span>{ep.date}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{ep.duration}</span>
                      </div>
                      <h2 className={`text-base font-bold transition-colors ${isExpanded ? "text-primary" : "text-foreground group-hover:text-primary"}`}>{ep.title}</h2>
                      <p className="text-xs font-medium text-primary">{ep.guest}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{ep.description}</p>
                    </div>
                    <div className="hidden sm:flex shrink-0 items-start">
                      <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      </motion.div>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        id={`episode-panel-${ep.id}`}
                        key="panel"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-2 space-y-4 border-t border-border">
                          <div>
                            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              <Music className="h-3.5 w-3.5" />
                              <span>Listen to the audio</span>
                            </div>
                            <audio controls preload="none" className="w-full">
                              <source src={audioSrc} type="audio/mpeg" />
                              Your browser does not support the audio element.
                            </audio>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              <Youtube className="h-3.5 w-3.5" />
                              <span>Watch the video</span>
                            </div>
                            <div className="relative w-full overflow-hidden rounded-lg pt-[56.25%]">
                              <iframe
                                className="absolute inset-0 h-full w-full"
                                src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                                title={`${ep.title} — video`}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                loading="lazy"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Podcasts;
