import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, LogOut, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAdmin, signOut } = useAuth();
  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { data: articles, isLoading, error } = useQuery({
    queryKey: ["admin", "articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, author, category, status, published_at")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    const { error } = await supabase.from("articles").delete().eq("id", pendingDelete.id);
    setDeleting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Article deleted");
    setPendingDelete(null);
    queryClient.invalidateQueries({ queryKey: ["admin", "articles"] });
    queryClient.invalidateQueries({ queryKey: ["articles"] });
  };

  return (
    <>
      <Seo title="Admin Dashboard" description="Manage MsDevs Insights articles." />
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container flex h-16 items-center justify-between">
            <Link to="/" className="text-lg font-bold tracking-tight text-foreground">
              MsDevs<span className="text-primary">Insights</span>
            </Link>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-muted-foreground sm:inline">
                {user?.email} {isAdmin ? "(admin)" : "(author)"}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await signOut();
                  navigate("/admin/login", { replace: true });
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </header>

        <main className="container py-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Articles</h1>
              <p className="text-sm text-muted-foreground">
                {articles?.length ?? 0} article{articles?.length === 1 ? "" : "s"}
              </p>
            </div>
            <Button asChild>
              <Link to="/admin/articles/new">
                <Plus className="mr-2 h-4 w-4" />
                New Article
              </Link>
            </Button>
          </div>

          {isLoading && (
            <div className="flex justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <p className="py-8 text-sm text-destructive">
              Could not load articles: {(error as Error).message}
            </p>
          )}

          {articles && articles.length > 0 && (
            <div className="rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Author</TableHead>
                    <TableHead className="hidden lg:table-cell">Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Published</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="max-w-xs font-medium text-foreground">
                        {article.title}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {article.author}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {article.category}
                      </TableCell>
                      <TableCell>
                        <span
                          className={
                            article.status === "published"
                              ? "rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                              : "rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                          }
                        >
                          {article.status}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground">
                        {new Date(article.published_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/admin/articles/${article.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setPendingDelete({ id: article.id, title: article.title })
                            }
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {articles && articles.length === 0 && !isLoading && (
            <p className="py-16 text-center text-sm text-muted-foreground">No articles yet.</p>
          )}
        </main>
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this article?</AlertDialogTitle>
            <AlertDialogDescription>
              “{pendingDelete?.title}” will be permanently removed. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleting}
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminDashboard;
