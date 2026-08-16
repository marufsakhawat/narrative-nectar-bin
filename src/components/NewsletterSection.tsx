import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "duplicate">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();

    if (!EMAIL_REGEX.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email: trimmed });

      if (error) {
        // 23505 = unique_violation (duplicate email)
        if (error.code === "23505") {
          setStatus("duplicate");
          setMessage("You're already subscribed!");
        } else {
          setStatus("error");
          setMessage("Something went wrong. Please try again.");
        }
        return;
      }

      setStatus("success");
      setMessage("You're in! Check your inbox.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <section id="newsletter" className="bg-primary text-primary-foreground">
      <div className="container py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-foreground/20">
              <Mail className="h-6 w-6" />
            </div>
          </div>
          <h2 className="text-3xl font-bold">Stay ahead of the curve</h2>
          <p className="mt-3 text-primary-foreground/80">
            Join 25,000+ marketers getting weekly insights on strategy, AI, and growth.
          </p>

          {status !== "success" && (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error" || status === "duplicate") setStatus("idle");
                }}
                placeholder="Enter your email"
                required
                disabled={status === "loading"}
                className="rounded-lg border-2 border-primary-foreground/30 bg-primary-foreground/10 px-4 py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:border-primary-foreground/60 focus:outline-none sm:w-80 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center justify-center gap-2 rounded-lg bg-primary-foreground px-6 py-3 text-sm font-semibold text-primary transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}

          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 flex items-center justify-center gap-2 text-lg font-medium"
            >
              <CheckCircle2 className="h-6 w-6" />
              <span>{message}</span>
            </motion.div>
          )}

          {status === "duplicate" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-primary-foreground/90"
            >
              <CheckCircle2 className="h-5 w-5" />
              <span>{message}</span>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-primary-foreground bg-primary-foreground/10 rounded-lg px-4 py-2"
            >
              <AlertCircle className="h-5 w-5" />
              <span>{message}</span>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
