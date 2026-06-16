import React from 'react';

export const Features: React.FC = () => {
  return (
    <section id="recursos" className="py-20 bg-[#f6f9fc] border-y border-[#e3e8ee]">
      <div className="max-w-[1200px] mx-auto px-6">
        
        {/* Section Opener */}
        <div className="text-center max-w-[650px] mx-auto mb-16">
          <span className="text-[10px] uppercase font-semibold text-[#533afd] tracking-[0.1px] bg-[#533afd]/10 px-2.5 py-1 rounded-full">
            Plataforma
          </span>
          <h2 className="text-3xl md:text-4xl font-light text-[#0d253d] tracking-[-0.96px] mt-4 leading-tight">
            Controle absoluto das suas finanças com simplicidade editorial
          </h2>
          <p className="text-[15px] font-light text-[#64748d] mt-4 leading-relaxed">
            Uma interface pensada para quem valoriza clareza visual, dados bem organizados e insights que ajudam a poupar e investir melhor.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Card 1: Standard Feature Card */}
          <div className="bg-white border border-[#e3e8ee] p-8 rounded-xl shadow-sm flex flex-col justify-between text-left hover:shadow-md transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#533afd]/10 flex items-center justify-center text-[#533afd] mb-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
              </div>
              <h3 className="text-[20px] font-light text-[#0d253d] tracking-[-0.26px] mb-3">
                Insights Avançados
              </h3>
              <p className="text-[14px] font-light text-[#64748d] leading-relaxed">
                Descubra automaticamente seus maiores gastos, transações mensais e compare o progresso dos seus investimentos de forma dinâmica.
              </p>
            </div>
            <div className="mt-8">
              <a href="/register" className="text-[#533afd] text-[14px] font-medium hover:text-[#4434d4] flex items-center gap-1.5 transition-colors">
                Saiba mais
                <span>&rarr;</span>
              </a>
            </div>
          </div>

          {/* Card 2: Warm Cream Band Card (The Chromatic Interlude) */}
          <div className="bg-[#f5e9d4] p-8 rounded-xl flex flex-col justify-between text-left hover:shadow-md transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#9b6829]/15 flex items-center justify-center text-[#9b6829] mb-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m.011-2H12m0-2h.01M12 10h.01M12 12h.01M12 14h.01" />
                </svg>
              </div>
              <h3 className="text-[20px] font-light text-[#0d253d] tracking-[-0.26px] mb-3">
                Foco no Patrimônio
              </h3>
              <p className="text-[14px] font-light text-[#273951] leading-relaxed">
                Separamos o que é gasto do que é investimento. Veja sua taxa de economia crescer a cada ciclo com regras de projeção estatísticas simples.
              </p>
            </div>
            <div className="mt-8">
              <a href="/register" className="text-[#533afd] text-[14px] font-medium hover:text-[#4434d4] flex items-center gap-1.5 transition-colors">
                Experimentar agora
                <span>&rarr;</span>
              </a>
            </div>
          </div>

          {/* Card 3: Standard Feature Card */}
          <div className="bg-white border border-[#e3e8ee] p-8 rounded-xl shadow-sm flex flex-col justify-between text-left hover:shadow-md transition-all duration-300">
            <div>
              <div className="w-10 h-10 rounded-full bg-[#533afd]/10 flex items-center justify-center text-[#533afd] mb-6">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-[20px] font-light text-[#0d253d] tracking-[-0.26px] mb-3">
                Isolamento e Segurança
              </h3>
              <p className="text-[14px] font-light text-[#64748d] leading-relaxed">
                Seus dados financeiros pertencem apenas a você. Autenticação JWT stateless com isolamento absoluto a nível de banco de dados.
              </p>
            </div>
            <div className="mt-8">
              <a href="/register" className="text-[#533afd] text-[14px] font-medium hover:text-[#4434d4] flex items-center gap-1.5 transition-colors">
                Ver segurança
                <span>&rarr;</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
