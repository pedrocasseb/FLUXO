import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import FormField from "../components/auth/FormField";
import PasswordField from "../components/auth/PasswordField";
import ErrorBanner from "../components/auth/ErrorBanner";
import { login, saveToken, ApiError } from "../lib/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { token } = await login(email, password);
      saveToken(token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível completar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      eyebrow="Bem-vindo de volta"
      title={
        <>
          Seu caixa,
          <br />
          exatamente onde
          <br />
          você parou.
        </>
      }
      subtitle="Entradas, saídas e projeções — tudo sincronizado, do jeito que você deixou."
      footer={
        <>
          Não tem conta?{" "}
          <Link to="/cadastro" className="font-medium text-[#4A3AEB] transition-colors duration-200 hover:text-[#0E1420]">
            Criar conta grátis
          </Link>
        </>
      }
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#4A3AEB]">Entrar</p>
      <h2
        className="mt-3 text-[1.9rem] font-semibold tracking-[-0.02em] text-[#0E1420]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Acesse sua conta
      </h2>
      <p className="mt-2 text-[14px] text-[#0E1420]/55">Informe seu e-mail e senha para continuar.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {error && <ErrorBanner message={error} />}

        <FormField
          id="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="voce@empresa.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <PasswordField
          id="password"
          label="Senha"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#0E1420] py-3.5 text-[15px] font-medium text-white transition-all duration-300 hover:bg-[#4A3AEB] hover:shadow-[0_8px_24px_rgba(74,58,235,0.35)] disabled:pointer-events-none disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </AuthLayout>
  );
}
