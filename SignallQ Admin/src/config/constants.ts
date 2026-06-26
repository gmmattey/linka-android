export const APP_NAME = "SignallQ Admin";

export const DEV_ENVIRONMENT_LABEL = "Staging";
export const PROD_ENVIRONMENT_LABEL = "Produção";

// Tokens de cor via CSS custom properties em src/index.css (--sq-*).
// Não usar valores hardcoded — referenciar var(--sq-accent), var(--sq-error), etc.

export const REFRESH_INTERVALS = [
  { label: "Manual", value: 0 },
  { label: "A cada 30s", value: 30000 },
  { label: "A cada 1min", value: 60000 },
  { label: "A cada 5min", value: 300000 },
];

export const PERIOD_FILTERS = [
  { label: "Hoje", value: "today" },
  { label: "Últimos 7 dias", value: "7d" },
  { label: "Últimos 30 dias", value: "30d" },
  { label: "Personalizado", value: "custom" },
];
