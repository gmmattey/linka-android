import React from 'react';
import { useTokens } from '../theme/ThemeProvider.js';

export interface CardProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * Surface card: separação do fundo por profundidade (tint de superfície, nível 1), sem borda.
 * 16dp radius, flat (sem sombra — sombra só entra se um uso específico precisar reforçar o
 * nível, ver `depthLevel1Shadow`). Nunca reintroduzir `border` aqui — é exatamente o padrão
 * que criava contraste zero entre card e fundo no tema claro (bgCard == bgPrimary == #FFFFFF).
 */
export function Card({ children, style = {}, onClick }: CardProps) {
  const LK = useTokens();
  return (
    <div
      onClick={onClick}
      style={{
        background: LK.depthLevel1Tint,
        borderRadius: LK.rCard,
        padding: 16,
        boxSizing: 'border-box',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
