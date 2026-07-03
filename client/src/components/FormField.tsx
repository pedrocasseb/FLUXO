import type { InputHTMLAttributes } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
};

export default function FormField({ label, id, className, ...props }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-[#0E1420]/70">
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-xl border border-[#E4E7E2] bg-white px-4 py-3 text-[14px] text-[#0E1420] outline-none transition-all duration-200 placeholder:text-[#0E1420]/30 focus:border-[#4A3AEB] focus:ring-4 focus:ring-[#4A3AEB]/10 ${className ?? ""}`}
        {...props}
      />
    </div>
  );
}
