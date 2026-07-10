import React from "react";
import { adminMetricsService } from "../../services/adminMetricsService";
import { aiUsageService } from "../../services/aiUsageService";
import { integrationsService } from "../../integrations/integrationsService";
import { FirebaseAnalyticsSummary, FirebaseCrashlyticsSummary } from "../../integrations/firebase/firebase.types";
import { GooglePlayRatingSummary } from "../../integrations/google-play/googlePlay.types";
import { OverviewMetricGrid } from "./components/OverviewMetricGrid";
import { DiagnosticsTimeline } from "./components/DiagnosticsTimeline";
import { ScreenSessionsDonut } from "./components/ScreenSessionsDonut";
import { RecentAlertsPanel } from "./components/RecentAlertsPanel";
import { LoadingState } from "../../components/ui/LoadingState";
import { AppEnvironment } from "../../types/admin";
import { OverviewMetricsResponse } from "../../mocks/overview.mock";
import { productAnalyticsService } from "../../services/productAnalyticsService";
import { ScreenNavigationMetric } from "../../types/productAnalytics";
import { SectionIntro } from "../../components/ui/SectionIntro";

interface OverviewPageProps {
  environment: AppEnvironment;
  period: string;
  onPeriodChange: (p: string) => void;
  onNavigate: (path: string) => void;
  triggerRefreshCounter: number;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  environment,
  period,
  triggerRefreshCounter,
}) => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  // Dash states
  const [metrics, setMetrics] = React.useState<OverviewMetricsResponse | null>(null);
  const [timelineData, setTimelineData] = React.useState<any[]>([]);
  const [screenNavigation, setScreenNavigation] = React.useState<ScreenNavigationMetric[]>([]);
  const [alerts, setAlerts] = React.useState<any[]>([]);

  // Paridade com o mockup: os 4 KPIs do Centro de Controle são Usuários Ativos,
  // Crash-free rate, Custo de IA (mês) e Nota na Play Store — não os que estavam
  // aqui antes (Diagnósticos/Score de Rede/Taxa de Sucesso/Custo IA hoje, GH#746).
  // Nota da Play Store hoje não tem dado real disponível (integração ainda
  // mock-only) — "Não disponível" é o estado honesto, não bug. Crash-free rate
  // agora vem do worker (BigQuery/Crashlytics); "Não disponível" só aparece
  // quando o source não é "bigquery".
  const [firebaseAnalytics, setFirebaseAnalytics] = React.useState<FirebaseAnalyticsSummary | null>(null);
  const [firebaseCrashlytics, setFirebaseCrashlytics] = React.useState<FirebaseCrashlyticsSummary | null>(null);
  const [aiCostMonthLabel, setAiCostMonthLabel] = React.useState<string | null>(null);
  const [playStoreRating, setPlayStoreRating] = React.useState<GooglePlayRatingSummary | null>(null);

  React.useEffect(() => {
    let active = true;

    async function loadDashboardData() {
      setLoading(true);
      setError(null);
      try {
        const filters = { environment, period };

        // Parallelized loading
        const [
          metricsRes,
          timelineRes,
          screenNavRes,
          alertsRes,
        ] = await Promise.all([
          adminMetricsService.getOverviewMetrics(filters),
          adminMetricsService.getDiagnosticsTimeline(filters),
          productAnalyticsService.getScreenNavigation({ period: period as any, environment }),
          adminMetricsService.getRecentAlerts(filters),
        ]);

        if (active) {
          setMetrics(metricsRes);
          setTimelineData(timelineRes);
          setScreenNavigation(screenNavRes);
          setAlerts(alertsRes);
        }

        // KPIs do mockup — resilientes individualmente (.catch(() => null)): a
        // ausência de um não pode derrubar a tela inteira, e cada um já é
        // honestamente nullable quando a integração real não existe ainda.
        const [fbAnalyticsRes, fbCrashlyticsRes, aiCostMonthRes, gpRatingRes] = await Promise.all([
          integrationsService.getFirebaseAnalytics(filters).catch(() => null),
          integrationsService.getFirebaseCrashlytics(filters).catch(() => null),
          aiUsageService.getAiCostSummary({ ...filters, period: "30d" }).catch(() => null),
          integrationsService.getGooglePlayRatings(filters).catch(() => null),
        ]);

        if (active) {
          setFirebaseAnalytics(fbAnalyticsRes);
          setFirebaseCrashlytics(fbCrashlyticsRes);
          setAiCostMonthLabel(aiCostMonthRes?.totalCostUsd ?? null);
          setPlayStoreRating(gpRatingRes);
        }
      } catch (err: any) {
        console.error("Failed to load overview telemetry dashboard:", err);
        if (active) {
          const code = err?.code;
          if (code === 401) {
            setError("Erro de autenticação — verifique a configuração do token");
          } else {
            setError(code > 0 ? `Erro HTTP ${code} — worker indisponível` : "Sem conexão com o worker");
          }
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      active = false;
    };
  }, [environment, period, triggerRefreshCounter, retryCount]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingState message="Acompanhando uso, diagnósticos, qualidade da rede e custo de IA..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-6 border border-[var(--error)]/20 bg-[var(--error)]/5 rounded-[var(--radius-card)]">
        <h4 className="text-sm font-semibold text-[var(--error)] uppercase tracking-wider font-sans">Erro de Telemetria</h4>
        <p className="text-xs text-[var(--text-secondary)] mt-2 font-sans">{error}</p>
        <button
          onClick={() => { setError(null); setRetryCount(c => c + 1); }}
          className="mt-4 px-4 py-2 text-xs bg-[var(--error)]/10 border border-[var(--error)]/20 text-[var(--error)] hover:bg-[var(--error)]/20 transition-all rounded-xl font-sans"
        >
          TENTAR NOVAMENTE
        </button>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-center p-6 border border-[var(--border)] bg-[var(--bg-sidebar)] rounded-[var(--radius-card)]">
        <h4 className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-widest font-sans">Nenhum Registro Encontrado</h4>
        <p className="text-xs text-[var(--text-secondary)] mt-2 font-sans">Nossos Workers não catalogaram dados de diagnósticos neste período.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 0. Identidade da tela — paridade com mockup do Luiz (signallq-admin-mockup.dc.html) */}
      <SectionIntro
        id="overview-section-intro"
        hero={{
          iconSrc: `${import.meta.env.BASE_URL}icon-192.png`,
          title: "SignallQ — Diagnóstico de Rede",
          subtitle: `io.signallq.app · Conta técnica · Última atualização: ${new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}`,
        }}
        overline="CENTRO DE CONTROLE"
        question="O SignallQ está saudável agora?"
        description="Visão consolidada de uso, estabilidade, custo de IA e performance do app — para decidir onde agir sem cruzar painéis manualmente."
        source="FONTES · FIREBASE ANALYTICS · PLAY CONSOLE · CLOUDFLARE WORKERS · CRASHLYTICS"
      />

      {/* Período já é controlado globalmente pelo Topbar (pills PROD/STG + período) —
          duplicar o mesmo filtro aqui era um GlobalFilters redundante herdado do
          SIG-294 Fase 1, antes do Topbar assumir esse controle. Removido. */}

      {/* 2. KPIs — grid de cards principais, cada um com veredito/tendência */}
      <OverviewMetricGrid
        activeUsersToday={firebaseAnalytics?.activeUsersToday ?? null}
        firebaseCrashlytics={firebaseCrashlytics}
        aiCostMonthLabel={aiCostMonthLabel}
        playStoreRating={playStoreRating}
      />

      {/* 3. Gráfico principal — sessões x diagnósticos, com a composição de
          sessões por tela ao lado (paridade mockup). */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DiagnosticsTimeline timelineData={timelineData} />
        </div>
        <div>
          <ScreenSessionsDonut screens={screenNavigation} />
        </div>
      </div>

      {/* 4. Alertas recentes — card full-width, último item da composição fixa
          do mockup para sec-overview (hero > KPIs > gráfico+donut > alertas). */}
      <RecentAlertsPanel alerts={alerts} />
    </div>
  );
};
