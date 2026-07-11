import React, { useState } from 'react';
import { LK } from '../tokens.js';
import { hexA } from '../utils.js';
import { Icon } from '../primitives/Icon.js';
import { Badge } from '../primitives/Badge.js';
import { Overline } from '../layout/Overline.js';

export interface DispositivosScreenProps {
  style?: React.CSSProperties;
}

/** Dispositivos overlay: grouped device list (gateway, AP/mesh, clients) with empty and error states. */
export function DispositivosScreen({ style }: DispositivosScreenProps) {
  const [view, setView] = useState<'lista' | 'vazio' | 'erro'>('lista');

  const views = [
    ['lista', 'Lista'],
    ['vazio', 'Vazio'],
    ['erro', 'Erro'],
  ] as const;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: LK.bgPrimary, overflow: 'hidden', ...style }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 8px 14px 8px',
          borderBottom: `1px solid ${LK.border}`,
          flex: 'none',
        }}
      >
        <button style={{ background: 'none', border: 0, cursor: 'pointer', padding: 8 }}>
          <Icon name="arrow_back" size={22} color={LK.textPrimary} />
        </button>
        <Icon name="devices" size={18} color={LK.textPrimary} />
        <span style={{ flex: 1, font: `500 17px/1 ${LK.font}`, color: LK.textPrimary }}>Dispositivos na rede</span>
        <button style={{ background: 'none', border: 0, cursor: 'pointer', padding: 8 }}>
          <Icon name="refresh" size={20} color={LK.textPrimary} />
        </button>
      </div>

      {/* Prototype state switcher — not part of the real app UI */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 16px 0' }}>
        {views.map(([id, lbl]) => {
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

      {view === 'lista' && <DispositivosLista />}
      {view === 'vazio' && (
        <EmptyOrError
          icon="devices_other"
          iconColor={LK.textTertiary}
          title="Nenhum dispositivo encontrado"
          subtitle="Aguarde alguns segundos e tente novamente."
          actionLabel="Escanear Rede"
        />
      )}
      {view === 'erro' && (
        <EmptyOrError
          icon="warning_amber"
          iconColor={LK.warning}
          title="Sem conexão Wi-Fi"
          subtitle="Conecte-se a uma rede Wi-Fi para escanear dispositivos."
          actionLabel="Escanear Rede"
        />
      )}
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <Overline style={{ padding: '20px 16px 8px' }}>{title}</Overline>
  );
}

function DeviceRow({
  icon,
  iconColor,
  iconBg,
  title,
  subtitle,
  trailing,
  badge,
}: {
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  trailing?: string;
  badge?: { label: string; color: string };
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '13px 16px',
        borderBottom: `1px solid ${LK.border}`,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 'none',
        }}
      >
        <Icon name={icon} size={20} color={iconColor} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: `500 15px/1.2 ${LK.font}`, color: LK.textPrimary }}>{title}</div>
        <div
          style={{
            font: `400 11px/1.3 ${LK.font}`,
            color: LK.textSecondary,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {subtitle}
        </div>
      </div>
      {badge && (
        <Badge color={badge.color} bg={hexA(badge.color, 0.1)} style={{ fontWeight: 700 }}>
          {badge.label}
        </Badge>
      )}
      {trailing && (
        <span style={{ font: `400 11px/1 ${LK.font}`, color: LK.textTertiary, marginLeft: 6 }}>{trailing}</span>
      )}
      <Icon name="keyboard_arrow_right" size={16} color={LK.textTertiary} style={{ marginLeft: 4 }} />
    </div>
  );
}

function DispositivosLista() {
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <SectionHeader title="Infraestrutura (1)" />
      <DeviceRow
        icon="router"
        iconColor={LK.accent}
        iconBg={hexA(LK.accent, 0.12)}
        title="Roteador da casa"
        subtitle="192.168.1.1 · 2,4GHz + 5GHz · 6 clientes"
        badge={{ label: 'Roteador', color: LK.accent }}
      />

      <SectionHeader title="Pontos de acesso (1)" />
      <DeviceRow
        icon="cell_tower"
        iconColor={LK.success}
        iconBg={hexA(LK.success, 0.12)}
        title="Nó do quarto"
        subtitle="192.168.1.5"
        badge={{ label: 'AP Mesh', color: LK.success }}
      />

      <SectionHeader title="Dispositivos (6)" />
      <DeviceRow
        icon="smartphone"
        iconColor={LK.accent}
        iconBg={hexA(LK.accent, 0.12)}
        title="iPhone de Luiz"
        subtitle="192.168.1.42 · Este aparelho"
        trailing="192.168.1.42"
      />
      <DeviceRow
        icon="laptop"
        iconColor={LK.success}
        iconBg={hexA(LK.success, 0.12)}
        title="Notebook Dell"
        subtitle="Dell Inc."
        trailing="192.168.1.18"
      />
      <DeviceRow
        icon="smartphone"
        iconColor={LK.accent}
        iconBg={hexA(LK.accent, 0.12)}
        title="Galaxy S23"
        subtitle="Samsung"
        trailing="192.168.1.23"
      />
      <DeviceRow
        icon="devices_other"
        iconColor={LK.warning}
        iconBg={hexA(LK.warning, 0.12)}
        title="Smart TV Samsung"
        subtitle="Samsung"
        trailing="192.168.1.31"
      />
      <DeviceRow
        icon="print"
        iconColor={LK.textSecondary}
        iconBg={LK.bgSecondary}
        title="Impressora HP"
        subtitle="HP Inc."
        trailing="192.168.1.55"
      />
      <DeviceRow
        icon="devices_other"
        iconColor={LK.textSecondary}
        iconBg={LK.bgSecondary}
        title="192.168.1.67"
        subtitle="Fabricante desconhecido"
        trailing="192.168.1.67"
      />
    </div>
  );
}

function EmptyOrError({
  icon,
  iconColor,
  title,
  subtitle,
  actionLabel,
}: {
  icon: string;
  iconColor: string;
  title: string;
  subtitle: string;
  actionLabel: string;
}) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 32px', textAlign: 'center' }}>
        <Icon name={icon} size={48} color={iconColor} />
        <div style={{ font: `600 18px/1.3 ${LK.font}`, color: LK.textPrimary, marginTop: 16 }}>{title}</div>
        <div style={{ font: `400 13px/1.4 ${LK.font}`, color: LK.textSecondary, marginTop: 8 }}>{subtitle}</div>
        <button
          style={{
            marginTop: 24,
            border: 0,
            cursor: 'pointer',
            background: LK.accent,
            color: '#fff',
            font: `600 14px/1 ${LK.font}`,
            borderRadius: LK.rBtn,
            padding: '12px 20px',
          }}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
