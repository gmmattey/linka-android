import React from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { LK } from '../tokens.js';
import { hexA } from '../utils.js';
import { Icon } from '../primitives/Icon.js';
import { SheetInfoRow } from './_shared.js';

export interface CellularInfoSheetProps {
  style?: React.CSSProperties;
}

/** Cellular info sheet: tap on the mobile-signal card. Carrier, technology, public IP on mobile. */
export function CellularInfoSheet({ style }: CellularInfoSheetProps) {
  return (
    <SheetFrame style={style}>
      <div style={{ font: `700 20px/1.3 ${LK.font}`, color: LK.textPrimary }}>Rede móvel</div>
      <div style={{ font: `400 13px/1.4 ${LK.font}`, color: LK.textTertiary, marginBottom: 20 }}>
        Detalhes da conexão móvel ativa
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          border: `1px solid ${LK.border}`,
          borderRadius: LK.rCard,
          padding: 16,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: hexA(LK.accent, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none',
          }}
        >
          <Icon name="signal_cellular_alt" size={22} color={LK.accent} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ font: `600 15px/1.3 ${LK.font}`, color: LK.textPrimary }}>Claro</div>
          <div style={{ font: `400 12px/1.3 ${LK.font}`, color: LK.textSecondary }}>5G NR · banda n78</div>
        </div>
        <span
          style={{
            font: `700 11px/1 ${LK.font}`,
            color: LK.success,
            background: hexA(LK.success, 0.1),
            padding: '4px 10px',
            borderRadius: 999,
          }}
        >
          Conectado
        </span>
      </div>

      <SheetInfoRow label="Tecnologia" value="5G NR" />
      <SheetInfoRow label="Operadora" value="Claro" />
      <SheetInfoRow label="IP público" value="177.32.88.14" />
      <SheetInfoRow label="Qualidade do sinal" value="Bom (−95 dBm)" valueColor={LK.success} />
      <SheetInfoRow label="ASU" value="45" />
      <SheetInfoRow label="SINR" value="14 dB" valueColor={LK.success} />
      <SheetInfoRow label="Roaming" value="Não" />
      <SheetInfoRow label="MCC / MNC" value="724 / 05" />

      <div style={{ font: `400 11px/1.4 ${LK.font}`, color: LK.textTertiary, marginTop: 4 }}>
        Teste de velocidade pode consumir uma parcela significativa do seu plano de dados.
      </div>
    </SheetFrame>
  );
}
