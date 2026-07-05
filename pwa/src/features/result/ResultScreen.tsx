import type { DiagnosisResult, SpeedTestResult } from '@shared/contracts';
import { Icon, LimitationsCard, RecommendationList } from '@/design-system';
import type { RecommendationListItem } from '@/design-system';
import { metricVerdict, statusTitle, verdictFromQuality } from '@/shared/verdict';
import { classifyUsageVerdicts, type UsageVerdict } from '@shared/usageVerdicts';

interface ResultScreenProps {
  diagnosis: DiagnosisResult | null;
  onCopyLink: () => void;
  onGoHome: () => void;
  onRetry: () => void;
  result: SpeedTestResult;
}

const VERDICT_LABEL: Record<UsageVerdict, string> = { good: 'Ótimo', acceptable: 'Bom', poor: 'Fraco' };
const VERDICT_COLOR: Record<UsageVerdict, string> = { good: 'var(--success)', acceptable: 'var(--success)', poor: 'var(--error)' };

export function ResultScreen({ diagnosis, onCopyLink, onGoHome, onRetry, result }: ResultScreenProps) {
  const ping = metricVerdict(result.latency.ms, 80, 150, true);
  const jitter = metricVerdict(result.jitter.ms, 20, 40, true);
  const download = metricVerdict(result.download.mbps, 10, 3, false);
  const upload = metricVerdict(result.upload.mbps, 5, 1, false);
  const loss = metricVerdict(result.availability.perceivedLossPercent, 1, 3, true);

  const usage =
    result.download.mbps != null && result.upload.mbps != null && result.latency.ms != null && result.jitter.ms != null
      ? classifyUsageVerdicts({
          downloadMbps: result.download.mbps,
          uploadMbps: result.upload.mbps,
          latencyMs: result.latency.ms,
          jitterMs: result.jitter.ms,
          packetLossPercent: result.availability.perceivedLossPercent ?? 0,
        })
      : null;

  const recommendations: RecommendationListItem[] =
    diagnosis?.actions.slice(0, 3).map((action) => ({
      description: action.description,
      icon:
        action.category === 'router'
          ? 'restart_alt'
          : action.category === 'wifi'
            ? 'wifi'
            : action.category === 'device'
              ? 'cable'
              : 'schedule',
      iconColor: diagnosis.quality === 'good' ? 'success' : 'accent',
      title: action.title,
    })) ?? [];

  return (
    <div className="sq-velocidade-screen">
      <div className="sq-result-screen">
        <div className="sq-result-screen__status">
          <h1 className={`headline-medium sq-result-screen__title sq-result-screen__title--${verdictFromQuality(diagnosis?.quality)}`}>
            {statusTitle(diagnosis?.quality)}
          </h1>
          <p className="body-medium" style={{ color: 'var(--text-secondary)' }}>
            {diagnosis?.summary ?? 'Medimos download, upload, latência e estabilidade da sua conexão pelo navegador.'}
          </p>
          <div className="sq-result-screen__context">
            <Icon name="wifi" size={13} />
            <span>
              Via navegador
              {result.connection.effectiveType ? ` · Conexão ${result.connection.effectiveType}` : ''}
            </span>
          </div>
        </div>

        <div className="sq-metrics-card sq-metrics-card--grid">
          <div className="sq-metrics-card__item">
            <span className="overline">Download</span>
            <strong style={{ color: download.color }}>
              {result.download.mbps?.toFixed(1) ?? '--'}
              <span> Mbps</span>
            </strong>
          </div>
          <div className="sq-metrics-card__item">
            <span className="overline">Upload</span>
            <strong style={{ color: upload.color }}>
              {result.upload.mbps?.toFixed(1) ?? '--'}
              <span> Mbps</span>
            </strong>
          </div>
          <div className="sq-metrics-card__item">
            <span className="overline">Latência</span>
            <strong style={{ color: ping.color }}>
              {result.latency.ms ?? '--'}
              <span> ms</span>
            </strong>
          </div>
          <div className="sq-metrics-card__item">
            <span className="overline">Jitter</span>
            <strong style={{ color: jitter.color }}>
              {result.jitter.ms ?? '--'}
              <span> ms</span>
            </strong>
          </div>
          <div className="sq-metrics-card__item">
            <span className="overline">Perda</span>
            <strong style={{ color: loss.color }}>
              {result.availability.perceivedLossPercent != null ? result.availability.perceivedLossPercent.toFixed(1) : '--'}
              <span> %</span>
            </strong>
          </div>
        </div>

        {usage ? (
          <div className="sq-result-screen__usage">
            <span className="overline">Experiência de uso</span>
            <div className="sq-usage-list">
              <div className="sq-usage-list__row">
                <Icon name="tv" size={20} style={{ color: 'var(--text-secondary)' }} />
                <span className="body-medium">Streaming 4K</span>
                <span className="label-small" style={{ color: VERDICT_COLOR[usage.streaming], fontWeight: 700 }}>
                  {VERDICT_LABEL[usage.streaming]}
                </span>
              </div>
              <div className="sq-usage-list__row">
                <Icon name="sports_esports" size={20} style={{ color: 'var(--text-secondary)' }} />
                <span className="body-medium">Jogos online</span>
                <span className="label-small" style={{ color: VERDICT_COLOR[usage.gaming], fontWeight: 700 }}>
                  {VERDICT_LABEL[usage.gaming]}
                </span>
              </div>
              <div className="sq-usage-list__row">
                <Icon name="videocam" size={20} style={{ color: 'var(--text-secondary)' }} />
                <span className="body-medium">Chamada de vídeo</span>
                <span className="label-small" style={{ color: VERDICT_COLOR[usage.videoCall], fontWeight: 700 }}>
                  {VERDICT_LABEL[usage.videoCall]}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        {recommendations.length > 0 ? <RecommendationList items={recommendations} /> : null}

        {diagnosis && diagnosis.limitations.length > 0 ? (
          <LimitationsCard
            items={diagnosis.limitations.map((item) => item.message)}
            tone={diagnosis.quality === 'good' ? 'neutral' : 'warning'}
          />
        ) : null}

        <div className="sq-result-screen__actions">
          <button className="sq-button sq-button--primary" onClick={onRetry} type="button">
            <Icon name="refresh" size={18} />
            <span>Testar novamente</span>
          </button>
          <button className="sq-button sq-button--outline" onClick={onCopyLink} type="button">
            <Icon name="bookmark_add" size={18} />
            <span>Salvar laudo</span>
          </button>
          <button className="sq-button sq-button--text" onClick={onGoHome} type="button">
            <span>Ir para o início</span>
          </button>
        </div>
      </div>
    </div>
  );
}
