import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { isSupabaseConfigured } from "@/lib/supabase";

export function AuthScreen() {
  const { signIn, signUp, resetPassword, updatePassword, isPasswordRecovery } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "request" | "update">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const supabaseConfigured = isSupabaseConfigured();

  useEffect(() => {
    if (isPasswordRecovery) {
      setMode("update");
      setPassword("");
    } else if (window.location.pathname === "/redefinir-senha") {
      setMode("request");
      setPassword("");
    }
  }, [isPasswordRecovery]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    try {
      if (mode === "request") {
        const result = await resetPassword(email.trim());
        if (result.error) setError(result.error);
        else {
          setMessage("Enviamos um link de recuperação para seu e-mail.");
          setMode("signin");
        }
      } else if (mode === "update") {
        const result = await updatePassword(password);
        if (result.error) setError(result.error);
        else {
          setMessage("Senha atualizada com sucesso. Faça login novamente.");
          setMode("signin");
          setPassword("");
        }
      } else {
        const result =
          mode === "signin"
            ? await signIn(email.trim(), password)
            : await signUp(name.trim(), email.trim(), password);

        if (result.error) {
          setError(result.error);
        } else if (result.needsEmailConfirmation) {
          setMessage(
            "Conta criada! Confira seu e-mail e confirme o cadastro antes de entrar no GAMBO.",
          );
          setMode("signin");
          setPassword("");
        } else {
          setMessage(mode === "signup" ? "Conta criada com sucesso." : "");
        }
      }
    } catch {
      setError("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12 text-foreground">
      <div className="w-full max-w-md">
        <div className="mb-10 flex justify-center">
          <Logo />
        </div>
        <section className="rounded-2xl border border-border bg-card p-7 shadow-2xl sm:p-9">
          <p className="mb-3 text-center font-mono text-[10px] tracking-[0.24em] text-primary">
            CREATIVE INTELLIGENCE
          </p>
          <h1 className="text-center font-[Space_Grotesk] text-2xl font-semibold">
            {mode !== "signin" && mode !== "signup" && mode === "update"
              ? "Defina sua nova senha"
              : mode === "signin"
                ? "Bem-vindo(a) de volta"
                : mode === "signup"
                  ? "Seu espaço começa aqui."
                  : "Recuperar senha"}
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            {mode === "signin"
              ? "Entre para acessar seu estúdio criativo."
              : mode === "signup"
                ? "Crie sua conta e organize seu universo criativo."
                : "Digite seu e-mail para receber as instruções de recuperação de senha."}
          </p>

          {!supabaseConfigured && (
            <p
              role="status"
              className="mt-4 rounded-lg border border-review/20 bg-review/10 p-3 text-center text-xs text-review"
            >
              Supabase não configurado neste ambiente. Configure as duas variáveis públicas antes de
              entrar ou recuperar a senha.
            </p>
          )}

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <label className="block text-xs text-muted-foreground">
                Nome
                <span className="mt-2 flex items-center gap-3 rounded-lg border border-border bg-secondary px-3">
                  <UserRound size={16} className="text-muted-foreground" />
                  <input
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Como podemos te chamar?"
                    className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </span>
              </label>
            )}

            {(mode === "signup" || mode === "signin" || mode === "request") && (
              <label className="block text-xs text-muted-foreground">
                E-mail
                <span className="mt-2 flex items-center gap-3 rounded-lg border border-border bg-secondary px-3">
                  <Mail size={16} className="text-muted-foreground" />
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="voce@email.com"
                    className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </span>
              </label>
            )}

            {mode !== "request" && (
              <label className="block text-xs text-muted-foreground">
                {mode === "update" ? "Nova senha" : "Senha"}
                <span className="mt-2 flex items-center gap-3 rounded-lg border border-border bg-secondary px-3">
                  <LockKeyhole size={16} className="text-muted-foreground" />
                  <input
                    required
                    minLength={6}
                    type={showPassword ? "text" : "password"}
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Mínimo de 6 caracteres"
                    className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="text-muted-foreground transition hover:text-foreground"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </span>
              </label>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs text-destructive"
              >
                {error}
              </p>
            )}
            {message && (
              <p
                role="status"
                className="rounded-lg border border-success/20 bg-success/10 p-3 text-xs text-success"
              >
                {message}
              </p>
            )}

            <Button type="submit" disabled={busy} className="mt-2 h-11 w-full">
              {busy
                ? "Aguarde..."
                : mode === "signin"
                  ? "Entrar no GAMBO"
                  : mode === "signup"
                    ? "Criar minha conta"
                    : mode === "request"
                      ? "Enviar e-mail de recuperação"
                      : "Atualizar senha"}
              {!busy && <ArrowRight size={16} />}
            </Button>
          </form>

          <div className="mt-6 border-t border-border pt-5 text-center text-xs text-muted-foreground">
            {mode === "signin" && (
              <>
                Ainda não tem uma conta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError("");
                    setMessage("");
                  }}
                  className="font-semibold text-primary hover:text-foreground"
                >
                  Criar conta
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("request");
                    setError("");
                    setMessage("");
                  }}
                  className="ml-2 font-semibold text-primary hover:text-foreground"
                >
                  Esqueci minha senha
                </button>
              </>
            )}
            {mode === "signup" && (
              <>
                Já tem uma conta?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setError("");
                    setMessage("");
                  }}
                  className="font-semibold text-primary hover:text-foreground"
                >
                  Fazer login
                </button>
              </>
            )}
            {mode === "request" && (
              <>
                Lembrou sua senha?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setError("");
                    setMessage("");
                  }}
                  className="font-semibold text-primary hover:text-foreground"
                >
                  Fazer login
                </button>
              </>
            )}
          </div>
        </section>
        <p className="mt-6 text-center font-mono text-[9px] tracking-[0.18em] text-muted-foreground">
          GAMBO © 2026 · SEU ESTÚDIO, EM UM SÓ LUGAR
        </p>
      </div>
    </main>
  );
}
