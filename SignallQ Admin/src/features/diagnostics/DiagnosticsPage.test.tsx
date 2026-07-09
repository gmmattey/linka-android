import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { DiagnosticsPage } from "./DiagnosticsPage";

// GH#781 (paridade mockup) — smoke test: mocka o service diretamente (em vez de
// depender do modo mock global do apiClient, que é resolvido em tempo de build
// pelo Vite via .env.local e não é sobrescrito de forma confiável em runtime de teste).
vi.mock("../../services/diagnosticsService", () => ({
  diagnosticsService: {
    getDiagnosticSessions: vi.fn().mockResolvedValue([]),
    getDiagnosticsSummary: vi.fn().mockResolvedValue({
      totalTests: 3941,
      criticalIssuesCount: 12,
      attentionIssuesCount: 40,
      averageDownloadMbps: 62,
      averageUploadMbps: 18,
      averageLatencyMs: 34,
      averageScore: 78,
      averageJitterMs: 9,
      averagePacketLossPercentage: 0.8,
      issueDistribution: {},
    }),
  },
}));

describe("DiagnosticsPage", () => {
  it("renderiza sem crash e mostra a identidade da tela", () => {
    render(
      <DiagnosticsPage environment="production" period="7d" triggerRefreshCounter={0} />
    );

    expect(
      screen.getByText("O motor de diagnóstico está funcionando bem?")
    ).toBeInTheDocument();
  });

  it("carrega os KPIs do mockup após o fetch", async () => {
    render(
      <DiagnosticsPage environment="production" period="7d" triggerRefreshCounter={0} />
    );

    expect(await screen.findByText("Diagnósticos executados (7d)")).toBeInTheDocument();
    expect(screen.getByText("Taxa de sucesso")).toBeInTheDocument();
    expect(screen.getByText("Duração média")).toBeInTheDocument();
    expect(screen.getByText("Sessões ativas agora")).toBeInTheDocument();
  });

  it("renderiza o painel de motivos de falha", async () => {
    render(
      <DiagnosticsPage environment="production" period="7d" triggerRefreshCounter={0} />
    );

    expect(await screen.findByText("Motivos de falha")).toBeInTheDocument();
  });
});
