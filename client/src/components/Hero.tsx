import { useEffect, useState, type CSSProperties } from "react";

const PARTNERS = ["Nortis", "Verba Contábil", "Cais & Rota", "Malote", "Sigma Finanças"];

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return reduced;
}


function FlowChart({ reduced }: { reduced: boolean }) {
  const path =
    "M0,224 C110,182 170,258 292,232 C414,206 470,122 596,142 C722,162 758,238 892,212 C1026,186 1084,112 1208,132 C1300,146 1370,168 1440,152";
  const areaPath = `${path} L1440,360 L0,360 Z`;

  const calloutStyle = (delayMs: number): CSSProperties =>
    reduced
      ? {}
      : { opacity: 0, animation: `fade-slide-up 0.6s ease ${delayMs}ms forwards` };

  return (
    <div className="relative h-[220px] w-full overflow-hidden sm:h-[280px] lg:h-[340px]">
      <div
        className="absolute inset-y-0 inset-x-[-10%]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(79,140,255,0.16), transparent 70%)",
          width: "60%",
          left: "20%",
          animation: reduced ? undefined : "drift-glow 16s ease-in-out infinite",
        }}
      />
      <svg viewBox="0 0 1440 360" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="chart-line" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#4A3AEB" />
            <stop offset="1" stopColor="#4F8CFF" />
          </linearGradient>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#4F8CFF" stopOpacity="0.16" />
            <stop offset="1" stopColor="#4F8CFF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#chart-fill)" />
        <path
          d={path}
          fill="none"
          stroke="url(#chart-line)"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength={1}
          style={{
            strokeDasharray: 1,
            strokeDashoffset: reduced ? 0 : 1,
            animation: reduced ? undefined : "draw-line 1.6s cubic-bezier(.16,1,.3,1) 0.5s forwards",
          }}
        />
      </svg>

      <div
        className="absolute -translate-x-1/2 -translate-y-full"
        style={{ left: "41%", top: "36%" }}
      >
        <div
          className="flex flex-col items-start gap-1 rounded-lg border border-[#E4E7E2] bg-white/95 px-3 py-2 shadow-[0_10px_30px_rgba(14,20,32,0.08)] backdrop-blur"
          style={calloutStyle(2100)}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#1C8C6C]">Entrada prevista</span>
          <span className="font-mono text-sm font-medium text-[#0E1420]">+ R$ 18.240</span>
        </div>
      </div>

      <div
        className="absolute hidden -translate-x-1/2 translate-y-2 sm:block"
        style={{ left: "62%", top: "58%" }}
      >
        <div
          className="flex flex-col items-start gap-1 rounded-lg border border-[#E4E7E2] bg-white/95 px-3 py-2 shadow-[0_10px_30px_rgba(14,20,32,0.08)] backdrop-blur"
          style={calloutStyle(2300)}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#9A5B2E]">Contas a pagar</span>
          <span className="font-mono text-sm font-medium text-[#0E1420]">R$ 6.900</span>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  const reduced = useReducedMotion();

  const entrance = (delayMs: number) =>
    reduced
      ? {}
      : {
          opacity: 0,
          animation: `fade-slide-up 0.7s cubic-bezier(.16,1,.3,1) ${delayMs}ms forwards`,
        };

  return (
    <section className="min-h-screen bg-[#F5F6F4] text-[#0E1420]" style={{ fontFamily: "var(--font-body)" }}>
      <div className="mx-auto flex max-w-6xl flex-col px-6 pt-24 sm:px-10 sm:pt-28 lg:px-12 lg:pt-32">
        <div className="max-w-3xl">
          <p
            className="font-mono text-xs uppercase tracking-[0.18em] text-[#4A3AEB]"
            style={entrance(80)}
          >
            Fluxo de caixa · previsível
          </p>

          <h1
            className="mt-5 text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.02em] sm:text-[3.4rem] lg:text-[4rem]"
            style={{ fontFamily: "var(--font-display)", ...entrance(160) }}
          >
            Veja seu caixa antes
            <br />
            que ele vire problema.
          </h1>

          <p
            className="mt-6 max-w-xl text-lg leading-relaxed text-[#0E1420]/70 sm:text-xl"
            style={entrance(260)}
          >
            O Fluxo organiza suas entradas e saídas automaticamente e mostra, com
            clareza, quanto você vai ter em caixa daqui a 30, 60 ou 90 dias.
          </p>

          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center" style={entrance(340)}>
            <a
              href="#comecar"
              className="group inline-flex items-center gap-2 rounded-full bg-[#0E1420] px-6 py-3.5 text-[15px] font-medium text-white transition-all duration-300 hover:bg-[#4A3AEB] hover:shadow-[0_8px_24px_rgba(74,58,235,0.35)]"
            >
              Começar grátis
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </a>
            <a
              href="#demonstracao"
              className="group inline-flex items-center gap-2 px-2 py-3.5 text-[15px] font-medium text-[#0E1420]"
            >
              Ver demonstração
              <span className="h-px w-5 bg-[#0E1420]/40 transition-all duration-300 group-hover:w-8 group-hover:bg-[#0E1420]" />
            </a>
          </div>

          <div className="mt-14 sm:mt-16" style={entrance(420)}>
            <p className="text-xs text-[#0E1420]/50">
              Já organiza o caixa de mais de 2.400 negócios no Brasil
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
              {PARTNERS.map((name) => (
                <span
                  key={name}
                  className="font-mono text-xs uppercase tracking-[0.08em] text-[#0E1420]/35"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14 sm:mt-20 lg:mt-24" style={entrance(300)}>
        <FlowChart reduced={reduced} />
      </div>
    </section>
  );
}
