import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import FlowMark from "../FlowMark";
import AmbientFlowLine from "./AmbientFlowLine";

export default function AuthLayout({
  eyebrow,
  title,
  subtitle,
  footer,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F6F4] lg:grid lg:grid-cols-2" style={{ fontFamily: "var(--font-body)" }}>
      <div className="relative hidden overflow-hidden bg-[#0E1420] px-12 py-10 lg:flex lg:flex-col lg:justify-between xl:px-16">
        <div
          className="pointer-events-none absolute inset-x-[-10%] bottom-0 h-[55%]"
          style={{ background: "radial-gradient(closest-side, rgba(79,140,255,0.14), transparent 70%)" }}
        />
        <AmbientFlowLine />

        <Link to="/" className="relative z-10 flex items-center gap-2.5 select-none" aria-label="Fluxo">
          <FlowMark gradientId="auth-mark" />
          <span
            className="text-[17px] font-semibold tracking-[-0.02em] text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Fluxo
          </span>
        </Link>

        <div className="relative z-10 max-w-sm">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#8C9EFF]">{eyebrow}</p>
          <h1
            className="mt-4 text-[2.4rem] font-semibold leading-[1.08] tracking-[-0.02em] text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {title}
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-white/50">{subtitle}</p>
        </div>

        <p className="relative z-10 font-mono text-xs text-white/30">
          Usado por mais de 2.400 negócios no Brasil
        </p>
      </div>

      <div className="flex min-h-screen flex-col px-6 py-8 sm:px-10 lg:min-h-0 lg:justify-center lg:px-16 xl:px-24">
        <Link to="/" className="mb-10 flex items-center gap-2.5 select-none lg:hidden" aria-label="Fluxo">
          <FlowMark gradientId="auth-mark-mobile" className="h-6 w-6" />
          <span
            className="text-[15px] font-semibold tracking-[-0.02em] text-[#0E1420]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Fluxo
          </span>
        </Link>

        <div className="mx-auto w-full max-w-sm">
          {children}
          <p className="mt-8 text-[13px] text-[#0E1420]/55">{footer}</p>
        </div>
      </div>
    </div>
  );
}
