import React from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { LK } from '../tokens.js';
import { hexA } from '../utils.js';
import { Badge } from '../primitives/Badge.js';
import { SheetInfoRow } from './_shared.js';

export interface ChannelDetailSheetProps {
  style?: React.CSSProperties;
}

/**
 * Detalhe de canal Wi-Fi — tap num canal na tab Canal do SinalScreen. Badges
 * "Seu canal"/"Recomendado", contagem de redes próprias vs. terceiros no canal,
 * análise textual por nível de congestionamento, detalhes técnicos. Mirrors
 * `ChannelDetailSheet` (`SinalScreen.kt`, ~L2914).
 */
export function ChannelDetailSheet({ style }: ChannelDetailSheetProps) {
  return (
    <SheetFrame style={style}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <span style={{ font: `700 26px/1.2 ${LK.font}`, color: LK.textPrimary }}>Canal 36</span>
        <Badge color={LK.success} bg={hexA(LK.success, 0.14)}>
          Seu canal
        </Badge>
      </div>

      <div style={{ font: `600 14px/1.3 ${LK.font}`, color: LK.textPrimary, marginBottom: 10 }}>Status</div>
      <StatusDot cor={LK.accent} texto="Você (1 nó seu)" />
      <StatusDot cor={LK.warning} texto="3 redes de terceiros" />

      <div style={{ height: 1, background: LK.border, margin: '20px 0' }} />

      <div style={{ font: `600 14px/1.3 ${LK.font}`, color: LK.textPrimary, marginBottom: 10 }}>Análise</div>
      <AnaliseLinha simbolo="✓" cor={LK.success} texto="Você está usando este canal" />
      <AnaliseLinha simbolo="⚠" cor={LK.warning} texto="Moderado — 3 redes compartilhando" />

      <div style={{ height: 1, background: LK.border, margin: '20px 0' }} />

      <div style={{ font: `600 14px/1.3 ${LK.font}`, color: LK.textPrimary, marginBottom: 12 }}>Detalhes Técnicos</div>
      <SheetInfoRow label="Banda" value="5GHz" />
      <SheetInfoRow label="Sinal Máximo" value="−52 dBm" />
    </SheetFrame>
  );
}

function StatusDot({ cor, texto }: { cor: string; texto: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: cor, flex: 'none' }} />
      <span style={{ font: `400 14px/1.3 ${LK.font}`, color: LK.textPrimary }}>{texto}</span>
    </div>
  );
}

function AnaliseLinha({ simbolo, cor, texto }: { simbolo: string; cor: string; texto: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
      <span style={{ font: `700 14px/1.3 ${LK.font}`, color: cor }}>{simbolo}</span>
      <span style={{ font: `400 14px/1.3 ${LK.font}`, color: LK.textPrimary }}>{texto}</span>
    </div>
  );
}
