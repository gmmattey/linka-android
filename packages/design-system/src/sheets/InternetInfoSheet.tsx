import React from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { LK } from '../tokens.js';
import { SheetInfoRow, SheetTitle } from './_shared.js';

export interface InternetInfoSheetProps {
  style?: React.CSSProperties;
}

/** Internet info sheet: tap on the "internet" node in the Home network trail. */
export function InternetInfoSheet({ style }: InternetInfoSheetProps) {
  return (
    <SheetFrame style={style}>
      <SheetTitle title="Internet" />
      <SheetInfoRow label="IP Público" value="187.94.12.203" />
      <SheetInfoRow label="Provedor" value="Vivo Fibra" />
      <SheetInfoRow label="País / Região" value="Brasil / SP" />
      <SheetInfoRow label="DNS Privado" value="dns.google" valueColor={LK.success} />
      <SheetInfoRow label="Servidores DNS" value="8.8.8.8 / 8.8.4.4" />
    </SheetFrame>
  );
}
