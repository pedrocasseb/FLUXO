import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  id: string;
};

export default function SelectField({ label, id, className, children, ...props }: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-[#0E1420]/70">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className={`w-full appearance-none rounded-xl border border-[#E4E7E2] bg-white px-4 py-3 pr-10 text-[14px] text-[#0E1420] outline-none transition-all duration-200 focus:border-[#4A3AEB] focus:ring-4 focus:ring-[#4A3AEB]/10 ${className ?? ""}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0E1420]/35"
          strokeWidth={1.75}
        />
      </div>
    </div>
  );
}
