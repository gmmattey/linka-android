import { ButtonHTMLAttributes, ReactNode } from 'react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'neutral';
}

export function PrimaryButton({ children, icon, variant = 'primary', ...props }: PrimaryButtonProps) {
  const modifier = variant === 'primary' ? '' : ` primary-button--${variant}`;

  return (
    <button className={`primary-button${modifier}`} type="button" {...props}>
      {icon}
      {children}
    </button>
  );
}
