import React, { useState, useEffect } from "react";

interface NavbarProps {
    onNavigate?: (page: string) => void;
    currentPage?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
    onNavigate,
    currentPage = "home",
}) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed top-6 left-0 w-full z-50 px-4 pointer-events-none">
            <nav
                className={`mx-auto max-w-[960px] w-full rounded-full transition-all duration-300 pointer-events-auto border ${
                    scrolled
                        ? "bg-white/80 backdrop-blur-lg border-[#e3e8ee]/80 shadow-[0_8px_30px_rgba(0,55,112,0.06)] py-3.5 px-6"
                        : "bg-white/40 backdrop-blur-sm border-white/30 py-4 px-6"
                }`}
            >
                <div className="flex items-center justify-between">
                    {/* Logo Wordmark */}
                    <a
                        href="/"
                        onClick={(e) => {
                            e.preventDefault();
                            if (onNavigate) onNavigate("home");
                        }}
                        className="flex items-center gap-2 text-lg font-semibold tracking-[-0.64px] text-[#0d253d] select-none"
                    >
                        <img
                            src="/logo.png"
                            alt="FLUXO"
                            className="h-8 w-auto object-contain"
                        />
                        <span className="font-bold tracking-[-0.4px]">
                            FLUXO
                        </span>
                    </a>

                    {/* Primary Nav Center */}
                    {currentPage === "home" && (
                        <div className="hidden md:flex items-center gap-6 text-[14px] font-normal text-[#273951]">
                            <a
                                href="#recursos"
                                className="hover:text-[#533afd] transition-colors"
                            >
                                Funcionalidades
                            </a>
                            <a
                                href="#precos"
                                className="hover:text-[#533afd] transition-colors"
                            >
                                Preços
                            </a>
                            <a
                                href="#sobre"
                                className="hover:text-[#533afd] transition-colors"
                            >
                                Sobre
                            </a>
                        </div>
                    )}

                    {/* Sign In + Primary Pill CTA */}
                    <div className="flex items-center gap-3.5">
                        <a
                            href="/login"
                            onClick={(e) => {
                                e.preventDefault();
                                if (onNavigate) onNavigate("login");
                            }}
                            className="text-[13px] font-medium text-[#533afd] hover:text-[#4434d4] transition-colors px-2.5 py-1.5"
                        >
                            Entrar
                        </a>
                        <a
                            href="/register"
                            onClick={(e) => {
                                e.preventDefault();
                                if (onNavigate) onNavigate("register");
                            }}
                            className="bg-[#533afd] hover:bg-[#4434d4] active:bg-[#2e2b8c] text-white text-[13px] font-medium px-4 py-1.5 rounded-full transition-all duration-200 shadow-sm shadow-[#003770]/10 flex items-center justify-center min-h-[36px]"
                        >
                            Começar Grátis
                        </a>
                    </div>
                </div>
            </nav>
        </div>
    );
};
