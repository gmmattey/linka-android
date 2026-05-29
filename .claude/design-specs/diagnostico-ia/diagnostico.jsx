/* Diagnóstico IA — substitui o chat. Fluxo: escolher sinais → analisando → laudo interpretado.
   Tema claro (igual ao app) com herói escuro (identidade Orbit). 4 estados. */

/* ---- Orbit glyph (identidade da IA) ---- */
function Orbit({ size = 22, color = '#FBBF24', pulse = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block', flexShrink: 0 }}>
      <circle cx="12" cy="12" r="4.5" fill={color}>
        {pulse && <animate attributeName="r" values="4;5;4" dur="1.6s" repeatCount="indefinite" />}
      </circle>
      <circle cx="12" cy="12" r="8" stroke={color} strokeWidth="1.1" fill="none" opacity=".5">
        {pulse && <animate attributeName="opacity" values=".5;.15;.5" dur="1.6s" repeatCount="indefinite" />}
      </circle>
      <circle cx="12" cy="12" r="11" stroke={color} strokeWidth="0.7" fill="none" opacity=".22">
        {pulse && <animate attributeName="opacity" values=".22;.05;.22" dur="1.6s" repeatCount="indefinite" />}
      </circle>
    </svg>
  );
}

const backIcon = 'M15.5 19 8.5 12l7-7L17 6.5 11.5 12l5.5 5.5L15.5 19Z';
const shareIcon = 'M18 16.1c-.8 0-1.4.3-2 .8L9 13l.1-1L16 8.9c.5.4 1.2.7 2 .7a3 3 0 1 0-3-3v.6L8.1 11l-.2-.1a3 3 0 1 0 0 2.4l7 4.1V18a3 3 0 1 0 3-2Z';
const checkIcon = 'M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z';
const sparkIcon = 'M12 2l1.9 5.1L19 9l-5.1 1.9L12 16l-1.9-5.1L5 9l5.1-1.9L12 2Zm6 12l.9 2.4L21 17l-2.1.9L18 20l-.9-2.1L15 17l2.1-.6L18 14ZM5 14l.8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8L5 14Z';

/* on-device trust pill */
function OnDevicePill({ dark = false }) {
  const c = dark ? 'rgba(255,255,255,.55)' : LK.textTertiary;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: c, fontWeight: 500 }}>
      <Icon d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4Z" size={12} color={c} />
      Processado no aparelho · Gemma 4
    </span>
  );
}

/* ========================= 1 · ESCOLHER SINAIS ========================= */
function DiagSetup() {
  const sinais = [
    { icon: ICONS.insights, t: 'Velocidade', d: 'Download, upload e estabilidade', on: true },
    { icon: ICONS.wifi,     t: 'Wi-Fi & Sinal', d: 'Potência, canal e congestionamento', on: true },
    { icon: ICONS.ping,     t: 'Latência & Bufferbloat', d: 'Atraso ocioso e sob carga', on: true },
    { icon: ICONS.tower,    t: 'Modem / Fibra (GPON)', d: 'Potência óptica e status PPP', on: true },
    { icon: ICONS.language, t: 'DNS', d: 'Tempo de resolução de nomes', on: false },
  ];
  return (
    <div style={{ height: '100%', background: LK.bgPrimary, display: 'flex', flexDirection: 'column' }}>
      <TopBar leading={<Icon d={backIcon} size={22} />} title="Diagnóstico IA" />
      <div style={{ padding: '4px 16px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>
        {/* intro */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '4px 2px' }}>
          <Orbit size={30} />
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 600, color: LK.textPrimary, lineHeight: 1.35 }}>
              A IA lê os sinais da sua conexão e entrega um diagnóstico pronto.
            </div>
            <div style={{ fontSize: 12, color: LK.textSecondary, marginTop: 4, lineHeight: 1.4 }}>
              Sem conversa: você escolhe o que medir, ela interpreta e aponta a causa.
            </div>
          </div>
        </div>

        <div style={{ fontSize: 10, fontWeight: 700, color: LK.textTertiary, letterSpacing: 0.5, margin: '2px 2px -2px' }}>O QUE ANALISAR</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sinais.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
              background: s.on ? `${LK.accent}0D` : LK.bgPrimary,
              border: `1px solid ${s.on ? LK.accent + '40' : LK.border}`, borderRadius: LK.rCard,
            }}>
              <Icon d={s.icon} size={20} color={s.on ? LK.accent : LK.textTertiary} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: LK.textPrimary }}>{s.t}</div>
                <div style={{ fontSize: 11, color: LK.textSecondary, marginTop: 1 }}>{s.d}</div>
              </div>
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: s.on ? LK.accent : 'transparent',
                border: s.on ? 'none' : `1.5px solid ${LK.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {s.on && <Icon d={checkIcon} size={14} color="#fff" />}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: 16, borderTop: `1px solid ${LK.border}`, background: LK.bgPrimary }}>
        <button style={{
          width: '100%', padding: '13px 0', background: LK.accent, color: '#fff', border: 'none',
          borderRadius: LK.rButton, fontWeight: 700, fontSize: 14.5,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <Icon d={sparkIcon} size={18} color="#fff" /> Diagnosticar conexão
        </button>
        <div style={{ textAlign: 'center', marginTop: 10 }}><OnDevicePill /></div>
      </div>
    </div>
  );
}

/* ========================= 2 · ANALISANDO ========================= */
function DiagAnalyzing() {
  const steps = [
    { t: 'Velocidade medida', st: 'done' },
    { t: 'Wi-Fi e canais lidos', st: 'done' },
    { t: 'Latência sob carga', st: 'run' },
    { t: 'Modem / fibra', st: 'wait' },
  ];
  return (
    <div style={{ height: '100%', background: LK.bgPrimary, display: 'flex', flexDirection: 'column' }}>
      <TopBar leading={<Icon d={backIcon} size={22} />} title="Diagnóstico IA" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px', gap: 6 }}>
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <Orbit size={96} pulse />
        </div>
        <div style={{ fontSize: 18, fontWeight: 700, color: LK.textPrimary }}>Analisando sua conexão</div>
        <div style={{ fontSize: 12.5, color: LK.textSecondary, textAlign: 'center', lineHeight: 1.45 }}>
          A IA está cruzando os sinais para encontrar o que está limitando você.
        </div>
        {/* progress */}
        <div style={{ width: '100%', height: 5, background: LK.bgSecondary, borderRadius: 3, marginTop: 18, overflow: 'hidden' }}>
          <div style={{ width: '62%', height: '100%', background: LK.accent, borderRadius: 3 }} />
        </div>
        {/* checklist */}
        <div style={{ width: '100%', marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {s.st === 'done' ? (
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: LK.success, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon d={checkIcon} size={13} color="#fff" />
                </div>
              ) : s.st === 'run' ? (
                <svg width="20" height="20" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="8" stroke={LK.border} strokeWidth="2.5" fill="none" />
                  <circle cx="10" cy="10" r="8" stroke={LK.accent} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="50" strokeDashoffset="32">
                    <animateTransform attributeName="transform" type="rotate" from="0 10 10" to="360 10 10" dur="0.9s" repeatCount="indefinite" />
                  </circle>
                </svg>
              ) : (
                <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${LK.border}` }} />
              )}
              <span style={{ fontSize: 13, fontWeight: 500, color: s.st === 'wait' ? LK.textTertiary : LK.textPrimary }}>{s.t}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: 16, textAlign: 'center' }}><OnDevicePill /></div>
    </div>
  );
}

/* ========================= 3 · VEREDITO + CAUSA-RAIZ ========================= */
function DiagResultTop() {
  return (
    <div style={{ height: '100%', background: LK.bgPrimary, display: 'flex', flexDirection: 'column' }}>
      <TopBar leading={<Icon d={backIcon} size={22} />} title="Diagnóstico IA" trailing={<Icon d={shareIcon} size={22} />} />
      <div style={{ padding: '4px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden' }}>
        {/* HERO escuro — a voz da IA */}
        <div style={{
          background: `linear-gradient(160deg, ${LK.linkaDarkSurface}, ${LK.linkaBlack})`,
          borderRadius: 20, padding: 18, color: LK.linkaTextOnDark,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
            <Orbit size={22} />
            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.8, color: 'rgba(255,255,255,.6)' }}>DIAGNÓSTICO IA</span>
            <span style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 700, color: LK.warning, background: `${LK.warning}26`, padding: '3px 10px', borderRadius: 999 }}>ATENÇÃO</span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.42 }}>
            Seu Wi-Fi chega fraco neste cômodo e a fila de download entope a conexão. É por isso que chamadas travam e páginas demoram — o plano em si está ok.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,.1)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 600, color: LK.success }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: LK.success }} /> Confiança alta
            </span>
            <span style={{ marginLeft: 'auto' }}><OnDevicePill dark /></span>
          </div>
        </div>

        {/* CAUSA-RAIZ */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: LK.textTertiary, letterSpacing: 0.5, marginBottom: 8 }}>CAUSA-RAIZ IDENTIFICADA</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <CulpritRow icon={ICONS.wifi} t="Sinal Wi-Fi fraco" d="−74 dBm a 5 GHz · 2 cômodos de distância" />
            <CulpritRow icon={ICONS.ping} t="Bufferbloat sob carga" d="latência salta de 22 ms → 182 ms ao baixar" />
          </div>
        </div>

        {/* IMPACTO */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: LK.textTertiary, letterSpacing: 0.5, marginBottom: 6 }}>IMPACTO NO USO</div>
          <div style={{ background: LK.bgSecondary, borderRadius: LK.rCard, padding: '2px 14px' }}>
            <UseRow icon="M21 3H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h7v2H8v2h8v-2h-2v-2h7a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" label="Streaming / vídeo" v="Ok" c={LK.success} />
            <UseRow icon="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4Z" label="Chamadas de vídeo" v="Travando" c={LK.error} />
            <UseRow icon="M21.6 7.66c-.4-1.4-1.66-2.4-3.16-2.4H5.56c-1.5 0-2.76 1-3.16 2.4L1.06 13.6a2 2 0 0 0 1.94 2.4h2.5l1-2h11l1 2H21a2 2 0 0 0 1.94-2.4l-1.34-5.94Z" label="Jogos online" v="Ruim" c={LK.error} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CulpritRow({ icon, t, d }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: `${LK.error}0D`, border: `1px solid ${LK.error}33`, borderRadius: LK.rCard, padding: '11px 14px' }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${LK.error}1A`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon d={icon} size={19} color={LK.error} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: LK.textPrimary }}>{t}</div>
        <div style={{ fontSize: 11.5, color: LK.textSecondary, marginTop: 1 }}>{d}</div>
      </div>
    </div>
  );
}

/* ========================= 4 · RECOMENDAÇÕES + SINAIS ========================= */
function DiagResultDetail() {
  const recs = [
    { p: 'Alta', pc: LK.error, t: 'Aproxime o aparelho do roteador ou use 5 GHz', d: 'A −74 dBm o sinal está no limite. A poucos metros o download mais que dobra.' },
    { p: 'Alta', pc: LK.error, t: 'Ative o SQM / "Smart Queue" no roteador', d: 'Corta o bufferbloat de 182 ms para ~20 ms — fim das travadas em chamadas.' },
    { p: 'Média', pc: LK.warning, t: 'Mude o Wi-Fi 2.4 GHz do canal 6 para o 1 ou 11', d: 'Há 6 redes vizinhas no canal 6 disputando espaço.' },
  ];
  const sinais = [
    { k: 'Download', v: '38.2 Mbps', st: 'bad', note: '19% do plano (200)' },
    { k: 'Upload', v: '41.8 Mbps', st: 'ok' },
    { k: 'Latência ociosa', v: '22 ms', st: 'ok' },
    { k: 'Bufferbloat', v: '+182 ms', st: 'bad' },
    { k: 'Wi-Fi RSSI', v: '−74 dBm', st: 'bad' },
    { k: 'Perda de pacotes', v: '1.4 %', st: 'warn' },
  ];
  const stColor = { ok: LK.success, warn: LK.warning, bad: LK.error };
  return (
    <div style={{ height: '100%', background: LK.bgPrimary, display: 'flex', flexDirection: 'column' }}>
      <TopBar leading={<Icon d={backIcon} size={22} />} title="Diagnóstico IA" trailing={<Icon d={shareIcon} size={22} />} />
      <div style={{ padding: '4px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14, overflow: 'hidden' }}>
        {/* O QUE FAZER */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: LK.textTertiary, letterSpacing: 0.5, marginBottom: 8 }}>O QUE FAZER · EM ORDEM</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recs.map((r, i) => (
              <div key={i} style={{ background: LK.bgCard, border: `1px solid ${LK.border}`, borderRadius: LK.rCard, padding: 13 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 5 }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: LK.accent, color: '#fff', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: LK.textPrimary, lineHeight: 1.3 }}>{r.t}</span>
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: r.pc, background: `${r.pc}1A`, padding: '3px 8px', borderRadius: 999, letterSpacing: 0.3, flexShrink: 0 }}>{r.p.toUpperCase()}</span>
                </div>
                <div style={{ fontSize: 11.5, color: LK.textSecondary, lineHeight: 1.45, paddingLeft: 32 }}>{r.d}</div>
                <div style={{ paddingLeft: 32, marginTop: 7 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: LK.accent }}>Ver passo a passo ›</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SINAIS ANALISADOS — evidência (recolhível) */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: LK.textTertiary, letterSpacing: 0.5 }}>SINAIS ANALISADOS</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, color: LK.textTertiary }}>recolher ▾</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {sinais.map((s, i) => (
              <div key={i} style={{ background: LK.bgSecondary, borderRadius: 10, padding: '9px 11px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: stColor[s.st] }} />
                  <span style={{ fontSize: 10, color: LK.textSecondary }}>{s.k}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: LK.textPrimary, marginTop: 2 }}>{s.v}</div>
                {s.note && <div style={{ fontSize: 9.5, color: stColor[s.st], marginTop: 1 }}>{s.note}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AÇÕES */}
      <div style={{ padding: '12px 16px', borderTop: `1px solid ${LK.border}`, background: LK.bgPrimary }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={{ flex: 1, padding: '11px 0', background: LK.accent, color: '#fff', border: 'none', borderRadius: LK.rButton, fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Icon d={shareIcon} size={15} color="#fff" /> Compartilhar laudo
          </button>
          <button style={{ width: 46, padding: '11px 0', background: 'transparent', color: LK.textPrimary, border: `1px solid ${LK.border}`, borderRadius: LK.rButton, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon d="M17.65 6.35A8 8 0 1 0 19.73 14h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35Z" size={17} color={LK.textPrimary} />
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 10, fontSize: 13, fontWeight: 600, color: LK.textSecondary }}>Falar com a operadora</div>
      </div>
    </div>
  );
}

/* ========================= 5 · CHAT LLM (do zero, tema claro) ========================= */
function LLMChat() {
  return (
    <div style={{ height: '100%', background: LK.bgPrimary, display: 'flex', flexDirection: 'column' }}>
      {/* header — TopBar centralizado, no padrão das demais telas */}
      <div style={{ padding: '14px 16px 12px', display: 'flex', alignItems: 'flex-start', gap: 12, borderBottom: `1px solid ${LK.border}` }}>
        <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center' }}>
          <Icon d={backIcon} size={22} color={LK.textPrimary} />
        </div>
        <div style={{ flex: 1, textAlign: 'center', paddingTop: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: LK.textPrimary }}>Linka</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: LK.textSecondary, marginTop: 2 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: LK.success }} /> Assistente de conexão
          </div>
        </div>
        {/* novo chat */}
        <div style={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Icon d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25ZM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z" size={19} color={LK.textTertiary} />
        </div>
      </div>

      {/* mensagens */}
      <div style={{ flex: 1, padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 20, overflow: 'hidden' }}>
        {/* user */}
        <div style={{ alignSelf: 'flex-end', maxWidth: '82%', background: LK.bgSecondary, color: LK.textPrimary, padding: '11px 14px', borderRadius: '18px 18px 5px 18px', fontSize: 14, lineHeight: 1.45 }}>
          Minha internet fica lenta toda noite. O que pode ser?
        </div>

        {/* assistant — largura total, sem balão */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: LK.accent }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, color: LK.textTertiary }}>LINKA</span>
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: LK.textPrimary }}>
            Lentidão só à noite quase sempre é <b>congestionamento</b>, não falha do seu plano. As causas mais comuns:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {[
              ['Horário de pico', 'Entre 20h e 23h todo mundo na sua região usa a rede ao mesmo tempo.'],
              ['Wi-Fi 2.4 GHz cheio', 'À noite as redes vizinhas competem pelo mesmo canal e a velocidade cai.'],
              ['Atualizações em segundo plano', 'TV, console e celular costumam baixar updates nessa janela.'],
            ].map((it, i) => (
              <div key={i} style={{ display: 'flex', gap: 11 }}>
                <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: `${LK.accent}14`, color: LK.accent, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>{i + 1}</span>
                <div style={{ fontSize: 13.5, lineHeight: 1.5, color: LK.textPrimary }}>
                  <b>{it[0]}.</b> <span style={{ color: LK.textSecondary }}>{it[1]}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.6, color: LK.textPrimary }}>
            Quer que eu meça agora e confirme qual é o seu caso?
          </div>
          {/* ação inline discreta */}
          <button style={{
            alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 7,
            background: LK.bgPrimary, color: LK.accent, border: `1px solid ${LK.accent}40`,
            borderRadius: 999, padding: '8px 14px', fontSize: 13, fontWeight: 600,
          }}>
            <Icon d="M13 3a9 9 0 0 0-9 9H1l4 4 4-4H6a7 7 0 1 1 7 7v2a9 9 0 0 0 0-18Zm-1 5v5l4 2 1-2-3-2V8h-2Z" size={15} color={LK.accent} />
            Rodar teste rápido
          </button>
        </div>
      </div>

      {/* sugestões de follow-up */}
      <div style={{ padding: '4px 14px 8px', display: 'flex', gap: 7, flexWrap: 'wrap' }}>
        {['Como troco o canal do Wi-Fi?', 'Vale a pena 5 GHz?'].map((c, i) => (
          <span key={i} style={{ fontSize: 12, color: LK.textSecondary, background: LK.bgSecondary, border: `1px solid ${LK.border}`, padding: '7px 12px', borderRadius: 999 }}>{c}</span>
        ))}
      </div>

      {/* input */}
      <div style={{ padding: '8px 12px 10px', borderTop: `1px solid ${LK.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: LK.bgSecondary, borderRadius: 24, padding: '6px 6px 6px 16px' }}>
          <span style={{ flex: 1, fontSize: 14, color: LK.textTertiary }}>Pergunte qualquer coisa…</span>
          <div style={{ width: 38, height: 38, borderRadius: 19, background: LK.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon d="M2 21l21-9L2 3v7l15 2-15 2v7Z" size={17} color="#fff" />
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 8, fontSize: 10.5, color: LK.textTertiary }}>
          A Linka roda no aparelho e pode errar. Confira dados importantes.
        </div>
      </div>
    </div>
  );
}

window.DiagSetup = DiagSetup;
window.DiagAnalyzing = DiagAnalyzing;
window.DiagResultTop = DiagResultTop;
window.DiagResultDetail = DiagResultDetail;
window.LLMChat = LLMChat;
window.DiagChat = LLMChat;
