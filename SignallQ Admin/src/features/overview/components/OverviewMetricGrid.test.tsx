import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { OverviewMetricGrid } from "./OverviewMetricGrid";

// Paridade com o mockup do Luiz: os 4 KPIs do Centro de Controle são
// Usuários Ativos, Crash-free Rate, Custo de IA (mês) e Nota na Play Store.
describe("OverviewMetricGrid", () => {
  it("renderiza os 4 KPIs do mockup com dado real quando disponível", () => {
    render(
      <OverviewMetricGrid
        activeUsersToday={18240}
        firebaseCrashlytics={{ source: "bigquery", unresolvedCrashes: 4, affectedUsers: 142, crashFreeUsersPercentage: 98.6 }}
        aiCostMonthLabel="R$ 1.284,90"
        playStoreRating={{ averageRating: 4.6, totalRatings: 2340, starDistribution: { five: 0, four: 0, three: 0, two: 0, one: 0 } }}
      />
    );

    expect(screen.getByText("Usuários Ativos")).toBeInTheDocument();
    expect(screen.getByText("18.240")).toBeInTheDocument();
    expect(screen.getByText("Crash-free Rate")).toBeInTheDocument();
    expect(screen.getByText("98.6%")).toBeInTheDocument();
    expect(screen.getByText("Custo de IA (mês)")).toBeInTheDocument();
    expect(screen.getByText("R$ 1.284,90")).toBeInTheDocument();
    expect(screen.getByText("Nota na Play Store")).toBeInTheDocument();
    expect(screen.getByText("4.6 ★")).toBeInTheDocument();
  });

  it("mostra 'Não disponível' honesto quando a integração real não existe ainda", () => {
    render(
      <OverviewMetricGrid
        activeUsersToday={null}
        firebaseCrashlytics={null}
        aiCostMonthLabel={null}
        playStoreRating={null}
      />
    );

    expect(screen.getAllByText("Não disponível").length).toBeGreaterThanOrEqual(3);
  });

  it("mostra o motivo certo por source de crash-free quando não há dado real", () => {
    const { rerender } = render(
      <OverviewMetricGrid
        activeUsersToday={100}
        firebaseCrashlytics={{ source: "no_credentials", unresolvedCrashes: 0, crashFreeUsersPercentage: 100 }}
        aiCostMonthLabel="R$ 1,00"
        playStoreRating={null}
      />
    );
    expect(screen.getByText("Firebase não configurado no Admin Worker")).toBeInTheDocument();

    rerender(
      <OverviewMetricGrid
        activeUsersToday={100}
        firebaseCrashlytics={{ source: "no_data_yet", unresolvedCrashes: 0, crashFreeUsersPercentage: 100 }}
        aiCostMonthLabel="R$ 1,00"
        playStoreRating={null}
      />
    );
    expect(screen.getByText("BigQuery export ainda sem volume de crash")).toBeInTheDocument();
  });
});
