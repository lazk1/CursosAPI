import { useEffect, useState } from "react";
import { BookOpen, Users, Crown, Gift } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { cursoService } from "@/services/cursoService";
import { userService } from "@/services/adminServices";
import { parseApiError } from "@/lib/api";
import { useToast } from "@/components/Toast";

export function AdminStatsTab() {
  const [totalCursos, setTotalCursos] = useState(null);
  const [gratis, setGratis] = useState(0);
  const [premium, setPremium] = useState(0);
  const [totalUsers, setTotalUsers] = useState(null);
  const [usuariosPremium, setUsuariosPremium] = useState(0);
  const toast = useToast();

  useEffect(() => {
    Promise.all([cursoService.getAll(), userService.getAll()])
      .then(([cursos, users]) => {
        setTotalCursos(cursos.length);
        setGratis(cursos.filter((c) => !c.esPago).length);
        setPremium(cursos.filter((c) => c.esPago).length);
        setTotalUsers(users.length);
        setUsuariosPremium(users.filter((u) => u.roles.some((r) => r.name === "UserPremium")).length);
      })
      .catch((err) => toast.error(parseApiError(err).message));
  }, []);

  const data = [
    { name: "Gratis", value: gratis, color: "#10b981" },
    { name: "Premium", value: premium, color: "#a78bfa" },
  ];

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard icon={<BookOpen size={18} />} label="Total de cursos" value={totalCursos} />
        <StatCard icon={<Users size={18} />} label="Total de usuarios" value={totalUsers} />
        <StatCard icon={<Gift size={18} />} label="Cursos gratuitos" value={gratis} />
        <StatCard icon={<Crown size={18} />} label="Usuarios Premium" value={usuariosPremium} />
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Cursos por tipo</h3>
        {totalCursos ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                  {data.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-10 text-center">Todavía no hay datos suficientes.</p>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="p-5 rounded-xl border border-border bg-card">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3 text-primary">
        {icon}
      </div>
      <p className="text-2xl font-bold text-foreground font-mono">{value ?? "—"}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
