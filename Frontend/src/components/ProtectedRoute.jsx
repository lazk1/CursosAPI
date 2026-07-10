import { Redirect } from "wouter";
import { ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { PageLoader } from "@/components/Loader";

// requireAdmin=true → solo Admin puede entrar.
// Si no, solo exige estar logueado (cualquier rol).
export function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isAuthChecked, isAdmin } = useAuthStore();

  if (!isAuthChecked) return <PageLoader />;

  if (!user) return <Redirect to="/login" />;

  if (requireAdmin && !isAdmin()) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        <ShieldAlert size={36} className="mx-auto mb-4 text-destructive opacity-70" />
        <h1 className="text-xl font-bold text-foreground mb-2">No tenés acceso a esta sección</h1>
        <p className="text-sm text-muted-foreground">
          Este panel es exclusivo para administradores.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
