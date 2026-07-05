import { Link, useLocation } from "react-router-dom";
import FlowMark from "../FlowMark";
import UserMenu from "./UserMenu";
import type { AuthUser } from "../../lib/api";

const NAV_LINKS = [
  { label: "Painel", to: "/dashboard" },
  { label: "Categorias", to: "/categorias" },
  { label: "Transações", to: "/transacoes" },
  { label: "Metas", to: "/metas" },
];

export default function AppHeader({ user, onLogout }: { user: AuthUser; onLogout: () => void }) {
  const location = useLocation();

  return (
    <header className="border-b border-[#E4E7E2] bg-white">
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

          <nav className="flex items-center gap-4 text-[13px] sm:gap-6 sm:text-[14px]">
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

        <UserMenu name={user.name} email={user.email} onLogout={onLogout} />
      </div>
    </header>
  );
}
