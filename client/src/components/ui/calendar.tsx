import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "../../lib/utils";
import { buttonVariants } from "./button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      style={{ fontFamily: "var(--font-body)" }}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-[14px] font-semibold text-[#0E1420]",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 text-[#0E1420]/50 hover:text-[#0E1420]",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "w-9 text-center font-mono text-[10px] uppercase tracking-[0.08em] text-[#0E1420]/40",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-[13px] p-0 relative focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 rounded-full p-0 font-normal text-[#0E1420] aria-selected:opacity-100",
        ),
        day_range_end: "day-range-end",
        day_selected: "bg-[#0E1420] text-white hover:bg-[#0E1420] hover:text-white focus:bg-[#0E1420] focus:text-white",
        day_today: "border border-[#4A3AEB]/50 font-semibold text-[#4A3AEB]",
        day_outside: "text-[#0E1420]/25 aria-selected:bg-[#F5F6F4]/50 aria-selected:text-[#0E1420]/30",
        day_disabled: "text-[#0E1420]/20",
        day_range_middle: "aria-selected:bg-[#F5F6F4] aria-selected:text-[#0E1420]",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />,
        IconRight: () => <ChevronRight className="h-4 w-4" strokeWidth={1.75} />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
