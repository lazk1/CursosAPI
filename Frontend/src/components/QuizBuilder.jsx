import { Plus, Trash2 } from "lucide-react";
import { crearPreguntaVacia } from "@/lib/quiz";

const MAX_OPCIONES = 6;
const MIN_OPCIONES = 2;

export function QuizBuilder({ preguntas, onChange }) {
  function agregarPregunta() {
    onChange([...preguntas, crearPreguntaVacia()]);
  }

  function eliminarPregunta(index) {
    onChange(preguntas.filter((_, i) => i !== index));
  }

  function actualizarPregunta(index, cambios) {
    onChange(preguntas.map((p, i) => (i === index ? { ...p, ...cambios } : p)));
  }

  function actualizarTextoPregunta(index, texto) {
    actualizarPregunta(index, { pregunta: texto });
  }

  function agregarOpcion(index) {
    const p = preguntas[index];
    if (p.opciones.length >= MAX_OPCIONES) return;
    actualizarPregunta(index, { opciones: [...p.opciones, ""] });
  }

  function eliminarOpcion(index, opcionIdx) {
    const p = preguntas[index];
    if (p.opciones.length <= MIN_OPCIONES) return;
    const nuevasOpciones = p.opciones.filter((_, i) => i !== opcionIdx);
    let nuevaCorrecta = p.correcta;
    if (opcionIdx === p.correcta) nuevaCorrecta = 0;
    else if (opcionIdx < p.correcta) nuevaCorrecta = p.correcta - 1;
    actualizarPregunta(index, { opciones: nuevasOpciones, correcta: nuevaCorrecta });
  }

  function actualizarTextoOpcion(index, opcionIdx, texto) {
    const p = preguntas[index];
    const nuevasOpciones = p.opciones.map((o, i) => (i === opcionIdx ? texto : o));
    actualizarPregunta(index, { opciones: nuevasOpciones });
  }

  function marcarCorrecta(index, opcionIdx) {
    actualizarPregunta(index, { correcta: opcionIdx });
  }

  return (
    <div className="flex flex-col gap-4">
      {preguntas.map((p, i) => (
        <div key={i} className="p-4 rounded-lg border border-border bg-background/50 flex flex-col gap-3">
          <div className="flex items-start gap-2">
            <input
              type="text"
              placeholder={`Pregunta ${i + 1}`}
              value={p.pregunta}
              onChange={(e) => actualizarTextoPregunta(i, e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-input-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button
              type="button"
              onClick={() => eliminarPregunta(i)}
              className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
              title="Eliminar pregunta"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-2 pl-1">
            <p className="text-xs text-muted-foreground">
              Marcá la respuesta correcta con el círculo de la izquierda:
            </p>
            {p.opciones.map((opcion, oi) => (
              <div key={oi} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correcta-${i}`}
                  checked={p.correcta === oi}
                  onChange={() => marcarCorrecta(i, oi)}
                  className="accent-primary shrink-0"
                  title="Marcar como correcta"
                />
                <input
                  type="text"
                  placeholder={`Opción ${oi + 1}`}
                  value={opcion}
                  onChange={(e) => actualizarTextoOpcion(i, oi, e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-input-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  type="button"
                  onClick={() => eliminarOpcion(i, oi)}
                  disabled={p.opciones.length <= MIN_OPCIONES}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30 disabled:hover:bg-transparent shrink-0"
                  title="Eliminar opción"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => agregarOpcion(i)}
              disabled={p.opciones.length >= MAX_OPCIONES}
              className="self-start flex items-center gap-1 text-xs font-medium text-primary hover:underline disabled:opacity-40 disabled:hover:no-underline mt-1"
            >
              <Plus size={12} />
              Agregar opción
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={agregarPregunta}
        className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-dashed border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
      >
        <Plus size={15} />
        Agregar pregunta
      </button>

      {preguntas.length === 0 && (
        <p className="text-xs text-muted-foreground">Este curso todavía no tiene preguntas de quiz.</p>
      )}
    </div>
  );
}
