import React from "react";
import { ChartCard } from "../../../components/ui/ChartCard";
import { DonutChart } from "../../../components/charts/DonutChart";
import { FeatureComingSoon } from "../../../components/ui/FeatureComingSoon";

interface NetworkTypeDistributionProps {
  networkData: any[];
}

export const NetworkTypeDistribution: React.FC<NetworkTypeDistributionProps> = ({ networkData }) => {
  return (
    <ChartCard
      title="Distribuição por Tipo de Rede"
      description="Percentual de meios físicos de conexão escaneados e identificados na telemetria de conectividade."
      id="network-type-distribution-card"
    >
      {networkData.length === 0 ? (
        <FeatureComingSoon feature="Distribuição de Rede" />
      ) : (
        <DonutChart data={networkData} height={180} />
      )}
    </ChartCard>
  );
};
