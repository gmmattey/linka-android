import React from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { LK } from '../tokens.js';
import { hexA } from '../utils.js';
import { Icon } from '../primitives/Icon.js';
import { SheetInfoRow } from './_shared.js';

export interface NetworkDetailSheetProps {
  style?: React.CSSProperties;
}

/**
 * Detalhe de rede Wi-Fi vizinha — tap numa rede na tab Redes do SinalScreen.
 * Sinal (dBm + qualidade), banda, canal, largura, segurança, BSSID; banner de
 * canal congestionado + sugestão de canal alternativo quando aplicável.
 * Mirrors `NetworkDetailSheet` (`SinalScreen.kt`, ~L1782).
 */
export function NetworkDetailSheet({ style }: NetworkDetailSheetProps) {
  return (
    <SheetFrame style={style}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <Icon name="lock" size={20} color={LK.accent} />
        <div style={{ font: `700 22px/1.3 ${LK.font}`, color: LK.textPrimary }}>Familia-Silva_5G</div>
      </div>

      <SheetInfoRow label="Sinal" value="−58 dBm — Boa" valueColor={LK.success} />
      <Divider />
      <SheetInfoRow label="Banda" value="5GHz" />
      <Divider />
      <SheetInfoRow label="Canal" value="36" />
      <Divider />
      <SheetInfoRow label="Largura" value="80 MHz" />
      <Divider />
      <SheetInfoRow label="Segurança" value="WPA3" />
      <Divider />
      <SheetInfoRow label="BSSID" value="A4:2B:8C:1D:9E:03" />
      <div style={{ font: `400 11px/1.4 ${LK.font}`, color: LK.textTertiary, marginTop: 2, marginBottom: 20 }}>
        Identificador técnico do roteador — útil só se você for comparar com o painel de administração dele.
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          border: `1px solid ${hexA(LK.warning, 0.3)}`,
          background: hexA(LK.warning, 0.08),
          borderRadius: LK.rCard,
          padding: 16,
          marginBottom: 12,
        }}
      >
        <Icon name="warning" size={20} color={LK.warning} />
        <div>
          <div style={{ font: `600 14px/1.3 ${LK.font}`, color: LK.warning }}>Canal congestionado</div>
          <div style={{ font: `400 13px/1.3 ${LK.font}`, color: LK.textSecondary }}>
            Várias redes vizinhas dividem o canal 36.
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: hexA(LK.accent, 0.08),
          borderRadius: LK.rCard,
          padding: 16,
        }}
      >
        <Icon name="wifi" size={20} color={LK.accent} />
        <div>
          <div style={{ font: `600 14px/1.3 ${LK.font}`, color: LK.accent }}>Troque de canal</div>
          <div style={{ font: `400 13px/1.3 ${LK.font}`, color: LK.textSecondary, marginTop: 2 }}>
            Mude para o canal 149 no roteador — está mais livre agora.
          </div>
        </div>
      </div>
    </SheetFrame>
  );
}

function Divider() {
  return <div style={{ height: 1, background: LK.border, margin: '4px 0 8px' }} />;
}
