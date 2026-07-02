import { useState, useEffect } from 'react';

function FlowMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-7 w-7" aria-hidden="true" fill="none">
      <defs>
        <linearGradient id="nav-grad" x1="4" y1="44" x2="44" y2="4" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4A3AEB" />
          <stop offset="1" stopColor="#4F8CFF" />
        </linearGradient>
      </defs>
      <path
        d="M10 44V28c0-9.4 7.6-17 17-17h11L26.6 22.4C22.9 26.1 18 28.8 12.8 30L10 30.6"
        stroke="url(#nav-grad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 44v-9.4c9.4-1.6 17.9-6.4 24.4-13.6"
        stroke="url(#nav-grad)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
    </svg>
  );
}

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
        <a href="/" className="flex items-center gap-2.5 select-none" aria-label="Fluxo">
          <FlowMark />
          <span
            className="text-[17px] font-semibold tracking-[-0.02em] text-[#0E1420]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Fluxo
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-7 text-[14px] text-[#0E1420]/55">
          <a href="#recursos" className="hover:text-[#0E1420] transition-colors duration-200">
            Funcionalidades
          </a>
          <a href="#precos" className="hover:text-[#0E1420] transition-colors duration-200">
            Preços
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="#entrar"
            className="hidden sm:inline text-[14px] text-[#0E1420]/55 hover:text-[#0E1420] transition-colors duration-200"
          >
            Entrar
          </a>
          <a
            href="#comecar"
            className="inline-flex items-center gap-1.5 bg-[#0E1420] hover:bg-[#4A3AEB] text-[#F5F6F4] text-[13px] font-medium px-4 py-2 rounded-full transition-all duration-300 hover:shadow-[0_4px_16px_rgba(74,58,235,0.28)]"
          >
            Começar grátis
          </a>
        </div>
      </div>
    </header>
  );
}
