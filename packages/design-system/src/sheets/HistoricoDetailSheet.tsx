import React from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { LK } from '../tokens.js';
import { Icon } from '../primitives/Icon.js';

export interface HistoricoDetailSheetProps {
  style?: React.CSSProperties;
}

/**
 * Detalhe de um item de histórico — tap num teste na lista de Histórico.
 * Métricas primárias (download/upload) + secundárias (latência/oscilação/
 * perda), badge de origem IA quando aplicável, bufferbloat com veredito,
 * vereditos de streaming/games/vídeo-chamada, gargalo identificado, e
 * diagnóstico textual completo. Mirrors `HistoricoDetailSheet`
 * (`HistoricoScreen.kt`, ~L1111) — segue a ordem real do Kotlin.
 */
export function HistoricoDetailSheet({ style }: HistoricoDetailSheetProps) {
  return (
    <SheetFrame style={style}>
      <div style={{ font: `600 16px/1.3 ${LK.font}`, color: LK.textPrimary }}>Detalhes do teste</div>
      <div style={{ font: `400 12px/1.4 ${LK.font}`, color: LK.textSecondary, marginTop: 2 }}>
        11 de julho de 2026 · 14:32
      </div>

      <Divider top={16} bottom={16} />

      {/* Métricas primárias */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <PrimaryMetric arrow="↓" arrowColor={LK.accent} value="187.4" label="Download" />
        <div style={{ width: 1, height: 60, background: LK.border }} />
        <PrimaryMetric arrow="↑" arrowColor={LK.success} value="42.1" label="Upload" />
      </div>

      <div style={{ display: 'flex', marginTop: 16 }}>
        <SecondaryMetric label="Latência" value="18 ms" />
        <SecondaryMetric label="Oscilação" value="3.2 ms" />
        <SecondaryMetric label="Perda" value="0.0%" />
      </div>

      <Divider top={16} bottom={0} />

      <SheetRow label="Origem" value="Diagnóstico gerado por IA" valueColor={LK.accent} icon="auto_awesome" />
      <SheetRow label="Tipo de rede" value="Wi-Fi · 5GHz" />
      <SheetRow label="Bufferbloat" value="42 ms — Moderado" valueColor={LK.warning} />
      <SheetRow label="Streaming" value="Excelente" />
      <SheetRow label="Games" value="Bom" />
      <SheetRow label="Vídeo chamada" value="Excelente" />
      <SheetRow label="Gargalo identificado" value="Congestionamento no Wi-Fi" valueColor={LK.warning} last />

      {/* Diagnóstico textual */}
      <div style={{ marginTop: 20 }}>
        <div
          style={{
            font: `600 11px/1 ${LK.font}`,
            letterSpacing: '.4px',
            textTransform: 'uppercase',
            color: LK.textTertiary,
            marginBottom: 8,
          }}
        >
          DIAGNÓSTICO
        </div>
        <div style={{ background: LK.bgSecondary, borderRadius: 12, padding: 16 }}>
          <div style={{ font: `400 14px/1.5 ${LK.font}`, color: LK.textPrimary }}>
            Sua conexão está estável, mas o Wi-Fi 5GHz está dividindo canal com redes vizinhas no horário de
            pico. Isso aumenta a latência sob carga sem derrubar a velocidade média.
          </div>
          <div style={{ marginTop: 8 }}>
            <ProblemaItem text="Canal Wi-Fi 5GHz congestionado às 14h" />
            <ProblemaItem text="Bufferbloat moderado sob carga simultânea" />
          </div>
          <div style={{ font: `500 11px/1 ${LK.font}`, color: LK.accent, marginTop: 8 }}>Gerado por IA</div>
        </div>
      </div>
    </SheetFrame>
  );
}

function PrimaryMetric({
  arrow,
  arrowColor,
  value,
  label,
}: {
  arrow: string;
  arrowColor: string;
  value: string;
  label: string;
}) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span style={{ font: `700 20px/1 ${LK.font}`, color: arrowColor }}>{arrow}</span>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
        <span style={{ font: `700 28px/1 ${LK.font}`, color: LK.textPrimary, letterSpacing: '-1px' }}>
          {value}
        </span>
        <span style={{ font: `400 12px/1.6 ${LK.font}`, color: LK.textSecondary }}>Mbps</span>
      </div>
      <span style={{ font: `400 12px/1.4 ${LK.font}`, color: LK.textSecondary, marginTop: 2 }}>{label}</span>
    </div>
  );
}

function SecondaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span style={{ font: `600 15px/1.3 ${LK.font}`, color: LK.textPrimary }}>{value}</span>
      <span style={{ font: `400 12px/1.3 ${LK.font}`, color: LK.textSecondary }}>{label}</span>
    </div>
  );
}

function SheetRow({
  label,
  value,
  valueColor,
  icon,
  last,
}: {
  label: string;
  value: string;
  valueColor?: string;
  icon?: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '14px 0',
        borderBottom: last ? 'none' : `1px solid ${LK.border}`,
      }}
    >
      <span style={{ font: `400 14px/1 ${LK.font}`, color: LK.textSecondary }}>{label}</span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {icon && <Icon name={icon} size={13} color={valueColor ?? LK.textPrimary} />}
        <span style={{ font: `500 14px/1 ${LK.font}`, color: valueColor ?? LK.textPrimary }}>{value}</span>
      </span>
    </div>
  );
}

function ProblemaItem({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '3px 0' }}>
      <div style={{ width: 4, height: 4, borderRadius: 2, background: LK.warning, flex: 'none' }} />
      <span style={{ font: `400 12px/1.3 ${LK.font}`, color: LK.textSecondary }}>{text}</span>
    </div>
  );
}

function Divider({ top, bottom }: { top: number; bottom: number }) {
  return <div style={{ height: 1, background: LK.border, margin: `${top}px 0 ${bottom}px` }} />;
}
