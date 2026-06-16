import React from 'react';

export const DashboardPreview: React.FC = () => {
  return (
    <div className="w-full max-w-[1100px] mx-auto mt-16 px-4">
      {/* Desktop Multi-layer Composite (Hidden on Mobile) */}
      <div className="hidden lg:grid grid-cols-12 gap-6 relative z-10">
        
        {/* Panel 1: Category Budgets (Left) */}
        <div className="col-span-4 bg-[#0d253d] border border-[#273951] rounded-xl shadow-xl overflow-hidden flex flex-col h-[340px] text-left transform hover:-translate-y-1 transition-all duration-300">
          <div className="px-5 py-3 border-b border-[#273951] flex justify-between items-center bg-[#1c1e54]/20">
            <span className="text-[11px] font-semibold text-white/80 uppercase">Limites Mensais</span>
            <span className="text-[10px] text-[#64748d]">Meta de Gastos</span>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between">
            {/* Limit Progress 1 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-white/90">
                <span className="font-light">Alimentação</span>
                <span className="font-tnum font-light text-[#b9b9f9]">R$ 1.200 / R$ 1.500</span>
              </div>
              <div className="w-full bg-[#273951] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#533afd] h-full rounded-full" style={{ width: '80%' }} />
              </div>
            </div>

            {/* Limit Progress 2 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-white/90">
                <span className="font-light">Transporte</span>
                <span className="font-tnum font-light text-[#b9b9f9]">R$ 450 / R$ 1.000</span>
              </div>
              <div className="w-full bg-[#273951] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#665efd] h-full rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            {/* Limit Progress 3 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-white/90">
                <span className="font-light">Lazer</span>
                <span className="font-tnum font-light text-[#b9b9f9]">R$ 920 / R$ 1.000</span>
              </div>
              <div className="w-full bg-[#273951] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#ea2261] h-full rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            {/* Limit Progress 4 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-white/90">
                <span className="font-light">Assinaturas</span>
                <span className="font-tnum font-light text-[#b9b9f9]">R$ 280 / R$ 300</span>
              </div>
              <div className="w-full bg-[#273951] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#f96bee] h-full rounded-full" style={{ width: '93%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Central Financial Console / Dashboard (Center) */}
        <div className="col-span-5 bg-[#1c1e54] border border-[#273951] rounded-xl shadow-2xl overflow-hidden flex flex-col h-[380px] -mt-6 relative z-20 transform hover:-translate-y-1 transition-all duration-300">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#273951] flex justify-between items-center bg-[#0d253d]/40">
            <span className="text-[12px] font-semibold text-white tracking-wide uppercase">FLUXO CONSOLE</span>
            <span className="text-[11px] bg-[#533afd]/20 text-[#b9b9f9] border border-[#533afd]/30 px-2 py-0.5 rounded-full font-mono">LIVE DATA</span>
          </div>

          <div className="p-6 flex-1 flex flex-col justify-between">
            {/* Balance Overview */}
            <div className="text-left">
              <span className="text-[11px] text-[#61718a] tracking-wider uppercase font-medium">Saldo Disponível</span>
              <h3 className="text-2xl font-light text-white tracking-[-0.64px] font-tnum mt-1">R$ 14.250,00</h3>
            </div>

            {/* Micro graphs / Stats grid */}
            <div className="grid grid-cols-2 gap-4 my-2 text-left">
              <div className="bg-[#0d253d]/50 p-3 rounded-lg border border-[#273951]/40">
                <span className="text-[10px] text-[#64748d] block uppercase">Receitas</span>
                <span className="text-sm font-light text-[#b9b9f9] font-tnum">R$ 5.800,00</span>
              </div>
              <div className="bg-[#0d253d]/50 p-3 rounded-lg border border-[#273951]/40">
                <span className="text-[10px] text-[#64748d] block uppercase">Investimentos</span>
                <span className="text-sm font-light text-[#f96bee] font-tnum">R$ 1.200,00</span>
              </div>
            </div>

            {/* Mini Transaction List */}
            <div className="space-y-2.5 text-left">
              <span className="text-[10px] text-[#61718a] tracking-wider uppercase font-medium">Transações Recentes</span>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-white/90">
                  <span className="font-light">Salário Google</span>
                  <span className="font-tnum font-light text-[#b9b9f9]">+R$ 5.000,00</span>
                </div>
                <div className="flex justify-between items-center text-xs text-white/90">
                  <span className="font-light">Supermercado</span>
                  <span className="font-tnum font-light text-[#ea2261]">-R$ 650,00</span>
                </div>
                <div className="flex justify-between items-center text-xs text-white/90">
                  <span className="font-light">Ações Apple</span>
                  <span className="font-tnum font-light text-[#f96bee]">-R$ 500,00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 3: Financial Chart and Evolution (Right) */}
        <div className="col-span-3 bg-[#0d253d] border border-[#273951] rounded-xl shadow-xl overflow-hidden flex flex-col h-[340px] text-left transform hover:-translate-y-1 transition-all duration-300">
          <div className="px-5 py-3 border-b border-[#273951] flex justify-between items-center bg-[#1c1e54]/20">
            <span className="text-[11px] font-semibold text-white/80 uppercase">Evolução Mensal</span>
            <span className="text-[10px] text-[#64748d]">Últimos 3 meses</span>
          </div>

          <div className="p-5 flex-1 flex flex-col justify-between">
            {/* Visual Bar Chart mockup */}
            <div className="flex items-end justify-around h-[160px] pt-4 border-b border-[#273951]/40 pb-2">
              {/* April */}
              <div className="flex flex-col items-center gap-1.5 w-8">
                <div className="w-2.5 rounded-full bg-[#273951] h-[90px] relative overflow-hidden flex flex-col justify-end">
                  <div className="bg-[#533afd] h-[65px] w-full animate-grow-up delay-100" />
                </div>
                <span className="text-[10px] text-[#64748d]">ABR</span>
              </div>
              {/* May */}
              <div className="flex flex-col items-center gap-1.5 w-8">
                <div className="w-2.5 rounded-full bg-[#273951] h-[90px] relative overflow-hidden flex flex-col justify-end">
                  <div className="bg-[#533afd] h-[75px] w-full animate-grow-up delay-200" />
                </div>
                <span className="text-[10px] text-[#64748d]">MAI</span>
              </div>
              {/* June */}
              <div className="flex flex-col items-center gap-1.5 w-8">
                <div className="w-2.5 rounded-full bg-[#273951] h-[90px] relative overflow-hidden flex flex-col justify-end">
                  <div className="bg-[#533afd] h-[85px] w-full animate-grow-up delay-300" />
                </div>
                <span className="text-[10px] text-white">JUN</span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[#64748d] text-[10px] block uppercase">Meta Mensal</span>
                <span className="text-white font-tnum font-light">85.4%</span>
              </div>
              <div>
                <span className="text-[#64748d] text-[10px] block uppercase">Economia</span>
                <span className="text-white font-tnum font-light">R$ 1.820,00</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile/Tablet Single-panel Mockup (Hidden on Large Screen) */}
      <div className="lg:hidden bg-[#1c1e54] border border-[#273951] rounded-xl shadow-2xl overflow-hidden max-w-[500px] mx-auto text-left">
        {/* Header */}
        <div className="px-5 py-3 border-b border-[#273951] flex justify-between items-center bg-[#0d253d]/40">
          <span className="text-[11px] font-semibold text-white tracking-wide uppercase">FLUXO CONSOLE</span>
          <span className="text-[10px] bg-[#533afd]/20 text-[#b9b9f9] border border-[#533afd]/30 px-2 py-0.5 rounded-full font-mono">LIVE</span>
        </div>

        <div className="p-5 space-y-5">
          {/* Balance */}
          <div>
            <span className="text-[10px] text-[#61718a] tracking-wider uppercase font-medium">Saldo Disponível</span>
            <h3 className="text-xl font-light text-white tracking-[-0.64px] font-tnum mt-1">R$ 14.250,00</h3>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="bg-[#0d253d]/50 p-2.5 rounded-lg border border-[#273951]/40">
              <span className="text-[9px] text-[#64748d] block uppercase">Receitas</span>
              <span className="text-xs font-light text-[#b9b9f9] font-tnum">R$ 5.800,00</span>
            </div>
            <div className="bg-[#0d253d]/50 p-2.5 rounded-lg border border-[#273951]/40">
              <span className="text-[9px] text-[#64748d] block uppercase">Despesas</span>
              <span className="text-xs font-light text-[#ea2261] font-tnum">R$ 2.450,00</span>
            </div>
          </div>

          {/* Transactions */}
          <div className="space-y-2">
            <span className="text-[10px] text-[#61718a] tracking-wider uppercase font-medium">Transações</span>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs text-white/90">
                <span className="font-light">Salário Google</span>
                <span className="font-tnum text-[#b9b9f9]">+R$ 5.000,00</span>
              </div>
              <div className="flex justify-between items-center text-xs text-white/90">
                <span className="font-light">Supermercado</span>
                <span className="font-tnum text-[#ea2261]">-R$ 650,00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
