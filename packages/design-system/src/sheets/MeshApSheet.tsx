import React, { useState } from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { LK } from '../tokens.js';
import { hexA } from '../utils.js';
import { Icon } from '../primitives/Icon.js';

export interface MeshApSheetProps {
  style?: React.CSSProperties;
}

/**
 * Detalhe de nó AP/mesh — tap num ponto de acesso na lista em
 * DispositivosScreen. Cabeçalho com ícone de torre (success), aviso de que
 * sinal/banda/clientes não estão disponíveis via varredura passiva, edição
 * de apelido, seção REDE. Mirrors `MeshApSheet` (`DispositivosScreen.kt`, ~L798).
 */
export function MeshApSheet({ style }: MeshApSheetProps) {
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
            background: hexA(LK.success, 0.12),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none',
          }}
        >
          <Icon name="cell_tower" size={24} color={LK.success} />
        </div>
        <div>
          <div style={{ font: `600 20px/1.3 ${LK.font}`, color: LK.textPrimary }}>Sala de estar</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: LK.success }} />
            <span style={{ font: `500 11px/1 ${LK.font}`, color: LK.success }}>Online</span>
            <span
              style={{
                marginLeft: 4,
                font: `700 10px/1 ${LK.font}`,
                color: LK.success,
                background: hexA(LK.success, 0.12),
                borderRadius: 4,
                padding: '3px 6px',
              }}
            >
              AP Mesh
            </span>
          </div>
        </div>
      </div>
      <Divider />

      {/* Aviso */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          background: LK.bgSecondary,
          borderRadius: LK.rCard,
          padding: 14,
          marginBottom: 16,
        }}
      >
        <Icon name="info" size={18} color={LK.textSecondary} style={{ flex: 'none', marginTop: 1 }} />
        <span style={{ font: `400 12px/1.4 ${LK.font}`, color: LK.textSecondary }}>
          Sinal, banda e clientes conectados não estão disponíveis via varredura passiva. Para métricas
          detalhadas, acesse o painel do seu roteador mesh.
        </span>
      </div>

      {/* Seção APELIDO */}
      <SectionLabel>APELIDO</SectionLabel>
      <div style={{ marginBottom: 12 }}>
        <div style={{ font: `500 11px/1 ${LK.font}`, color: LK.textTertiary, marginBottom: 6 }}>
          Apelido (opcional)
        </div>
        <input
          value={apelido}
          onChange={(e) => setApelido(e.target.value)}
          placeholder="Sala de estar"
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
      <Row label="Endereço IP" value="192.168.1.2" />
      <Row label="MAC" value="B8:27:••:••:4F:1A" mono />
      <Row label="Fabricante" value="TP-Link" />
      <Row label="Tipo" value="Ponto de Acesso / Mesh" last />
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

function Row({ label, value, mono, last }: { label: string; value: string; mono?: boolean; last?: boolean }) {
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
      <span style={{ font: `${mono ? 500 : 600} 13px/1 ${LK.font}`, color: LK.textPrimary }}>{value}</span>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: LK.border, margin: '4px 0 16px' }} />;
}
