import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, Clock, Lock, FileText, HelpCircle, Crown } from "lucide-react";
import { cursoService } from "@/services/cursoService";
import { parseApiError } from "@/lib/api";
import { PageLoader } from "@/components/Loader";
import { useAuthStore } from "@/store/authStore";
import { VideoPlayer } from "@/components/VideoPlayer";
import { QuizPlayer } from "@/components/QuizPlayer";

export default function CursoDetailPage() {
  const { id } = useParams();
  const [curso, setCurso] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuthStore();

  useEffect(() => {
    setCurso(null);
    setError(null);
    cursoService
      .getOneById(Number(id))
      .then(setCurso)
      .catch((err) => setError(parseApiError(err)));
  }, [id]);

  if (!curso && !error) return <PageLoader />;

  if (error) {
    const esBloqueo = error.status === 403;
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center">
        {esBloqueo ? (
          <>
            <Crown size={36} className="mx-auto mb-4 text-primary opacity-80" />
            <h1 className="text-xl font-bold text-foreground mb-2">Curso exclusivo Premium</h1>
            <p className="text-sm text-muted-foreground mb-6">{error.message}</p>
            {!user && (
              <p className="text-xs text-muted-foreground mb-4">
                Iniciá sesión y pedile a un admin que te pase a Premium para acceder.
              </p>
            )}
          </>
        ) : (
          <>
            <Lock size={36} className="mx-auto mb-4 text-muted-foreground opacity-50" />
            <h1 className="text-xl font-bold text-foreground mb-2">No pudimos mostrar este curso</h1>
            <p className="text-sm text-muted-foreground mb-6">{error.message}</p>
          </>
        )}
        <Link href="/cursos" className="text-sm text-primary hover:underline font-medium">
          ← Volver a cursos
        </Link>
      </div>
    );
  }

  if (!curso) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link
        href="/cursos"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft size={14} />
        Volver a cursos
      </Link>

      <div className="mb-8">
        <VideoPlayer url={curso.videoUrl} />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span
          className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono ${
            curso.esPago ? "bg-primary text-primary-foreground" : "bg-emerald-500 text-white"
          }`}
        >
          {curso.esPago ? "PREMIUM" : "GRATIS"}
        </span>
      </div>

      <h1 className="text-3xl font-bold text-foreground mb-3">{curso.titulo}</h1>
      <p className="text-muted-foreground leading-relaxed mb-8">{curso.descripcion}</p>

      <div className="flex flex-wrap gap-4 mb-10 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <HelpCircle size={15} />
          {curso.preguntasQuiz.length} preguntas de quiz
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={15} />
          Aprobación mínima: {curso.porcentajeAprobacion}%
        </div>
      </div>

      <div className="p-5 rounded-xl border border-border bg-card mb-10">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={18} className="text-primary" />
          <p className="text-sm font-semibold text-foreground">Material escrito</p>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {curso.materialEscrito}
        </p>
      </div>

      {curso.preguntasQuiz.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-foreground mb-4">Quiz del curso</h2>
          <QuizPlayer
            preguntasQuiz={curso.preguntasQuiz}
            porcentajeAprobacion={curso.porcentajeAprobacion}
          />
        </div>
      )}
    </div>
  );
}
