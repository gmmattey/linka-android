import React, { useState } from 'react';
import { LK } from '../tokens.js';
import { hexA } from '../utils.js';
import { Icon } from '../primitives/Icon.js';

export interface DnsScreenProps {
  style?: React.CSSProperties;
}

interface DnsResult {
  nome: string;
  ms: number | null;
  grade: 'A' | 'B' | 'C' | 'D';
  atual?: boolean;
  recomendado?: boolean;
}

const resultados: DnsResult[] = [
  { nome: 'Cloudflare', ms: 9, grade: 'A', recomendado: true },
  { nome: 'Google DNS', ms: 14, grade: 'A' },
  { nome: 'DNS do Provedor', ms: 22, grade: 'B', atual: true },
  { nome: 'Quad9', ms: 31, grade: 'B' },
  { nome: 'AdGuard', ms: 48, grade: 'C' },
  { nome: 'OpenDNS', ms: null, grade: 'D' },
];

/** DNS comparison panel — current DNS block, benchmark list, recommendation, collapsible how-to guide. */
export function DnsScreen({ style }: DnsScreenProps) {
  const [view, setView] = useState<'main' | 'guide'>('main');
  const [guiaTab, setGuiaTab] = useState<'dispositivo' | 'roteador'>('dispositivo');
  const [expandido, setExpandido] = useState(false);

  const melhor = resultados.filter((r) => r.ms != null).sort((a, b) => a.ms! - b.ms!)[0];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: LK.bgPrimary, overflow: 'hidden', ...style }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {view === 'main' ? (
          <>
            <div style={{ font: `700 18px/1.3 ${LK.font}`, color: LK.textPrimary }}>Comparativo de DNS</div>
            <div style={{ font: `400 12px/1.4 ${LK.font}`, color: LK.textSecondary, marginTop: 4 }}>
              DNS afeta a abertura de sites, não a velocidade da sua conexão.
            </div>

            {/* Bloco 1 — DNS atual */}
            <div
              style={{
                marginTop: 16,
                background: LK.bgSecondary,
                borderRadius: 12,
                padding: 12,
              }}
            >
              <div style={{ font: `500 11px/1 ${LK.font}`, color: LK.textTertiary }}>Seu DNS atual</div>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 6 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ font: `600 14px/1.2 ${LK.font}`, color: LK.textPrimary }}>DNS do Provedor</div>
                  <div style={{ font: `400 11px/1.3 ${LK.font}`, color: LK.textSecondary }}>200.160.0.80</div>
                </div>
                <span style={{ font: `500 13px/1 ${LK.font}`, color: LK.textSecondary }}>22 ms</span>
              </div>
            </div>

            <div style={{ font: `400 12px/1 ${LK.font}`, color: LK.textSecondary, margin: '16px 0 12px' }}>
              Latência via DoH · menor é melhor
            </div>

            {/* Bloco 2 — Benchmark */}
            <div style={{ borderTop: `1px solid ${LK.border}` }}>
              {resultados.map((r) => (
                <div
                  key={r.nome}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '11px 0',
                    borderBottom: `1px solid ${LK.border}`,
                  }}
                >
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        font: `600 13px/1.2 ${LK.font}`,
                        color: r.recomendado ? LK.success : LK.textPrimary,
                      }}
                    >
                      {r.nome}
                    </span>
                    {r.atual && (
                      <span
                        style={{
                          font: `600 10px/1 ${LK.font}`,
                          color: LK.accent,
                          background: hexA(LK.accent, 0.12),
                          borderRadius: 4,
                          padding: '4px 8px',
                        }}
                      >
                        atual
                      </span>
                    )}
                    {r.recomendado && (
                      <span
                        style={{
                          font: `600 10px/1 ${LK.font}`,
                          color: LK.success,
                          background: hexA(LK.success, 0.12),
                          borderRadius: 4,
                          padding: '4px 8px',
                        }}
                      >
                        mais rápido
                      </span>
                    )}
                  </div>
                  {r.ms == null ? (
                    <span style={{ font: `400 12px/1 ${LK.font}`, color: LK.error }}>Falhou</span>
                  ) : (
                    <>
                      <span style={{ font: `500 13px/1 ${LK.font}`, color: LK.textSecondary, marginRight: 8 }}>{r.ms} ms</span>
                      <GradeBadge grade={r.grade} />
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Bloco 3 — Recomendação */}
            {melhor && (
              <div
                style={{
                  marginTop: 16,
                  background: hexA(LK.success, 0.08),
                  borderRadius: 12,
                  padding: 12,
                }}
              >
                <div style={{ font: `500 11px/1 ${LK.font}`, color: LK.success }}>Resultado do teste</div>
                <div style={{ font: `600 13px/1.4 ${LK.font}`, color: LK.textPrimary, marginTop: 4 }}>
                  Neste teste, {melhor.nome} respondeu mais rápido. ({melhor.ms} ms)
                </div>
                <div style={{ font: `400 12px/1.4 ${LK.font}`, color: LK.textSecondary, marginTop: 4 }}>
                  Isso não troca o DNS automaticamente. Para alterar, você precisa configurar no Android ou no roteador.
                </div>
              </div>
            )}

            {/* Bloco 4 — Guia colapsável */}
            <div style={{ marginTop: 20 }}>
              <button
                onClick={() => setExpandido((v) => !v)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  background: 'none',
                  border: 0,
                  cursor: 'pointer',
                  padding: '8px 0',
                }}
              >
                <span style={{ flex: 1, font: `600 13px/1 ${LK.font}`, color: LK.textPrimary, textAlign: 'left' }}>
                  Quando vale a pena trocar DNS?
                </span>
                <Icon name={expandido ? 'expand_less' : 'expand_more'} size={20} color={LK.textSecondary} />
              </button>

              {expandido && (
                <div style={{ paddingBottom: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ font: `500 12px/1 ${LK.font}`, color: LK.textSecondary }}>Vale a pena trocar quando:</div>
                  <Bullet text="Sites demoram para abrir mesmo com boa velocidade de download" />
                  <Bullet text="O DNS atual apresentou latência alta neste comparativo" />
                  <Bullet text="Você quer filtro de anúncios ou rastreadores (ex.: AdGuard, Quad9)" />
                  <Bullet text="Está em rede que bloqueia domínios sem motivo aparente" />

                  <div style={{ font: `500 12px/1 ${LK.font}`, color: LK.textSecondary, marginTop: 4 }}>
                    Quando não faz diferença:
                  </div>
                  <Bullet text="A lentidão é no download/upload — isso é velocidade de conexão, não DNS" />
                  <Bullet text="Todos os DNS testados tiveram latência similar (menos de 10 ms de diferença)" />
                  <Bullet text="O site que você acessa usa IP fixo em cache local" />
                </div>
              )}

              <div style={{ borderTop: `1px solid ${LK.border}`, marginTop: 8, paddingTop: 12 }}>
                <button
                  onClick={() => setView('guide')}
                  style={{
                    background: 'none',
                    border: 0,
                    cursor: 'pointer',
                    padding: 0,
                    font: `500 13px/1 ${LK.font}`,
                    color: LK.accent,
                  }}
                >
                  Como alterar meu DNS
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => setView('main')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                background: 'none',
                border: 0,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <Icon name="arrow_back" size={16} color={LK.textSecondary} />
              <span style={{ font: `400 12px/1 ${LK.font}`, color: LK.textSecondary }}>Voltar ao comparativo</span>
            </button>
            <div style={{ font: `600 16px/1.3 ${LK.font}`, color: LK.textPrimary, marginTop: 12 }}>Como alterar meu DNS</div>
            <div style={{ font: `400 12px/1 ${LK.font}`, color: LK.textSecondary, marginTop: 4 }}>
              Escolha onde prefere alterar:
            </div>

            <div style={{ display: 'flex', borderBottom: `1px solid ${LK.border}`, marginTop: 16 }}>
              {(
                [
                  ['dispositivo', 'Dispositivo'],
                  ['roteador', 'Roteador'],
                ] as const
              ).map(([id, lbl]) => {
                const on = id === guiaTab;
                return (
                  <button
                    key={id}
                    onClick={() => setGuiaTab(id)}
                    style={{
                      flex: 1,
                      background: 'none',
                      border: 0,
                      cursor: 'pointer',
                      padding: '10px 0',
                      font: `${on ? 600 : 400} 13px/1 ${LK.font}`,
                      color: on ? LK.accent : LK.textSecondary,
                      borderBottom: on ? `2px solid ${LK.accent}` : '2px solid transparent',
                      marginBottom: -1,
                    }}
                  >
                    {lbl}
                  </button>
                );
              })}
            </div>

            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {guiaTab === 'dispositivo' ? (
                <>
                  <div style={{ font: `600 13px/1 ${LK.font}`, color: LK.textPrimary }}>Android · DNS Privado</div>
                  <Step n={1} text="Abra as Configurações do sistema" />
                  <Step n={2} text="Vá em Rede e internet → DNS privado" />
                  <Step n={3} text='Selecione "Nome do host do DNS privado"' />
                  <Step n={4} text="Digite o hostname do servidor DNS desejado" />
                  <Step n={5} text="Toque em Salvar" />
                  <div style={{ font: `400 11px/1.4 ${LK.font}`, color: LK.textTertiary, marginTop: 4 }}>
                    Esta configuração afeta apenas este dispositivo.
                  </div>
                </>
              ) : (
                <>
                  <div style={{ font: `600 13px/1 ${LK.font}`, color: LK.textPrimary }}>Configurações do Roteador</div>
                  <Step n={1} text="Acesse o painel admin do roteador (geralmente 192.168.0.1 ou 192.168.1.1)" />
                  <Step n={2} text="Faça login com as credenciais (veja na etiqueta do roteador)" />
                  <Step n={3} text="Localize as configurações de Rede ou WAN" />
                  <Step n={4} text="Encontre o campo DNS primário e DNS secundário" />
                  <Step n={5} text="Insira os endereços do servidor DNS desejado" />
                  <Step n={6} text="Salve e aguarde o roteador reiniciar" />
                  <div style={{ font: `400 11px/1.4 ${LK.font}`, color: LK.textTertiary, marginTop: 4 }}>
                    Esta configuração afeta todos os dispositivos conectados à rede.
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function GradeBadge({ grade }: { grade: 'A' | 'B' | 'C' | 'D' }) {
  const color = grade === 'A' ? LK.success : grade === 'B' ? LK.accent : grade === 'C' ? LK.warning : LK.error;
  return (
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: 4,
        background: hexA(color, 0.15),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 'none',
      }}
    >
      <span style={{ font: `700 12px/1 ${LK.font}`, color }}>{grade}</span>
    </div>
  );
}

function Bullet({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: LK.textTertiary,
          marginTop: 6,
          flex: 'none',
        }}
      />
      <span style={{ font: `400 12px/1.4 ${LK.font}`, color: LK.textSecondary }}>{text}</span>
    </div>
  );
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          background: hexA(LK.accent, 0.12),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 'none',
        }}
      >
        <span style={{ font: `600 11px/1 ${LK.font}`, color: LK.accent }}>{n}</span>
      </div>
      <span style={{ font: `400 13px/1.4 ${LK.font}`, color: LK.textSecondary }}>{text}</span>
    </div>
  );
}
