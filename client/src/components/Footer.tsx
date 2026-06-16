import React from "react";

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-[#e3e8ee] py-16 px-6 text-[#64748d] text-[13px] font-normal leading-relaxed">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
                    {/* Logo and Pitch */}
                    <div className="col-span-2 text-left">
                        <div className="flex items-center gap-2 text-lg font-semibold tracking-[-0.64px] text-[#0d253d] mb-4 select-none">
                            <img
                                src="/logo.png"
                                alt="FLUXO"
                                className="h-6 w-auto object-contain"
                            />
                            <span className="font-bold tracking-[-0.4px]">
                                FLUXO
                            </span>
                        </div>
                        <p className="max-w-[260px] font-light text-[13px] leading-relaxed">
                            Infraestrutura moderna e intuitiva para o
                            gerenciamento de receitas, despesas e investimentos
                            pessoais.
                        </p>
                    </div>

                    {/* Column 2: Produto */}
                    <div className="text-left">
                        <h4 className="font-semibold text-[#0d253d] uppercase text-[11px] tracking-wider mb-4">
                            Produto
                        </h4>
                        <ul className="space-y-2.5 font-light">
                            <li>
                                <a
                                    href="#recursos"
                                    className="hover:text-[#533afd] transition-colors"
                                >
                                    Funcionalidades
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#precos"
                                    className="hover:text-[#533afd] transition-colors"
                                >
                                    Preços
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/register"
                                    className="hover:text-[#533afd] transition-colors"
                                >
                                    Criar Conta
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/login"
                                    className="hover:text-[#533afd] transition-colors"
                                >
                                    Autenticação
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Recursos */}
                    <div className="text-left">
                        <h4 className="font-semibold text-[#0d253d] uppercase text-[11px] tracking-wider mb-4">
                            Recursos
                        </h4>
                        <ul className="space-y-2.5 font-light">
                            <li>
                                <a
                                    href="/docs/api"
                                    className="hover:text-[#533afd] transition-colors"
                                >
                                    API Docs
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/docs/arquitetura"
                                    className="hover:text-[#533afd] transition-colors"
                                >
                                    Arquitetura
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/docs/banco"
                                    className="hover:text-[#533afd] transition-colors"
                                >
                                    Banco de Dados
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-[#533afd] transition-colors"
                                >
                                    Status
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Legal */}
                    <div className="text-left">
                        <h4 className="font-semibold text-[#0d253d] uppercase text-[11px] tracking-wider mb-4">
                            Legal
                        </h4>
                        <ul className="space-y-2.5 font-light">
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-[#533afd] transition-colors"
                                >
                                    Privacidade
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-[#533afd] transition-colors"
                                >
                                    Termos de Uso
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-[#533afd] transition-colors"
                                >
                                    Segurança
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-[#533afd] transition-colors"
                                >
                                    Cookies
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-[#e3e8ee] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-left">
                    <div className="font-light text-[12px] text-[#64748d]/80">
                        &copy; {currentYear} FLUXO. Todos os direitos
                        reservados. Inspirado na linguagem de design da Stripe.
                    </div>
                    <div className="flex gap-4 items-center">
                        <a
                            href="#"
                            className="text-[#64748d] hover:text-[#533afd] transition-colors"
                        >
                            <span className="sr-only">Twitter</span>
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                        </a>
                        <a
                            href="#"
                            className="text-[#64748d] hover:text-[#533afd] transition-colors"
                        >
                            <span className="sr-only">GitHub</span>
                            <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
