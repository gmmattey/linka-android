import { Icon, QualityBadge } from '@/design-system';
import type { QualityLevel } from '@/design-system/types';

export type SpeedTestMode = 'rapido' | 'completo';

export interface VelocidadeLatestResult {
  dateLabel: string;
  downloadLabel: string;
  latencyLabel: string;
  qualityLabel: string;
  qualityLevel: QualityLevel;
  uploadLabel: string;
}

interface VelocidadeIdleScreenProps {
  historyCount: number;
  latest: VelocidadeLatestResult | null;
  mode: SpeedTestMode;
  onOpenAbout: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onSetMode: (mode: SpeedTestMode) => void;
  onStartTest: () => void;
}

const MODE_DESCRIPTION: Record<SpeedTestMode, string> = {
  rapido: 'Mede apenas o download, em poucos segundos.',
  completo: 'Mede download, upload e latência com amostra maior.',
};

export function VelocidadeIdleScreen({
  historyCount,
  latest,
  mode,
  onOpenAbout,
  onOpenHistory,
  onOpenSettings,
  onSetMode,
  onStartTest,
}: VelocidadeIdleScreenProps) {
  return (
    <div className="sq-velocidade-screen">
      <div className="sq-velocidade-idle">
        <div className="sq-velocidade-idle__cta-wrap">
          <button className="sq-velocidade-idle__cta" onClick={onStartTest} type="button">
            <Icon name="play_arrow" size={34} />
            <span>Medir</span>
          </button>
        </div>

        <div className="sq-velocidade-idle__modes">
          <div aria-label="Modo de medição" className="sq-segmented-control" role="radiogroup">
            {(['rapido', 'completo'] as const).map((option) => (
              <button
                aria-checked={mode === option}
                className={mode === option ? 'sq-segmented-control__option sq-segmented-control__option--active' : 'sq-segmented-control__option'}
                key={option}
                onClick={() => onSetMode(option)}
                role="radio"
                type="button"
              >
                {option === 'rapido' ? 'Rápido' : 'Completo'}
              </button>
            ))}
          </div>
          <span className="body-small sq-velocidade-idle__mode-hint">{MODE_DESCRIPTION[mode]}</span>
        </div>

        {latest ? (
          <div className="sq-velocidade-idle__result-card">
            <div className="sq-velocidade-idle__result-header">
              <span className="overline">Último resultado · {latest.dateLabel}</span>
              <QualityBadge label={latest.qualityLabel} level={latest.qualityLevel} />
            </div>
            <div className="sq-velocidade-idle__result-grid">
              <div>
                <span className="sq-velocidade-idle__result-label">DOWNLOAD</span>
                <strong className="sq-velocidade-idle__result-value" style={{ color: 'var(--success)' }}>
                  {latest.downloadLabel}
                </strong>
              </div>
              <div>
                <span className="sq-velocidade-idle__result-label">UPLOAD</span>
                <strong className="sq-velocidade-idle__result-value">{latest.uploadLabel}</strong>
              </div>
              <div>
                <span className="sq-velocidade-idle__result-label">LATÊNCIA</span>
                <strong className="sq-velocidade-idle__result-value">{latest.latencyLabel}</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="sq-velocidade-idle__empty-card">
            <p className="body-medium">Você ainda não fez nenhum teste neste navegador. Toque em Medir para começar.</p>
          </div>
        )}

        <button className="sq-velocidade-idle__action-row" onClick={onOpenHistory} type="button">
          <span className="sq-velocidade-idle__action-row-icon">
            <Icon name="history" size={19} />
          </span>
          <span className="sq-velocidade-idle__action-row-text">
            <strong>Histórico</strong>
            <span className="body-small">
              {historyCount} {historyCount === 1 ? 'teste salvo' : 'testes salvos'}
            </span>
          </span>
          <Icon name="chevron_right" size={19} />
        </button>

        <button className="sq-velocidade-idle__action-row" onClick={onOpenSettings} type="button">
          <span className="sq-velocidade-idle__action-row-icon">
            <Icon name="tune" size={19} />
          </span>
          <span className="sq-velocidade-idle__action-row-text">
            <strong>Ajustes</strong>
            <span className="body-small">Tema e dados salvos</span>
          </span>
          <Icon name="chevron_right" size={19} />
        </button>

        <button className="sq-velocidade-idle__action-row" onClick={onOpenAbout} type="button">
          <span className="sq-velocidade-idle__action-row-icon">
            <Icon name="info" size={19} />
          </span>
          <span className="sq-velocidade-idle__action-row-text">
            <strong>Sobre o SignallQ</strong>
            <span className="body-small">O que medimos e como tratamos seus dados</span>
          </span>
          <Icon name="chevron_right" size={19} />
        </button>
      </div>
    </div>
  );
}
