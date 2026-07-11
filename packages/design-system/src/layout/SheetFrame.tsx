import React from 'react';
import { LK } from '../tokens.js';

export interface SheetFrameProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Bottom sheet frame: white surface, rounded top corners, centered drag handle.
 * Mirrors `SheetDragHandle` + `ModalBottomSheet` container from the Android app —
 * the real sheets have no explicit close button (dismissed by swipe/scrim tap),
 * so this frame only supplies the handle + surface. Each sheet renders its own
 * title/body as `children`, exactly like the Kotlin composables do.
 */
export function SheetFrame({ children, style }: SheetFrameProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        background: LK.bgPrimary,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 -4px 24px rgba(13, 13, 26, 0.12)',
        ...style,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
        <div style={{ width: 32, height: 4, borderRadius: 2, background: LK.border }} />
      </div>
      <div style={{ padding: '20px 24px 32px' }}>{children}</div>
    </div>
  );
}
