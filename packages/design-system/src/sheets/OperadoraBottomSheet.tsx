import React from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { LK } from '../tokens.js';
import { hexA } from '../utils.js';
import { Icon } from '../primitives/Icon.js';

export interface OperadoraBottomSheetProps {
  style?: React.CSSProperties;
}

const outrasNacionais = ['Claro NET', 'TIM Live', 'Oi Fibra'];
const outrasRegionais = ['Brisanet', 'Desktop', 'Unifique'];

/**
 * "Falar com a operadora" sheet — acionado a partir do card de contato no
 * DiagnosticoDetalhadoSheet. Detecta a operadora (fixa ou móvel) e mostra os
 * canais de atendimento oficiais; lista as demais pra escolha manual. Mirrors
 * `OperadoraBottomSheet.kt` (`ui/component/`).
 */
export function OperadoraBottomSheet({ style }: OperadoraBottomSheetProps) {
  return (
    <SheetFrame style={style}>
      <div style={{ font: `700 20px/1.3 ${LK.font}`, color: LK.textPrimary }}>Falar com a operadora</div>
      <div style={{ font: `400 13px/1.4 ${LK.font}`, color: LK.textSecondary, marginTop: 6, marginBottom: 20 }}>
        Detectamos sua operadora pela rede fixa. Atendimento oficial.
      </div>
      <div style={{ height: 1, background: LK.border, marginBottom: 20 }} />

      <Overline text="SUA OPERADORA" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, marginBottom: 16 }}>
        <OperadoraBadge nome="Vivo Fibra" size={40} />
        <div>
          <div style={{ font: `600 16px/1.3 ${LK.font}`, color: LK.textPrimary }}>Vivo Fibra</div>
          <div style={{ font: `400 13px/1.3 ${LK.font}`, color: LK.textSecondary }}>rede fixa</div>
        </div>
      </div>

      <button
        style={{
          width: '100%',
          border: 0,
          cursor: 'pointer',
          borderRadius: LK.rBtn,
          background: '#25D366',
          color: '#fff',
          font: `700 15px/1 ${LK.font}`,
          padding: '14px 0',
          marginBottom: 8,
        }}
      >
        Falar no WhatsApp
      </button>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <OutlineActionButton icon="call" label="Ligar *8486" />
        <OutlineActionButton icon="phone_android" label="App Vivo" />
      </div>

      <div style={{ height: 1, background: LK.border, marginBottom: 20 }} />
      <Overline text="NÃO É A SUA? OUTRAS OPERADORAS" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12, marginBottom: 8 }}>
        {outrasNacionais.map((nome) => (
          <OutraOperadoraRow key={nome} nome={nome} whatsapp />
        ))}
      </div>
      <div style={{ font: `600 10px/1 ${LK.font}`, color: LK.textTertiary, letterSpacing: '.5px', marginBottom: 12 }}>
        REGIONAIS
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        {outrasRegionais.map((nome) => (
          <OutraOperadoraRow key={nome} nome={nome} whatsapp={false} />
        ))}
      </div>

      <div style={{ height: 1, background: LK.border, marginBottom: 16 }} />
      <div style={{ font: `400 12px/1.5 ${LK.font}`, color: LK.textTertiary }}>
        O SignallQ não tem vínculo com as operadoras. Você será levado ao canal oficial de cada uma.
      </div>
    </SheetFrame>
  );
}

function Overline({ text }: { text: string }) {
  return (
    <div style={{ font: `700 11px/1.3 ${LK.font}`, color: LK.textTertiary, letterSpacing: '.8px' }}>{text}</div>
  );
}

function OperadoraBadge({ nome, size }: { nome: string; size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: hexA(LK.accent, 0.12),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
        font: `700 ${size * 0.4}px/1 ${LK.font}`,
        color: LK.accent,
      }}
    >
      {nome.charAt(0)}
    </div>
  );
}

function OutlineActionButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        border: `1px solid ${LK.border}`,
        borderRadius: LK.rBtn,
        background: 'none',
        cursor: 'pointer',
        padding: '10px 0',
        font: `500 13px/1 ${LK.font}`,
        color: LK.textPrimary,
      }}
    >
      <Icon name={icon} size={16} color={LK.textPrimary} />
      {label}
    </button>
  );
}

function OutraOperadoraRow({ nome, whatsapp }: { nome: string; whatsapp: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <OperadoraBadge nome={nome} size={36} />
      <div style={{ flex: 1 }}>
        <div style={{ font: `600 14px/1.3 ${LK.font}`, color: LK.textPrimary }}>{nome}</div>
        <div style={{ font: `400 12px/1.3 ${LK.font}`, color: LK.textSecondary }}>
          {whatsapp ? 'WhatsApp · ligar *8486' : 'ligar *8486'}
        </div>
      </div>
      {whatsapp && (
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#25D366',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 'none',
          }}
        >
          <Icon name="phone_android" size={18} color="#fff" />
        </div>
      )}
    </div>
  );
}
