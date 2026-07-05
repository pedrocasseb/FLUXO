import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Pencil, Plus, Target, Trash2 } from "lucide-react";
import AppHeader from "../components/dashboard/AppHeader";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import FormField from "../components/FormField";
import DateField from "../components/DateField";
import ErrorBanner from "../components/ErrorBanner";
import FlowMark from "../components/FlowMark";
import {
  me,
  removeToken,
  listGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  listGoalContributions,
  addGoalContribution,
  deleteGoalContribution,
  ApiError,
  type AuthUser,
  type Goal,
  type GoalContribution,
} from "../lib/api";
import { formatCurrency } from "../lib/format";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" });

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

type GoalFormState = { name: string; targetAmount: string };
const EMPTY_GOAL_FORM: GoalFormState = { name: "", targetAmount: "" };

type ContributionFormState = { amount: string; contributionDate: string };
const EMPTY_CONTRIBUTION_FORM: ContributionFormState = {
  amount: "",
  contributionDate: todayISO(),
};

export default function GoalsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);
  const [goalForm, setGoalForm] = useState<GoalFormState>(EMPTY_GOAL_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Goal | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [contributeTarget, setContributeTarget] = useState<Goal | null>(null);
  const [contributionForm, setContributionForm] =
    useState<ContributionFormState>(EMPTY_CONTRIBUTION_FORM);
  const [contributionError, setContributionError] = useState<string | null>(
    null,
  );
  const [contributing, setContributing] = useState(false);

  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  const [contributions, setContributions] = useState<
    Record<string, GoalContribution[]>
  >({});
  const [contributionsLoading, setContributionsLoading] = useState(false);

  const [deleteContributionTarget, setDeleteContributionTarget] = useState<{
    goalId: string;
    contribution: GoalContribution;
  } | null>(null);
  const [deleteContributionError, setDeleteContributionError] = useState<
    string | null
  >(null);
  const [deletingContribution, setDeletingContribution] = useState(false);

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

    listGoals()
      .then((data) => {
        if (active) setGoals(data);
      })
      .catch((err) => {
        if (active) {
          setListError(
            err instanceof ApiError
              ? err.message
              : "Não foi possível carregar as metas.",
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

  function openCreateModal() {
    setEditing(null);
    setGoalForm(EMPTY_GOAL_FORM);
    setFormError(null);
    setModalOpen(true);
  }

  function openEditModal(goal: Goal) {
    setEditing(goal);
    setGoalForm({ name: goal.name, targetAmount: String(goal.targetAmount) });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      const targetAmount = Number(goalForm.targetAmount);
      if (editing) {
        const updated = await updateGoal(
          editing.id,
          goalForm.name,
          targetAmount,
        );
        setGoals((prev) =>
          prev.map((g) => (g.id === updated.id ? updated : g)),
        );
      } else {
        const created = await createGoal(goalForm.name, targetAmount);
        setGoals((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível salvar. Tente novamente.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteError(null);
    setDeleting(true);
    try {
      await deleteGoal(deleteTarget.id);
      setGoals((prev) => prev.filter((g) => g.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível excluir. Tente novamente.",
      );
    } finally {
      setDeleting(false);
    }
  }

  function openContributeModal(goal: Goal) {
    setContributeTarget(goal);
    setContributionForm(EMPTY_CONTRIBUTION_FORM);
    setContributionError(null);
  }

  async function handleContributeSubmit(event: FormEvent) {
    event.preventDefault();
    if (!contributeTarget) return;
    setContributionError(null);
    setContributing(true);
    try {
      const updated = await addGoalContribution(
        contributeTarget.id,
        Number(contributionForm.amount),
        contributionForm.contributionDate,
      );
      setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
      if (expandedGoalId === updated.id) {
        const data = await listGoalContributions(updated.id);
        setContributions((prev) => ({ ...prev, [updated.id]: data }));
      }
      setContributeTarget(null);
    } catch (err) {
      setContributionError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível registrar o aporte. Tente novamente.",
      );
    } finally {
      setContributing(false);
    }
  }

  async function toggleExpanded(goal: Goal) {
    if (expandedGoalId === goal.id) {
      setExpandedGoalId(null);
      return;
    }
    setExpandedGoalId(goal.id);
    if (!contributions[goal.id]) {
      setContributionsLoading(true);
      try {
        const data = await listGoalContributions(goal.id);
        setContributions((prev) => ({ ...prev, [goal.id]: data }));
      } catch {
        setContributions((prev) => ({ ...prev, [goal.id]: [] }));
      } finally {
        setContributionsLoading(false);
      }
    }
  }

  async function handleDeleteContribution() {
    if (!deleteContributionTarget) return;
    const { goalId, contribution } = deleteContributionTarget;
    setDeleteContributionError(null);
    setDeletingContribution(true);
    try {
      await deleteGoalContribution(goalId, contribution.id);
      setContributions((prev) => ({
        ...prev,
        [goalId]: (prev[goalId] ?? []).filter((c) => c.id !== contribution.id),
      }));
      const remaining = (contributions[goalId] ?? []).filter(
        (c) => c.id !== contribution.id,
      );
      const currentAmount = remaining.reduce((sum, c) => sum + c.amount, 0);
      setGoals((prev) =>
        prev.map((g) =>
          g.id === goalId
            ? {
                ...g,
                currentAmount,
                completed: currentAmount >= g.targetAmount,
              }
            : g,
        ),
      );
      setDeleteContributionTarget(null);
    } catch (err) {
      setDeleteContributionError(
        err instanceof ApiError
          ? err.message
          : "Não foi possível excluir o aporte. Tente novamente.",
      );
    } finally {
      setDeletingContribution(false);
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F6F4]">
        <FlowMark
          gradientId="goals-loading"
          className="h-8 w-8 animate-pulse"
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#F5F6F4]"
      style={{ fontFamily: "var(--font-body)" }}
    >
      <AppHeader user={user} onLogout={handleLogout} />

      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#4A3AEB]">
              Metas
            </p>
            <h1
              className="mt-3 text-[2rem] font-semibold tracking-[-0.02em] text-[#0E1420] sm:text-[2.5rem]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Metas
            </h1>
            <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-[#0E1420]/60">
              Defina um objetivo, um valor, e vá guardando dinheiro até chegar
              lá.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 self-start rounded-full bg-[#0E1420] px-5 py-3 text-[14px] font-medium text-white transition-all duration-300 hover:bg-[#4A3AEB] hover:shadow-[0_8px_24px_rgba(74,58,235,0.35)]"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Nova meta
          </button>
        </div>

        <div className="mt-10">
          {listError && <ErrorBanner message={listError} />}

          {!listError && loading && (
            <p className="text-[14px] text-[#0E1420]/45">Carregando metas…</p>
          )}

          {!listError && !loading && goals.length === 0 && (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-[#E4E7E2] bg-white px-8 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E4E7E2] bg-[#F5F6F4] text-[#0E1420]">
                <Target className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <p className="text-[15px] font-medium text-[#0E1420]">
                Nenhuma meta ainda
              </p>
              <p className="max-w-xs text-[13px] leading-relaxed text-[#0E1420]/55">
                Crie sua primeira meta, como "PS5" ou "Viagem", e comece a
                guardar dinheiro.
              </p>
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-2 text-[13px] font-medium text-[#4A3AEB] transition-colors duration-200 hover:text-[#0E1420]"
              >
                Criar primeira meta
              </button>
            </div>
          )}

          {!listError && !loading && goals.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {goals.map((goal) => {
                const progress = Math.min(
                  100,
                  (goal.currentAmount / goal.targetAmount) * 100,
                );
                const expanded = expandedGoalId === goal.id;
                const goalContributions = contributions[goal.id] ?? [];

                return (
                  <div
                    key={goal.id}
                    className="rounded-2xl border border-[#E4E7E2] bg-white p-6"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[16px] font-semibold text-[#0E1420]">
                          {goal.name}
                        </p>
                        <p className="mt-0.5 text-[13px] text-[#0E1420]/50">
                          {formatCurrency(goal.currentAmount)} de{" "}
                          {formatCurrency(goal.targetAmount)}
                        </p>
                      </div>
                      <div className="flex flex-shrink-0 items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(goal)}
                          aria-label={`Editar ${goal.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#0E1420]/40 transition-colors duration-200 hover:bg-[#F5F6F4] hover:text-[#0E1420]"
                        >
                          <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError(null);
                            setDeleteTarget(goal);
                          }}
                          aria-label={`Excluir ${goal.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#0E1420]/40 transition-colors duration-200 hover:bg-[#FBEEE9] hover:text-[#A5402F]"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#F5F6F4]">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          goal.completed ? "bg-[#1C8C6C]" : "bg-[#4A3AEB]"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[12px] font-medium text-[#0E1420]/45">
                        {progress.toFixed(0)}%
                      </span>
                      {goal.completed && (
                        <span className="text-[12px] font-medium text-[#1C8C6C]">
                          Meta concluída 🎉
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => openContributeModal(goal)}
                        className="inline-flex items-center gap-2 rounded-full bg-[#0E1420] px-4 py-2 text-[13px] font-medium text-white transition-all duration-300 hover:bg-[#4A3AEB]"
                      >
                        <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                        Adicionar valor
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleExpanded(goal)}
                        className="inline-flex items-center gap-1 text-[13px] font-medium text-[#0E1420]/55 transition-colors duration-200 hover:text-[#0E1420]"
                      >
                        Aportes
                        <ChevronDown
                          className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                          strokeWidth={1.75}
                        />
                      </button>
                    </div>

                    {expanded && (
                      <div className="mt-4 border-t border-[#E4E7E2] pt-4">
                        {contributionsLoading && !contributions[goal.id] ? (
                          <p className="text-[13px] text-[#0E1420]/45">
                            Carregando aportes…
                          </p>
                        ) : goalContributions.length === 0 ? (
                          <p className="text-[13px] text-[#0E1420]/45">
                            Nenhum aporte ainda.
                          </p>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {goalContributions.map((contribution) => (
                              <div
                                key={contribution.id}
                                className="flex items-center justify-between gap-2"
                              >
                                <span className="text-[13px] text-[#0E1420]/60">
                                  {dateFormatter.format(
                                    new Date(
                                      `${contribution.contributionDate}T00:00:00Z`,
                                    ),
                                  )}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-[13px] font-medium text-[#0E1420]">
                                    {formatCurrency(contribution.amount)}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setDeleteContributionError(null);
                                      setDeleteContributionTarget({
                                        goalId: goal.id,
                                        contribution,
                                      });
                                    }}
                                    aria-label="Excluir aporte"
                                    className="flex h-6 w-6 items-center justify-center rounded-full text-[#0E1420]/35 transition-colors duration-200 hover:bg-[#FBEEE9] hover:text-[#A5402F]"
                                  >
                                    <Trash2
                                      className="h-3 w-3"
                                      strokeWidth={1.75}
                                    />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Editar meta" : "Nova meta"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && <ErrorBanner message={formError} />}
          <FormField
            id="goal-name"
            label="Nome"
            type="text"
            placeholder="Ex.: PS5"
            required
            value={goalForm.name}
            onChange={(event) =>
              setGoalForm((prev) => ({ ...prev, name: event.target.value }))
            }
          />
          <FormField
            id="goal-target"
            label="Valor alvo (R$)"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            required
            value={goalForm.targetAmount}
            onChange={(event) =>
              setGoalForm((prev) => ({
                ...prev,
                targetAmount: event.target.value,
              }))
            }
          />
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-full px-4 py-2.5 text-[14px] font-medium text-[#0E1420]/60 transition-colors duration-200 hover:text-[#0E1420]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#0E1420] px-5 py-2.5 text-[14px] font-medium text-white transition-all duration-300 hover:bg-[#4A3AEB] disabled:pointer-events-none disabled:opacity-60"
            >
              {saving
                ? "Salvando…"
                : editing
                  ? "Salvar alterações"
                  : "Criar meta"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={contributeTarget !== null}
        onClose={() => setContributeTarget(null)}
        title={`Adicionar valor${contributeTarget ? ` — ${contributeTarget.name}` : ""}`}
      >
        <form onSubmit={handleContributeSubmit} className="space-y-4">
          {contributionError && <ErrorBanner message={contributionError} />}
          <FormField
            id="contribution-amount"
            label="Valor (R$)"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            required
            value={contributionForm.amount}
            onChange={(event) =>
              setContributionForm((prev) => ({
                ...prev,
                amount: event.target.value,
              }))
            }
          />
          <DateField
            id="contribution-date"
            label="Data"
            value={contributionForm.contributionDate}
            onChange={(value) =>
              setContributionForm((prev) => ({
                ...prev,
                contributionDate: value,
              }))
            }
          />
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setContributeTarget(null)}
              className="rounded-full px-4 py-2.5 text-[14px] font-medium text-[#0E1420]/60 transition-colors duration-200 hover:text-[#0E1420]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={contributing}
              className="rounded-full bg-[#0E1420] px-5 py-2.5 text-[14px] font-medium text-white transition-all duration-300 hover:bg-[#4A3AEB] disabled:pointer-events-none disabled:opacity-60"
            >
              {contributing ? "Adicionando…" : "Adicionar"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Excluir meta"
        description={`Tem certeza que deseja excluir "${deleteTarget?.name}"? Todos os aportes registrados também serão removidos. Essa ação não pode ser desfeita.`}
        error={deleteError}
        loading={deleting}
      />

      <ConfirmDialog
        open={deleteContributionTarget !== null}
        onClose={() => setDeleteContributionTarget(null)}
        onConfirm={handleDeleteContribution}
        title="Excluir aporte"
        description="Tem certeza que deseja excluir este aporte? Essa ação não pode ser desfeita."
        error={deleteContributionError}
        loading={deletingContribution}
      />
    </div>
  );
}
