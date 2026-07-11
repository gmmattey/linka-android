import React from 'react';
import { LK } from '../tokens.js';
import { hexA } from '../utils.js';
import { Icon } from '../primitives/Icon.js';
import { Overline } from '../layout/Overline.js';

export interface LaudoScreenProps {
  style?: React.CSSProperties;
}

/** Diagnostic report overlay: severity banner, header, summary, 3x2 metric grid, recommendation, PDF share. */
export function LaudoScreen({ style }: LaudoScreenProps) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: LK.bgPrimary, overflow: 'hidden', ...style }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '14px 8px',
          borderBottom: `1px solid ${LK.border}`,
          flex: 'none',
        }}
      >
        <button style={{ background: 'none', border: 0, cursor: 'pointer', padding: 8 }}>
          <Icon name="arrow_back" size={22} color={LK.textPrimary} />
        </button>
        <span style={{ flex: 1, font: `600 16px/1 ${LK.font}`, color: LK.textPrimary }}>Laudo de diagnóstico</span>
        <button style={{ background: 'none', border: 0, cursor: 'pointer', padding: 8 }}>
          <Icon name="share" size={20} color={LK.textPrimary} />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Severity banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: hexA(LK.success, 0.12),
            borderRadius: LK.rCard,
            padding: '14px 16px',
          }}
        >
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: LK.success, display: 'block' }} />
            <div>
              <div style={{ font: `600 11px/1 ${LK.font}`, color: LK.success, letterSpacing: '.3px' }}>
                Conexão saudável
              </div>
              <div style={{ font: `600 14px/1.2 ${LK.font}`, color: LK.success, marginTop: 3 }}>
                Sua internet está pronta para tudo
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ font: `700 26px/1 ${LK.font}`, color: LK.success }}>94</div>
            <div style={{ font: `600 10px/1 ${LK.font}`, color: LK.success, marginTop: 3 }}>Excelente</div>
          </div>
        </div>

        {/* Header */}
        <div>
          <div style={{ font: `600 11px/1 ${LK.font}`, color: LK.textTertiary, letterSpacing: '.3px' }}>
            LAUDO TÉCNICO · 11/07/2026 09:24
          </div>
          <div style={{ font: `700 17px/1.3 ${LK.font}`, color: LK.textPrimary, marginTop: 6 }}>Luiz · Claro 500 Mbps</div>
          <div style={{ font: `400 12px/1 ${LK.font}`, color: LK.textTertiary, marginTop: 3 }}>
            SSID Luiz-5G · 192.168.1.*
          </div>
        </div>

        {/* RESUMO */}
        <Section title="Resumo">
          <div style={{ font: `400 13px/1.5 ${LK.font}`, color: LK.textSecondary }}>
            Sua internet está rápida e estável. Download e upload acima do contratado, latência baixa e sem perda de
            pacotes — pronta para streaming, jogos e videochamadas.
          </div>
        </Section>

        {/* MÉTRICAS */}
        <Section title="Métricas">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Metrica label="Download" valor="486.3" unidade="Mbps" />
            <Metrica label="Upload" valor="211.7" unidade="Mbps" />
            <Metrica label="Latência" valor="12" unidade="ms" />
            <Metrica label="Jitter" valor="24" unidade="ms" />
            <Metrica label="Perda" valor="0.0" unidade="%" />
            <Metrica label="Bufferbloat" valor="8" unidade="ms" />
          </div>
        </Section>

        {/* RECOMENDAÇÃO */}
        <Section title="Recomendação">
          <div style={{ font: `400 13px/1.5 ${LK.font}`, color: LK.textSecondary }}>
            Nenhuma ação necessária. Se quiser reduzir ainda mais a oscilação, troque o canal do Wi-Fi 5GHz para o
            canal 44, que está livre.
          </div>
        </Section>

        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            width: '100%',
            border: 0,
            cursor: 'pointer',
            background: LK.accent,
            color: '#fff',
            font: `600 14px/1 ${LK.font}`,
            borderRadius: LK.rBtn,
            padding: '14px',
          }}
        >
          <Icon name="share" size={18} color="#fff" />
          Compartilhar laudo em PDF
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: LK.bgCard, border: `1px solid ${LK.border}`, borderRadius: LK.rCard, padding: 16 }}>
      <Overline style={{ marginBottom: 8 }}>{title}</Overline>
      {children}
    </div>
  );
}

function Metrica({ label, valor, unidade }: { label: string; valor: string; unidade: string }) {
  return (
    <div>
      <div style={{ font: `400 11px/1 ${LK.font}`, color: LK.textTertiary }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 3 }}>
        <span style={{ font: `700 20px/1 ${LK.font}`, color: LK.textPrimary }}>{valor}</span>
        <span style={{ font: `400 11px/1 ${LK.font}`, color: LK.textSecondary }}>{unidade}</span>
      </div>
    </div>
  );
}
