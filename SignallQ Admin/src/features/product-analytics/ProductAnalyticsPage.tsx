import React from "react";
import { FeatureComingSoon } from "../../components/ui/FeatureComingSoon";
import { AppEnvironment } from "../../types/admin";

interface ProductAnalyticsPageProps {
  environment: AppEnvironment;
  period: string;
  triggerRefreshCounter: number;
}

export const ProductAnalyticsPage: React.FC<ProductAnalyticsPageProps> = () => {
  return (
    <FeatureComingSoon
      feature="Product Analytics"
      reason="Os dados desta seção são 100% fictícios. A integração real depende de Firebase Analytics e Google Play Console, ainda não disponíveis."
    />
  );
};
