import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { parsearPreguntas } from "@/lib/quiz";

export function QuizPlayer({ preguntasQuiz, porcentajeAprobacion }) {
  const preguntas = parsearPreguntas(preguntasQuiz);
  const preguntasCorregibles = preguntas.filter((p) => p.esOpcionMultiple);

  const [respuestas, setRespuestas] = useState({});
  const [enviado, setEnviado] = useState(false);

  if (preguntas.length === 0) return null;

  function seleccionar(index, opcionIdx) {
    if (enviado) return;
    setRespuestas((prev) => ({ ...prev, [index]: opcionIdx }));
  }

  function reintentar() {
    setRespuestas({});
    setEnviado(false);
  }

  const faltanRespuestas =
    preguntasCorregibles.length > 0 &&
    preguntas.some((p, i) => p.esOpcionMultiple && respuestas[i] === undefined);

  let correctas = 0;
  if (enviado) {
    preguntas.forEach((p, i) => {
      if (p.esOpcionMultiple && respuestas[i] === p.correcta) correctas += 1;
    });
  }
  const total = preguntasCorregibles.length;
  const porcentaje = total > 0 ? Math.round((correctas / total) * 100) : 0;
  const aprobo = porcentaje >= (porcentajeAprobacion ?? 60);

  return (
    <div>
      <div className="flex flex-col gap-4">
        {preguntas.map((p, i) => {
          const respuestaUsuario = respuestas[i];
          const esCorrecta = enviado && p.esOpcionMultiple && respuestaUsuario === p.correcta;
          const esIncorrecta = enviado && p.esOpcionMultiple && respuestaUsuario !== p.correcta;

          return (
            <div
              key={i}
              className={`p-4 rounded-lg border bg-card transition-colors ${
                esCorrecta
                  ? "border-emerald-500/50"
                  : esIncorrecta
                  ? "border-destructive/50"
                  : "border-border"
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-xs font-mono text-primary mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm font-medium text-foreground flex-1">{p.pregunta}</p>
                {esCorrecta && <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />}
                {esIncorrecta && <XCircle size={18} className="text-destructive shrink-0" />}
              </div>

              {p.esOpcionMultiple ? (
                <div className="flex flex-col gap-2 pl-7">
                  {p.opciones.map((opcion, oi) => {
                    const seleccionada = respuestaUsuario === oi;
                    const esLaCorrecta = enviado && oi === p.correcta;
                    return (
                      <label
                        key={oi}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${
                          enviado
                            ? esLaCorrecta
                              ? "border-emerald-500/50 bg-emerald-500/10 text-foreground"
                              : seleccionada
                              ? "border-destructive/50 bg-destructive/10 text-foreground"
                              : "border-border text-muted-foreground"
                            : seleccionada
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border text-foreground hover:border-primary/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`pregunta-${i}`}
                          className="accent-primary"
                          checked={seleccionada}
                          onChange={() => seleccionar(i, oi)}
                          disabled={enviado}
                        />
                        {opcion}
                      </label>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground pl-7">
                  Pregunta de referencia (sin opciones cargadas).
                </p>
              )}
            </div>
          );
        })}
      </div>

      {total > 0 && (
        <div className="mt-6">
          {!enviado ? (
            <button
              onClick={() => setEnviado(true)}
              disabled={faltanRespuestas}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Corregir respuestas
            </button>
          ) : (
            <div
              className={`p-5 rounded-xl border ${
                aprobo ? "border-emerald-500/40 bg-emerald-500/5" : "border-destructive/40 bg-destructive/5"
              }`}
            >
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Respondiste bien {correctas} de {total} ({porcentaje}%)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {aprobo
                      ? `¡Aprobaste! Se necesitaba ${porcentajeAprobacion}% mínimo.`
                      : `No alcanzaste el ${porcentajeAprobacion}% mínimo para aprobar.`}
                  </p>
                </div>
                <button
                  onClick={reintentar}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <RotateCcw size={14} />
                  Reintentar
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
