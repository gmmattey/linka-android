import React, { useState } from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { LK } from '../tokens.js';
import { hexA } from '../utils.js';
import { Icon } from '../primitives/Icon.js';
import { SheetInfoRow } from './_shared.js';

export interface PerfilEditSheetProps {
  style?: React.CSSProperties;
}

/**
 * "Meu perfil" sheet — hero card de Ajustes ou avatar em qualquer topbar.
 * Avatar (picker de foto — só o botão, não funcional), nome/apelido, dados
 * de conexão somente leitura, device name e versão. Mirrors `PerfilEditSheet`
 * (`AjustesScreen.kt`, ~L1182).
 */
export function PerfilEditSheet({ style }: PerfilEditSheetProps) {
  const [nome, setNome] = useState('Luiz');

  return (
    <SheetFrame style={style}>
      <div style={{ font: `700 20px/1.3 ${LK.font}`, color: LK.textPrimary, marginBottom: 20 }}>Meu perfil</div>

      {/* Avatar */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <button
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            border: 0,
            cursor: 'pointer',
            background: hexA(LK.accent, 0.12),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <span style={{ font: `700 30px/1 ${LK.font}`, color: LK.accent }}>{nome.charAt(0).toUpperCase()}</span>
          <div
            style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: LK.accent,
              border: `2px solid ${LK.bgPrimary}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon name="photo_camera" size={14} color="#fff" />
          </div>
        </button>
      </div>
      <div
        style={{
          textAlign: 'center',
          font: `400 12px/1 ${LK.font}`,
          color: LK.textTertiary,
          marginBottom: 20,
        }}
      >
        Toque no avatar para alterar a foto
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ font: `500 11px/1 ${LK.font}`, color: LK.textTertiary, marginBottom: 6 }}>
          Seu nome ou apelido
        </div>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Ex: João"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            border: `1px solid ${LK.border}`,
            borderRadius: 8,
            padding: '12px 14px',
            font: `400 14px/1 ${LK.font}`,
            color: LK.textPrimary,
          }}
        />
      </div>

      <Divider />
      <SheetInfoRow label="Operadora / ISP" value="Vivo Fibra" />
      <SheetInfoRow label="IP Público" value="187.45.22.108" />
      <SheetInfoRow label="Conexão" value="Wi-Fi" />
      <SheetInfoRow label="Localização" value="São Paulo, BR" />
      <SheetInfoRow label="Versão" value="v0.23.0" />

      <button
        style={{
          width: '100%',
          marginTop: 8,
          border: 0,
          cursor: 'pointer',
          background: LK.accent,
          color: '#fff',
          font: `600 15px/1 ${LK.font}`,
          borderRadius: LK.rBtn,
          padding: '14px 0',
        }}
      >
        Salvar perfil
      </button>
    </SheetFrame>
  );
}

function Divider() {
  return <div style={{ height: 1, background: LK.border, margin: '0 0 4px' }} />;
}
