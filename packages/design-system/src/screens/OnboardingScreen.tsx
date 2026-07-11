import React, { useState } from 'react';
import { LK } from '../tokens.js';
import { hexA } from '../utils.js';
import { Icon } from '../primitives/Icon.js';

export interface OnboardingScreenProps {
  style?: React.CSSProperties;
}

const TOTAL_SLIDES = 3;

/** Onboarding overlay: 3 slides (boas-vindas, privacidade + termos, permissões) with button-only navigation. */
export function OnboardingScreen({ style }: OnboardingScreenProps) {
  const [pagina, setPagina] = useState(0);
  const [termosAceitos, setTermosAceitos] = useState(false);

  const podeAvancar = pagina !== 1 || termosAceitos;

  const titulo = [
    'Sua internet explicada em português',
    'Seus dados ficam no seu celular',
    'Algumas análises precisam de permissão do Android',
  ][pagina];

  const descricao = [
    'Não só os números — o SignallQ analisa sua conexão e te diz o que está acontecendo e o que fazer.',
    'Medimos sua rede, não rastreamos você. Tudo fica salvo localmente — nenhum dado pessoal sai do seu dispositivo.',
    'Você pode pular e permitir depois. O app continua útil mesmo sem estas permissões.',
  ][pagina];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: LK.bgPrimary, position: 'relative', overflow: 'hidden', ...style }}>
      {pagina === 0 && (
        <button
          onClick={() => setPagina(2)}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'none',
            border: 0,
            cursor: 'pointer',
            padding: '8px 12px',
            font: `500 14px/1 ${LK.font}`,
            color: LK.textSecondary,
            zIndex: 1,
          }}
        >
          Pular
        </button>
      )}

      {/* Ilustração */}
      <div style={{ flex: '0 0 32%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {pagina === 0 && <Slide0Visual />}
        {pagina === 1 && <Slide1Visual />}
        {pagina === 2 && <Slide2Visual />}
      </div>

      {/* Texto */}
      <div style={{ flex: '0 0 auto', padding: '0 28px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ font: `700 20px/1.3 ${LK.font}`, color: LK.textPrimary }}>{titulo}</div>
        <div style={{ font: `400 14px/1.5 ${LK.font}`, color: LK.textSecondary, marginTop: 10 }}>{descricao}</div>

        {pagina === 1 && (
          <div
            onClick={() => setTermosAceitos((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              marginTop: 20,
              background: LK.bgCard,
              border: `1px solid ${LK.border}`,
              borderRadius: LK.rCard,
              padding: '10px 14px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                border: `2px solid ${termosAceitos ? LK.accent : LK.border}`,
                background: termosAceitos ? LK.accent : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
              }}
            >
              {termosAceitos && <Icon name="check" size={14} color="#fff" />}
            </div>
            <span style={{ font: `400 13px/1.4 ${LK.font}`, color: LK.textPrimary }}>
              Li e aceito os Termos de Uso e a Política de Privacidade
            </span>
          </div>
        )}

        {pagina === 2 && (
          <div style={{ width: '100%', marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <PermissaoCard
              icon="location_on"
              titulo="Localização aproximada / Wi-Fi"
              descricao="Para identificar redes Wi-Fi ao redor e analisar canais"
              labelBotao="Permitir análise de Wi-Fi"
            />
            <PermissaoCard
              icon="near_me"
              titulo="Dispositivos próximos"
              descricao="Para detectar dispositivos na rede local (opcional)"
              labelBotao="Permitir"
            />
          </div>
        )}
      </div>

      <div style={{ flex: 1 }} />

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, padding: '8px 0' }}>
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <span
            key={i}
            style={{
              width: 22,
              height: 10,
              borderRadius: 999,
              background: i === pagina ? LK.accent : hexA(LK.textSecondary, 0.35),
              transform: i === pagina ? 'scaleX(1)' : 'scaleX(0.36)',
              transformOrigin: 'left center',
              transition: 'transform .2s, background .2s',
            }}
          />
        ))}
      </div>

      {/* Botões */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 28px 28px' }}>
        {pagina > 0 ? (
          <button
            onClick={() => setPagina((p) => p - 1)}
            style={{
              background: 'transparent',
              border: `1px solid ${LK.border}`,
              borderRadius: LK.rBtn,
              cursor: 'pointer',
              padding: '12px 20px',
              font: `500 14px/1 ${LK.font}`,
              color: LK.textPrimary,
            }}
          >
            ← Anterior
          </button>
        ) : (
          <div />
        )}

        {pagina === TOTAL_SLIDES - 1 ? (
          <button
            style={{
              background: LK.accent,
              border: 0,
              borderRadius: LK.rBtn,
              cursor: 'pointer',
              padding: '12px 22px',
              font: `600 14px/1 ${LK.font}`,
              color: '#fff',
            }}
          >
            Começar →
          </button>
        ) : (
          <button
            onClick={() => podeAvancar && setPagina((p) => p + 1)}
            disabled={!podeAvancar}
            style={{
              background: LK.bgSecondary,
              border: 0,
              borderRadius: LK.rBtn,
              cursor: podeAvancar ? 'pointer' : 'not-allowed',
              padding: '12px 22px',
              font: `600 14px/1 ${LK.font}`,
              color: podeAvancar ? LK.textPrimary : LK.textTertiary,
              opacity: podeAvancar ? 1 : 0.6,
            }}
          >
            Próximo →
          </button>
        )}
      </div>
    </div>
  );
}

function PermissaoCard({
  icon,
  titulo,
  descricao,
  labelBotao,
}: {
  icon: string;
  titulo: string;
  descricao: string;
  labelBotao: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: LK.bgCard,
        border: `1px solid ${LK.border}`,
        borderRadius: LK.rCard,
        padding: '10px 14px',
      }}
    >
      <Icon name={icon} size={24} color={LK.accent} />
      <div style={{ flex: 1, textAlign: 'left' }}>
        <div style={{ font: `600 13px/1.3 ${LK.font}`, color: LK.textPrimary }}>{titulo}</div>
        <div style={{ font: `400 11px/1.3 ${LK.font}`, color: LK.textSecondary }}>{descricao}</div>
      </div>
      <button
        style={{
          flex: 'none',
          background: LK.bgSecondary,
          border: 0,
          borderRadius: 999,
          cursor: 'pointer',
          padding: '7px 12px',
          font: `600 11px/1 ${LK.font}`,
          color: LK.textPrimary,
        }}
      >
        {labelBotao}
      </button>
    </div>
  );
}

function Slide0Visual() {
  return (
    <div style={{ position: 'relative', width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="160" height="160" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
        <circle cx="80" cy="80" r="72" fill="none" stroke={hexA(LK.success, 0.15)} strokeWidth="6" />
        <circle cx="80" cy="80" r="72" fill="none" stroke={LK.success} strokeWidth="6" strokeLinecap="round" strokeDasharray={452} strokeDashoffset={0} />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span style={{ font: `700 34px/1 ${LK.font}`, color: LK.success }}>147</span>
        <span style={{ font: `400 12px/1 ${LK.font}`, color: hexA(LK.success, 0.7), marginTop: 4 }}>Mbps</span>
        <span
          style={{
            marginTop: 6,
            font: `600 11px/1 ${LK.font}`,
            color: LK.success,
            background: hexA(LK.success, 0.12),
            borderRadius: 999,
            padding: '4px 10px',
          }}
        >
          Download
        </span>
      </div>
    </div>
  );
}

function Slide1Visual() {
  return (
    <div
      style={{
        width: '75%',
        background: LK.bgCard,
        border: `1px solid ${LK.border}`,
        borderRadius: LK.rCard,
        padding: 14,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Icon name="smartphone" size={16} color={LK.accent} />
        <span style={{ font: `600 13px/1 ${LK.font}`, color: LK.textPrimary, marginLeft: 6, flex: 1 }}>
          Este dispositivo
        </span>
        <span
          style={{
            font: `500 11px/1 ${LK.font}`,
            color: LK.accent,
            background: hexA(LK.accent, 0.1),
            borderRadius: 999,
            padding: '3px 8px',
          }}
        >
          Local
        </span>
      </div>
      <div style={{ height: 1, background: LK.border, margin: '10px 0' }} />
      <Row label="IP local" value="192.168.•.•" />
      <div style={{ height: 6 }} />
      <Row label="DNS" value="Cloudflare" />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex' }}>
      <span style={{ flex: 1, font: `400 12px/1 ${LK.font}`, color: LK.textSecondary }}>{label}</span>
      <span style={{ font: `600 12px/1 ${LK.font}`, color: LK.textPrimary }}>{value}</span>
    </div>
  );
}

function Slide2Visual() {
  const rows = [
    ['check_circle', LK.success, 'Streaming HD', 'Ótimo'],
    ['error_outline', LK.warning, 'Jogos online', 'Atenção'],
    ['error_outline', LK.error, 'Videochamada', 'Instável'],
  ] as const;
  return (
    <div
      style={{
        width: '78%',
        background: LK.bgCard,
        border: `1px solid ${LK.border}`,
        borderRadius: LK.rCard,
        padding: '4px 14px',
      }}
    >
      {rows.map(([icon, color, label, verdict], i) => (
        <React.Fragment key={label}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '8px 0' }}>
            <Icon name={icon} size={18} color={color} />
            <span style={{ flex: 1, font: `500 13px/1 ${LK.font}`, color: LK.textPrimary, marginLeft: 10 }}>{label}</span>
            <span style={{ font: `400 11px/1 ${LK.font}`, color }}>{verdict}</span>
          </div>
          {i < rows.length - 1 && <div style={{ height: 1, background: LK.border }} />}
        </React.Fragment>
      ))}
    </div>
  );
}
