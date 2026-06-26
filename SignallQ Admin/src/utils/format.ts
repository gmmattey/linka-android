export function formatCurrency(value: number, decimals = 2): string {
  if (value === 0) return "$0.00";
  if (value < 0.01) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

export function formatPercent(value: number, decimals = 1): string {
  const rounded = parseFloat(value.toFixed(decimals));
  return `${rounded}%`;
}
