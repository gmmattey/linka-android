import React from "react";
import { ChartCard } from "../../../components/ui/ChartCard";
import { FeatureComingSoon } from "../../../components/ui/FeatureComingSoon";

// Paridade com o mockup do Luiz (sec-errors): card full-width "TOP CRASHES",
// tabela agrupada por assinatura de crash (Assinatura · Ocorrências ·
// Dispositivos · Versão · Status). SystemError não agrupa por assinatura de
// crash nem rastreia dispositivos/versão — sem integração real com Firebase
// Crashlytics ainda. Mantém "Não disponível" em vez de inventar agrupamento.
export const TopCrashesCard: React.FC = () => {
  return (
    <ChartCard title="TOP CRASHES" id="top-crashes-card">
      <FeatureComingSoon
        feature="Top crashes por assinatura"
        reason="Requer integração com Firebase Crashlytics — agrupamento por assinatura, dispositivos e versão ainda não disponível"
      />
    </ChartCard>
  );
};
