import { useState, type FormEvent } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    try {
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
    } catch {
      setError("Ocorreu um erro inesperado. Tente novamente.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#101210] px-5 py-12 text-white">
      <div className="w-full max-w-md">
        <div className="mb-10 flex justify-center">
          <Logo />
        </div>
        <section className="rounded-2xl border border-white/10 bg-[#171a17] p-7 shadow-2xl sm:p-9">
          <p className="mb-3 text-center font-mono text-[10px] tracking-[0.24em] text-[#a4ad9e]">
            CREATIVE INTELLIGENCE
          </p>
          <h1 className="text-center font-[Space_Grotesk] text-2xl font-semibold">
            {mode === "signin" ? "Bem-vinda de volta." : "Seu espaço começa aqui."}
          </h1>
          <p className="mt-2 text-center text-sm text-white/55">
            {mode === "signin"
              ? "Entre para acessar seu estúdio criativo."
              : "Crie sua conta e organize seu universo criativo."}
          </p>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <label className="block text-xs text-white/70">
                Nome
                <span className="mt-2 flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-3">
                  <UserRound size={16} className="text-white/40" />
                  <input
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Como podemos te chamar?"
                    className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                  />
                </span>
              </label>
            )}

            <label className="block text-xs text-white/70">
              E-mail
              <span className="mt-2 flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-3">
                <Mail size={16} className="text-white/40" />
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="voce@email.com"
                  className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                />
              </span>
            </label>

            <label className="block text-xs text-white/70">
              Senha
              <span className="mt-2 flex items-center gap-3 rounded-lg border border-white/10 bg-black/20 px-3">
                <LockKeyhole size={16} className="text-white/40" />
                <input
                  required
                  minLength={6}
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                  className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="text-white/40 transition hover:text-white"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            </label>

            {error && (
              <p role="alert" className="rounded-lg border border-red-400/20 bg-red-400/10 p-3 text-xs text-red-200">
                {error}
              </p>
            )}
            {message && (
              <p role="status" className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3 text-xs text-emerald-200">
                {message}
              </p>
            )}

            <Button type="submit" disabled={busy} className="mt-2 h-11 w-full">
              {busy
                ? "Aguarde..."
                : mode === "signin"
                  ? "Entrar no GAMBO"
                  : "Criar minha conta"}
              {!busy && <ArrowRight size={16} />}
            </Button>
          </form>

          <div className="mt-6 border-t border-white/10 pt-5 text-center text-xs text-white/55">
            {mode === "signin" ? "Ainda não tem uma conta?" : "Já tem uma conta?"}{" "}
            <button
              type="button"
              onClick={() => {
                setMode((current) => current === "signin" ? "signup" : "signin");
                setError("");
                setMessage("");
              }}
              className="font-semibold text-[#c5d0bb] hover:text-white"
            >
              {mode === "signin" ? "Criar conta" : "Fazer login"}
            </button>
          </div>
        </section>
        <p className="mt-6 text-center font-mono text-[9px] tracking-[0.18em] text-white/25">
          GAMBO © 2026 · SEU ESTÚDIO, EM UM SÓ LUGAR
        </p>
      </div>
    </main>
  );
}
