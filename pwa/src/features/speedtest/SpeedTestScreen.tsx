import { useEffect, useState } from 'react';
import { Icon } from '@/design-system';
import { SpeedtestPhase } from '@/types/network';
import type { SpeedTestProgress, SpeedTestRunStatus } from './speedTestTypes';

interface SpeedTestScreenProps {
  onCancel: () => void;
  progress: SpeedTestProgress | null;
  status: SpeedTestRunStatus;
}

const PHASE_LABEL: Record<SpeedtestPhase, string> = {
  [SpeedtestPhase.Idle]: 'Preparando',
  [SpeedtestPhase.Latency]: 'Latência',
  [SpeedtestPhase.Download]: 'Download',
  [SpeedtestPhase.Upload]: 'Upload',
  [SpeedtestPhase.Partial]: 'Parcial',
  [SpeedtestPhase.Complete]: 'Concluído',
  [SpeedtestPhase.Error]: 'Erro',
  [SpeedtestPhase.Canceled]: 'Cancelado',
};

const PHASE_COLOR: Record<SpeedtestPhase, string> = {
  [SpeedtestPhase.Idle]: 'var(--text-tertiary)',
  [SpeedtestPhase.Latency]: 'var(--phase-latencia)',
  [SpeedtestPhase.Download]: 'var(--phase-download)',
  [SpeedtestPhase.Upload]: 'var(--phase-upload)',
  [SpeedtestPhase.Partial]: 'var(--success)',
  [SpeedtestPhase.Complete]: 'var(--success)',
  [SpeedtestPhase.Error]: 'var(--error)',
  [SpeedtestPhase.Canceled]: 'var(--text-tertiary)',
};

const PHASE_PROGRESS: Record<SpeedtestPhase, number> = {
  [SpeedtestPhase.Idle]: 0.04,
  [SpeedtestPhase.Latency]: 0.22,
  [SpeedtestPhase.Download]: 0.58,
  [SpeedtestPhase.Upload]: 0.9,
  [SpeedtestPhase.Partial]: 1,
  [SpeedtestPhase.Complete]: 1,
  [SpeedtestPhase.Error]: 1,
  [SpeedtestPhase.Canceled]: 1,
};

const PHASE_ORDER = [SpeedtestPhase.Latency, SpeedtestPhase.Download, SpeedtestPhase.Upload];

function stepStatus(current: SpeedtestPhase, target: SpeedtestPhase): 'done' | 'active' | 'pending' {
  const currentIndex = PHASE_ORDER.indexOf(current);
  const targetIndex = PHASE_ORDER.indexOf(target);
  if (currentIndex > targetIndex) return 'done';
  if (currentIndex === targetIndex) return 'active';
  return 'pending';
}

const RING_RADIUS = 100;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function SpeedTestScreen({ onCancel, progress, status }: SpeedTestScreenProps) {
  const phase = progress?.phase ?? SpeedtestPhase.Idle;
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (status !== 'running') return undefined;
    const timer = window.setInterval(() => setElapsedSeconds((current) => current + 1), 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  const chips: { key: string; label: string; state: 'done' | 'active' | 'pending' }[] = [
    { key: 'latencia', label: 'LATÊNCIA', state: stepStatus(phase, SpeedtestPhase.Latency) },
    { key: 'download', label: 'DOWNLOAD', state: stepStatus(phase, SpeedtestPhase.Download) },
    { key: 'upload', label: 'UPLOAD', state: stepStatus(phase, SpeedtestPhase.Upload) },
  ];
  const allDone = phase === SpeedtestPhase.Complete || phase === SpeedtestPhase.Partial;

  return (
    <div className="sq-velocidade-screen">
      <div className="sq-velocidade-running">
        <div className="sq-velocidade-running__ring-wrap">
          <svg height="240" viewBox="0 0 240 240" width="240">
            <circle cx="120" cy="120" fill="none" r={RING_RADIUS} stroke="var(--bg-secondary)" strokeWidth="14" />
            <circle
              cx="120"
              cy="120"
              fill="none"
              r={RING_RADIUS}
              stroke={PHASE_COLOR[phase]}
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={RING_CIRCUMFERENCE * (1 - PHASE_PROGRESS[phase])}
              strokeLinecap="round"
              strokeWidth="14"
              style={{ transition: 'stroke-dashoffset .4s var(--motion-standard), stroke .3s linear' }}
              transform="rotate(-90 120 120)"
            />
          </svg>
          <div className="sq-velocidade-running__ring-center">
            <strong style={{ color: PHASE_COLOR[phase] }}>{elapsedSeconds}s</strong>
            <span className="body-small" style={{ color: 'var(--text-secondary)' }}>
              {status === 'running' ? 'medindo…' : progress?.message}
            </span>
            <span className="label-small" style={{ color: PHASE_COLOR[phase], fontWeight: 600, letterSpacing: '.4px' }}>
              {PHASE_LABEL[phase].toUpperCase()}
            </span>
          </div>
        </div>

        <div className="sq-velocidade-running__chips">
          {chips.map((chip) => (
            <span className={`sq-velocidade-chip sq-velocidade-chip--${chip.state}`} key={chip.key}>
              {chip.state === 'done' ? <Icon name="check" size={13} /> : null}
              {chip.label}
            </span>
          ))}
          <span className={`sq-velocidade-chip sq-velocidade-chip--${allDone ? 'done' : 'pending'}`}>
            {allDone ? <Icon name="check" size={13} /> : null}
            CONCLUÍDO
          </span>
        </div>

        <p className="body-small sq-velocidade-running__hint">Continue nesta aba até o fim — leva menos de um minuto.</p>

        <button className="sq-button sq-button--outline" onClick={onCancel} type="button">
          <Icon name="close" size={16} />
          <span>Cancelar</span>
        </button>
      </div>
    </div>
  );
}
