import { Card } from '../Card';

export interface DiagnosisInsightCardProps {
  body: string;
  eyebrow?: string;
  id?: string;
  title: string;
  tone?: 'info' | 'warning' | 'error';
}

export function DiagnosisInsightCard({ body, eyebrow = 'Diagnóstico', id, title, tone = 'info' }: DiagnosisInsightCardProps) {
  return (
    <Card className={`sq-insight-card sq-insight-card--${tone}`} id={id} variant="outlined">
      <p className="sq-overline">{eyebrow}</p>
      <h3>{title}</h3>
      <p>{body}</p>
    </Card>
  );
}
