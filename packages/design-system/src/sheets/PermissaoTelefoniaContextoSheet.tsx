import React from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { LK } from '../tokens.js';
import { Icon } from '../primitives/Icon.js';

export interface PermissaoTelefoniaContextoSheetProps {
  style?: React.CSSProperties;
}

/**
 * Sheet de contexto de permissão de telefonia — auto-abre ao entrar em rede
 * móvel sem READ_PHONE_STATE. Explica por que é necessária (operadora,
 * tecnologia, sinal da torre). Único estado, sem variante bloqueada. Mirrors
 * `PermissaoTelefoniaContextoSheet.kt`.
 */
export function PermissaoTelefoniaContextoSheet({ style }: PermissaoTelefoniaContextoSheetProps) {
  return (
    <SheetFrame style={style}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Icon name="cell_tower" size={64} color={LK.accent} style={{ marginBottom: 20 }} />

        <div style={{ font: `600 20px/1.3 ${LK.font}`, color: LK.textPrimary, marginBottom: 12 }}>
          Por que precisamos desta permissão?
        </div>
        <div style={{ font: `400 14px/1.5 ${LK.font}`, color: LK.textSecondary, marginBottom: 8 }}>
          Para identificar sua operadora, o tipo de rede (4G, 5G) e a qualidade do sinal da torre.
        </div>
        <div style={{ font: `400 14px/1.5 ${LK.font}`, color: LK.textSecondary, marginBottom: 24 }}>
          Não acessamos chamadas, mensagens ou dados pessoais.
        </div>

        <div style={{ display: 'flex', gap: 12, width: '100%' }}>
          <button
            style={{
              flex: 1,
              background: 'none',
              border: 0,
              cursor: 'pointer',
              padding: '14px 0',
              font: `600 14px/1 ${LK.font}`,
              color: LK.textSecondary,
            }}
          >
            Agora não
          </button>
          <button
            style={{
              flex: 1,
              border: 0,
              cursor: 'pointer',
              borderRadius: LK.rBtn,
              background: LK.accent,
              color: '#fff',
              font: `600 14px/1 ${LK.font}`,
              padding: '14px 0',
            }}
          >
            Entendi, conceder
          </button>
        </div>
      </div>
    </SheetFrame>
  );
}
