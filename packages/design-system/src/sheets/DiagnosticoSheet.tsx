import React, { useState } from 'react';
import { SheetFrame } from '../layout/SheetFrame.js';
import { LK } from '../tokens.js';
import { Icon } from '../primitives/Icon.js';

export interface DiagnosticoSheetProps {
  style?: React.CSSProperties;
}

/**
 * "Monitoramento passivo" / "Análise avançada" sheet — Avançado em Ajustes.
 * Toggles principais + sub-toggles de notificação (só visíveis quando
 * monitoramento ativo) + aviso de restrição de bateria OEM. Mirrors
 * `DiagnosticoSheet` (`AjustesScreen.kt`, ~L1799).
 */
export function DiagnosticoSheet({ style }: DiagnosticoSheetProps) {
  const [analiseAvancada, setAnaliseAvancada] = useState(false);
  const [monitoramento, setMonitoramento] = useState(true);
  const [semInternet, setSemInternet] = useState(true);
  const [latencia, setLatencia] = useState(true);
  const [dns, setDns] = useState(false);
  const [rssi, setRssi] = useState(true);

  return (
    <SheetFrame style={style}>
      <div style={{ font: `700 20px/1.3 ${LK.font}`, color: LK.textPrimary }}>Diagnóstico avançado</div>
      <div style={{ font: `400 13px/1.4 ${LK.font}`, color: LK.textSecondary, marginTop: 2, marginBottom: 16 }}>
        Recursos que aprofundam a análise da sua rede
      </div>

      <ToggleRow
        icon="analytics"
        titulo="Análise avançada"
        subtitulo={analiseAvancada ? 'Ativa' : 'Desativada · pode aumentar consumo de bateria'}
        checked={analiseAvancada}
        onChange={setAnaliseAvancada}
      />
      <Divider />
      <ToggleRow
        icon="sensors"
        titulo="Monitoramento passivo"
        subtitulo={monitoramento ? 'Ativo · verifica a cada 30 minutos' : 'Desativado'}
        checked={monitoramento}
        onChange={setMonitoramento}
      />

      {monitoramento && (
        <>
          <Divider />
          <div style={{ font: `500 12px/1 ${LK.font}`, color: LK.textSecondary, margin: '4px 0 8px' }}>
            Notificações
          </div>
          <ToggleRow icon="wifi_off" titulo="Sem internet" subtitulo="Avisa quando a conexão cair" checked={semInternet} onChange={setSemInternet} />
          <Divider />
          <ToggleRow icon="speed" titulo="Latência alta" subtitulo="Avisa quando a rede ficar lenta" checked={latencia} onChange={setLatencia} />
          <Divider />
          <ToggleRow icon="language" titulo="DNS lento" subtitulo="Avisa quando sites e apps demorarem para carregar" checked={dns} onChange={setDns} />
          <Divider />
          <ToggleRow icon="wifi" titulo="Sinal Wi-Fi fraco" subtitulo="Avisa quando o sinal cair abaixo do ideal" checked={rssi} onChange={setRssi} />
        </>
      )}

      {monitoramento && (
        <>
          <Divider />
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            <Icon name="info" size={16} color={LK.warning} style={{ flex: 'none', marginTop: 1 }} />
            <span style={{ font: `400 12px/1.4 ${LK.font}`, color: LK.textSecondary }}>
              Em alguns dispositivos Xiaomi, o sistema pode reduzir a frequência das verificações para
              economizar bateria. Para garantir o funcionamento, mantenha o SignallQ na lista de apps sem
              restrição de bateria nas configurações do sistema.
            </span>
          </div>
        </>
      )}
    </SheetFrame>
  );
}

function ToggleRow({
  icon,
  titulo,
  subtitulo,
  checked,
  onChange,
}: {
  icon: string;
  titulo: string;
  subtitulo: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0' }}>
      <Icon name={icon} size={20} color={LK.textSecondary} style={{ flex: 'none' }} />
      <div style={{ flex: 1 }}>
        <div style={{ font: `500 14px/1.3 ${LK.font}`, color: LK.textPrimary }}>{titulo}</div>
        <div style={{ font: `400 12px/1.3 ${LK.font}`, color: LK.textSecondary }}>{subtitulo}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: 40,
          height: 24,
          borderRadius: 999,
          border: 0,
          cursor: 'pointer',
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

function Divider() {
  return <div style={{ height: 1, background: LK.border }} />;
}
