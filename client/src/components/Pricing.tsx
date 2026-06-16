import React from 'react';

export const Pricing: React.FC = () => {
  return (
    <section id="precos" className="py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Section Opener */}
        <div className="text-center max-w-[600px] mx-auto mb-16">
          <span className="text-[10px] uppercase font-semibold text-[#533afd] tracking-[0.1px] bg-[#533afd]/10 px-2.5 py-1 rounded-full">
            Planos
          </span>
          <h2 className="text-3xl md:text-4xl font-light text-[#0d253d] tracking-[-0.96px] mt-4 leading-tight">
            Planos transparentes para qualquer fluxo financeiro
          </h2>
          <p className="text-[15px] font-light text-[#64748d] mt-3 leading-relaxed">
            Sem custos ocultos. Escolha o plano ideal e tenha controle total em minutos.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[900px] mx-auto">
          
          {/* Card 1: Standard Pricing Card */}
          <div className="bg-white border border-[#e3e8ee] p-8 rounded-xl shadow-sm flex flex-col justify-between text-left hover:shadow-md transition-all duration-300">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[22px] font-light text-[#0d253d] tracking-[-0.22px]">
                  Básico
                </h3>
                <span className="text-[11px] font-semibold text-[#64748d] uppercase tracking-wider">Pessoal</span>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-light text-[#0d253d] tracking-[-0.96px] font-tnum">R$ 0</span>
                <span className="text-[14px] text-[#64748d] font-light ml-1">/ para sempre</span>
              </div>
              <p className="text-[14px] font-light text-[#64748d] leading-relaxed mb-8">
                Ideal para organizar suas contas básicas e começar a entender seu padrão de despesas e receitas.
              </p>
              
              {/* Features List */}
              <ul className="space-y-3.5 mb-8 text-[14px] text-[#273951] font-light">
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#533afd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Até 50 transações por mês
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#533afd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Categorias personalizadas básicas
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#533afd]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Resumo financeiro mensal simples
                </li>
              </ul>
            </div>

            <a 
              href="/register" 
              className="w-full bg-[#533afd] hover:bg-[#4434d4] active:bg-[#2e2b8c] text-white text-[15px] font-normal py-2.5 rounded-full text-center transition-all duration-200 shadow-sm"
            >
              Começar Grátis
            </a>
          </div>

          {/* Card 2: Featured Pricing Card (Inverted Dark Theme) */}
          <div className="bg-[#1c1e54] text-white p-8 rounded-xl shadow-xl flex flex-col justify-between text-left hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
            {/* Pop accent */}
            <div className="absolute top-0 right-0 bg-[#533afd] text-white text-[10px] uppercase font-semibold tracking-wider px-4 py-1.5 rounded-bl-lg">
              Popular
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[22px] font-light text-white tracking-[-0.22px]">
                  Pro
                </h3>
                <span className="text-[11px] font-semibold text-[#b9b9f9] uppercase tracking-wider">Completo</span>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-light text-white tracking-[-0.96px] font-tnum">R$ 19</span>
                <span className="text-[14px] text-[#b9b9f9] font-light ml-1">/ por mês</span>
              </div>
              <p className="text-[14px] font-light text-[#b9b9f9] leading-relaxed mb-8">
                Perfeito para quem deseja controle financeiro total, relatórios automatizados históricos e insights inteligentes.
              </p>
              
              {/* Features List */}
              <ul className="space-y-3.5 mb-8 text-[14px] text-[#b9b9f9] font-light">
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#f96bee]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Transações e categorias ilimitadas
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#f96bee]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Dashboard analítico avançado
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#f96bee]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Projeções estatísticas e insights de evolução
                </li>
                <li className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-[#f96bee]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Suporte prioritário via chat
                </li>
              </ul>
            </div>

            <a 
              href="/register" 
              className="w-full bg-white hover:bg-gray-100 active:bg-gray-200 text-[#0d253d] text-[15px] font-normal py-2.5 rounded-full text-center transition-all duration-200 shadow-sm"
            >
              Assinar Pro
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
