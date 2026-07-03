import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Plus, Receipt, Trash2 } from "lucide-react";
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
  listTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  ApiError,
  type AuthUser,
  type Category,
  type CategoryType,
  type Transaction,
} from "../lib/api";

const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const dateFormatter = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" });

const AMOUNT_STYLES: Record<CategoryType, string> = {
  INCOME: "text-[#1C8C6C]",
  EXPENSE: "text-[#9A5B2E]",
  INVESTMENT: "text-[#2E5CC4]",
};

const AMOUNT_SIGN: Record<CategoryType, string> = {
  INCOME: "+ ",
  EXPENSE: "- ",
  INVESTMENT: "",
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

type FormState = {
  description: string;
  amount: string;
  transactionDate: string;
  categoryId: string;
};

const EMPTY_FORM: FormState = { description: "", amount: "", transactionDate: todayISO(), categoryId: "" };

export default function TransactionsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Transaction | null>(null);
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

    Promise.all([listTransactions(), listCategories()])
      .then(([transactionsData, categoriesData]) => {
        if (!active) return;
        setTransactions(transactionsData);
        setCategories(categoriesData);
      })
      .catch((err) => {
        if (active) {
          setListError(
            err instanceof ApiError ? err.message : "Não foi possível carregar as transações.",
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

  const categoryTypeById = useMemo(() => {
    const map = new Map<string, CategoryType>();
    categories.forEach((category) => map.set(category.id, category.type));
    return map;
  }, [categories]);

  const sortedTransactions = useMemo(
    () =>
      [...transactions].sort((a, b) => b.transactionDate.localeCompare(a.transactionDate)),
    [transactions],
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

  function openEditModal(transaction: Transaction) {
    setEditing(transaction);
    setForm({
      description: transaction.description,
      amount: String(transaction.amount),
      transactionDate: transaction.transactionDate,
      categoryId: transaction.categoryId,
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
        description: form.description,
        amount: Number(form.amount),
        transactionDate: form.transactionDate,
        categoryId: form.categoryId || undefined,
      };
      if (editing) {
        const updated = await updateTransaction(editing.id, input);
        setTransactions((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      } else {
        const created = await createTransaction(input);
        setTransactions((prev) => [...prev, created]);
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
      await deleteTransaction(deleteTarget.id);
      setTransactions((prev) => prev.filter((t) => t.id !== deleteTarget.id));
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
        <FlowMark gradientId="transactions-loading" className="h-8 w-8 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F4]" style={{ fontFamily: "var(--font-body)" }}>
      <AppHeader user={user} onLogout={handleLogout} />

      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#4A3AEB]">Transações</p>
            <h1
              className="mt-3 text-[2rem] font-semibold tracking-[-0.02em] text-[#0E1420] sm:text-[2.5rem]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Transações
            </h1>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[#0E1420]/60">
              Suas entradas e saídas, uma por uma.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 self-start rounded-full bg-[#0E1420] px-5 py-3 text-[14px] font-medium text-white transition-all duration-300 hover:bg-[#4A3AEB] hover:shadow-[0_8px_24px_rgba(74,58,235,0.35)]"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Nova transação
          </button>
        </div>

        <div className="mt-10">
          {listError && <ErrorBanner message={listError} />}

          {!listError && loading && <p className="text-[14px] text-[#0E1420]/45">Carregando transações…</p>}

          {!listError && !loading && sortedTransactions.length === 0 && (
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-[#E4E7E2] bg-white px-8 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#E4E7E2] bg-[#F5F6F4] text-[#0E1420]">
                <Receipt className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <p className="text-[15px] font-medium text-[#0E1420]">Nenhuma transação ainda</p>
              <p className="max-w-xs text-[13px] leading-relaxed text-[#0E1420]/55">
                Registre sua primeira entrada ou saída para começar a acompanhar seu caixa.
              </p>
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-2 text-[13px] font-medium text-[#4A3AEB] transition-colors duration-200 hover:text-[#0E1420]"
              >
                Registrar primeira transação
              </button>
            </div>
          )}

          {!listError && !loading && sortedTransactions.length > 0 && (
            <div className="overflow-hidden rounded-2xl border border-[#E4E7E2] bg-white">
              {sortedTransactions.map((transaction, index) => {
                const categoryType = categoryTypeById.get(transaction.categoryId) ?? "EXPENSE";
                return (
                  <div
                    key={transaction.id}
                    className={`flex items-center justify-between gap-4 px-6 py-4 ${
                      index > 0 ? "border-t border-[#E4E7E2]" : ""
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <span className="hidden font-mono text-[12px] text-[#0E1420]/40 sm:inline">
                        {dateFormatter.format(new Date(`${transaction.transactionDate}T00:00:00Z`))}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-medium text-[#0E1420]">
                          {transaction.description}
                        </p>
                        <p className="text-[12px] text-[#0E1420]/45">{transaction.categoryName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`whitespace-nowrap text-[14px] font-medium ${AMOUNT_STYLES[categoryType]}`}>
                        {AMOUNT_SIGN[categoryType]}
                        {currencyFormatter.format(transaction.amount)}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(transaction)}
                          aria-label={`Editar ${transaction.description}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#0E1420]/40 transition-colors duration-200 hover:bg-[#F5F6F4] hover:text-[#0E1420]"
                        >
                          <Pencil className="h-4 w-4" strokeWidth={1.75} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError(null);
                            setDeleteTarget(transaction);
                          }}
                          aria-label={`Excluir ${transaction.description}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#0E1420]/40 transition-colors duration-200 hover:bg-[#FBEEE9] hover:text-[#A5402F]"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                        </button>
                      </div>
                    </div>
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
        title={editing ? "Editar transação" : "Nova transação"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && <ErrorBanner message={formError} />}
          <FormField
            id="transaction-description"
            label="Descrição"
            type="text"
            placeholder="Ex.: Compra de mercado"
            required
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          />
          <FormField
            id="transaction-amount"
            label="Valor (R$)"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            required
            value={form.amount}
            onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
          />
          <FormField
            id="transaction-date"
            label="Data"
            type="date"
            required
            value={form.transactionDate}
            onChange={(event) => setForm((prev) => ({ ...prev, transactionDate: event.target.value }))}
          />
          <SelectField
            id="transaction-category"
            label="Categoria"
            value={form.categoryId}
            onChange={(event) => setForm((prev) => ({ ...prev, categoryId: event.target.value }))}
          >
            <option value="">Sem categoria (usa "Other")</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </SelectField>
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
              {saving ? "Salvando…" : editing ? "Salvar alterações" : "Criar transação"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Excluir transação"
        description={`Tem certeza que deseja excluir "${deleteTarget?.description}"? Essa ação não pode ser desfeita.`}
        error={deleteError}
        loading={deleting}
      />
    </div>
  );
}
