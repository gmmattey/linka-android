import React from "react";
import { FeatureComingSoon } from "../../components/ui/FeatureComingSoon";
import { AppEnvironment } from "../../types/admin";

interface VersionsTabProps {
  environment: AppEnvironment;
  period: string;
  triggerRefreshCounter: number;
}

export const VersionsTab: React.FC<VersionsTabProps> = () => {
  return (
    <FeatureComingSoon
      feature="App Versions"
      reason="Os dados desta seção são 100% fictícios. A integração real depende de Firebase Crashlytics e Google Play Console, ainda não disponíveis."
    />
  );
};
