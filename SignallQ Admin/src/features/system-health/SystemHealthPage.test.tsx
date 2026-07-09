import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SystemHealthPage } from "./SystemHealthPage";

// GH#552 (Fase 3) — smoke test: mocka o service diretamente (ver nota em
// DiagnosticsPage.test.tsx sobre o modo mock global do apiClient em teste).
vi.mock("../../services/systemHealthService", () => ({
  systemHealthService: {
    getSystemHealth: vi.fn().mockResolvedValue({
      data: {
        source: "worker",
        timestamp: new Date().toISOString(),
        checks: {
          worker: { status: "ok" },
          d1: { status: "ok", latencyMs: 38 },
          firebaseCredentials: { status: "ok", latencyMs: 210 },
          bigQuery: { status: "not_configured", message: "Requer credenciais Firebase válidas." },
          ingest: { status: "ok", keyConfigured: true, lastSuccessAt: new Date().toISOString() },
        },
        lastFailure: null,
        lastSuccess: { source: "ingest", timestamp: new Date().toISOString() },
      },
      clientLatencyMs: 120,
    }),
  },
}));

describe("SystemHealthPage", () => {
  it("renderiza os KPIs de performance de infra (paridade mockup)", () => {
    render(
      <SystemHealthPage environment="production" period="7d" triggerRefreshCounter={0} />
    );

    expect(screen.getByText("Uptime do Worker (30d)")).toBeInTheDocument();
    expect(screen.getByText("Latência p95 da API")).toBeInTheDocument();
    expect(screen.getByText("Erros 5xx (7d)")).toBeInTheDocument();
    expect(screen.getByText("Fila de eventos pendentes")).toBeInTheDocument();
  });

  it("carrega a lista de status dos serviços após o fetch", async () => {
    render(
      <SystemHealthPage environment="production" period="7d" triggerRefreshCounter={0} />
    );

    expect(await screen.findByText("Cloudflare Worker (Admin API)")).toBeInTheDocument();
    expect(screen.getByText("D1 Database")).toBeInTheDocument();
    expect(screen.getByText("Firebase Auth")).toBeInTheDocument();
    expect(screen.getByText("Crashlytics Ingest")).toBeInTheDocument();
  });
});
