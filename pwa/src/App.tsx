import { Activity, BrainCircuit, Cloud, Gauge, RadioTower, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { MetricCard } from '@/components/MetricCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { RecommendationBlock } from '@/components/RecommendationBlock';
import { StatusBadge } from '@/components/StatusBadge';
import { useConnectionSnapshot } from '@/hooks/useConnectionSnapshot';
import { requestDiagnosisWithFallback, runSpeedtestProbe, sendAdminDiagnostic } from '@/services/api';
import { DiagnosisResult, DiagnosticPayload, SpeedtestPhase, SpeedtestResult } from '@/types/network';

function formatMetric(value: number | null): string {
  return value == null ? 'N/A' : value.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
}

function buildDiagnosticPayload(speedtest: SpeedtestResult | null, connectionType: string): DiagnosticPayload {
  return {
    schemaVersion: 'pwa_foundation_v1',
    source: 'pwa',
    connectionType,
    metricasAtuais: {
      downloadMbps: speedtest?.downloadMbps ?? null,
      uploadMbps: speedtest?.uploadMbps ?? null,
      latenciaMs: speedtest?.latencyMs ?? null,
    },
  };
}

export function App() {
  const connection = useConnectionSnapshot();
  const [phase, setPhase] = useState<SpeedtestPhase>(SpeedtestPhase.Idle);
  const [speedtest, setSpeedtest] = useState<SpeedtestResult | null>(null);
  const [aiStatus, setAiStatus] = useState('Aguardando diagnóstico');
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [adminStatus, setAdminStatus] = useState('Proxy pronto');

  const connectionLabel = connection.effectiveType ?? (connection.status === 'online' ? 'online' : 'offline');

  const runProbe = async () => {
    setPhase(SpeedtestPhase.Latency);
    setAiStatus('Aguardando diagnóstico');
    setDiagnosis(null);
    const result = await runSpeedtestProbe();
    if (!result.ok || !result.data) {
      setPhase(SpeedtestPhase.Error);
      setAiStatus(result.error ?? 'Falha no speedtest');
      return;
    }

    setSpeedtest(result.data);
    setPhase(SpeedtestPhase.Complete);
  };

  const diagnose = async () => {
    const payload = buildDiagnosticPayload(speedtest, connectionLabel);
    setAiStatus('Chamando proxy de IA com fallback local...');
    const result = await requestDiagnosisWithFallback(payload, speedtest);
    if (result.data) {
      setDiagnosis(result.data);
      setAiStatus(
        result.data.source === 'fallback'
          ? `Fallback local gerado: ${result.error ?? 'IA indisponível'}`
          : 'Proxy de IA respondeu com sucesso',
      );
      return;
    }

    setAiStatus(`Diagnóstico indisponível: ${result.error}`);
  };

  const ingest = async () => {
    const id = `pwa_${Date.now().toString(36)}`;
    setAdminStatus('Enviando via proxy server-side...');
    const result = await sendAdminDiagnostic({
      id,
      created_at: Math.floor(Date.now() / 1000),
      network_type: connectionLabel,
      status: speedtest ? 'completed' : 'unknown',
      score: null,
      download_mbps: speedtest?.downloadMbps ?? null,
      upload_mbps: speedtest?.uploadMbps ?? null,
      latency_ms: speedtest?.latencyMs ?? null,
      jitter_ms: speedtest?.jitterMs ?? null,
      packet_loss: null,
      issues: [],
      environment: 'preview',
      dist_channel: 'pwa',
      build_type: 'web',
      version_code: 1,
      device_id: 'pwa-anonymous',
    });
    setAdminStatus(result.ok ? 'Ingest Admin aceito pelo proxy' : `Ingest indisponível: ${result.error}`);
  };

  return (
    <main className="app-shell">
      <header className="top-bar">
        <img src="/icon-192.png" alt="" className="brand-mark" />
        <div>
          <p className="overline">SignallQ PWA</p>
          <h1>Diagnóstico web em construção</h1>
        </div>
      </header>

      <section className="status-band" aria-label="Status da fundação">
        <div>
          <StatusBadge tone={connection.status === 'online' ? 'success' : 'warning'}>
            {connection.status === 'online' ? 'Online agora' : 'Sem conexão'}
          </StatusBadge>
          <h2>Base segura para medir sem inventar sinal</h2>
          <p>
            O app usa apenas recursos disponíveis no navegador. Testes, IA e ingest Admin dependem de rede e passam
            por rotas <strong>/api</strong> no servidor para manter segredos fora do bundle.
          </p>
        </div>
        <div className="architecture-list">
          <span><ShieldCheck size={18} /> INGEST_KEY server-side</span>
          <span><Cloud size={18} /> Pages Functions</span>
          <span><RadioTower size={18} /> Speedtest sem cache</span>
        </div>
      </section>

      <section className="metric-grid" aria-label="Métricas atuais">
        <MetricCard icon={<Activity size={24} />} label="Conexão" value={connectionLabel} tone="success" helperText="Informação do navegador." />
        <MetricCard icon={<Gauge size={24} />} label="Latência HTTP" value={formatMetric(speedtest?.latencyMs ?? null)} unit="ms" helperText="Não é ping ICMP." />
        <MetricCard icon={<Activity size={24} />} label="Jitter HTTP" value={formatMetric(speedtest?.jitterMs ?? null)} unit="ms" tone="warning" helperText="Calculado por amostras HTTP." />
        <MetricCard icon={<RadioTower size={24} />} label="Download" value={formatMetric(speedtest?.downloadMbps ?? null)} unit="Mbps" tone="accent" helperText="Amostra HTTP." />
        <MetricCard icon={<RadioTower size={24} />} label="Upload" value={formatMetric(speedtest?.uploadMbps ?? null)} unit="Mbps" tone="warning" helperText="Depende do endpoint." />
      </section>

      <section className="control-panel" aria-label="Validações iniciais">
        <div>
          <p className="overline">Validação M0</p>
          <h2>Instalável onde o navegador permitir</h2>
          <p>
            O shell pode abrir offline depois de carregado, mas medições, diagnóstico IA e envio ao Admin exigem
            internet. Quando uma métrica não estiver disponível, ela aparece como não medida.
          </p>
        </div>
        <div className="actions">
          <PrimaryButton icon={<Gauge size={18} />} onClick={runProbe}>
            Medir amostra
          </PrimaryButton>
          <PrimaryButton icon={<BrainCircuit size={18} />} onClick={diagnose} variant="secondary">
            Validar IA
          </PrimaryButton>
          <PrimaryButton icon={<ShieldCheck size={18} />} onClick={ingest} variant="neutral">
            Validar Admin
          </PrimaryButton>
        </div>
        <div className="result-log" aria-live="polite">
          <p><strong>Speedtest:</strong> {phase}</p>
          <p><strong>IA:</strong> {aiStatus}</p>
          {diagnosis ? (
            <p><strong>Diagnóstico:</strong> {diagnosis.summary}</p>
          ) : null}
          <p><strong>Admin:</strong> {adminStatus}</p>
          {!connection.browserSupportsNetworkInfo ? (
            <p>Tipo de conexão detalhado indisponível neste navegador. O PWA não vai inventar sinal, RSSI ou rede Wi-Fi.</p>
          ) : null}
        </div>
        <RecommendationBlock
          priority="Limite do navegador"
          title="Offline parcial, sem promessa de teste offline"
          body="O service worker guarda apenas o shell e assets estáticos. Rotas de SpeedTest, IA e Admin nunca são cacheadas como resultado verdadeiro."
        />
      </section>
    </main>
  );
}
