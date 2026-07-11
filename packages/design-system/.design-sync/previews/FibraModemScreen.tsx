import React from 'react';
import { FibraModemScreen, PhoneFrame, StatusBar, LK } from '@signallq/design-system';

export const InFrame = () => (
  <div style={{ padding: 24, background: '#F0F0F0', display: 'inline-block', fontFamily: LK.font }}>
    <PhoneFrame>
      <StatusBar />
      <FibraModemScreen />
    </PhoneFrame>
  </div>
);

export const Standalone = () => (
  <div
    style={{
      width: 390,
      height: 560,
      display: 'flex',
      flexDirection: 'column',
      background: LK.bgPrimary,
      fontFamily: LK.font,
    }}
  >
    <FibraModemScreen />
  </div>
);
