import React, { useState } from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { LK } from '../tokens.js';
import { hexA } from '../utils.js';
import { Icon } from '../primitives/Icon.js';

export interface MinhaConexaoSheetProps {
  style?: React.CSSProperties;
}

/**
 * "Minha conexão" sheet — linha em Ajustes. Operadora (com chip de sugestão
 * auto-detectada), velocidade contratada download/upload, estado (UF) +
 * cidade. Exportado como `MinhaConexaoSheet` (o composable real chama-se
 * `MinhaConexaoScreen.kt` mas é 100% sheet — mesmo caso de `PingScreenSheet`
 * no lote B). Mirrors `MinhaConexaoSheet` (`MinhaConexaoScreen.kt`).
 */
export function MinhaConexaoSheet({ style }: MinhaConexaoSheetProps) {
  const [operadora, setOperadora] = useState('');
  const [down, setDown] = useState('300');
  const [up, setUp] = useState('150');
  const [uf, setUf] = useState('SP');
  const [cidade, setCidade] = useState('São Paulo');

  return (
    <SheetFrame style={style}>
      <div style={{ font: `700 20px/1.3 ${LK.font}`, color: LK.textPrimary, marginBottom: 20 }}>Minha conexão</div>

      <SectionCard title="Operadora">
        {operadora.trim() === '' && (
          <button
            onClick={() => setOperadora('Vivo Fibra')}
            style={{
              display: 'inline-block',
              border: `1px solid ${hexA(LK.accent, 0.3)}`,
              background: hexA(LK.accent, 0.1),
              borderRadius: 8,
              padding: '6px 12px',
              cursor: 'pointer',
              font: `500 12px/1 ${LK.font}`,
              color: LK.accent,
              marginBottom: 10,
            }}
          >
            Detectada: Vivo Fibra
          </button>
        )}
        <Field label="Operadora / ISP" value={operadora} onChange={setOperadora} />
      </SectionCard>

      <SectionCard title="Velocidade Contratada">
        <div style={{ display: 'flex', gap: 8 }}>
          <Field label="Download (Mbps)" value={down} onChange={setDown} numeric />
          <Field label="Upload (Mbps)" value={up} onChange={setUp} numeric />
        </div>
      </SectionCard>

      <SectionCard title="Localização">
        <Dropdown label="Estado (UF)" value={uf} onChange={setUf} />
        <div style={{ height: 10 }} />
        <Field label="Cidade" value={cidade} onChange={setCidade} />
      </SectionCard>

      <button
        style={{
          width: '100%',
          border: 0,
          cursor: 'pointer',
          background: LK.accent,
          color: '#fff',
          font: `600 15px/1 ${LK.font}`,
          borderRadius: LK.rBtn,
          padding: '14px 0',
        }}
      >
        Salvar
      </button>
    </SheetFrame>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: LK.bgSecondary,
        borderRadius: LK.rCard,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <div style={{ font: `600 12px/1 ${LK.font}`, color: LK.textSecondary, marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  numeric,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  numeric?: boolean;
}) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ font: `500 11px/1 ${LK.font}`, color: LK.textTertiary, marginBottom: 6 }}>{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(numeric ? e.target.value.replace(/\D/g, '') : e.target.value)}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          border: `1px solid ${LK.border}`,
          borderRadius: 8,
          padding: '10px 12px',
          font: `400 14px/1 ${LK.font}`,
          color: LK.textPrimary,
          background: LK.bgPrimary,
        }}
      />
    </div>
  );
}

function Dropdown({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const ufs = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
  return (
    <div>
      <div style={{ font: `500 11px/1 ${LK.font}`, color: LK.textTertiary, marginBottom: 6 }}>{label}</div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: `1px solid ${LK.border}`,
          borderRadius: 8,
          padding: '10px 12px',
          background: LK.bgPrimary,
        }}
      >
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            border: 0,
            outline: 'none',
            background: 'transparent',
            font: `400 14px/1 ${LK.font}`,
            color: LK.textPrimary,
            flex: 1,
          }}
        >
          {ufs.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <Icon name="arrow_drop_down" size={20} color={LK.textSecondary} />
      </div>
    </div>
  );
}
