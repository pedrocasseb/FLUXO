import { useEffect, useState } from "react";
import { formatCurrency } from "../../lib/format";

type CategorySlice = { category: string; amount: number; percentage: number };

// Paleta categórica: cada cor aparece só uma vez por gráfico, mesmo com N itens
// (cicla se passar do fim). Verde e vermelho ficam de fora de propósito — no resto
// do app eles já significam "receita/positivo" e "erro/negativo", então usá-los
// aqui pra uma categoria qualquer confundiria o significado.
const DEFAULT_PALETTE = ["#C2612E", "#4A3AEB", "#1D82A0", "#B8863F", "#9A5CA8", "#A85C7A"];

function colorFor(category: string, index: number, colors?: Record<string, string>) {
  return colors?.[category] ?? DEFAULT_PALETTE[index % DEFAULT_PALETTE.length];
}

function Bar({ percentage, color }: { percentage: number; color: string }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setWidth(percentage));
    return () => cancelAnimationFrame(raf);
  }, [percentage]);

  return (
    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#F5F6F4]">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${Math.min(width, 100)}%`, backgroundColor: color }}
      />
    </div>
  );
}

export default function CategoryBreakdown({
  data,
  colors,
}: {
  data: CategorySlice[];
  colors?: Record<string, string>;
}) {
  if (data.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
        <p className="text-[13px] text-[#0E1420]/40">Nenhuma despesa registrada ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((item, index) => {
        const color = colorFor(item.category, index, colors);
        return (
          <div key={item.category}>
            <div className="flex items-center justify-between text-[13px]">
              <span className="flex items-center gap-1.5 font-medium text-[#0E1420]">
                <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ backgroundColor: color }} />
                {item.category}
              </span>
              <span className="text-[#0E1420]/55">{formatCurrency(item.amount)}</span>
            </div>
            <Bar percentage={item.percentage} color={color} />
          </div>
        );
      })}
    </div>
  );
}
