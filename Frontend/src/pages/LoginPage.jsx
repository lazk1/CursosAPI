import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Mail, Lock, User, Phone, Code2, Loader2 } from "lucide-react";
import { loginSchema, registerSchema } from "@/schemas";
import { authService } from "@/services/authService";
import { parseApiError } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/Toast";

export function LoginPage() {
  const [tab, setTab] = useState("login");

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-xl p-8">
        <div className="flex items-center gap-2 mb-6 justify-center">
          <Code2 size={22} className="text-primary" />
          <span className="font-bold text-lg tracking-tight text-foreground font-mono">devCursos</span>
        </div>

        <div className="flex gap-1 p-1 rounded-lg bg-muted mb-6">
          {["login", "register"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                tab === t
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "login" ? "Iniciar sesión" : "Registrarse"}
            </button>
          ))}
        </div>

        {tab === "login" ? <LoginForm /> : <RegisterForm onDone={() => setTab("login")} />}
      </div>
    </div>
  );
}

function LoginForm() {
  const [, navigate] = useLocation();
  const { setUser } = useAuthStore();
  const toast = useToast();
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data) {
    setSubmitError(null);
    try {
      const res = await authService.login(data);
      setUser(res.user);
      toast.success(`¡Bienvenido, ${res.user.userName}!`);
      navigate("/cursos");
    } catch (err) {
      setSubmitError(parseApiError(err).message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {submitError && (
        <div className="px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-sm">
          {submitError}
        </div>
      )}

      <Field
        label="Usuario o email"
        icon={<Mail size={15} />}
        error={errors.usernameOrEmail?.message}
      >
        <input
          type="text"
          placeholder="hola@ejemplo.com"
          className={inputClass(!!errors.usernameOrEmail)}
          {...register("usernameOrEmail")}
        />
      </Field>

      <Field label="Contraseña" icon={<Lock size={15} />} error={errors.password?.message}>
        <input
          type="password"
          placeholder="••••••••"
          className={inputClass(!!errors.password)}
          {...register("password")}
        />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {isSubmitting && <Loader2 size={15} className="animate-spin" />}
        Iniciar sesión
      </button>
    </form>
  );
}

function RegisterForm({ onDone }) {
  const toast = useToast();
  const [submitError, setSubmitError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data) {
    setSubmitError(null);
    try {
      await authService.register(data);
      toast.success("Cuenta creada. Ahora iniciá sesión.");
      onDone();
    } catch (err) {
      setSubmitError(parseApiError(err).message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {submitError && (
        <div className="px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-sm">
          {submitError}
        </div>
      )}

      <Field label="Nombre de usuario" icon={<User size={15} />} error={errors.userName?.message}>
        <input
          type="text"
          placeholder="tu_usuario"
          className={inputClass(!!errors.userName)}
          {...register("userName")}
        />
      </Field>

      <Field label="Email" icon={<Mail size={15} />} error={errors.email?.message}>
        <input
          type="email"
          placeholder="hola@ejemplo.com"
          className={inputClass(!!errors.email)}
          {...register("email")}
        />
      </Field>

      <Field label="Teléfono" icon={<Phone size={15} />} error={errors.phoneNumber?.message}>
        <input
          type="tel"
          placeholder="+54 9 3461 000000"
          className={inputClass(!!errors.phoneNumber)}
          {...register("phoneNumber")}
        />
      </Field>

      <Field label="Contraseña" icon={<Lock size={15} />} error={errors.password?.message}>
        <input
          type="password"
          placeholder="••••••••"
          className={inputClass(!!errors.password)}
          {...register("password")}
        />
      </Field>

      <Field label="Confirmar contraseña" icon={<Lock size={15} />} error={errors.confirmPassword?.message}>
        <input
          type="password"
          placeholder="••••••••"
          className={inputClass(!!errors.confirmPassword)}
          {...register("confirmPassword")}
        />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-1 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {isSubmitting && <Loader2 size={15} className="animate-spin" />}
        Crear cuenta
      </button>
    </form>
  );
}

function Field({ label, icon, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        {children}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function inputClass(hasError) {
  return `w-full pl-9 pr-3 py-2.5 rounded-lg bg-input-background border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 ${
    hasError ? "border-destructive" : "border-border"
  }`;
}
