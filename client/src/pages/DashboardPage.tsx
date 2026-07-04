import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Receipt, Tags } from "lucide-react";
import FlowMark from "../components/FlowMark";
import AppHeader from "../components/dashboard/AppHeader";
import StatCard from "../components/dashboard/StatCard";
import EvolutionChart from "../components/dashboard/EvolutionChart";
import CategoryBreakdown from "../components/dashboard/CategoryBreakdown";
import ErrorBanner from "../components/ErrorBanner";
import { buttonVariants } from "../components/ui/button";
import { formatCurrency } from "../lib/format";
import {
  me,
  removeToken,
  getDashboard,
  ApiError,
  type AuthUser,
  type DashboardData,
} from "../lib/api";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    me()
      .then((data) => {
        if (active) setUser(data);
      })
      .catch(() => {
        removeToken();
        navigate("/entrar", { replace: true });
      });

    getDashboard()
      .then((data) => {
        if (active) setDashboard(data);
      })
      .catch((err) => {
        if (active) {
          setDashboardError(
            err instanceof ApiError ? err.message : "Não foi possível carregar o painel.",
          );
        }
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

  if (!user) {
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
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#4A3AEB]">Painel</p>
            <h1
              className="mt-3 text-[2rem] font-semibold tracking-[-0.02em] text-[#0E1420] sm:text-[2.5rem]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Bem-vindo{firstName ? `, ${firstName}` : ""}.
            </h1>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[#0E1420]/60">
              Visão geral do seu caixa.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/categorias" className={buttonVariants({ variant: "outline" })}>
              <Tags className="h-4 w-4" strokeWidth={1.75} />
              Categorias
            </Link>
            <Link to="/transacoes" className={buttonVariants({ variant: "outline" })}>
              <Receipt className="h-4 w-4" strokeWidth={1.75} />
              Transações
            </Link>
          </div>
        </div>

        {dashboardError && (
          <div className="mt-8">
            <ErrorBanner message={dashboardError} />
          </div>
        )}

        {!dashboardError && loading && (
          <p className="mt-10 text-[14px] text-[#0E1420]/45">Carregando painel…</p>
        )}

        {!dashboardError && !loading && dashboard && (
          <>
            <div className="mt-10 rounded-2xl border border-[#E4E7E2] bg-white p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#0E1420]/40">
                Saldo acumulado
              </p>
              <p
                className="mt-2 text-[2.6rem] font-semibold tracking-[-0.03em] sm:text-[3.2rem]"
                style={{
                  fontFamily: "var(--font-display)",
                  color: dashboard.summary.balance >= 0 ? "#0E1420" : "#A5402F",
                }}
              >
                {formatCurrency(dashboard.summary.balance)}
              </p>
              <p className="mt-2 text-[13px] text-[#0E1420]/45">
                {formatCurrency(dashboard.summary.income)} em receitas · {formatCurrency(dashboard.summary.expense)}{" "}
                em despesas · {formatCurrency(dashboard.summary.investment)} investidos, desde o início.
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Receitas do mês"
                value={dashboard.comparisons.income.current}
                percentage={dashboard.comparisons.income.percentage}
                isGood={dashboard.comparisons.income.percentage >= 0}
                accentColor="#1C8C6C"
              />
              <StatCard
                label="Despesas do mês"
                value={dashboard.comparisons.expense.current}
                percentage={dashboard.comparisons.expense.percentage}
                isGood={dashboard.comparisons.expense.percentage <= 0}
                accentColor="#9A5B2E"
              />
              <StatCard
                label="Investimentos do mês"
                value={dashboard.comparisons.investment.current}
                percentage={dashboard.comparisons.investment.percentage}
                isGood={dashboard.comparisons.investment.percentage >= 0}
                accentColor="#2E5CC4"
              />
              <StatCard
                label="Economia do mês"
                value={dashboard.comparisons.saving.current}
                percentage={dashboard.comparisons.saving.percentage}
                isGood={dashboard.comparisons.saving.percentage >= 0}
                accentColor="#4A3AEB"
              />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
              <div className="rounded-2xl border border-[#E4E7E2] bg-white p-6 lg:col-span-2">
                <h2
                  className="text-[14px] font-semibold text-[#0E1420]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Evolução mensal
                </h2>
                <p className="mt-1 text-[12px] text-[#0E1420]/45">Receitas e despesas mês a mês.</p>
                <div className="mt-6">
                  <EvolutionChart data={dashboard.monthlyEvolution} />
                </div>
              </div>

              <div className="rounded-2xl border border-[#E4E7E2] bg-white p-6">
                <h2
                  className="text-[14px] font-semibold text-[#0E1420]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Despesas por categoria
                </h2>
                <p className="mt-1 text-[12px] text-[#0E1420]/45">Acumulado desde o início.</p>
                <div className="mt-6">
                  <CategoryBreakdown data={dashboard.expensesByCategory} />
                </div>
              </div>
            </div>

            {dashboard.insights.length > 0 && (
              <div className="mt-6 rounded-2xl border border-[#E4E7E2] bg-white p-6">
                <h2
                  className="text-[14px] font-semibold text-[#0E1420]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Observações
                </h2>
                <ul className="mt-4 space-y-3">
                  {dashboard.insights.map((insight, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2.5 text-[13px] leading-relaxed text-[#0E1420]/70"
                    >
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[#4A3AEB]" />
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
