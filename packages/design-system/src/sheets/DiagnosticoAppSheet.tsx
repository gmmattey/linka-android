import React from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { LK } from '../tokens.js';
import { Icon } from '../primitives/Icon.js';
import { SheetInfoRow, SheetTitle } from './_shared.js';

export interface DiagnosticoAppSheetProps {
  style?: React.CSSProperties;
}

/**
 * "Diagnóstico do app" sheet — versão, plataforma, integridade e
 * assinatura, com badge de verificação de segurança/build no rodapé.
 * Mirrors `DiagnosticoAppSheet` (`AjustesScreen.kt`, ~L2131).
 */
export function DiagnosticoAppSheet({ style }: DiagnosticoAppSheetProps) {
  return (
    <SheetFrame style={style}>
      <SheetTitle title="Diagnóstico do app" />
      <SheetInfoRow label="Versão" value="v0.23.0" />
      <SheetInfoRow label="Plataforma" value="Android · Kotlin + Compose" />
      <SheetInfoRow label="Integridade" value="OK" valueColor={LK.success} />
      <SheetInfoRow label="Assinatura" value="Verificada" valueColor={LK.success} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
        <Icon name="verified_user" size={16} color={LK.success} />
        <span style={{ font: `400 12px/1.3 ${LK.font}`, color: LK.success }}>
          Binários íntegros · Nenhuma anomalia detectada
        </span>
      </div>
    </SheetFrame>
  );
}
