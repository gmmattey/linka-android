import React, { useState } from 'react';
import { LK } from '../tokens.js';
import { hexA } from '../utils.js';
import { Icon } from '../primitives/Icon.js';

export interface FibraModemScreenProps {
  style?: React.CSSProperties;
}

/** Fibra/ONT overlay: GPON optical health in plain language + collapsible technical details. */
export function FibraModemScreen({ style }: FibraModemScreenProps) {
  const [view, setView] = useState<'concluido' | 'erro'>('concluido');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: LK.bgPrimary, overflow: 'hidden', ...style }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 8px',
          borderBottom: `1px solid ${LK.border}`,
          flex: 'none',
        }}
      >
        <button style={{ background: 'none', border: 0, cursor: 'pointer', padding: 8 }}>
          <Icon name="arrow_back" size={22} color={LK.textPrimary} />
        </button>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ font: `600 16px/1.2 ${LK.font}`, color: LK.textPrimary }}>Sua internet por fibra</div>
          <div style={{ font: `400 11px/1 ${LK.font}`, color: LK.textTertiary }}>Modem conectado pela operadora</div>
        </div>
        <button style={{ background: 'none', border: 0, cursor: 'pointer', padding: 8 }}>
          <Icon name="refresh" size={20} color={LK.textPrimary} />
        </button>
      </div>

      {/* Prototype state switcher — not part of the real app UI */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px 0' }}>
        {(
          [
            ['concluido', 'Concluído'],
            ['erro', 'Erro'],
          ] as const
        ).map(([id, lbl]) => {
          const on = id === view;
          return (
            <button
              key={id}
              onClick={() => setView(id)}
              style={{
                flex: 1,
                border: 0,
                cursor: 'pointer',
                padding: '9px 0',
                borderRadius: 999,
                font: `${on ? 600 : 500} 12px/1 ${LK.font}`,
                background: on ? hexA(LK.accent, 0.12) : LK.bgSecondary,
                color: on ? LK.accent : LK.textSecondary,
              }}
            >
              {lbl}
            </button>
          );
        })}
      </div>

      {view === 'concluido' ? <FibraConcluido /> : <FibraErro />}
    </div>
  );
}

function StatusBadge({ label, color }: { label: string; color: string }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: hexA(color, 0.1),
        borderRadius: 999,
        padding: '6px 12px',
      }}
    >
      <Icon name="check_circle" size={14} color={color} />
      <span style={{ font: `600 12px/1 ${LK.font}`, color }}>{label}</span>
    </div>
  );
}

function FriendlyCard({
  icon,
  iconColor,
  title,
  desc,
  badge,
  badgeColor,
}: {
  icon: string;
  iconColor: string;
  title: string;
  desc: string;
  badge: string;
  badgeColor: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: LK.bgCard,
        border: `1px solid ${LK.border}`,
        borderRadius: LK.rCard,
        padding: 14,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: hexA(iconColor, 0.1),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 'none',
        }}
      >
        <Icon name={icon} size={18} color={iconColor} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ font: `600 12px/1.2 ${LK.font}`, color: LK.textPrimary }}>{title}</div>
        <div style={{ font: `400 11px/1.4 ${LK.font}`, color: LK.textSecondary }}>{desc}</div>
      </div>
      <span
        style={{
          font: `700 11px/1 ${LK.font}`,
          color: badgeColor,
          background: hexA(badgeColor, 0.1),
          borderRadius: 999,
          padding: '4px 10px',
        }}
      >
        {badge}
      </span>
    </div>
  );
}

function FibraConcluido() {
  const [detalhes, setDetalhes] = useState(false);

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ font: `700 20px/1.3 ${LK.font}`, color: LK.textPrimary }}>Conexão saudável</div>
      <div style={{ font: `400 13px/1.4 ${LK.font}`, color: LK.textSecondary, marginTop: -8 }}>
        Sua internet está estável e funcionando bem.
      </div>
      <div>
        <StatusBadge label="Tudo certo" color={LK.success} />
      </div>

      <FriendlyCard
        icon="signal_cellular_alt"
        iconColor={LK.success}
        title="Potência do sinal"
        desc="Sinal forte chegando até o modem"
        badge="Excelente"
        badgeColor={LK.success}
      />
      <FriendlyCard
        icon="signal_cellular_alt"
        iconColor={LK.accent}
        title="Ruído na linha"
        desc="Pouca interferência detectada"
        badge="Baixo"
        badgeColor={LK.success}
      />
      <FriendlyCard
        icon="check_circle"
        iconColor={LK.success}
        title="Conexão"
        desc="Ativa e sem quedas"
        badge="Estável"
        badgeColor={LK.success}
      />

      {/* Detalhes técnicos — colapsável */}
      <div style={{ background: LK.bgSecondary, borderRadius: LK.rCard, overflow: 'hidden' }}>
        <button
          onClick={() => setDetalhes((v) => !v)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            border: 0,
            background: 'none',
            cursor: 'pointer',
            padding: '12px 16px',
          }}
        >
          <Icon name="info" size={16} color={LK.textSecondary} />
          <span style={{ flex: 1, font: `600 12px/1 ${LK.font}`, color: LK.textSecondary, textAlign: 'left' }}>
            Detalhes técnicos
          </span>
          <Icon name={detalhes ? 'expand_less' : 'expand_more'} size={18} color={LK.textSecondary} />
        </button>
        {detalhes && (
          <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(
              [
                ['Potência RX', '−18.4 dBm'],
                ['Potência TX', '2.1 dBm'],
                ['Temperatura', '42.3 °C'],
                ['Tensão do laser', '3.30 V'],
                ['Corrente do laser', '11.2 mA'],
                ['Número de série', 'HWTC12345678'],
                ['Modo de conexão', 'GPON'],
              ] as const
            ).map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ font: `400 12px/1.4 ${LK.font}`, color: LK.textSecondary }}>{l}</span>
                <span style={{ font: `600 12px/1.4 ${LK.font}`, color: LK.textPrimary }}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FibraErro() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 32px', textAlign: 'center' }}>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: hexA(LK.warning, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="error_outline" size={36} color={LK.warning} />
        </div>
        <div style={{ font: `600 17px/1.3 ${LK.font}`, color: LK.textPrimary, marginTop: 20 }}>
          Não consegui acessar o modem
        </div>
        <div style={{ font: `400 13px/1.5 ${LK.font}`, color: LK.textSecondary, marginTop: 8 }}>
          Verifique o IP, o usuário e a senha nas configurações do modem.
        </div>
        <button
          style={{
            width: '100%',
            marginTop: 28,
            border: 0,
            cursor: 'pointer',
            background: LK.accent,
            color: '#fff',
            font: `600 14px/1 ${LK.font}`,
            borderRadius: LK.rBtn,
            padding: '14px',
          }}
        >
          Tentar novamente
        </button>
        <button
          style={{
            width: '100%',
            marginTop: 10,
            cursor: 'pointer',
            background: 'transparent',
            color: LK.textPrimary,
            font: `500 14px/1 ${LK.font}`,
            border: `1px solid ${LK.border}`,
            borderRadius: LK.rBtn,
            padding: '14px',
          }}
        >
          Revisar configurações
        </button>
      </div>
    </div>
  );
}
