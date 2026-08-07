import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { topicClusters } from "@/data/articles";
import { BookOpen, TrendingUp, Users, Box } from "lucide-react";

const icons = [BookOpen, TrendingUp, Users, Box];

const TopicClusters = () => {
  return (
    <section className="container py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {topicClusters.map((topic, i) => {
          const Icon = icons[i];
          return (
            <motion.div
              key={topic.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={`/blog?category=${encodeURIComponent(topic.name)}`}
                className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center transition-shadow hover:shadow-lg block"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground">{topic.name}</span>
                <span className="text-xs text-muted-foreground">{topic.count} articles</span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TopicClusters;
