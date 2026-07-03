import { TrendingDown, TrendingUp } from "lucide-react";
import { formatCurrency } from "../../lib/format";

export default function StatCard({
  label,
  value,
  percentage,
  isGood,
  accentColor,
}: {
  label: string;
  value: number;
  percentage: number;
  isGood: boolean;
  accentColor: string;
}) {
  const hasChange = percentage !== 0;
  const TrendIcon = percentage >= 0 ? TrendingUp : TrendingDown;

  return (
    <div className="rounded-2xl border border-[#E4E7E2] bg-white p-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#0E1420]/40">{label}</p>
      <p
        className="mt-2 text-[1.6rem] font-semibold tracking-[-0.02em]"
        style={{ fontFamily: "var(--font-display)", color: accentColor }}
      >
        {formatCurrency(value)}
      </p>
      {hasChange ? (
        <p
          className={`mt-2 flex items-center gap-1 text-[12px] font-medium ${
            isGood ? "text-[#1C8C6C]" : "text-[#A5402F]"
          }`}
        >
          <TrendIcon className="h-3.5 w-3.5" strokeWidth={2} />
          {Math.abs(percentage).toFixed(1)}% vs mês passado
        </p>
      ) : (
        <p className="mt-2 text-[12px] text-[#0E1420]/35">Sem variação vs mês passado</p>
      )}
    </div>
  );
}
