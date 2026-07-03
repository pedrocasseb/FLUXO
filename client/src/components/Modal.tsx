import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useDelayedMount } from "../hooks/useDelayedMount";
import { EASE_FLUID } from "../lib/motion";

const MODAL_DURATION = 200;

export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const mounted = useDelayedMount(open, reduced ? 0 : MODAL_DURATION);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-[#0E1420]/40 backdrop-blur-sm"
        onClick={onClose}
        style={
          reduced
            ? undefined
            : { animation: `${open ? "fade-in" : "fade-out"} ${MODAL_DURATION}ms ${EASE_FLUID} both` }
        }
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-md rounded-2xl border border-[#E4E7E2] bg-white p-6 shadow-[0_24px_60px_rgba(14,20,32,0.18)]"
        style={
          reduced
            ? undefined
            : {
                animation: `${open ? "modal-pop-in" : "modal-pop-out"} ${MODAL_DURATION}ms ${EASE_FLUID} both`,
              }
        }
      >
        <div className="mb-5 flex items-center justify-between">
          <h2
            className="text-[1.15rem] font-semibold tracking-[-0.01em] text-[#0E1420]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#0E1420]/40 transition-colors duration-200 hover:bg-[#F5F6F4] hover:text-[#0E1420]"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
