import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FlowMark from './FlowMark';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#F5F6F4]/90 backdrop-blur-sm border-b border-[#E4E7E2]'
          : ''
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-12 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 select-none" aria-label="Fluxo">
          <FlowMark gradientId="nav-grad" />
          <span
            className="text-[17px] font-semibold tracking-[-0.02em] text-[#0E1420]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Fluxo
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-[14px] text-[#0E1420]/55">
          <a href="#recursos" className="hover:text-[#0E1420] transition-colors duration-200">
            Funcionalidades
          </a>
          <a href="#precos" className="hover:text-[#0E1420] transition-colors duration-200">
            Preços
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to="/entrar"
            className="hidden sm:inline text-[14px] text-[#0E1420]/55 hover:text-[#0E1420] transition-colors duration-200"
          >
            Entrar
          </Link>
          <Link
            to="/cadastro"
            className="inline-flex items-center gap-1.5 bg-[#0E1420] hover:bg-[#4A3AEB] text-[#F5F6F4] text-[13px] font-medium px-4 py-2 rounded-full transition-all duration-300 hover:shadow-[0_4px_16px_rgba(74,58,235,0.28)]"
          >
            Começar grátis
          </Link>
        </div>
      </div>
    </header>
  );
}
