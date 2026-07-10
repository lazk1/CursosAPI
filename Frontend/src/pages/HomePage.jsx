import { Link } from "wouter";
import {
  Play, Terminal, Layers, GraduationCap, Zap, Code2,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export function HomePage() {
  const { user } = useAuthStore();

  const features = [
    {
      icon: <Terminal size={20} className="text-primary" />,
      title: "Aprendé haciendo",
      desc: "Cada curso trae material escrito, video y un quiz para consolidar lo aprendido.",
    },
    {
      icon: <Layers size={20} className="text-primary" />,
      title: "Gratis y Premium",
      desc: "Arrancá con los cursos gratuitos y pasate a Premium para desbloquear todo el catálogo.",
    },
    {
      icon: <GraduationCap size={20} className="text-primary" />,
      title: "Quiz de aprobación",
      desc: "Cada curso define su propio porcentaje mínimo de aprobación para el quiz final.",
    },
    {
      icon: <Zap size={20} className="text-primary" />,
      title: "Contenido curado",
      desc: "El equipo admin mantiene el catálogo actualizado y organizado.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl -translate-y-1/2 translate-x-1/3" />
        </div>

        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono font-medium mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Plataforma de cursos · UTN San Nicolás
              </div>

              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
                Aprendé a programar{" "}
                <span className="text-primary">de verdad</span>
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                Cursos prácticos de desarrollo. Empezá gratis y pasate a Premium
                cuando quieras desbloquear todo el catálogo.
              </p>

              <div className="flex flex-wrap gap-3">
                {!user && (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                  >
                    <Play size={14} className="fill-current" />
                    Empezar gratis
                  </Link>
                )}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-background/60">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                  <span className="ml-2 text-xs text-muted-foreground font-mono">clase-01.jsx</span>
                </div>
                <div className="p-5 font-mono text-sm leading-relaxed">
                  <p><span className="text-primary">function</span> <span className="text-blue-400">AprenderA Programar</span>() {"{"}</p>
                  <p className="pl-4"><span className="text-primary">const</span> [nivel, setNivel] = useState(<span className="text-orange-400">"principiante"</span>);</p>
                  <p className="pl-4 text-muted-foreground">// practicá con proyectos reales</p>
                  <p className="pl-4"><span className="text-primary">return</span> {"<Curso"}</p>
                  <p className="pl-8">material={"{video}"}</p>
                  <p className="pl-8">quiz={"{true}"}</p>
                  <p className="pl-4">{"/>;"}</p>
                  <p>{"}"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">¿Por qué devCursos?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Diseñado para aprender rápido, sin relleno.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-5 rounded-xl border border-border bg-background hover:border-primary/30 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-16 md:py-20 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-700" />
          <div className="relative max-w-6xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Listo para empezar?
            </h2>
            <p className="text-white/75 mb-8 max-w-md mx-auto">
              Registrate gratis y accedé a los cursos gratuitos del catálogo.
            </p>
            <Link
              href="/login"
              className="inline-block px-6 py-3 rounded-lg bg-white text-primary font-semibold hover:bg-white/90 transition-colors"
            >
              Crear cuenta gratuita
            </Link>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border bg-card py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Code2 size={12} className="text-primary-foreground" />
            </div>
            <span className="font-bold text-sm font-mono text-foreground">devCursos</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Proyecto universitario UTN San Nicolás — Programación 4
          </p>
        </div>
      </footer>
    </div>
  );
}