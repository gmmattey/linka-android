import React from 'react';
import { LK } from '../tokens.js';
import { hexA } from '../utils.js';
import { Icon } from '../primitives/Icon.js';

export interface NovidadesScreenProps {
  style?: React.CSSProperties;
}

interface Novidade {
  tipo: 'novo' | 'melhoria' | 'correcao';
  titulo: string;
  descricao: string;
}

const itens: Novidade[] = [
  {
    tipo: 'novo',
    titulo: 'Laudo de diagnóstico em PDF',
    descricao: 'Compartilhe um laudo técnico completo da sua conexão — útil para reclamações formais.',
  },
  {
    tipo: 'novo',
    titulo: 'Comparativo de DNS',
    descricao: 'Veja qual servidor DNS responde mais rápido na sua rede e como trocar.',
  },
  {
    tipo: 'melhoria',
    titulo: 'Detecção de dispositivos mais precisa',
    descricao: 'Identificamos melhor o fabricante e o tipo de cada aparelho conectado à sua rede.',
  },
  {
    tipo: 'melhoria',
    titulo: 'Diagnóstico de fibra mais claro',
    descricao: 'Potência do sinal e ruído da linha agora aparecem em linguagem simples, sem jargão técnico.',
  },
  {
    tipo: 'correcao',
    titulo: 'Correção no teste de velocidade em redes 5G',
    descricao: 'Resolvido um problema que subestimava o download em conexões móveis rápidas.',
  },
];

const badgeInfo: Record<Novidade['tipo'], { label: string; color: string }> = {
  novo: { label: 'NOVO', color: LK.success },
  melhoria: { label: 'MELHORIA', color: LK.accent },
  correcao: { label: 'CORREÇÃO', color: LK.error },
};

/** Novidades overlay: app changelog list with color-coded type badges. */
export function NovidadesScreen({ style }: NovidadesScreenProps) {
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
          <div style={{ font: `600 16px/1.2 ${LK.font}`, color: LK.textPrimary }}>Novidades</div>
          <div style={{ font: `400 11px/1 ${LK.font}`, color: LK.textTertiary }}>v0.23.0</div>
        </div>
        <div style={{ width: 38 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {itens.map((item, i) => {
          const badge = badgeInfo[item.tipo];
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                padding: '14px 16px',
                borderBottom: `1px solid ${LK.border}`,
              }}
            >
              <span
                style={{
                  flex: 'none',
                  marginTop: 2,
                  font: `700 10px/1 ${LK.font}`,
                  color: badge.color,
                  background: hexA(badge.color, 0.12),
                  borderRadius: 4,
                  padding: '4px 8px',
                }}
              >
                {badge.label}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ font: `600 14px/1.3 ${LK.font}`, color: LK.textPrimary }}>{item.titulo}</div>
                <div style={{ font: `400 12px/1.5 ${LK.font}`, color: LK.textSecondary, marginTop: 2 }}>
                  {item.descricao}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
