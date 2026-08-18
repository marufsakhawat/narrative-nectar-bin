import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { categories, slugify } from "@/lib/articles";
import { useArticleById } from "@/hooks/useArticles";

interface FormState {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  author_role: string;
  category: string;
  featured_image_url: string;
  published_at: string;
  read_time: string;
  status: string;
}

const emptyForm: FormState = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  author: "",
  author_role: "",
  category: categories[0],
  featured_image_url: "",
  published_at: new Date().toISOString().slice(0, 10),
  read_time: "5 min read",
  status: "draft",
};

const ArticleForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: existing, isLoading } = useArticleById(id);

  const [form, setForm] = useState<FormState>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!existing) return;
    setForm({
      title: existing.title ?? "",
      slug: existing.slug ?? "",
      content: existing.content ?? "",
      excerpt: existing.excerpt ?? "",
      author: existing.author ?? "",
      author_role: existing.author_role ?? "",
      category: existing.category || categories[0],
      featured_image_url: existing.featured_image_url ?? "",
      published_at: new Date(existing.published_at).toISOString().slice(0, 10),
      read_time: existing.read_time ?? "",
      status: existing.status ?? "draft",
    });
    setSlugTouched(true);
  }, [existing]);

  const set = (key: keyof FormState, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onTitleChange = (value: string) => {
    setForm((f) => ({ ...f, title: value, slug: slugTouched ? f.slug : slugify(value) }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "Title is required";
    if (!form.slug.trim()) next.slug = "Slug is required";
    else if (!/^[a-z0-9-]+$/.test(form.slug))
      next.slug = "Use lowercase letters, numbers, and dashes only";
    if (!form.content.trim()) next.content = "Content is required";
    if (!form.excerpt.trim()) next.excerpt = "Excerpt is required";
    if (!form.author.trim()) next.author = "Author is required";
    if (!form.category.trim()) next.category = "Category is required";
    if (!form.published_at) next.published_at = "Publish date is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    // Slug uniqueness check
    let slugQuery = supabase.from("articles").select("id").eq("slug", form.slug);
    if (isEdit) slugQuery = slugQuery.neq("id", id!);
    const { data: clash, error: clashError } = await slugQuery.maybeSingle();
    if (clashError) {
      setSaving(false);
      toast.error(clashError.message);
      return;
    }
    if (clash) {
      setSaving(false);
      setErrors((p) => ({ ...p, slug: "That slug is already taken — try another." }));
      return;
    }

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      content: form.content,
      excerpt: form.excerpt.trim(),
      author: form.author.trim(),
      author_role: form.author_role.trim() || null,
      category: form.category,
      featured_image_url: form.featured_image_url.trim() || null,
      published_at: new Date(`${form.published_at}T12:00:00`).toISOString(),
      read_time: form.read_time.trim() || null,
      status: form.status,
    };

    const { error } = isEdit
      ? await supabase.from("articles").update(payload).eq("id", id!)
      : await supabase.from("articles").insert(payload);

    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["admin", "articles"] });
    queryClient.invalidateQueries({ queryKey: ["articles"] });
    queryClient.invalidateQueries({ queryKey: ["article"] });
    toast.success(isEdit ? "Article updated" : "Article created");
    navigate("/admin");
  };

  const fieldError = (key: string) =>
    errors[key] ? <p className="mt-1 text-xs text-destructive">{errors[key]}</p> : null;

  return (
    <>
      <Seo title={isEdit ? "Edit Article" : "New Article"} />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container flex h-16 items-center justify-between">
            <Link
              to="/admin"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back to dashboard
            </Link>
            <span className="text-sm font-semibold text-foreground">
              {isEdit ? "Edit article" : "New article"}
            </span>
          </div>
        </header>

        <main className="container max-w-3xl py-10">
          {isEdit && isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => onTitleChange(e.target.value)}
                  placeholder="How we rebuilt our content engine"
                />
                {fieldError("title")}
              </div>

              <div>
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", e.target.value);
                  }}
                  placeholder="how-we-rebuilt-our-content-engine"
                />
                {fieldError("slug")}
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  rows={3}
                  value={form.excerpt}
                  onChange={(e) => set("excerpt", e.target.value)}
                />
                {fieldError("excerpt")}
              </div>

              <div>
                <Label htmlFor="content">Content (markdown) *</Label>
                <Textarea
                  id="content"
                  rows={16}
                  className="font-mono text-sm"
                  value={form.content}
                  onChange={(e) => set("content", e.target.value)}
                  placeholder={"Intro paragraph...\n\n## A section heading\n\nMore text..."}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Separate paragraphs with a blank line. Prefix headings with “## ”.
                </p>
                {fieldError("content")}
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={form.author}
                    onChange={(e) => set("author", e.target.value)}
                  />
                  {fieldError("author")}
                </div>
                <div>
                  <Label htmlFor="author_role">Author role</Label>
                  <Input
                    id="author_role"
                    value={form.author_role}
                    onChange={(e) => set("author_role", e.target.value)}
                    placeholder="VP of Marketing, MsDevs Insights"
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <Label>Category *</Label>
                  <Select value={form.category} onValueChange={(v) => set("category", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldError("category")}
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => set("status", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="image">Featured image URL</Label>
                <Input
                  id="image"
                  value={form.featured_image_url}
                  onChange={(e) => set("featured_image_url", e.target.value)}
                  placeholder="/images/hero-featured.jpg or https://…"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <Label htmlFor="published_at">Publish date *</Label>
                  <Input
                    id="published_at"
                    type="date"
                    value={form.published_at}
                    onChange={(e) => set("published_at", e.target.value)}
                  />
                  {fieldError("published_at")}
                </div>
                <div>
                  <Label htmlFor="read_time">Read time</Label>
                  <Input
                    id="read_time"
                    value={form.read_time}
                    onChange={(e) => set("read_time", e.target.value)}
                    placeholder="8 min read"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEdit ? "Save changes" : "Create article"}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate("/admin")}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </main>
      </div>
    </>
  );
};

export default ArticleForm;
