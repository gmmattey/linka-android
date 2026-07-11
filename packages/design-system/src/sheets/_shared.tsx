import React from 'react';
import { LK } from '../tokens.js';
import { hexA } from '../utils.js';

/**
 * Internal helpers shared across sheet components. Not exported from the
 * package barrel — mirrors `SheetInfoRow` and the prototype state-pill
 * switcher used across Phase 1 screens (DispositivosScreen, FibraModemScreen).
 */

export function SheetInfoRow({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 16,
        paddingBottom: 12,
      }}
    >
      <span style={{ font: `400 14px/1.4 ${LK.font}`, color: LK.textSecondary }}>{label}</span>
      <span
        style={{
          font: `600 14px/1.4 ${LK.font}`,
          color: valueColor ?? LK.textPrimary,
          textAlign: 'right',
        }}
      >
        {value}
      </span>
    </div>
  );
}

export function SheetTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ font: `700 20px/1.3 ${LK.font}`, color: LK.textPrimary }}>{title}</div>
      {subtitle && (
        <div style={{ font: `400 13px/1.4 ${LK.font}`, color: LK.textTertiary, marginTop: 2 }}>{subtitle}</div>
      )}
    </div>
  );
}

/** Prototype-only pill state switcher — not part of the real app UI. Same pattern as DispositivosScreen. */
export function StatePillSwitcher<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly (readonly [T, string])[];
  onChange: (v: T) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 8, padding: '0 24px 12px', marginTop: -8 }}>
      {options.map(([id, lbl]) => {
        const on = id === value;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            style={{
              flex: 1,
              border: 0,
              cursor: 'pointer',
              padding: '9px 0',
              borderRadius: 999,
              font: `${on ? 600 : 500} 12px/1 ${LK.font}`,
              background: on ? hexA(LK.accent, 0.12) : LK.bgSecondary,
              color: on ? LK.accent : LK.textSecondary,
            }}
          >
            {lbl}
          </button>
        );
      })}
    </div>
  );
}
