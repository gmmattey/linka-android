import React from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { LK } from '../tokens.js';
import { SheetInfoRow, SheetTitle } from './_shared.js';

export interface SimpleInfoSheetProps {
  style?: React.CSSProperties;
}

/**
 * "Sobre o SignallQ" sheet — item genérico de linhas de info, usado para
 * versão, plataforma, dev, suporte. Mirrors `SimpleInfoSheet`
 * (`AjustesScreen.kt`, ~L1316) chamado com titulo "Sobre o SignallQ".
 */
export function SimpleInfoSheet({ style }: SimpleInfoSheetProps) {
  return (
    <SheetFrame style={style}>
      <SheetTitle title="Sobre o SignallQ" />
      <SheetInfoRow label="Versão" value="v0.23.0" />
      <SheetInfoRow label="Plataforma" value="Android · Kotlin + Compose" />
      <SheetInfoRow label="Desenvolvido por" value="Equipe SignallQ" />
      <SheetInfoRow label="Suporte" value="suporte@signallq.app" />
    </SheetFrame>
  );
}
