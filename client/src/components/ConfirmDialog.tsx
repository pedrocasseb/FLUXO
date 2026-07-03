import Modal from "./Modal";
import ErrorBanner from "./ErrorBanner";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Excluir",
  loading = false,
  error = null,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  loading?: boolean;
  error?: string | null;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      {error && (
        <div className="mb-4">
          <ErrorBanner message={error} />
        </div>
      )}
      <p className="text-[14px] leading-relaxed text-[#0E1420]/60">{description}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full px-4 py-2.5 text-[14px] font-medium text-[#0E1420]/60 transition-colors duration-200 hover:text-[#0E1420]"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="rounded-full border border-[#E8B8AE] bg-[#FBEEE9] px-5 py-2.5 text-[14px] font-medium text-[#A5402F] transition-colors duration-200 hover:bg-[#F6DCD3] disabled:pointer-events-none disabled:opacity-60"
        >
          {loading ? "Excluindo…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
