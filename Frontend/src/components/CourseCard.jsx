import { Link } from "wouter";
import { Lock, Crown } from "lucide-react";

export function CourseCard({ curso }) {
  const bloqueado = curso.esPago && !curso.tieneAcceso;

  return (
    <Link href={`/cursos/${curso.id}`}>
      <div className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer h-full">
        <div className="relative aspect-video bg-muted overflow-hidden">
          <img
            src={curso.imagenPortadaUrl}
            alt={curso.titulo}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              bloqueado ? "opacity-50 blur-[1px]" : ""
            }`}
            onError={(e) => {
              e.target.src = "https://placehold.co/600x340/1e2028/8b92a5?text=devCursos";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {curso.esPago ? (
            <span className="absolute top-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary text-primary-foreground text-xs font-bold font-mono">
              <Crown size={10} />
              PREMIUM
            </span>
          ) : (
            <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-emerald-500 text-white text-xs font-bold font-mono">
              GRATIS
            </span>
          )}

          {bloqueado && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm">
                <Lock size={13} className="text-white" />
                <span className="text-white text-xs font-medium">Exclusivo Premium</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 p-4 gap-2">
          <h3 className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors">
            {curso.titulo}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
            {curso.descripcion}
          </p>
        </div>
      </div>
    </Link>
  );
}
