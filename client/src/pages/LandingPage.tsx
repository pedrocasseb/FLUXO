import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useInView } from '../hooks/useInView';
import { EASE_FLUID } from '../lib/motion';

const STATS = [
  { value: '2.4M+', label: 'Transações registradas' },
  { value: '23%', label: 'Economia média mensal' },
  { value: '48', label: 'Categorias disponíveis' },
  { value: '< 2min', label: 'Para começar' },
];

const STEPS = [
  {
    number: '01',
    title: 'Registre suas transações',
    body: 'Adicione uma entrada ou saída em menos de 30 segundos. Data, valor, categoria — pronto.',
  },
  {
    number: '02',
    title: 'Organize por categoria',
    body: 'Alimentação, transporte, saúde, lazer. Cada lançamento no lugar certo, automaticamente.',
  },
  {
    number: '03',
    title: 'Acompanhe a evolução',
    body: 'Gráficos, tendências e projeções mostram para onde vai cada real — e onde economizar mais.',
  },
];

export default function LandingPage() {
  const reduced = useReducedMotion();
  const { ref: statsRef, inView: statsInView } = useInView<HTMLDivElement>();
  const { ref: stepsRef, inView: stepsInView } = useInView<HTMLDivElement>();
  const statsRevealed = reduced || statsInView;
  const stepsRevealed = reduced || stepsInView;

  return (
    <div style={{ fontFamily: 'var(--font-body)' }}>
      <Navbar />
      <Hero />

      {/* Stats strip */}
      <section className="border-y border-[#E4E7E2] bg-white">
        <div ref={statsRef} className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-12 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6">
            {STATS.map(({ value, label }, index) => (
              <div
                key={label}
                className="text-center md:text-left"
                style={{
                  opacity: statsRevealed ? 1 : 0,
                  transform: statsRevealed ? 'translateY(0)' : 'translateY(14px)',
                  transition: reduced
                    ? 'none'
                    : `opacity 0.6s ${EASE_FLUID} ${index * 70}ms, transform 0.6s ${EASE_FLUID} ${index * 70}ms`,
                }}
              >
                <div
                  className="text-[1.9rem] font-semibold tracking-[-0.04em] text-[#0E1420]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {value}
                </div>
                <div className="text-[13px] text-[#0E1420]/45 mt-1 leading-snug">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Features />

      {/* How it works */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-28 lg:px-12">
          <div className="text-center max-w-lg mx-auto mb-16">
            <p
              className="text-xs uppercase tracking-[0.18em] text-[#4A3AEB] mb-4"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              Como funciona
            </p>
            <h2
              className="text-3xl font-semibold tracking-[-0.02em] text-[#0E1420] sm:text-4xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Três passos.<br />Clareza total.
            </h2>
          </div>

          <div ref={stepsRef} className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {STEPS.map(({ number, title, body }, index) => (
              <div
                key={number}
                style={{
                  opacity: stepsRevealed ? 1 : 0,
                  transform: stepsRevealed ? 'translateY(0)' : 'translateY(16px)',
                  transition: reduced
                    ? 'none'
                    : `opacity 0.6s ${EASE_FLUID} ${index * 100}ms, transform 0.6s ${EASE_FLUID} ${index * 100}ms`,
                }}
              >
                <span
                  className="text-[11px] tracking-[0.14em] text-[#4A3AEB] font-medium block mb-4"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  {number}
                </span>
                <h3
                  className="text-[1.1rem] font-semibold text-[#0E1420] tracking-[-0.01em] mb-3"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {title}
                </h3>
                <p className="text-[14px] text-[#0E1420]/55 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Pricing />

      {/* Final CTA */}
      <section className="bg-[#0E1420]">
        <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32 lg:px-12 text-center">
          <h2
            className="text-[2.3rem] sm:text-[3rem] font-semibold tracking-[-0.04em] text-white leading-[1.06]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Pronto para ver onde<br />seu dinheiro vai?
          </h2>
          <p className="mt-5 text-[15px] text-white/45 max-w-sm mx-auto leading-relaxed">
            Configure em menos de dois minutos. Sem cartão de crédito.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/cadastro"
              className="group inline-flex items-center gap-2 bg-white hover:bg-[#F5F6F4] text-[#0E1420] text-[15px] font-medium px-7 py-3.5 rounded-full transition-all duration-300 hover:shadow-[0_8px_32px_rgba(255,255,255,0.12)]"
            >
              Criar conta grátis
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </Link>
            <a
              href="#precos"
              className="text-[14px] text-white/35 hover:text-white/65 transition-colors duration-200"
            >
              Ver planos
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
