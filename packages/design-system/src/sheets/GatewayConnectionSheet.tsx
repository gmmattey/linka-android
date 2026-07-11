import React, { useState } from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { LK } from '../tokens.js';
import { hexA } from '../utils.js';
import { Icon } from '../primitives/Icon.js';
import { SheetTitle, StatePillSwitcher } from './_shared.js';

export interface GatewayConnectionSheetProps {
  style?: React.CSSProperties;
}

type ConnState = 'formulario' | 'conectando' | 'erro';

/**
 * "Conectar ao roteador" sheet: IP/user/password form + "Lembrar senha" /
 * "Manter conectado" toggles. Three visual states (form / connecting / error),
 * switchable via the prototype-only pill selector at the top — mirrors the
 * three-way sealed state in `GatewayConnectionSheet.kt`.
 */
export function GatewayConnectionSheet({ style }: GatewayConnectionSheetProps) {
  const [state, setState] = useState<ConnState>('formulario');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrarSenha, setLembrarSenha] = useState(false);
  const [manterConectado, setManterConectado] = useState(false);

  const states = [
    ['formulario', 'Formulário'],
    ['conectando', 'Conectando'],
    ['erro', 'Erro'],
  ] as const;

  const conectando = state === 'conectando';

  return (
    <SheetFrame style={style}>
      <StatePillSwitcher value={state} options={states} onChange={setState} />
      <SheetTitle title="Conectar ao roteador" />

      <Field label="Endereço IP" value="192.168.1.1" disabled={conectando} />
      <Field label="Usuário" value="admin" disabled={conectando} />
      <Field
        label="Senha"
        value={mostrarSenha ? '••••••••' : '••••••••'}
        disabled={conectando}
        trailing={
          <button
            onClick={() => setMostrarSenha((v) => !v)}
            style={{ background: 'none', border: 0, cursor: 'pointer', padding: 4, display: 'flex' }}
          >
            <Icon name={mostrarSenha ? 'visibility_off' : 'visibility'} size={20} color={LK.textSecondary} />
          </button>
        }
      />

      <button
        disabled={conectando}
        style={{
          background: 'none',
          border: 0,
          cursor: 'pointer',
          padding: '10px 0',
          textAlign: 'left',
          font: `500 14px/1.3 ${LK.font}`,
          color: LK.accent,
        }}
      >
        Não sabe o usuário e a senha?
      </button>

      <ToggleRow
        titulo="Lembrar senha"
        subtitulo="Salvar usuário e senha neste aparelho"
        checked={lembrarSenha}
        disabled={conectando || manterConectado}
        onChange={setLembrarSenha}
      />
      <ToggleRow
        titulo="Manter conectado"
        subtitulo="Reconectar automaticamente ao abrir o app"
        checked={manterConectado}
        disabled={conectando}
        onChange={(v) => {
          setManterConectado(v);
          if (v) setLembrarSenha(true);
        }}
      />

      {state === 'erro' && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: hexA(LK.error, 0.08),
            borderRadius: LK.rCard,
            padding: 12,
            margin: '12px 0',
          }}
        >
          <Icon name="error_outline" size={20} color={LK.error} />
          <span style={{ font: `400 12px/1.4 ${LK.font}`, color: LK.error }}>
            Não foi possível conectar. Verifique o IP, usuário e senha.
          </span>
        </div>
      )}

      <button
        style={{
          marginTop: 12,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          border: 0,
          cursor: conectando ? 'default' : 'pointer',
          background: LK.accent,
          color: '#fff',
          font: `600 15px/1 ${LK.font}`,
          borderRadius: LK.rBtn,
          padding: '14px 0',
          opacity: conectando ? 0.85 : 1,
        }}
      >
        {conectando ? (
          <>
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.4)',
                borderTopColor: '#fff',
              }}
            />
            Conectando…
          </>
        ) : state === 'erro' ? (
          'Tentar novamente'
        ) : (
          'Conectar'
        )}
      </button>
    </SheetFrame>
  );
}

function Field({
  label,
  value,
  disabled,
  trailing,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ font: `500 11px/1 ${LK.font}`, color: LK.textTertiary, marginBottom: 6 }}>{label}</div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          border: `1px solid ${LK.border}`,
          borderRadius: LK.rBtn,
          padding: '12px 14px',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <span style={{ flex: 1, font: `400 14px/1 ${LK.font}`, color: LK.textPrimary }}>{value}</span>
        {trailing}
      </div>
    </div>
  );
}

function ToggleRow({
  titulo,
  subtitulo,
  checked,
  disabled,
  onChange,
}: {
  titulo: string;
  subtitulo: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        border: `1px solid ${LK.border}`,
        borderRadius: LK.rCard,
        padding: '10px 16px',
        marginBottom: 10,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ font: `500 14px/1.3 ${LK.font}`, color: LK.textPrimary }}>{titulo}</div>
        <div style={{ font: `400 12px/1.3 ${LK.font}`, color: LK.textSecondary }}>{subtitulo}</div>
      </div>
      <button
        disabled={disabled}
        onClick={() => onChange(!checked)}
        style={{
          width: 40,
          height: 24,
          borderRadius: 999,
          border: 0,
          cursor: disabled ? 'default' : 'pointer',
          background: checked ? LK.accent : LK.border,
          position: 'relative',
          padding: 0,
          flex: 'none',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: checked ? 19 : 3,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left 0.15s',
          }}
        />
      </button>
    </div>
  );
}
