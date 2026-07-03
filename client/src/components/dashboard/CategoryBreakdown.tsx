import { useEffect, useState } from "react";
import { formatCurrency } from "../../lib/format";

type CategorySlice = { category: string; amount: number; percentage: number };

function Bar({ percentage }: { percentage: number }) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setWidth(percentage));
    return () => cancelAnimationFrame(raf);
  }, [percentage]);

  return (
    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#F5F6F4]">
      <div
        className="h-full rounded-full bg-[#9A5B2E] transition-all duration-700"
        style={{ width: `${Math.min(width, 100)}%` }}
      />
    </div>
  );
}

export default function CategoryBreakdown({ data }: { data: CategorySlice[] }) {
  if (data.length === 0) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
        <p className="text-[13px] text-[#0E1420]/40">Nenhuma despesa registrada ainda.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.category}>
          <div className="flex items-center justify-between text-[13px]">
            <span className="font-medium text-[#0E1420]">{item.category}</span>
            <span className="text-[#0E1420]/55">{formatCurrency(item.amount)}</span>
          </div>
          <Bar percentage={item.percentage} />
        </div>
      ))}
    </div>
  );
}
