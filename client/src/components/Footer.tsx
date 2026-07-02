import { Link } from 'react-router-dom';
import FlowMark from './FlowMark';

const LINKS = {
  Produto: [
    { label: 'Funcionalidades', href: '#recursos' },
    { label: 'Preços', href: '#precos' },
    { label: 'Criar conta', href: '/cadastro' },
  ],
  Empresa: [
    { label: 'Sobre', href: '#sobre' },
    { label: 'Blog', href: '#' },
    { label: 'Contato', href: '#' },
  ],
  Legal: [
    { label: 'Privacidade', href: '#' },
    { label: 'Termos de uso', href: '#' },
    { label: 'Segurança', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer
      className="bg-white border-t border-[#E4E7E2]"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-12 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2">
              <FlowMark />
              <span
                className="text-[16px] font-semibold tracking-[-0.02em] text-[#0E1420]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Fluxo
              </span>
            </div>
            <p className="mt-4 text-[13px] text-[#0E1420]/45 leading-relaxed max-w-[200px]">
              Clareza financeira para pessoas que levam o dinheiro a sério.
            </p>
          </div>

          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0E1420]/35 mb-4">
                {group}
              </h4>
              <ul className="space-y-3">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    {href.startsWith('/') ? (
                      <Link
                        to={href}
                        className="text-[13px] text-[#0E1420]/55 hover:text-[#0E1420] transition-colors duration-200"
                      >
                        {label}
                      </Link>
                    ) : (
                      <a
                        href={href}
                        className="text-[13px] text-[#0E1420]/55 hover:text-[#0E1420] transition-colors duration-200"
                      >
                        {label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-[#E4E7E2] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#0E1420]/30">
          <span>© {new Date().getFullYear()} Fluxo. Todos os direitos reservados.</span>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-[#0E1420]/60 transition-colors duration-200">Twitter</a>
            <a href="#" className="hover:text-[#0E1420]/60 transition-colors duration-200">GitHub</a>
            <a href="#" className="hover:text-[#0E1420]/60 transition-colors duration-200">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
