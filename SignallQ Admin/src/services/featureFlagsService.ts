import { apiClient } from "./apiClient";

export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description: string;
  updatedAt: number;
  updatedBy: string;
}

export const featureFlagsService = {
  async getFlags(): Promise<FeatureFlag[]> {
    if (!apiClient.isMockEnabled()) {
      if (!import.meta.env.VITE_ADMIN_API_BASE_URL) return [];
      try {
        const raw = await apiClient.request<{ flags: any[] }>("GET", "/admin/feature-flags");
        return raw.flags.map((f) => ({
          key:         f.key,
          enabled:     Boolean(f.enabled),
          description: f.description ?? "",
          updatedAt:   f.updatedAt   ?? 0,
          updatedBy:   f.updatedBy   ?? "",
        }));
      } catch {
        return [];
      }
    }
    // mock: distribuição realista — uma flag desativada reflete uso real de rollout controlado
    return [
      { key: "feature_speedtest",      enabled: true,  description: "Tela de Teste de Velocidade", updatedAt: Date.now() / 1000, updatedBy: "system" },
      { key: "feature_wifi",           enabled: true,  description: "Tela de Análise de WiFi",     updatedAt: Date.now() / 1000, updatedBy: "system" },
      { key: "feature_fibra",          enabled: true,  description: "Tela de Diagnóstico Fibra",   updatedAt: Date.now() / 1000, updatedBy: "system" },
      { key: "feature_diagnostico_ia", enabled: false, description: "Overlay Diagnóstico IA",      updatedAt: Date.now() / 1000, updatedBy: "admin@signallq.app" },
      { key: "feature_devices",        enabled: true,  description: "Overlay Dispositivos Rede",   updatedAt: Date.now() / 1000, updatedBy: "system" },
      { key: "feature_dns",            enabled: true,  description: "Análise DNS",                 updatedAt: Date.now() / 1000, updatedBy: "system" },
    ];
  },

  async updateFlag(key: string, enabled: boolean): Promise<boolean> {
    if (!apiClient.isMockEnabled()) {
      if (!import.meta.env.VITE_ADMIN_API_BASE_URL) return false;
      try {
        await apiClient.request("PUT", `/admin/feature-flags/${key}`, { enabled });
        return true;
      } catch {
        return false;
      }
    }
    return true; // mock: sempre sucesso
  },
};
