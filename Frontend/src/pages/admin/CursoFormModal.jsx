import { useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Loader2 } from "lucide-react";
import { cursoSchema } from "@/schemas";
import { cursoService } from "@/services/cursoService";
import { parseApiError } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { QuizBuilder } from "@/components/QuizBuilder";
import { parsearPreguntas, serializarPregunta } from "@/lib/quiz";

export function CursoFormModal({ cursoExistente, onClose, onSaved }) {
  const toast = useToast();
  const [submitError, setSubmitError] = useState(null);
  const esEdicion = !!cursoExistente;

  const existenteDetalle = cursoExistente;

  const [preguntas, setPreguntas] = useState(() => {
    if (!existenteDetalle?.preguntasQuiz?.length) return [];
    return parsearPreguntas(existenteDetalle.preguntasQuiz).map((p) => ({
      pregunta: p.pregunta,
      opciones: p.esOpcionMultiple ? p.opciones : ["", ""],
      correcta: p.correcta ?? 0,
    }));
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(cursoSchema),
    defaultValues: {
      titulo: cursoExistente?.titulo ?? "",
      descripcion: cursoExistente?.descripcion ?? "",
      imagenPortadaUrl: cursoExistente?.imagenPortadaUrl ?? "",
      videoUrl: existenteDetalle?.videoUrl ?? "",
      materialEscrito: existenteDetalle?.materialEscrito ?? "",
      porcentajeAprobacion: existenteDetalle?.porcentajeAprobacion ?? 70,
      esPago: cursoExistente?.esPago ?? false,
    },
  });

  function validarPreguntas() {
    for (const p of preguntas) {
      if (!p.pregunta.trim()) return "Completá el texto de todas las preguntas.";
      if (p.opciones.length < 2) return "Cada pregunta necesita al menos 2 opciones.";
      if (p.opciones.some((o) => !o.trim())) return "Completá el texto de todas las opciones.";
      if (p.correcta < 0 || p.correcta >= p.opciones.length) {
        return "Marcá cuál es la opción correcta en cada pregunta.";
      }
    }
    return null;
  }

  async function onSubmit(data) {
    setSubmitError(null);

    const errorPreguntas = validarPreguntas();
    if (errorPreguntas) {
      setSubmitError(errorPreguntas);
      return;
    }

    const preguntasQuiz = preguntas.map((p) => serializarPregunta(p));

    const payload = {
      titulo: data.titulo,
      descripcion: data.descripcion,
      imagenPortadaUrl: data.imagenPortadaUrl,
      videoUrl: data.videoUrl,
      materialEscrito: data.materialEscrito,
      porcentajeAprobacion: data.porcentajeAprobacion,
      esPago: data.esPago,
      preguntasQuiz,
    };

    try {
      if (esEdicion && cursoExistente) {
        await cursoService.updateOneById(cursoExistente.id, {
          ...payload,
          id: cursoExistente.id,
          isActivo: existenteDetalle?.isActivo ?? true,
        });
        toast.success("Curso actualizado.");
      } else {
        await cursoService.createOne(payload);
        toast.success("Curso creado.");
      }
      onSaved();
    } catch (err) {
      setSubmitError(parseApiError(err).message);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl p-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors"
        >
          <X size={16} className="text-muted-foreground" />
        </button>

        <h2 className="text-lg font-bold text-foreground mb-6">
          {esEdicion ? "Editar curso" : "Crear curso"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {submitError && (
            <div className="px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-sm">
              {submitError}
            </div>
          )}

          <TextField label="Título" error={errors.titulo?.message} {...register("titulo")} />
          <TextArea label="Descripción" rows={3} error={errors.descripcion?.message} {...register("descripcion")} />
          <TextField
            label="URL imagen de portada"
            error={errors.imagenPortadaUrl?.message}
            {...register("imagenPortadaUrl")}
          />
          <TextField
            label="URL del video (YouTube, Vimeo o archivo .mp4)"
            error={errors.videoUrl?.message}
            {...register("videoUrl")}
          />
          <TextArea label="Material escrito" rows={4} error={errors.materialEscrito?.message} {...register("materialEscrito")} />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">% de aprobación</label>
            <input
              type="number"
              min={1}
              max={100}
              className="w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              {...register("porcentajeAprobacion", { valueAsNumber: true })}
            />
            {errors.porcentajeAprobacion && (
              <p className="text-xs text-destructive">{errors.porcentajeAprobacion.message}</p>
            )}
          </div>

          <label className="flex items-center gap-2.5 text-sm text-foreground">
            <input type="checkbox" className="w-4 h-4 accent-primary" {...register("esPago")} />
            Es un curso Premium (de pago)
          </label>

          <div className="pt-2 border-t border-border">
            <label className="text-sm font-medium text-foreground mb-3 block">
              Quiz del curso (opción múltiple, una respuesta correcta)
            </label>
            <QuizBuilder preguntas={preguntas} onChange={setPreguntas} />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-1 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {isSubmitting && <Loader2 size={15} className="animate-spin" />}
            {esEdicion ? "Guardar cambios" : "Crear curso"}
          </button>
        </form>
      </div>
    </div>
  );
}

const TextField = forwardRef(function TextField({ label, error, ...rest }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        ref={ref}
        className={`w-full px-3 py-2.5 rounded-lg bg-input-background border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 ${
          error ? "border-destructive" : "border-border"
        }`}
        {...rest}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
});

const TextArea = forwardRef(function TextArea({ label, error, rows = 3, ...rest }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full px-3 py-2.5 rounded-lg bg-input-background border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none ${
          error ? "border-destructive" : "border-border"
        }`}
        {...rest}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
});