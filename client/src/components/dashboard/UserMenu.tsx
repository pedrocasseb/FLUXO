import { useEffect, useRef, useState } from "react";
import { LogOut } from "lucide-react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useDelayedMount } from "../../hooks/useDelayedMount";
import { EASE_FLUID } from "../../lib/motion";

const MENU_DURATION = 160;

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function UserMenu({
  name,
  email,
  onLogout,
}: {
  name: string;
  email: string;
  onLogout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const hoverTimeoutRef = useRef<number | undefined>(undefined);
  const reduced = useReducedMotion();
  const mounted = useDelayedMount(open, reduced ? 0 : MENU_DURATION);

  useEffect(() => {
    return () => window.clearTimeout(hoverTimeoutRef.current);
  }, []);

  function openMenu() {
    window.clearTimeout(hoverTimeoutRef.current);
    setOpen(true);
  }

  function closeMenu() {
    setOpen(false);
  }

  function scheduleClose() {
    hoverTimeoutRef.current = window.setTimeout(closeMenu, 150);
  }

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => (open ? closeMenu() : openMenu())}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-semibold text-white transition-transform duration-200 hover:scale-105"
        style={{
          fontFamily: "var(--font-display)",
          background: "linear-gradient(135deg, #4A3AEB, #4F8CFF)",
        }}
      >
        {initialsFor(name)}
      </button>

      {mounted && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-[#E4E7E2] bg-white p-2 shadow-[0_16px_40px_rgba(14,20,32,0.12)]"
          style={
            reduced
              ? undefined
              : {
                  transformOrigin: "top right",
                  animation: `${open ? "menu-pop-in" : "menu-pop-out"} ${MENU_DURATION}ms ${EASE_FLUID} both`,
                }
          }
        >
          <div className="px-3 py-2.5">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#0E1420]/40">
              Conectado como
            </p>
            <p className="mt-1 truncate text-[14px] font-medium text-[#0E1420]">{email}</p>
          </div>

          <div className="my-1 h-px bg-[#E4E7E2]" />

          <button
            type="button"
            role="menuitem"
            onClick={onLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[14px] text-[#0E1420]/70 transition-colors duration-200 hover:bg-[#F5F6F4] hover:text-[#0E1420]"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} />
            Sair
          </button>
        </div>
      )}
    </div>
  );
}
