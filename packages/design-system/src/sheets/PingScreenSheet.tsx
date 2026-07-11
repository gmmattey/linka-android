import React, { useState } from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { LK } from '../tokens.js';
import { Icon } from '../primitives/Icon.js';
import { StatePillSwitcher } from './_shared.js';

export interface PingScreenSheetProps {
  style?: React.CSSProperties;
}

type PingState = 'coletando' | 'resultado';

/**
 * Ping sheet — acionado de Home e de Velocidade ("Ping"). Coleta 20 amostras
 * (progresso incremental) e mostra latência/jitter/perda em 3 cards. Apesar do
 * nome, `PingScreen` (Kotlin) é um bottom sheet, não uma tela — sem drag handle
 * próprio porque já vem do `ModalBottomSheet`; aqui usamos o `SheetFrame` normal.
 */
export function PingScreenSheet({ style }: PingScreenSheetProps) {
  const [state, setState] = useState<PingState>('coletando');

  const states = [
    ['coletando', 'Coletando'],
    ['resultado', 'Resultado'],
  ] as const;

  return (
    <SheetFrame style={style}>
      <StatePillSwitcher value={state} options={states} onChange={setState} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Icon name="network_check" size={24} color={LK.textPrimary} />
        <div style={{ font: `700 20px/1.3 ${LK.font}`, color: LK.textPrimary }}>Ping</div>
      </div>

      {state === 'coletando' ? (
        <>
          <div style={{ font: `400 14px/1.4 ${LK.font}`, color: LK.textPrimary, marginBottom: 16 }}>
            Medindo latência — 12 de 20 amostras coletadas
          </div>
          <div style={{ width: '100%', height: 4, borderRadius: 2, background: LK.bgSecondary, overflow: 'hidden' }}>
            <div style={{ width: '60%', height: '100%', background: LK.accent }} />
          </div>
        </>
      ) : (
        <>
          <div style={{ font: `600 12px/1 ${LK.font}`, color: LK.textSecondary, marginBottom: 16 }}>Resultados</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <PingMetricCard label="Latência" valor="24.3 ms" />
            <PingMetricCard label="Jitter" valor="3.1 ms" />
            <PingMetricCard label="Perda" valor="0%" />
          </div>
          <button
            style={{
              width: '100%',
              border: 0,
              cursor: 'pointer',
              borderRadius: LK.rBtn,
              background: LK.accent,
              color: '#fff',
              font: `600 15px/1 ${LK.font}`,
              padding: '14px 0',
            }}
          >
            Testar novamente
          </button>
        </>
      )}
    </SheetFrame>
  );
}

function PingMetricCard({ label, valor }: { label: string; valor: string }) {
  return (
    <div
      style={{
        flex: 1,
        border: `1px solid ${LK.border}`,
        borderRadius: LK.rCard,
        background: LK.bgSecondary,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <span style={{ font: `500 11px/1 ${LK.font}`, color: LK.textSecondary }}>{label}</span>
      <span style={{ font: `700 16px/1 ${LK.font}`, color: LK.textPrimary }}>{valor}</span>
    </div>
  );
}
