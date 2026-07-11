import React, { useState } from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { LK } from '../tokens.js';
import { hexA } from '../utils.js';
import { StatePillSwitcher } from './_shared.js';

export interface ExportHistoricoBottomSheetProps {
  style?: React.CSSProperties;
}

type ExportState = 'selecao' | 'exportando';

const PERIODOS = ['7 dias', '30 dias', 'Tudo'] as const;
const FORMATOS = [
  ['CSV', 'Planilha compatível com Excel e Google Sheets'],
  ['PDF', 'Relatório formatado para impressão'],
] as const;

/**
 * Sheet de exportação de histórico — ícone de exportar na topbar do
 * Histórico. Seleção de período + formato via chips, botão exportar com
 * progress bar. Mirrors `ExportHistoricoBottomSheet.kt`.
 */
export function ExportHistoricoBottomSheet({ style }: ExportHistoricoBottomSheetProps) {
  const [state, setState] = useState<ExportState>('selecao');
  const [periodo, setPeriodo] = useState<(typeof PERIODOS)[number]>('7 dias');
  const [formato, setFormato] = useState<'CSV' | 'PDF'>('CSV');

  const exportando = state === 'exportando';
  const formatoInfo = FORMATOS.find(([id]) => id === formato)!;

  const states = [
    ['selecao', 'Seleção'],
    ['exportando', 'Exportando'],
  ] as const;

  return (
    <SheetFrame style={style}>
      <StatePillSwitcher value={state} options={states} onChange={setState} />

      <div style={{ font: `600 18px/1.3 ${LK.font}`, color: LK.textPrimary, marginBottom: 20 }}>
        Exportar histórico
      </div>

      <div style={{ font: `500 12px/1 ${LK.font}`, color: LK.textSecondary, marginBottom: 8 }}>Período</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {PERIODOS.map((p) => {
          const on = p === periodo;
          return (
            <Chip key={p} active={on} disabled={exportando} onClick={() => setPeriodo(p)}>
              {p}
            </Chip>
          );
        })}
      </div>

      <div style={{ font: `500 12px/1 ${LK.font}`, color: LK.textSecondary, marginBottom: 8 }}>Formato</div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        {FORMATOS.map(([id]) => {
          const on = id === formato;
          return (
            <Chip key={id} active={on} disabled={exportando} onClick={() => setFormato(id as 'CSV' | 'PDF')}>
              {id}
            </Chip>
          );
        })}
      </div>
      <div style={{ font: `400 11px/1.4 ${LK.font}`, color: LK.textTertiary, marginBottom: 24 }}>
        {formatoInfo[1]}
      </div>

      <button
        disabled={exportando}
        style={{
          width: '100%',
          border: 0,
          cursor: exportando ? 'default' : 'pointer',
          background: LK.accent,
          color: '#fff',
          font: `600 15px/1 ${LK.font}`,
          borderRadius: LK.rBtn,
          padding: '14px 0',
          opacity: exportando ? 0.85 : 1,
        }}
      >
        {exportando ? 'Exportando…' : 'Exportar'}
      </button>

      {exportando && (
        <div
          style={{
            marginTop: 10,
            height: 4,
            borderRadius: 2,
            background: LK.bgSecondary,
            overflow: 'hidden',
          }}
        >
          <div style={{ width: '55%', height: '100%', background: LK.accent, borderRadius: 2 }} />
        </div>
      )}
    </SheetFrame>
  );
}

function Chip({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        border: 0,
        cursor: disabled ? 'default' : 'pointer',
        padding: '8px 16px',
        borderRadius: 999,
        font: `${active ? 600 : 500} 13px/1 ${LK.font}`,
        background: active ? hexA(LK.accent, 0.15) : LK.bgSecondary,
        color: active ? LK.accent : LK.textSecondary,
        opacity: disabled && !active ? 0.6 : 1,
      }}
    >
      {children}
    </button>
  );
}
