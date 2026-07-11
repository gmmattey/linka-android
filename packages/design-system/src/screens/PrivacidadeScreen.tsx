import React from 'react';
import { LK } from '../tokens.js';
import { hexA } from '../utils.js';
import { Icon } from '../primitives/Icon.js';

export interface PrivacidadeScreenProps {
  style?: React.CSSProperties;
}

/** Privacidade overlay: local-processing hero + collected-data / permissions / sharing sections. */
export function PrivacidadeScreen({ style }: PrivacidadeScreenProps) {
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
        <span style={{ flex: 1, font: `600 16px/1 ${LK.font}`, color: LK.textPrimary }}>Privacidade</span>
        <div style={{ width: 22 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Hero */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '24px 24px 32px',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: hexA(LK.success, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="shield" size={28} color={LK.success} />
          </div>
          <div style={{ font: `600 17px/1.3 ${LK.font}`, color: LK.textPrimary, marginTop: 16 }}>
            Tudo é processado localmente
          </div>
          <div style={{ font: `400 13px/1.5 ${LK.font}`, color: LK.textSecondary, marginTop: 8, padding: '0 12px' }}>
            O SignallQ roda inteiramente no seu aparelho. Resultados são salvos localmente. Nada vai para servidores
            externos sem você acionar.
          </div>
        </div>

        <PrivacidadeSection
          titulo="Dados que coletamos"
          descricao="Speedtest, scans Wi-Fi e diagnósticos. Tudo fica salvo localmente no aparelho."
        />
        <PrivacidadeSection
          titulo="Permissões usadas"
          descricao="Localização (para listar redes Wi-Fi), Telefonia (4G/5G), notificações (alertas)."
        />
        <PrivacidadeSection
          titulo="Compartilhamento opcional"
          descricao='Apenas se você acionar "Compartilhar resultado" ou "Diagnóstico IA".'
        />

        <div style={{ padding: '8px 16px 24px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              borderRadius: LK.rCard,
              cursor: 'pointer',
            }}
          >
            <Icon name="delete" size={20} color={LK.accent} />
            <div style={{ flex: 1 }}>
              <div style={{ font: `600 14px/1.2 ${LK.font}`, color: LK.textPrimary }}>Gerenciar dados e privacidade</div>
              <div style={{ font: `400 12px/1.3 ${LK.font}`, color: LK.textTertiary, marginTop: 2 }}>
                Limpar histórico, apagar dados locais ou resetar o app
              </div>
            </div>
            <Icon name="arrow_forward_ios" size={14} color={LK.textTertiary} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PrivacidadeSection({ titulo, descricao }: { titulo: string; descricao: string }) {
  return (
    <div style={{ padding: '14px 16px' }}>
      <div style={{ font: `600 14px/1.2 ${LK.font}`, color: LK.textPrimary }}>{titulo}</div>
      <div style={{ font: `400 13px/1.5 ${LK.font}`, color: LK.textSecondary, marginTop: 4 }}>{descricao}</div>
    </div>
  );
}
