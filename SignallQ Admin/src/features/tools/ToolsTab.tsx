import React from "react";
import { ToolsPage } from "./ToolsPage";
import { AppEnvironment } from "../../types/admin";

interface ToolsTabProps {
  environment: AppEnvironment;
  period: string;
  triggerRefreshCounter: number;
}

export const ToolsTab: React.FC<ToolsTabProps> = ({ environment, period, triggerRefreshCounter }) => {
  return <ToolsPage environment={environment} period={period} triggerRefreshCounter={triggerRefreshCounter} />;
};
