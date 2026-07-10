// El back guarda cada curso con `preguntasQuiz: string[]` (un array de strings).
// Para poder tener preguntas de opción múltiple con una sola respuesta correcta
// SIN tener que tocar el backend, cada pregunta se serializa como un string JSON
// con esta forma:
//   { "pregunta": "...", "opciones": ["a", "b", "c"], "correcta": 0 }
// Si en algún momento hay preguntas viejas cargadas como texto plano (formato
// anterior), se siguen mostrando como preguntas informativas sin corregir.

const QUIZ_PREFIX = "__QUIZ__";

export function crearPreguntaVacia() {
  return {
    pregunta: "",
    opciones: ["", ""],
    correcta: 0,
  };
}

// Convierte una pregunta estructurada en el string que se guarda en preguntasQuiz.
export function serializarPregunta(pregunta) {
  return QUIZ_PREFIX + JSON.stringify(pregunta);
}

// Intenta parsear un string de preguntasQuiz. Devuelve siempre un objeto:
// { pregunta, opciones, correcta, esOpcionMultiple }
// esOpcionMultiple = false cuando es una pregunta vieja en texto plano (no se
// puede corregir automáticamente, solo se muestra como referencia).
export function parsearPregunta(raw, index = 0) {
  if (typeof raw === "string" && raw.startsWith(QUIZ_PREFIX)) {
    try {
      const parsed = JSON.parse(raw.slice(QUIZ_PREFIX.length));
      if (parsed && typeof parsed.pregunta === "string" && Array.isArray(parsed.opciones)) {
        return {
          pregunta: parsed.pregunta,
          opciones: parsed.opciones,
          correcta: typeof parsed.correcta === "number" ? parsed.correcta : 0,
          esOpcionMultiple: parsed.opciones.length >= 2,
        };
      }
    } catch {
      // si falla el parseo, cae al formato de texto plano de abajo
    }
  }

  return {
    pregunta: typeof raw === "string" ? raw : `Pregunta ${index + 1}`,
    opciones: [],
    correcta: null,
    esOpcionMultiple: false,
  };
}

export function parsearPreguntas(preguntasQuiz) {
  return (preguntasQuiz ?? []).map((raw, i) => parsearPregunta(raw, i));
}
