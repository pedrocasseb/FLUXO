import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Receipt, Repeat, Tags, Target } from "lucide-react";
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
  listGoals,
  listSubscriptions,
  ApiError,
  type AuthUser,
  type DashboardData,
  type Goal,
  type PaymentMethod,
  type Subscription,
} from "../lib/api";

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CREDIT: "Crédito",
  DEBIT: "Débito",
  PIX: "Pix",
  CASH: "Dinheiro",
};

// Cores próprias, sem repetir com a paleta padrão de "Despesas por categoria"
// nem com verde/vermelho (que já significam receita/erro no resto do app).
const PAYMENT_METHOD_COLORS: Record<string, string> = {
  Crédito: "#4A3AEB",
  Débito: "#1D82A0",
  Pix: "#9A5CA8",
  Dinheiro: "#B8863F",
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" });

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
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

    Promise.all([getDashboard(), listGoals(), listSubscriptions()])
      .then(([dashboardData, goalsData, subscriptionsData]) => {
        if (!active) return;
        setDashboard(dashboardData);
        setGoals(goalsData);
        setSubscriptions(subscriptionsData);
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

  const activeGoals = useMemo(() => goals.filter((g) => !g.completed).slice(0, 4), [goals]);

  const upcomingSubscriptions = useMemo(
    () => [...subscriptions].sort((a, b) => a.nextDueDate.localeCompare(b.nextDueDate)).slice(0, 5),
    [subscriptions],
  );

  const monthlySubscriptionsTotal = useMemo(
    () => subscriptions.reduce((sum, s) => sum + s.amount, 0),
    [subscriptions],
  );

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
                accentColor="#C2612E"
              />
              <StatCard
                label="Investimentos do mês"
                value={dashboard.comparisons.investment.current}
                percentage={dashboard.comparisons.investment.percentage}
                isGood={dashboard.comparisons.investment.percentage >= 0}
                accentColor="#1D82A0"
              />
              <StatCard
                label="Economia do mês"
                value={dashboard.comparisons.saving.current}
                percentage={dashboard.comparisons.saving.percentage}
                isGood={dashboard.comparisons.saving.percentage >= 0}
                accentColor="#4A3AEB"
              />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-[#E4E7E2] bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2
                    className="text-[14px] font-semibold text-[#0E1420]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Metas
                  </h2>
                  <Link
                    to="/metas"
                    className="text-[12px] font-medium text-[#4A3AEB] transition-colors duration-200 hover:text-[#0E1420]"
                  >
                    Ver todas
                  </Link>
                </div>
                <p className="mt-1 text-[12px] text-[#0E1420]/45">Progresso das suas metas ativas.</p>
                <div className="mt-6">
                  {activeGoals.length === 0 ? (
                    <div className="flex min-h-[120px] flex-col items-center justify-center gap-3 text-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E4E7E2] bg-[#F5F6F4] text-[#0E1420]/50">
                        <Target className="h-4 w-4" strokeWidth={1.75} />
                      </div>
                      <p className="text-[13px] text-[#0E1420]/45">Nenhuma meta ativa ainda.</p>
                      <Link
                        to="/metas"
                        className="text-[13px] font-medium text-[#4A3AEB] transition-colors duration-200 hover:text-[#0E1420]"
                      >
                        Criar meta
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {activeGoals.map((goal) => {
                        const progress = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
                        return (
                          <div key={goal.id}>
                            <div className="flex items-center justify-between text-[13px]">
                              <span className="font-medium text-[#0E1420]">{goal.name}</span>
                              <span className="text-[#0E1420]/55">
                                {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                              </span>
                            </div>
                            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#F5F6F4]">
                              <div
                                className="h-full rounded-full bg-[#4A3AEB] transition-all duration-700"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-[#E4E7E2] bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2
                    className="text-[14px] font-semibold text-[#0E1420]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Assinaturas
                  </h2>
                  <Link
                    to="/assinaturas"
                    className="text-[12px] font-medium text-[#4A3AEB] transition-colors duration-200 hover:text-[#0E1420]"
                  >
                    Ver todas
                  </Link>
                </div>
                <p className="mt-1 text-[12px] text-[#0E1420]/45">
                  {subscriptions.length > 0
                    ? `${formatCurrency(monthlySubscriptionsTotal)} por mês, próximos vencimentos:`
                    : "Pagamentos recorrentes mensais."}
                </p>
                <div className="mt-6">
                  {upcomingSubscriptions.length === 0 ? (
                    <div className="flex min-h-[120px] flex-col items-center justify-center gap-3 text-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E4E7E2] bg-[#F5F6F4] text-[#0E1420]/50">
                        <Repeat className="h-4 w-4" strokeWidth={1.75} />
                      </div>
                      <p className="text-[13px] text-[#0E1420]/45">Nenhuma assinatura cadastrada.</p>
                      <Link
                        to="/assinaturas"
                        className="text-[13px] font-medium text-[#4A3AEB] transition-colors duration-200 hover:text-[#0E1420]"
                      >
                        Criar assinatura
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingSubscriptions.map((subscription) => (
                        <div key={subscription.id} className="flex items-center justify-between gap-3 text-[13px]">
                          <span className="min-w-0 truncate font-medium text-[#0E1420]">{subscription.name}</span>
                          <div className="flex flex-shrink-0 items-center gap-3">
                            <span className="text-[#0E1420]/45">
                              {dateFormatter.format(new Date(`${subscription.nextDueDate}T00:00:00Z`))}
                            </span>
                            <span className="font-medium text-[#C2612E]">
                              {formatCurrency(subscription.amount)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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

            <div className="mt-6 rounded-2xl border border-[#E4E7E2] bg-white p-6">
              <h2
                className="text-[14px] font-semibold text-[#0E1420]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Despesas por método de pagamento
              </h2>
              <p className="mt-1 text-[12px] text-[#0E1420]/45">
                Quanto foi gasto em crédito, débito, pix e dinheiro, acumulado desde o início.
              </p>
              <div className="mt-6 max-w-md">
                <CategoryBreakdown
                  data={dashboard.expensesByPaymentMethod.map((item) => ({
                    category: PAYMENT_METHOD_LABELS[item.paymentMethod],
                    amount: item.amount,
                    percentage: item.percentage,
                  }))}
                  colors={PAYMENT_METHOD_COLORS}
                />
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
