import React from "react";
import { ChartCard } from "../../../components/ui/ChartCard";
import { FeatureComingSoon } from "../../../components/ui/FeatureComingSoon";

// Paridade com o mockup do Luiz (sec-errors): overline "ERROS POR TELA" com
// lista de barras de progresso por tela do app. SystemError não carrega o
// campo tela/screen — só a fonte técnica que originou o erro (worker/
// ai_gateway/analytics_db) — então não há dado real de erros por tela.
// Mantém "Não disponível" em vez de inventar números por tela do app.
export const ErrorByEndpointChart: React.FC = () => {
  return (
    <ChartCard title="Erros por tela" id="error-by-screen-card">
      <FeatureComingSoon
        feature="Erros por tela"
        reason="Métrica ainda não disponível — requer instrumentação de tela nos logs de erro do app"
      />
    </ChartCard>
  );
};
