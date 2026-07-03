import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";

export default function DateField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = value ? new Date(`${value}T00:00:00`) : undefined;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-[#0E1420]/70">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            id={id}
            type="button"
            className="flex w-full items-center justify-between rounded-xl border border-[#E4E7E2] bg-white px-4 py-3 text-left text-[14px] outline-none transition-all duration-200 focus:border-[#4A3AEB] focus:ring-4 focus:ring-[#4A3AEB]/10"
          >
            <span className={selected ? "text-[#0E1420]" : "text-[#0E1420]/30"}>
              {selected ? format(selected, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione uma data"}
            </span>
            <CalendarIcon className="h-4 w-4 flex-shrink-0 text-[#0E1420]/35" strokeWidth={1.75} />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start">
          <Calendar
            mode="single"
            selected={selected}
            defaultMonth={selected}
            locale={ptBR}
            onSelect={(date) => {
              if (!date) return;
              onChange(format(date, "yyyy-MM-dd"));
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
