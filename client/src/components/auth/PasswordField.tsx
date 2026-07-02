import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

type PasswordFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
};

export default function PasswordField({ label, id, ...props }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-[#0E1420]/70">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          className="w-full rounded-xl border border-[#E4E7E2] bg-white px-4 py-3 pr-11 text-[14px] text-[#0E1420] outline-none transition-all duration-200 placeholder:text-[#0E1420]/30 focus:border-[#4A3AEB] focus:ring-4 focus:ring-[#4A3AEB]/10"
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0E1420]/35 transition-colors duration-200 hover:text-[#0E1420]/70"
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        >
          {visible ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
        </button>
      </div>
    </div>
  );
}
