import React from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { LK } from '../tokens.js';
import { hexA } from '../utils.js';
import { Icon } from '../primitives/Icon.js';
import { SheetTitle } from './_shared.js';

export interface MedicaoTipoSheetProps {
  style?: React.CSSProperties;
}

const opcoes = [
  {
    icon: 'speed',
    titulo: 'Rápido',
    descricao: 'Somente download · ~30 seg',
    badge: null as string | null,
    badgeColor: LK.accent,
    disponivel: true,
  },
  {
    icon: 'adjust',
    titulo: 'Completo',
    descricao: 'Download e upload · ~90 seg',
    badge: 'Recomendado',
    badgeColor: LK.accent,
    disponivel: true,
  },
  {
    icon: 'refresh',
    titulo: 'Triplo',
    descricao: 'Média de 3 testes consecutivos · ~3 min',
    badge: 'Só Wi-Fi',
    badgeColor: LK.textTertiary,
    disponivel: true,
  },
];

/** "Medir agora" CTA sheet: choose between Rápido, Completo (recommended), and Triplo test modes. */
export function MedicaoTipoSheet({ style }: MedicaoTipoSheetProps) {
  return (
    <SheetFrame style={style}>
      <SheetTitle title="Tipo de medição" subtitle="Escolha como quer medir sua conexão" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {opcoes.map((o) => {
          const iconColor = o.disponivel ? LK.accent : LK.textTertiary;
          const textColor = o.disponivel ? LK.textPrimary : LK.textTertiary;
          const subColor = o.disponivel ? LK.textSecondary : LK.textTertiary;
          return (
            <div
              key={o.titulo}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: 12,
                borderRadius: LK.rCard,
                cursor: o.disponivel ? 'pointer' : 'default',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: hexA(iconColor, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 'none',
                }}
              >
                <Icon name={o.icon} size={22} color={iconColor} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ font: `600 14px/1.3 ${LK.font}`, color: textColor }}>{o.titulo}</div>
                <div style={{ font: `400 12px/1.3 ${LK.font}`, color: subColor }}>{o.descricao}</div>
              </div>
              {o.badge && (
                <span
                  style={{
                    font: `600 11px/1 ${LK.font}`,
                    color: o.badgeColor,
                    background: hexA(o.badgeColor, 0.12),
                    padding: '5px 9px',
                    borderRadius: 999,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {o.badge}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <button
        style={{
          marginTop: 12,
          width: '100%',
          background: 'none',
          border: 0,
          cursor: 'pointer',
          padding: '12px 0',
          font: `600 14px/1 ${LK.font}`,
          color: LK.textSecondary,
        }}
      >
        Cancelar
      </button>
    </SheetFrame>
  );
}
