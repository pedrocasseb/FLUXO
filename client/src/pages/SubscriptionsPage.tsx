import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Plus, Repeat, Trash2 } from "lucide-react";
import AppHeader from "../components/dashboard/AppHeader";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import FormField from "../components/FormField";
import SelectField from "../components/SelectField";
import ErrorBanner from "../components/ErrorBanner";
import FlowMark from "../components/FlowMark";
import {
  me,
  removeToken,
  listCategories,
  listSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  ApiError,
  type AuthUser,
  type Category,
  type CategoryType,
  type PaymentMethod,
  type Subscription,
} from "../lib/api";
import { formatCurrency } from "../lib/format";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" });

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CREDIT: "Crédito",
  DEBIT: "Débito",
  PIX: "Pix",
  CASH: "Dinheiro",
};

const PAYMENT_METHOD_ORDER: PaymentMethod[] = ["CREDIT", "DEBIT", "PIX", "CASH"];

const TYPE_LABELS: Record<CategoryType, string> = {
  EXPENSE: "Despesa",
  INCOME: "Receita",
  INVESTMENT: "Investimento",
};

const TYPE_ORDER: CategoryType[] = ["EXPENSE", "INCOME", "INVESTMENT"];

type FormState = {
  name: string;
  amount: string;
  dueDay: string;
  paymentMethod: PaymentMethod;
  categoryId: string;
  type: CategoryType;
};

const EMPTY_FORM: FormState = {
  name: "",
  amount: "",
  dueDay: "1",
  paymentMethod: "CREDIT",
  categoryId: "",
  type: "EXPENSE",
};

export default function SubscriptionsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Subscription | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Subscription | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

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

    Promise.all([listSubscriptions(), listCategories()])
      .then(([subscriptionsData, categoriesData]) => {
        if (!active) return;
        setSubscriptions(subscriptionsData);
        setCategories(categoriesData);
      })
      .catch((err) => {
        if (active) {
          setListError(err instanceof ApiError ? err.message : "Não foi possível carregar as assinaturas.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  const categoriesByType = useMemo(() => {
    const groups: Record<CategoryType, Category[]> = { EXPENSE: [], INCOME: [], INVESTMENT: [] };
    categories.forEach((category) => groups[category.type].push(category));
    return groups;
  }, [categories]);

  const sortedSubscriptions = useMemo(
    () => [...subscriptions].sort((a, b) => a.nextDueDate.localeCompare(b.nextDueDate)),
    [subscriptions],
  );

  const monthlyTotal = useMemo(
    () => subscriptions.reduce((sum, s) => sum + s.amount, 0),
    [subscriptions],
  );

  function handleLogout() {
    removeToken();
    navigate("/entrar", { replace: true });
  }

  function openCreateModal() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setModalOpen(true);
  }

  function openEditModal(subscription: Subscription) {
    setEditing(subscription);
    setForm({
      name: subscription.name,
      amount: String(subscription.amount),
      dueDay: String(subscription.dueDay),
      paymentMethod: subscription.paymentMethod,
      categoryId: subscription.categoryId,
      type: "EXPENSE",
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      const input = {
        name: form.name,
        amount: Number(form.amount),
        dueDay: Number(form.dueDay),
        paymentMethod: form.paymentMethod,
        categoryId: form.categoryId || undefined,
        type: form.type,
      };
      if (editing) {
        const updated = await updateSubscription(editing.id, input);
        setSubscriptions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        const created = await createSubscription(input);
        setSubscriptions((prev) => [...prev, created]);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Não foi possível salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleteError(null);
    setDeleting(true);
    try {
      await deleteSubscription(deleteTarget.id);
      setSubscriptions((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Não foi possível excluir. Tente novamente.");
    } finally {
      setDeleting(false);
    }
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F5F6F4]">
        <FlowMark gradientId="subscriptions-loading" className="h-8 w-8 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F4]" style={{ fontFamily: "var(--font-body)" }}>
      <AppHeader user={user} onLogout={handleLogout} />

      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#4A3AEB]">Assinaturas</p>
            <h1
              className="mt-3 text-[2rem] font-semibold tracking-[-0.02em] text-[#0E1420] sm:text-[2.5rem]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Assinaturas
            </h1>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[#0E1420]/60">
              Pagamentos recorrentes, lançados automaticamente todo mês na data certa.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 self-start rounded-full bg-[#0E1420] px-5 py-3 text-[14px] font-medium text-white transition-all duration-300 hover:bg-[#4A3AEB] hover:shadow-[0_8px_24px_rgba(74,58,235,0.35)]"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Nova assinatura
          </button>
        </div>

        <div className="mt-10">
          {listError && <ErrorBanner message={listError} />}

          {!listError && loading && <p className="text-[14px] text-[#0E1420]/45">Carregando assinaturas…</p>}

          {!listError && !loading && subscriptions.length === 0 && (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-[#E4E7E2] bg-white px-8 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E4E7E2] bg-[#F5F6F4] text-[#0E1420]">
                <Repeat className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <p className="text-[15px] font-medium text-[#0E1420]">Nenhuma assinatura ainda</p>
              <p className="max-w-xs text-[13px] leading-relaxed text-[#0E1420]/55">
                Cadastre um pagamento recorrente, como "Claude" ou "Netflix", e ele será lançado
                automaticamente todo mês.
              </p>
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-2 text-[13px] font-medium text-[#4A3AEB] transition-colors duration-200 hover:text-[#0E1420]"
              >
                Criar primeira assinatura
              </button>
            </div>
          )}

          {!listError && !loading && subscriptions.length > 0 && (
            <>
              <p className="mb-4 text-[13px] text-[#0E1420]/50">
                {formatCurrency(monthlyTotal)} por mês em assinaturas.
              </p>
              <div className="overflow-hidden rounded-2xl border border-[#E4E7E2] bg-white">
                {sortedSubscriptions.map((subscription, index) => (
                  <div
                    key={subscription.id}
                    className={`flex items-center justify-between gap-4 px-6 py-4 ${
                      index > 0 ? "border-t border-[#E4E7E2]" : ""
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#F5F6F4] text-[#0E1420]/60">
                        <Repeat className="h-4 w-4" strokeWidth={1.75} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-medium text-[#0E1420]">{subscription.name}</p>
                        <p className="text-[12px] text-[#0E1420]/45">
                          {subscription.categoryName} · {PAYMENT_METHOD_LABELS[subscription.paymentMethod]} · todo
                          dia {subscription.dueDay}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="whitespace-nowrap text-[14px] font-medium text-[#C2612E]">
                          {formatCurrency(subscription.amount)}
                        </p>
                        <p className="whitespace-nowrap text-[11px] text-[#0E1420]/40">
                          próx. {dateFormatter.format(new Date(`${subscription.nextDueDate}T00:00:00Z`))}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(subscription)}
                          aria-label={`Editar ${subscription.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#0E1420]/40 transition-colors duration-200 hover:bg-[#F5F6F4] hover:text-[#0E1420]"
                        >
                          <Pencil className="h-4 w-4" strokeWidth={1.75} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError(null);
                            setDeleteTarget(subscription);
                          }}
                          aria-label={`Excluir ${subscription.name}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#0E1420]/40 transition-colors duration-200 hover:bg-[#FBEEE9] hover:text-[#A5402F]"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Editar assinatura" : "Nova assinatura"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && <ErrorBanner message={formError} />}
          <FormField
            id="subscription-name"
            label="Nome"
            type="text"
            placeholder="Ex.: Claude"
            required
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          />
          <FormField
            id="subscription-amount"
            label="Valor mensal (R$)"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            required
            value={form.amount}
            onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
          />
          <FormField
            id="subscription-due-day"
            label="Dia do vencimento"
            type="number"
            min="1"
            max="31"
            step="1"
            required
            value={form.dueDay}
            onChange={(event) => setForm((prev) => ({ ...prev, dueDay: event.target.value }))}
          />
          <SelectField
            id="subscription-payment-method"
            label="Método de pagamento"
            value={form.paymentMethod}
            onChange={(event) => setForm((prev) => ({ ...prev, paymentMethod: event.target.value as PaymentMethod }))}
          >
            {PAYMENT_METHOD_ORDER.map((method) => (
              <option key={method} value={method}>
                {PAYMENT_METHOD_LABELS[method]}
              </option>
            ))}
          </SelectField>
          <SelectField
            id="subscription-category"
            label="Categoria"
            value={form.categoryId}
            onChange={(event) => setForm((prev) => ({ ...prev, categoryId: event.target.value }))}
          >
            <option value="">Other (sem categoria específica)</option>
            {TYPE_ORDER.filter((type) => categoriesByType[type].length > 0).map((type) => (
              <optgroup key={type} label={TYPE_LABELS[type]}>
                {categoriesByType[type].map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </SelectField>
          {form.categoryId === "" && (
            <SelectField
              id="subscription-type"
              label="Tipo de Other"
              value={form.type}
              onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value as CategoryType }))}
            >
              {TYPE_ORDER.map((type) => (
                <option key={type} value={type}>
                  {TYPE_LABELS[type]}
                </option>
              ))}
            </SelectField>
          )}
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
              {saving ? "Salvando…" : editing ? "Salvar alterações" : "Criar assinatura"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Cancelar assinatura"
        description={`Tem certeza que deseja cancelar "${deleteTarget?.name}"? As transações já lançadas continuam no seu histórico; só para de lançar novas a partir de agora.`}
        confirmLabel="Cancelar assinatura"
        error={deleteError}
        loading={deleting}
      />
    </div>
  );
}
