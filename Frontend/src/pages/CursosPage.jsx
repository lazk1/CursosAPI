import { useEffect, useState } from "react";
import { BookOpen, Search, Filter } from "lucide-react";
import { cursoService } from "@/services/cursoService";
import { CourseCard } from "@/components/CourseCard";
import { CardSkeleton } from "@/components/Loader";

export function CursosPage() {
  const [cursos, setCursos] = useState(null);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");

  useEffect(() => {
    cursoService
      .getAll()
      .then(setCursos)
      .catch(() => setError("No se pudieron cargar los cursos. Probá de nuevo más tarde."));
  }, []);

  const filters = [
    { key: "todos", label: "Todos" },
    { key: "gratis", label: "Gratis" },
    { key: "premium", label: "Premium" },
  ];

  const filtered = (cursos ?? []).filter((c) => {
    const matchSearch =
      c.titulo.toLowerCase().includes(search.toLowerCase()) ||
      c.descripcion.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "todos" || (filter === "gratis" ? !c.esPago : c.esPago);
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-2">Cursos</h1>
        <p className="text-muted-foreground">
          {cursos ? `${cursos.length} cursos disponibles · ${cursos.filter((c) => !c.esPago).length} gratuitos` : "Cargando catálogo..."}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cursos..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          <Filter size={14} className="text-muted-foreground shrink-0" />
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-lg bg-destructive/10 text-destructive text-sm mb-6">
          {error}
        </div>
      )}

      {cursos === null && !error ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No se encontraron cursos con ese criterio.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((curso) => (
            <CourseCard key={curso.id} curso={curso} />
          ))}
        </div>
      )}
    </div>
  );
}
