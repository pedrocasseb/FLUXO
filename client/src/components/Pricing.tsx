import { useEffect, useRef, useState } from 'react';

const FREE_FEATURES = [
  'Até 50 transações por mês',
  '8 categorias padrão',
  'Resumo financeiro mensal',
  'Acesso via web e mobile',
];

const PRO_FEATURES = [
  'Transações ilimitadas',
  '48 categorias + personalizadas',
  'Dashboard analítico avançado',
  'Projeção de caixa 30/60/90 dias',
  'Exportação de relatórios CSV',
  'Suporte prioritário via chat',
];

function Check({ light = false }: { light?: boolean }) {
  return (
    <svg
      className="w-4 h-4 flex-shrink-0"
      fill="none"
      viewBox="0 0 16 16"
      style={{ color: light ? '#4F8CFF' : '#4A3AEB' }}
    >
      <path
        d="M3 8l3.5 3.5L13 4.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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

export default function Pricing() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section id="precos" className="bg-[#F5F6F4]" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-28 lg:px-12">

        <div className="text-center max-w-xl mx-auto mb-16">
          <p
            className="text-xs uppercase tracking-[0.18em] text-[#4A3AEB] mb-4"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            Planos
          </p>
          <h2
            className="text-3xl font-semibold tracking-[-0.02em] text-[#0E1420] sm:text-4xl lg:text-[2.75rem]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Comece grátis.<br />Evolua quando quiser.
          </h2>
          <p className="mt-4 text-[15px] text-[#0E1420]/60 leading-relaxed">
            Sem cobranças surpresa. Cancele quando precisar.
          </p>
        </div>

        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          {/* Free */}
          <div className="bg-white border border-[#E4E7E2] rounded-2xl p-8 flex flex-col">
            <div className="mb-8">
              <h3
                className="text-[17px] font-semibold text-[#0E1420] tracking-[-0.01em]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Básico
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span
                  className="text-[40px] font-semibold text-[#0E1420] tracking-[-0.04em]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  R$&nbsp;0
                </span>
                <span className="text-[13px] text-[#0E1420]/40 ml-0.5">/ para sempre</span>
              </div>
              <p className="mt-3 text-[13px] text-[#0E1420]/55 leading-relaxed">
                Ideal para começar a organizar suas finanças pessoais.
              </p>
            </div>

            <ul className="space-y-3.5 flex-1">
              {FREE_FEATURES.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[13px] text-[#0E1420]/70">
                  <Check />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="#comecar"
              className="mt-8 w-full text-center py-3 rounded-full border border-[#0E1420]/15 text-[13px] font-medium text-[#0E1420] hover:border-[#0E1420]/30 hover:bg-[#F5F6F4] transition-all duration-200"
            >
              Começar grátis
            </a>
          </div>

          {/* Pro */}
          <div className="bg-[#0E1420] rounded-2xl p-8 flex flex-col relative overflow-hidden">
            <span className="absolute top-0 right-0 bg-[#4A3AEB] text-white text-[10px] font-semibold uppercase tracking-[0.08em] px-4 py-1.5 rounded-bl-xl">
              Mais popular
            </span>

            <div className="mb-8">
              <h3
                className="text-[17px] font-semibold text-white tracking-[-0.01em]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Pro
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span
                  className="text-[40px] font-semibold text-white tracking-[-0.04em]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  R$&nbsp;19
                </span>
                <span className="text-[13px] text-white/35 ml-0.5">/ por mês</span>
              </div>
              <p className="mt-3 text-[13px] text-white/50 leading-relaxed">
                Para quem leva finanças a sério e quer visibilidade total.
              </p>
            </div>

            <ul className="space-y-3.5 flex-1">
              {PRO_FEATURES.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[13px] text-white/65">
                  <Check light />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="#comecar"
              className="mt-8 w-full text-center py-3 rounded-full bg-white hover:bg-[#F5F6F4] text-[13px] font-medium text-[#0E1420] transition-all duration-200"
            >
              Assinar Pro
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
