import { useState } from "react";
import { Link, useLocation } from "wouter";
import { BookOpen, Sun, Moon, LogIn, LogOut, X, Menu, Code2, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/Toast";

export function Navbar({ dark, setDark }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { user, isAdmin, logout } = useAuthStore();
  const toast = useToast();

  async function handleLogout() {
    await logout();
    toast.success("Cerraste sesión. ¡Nos vemos pronto!");
    navigate("/");
  }

  const navLinks = [{ label: "Cursos", href: "/cursos", icon: <BookOpen size={15} /> }];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Code2 size={14} className="text-primary-foreground" />
          </div>
          <span className="font-bold text-base tracking-tight text-foreground font-mono">
            devCursos
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.startsWith(link.href)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          {isAdmin() && (
            <Link
              href="/admin"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.startsWith("/admin")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <ShieldCheck size={15} />
              Admin
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => setDark(!dark)}
            className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-muted transition-colors"
            aria-label="Cambiar tema"
          >
            {dark ? (
              <Sun size={18} className="text-muted-foreground" />
            ) : (
              <Moon size={18} className="text-muted-foreground" />
            )}
          </button>

          {user ? (
            <div className="hidden md:flex items-center gap-2 ml-1">
              <span className="text-xs text-muted-foreground font-mono">{user.userName}</span>
              {user.roles.includes("UserPremium") && (
                <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                  Premium
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <LogOut size={14} />
                Salir
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden md:flex items-center gap-1.5 ml-1 px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <LogIn size={14} />
              Iniciar sesión
            </Link>
          )}

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-muted transition-colors"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          {isAdmin() && (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <ShieldCheck size={15} />
              Admin
            </Link>
          )}
          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setMobileOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted text-foreground text-sm font-semibold"
            >
              <LogOut size={14} />
              Cerrar sesión
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold"
            >
              <LogIn size={14} />
              Iniciar sesión
            </Link>
          )}
        </div>
      )}
    </header>
  );
}