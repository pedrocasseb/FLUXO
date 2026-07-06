import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import FlowMark from "../FlowMark";
import UserMenu from "./UserMenu";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { EASE_FLUID } from "../../lib/motion";
import type { AuthUser } from "../../lib/api";

const NAV_LINKS = [
  { label: "Painel", to: "/dashboard" },
  { label: "Categorias", to: "/categorias" },
  { label: "Transações", to: "/transacoes" },
  { label: "Metas", to: "/metas" },
  { label: "Assinaturas", to: "/assinaturas" },
];

export default function AppHeader({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const location = useLocation();
  const reduced = useReducedMotion();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  return (
    <header className="relative border-b border-[#E4E7E2] bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-10 lg:px-12">
        <div className="flex items-center gap-6 sm:gap-10">
          <Link to="/dashboard" className="flex items-center gap-2.5 select-none" aria-label="Fluxo">
            <FlowMark gradientId="app-mark" />
            <span
              className="hidden text-[17px] font-semibold tracking-[-0.02em] text-[#0E1420] sm:inline"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Fluxo
            </span>
          </Link>

          <nav className="hidden items-center gap-6 text-[14px] sm:flex">
            {NAV_LINKS.map(({ label, to }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`transition-colors duration-200 ${
                    active ? "font-medium text-[#0E1420]" : "text-[#0E1420]/55 hover:text-[#0E1420]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          <UserMenu name={user.name} email={user.email} onLogout={onLogout} />
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#0E1420]/60 transition-colors duration-200 hover:bg-[#F5F6F4] hover:text-[#0E1420] sm:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" strokeWidth={1.75} /> : <Menu className="h-5 w-5" strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-x-0 bottom-0 top-16 z-40 bg-[#0E1420]/30 sm:hidden"
            onClick={() => setMobileOpen(false)}
            style={reduced ? undefined : { animation: `fade-in 160ms ${EASE_FLUID} both` }}
          />
          <nav
            id="mobile-nav"
            className="absolute inset-x-0 top-full z-50 border-b border-[#E4E7E2] bg-white p-3 shadow-[0_16px_32px_rgba(14,20,32,0.12)] sm:hidden"
            style={reduced ? undefined : { animation: `fade-slide-up 180ms ${EASE_FLUID} both` }}
          >
            {NAV_LINKS.map(({ label, to }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`block rounded-xl px-4 py-3 text-[15px] transition-colors duration-200 ${
                    active ? "bg-[#F5F6F4] font-medium text-[#0E1420]" : "text-[#0E1420]/65 hover:bg-[#F5F6F4] hover:text-[#0E1420]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </>
      )}
    </header>
  );
}
