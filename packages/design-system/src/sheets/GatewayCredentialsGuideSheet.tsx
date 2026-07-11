import React from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { LK } from '../tokens.js';
import { hexA } from '../utils.js';
import { Icon } from '../primitives/Icon.js';
import { SheetTitle } from './_shared.js';

export interface GatewayCredentialsGuideSheetProps {
  style?: React.CSSProperties;
}

const passos = [
  { icon: 'rotate_90_degrees_ccw', titulo: 'Vire o roteador', descricao: 'A etiqueta com os dados de acesso costuma ficar embaixo ou atrás do aparelho.' },
  { icon: 'label', titulo: 'Encontre a etiqueta', descricao: 'Procure os campos "Usuário" e "Senha" (ou "Login" e "Password").' },
  { icon: 'password', titulo: 'Usuário e senha padrão estão ali', descricao: 'Digite exatamente como está escrito, com atenção a maiúsculas e minúsculas.' },
  { icon: 'edit', titulo: 'Se já foi alterado, use o que você configurou', descricao: 'Se você já trocou a senha antes, use a que definiu — não a da etiqueta.' },
];

/** Illustrated 4-step guide to find the router's default username/password, opened from GatewayConnectionSheet. */
export function GatewayCredentialsGuideSheet({ style }: GatewayCredentialsGuideSheetProps) {
  return (
    <SheetFrame style={style}>
      <SheetTitle
        title="Como encontrar usuário e senha do roteador"
        subtitle="Essas informações costumam vir de fábrica, impressas no próprio aparelho."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {passos.map((p, i) => (
          <div key={p.titulo} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: hexA(LK.accent, 0.12),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 'none',
              }}
            >
              <Icon name={p.icon} size={22} color={LK.accent} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ font: `600 11px/1 ${LK.font}`, color: LK.accent, marginBottom: 4 }}>Passo {i + 1}</div>
              <div style={{ font: `600 15px/1.3 ${LK.font}`, color: LK.textPrimary, marginBottom: 2 }}>{p.titulo}</div>
              <div style={{ font: `400 13px/1.4 ${LK.font}`, color: LK.textSecondary }}>{p.descricao}</div>
            </div>
          </div>
        ))}
      </div>
    </SheetFrame>
  );
}
