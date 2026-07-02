import { useEffect, useRef, useState, type ElementType } from "react";
import { Landmark, Tags, Waves, BarChart3 } from "lucide-react";

type Feature = {
  icon: ElementType;
  title: string;
  description: string;
  meta: string;
};

const FEATURES: Feature[] = [
  {
    icon: Landmark,
    title: "Conecta com seu banco",
    description:
      "Seus extratos chegam automaticamente via Open Finance, sem exportar CSV nem colar planilha.",
    meta: "Sincroniza a cada 15 min",
  },
  {
    icon: Tags,
    title: "Organiza cada lançamento",
    description:
      "Cada entrada e saída é classificada por categoria assim que chega, sem revisão linha por linha.",
    meta: "Aplica-se em segundos",
  },
  {
    icon: Waves,
    title: "Projeta seu caixa futuro",
    description:
      "Fluxo cruza recebíveis e compromissos para mostrar quanto vai sobrar hoje, em 30 e em 90 dias.",
    meta: "Projeção de 30/60/90 dias",
  },
  {
    icon: BarChart3,
    title: "Mostra o que importa, agora",
    description:
      "Relatórios se atualizam a cada novo lançamento, prontos para decisão sem esperar o fim do mês.",
    meta: "Atualizado em tempo real",
  },
];

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

function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

export default function Features() {
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();
  const revealed = reduced || inView;

  return (
    <section className="bg-white" style={{ fontFamily: "var(--font-body)" }}>
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-28 lg:px-12">
        <div
          className="max-w-2xl"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(16px)",
            transition: reduced ? "none" : "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#4A3AEB]">
            O caminho do seu dinheiro
          </p>
          <h2
            className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-[#0E1420] sm:text-4xl lg:text-[2.75rem]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Da conta bancária à decisão certa.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[#0E1420]/70">
            Do extrato bancário ao relatório pronto — cada etapa conectada, sem
            planilha no meio do caminho.
          </p>
        </div>

        <div ref={ref} className="relative mt-16 sm:mt-20">
          <div className="pointer-events-none absolute left-8 right-8 top-[50px] hidden h-px bg-gradient-to-r from-[#4A3AEB] via-[#4F8CFF] to-[#4A3AEB]/30 lg:block" />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {FEATURES.map(({ icon: Icon, title, description, meta }, index) => (
              <div
                key={title}
                style={{
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? "translateY(0)" : "translateY(16px)",
                  transition: reduced
                    ? "none"
                    : `opacity 0.6s ease ${index * 90}ms, transform 0.6s ease ${index * 90}ms`,
                }}
              >
                <div className="group relative flex h-full flex-col gap-4 rounded-2xl border border-[#E4E7E2] bg-[#F5F6F4] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#4F8CFF]/30 hover:bg-white hover:shadow-[0_16px_40px_rgba(74,58,235,0.10)]">
                  <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[#E4E7E2] bg-white text-[#0E1420] transition-colors duration-300 group-hover:border-[#4F8CFF]/40">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                  </div>

                  <div>
                    <h3
                      className="text-[1.05rem] font-semibold tracking-[-0.01em] text-[#0E1420]"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#0E1420]/65">
                      {description}
                    </p>
                  </div>

                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#0E1420]/40">
                    {meta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
