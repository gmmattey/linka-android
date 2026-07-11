import React, { useState } from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { LK } from '../tokens.js';
import { Icon } from '../primitives/Icon.js';
import { StatePillSwitcher } from './_shared.js';

export interface PermissaoLocalizacaoContextoSheetProps {
  style?: React.CSSProperties;
}

type PermState = 'solicitar' | 'bloqueada';

/**
 * Sheet de contexto de permissão de localização — auto-abre ao entrar em Wi-Fi
 * sem permissão. Explica por que é necessária (listar redes); estado alternativo
 * quando bloqueada permanentemente ("Abrir ajustes do Android"). Mirrors
 * `PermissaoLocalizacaoContextoSheet.kt`.
 */
export function PermissaoLocalizacaoContextoSheet({ style }: PermissaoLocalizacaoContextoSheetProps) {
  const [state, setState] = useState<PermState>('solicitar');

  const states = [
    ['solicitar', 'Solicitar'],
    ['bloqueada', 'Bloqueada'],
  ] as const;

  const bloqueada = state === 'bloqueada';

  return (
    <SheetFrame style={style}>
      <StatePillSwitcher value={state} options={states} onChange={setState} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <Icon name="location_on" size={64} color={LK.accent} style={{ marginBottom: 20 }} />

        {bloqueada ? (
          <>
            <div style={{ font: `600 20px/1.3 ${LK.font}`, color: LK.textPrimary, marginBottom: 12 }}>
              Permissão bloqueada
            </div>
            <div style={{ font: `400 14px/1.5 ${LK.font}`, color: LK.textSecondary, marginBottom: 24 }}>
              A permissão foi bloqueada nas configurações do Android. Para ativar, abra os ajustes do app.
            </div>
          </>
        ) : (
          <>
            <div style={{ font: `600 20px/1.3 ${LK.font}`, color: LK.textPrimary, marginBottom: 12 }}>
              Por que precisamos da localização?
            </div>
            <div style={{ font: `400 14px/1.5 ${LK.font}`, color: LK.textSecondary, marginBottom: 8 }}>
              O Android exige permissão de localização para identificar as redes Wi-Fi ao redor e analisar canais de
              interferência.
            </div>
            <div style={{ font: `400 14px/1.5 ${LK.font}`, color: LK.textSecondary, marginBottom: 24 }}>
              Não usamos sua localização para rastrear onde você está. Ela nunca sai do dispositivo.
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: 12, width: '100%' }}>
          <button
            style={{
              flex: 1,
              background: 'none',
              border: 0,
              cursor: 'pointer',
              padding: '14px 0',
              font: `600 14px/1 ${LK.font}`,
              color: LK.textSecondary,
            }}
          >
            Agora não
          </button>
          <button
            style={{
              flex: 1,
              border: 0,
              cursor: 'pointer',
              borderRadius: LK.rBtn,
              background: LK.accent,
              color: '#fff',
              font: `600 14px/1 ${LK.font}`,
              padding: '14px 0',
            }}
          >
            {bloqueada ? 'Abrir ajustes do Android' : 'Entendi, conceder'}
          </button>
        </div>
      </div>
    </SheetFrame>
  );
}
