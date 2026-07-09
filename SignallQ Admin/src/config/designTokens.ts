/**
 * Valores resolvidos dos CSS tokens --sq-*.
 * Usados em contextos que não aceitam CSS vars diretamente (ex: SVG stroke no Recharts).
 * Mantido em sincronia com src/index.css — qualquer mudança de valor deve atualizar ambos.
 */
export const SQ_TOKENS = {
  // Semântica (invariante entre temas)
  accent:              "#6C2BFF",
  accentBlue:          "#2563EB",
  success:             "#22C55E",
  warning:             "#F5A623",
  error:               "#FF4D4F",
  info:                "#38BDF8",

  // Fases de SpeedTest
  phaseLatency:        "#60A5FA",
  phaseDownload:       "#34D399",
  phaseUpload:         "#FBBF24",

  // Provedores de IA
  providerCloudflare:  "#7C3AED",
  providerOpenAI:      "#2563EB",
  providerAnthropic:   "#E040FB",
  providerLocal:       "#71717A",

  // Texto (valores do tema dark — usado apenas em contextos SVG/Recharts)
  textSecondary:       "#9CA3AF",
  textTertiary:        "#6B7280",

  // Paleta de tipo de rede (donut chart) — cores semânticas fixas por categoria,
  // não por posição/percentual (evita cor quase invisível na fatia majoritária)
  networkWifi:         "#6C2BFF",
  networkMobile:       "#38BDF8",
  networkFiber:        "#22C55E",
  networkEthernet:     "#F5A623",
  networkUnknown:      "#71717A",

  // Paleta de provedores de IA (chart)
  aiGemini:            "#6C2BFF",
  aiQwen:              "#38BDF8",
  aiFallback:          "#6B7280",
  aiOpenAI:            "#22C55E",
  aiAnthropic:         "#F5A623",
} as const;
