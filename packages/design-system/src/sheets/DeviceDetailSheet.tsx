import React, { useState } from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { LK } from '../tokens.js';
import { hexA } from '../utils.js';
import { Icon } from '../primitives/Icon.js';

export interface DeviceDetailSheetProps {
  style?: React.CSSProperties;
}

/**
 * Detalhe de dispositivo cliente na rede — tap num item da lista em
 * DispositivosScreen. Cabeçalho (ícone + nome + status online), edição de
 * apelido (#853 — chave com fallback ip+nome, não só MAC), seção REDE.
 * Mirrors `DeviceDetailSheet` (`DispositivosScreen.kt`, ~L630).
 */
export function DeviceDetailSheet({ style }: DeviceDetailSheetProps) {
  const [apelido, setApelido] = useState('');

  return (
    <SheetFrame style={style}>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: hexA(LK.accent, 0.12),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none',
          }}
        >
          <Icon name="smartphone" size={24} color={LK.accent} />
        </div>
        <div>
          <div style={{ font: `600 20px/1.3 ${LK.font}`, color: LK.textPrimary }}>iPhone de Ana</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: LK.success }} />
            <span style={{ font: `500 11px/1 ${LK.font}`, color: LK.success }}>Online</span>
          </div>
        </div>
      </div>
      <Divider />

      {/* Seção APELIDO */}
      <SectionLabel>APELIDO</SectionLabel>
      <div style={{ marginBottom: 12 }}>
        <div style={{ font: `500 11px/1 ${LK.font}`, color: LK.textTertiary, marginBottom: 6 }}>
          Apelido (opcional)
        </div>
        <input
          value={apelido}
          onChange={(e) => setApelido(e.target.value)}
          placeholder="iPhone de Ana"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            border: `1px solid ${LK.border}`,
            borderRadius: 8,
            padding: '12px 14px',
            font: `400 14px/1 ${LK.font}`,
            color: LK.textPrimary,
            marginBottom: 10,
          }}
        />
        <button
          style={{
            width: '100%',
            border: 0,
            cursor: 'pointer',
            background: LK.accent,
            color: '#fff',
            font: `600 14px/1 ${LK.font}`,
            borderRadius: LK.rBtn,
            padding: '12px 0',
          }}
        >
          Salvar apelido
        </button>
      </div>
      <Divider />

      {/* Seção REDE */}
      <SectionLabel>REDE</SectionLabel>
      <Row label="Endereço IP" value="192.168.1.57" />
      <Row label="MAC" value="A4:2B:••:••:9E:03" mono />
      <Row label="Fabricante" value="Apple, Inc." />
      <Row label="Tipo" value="Smartphone" />
      <Row label="Descoberto via" value="Consulta ativa ao roteador" valueColor={LK.accent} last />
    </SheetFrame>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        font: `600 11px/1.3 ${LK.font}`,
        letterSpacing: '.4px',
        textTransform: 'uppercase',
        color: LK.textTertiary,
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

function Row({
  label,
  value,
  valueColor,
  mono,
  last,
}: {
  label: string;
  value: string;
  valueColor?: string;
  mono?: boolean;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: last ? 'none' : `1px solid ${LK.border}`,
      }}
    >
      <span style={{ font: `400 14px/1 ${LK.font}`, color: LK.textSecondary }}>{label}</span>
      <span
        style={{
          font: `${mono ? 500 : 600} 13px/1 ${LK.font}`,
          color: valueColor ?? LK.textPrimary,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: LK.border, margin: '4px 0 16px' }} />;
}
