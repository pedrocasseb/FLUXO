import { useState, type MouseEvent } from "react";
import { formatCurrency, monthLabel } from "../../lib/format";

type Point = { month: string; income: number; expense: number; investment: number };

const WIDTH = 600;
const HEIGHT = 200;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 8;
const TOOLTIP_GAP = 10;

export default function EvolutionChart({ data }: { data: Point[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  if (data.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
        <p className="text-[13px] text-[#0E1420]/40">Sem dados suficientes para o gráfico ainda.</p>
      </div>
    );
  }

  if (data.length === 1) {
    const only = data[0];
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-1.5 text-center">
        <p className="text-[13px] text-[#0E1420]/55">
          Em {monthLabel(only.month)}: {formatCurrency(only.income)} em receitas, {formatCurrency(only.expense)} em
          despesas.
        </p>
        <p className="text-[12px] text-[#0E1420]/35">Mais meses de dados formam o gráfico de evolução.</p>
      </div>
    );
  }

  const allValues = data.flatMap((d) => [d.income, d.expense, d.investment]);
  const maxValue = Math.max(...allValues, 1);

  function scaleY(value: number) {
    const usableHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
    return HEIGHT - PADDING_BOTTOM - (value / maxValue) * usableHeight;
  }

  function scaleX(index: number) {
    return (index / (data.length - 1)) * WIDTH;
  }

  function buildPath(key: "income" | "expense" | "investment") {
    return data.map((d, i) => `${i === 0 ? "M" : "L"}${scaleX(i)},${scaleY(d[key])}`).join(" ");
  }

  function indexFromPointer(event: MouseEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    const index = Math.round(ratio * (data.length - 1));
    return Math.min(data.length - 1, Math.max(0, index));
  }

  const incomePath = buildPath("income");
  const expensePath = buildPath("expense");
  const investmentPath = buildPath("investment");
  const incomeArea = `${incomePath} L${scaleX(data.length - 1)},${HEIGHT} L0,${HEIGHT} Z`;

  const hovered = hoverIndex !== null ? data[hoverIndex] : null;
  const hoverXPixel = hoverIndex !== null ? scaleX(hoverIndex) : null;
  const topPixel = hovered
    ? Math.min(scaleY(hovered.income), scaleY(hovered.expense), scaleY(hovered.investment))
    : null;
  const clampedTop = topPixel !== null ? Math.max(topPixel - tooltipHeight - TOOLTIP_GAP, 0) : null;
  const xPercent = hoverXPixel !== null ? (hoverXPixel / WIDTH) * 100 : null;
  const align = xPercent !== null ? (xPercent < 20 ? "left" : xPercent > 80 ? "right" : "center") : "center";

  return (
    <div>
      <div className="relative">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="none"
          className="h-[200px] w-full cursor-crosshair"
          onMouseMove={(event) => setHoverIndex(indexFromPointer(event))}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="evolution-income-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1C8C6C" stopOpacity="0.14" />
              <stop offset="1" stopColor="#1C8C6C" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={incomeArea} fill="url(#evolution-income-fill)" />
          <path d={expensePath} fill="none" stroke="#9A5B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d={investmentPath}
            fill="none"
            stroke="#2E5CC4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={incomePath}
            fill="none"
            stroke="#1C8C6C"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {hoverIndex !== null && (
            <line
              x1={scaleX(hoverIndex)}
              x2={scaleX(hoverIndex)}
              y1={0}
              y2={HEIGHT}
              stroke="#0E1420"
              strokeOpacity="0.12"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          )}
          {data.map((d, i) => {
            const active = i === hoverIndex;
            return (
              <g key={d.month}>
                {active && (
                  <>
                    <circle cx={scaleX(i)} cy={scaleY(d.income)} r={8} fill="#1C8C6C" fillOpacity="0.18" />
                    <circle cx={scaleX(i)} cy={scaleY(d.expense)} r={8} fill="#9A5B2E" fillOpacity="0.18" />
                    <circle cx={scaleX(i)} cy={scaleY(d.investment)} r={8} fill="#2E5CC4" fillOpacity="0.18" />
                  </>
                )}
                <circle cx={scaleX(i)} cy={scaleY(d.income)} r={active ? 5 : 3.5} fill="#1C8C6C" />
                <circle cx={scaleX(i)} cy={scaleY(d.expense)} r={active ? 5 : 3.5} fill="#9A5B2E" />
                <circle cx={scaleX(i)} cy={scaleY(d.investment)} r={active ? 5 : 3.5} fill="#2E5CC4" />
              </g>
            );
          })}
        </svg>

        {hovered && xPercent !== null && clampedTop !== null && (
          <div
            ref={(el) => {
              if (el && el.offsetHeight !== tooltipHeight) setTooltipHeight(el.offsetHeight);
            }}
            className="pointer-events-none absolute z-10 w-44 rounded-xl border border-[#E4E7E2] bg-white px-3.5 py-2.5 shadow-[0_12px_28px_rgba(14,20,32,0.14)]"
            style={{
              left: `${xPercent}%`,
              top: `${clampedTop}px`,
              transform: `translateX(${align === "left" ? "0%" : align === "right" ? "-100%" : "-50%"})`,
            }}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#0E1420]/40">
              {monthLabel(hovered.month)}
            </p>
            <div className="mt-1.5 flex items-center justify-between gap-3 text-[12px]">
              <span className="flex items-center gap-1.5 text-[#0E1420]/60">
                <span className="h-1.5 w-1.5 rounded-full bg-[#1C8C6C]" />
                Receitas
              </span>
              <span className="font-medium text-[#0E1420]">{formatCurrency(hovered.income)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between gap-3 text-[12px]">
              <span className="flex items-center gap-1.5 text-[#0E1420]/60">
                <span className="h-1.5 w-1.5 rounded-full bg-[#9A5B2E]" />
                Despesas
              </span>
              <span className="font-medium text-[#0E1420]">{formatCurrency(hovered.expense)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between gap-3 text-[12px]">
              <span className="flex items-center gap-1.5 text-[#0E1420]/60">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2E5CC4]" />
                Investimentos
              </span>
              <span className="font-medium text-[#0E1420]">{formatCurrency(hovered.investment)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 flex justify-between font-mono text-[11px] uppercase tracking-[0.06em] text-[#0E1420]/35">
        {data.map((d) => (
          <span key={d.month}>{monthLabel(d.month)}</span>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-5 text-[12px] text-[#0E1420]/55">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#1C8C6C]" />
          Receitas
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#9A5B2E]" />
          Despesas
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#2E5CC4]" />
          Investimentos
        </span>
      </div>
    </div>
  );
}
