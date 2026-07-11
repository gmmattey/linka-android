import React from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { SheetInfoRow, SheetTitle } from './_shared.js';

export interface GatewayInfoSheetProps {
  style?: React.CSSProperties;
}

/** Gateway info sheet: tap on the "gateway" node in the Home network trail. */
export function GatewayInfoSheet({ style }: GatewayInfoSheetProps) {
  return (
    <SheetFrame style={style}>
      <SheetTitle title="Roteador da casa" />
      <SheetInfoRow label="Tipo detectado" value="Roteador Wi-Fi" />
      <SheetInfoRow label="IP do roteador" value="192.168.1.1" />
      <SheetInfoRow label="SSID" value="Luiz-5G" />
      <SheetInfoRow label="Sinal" value="−27 dBm" />
      <SheetInfoRow label="Banda" value="5GHz" />
      <SheetInfoRow label="Velocidade do link" value="433 Mbps" />
      <SheetInfoRow label="Canal" value="36" />
      <SheetInfoRow label="Largura de canal" value="80 MHz" />
      <SheetInfoRow label="Segurança" value="WPA2/WPA3" />
    </SheetFrame>
  );
}
