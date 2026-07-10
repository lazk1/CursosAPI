import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Crown } from "lucide-react";
import { cursoService } from "@/services/cursoService";
import { parseApiError } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { CursoFormModal } from "@/pages/admin/CursoFormModal";

export function AdminCursosTab() {
  const [cursos, setCursos] = useState(null);
  const [modalCurso, setModalCurso] = useState(null); // null | "new" | CursoDTO
  const [loadingEditId, setLoadingEditId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const toast = useToast();

  async function handleEdit(id) {
    setLoadingEditId(id);
    try {
      const detalle = await cursoService.getOneById(id);
      setModalCurso(detalle);
    } catch (err) {
      toast.error(parseApiError(err).message);
    } finally {
      setLoadingEditId(null);
    }
  }

  async function reload() {
    try {
      setCursos(await cursoService.getAll());
    } catch (err) {
      toast.error(parseApiError(err).message);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  async function handleDelete(id) {
    if (!confirm("¿Seguro que querés eliminar este curso? Esta acción no se puede deshacer.")) return;
    setDeletingId(id);
    try {
      await cursoService.deleteOneById(id);
      toast.success("Curso eliminado.");
      reload();
    } catch (err) {
      toast.error(parseApiError(err).message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {cursos ? `${cursos.length} cursos en total` : "Cargando..."}
        </p>
        <button
          onClick={() => setModalCurso("new")}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={15} />
          Nuevo curso
        </button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {(cursos ?? []).map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-4 py-3 text-foreground font-medium max-w-xs truncate">{c.titulo}</td>
                <td className="px-4 py-3">
                  {c.esPago ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                      <Crown size={11} />
                      Premium
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-xs font-semibold">
                      Gratis
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{c.isActivo ? "Activo" : "Inactivo"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1.5">
                    <button
                      onClick={() => handleEdit(c.id)}
                      disabled={loadingEditId === c.id}
                      className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                      title="Editar"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      disabled={deletingId === c.id}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {cursos && cursos.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-10">
            No hay cursos todavía. Creá el primero.
          </p>
        )}
      </div>

      {modalCurso !== null && (
        <CursoFormModal
          cursoExistente={modalCurso === "new" ? null : modalCurso}
          onClose={() => setModalCurso(null)}
          onSaved={() => {
            setModalCurso(null);
            reload();
          }}
        />
      )}
    </div>
  );
}
