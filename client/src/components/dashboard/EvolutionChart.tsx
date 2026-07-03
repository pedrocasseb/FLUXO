import { formatCurrency, monthLabel } from "../../lib/format";

type Point = { month: string; income: number; expense: number };

const WIDTH = 600;
const HEIGHT = 200;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 8;

export default function EvolutionChart({ data }: { data: Point[] }) {
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

  const allValues = data.flatMap((d) => [d.income, d.expense]);
  const maxValue = Math.max(...allValues, 1);

  function scaleY(value: number) {
    const usableHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;
    return HEIGHT - PADDING_BOTTOM - (value / maxValue) * usableHeight;
  }

  function scaleX(index: number) {
    return (index / (data.length - 1)) * WIDTH;
  }

  function buildPath(key: "income" | "expense") {
    return data.map((d, i) => `${i === 0 ? "M" : "L"}${scaleX(i)},${scaleY(d[key])}`).join(" ");
  }

  const incomePath = buildPath("income");
  const expensePath = buildPath("expense");
  const incomeArea = `${incomePath} L${scaleX(data.length - 1)},${HEIGHT} L0,${HEIGHT} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" className="h-[200px] w-full">
        <defs>
          <linearGradient id="evolution-income-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1C8C6C" stopOpacity="0.14" />
            <stop offset="1" stopColor="#1C8C6C" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={incomeArea} fill="url(#evolution-income-fill)" />
        <path d={expensePath} fill="none" stroke="#9A5B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d={incomePath}
          fill="none"
          stroke="#1C8C6C"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((d, i) => (
          <g key={d.month}>
            <circle cx={scaleX(i)} cy={scaleY(d.income)} r="3.5" fill="#1C8C6C" />
            <circle cx={scaleX(i)} cy={scaleY(d.expense)} r="3.5" fill="#9A5B2E" />
          </g>
        ))}
      </svg>
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
      </div>
    </div>
  );
}
