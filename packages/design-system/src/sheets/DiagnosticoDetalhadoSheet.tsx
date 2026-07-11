import React, { useState } from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { LK } from '../tokens.js';
import { hexA } from '../utils.js';
import { Icon } from '../primitives/Icon.js';
import { SheetInfoRow } from './_shared.js';

export interface DiagnosticoDetalhadoSheetProps {
  style?: React.CSSProperties;
}

type Veredito = 'good' | 'acceptable' | 'poor';

const impacto: { label: string; icon: string; veredito: Veredito }[] = [
  { label: 'Streaming', icon: 'tv', veredito: 'good' },
  { label: 'Gaming', icon: 'sports_esports', veredito: 'acceptable' },
  { label: 'Vídeo Chamada', icon: 'videocam', veredito: 'good' },
];

const veredictoColor: Record<Veredito, string> = {
  good: LK.success,
  acceptable: LK.warning,
  poor: LK.error,
};
const veredictoLabel: Record<Veredito, string> = {
  good: 'Boa',
  acceptable: 'Aceitável',
  poor: 'Ruim',
};

/**
 * "Diagnóstico detalhado" sheet — GH#536. Não é chat livre: leitura objetiva do
 * diagnóstico já calculado (causa provável, impacto prático, recomendações,
 * orientação por tipo de rede). Aberto pelo CTA "Ver recomendações para melhorar"
 * em ResultadoVelocidadeScreen. Mirrors `DiagnosticoDetalhadoSheet` (Kotlin).
 */
export function DiagnosticoDetalhadoSheet({ style }: DiagnosticoDetalhadoSheetProps) {
  const [detalhesAbertos, setDetalhesAbertos] = useState(false);
  const [feedback, setFeedback] = useState<'util' | 'nao_util' | null>(null);

  return (
    <SheetFrame style={style}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <Icon name="auto_awesome" size={24} color={LK.accent} />
        <div>
          <div style={{ font: `700 20px/1.3 ${LK.font}`, color: LK.textPrimary }}>Diagnóstico detalhado</div>
          <div style={{ font: `400 12px/1.3 ${LK.font}`, color: LK.textTertiary }}>
            Leitura objetiva do resultado — sem conversa livre
          </div>
        </div>
      </div>

      <Overline text="CAUSA PROVÁVEL" />
      <div style={{ font: `600 18px/1.3 ${LK.font}`, color: LK.textPrimary, margin: '8px 0 4px' }}>
        Roteador sobrecarregado no horário de pico
      </div>
      <div style={{ font: `400 14px/1.5 ${LK.font}`, color: LK.textSecondary, marginBottom: 24 }}>
        A latência sob carga subiu de 12 ms para 187 ms durante o teste — sinal de bufferbloat, comum quando muitos
        dispositivos disputam a mesma conexão ao mesmo tempo.
      </div>

      <Overline text="IMPACTO PRÁTICO" />
      <div style={{ display: 'flex', gap: 8, marginTop: 8, marginBottom: 24 }}>
        {impacto.map((i) => {
          const cor = veredictoColor[i.veredito];
          return (
            <div
              key={i.label}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                borderRadius: LK.rCard,
                background: hexA(cor, 0.12),
                padding: '10px 6px',
              }}
            >
              <Icon name={i.icon} size={16} color={cor} />
              <span style={{ font: `600 11px/1 ${LK.font}`, color: cor }}>{veredictoLabel[i.veredito]}</span>
            </div>
          );
        })}
      </div>

      <Overline text="RECOMENDAÇÕES" />
      <div
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
          background: LK.bgSecondary,
          borderRadius: LK.rCard,
          padding: 16,
          marginTop: 8,
          marginBottom: 12,
        }}
      >
        <Icon name="info" size={18} color={LK.accent} />
        <span style={{ font: `600 14px/1.4 ${LK.font}`, color: LK.textSecondary }}>
          Reinicie o roteador e evite fazer download pesado ao mesmo tempo em outro dispositivo — ambos disputam a
          mesma banda.
        </span>
      </div>

      <div style={{ background: LK.bgSecondary, borderRadius: LK.rCard, padding: 16, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <Icon name="auto_awesome" size={18} color={LK.accent} />
          <div style={{ flex: 1 }}>
            <div style={{ font: `600 11px/1 ${LK.font}`, color: LK.textTertiary, letterSpacing: '.4px', marginBottom: 4 }}>
              CONFIGURAÇÃO
            </div>
            <div style={{ font: `600 14px/1.3 ${LK.font}`, color: LK.textPrimary }}>Ative o QoS do roteador</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <FeedbackButton
            icon="thumb_up"
            active={feedback === 'util'}
            onClick={() => setFeedback('util')}
            label="Útil"
          />
          <FeedbackButton
            icon="thumb_down"
            active={feedback === 'nao_util'}
            onClick={() => setFeedback('nao_util')}
            label="Não útil"
          />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          border: `1px solid ${LK.border}`,
          borderRadius: LK.rCard,
          padding: 16,
          marginBottom: 8,
        }}
      >
        <Icon name="support_agent" size={20} color={LK.textSecondary} />
        <div style={{ flex: 1 }}>
          <div style={{ font: `600 14px/1.3 ${LK.font}`, color: LK.textPrimary }}>Vivo Fibra</div>
          <div style={{ font: `400 12px/1.3 ${LK.font}`, color: LK.textSecondary }}>Atendimento oficial disponível</div>
        </div>
      </div>
      <button
        style={{
          width: '100%',
          background: 'none',
          border: 0,
          cursor: 'pointer',
          padding: '10px 0',
          font: `500 14px/1 ${LK.font}`,
          color: LK.textSecondary,
          marginBottom: 24,
        }}
      >
        Falar com a operadora
      </button>

      <div style={{ borderRadius: LK.rCard, background: LK.bgSecondary, overflow: 'hidden' }}>
        <button
          onClick={() => setDetalhesAbertos((v) => !v)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'none',
            border: 0,
            cursor: 'pointer',
            padding: 16,
            font: `600 14px/1 ${LK.font}`,
            color: LK.textSecondary,
          }}
        >
          Detalhes técnicos
          <Icon
            name="expand_more"
            size={20}
            color={LK.textTertiary}
            style={{ transform: detalhesAbertos ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
          />
        </button>
        {detalhesAbertos && (
          <div style={{ padding: '0 16px 16px' }}>
            <div style={{ height: 1, background: LK.border, marginBottom: 12 }} />
            <Overline text="ORIENTAÇÃO POR TIPO DE REDE" />
            <div style={{ font: `400 13px/1.4 ${LK.font}`, color: LK.textSecondary, marginTop: 4, marginBottom: 12 }}>
              Conexão via Wi-Fi. Se o resultado ficou abaixo do esperado, teste perto do roteador ou com um cabo de
              rede pra isolar se o problema é do Wi-Fi ou da internet contratada.
            </div>
            <div style={{ height: 1, background: LK.border, marginBottom: 12 }} />
            <SheetInfoRow label="Bufferbloat" value="187 ms" />
            <SheetInfoRow label="Pico Download" value="94.2 Mbps" />
            <SheetInfoRow label="Pico Upload" value="38.6 Mbps" />
            <SheetInfoRow label="Latência c/ carga ↓" value="142 ms" />
            <SheetInfoRow label="Latência c/ carga ↑" value="98 ms" />
            <SheetInfoRow label="Estabilidade" value="81%" />
            <SheetInfoRow label="DNS (Google)" value="14 ms" />
            <SheetInfoRow label="Servidor" value="São Paulo, BR" />
          </div>
        )}
      </div>
    </SheetFrame>
  );
}

function Overline({ text }: { text: string }) {
  return (
    <div style={{ font: `600 11px/1.3 ${LK.font}`, color: LK.textTertiary, letterSpacing: '.5px' }}>{text}</div>
  );
}

function FeedbackButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        border: `1px solid ${active ? LK.accent : LK.border}`,
        borderRadius: LK.rPill,
        background: active ? hexA(LK.accent, 0.1) : 'transparent',
        cursor: 'pointer',
        padding: '6px 12px',
        font: `500 12px/1 ${LK.font}`,
        color: active ? LK.accent : LK.textSecondary,
      }}
    >
      <Icon name={icon} size={14} color={active ? LK.accent : LK.textSecondary} />
      {label}
    </button>
  );
}
