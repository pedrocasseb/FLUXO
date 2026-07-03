import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Receipt, Tags } from "lucide-react";
import FlowMark from "../components/FlowMark";
import AppHeader from "../components/dashboard/AppHeader";
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

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F6F4]">
        <FlowMark gradientId="dashboard-loading" className="h-8 w-8 animate-pulse" />
      </div>
    );
  }

  const firstName = user.name.split(" ")[0];

  return (
    <div className="min-h-screen bg-[#F5F6F4]" style={{ fontFamily: "var(--font-body)" }}>
      <AppHeader user={user} onLogout={handleLogout} />

      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#4A3AEB]">Painel</p>
        <h1
          className="mt-3 text-[2rem] font-semibold tracking-[-0.02em] text-[#0E1420] sm:text-[2.5rem]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Bem-vindo{firstName ? `, ${firstName}` : ""}.
        </h1>
        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[#0E1420]/60">
          Comece organizando suas categorias e registrando suas transações.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Link
            to="/categorias"
            className="group flex items-center justify-between rounded-2xl border border-[#E4E7E2] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#4F8CFF]/30 hover:shadow-[0_16px_40px_rgba(74,58,235,0.10)]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E4E7E2] bg-[#F5F6F4] text-[#0E1420]">
                <Tags className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[15px] font-medium text-[#0E1420]">Categorias</p>
                <p className="text-[13px] text-[#0E1420]/55">Receitas, despesas e investimentos</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 flex-shrink-0 text-[#0E1420]/30 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            to="/transacoes"
            className="group flex items-center justify-between rounded-2xl border border-[#E4E7E2] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#4F8CFF]/30 hover:shadow-[0_16px_40px_rgba(74,58,235,0.10)]"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#E4E7E2] bg-[#F5F6F4] text-[#0E1420]">
                <Receipt className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-[15px] font-medium text-[#0E1420]">Transações</p>
                <p className="text-[13px] text-[#0E1420]/55">Suas entradas e saídas registradas</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 flex-shrink-0 text-[#0E1420]/30 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </main>
    </div>
  );
}
