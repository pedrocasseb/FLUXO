import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import FormField from "../components/auth/FormField";
import PasswordField from "../components/auth/PasswordField";
import ErrorBanner from "../components/auth/ErrorBanner";
import { register, login, saveToken, ApiError } from "../lib/api";

export default function SignupPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register(name, email, password);
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
      eyebrow="Comece agora"
      title={
        <>
          Clareza sobre
          <br />
          seu dinheiro,
          <br />
          hoje mesmo.
        </>
      }
      subtitle="Leva menos de dois minutos. Sem cartão de crédito, sem burocracia."
      footer={
        <>
          Já tem conta?{" "}
          <Link to="/entrar" className="font-medium text-[#4A3AEB] transition-colors duration-200 hover:text-[#0E1420]">
            Entrar
          </Link>
        </>
      }
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#4A3AEB]">Criar conta</p>
      <h2
        className="mt-3 text-[1.9rem] font-semibold tracking-[-0.02em] text-[#0E1420]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Crie sua conta grátis
      </h2>
      <p className="mt-2 text-[14px] text-[#0E1420]/55">Organize suas finanças em poucos passos.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {error && <ErrorBanner message={error} />}

        <FormField
          id="name"
          label="Nome"
          type="text"
          autoComplete="name"
          placeholder="Seu nome completo"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
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
          autoComplete="new-password"
          placeholder="Mínimo de 6 caracteres"
          minLength={6}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#0E1420] py-3.5 text-[15px] font-medium text-white transition-all duration-300 hover:bg-[#4A3AEB] hover:shadow-[0_8px_24px_rgba(74,58,235,0.35)] disabled:pointer-events-none disabled:opacity-60"
        >
          {loading ? "Criando conta…" : "Criar conta grátis"}
        </button>

        <p className="text-center text-[12px] leading-relaxed text-[#0E1420]/40">
          Ao continuar, você concorda com os Termos de uso e a Política de privacidade.
        </p>
      </form>
    </AuthLayout>
  );
}
