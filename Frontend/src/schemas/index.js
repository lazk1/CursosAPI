import { z } from "zod";

export const loginSchema = z.object({
  usernameOrEmail: z.string().min(2, "Ingresá tu usuario o email"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
});

export const registerSchema = z
  .object({
    userName: z.string().min(2, "El nombre de usuario es muy corto"),
    email: z.string().email("Ingresá un email válido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(8, "Confirmá tu contraseña"),
    phoneNumber: z.string().min(6, "Ingresá un teléfono válido"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

// Las preguntas del quiz (opción múltiple) se manejan aparte, con su propio
// estado en el formulario de creación/edición de cursos, así que no forman
// parte de este schema de zod.
export const cursoSchema = z.object({
  titulo: z
    .string()
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(100, "El título no puede superar los 100 caracteres"),
  descripcion: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(500, "La descripción no puede superar los 500 caracteres"),
  imagenPortadaUrl: z.string().url("Debe ingresar una URL válida para la imagen"),
  videoUrl: z.string().url("Debe ingresar una URL válida para el video"),
  materialEscrito: z.string().min(1, "El material escrito es obligatorio"),
  porcentajeAprobacion: z
    .number()
    .min(1, "Debe ser entre 1 y 100")
    .max(100, "Debe ser entre 1 y 100"),
  esPago: z.boolean(),
});
