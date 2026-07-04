import { ReactNode } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';

export interface EmptyStateProps {
  actionLabel?: string;
  description: string;
  icon?: ReactNode;
  onAction?: () => void;
  title: string;
}

export function EmptyState({ actionLabel, description, icon, onAction, title }: EmptyStateProps) {
  return (
    <Card className="sq-state-card" variant="outlined">
      {icon ? <div className="sq-state-card__icon">{icon}</div> : null}
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel ? <Button variant="tonal" onClick={onAction}>{actionLabel}</Button> : null}
    </Card>
  );
}
