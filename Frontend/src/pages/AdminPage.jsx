import { useState } from "react";
import { BookOpen, Users, BarChart3 } from "lucide-react";
import { AdminCursosTab } from "@/pages/admin/AdminCursosTab";
import { AdminUsuariosTab } from "@/pages/admin/AdminUsuariosTab";
import { AdminStatsTab } from "@/pages/admin/AdminStatsTab";

export default function AdminPage() {
  const [tab, setTab] = useState("stats");

  const tabs = [
    { key: "stats", label: "Estadísticas", icon: <BarChart3 size={15} /> },
    { key: "cursos", label: "Cursos", icon: <BookOpen size={15} /> },
    { key: "usuarios", label: "Usuarios", icon: <Users size={15} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Panel de administración</h1>
        <p className="text-muted-foreground text-sm">
          Gestioná el catálogo de cursos, los usuarios y mirá las métricas de la plataforma.
        </p>
      </div>

      <div className="flex gap-1 p-1 rounded-lg bg-muted mb-8 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium rounded-md transition-all ${
              tab === t.key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {tab === "stats" && <AdminStatsTab />}
      {tab === "cursos" && <AdminCursosTab />}
      {tab === "usuarios" && <AdminUsuariosTab />}
    </div>
  );
}
