const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "short" });

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function monthLabel(monthStr: string) {
  const [year, month] = monthStr.split("-").map(Number);
  return monthFormatter.format(new Date(year, month - 1, 1)).replace(".", "");
}
