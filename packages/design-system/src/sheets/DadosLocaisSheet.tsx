import React from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { LK } from '../tokens.js';
import { Icon } from '../primitives/Icon.js';

export interface DadosLocaisSheetProps {
  style?: React.CSSProperties;
}

/**
 * "Gerenciar dados e privacidade" sheet — destino único das ações
 * irreversíveis, escalonadas por gravidade (limpar histórico → apagar
 * dados locais → resetar app). Sem simular o dialog de confirmação em si.
 * Mirrors `DadosLocaisSheet` (`AjustesScreen.kt`, ~L2002).
 */
export function DadosLocaisSheet({ style }: DadosLocaisSheetProps) {
  return (
    <SheetFrame style={style}>
      <div style={{ font: `700 20px/1.3 ${LK.font}`, color: LK.textPrimary }}>Gerenciar dados e privacidade</div>
      <div style={{ font: `400 13px/1.4 ${LK.font}`, color: LK.textSecondary, marginTop: 4, marginBottom: 20 }}>
        Estas ações são irreversíveis. Os dados serão removidos permanentemente do dispositivo.
      </div>

      <ActionRow
        icon="history"
        color={LK.warning}
        label="Limpar histórico de testes"
        outlined
      />
      <ActionRow icon="delete" color={LK.error} label="Apagar dados locais" outlined />
      <ActionRow icon="restart_alt" color={LK.error} label="Resetar app" filled />
    </SheetFrame>
  );
}

function ActionRow({
  icon,
  color,
  label,
  outlined,
  filled,
}: {
  icon: string;
  color: string;
  label: string;
  outlined?: boolean;
  filled?: boolean;
}) {
  return (
    <button
      style={{
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        cursor: 'pointer',
        marginBottom: 10,
        padding: '13px 0',
        borderRadius: LK.rBtn,
        font: `600 14px/1 ${LK.font}`,
        border: outlined ? `1px solid ${color}` : 'none',
        background: filled ? color : 'transparent',
        color: filled ? '#fff' : color,
      }}
    >
      <Icon name={icon} size={16} color={filled ? '#fff' : color} />
      {label}
    </button>
  );
}
