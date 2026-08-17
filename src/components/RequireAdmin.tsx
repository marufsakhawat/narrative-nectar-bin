import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { session, canEdit, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;

  if (!canEdit) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 px-4 text-center">
        <h1 className="text-xl font-semibold text-foreground">No access</h1>
        <p className="text-sm text-muted-foreground">
          This account doesn&apos;t have admin or author permissions.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAdmin;
