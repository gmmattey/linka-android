import React from 'react';
import { InternetInfoSheet, PhoneFrame, StatusBar, LK } from '@signallq/design-system';

export const InFrame = () => (
  <div style={{ padding: 24, background: '#F0F0F0', display: 'inline-block', fontFamily: LK.font }}>
    <PhoneFrame>
      <StatusBar />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 44, bottom: 0, background: 'rgba(13, 13, 26, 0.45)' }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '82%', overflow: 'hidden' }}>
        <InternetInfoSheet />
      </div>
    </PhoneFrame>
  </div>
);

export const Standalone = () => (
  <div style={{ width: 390, fontFamily: LK.font }}>
    <InternetInfoSheet />
  </div>
);
