import React from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { SheetInfoRow, SheetTitle } from './_shared.js';

export interface DeviceInfoSheetProps {
  style?: React.CSSProperties;
}

/** "Meu dispositivo" sheet: tap on the "device" node in the Home network trail. */
export function DeviceInfoSheet({ style }: DeviceInfoSheetProps) {
  return (
    <SheetFrame style={style}>
      <SheetTitle title="Meu dispositivo" />
      <SheetInfoRow label="Modelo" value="Pixel 8" />
      <SheetInfoRow label="Sistema" value="Android" />
      <SheetInfoRow label="IP Local" value="192.168.1.42" />
      <SheetInfoRow label="Tipo de conexão" value="Wi-Fi" />
    </SheetFrame>
  );
}
