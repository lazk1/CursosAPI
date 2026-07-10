import { lazy, Suspense, useEffect, useState } from "react";
import { Route, Switch } from "wouter";
import { Navbar } from "@/components/Navbar";
import { PageLoader } from "@/components/Loader";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ToastProvider } from "@/components/Toast";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { CursosPage } from "@/pages/CursosPage";
import { useAuthStore } from "@/store/authStore";

// Componentes grandes cargados de forma perezosa (React.lazy + Suspense).
const CursoDetailPage = lazy(() => import("@/pages/CursoDetailPage"));
const AdminPage = lazy(() => import("@/pages/AdminPage"));

export default function App() {
  const [dark, setDark] = useState(true);
  const checkSession = useAuthStore((s) => s.checkSession);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar dark={dark} setDark={setDark} />

        <main>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/cursos" component={CursosPage} />
            <Route path="/cursos/:id">
              <Suspense fallback={<PageLoader />}>
                <CursoDetailPage />
              </Suspense>
            </Route>
            <Route path="/admin">
              <Suspense fallback={<PageLoader />}>
                <ProtectedRoute requireAdmin>
                  <AdminPage />
                </ProtectedRoute>
              </Suspense>
            </Route>
            <Route>
              <div className="max-w-xl mx-auto px-4 py-24 text-center">
                <h1 className="text-2xl font-bold text-foreground mb-2">404</h1>
                <p className="text-sm text-muted-foreground">Esta página no existe.</p>
              </div>
            </Route>
          </Switch>
        </main>
      </div>
    </ToastProvider>
  );
}
