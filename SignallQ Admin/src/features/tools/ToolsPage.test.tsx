import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolsPage } from "./ToolsPage";

// Smoke test — mocka todos os services consumidos pelas 6 subseções restauradas
// (mesmo padrão de mock direto usado em DiagnosticsPage.test.tsx/AiCostPage.test.tsx),
// garantindo que a poda de paridade não deixou nenhum drill-down órfão sem tela.
vi.mock("../../services/diagnosticsService", () => ({
  diagnosticsService: {
    getDiagnosticSessions: vi.fn().mockResolvedValue([]),
    getDiagnosticsSummary: vi.fn().mockResolvedValue(null),
    getAggregateDiagnostics: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock("../../services/errorMetricsService", () => ({
  errorMetricsService: {
    getSystemErrors: vi.fn().mockResolvedValue([
      {
        id: "err_1",
        timestamp: "2026-07-08T10:00:00Z",
        source: "worker",
        category: "backend",
        message: "Falha simulada de teste",
        stackTrace: "at foo()",
        count: 3,
        environment: "production",
        resolved: false,
        affectedUserCount: 2,
      },
    ]),
    resolveError: vi.fn().mockResolvedValue({ success: true, message: "Resolvido" }),
    getAiAlerts: vi.fn().mockResolvedValue({ alerts: [], aiCostCeiling: 200 }),
  },
}));

vi.mock("../../services/aiUsageService", () => ({
  aiUsageService: {
    getAiUsageMetrics: vi.fn().mockResolvedValue([
      { provider: "gemini_flash", displayName: "Gemini", totalCalls: 10, totalTokens: 1000, averageLatencyMs: 0, estimatedCostUsd: 1.2, reliabilityPercentage: 99 },
    ]),
    getAiUsageTimeSeries: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock("../../services/productAnalyticsService", () => ({
  productAnalyticsService: {
    getFeatureUsage: vi.fn().mockResolvedValue([]),
    getScreenNavigation: vi.fn().mockResolvedValue([]),
    getFeatureCrashes: vi.fn().mockResolvedValue([]),
    getRetention: vi.fn().mockResolvedValue([]),
    getSessionDuration: vi.fn().mockResolvedValue(null),
  },
}));

vi.mock("../../services/systemHealthService", () => ({
  systemHealthService: {
    getSystemHealth: vi.fn().mockResolvedValue({
      data: {
        source: "test",
        timestamp: "2026-07-08T10:00:00Z",
        checks: {
          worker: { status: "ok" },
          d1: { status: "ok", latencyMs: 12 },
          firebaseCredentials: { status: "ok" },
          bigQuery: { status: "ok" },
          ingest: { status: "ok", keyConfigured: true, lastSuccessAt: null },
        },
        lastFailure: null,
        lastSuccess: null,
      },
      clientLatencyMs: 12,
    }),
  },
}));

vi.mock("../../services/adminSettingsService", async () => {
  const actual = await vi.importActual("../../services/adminSettingsService");
  return {
    ...actual,
    adminSettingsService: {
      getSettings: vi.fn().mockResolvedValue({
        aiDailyBudgetUsd: 1,
        errorSpikeThreshold: 10,
        criticalScoreThreshold: 50,
      }),
      saveSettings: vi.fn().mockResolvedValue({ success: true, message: "Configurações salvas." }),
    },
  };
});

vi.mock("../../integrations/integrationsService", () => ({
  integrationsService: {
    getAllStatus: vi.fn().mockResolvedValue({
      firebase: { status: "connected", enabled: true, message: "OK" },
      googlePlay: { status: "connected", enabled: true, message: "OK" },
      appStore: { status: "planned", enabled: false, message: "Planejado" },
    }),
  },
}));

describe("ToolsPage", () => {
  it("renderiza a identidade da tela e todas as subseções restauradas", async () => {
    render(<ToolsPage environment="production" period="7d" triggerRefreshCounter={0} />);

    expect(screen.getByText("O que mais dá pra investigar e configurar?")).toBeInTheDocument();

    expect(await screen.findByText("Diagnósticos — sessões individuais")).toBeInTheDocument();
    expect(screen.getByText("Erros — lista detalhada")).toBeInTheDocument();
    expect(screen.getByText("IA & Custos — detalhamento")).toBeInTheDocument();
    expect(screen.getByText("Uso do App — detalhamento")).toBeInTheDocument();
    expect(screen.getByText(/Saúde do Sistema — detalhamento/)).toBeInTheDocument();
    expect(screen.getByText("Configurações — integrações e limites")).toBeInTheDocument();
  });

  it("carrega e mostra o erro detalhado da seção de erros", async () => {
    render(<ToolsPage environment="production" period="7d" triggerRefreshCounter={0} />);

    expect((await screen.findAllByText("Falha simulada de teste")).length).toBeGreaterThan(0);
  });

  it("carrega a tabela de custo por provedor de IA", async () => {
    render(<ToolsPage environment="production" period="7d" triggerRefreshCounter={0} />);

    expect(await screen.findByText("Custo e métricas por provedor")).toBeInTheDocument();
  });

  it("carrega o status do D1 na seção de saúde do sistema", async () => {
    render(<ToolsPage environment="production" period="7d" triggerRefreshCounter={0} />);

    expect(await screen.findByText("Conectado")).toBeInTheDocument();
  });
});
