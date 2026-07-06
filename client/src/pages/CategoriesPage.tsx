import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Plus, Trash2 } from "lucide-react";
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
  createCategory,
  updateCategory,
  deleteCategory,
  ApiError,
  type AuthUser,
  type Category,
  type CategoryType,
} from "../lib/api";

const COLUMN_ORDER: CategoryType[] = ["EXPENSE", "INCOME", "INVESTMENT"];

const TYPE_LABELS: Record<CategoryType, string> = {
  INCOME: "Receita",
  EXPENSE: "Despesa",
  INVESTMENT: "Investimento",
};

const TYPE_DOT_STYLES: Record<CategoryType, string> = {
  INCOME: "bg-[#1C8C6C]",
  EXPENSE: "bg-[#C2612E]",
  INVESTMENT: "bg-[#1D82A0]",
};

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<CategoryType>("EXPENSE");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
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

    listCategories()
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch((err) => {
        if (active) {
          setListError(
            err instanceof ApiError ? err.message : "Não foi possível carregar as categorias.",
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

  const groupedCategories = useMemo(() => {
    const groups: Record<CategoryType, Category[]> = { EXPENSE: [], INCOME: [], INVESTMENT: [] };
    categories.forEach((category) => groups[category.type].push(category));
    return groups;
  }, [categories]);

  function handleLogout() {
    removeToken();
    navigate("/entrar", { replace: true });
  }

  function openCreateModal() {
    setEditing(null);
    setName("");
    setType("EXPENSE");
    setFormError(null);
    setModalOpen(true);
  }

  function openEditModal(category: Category) {
    setEditing(category);
    setName(category.name);
    setType(category.type);
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      if (editing) {
        const updated = await updateCategory(editing.id, name, type);
        setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        const created = await createCategory(name, type);
        setCategories((prev) => [...prev, created]);
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
      await deleteCategory(deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
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
        <FlowMark gradientId="categories-loading" className="h-8 w-8 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F4]" style={{ fontFamily: "var(--font-body)" }}>
      <AppHeader user={user} onLogout={handleLogout} />

      <main className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#4A3AEB]">Categorias</p>
            <h1
              className="mt-3 text-[2rem] font-semibold tracking-[-0.02em] text-[#0E1420] sm:text-[2.5rem]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Categorias
            </h1>
            <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[#0E1420]/60">
              Organize suas transações por receita, despesa ou investimento.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 self-start rounded-full bg-[#0E1420] px-5 py-3 text-[14px] font-medium text-white transition-all duration-300 hover:bg-[#4A3AEB] hover:shadow-[0_8px_24px_rgba(74,58,235,0.35)]"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Nova categoria
          </button>
        </div>

        <div className="mt-10">
          {listError && <ErrorBanner message={listError} />}

          {!listError && loading && <p className="text-[14px] text-[#0E1420]/45">Carregando categorias…</p>}

          {!listError && !loading && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {COLUMN_ORDER.map((columnType) => {
                const items = groupedCategories[columnType];
                return (
                  <div key={columnType}>
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${TYPE_DOT_STYLES[columnType]}`} />
                      <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#0E1420]/70">
                        {TYPE_LABELS[columnType]}
                      </h2>
                      <span className="text-[12px] text-[#0E1420]/35">{items.length}</span>
                    </div>

                    <div className="mt-3 overflow-hidden rounded-2xl border border-[#E4E7E2] bg-white">
                      {items.length === 0 ? (
                        <p className="px-5 py-8 text-center text-[13px] text-[#0E1420]/40">
                          Nenhuma categoria ainda
                        </p>
                      ) : (
                        items.map((category, index) => (
                          <div
                            key={category.id}
                            className={`flex items-center justify-between gap-2 px-5 py-3.5 ${
                              index > 0 ? "border-t border-[#E4E7E2]" : ""
                            }`}
                          >
                            <span className="truncate text-[14px] font-medium text-[#0E1420]">{category.name}</span>
                            <div className="flex flex-shrink-0 items-center gap-0.5">
                              <button
                                type="button"
                                onClick={() => openEditModal(category)}
                                aria-label={`Editar ${category.name}`}
                                className="flex h-7 w-7 items-center justify-center rounded-full text-[#0E1420]/40 transition-colors duration-200 hover:bg-[#F5F6F4] hover:text-[#0E1420]"
                              >
                                <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteError(null);
                                  setDeleteTarget(category);
                                }}
                                aria-label={`Excluir ${category.name}`}
                                className="flex h-7 w-7 items-center justify-center rounded-full text-[#0E1420]/40 transition-colors duration-200 hover:bg-[#FBEEE9] hover:text-[#A5402F]"
                              >
                                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
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
        title={editing ? "Editar categoria" : "Nova categoria"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && <ErrorBanner message={formError} />}
          <FormField
            id="category-name"
            label="Nome"
            type="text"
            placeholder="Ex.: Alimentação"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <SelectField
            id="category-type"
            label="Tipo"
            value={type}
            onChange={(event) => setType(event.target.value as CategoryType)}
          >
            <option value="EXPENSE">Despesa</option>
            <option value="INCOME">Receita</option>
            <option value="INVESTMENT">Investimento</option>
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
              {saving ? "Salvando…" : editing ? "Salvar alterações" : "Criar categoria"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Excluir categoria"
        description={`Tem certeza que deseja excluir "${deleteTarget?.name}"? Essa ação não pode ser desfeita.`}
        error={deleteError}
        loading={deleting}
      />
    </div>
  );
}
