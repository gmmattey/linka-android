import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  helperText?: string;
  tone?: 'accent' | 'success' | 'warning' | 'neutral';
  icon: ReactNode;
}

export function MetricCard({ label, value, unit, helperText, tone = 'neutral', icon }: MetricCardProps) {
  return (
    <article className={`metric-card metric-card--${tone}`}>
      <div className="metric-card__icon">{icon}</div>
      <div>
        <p className="overline">{label}</p>
        <p className="metric-card__value">
          {value}
          {unit ? <span>{unit}</span> : null}
        </p>
        {helperText ? <p className="metric-card__helper">{helperText}</p> : null}
      </div>
    </article>
  );
}
