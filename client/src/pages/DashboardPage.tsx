import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BarChart3 } from "lucide-react";
import FlowMark from "../components/FlowMark";
import { me, removeToken, type AuthUser } from "../lib/api";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    me()
      .then((data) => {
        if (active) setUser(data);
      })
      .catch(() => {
        removeToken();
        navigate("/entrar", { replace: true });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [navigate]);

  function handleLogout() {
    removeToken();
    navigate("/entrar", { replace: true });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F6F4]">
        <FlowMark gradientId="dashboard-loading" className="h-8 w-8 animate-pulse" />
      </div>
    );
  }

  const firstName = user?.name.split(" ")[0] ?? "";

  return (
    <div className="min-h-screen bg-[#F5F6F4]" style={{ fontFamily: "var(--font-body)" }}>
      <header className="border-b border-[#E4E7E2] bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-10 lg:px-12">
          <Link to="/dashboard" className="flex items-center gap-2.5 select-none" aria-label="Fluxo">
            <FlowMark gradientId="dashboard-mark" />
            <span
              className="text-[17px] font-semibold tracking-[-0.02em] text-[#0E1420]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Fluxo
            </span>
          </Link>

          <div className="flex items-center gap-5">
            <span className="hidden text-[14px] text-[#0E1420]/55 sm:inline">{user?.email}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-[14px] font-medium text-[#0E1420]/55 transition-colors duration-200 hover:text-[#0E1420]"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#4A3AEB]">Painel</p>
        <h1
          className="mt-3 text-[2rem] font-semibold tracking-[-0.02em] text-[#0E1420] sm:text-[2.5rem]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Bem-vindo{firstName ? `, ${firstName}` : ""}.
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[#0E1420]/60">
          Seu painel financeiro está em construção. Em breve, seus extratos, categorias e
          projeções de caixa aparecem aqui.
        </p>

        <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-dashed border-[#E4E7E2] bg-white px-8 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E4E7E2] bg-[#F5F6F4] text-[#0E1420]">
            <BarChart3 className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <p className="text-[15px] font-medium text-[#0E1420]">Nenhum dado ainda</p>
          <p className="max-w-xs text-[13px] leading-relaxed text-[#0E1420]/55">
            Assim que você registrar uma transação, seu resumo financeiro aparece aqui.
          </p>
        </div>
      </main>
    </div>
  );
}
