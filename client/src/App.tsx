import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/Navbar';
import { GradientMesh } from './components/GradientMesh';
import { DashboardPreview } from './components/DashboardPreview';
import { Features } from './components/Features';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const [currentPage, setCurrentPage] = useState<string>('home');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const heroRef = useRef<HTMLDivElement>(null);
  const featuresContainerRef = useRef<HTMLDivElement>(null);
  const pricingContainerRef = useRef<HTMLDivElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (currentPage === 'home') {
      // Clear any active scroll triggers to prevent memory leaks or duplicates on navigation
      ScrollTrigger.getAll().forEach(t => t.kill());

      // 1. Hero Animation (GSAP timeline)
      if (heroRef.current) {
        const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 0.8 } });
        
        tl.fromTo(heroRef.current.querySelector('.hero-eyebrow'),
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 }
        )
        .fromTo(heroRef.current.querySelector('.hero-title'),
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 0.9 },
          '-=0.4'
        )
        .fromTo(heroRef.current.querySelector('.hero-subtitle'),
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.9 },
          '-=0.6'
        )
        .fromTo(heroRef.current.querySelectorAll('.hero-btn'),
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 },
          '-=0.6'
        )
        .fromTo(heroRef.current.querySelector('.hero-mockup'),
          { opacity: 0, y: 48, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'back.out(1.15)' },
          '-=0.5'
        );
      }

      // 2. Features Animation (ScrollTrigger)
      if (featuresContainerRef.current) {
        const header = featuresContainerRef.current.querySelector('div.text-center');
        const cards = featuresContainerRef.current.querySelectorAll('.grid > div');

        if (header) {
          gsap.fromTo(header,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              scrollTrigger: {
                trigger: header,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        if (cards.length > 0) {
          gsap.fromTo(cards,
            { opacity: 0, y: 48 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.2,
              scrollTrigger: {
                trigger: cards[0],
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      }

      // 3. Pricing Animation (ScrollTrigger)
      if (pricingContainerRef.current) {
        const header = pricingContainerRef.current.querySelector('div.text-center');
        const cards = pricingContainerRef.current.querySelectorAll('.grid > div');

        if (header) {
          gsap.fromTo(header,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              scrollTrigger: {
                trigger: header,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }

        if (cards.length > 0) {
          gsap.fromTo(cards,
            { opacity: 0, y: 48 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.2,
              scrollTrigger: {
                trigger: cards[0],
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      }

      // 4. CTA Animation (ScrollTrigger)
      if (ctaContainerRef.current) {
        const content = ctaContainerRef.current.querySelector('div.max-w-\\[1200px\\]');
        if (content) {
          gsap.fromTo(content,
            { opacity: 0, scale: 0.96, y: 32 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.9,
              scrollTrigger: {
                trigger: content,
                start: 'top 85%',
                toggleActions: 'play none none none'
              }
            }
          );
        }
      }
    }

    // Cleanup triggers on unmount
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [currentPage]);

  return (
    <div className="relative min-h-screen bg-white text-[#0d253d] font-sans selection:bg-[#533afd]/20">
      
      {/* Global Navbar */}
      <Navbar onNavigate={handleNavigate} currentPage={currentPage} />

      {/* Render Home / Landing Page */}
      {currentPage === 'home' && (
        <main className="">
          
          {/* Hero Section */}
          <section className="relative overflow-hidden pt-36 pb-16 md:pt-48 md:pb-24">
            {/* Organic moving gradient mesh in the background */}
            <GradientMesh />

            <div ref={heroRef} className="max-w-[1200px] mx-auto px-6 relative z-10 text-center">
              
              {/* Soft Tag Pill */}
              <div className="hero-eyebrow opacity-0 inline-flex items-center gap-1.5 bg-[#b9b9f9]/30 text-[#4434d4] text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6 border border-[#533afd]/10">
                <span>Lançamento</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#ea2261]" />
                <span className="font-light">FLUXO v1.0</span>
              </div>

              {/* Display Headline */}
              <h1 className="hero-title opacity-0 text-4xl md:text-[56px] font-light leading-[1.05] tracking-[-1.4px] text-[#0d253d] max-w-[850px] mx-auto">
                A infraestrutura financeira projetada para o seu controle
              </h1>

              {/* Subtitle */}
              <p className="hero-subtitle opacity-0 text-[16px] md:text-[18px] font-light text-[#273951] mt-6 max-w-[620px] mx-auto leading-relaxed">
                Gerencie despesas, acompanhe receitas e planeje seus investimentos em uma interface moderna, minimalista e focada no que realmente importa.
              </p>

              {/* Buttons Row */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
                <a
                  href="/register"
                  onClick={(e) => { e.preventDefault(); handleNavigate('register'); }}
                  className="hero-btn opacity-0 w-full sm:w-auto bg-[#533afd] hover:bg-[#4434d4] active:bg-[#2e2b8c] text-white text-[15px] font-normal px-6 py-2.5 rounded-full transition-all duration-200 shadow-md shadow-[#003770]/10 text-center min-h-[44px] flex items-center justify-center"
                >
                  Começar Agora
                </a>
                <a
                  href="#recursos"
                  className="hero-btn opacity-0 w-full sm:w-auto bg-white hover:bg-gray-50 text-[#533afd] border border-[#e3e8ee] text-[15px] font-normal px-6 py-2.5 rounded-full transition-all duration-200 text-center min-h-[44px] flex items-center justify-center"
                >
                  Ver Funcionalidades
                </a>
              </div>

              {/* Composited Dashboard Mockup */}
              <div className="hero-mockup opacity-0">
                <DashboardPreview />
              </div>

            </div>
          </section>

          {/* Features Section */}
          <div ref={featuresContainerRef}>
            <Features />
          </div>

          {/* Pricing Section */}
          <div ref={pricingContainerRef}>
            <Pricing />
          </div>

          {/* CTA Section */}
          <div ref={ctaContainerRef}>
            <section className="py-24 bg-[#0d253d] text-white relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#533afd_1px,transparent_1px)] [background-size:16px_16px]" />
              
              <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center">
                <h2 className="text-3xl md:text-[40px] font-light tracking-[-0.96px] text-white max-w-[650px] mx-auto leading-tight">
                  Pronto para assumir o controle do seu fluxo financeiro?
                </h2>
                <p className="text-[15px] font-light text-[#b9b9f9] mt-4 max-w-[480px] mx-auto leading-relaxed">
                  Crie sua conta em menos de dois minutos e comece a otimizar sua economia hoje mesmo.
                </p>
                
                <div className="mt-10">
                  <a
                    href="/register"
                    onClick={(e) => { e.preventDefault(); handleNavigate('register'); }}
                    className="inline-flex bg-[#533afd] hover:bg-[#4434d4] active:bg-[#2e2b8c] text-white text-[15px] font-normal px-8 py-3 rounded-full transition-all duration-200 shadow-lg shadow-black/20 min-h-[44px] items-center"
                  >
                    Criar Conta Grátis
                  </a>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Section */}
          <Footer />

        </main>
      )}

      {/* Render Login Page */}
      {currentPage === 'login' && (
        <main className="relative min-h-screen w-full flex items-center justify-center bg-[#f6f9fc] pt-28 pb-12 overflow-hidden animate-fade-in">
          {/* Subtle animated background gradient */}
          <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
            <GradientMesh />
          </div>
          
          <div className="w-full max-w-[400px] bg-white border border-[#e3e8ee] p-8 rounded-xl shadow-lg mx-4 text-left relative z-10 animate-fade-in-up">
            <h2 className="text-[26px] font-light text-[#0d253d] tracking-[-0.26px] mb-2">
              Entrar no FLUXO
            </h2>
            <p className="text-[14px] font-light text-[#64748d] mb-6">
              Gerencie suas despesas e investimentos de forma inteligente.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#273951] mb-1.5">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full bg-white text-[#0d253d] text-[15px] font-light px-3.5 py-2.5 rounded-lg border border-[#a8c3de] focus:border-[#533afd] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-[12px] font-medium text-[#273951]">Senha</label>
                  <a href="#" className="text-[12px] text-[#533afd] hover:text-[#4434d4]">Esqueceu a senha?</a>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white text-[#0d253d] text-[15px] font-light px-3.5 py-2.5 rounded-lg border border-[#a8c3de] focus:border-[#533afd] focus:outline-none transition-colors"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#533afd] hover:bg-[#4434d4] text-white text-[15px] font-normal py-2.5 rounded-full transition-all mt-6 shadow-sm min-h-[44px]"
              >
                Entrar
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#e3e8ee] text-center text-[13px] font-light text-[#64748d]">
              Não tem uma conta?{' '}
              <a 
                href="/register" 
                onClick={(e) => { e.preventDefault(); handleNavigate('register'); }}
                className="text-[#533afd] hover:text-[#4434d4] font-medium"
              >
                Cadastre-se grátis
              </a>
            </div>
          </div>
        </main>
      )}

      {/* Render Register Page */}
      {currentPage === 'register' && (
        <main className="relative min-h-screen w-full flex items-center justify-center bg-[#f6f9fc] pt-28 pb-12 overflow-hidden animate-fade-in">
          {/* Subtle animated background gradient */}
          <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
            <GradientMesh />
          </div>

          <div className="w-full max-w-[400px] bg-white border border-[#e3e8ee] p-8 rounded-xl shadow-lg mx-4 text-left relative z-10 animate-fade-in-up">
            <h2 className="text-[26px] font-light text-[#0d253d] tracking-[-0.26px] mb-2">
              Criar sua conta
            </h2>
            <p className="text-[14px] font-light text-[#64748d] mb-6">
              Comece a gerenciar suas finanças de forma editorial.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div>
                <label className="block text-[12px] font-medium text-[#273951] mb-1.5">Nome Completo</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full bg-white text-[#0d253d] text-[15px] font-light px-3.5 py-2.5 rounded-lg border border-[#a8c3de] focus:border-[#533afd] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#273951] mb-1.5">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full bg-white text-[#0d253d] text-[15px] font-light px-3.5 py-2.5 rounded-lg border border-[#a8c3de] focus:border-[#533afd] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#273951] mb-1.5">Senha</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-white text-[#0d253d] text-[15px] font-light px-3.5 py-2.5 rounded-lg border border-[#a8c3de] focus:border-[#533afd] focus:outline-none transition-colors"
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-[#533afd] hover:bg-[#4434d4] text-white text-[15px] font-normal py-2.5 rounded-full transition-all mt-6 shadow-sm min-h-[44px]"
              >
                Criar Conta Grátis
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-[#e3e8ee] text-center text-[13px] font-light text-[#64748d]">
              Já possui uma conta?{' '}
              <a 
                href="/login" 
                onClick={(e) => { e.preventDefault(); handleNavigate('login'); }}
                className="text-[#533afd] hover:text-[#4434d4] font-medium"
              >
                Fazer Login
              </a>
            </div>
          </div>
        </main>
      )}

    </div>
  );
};

export default App;
