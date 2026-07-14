# TESTING.md — validação GH#953 (worker `signallq-diagnostic`)

Evidência de teste da migração + correções P0/P1/P2 (issues #954, #955, #956, #957, #958, #959,
#960, #961). Cobre suíte automatizada (`node --test`) e validação manual via `wrangler dev --local`
+ D1 local + `curl`, batendo contra o worker de verdade (não só mock).

## Suíte automatizada

```
npm run verify
```

Resultado: **55/55 testes passando**, `tsc --noEmit` limpo.

32 testes originais (paridade preservada) + 23 novos cobrindo as correções desta PR.

## Cenários testados (automatizado)

| # | Cenário | Esperado | Obtido |
|---|---|---|---|
| 1 | `latency_high` em 149ms | não dispara | ✅ não disparou |
| 2 | `latency_high` em 150ms (GT estrito) | não dispara | ✅ não disparou |
| 3 | `latency_high` em 151ms | dispara | ✅ disparou |
| 4 | `bufferbloat_elevated` em 29ms | não dispara | ✅ não disparou |
| 5 | `bufferbloat_elevated` em 30ms | não dispara | ✅ não disparou |
| 6 | `bufferbloat_elevated` em 31ms | dispara | ✅ disparou |
| 7 | `bufferbloat_critical` em 99ms | não dispara (só elevated) | ✅ confirmado |
| 8 | `bufferbloat_critical` em 100ms | não dispara | ✅ não disparou |
| 9 | `bufferbloat_critical` em 101ms | dispara | ✅ disparou |
| 10 | `jitter_elevated` em 20ms / 21ms | não dispara / dispara | ✅ ambos corretos |
| 11 | perda de pacotes 0.99% / 1% / 3% | nenhum / moderate / critical | ✅ os 3 corretos |
| 12 | DNS latency 150ms / 151ms / 300ms / 301ms | nenhum / elevated / elevated / high | ✅ os 4 corretos |
| 13 | score pondera diferente por tipo de conexão (wifi vs fibra vs móvel) | score de wifi < fibra e < móvel (estabilidade pesa mais em wifi) | ✅ confirmado |
| 14 | `evaluationSource` sem D1 nem `DIAGNOSTIC_RULESET_JSON` | `BUNDLED_LOCAL` | ✅ |
| 15 | `evaluationSource` com `DIAGNOSTIC_RULESET_JSON` válido | `REMOTE` | ✅ |
| 16 | `evaluationSource` com ruleset `PUBLISHED` no D1 | `REMOTE` | ✅ |
| 17 | D1 indisponível (exceção no `prepare()`) | nunca 500 cru; payload válido, `decisao.status=inconclusive` | ✅ confirmado, HTTP 200 |
| 18 | `gameReadiness` expõe os 4 perfis reais do catálogo | `COMPETITIVE`, `COMPETITIVE_EXTREME`, `MULTIPLAYER_MODERATE`, `SPORTS_COMPETITIVE` — nunca fps/moba/casual | ✅ |
| 19 | `gameReadiness` COMPETITIVE_EXTREME fronteiras (good=30/attention=80) | bom/atencao/atencao/ruim em 30/31/80/81ms | ✅ os 4 corretos |
| 20 | `gameReadiness` MULTIPLAYER_MODERATE fronteiras (good=60/attention=150) | bom/atencao/atencao/ruim em 60/61/150/151ms | ✅ os 4 corretos |
| 21 | admin auth: senha errada | 401, sem `set-cookie` | ✅ |
| 22 | admin auth: rota `/admin/*` sem cookie | 401 | ✅ |
| 23 | admin auth: sessão expirada | 401 | ✅ |
| 24 | `/ingest/provider-detection` payload `null` | 400 tratado (não 500) | ✅ |
| 25 | `/ingest/provider-detection` `asn` com tipo errado | 400 tratado | ✅ |
| 26 | `/ingest/provider-detection` body não-JSON | 400 tratado | ✅ |
| 27 | review queue com 3 `installationHash` distintos em 5 dias | fila = elegível, `distinctInstallationsApprox=3`, `distinctDays=5` | ✅ |
| 28 | review queue com o MESMO `installationHash` repetido 8x em 8 dias | nunca elegível sozinho | ✅ confirmado — não aparece na fila |
| 29 | CORS preflight `OPTIONS` | 204 + `Access-Control-Allow-Origin` | ✅ |
| 30 | CORS em resposta normal | headers presentes | ✅ |

## Validação manual via HTTP real (`wrangler dev --local` + D1 local)

Rodado com `npx wrangler dev --local --port 8791` após aplicar as 5 migrations em D1 local
(`wrangler d1 execute signallq-diagnostic-db --local --file=...`). Todas as chamadas abaixo foram
feitas com `curl` contra o worker real rodando localmente — não mock, não simulação em memória.

**Nota de ambiente**: `compatibility_date` do `wrangler.toml` foi ajustado de `2026-07-14` para
`2026-05-09` (mesmo valor já usado por `ai-diagnosis-worker`/`game-latency-probe-worker`) porque o
binário local do `wrangler` instalado não suporta datas de compatibilidade além de `2026-05-14`.
Isso é uma defasagem normal entre o pacote `wrangler` e o runtime `workerd` embutido, não afeta o
deploy real em produção (a edge da Cloudflare sempre suporta a data atual).

| Chamada | Resultado |
|---|---|
| `GET /health` | 200, lista de rotas |
| `POST /diagnostic/evaluate` (snapshot saudável) | 200, `decisao.status=ok`, `evaluationSource=BUNDLED_LOCAL` |
| `POST /diagnostic/evaluate` (latencyMs=151) | `latency_high` presente, score=60, veredicto=regular |
| `POST /diagnostic/evaluate` (loadedLatencyMs=101, latencyMs=1) | `bufferbloat_critical` + `bufferbloat_elevated` presentes |
| `POST /diagnostic/evaluate` (sem DB populado) | `gameReadiness=[]` (D1 vazio sem sync-seed — comportamento correto, precisa seed) |
| `POST /admin/auth/bootstrap` sem secrets configurados | 500 tratado, `{"error":"Admin bootstrap not configured."}` — nunca crash cru |
| `POST /admin/auth/bootstrap` com `.dev.vars` configurado | 201, admin criado |
| `POST /admin/auth/login` senha correta | 200 + `Set-Cookie: session=...` + headers CORS |
| `POST /admin/auth/login` senha errada | 401 `{"error":"Invalid credentials."}` |
| `POST /admin/games/sync-seed` | 200, `syncedGames=6, syncedProfiles=4` |
| `POST /diagnostic/evaluate` (após sync-seed) | `gameReadiness` com os 4 perfis reais, status "bom" |
| `POST /admin/providers/sync-seed` | 200, `synced=0` — **achado**: `PROVIDER_DIRECTORY_SEED_JSON="[]"` no `wrangler.toml` sobrescreve o fallback pros seeds embutidos (`SEEDED_PROVIDERS`) com array vazio real. Ver nota em `README.md`; fora do escopo de #954-#961, registrar issue de follow-up. |
| `POST /ingest/provider-detection` payload `null` | 400 tratado |
| `POST /ingest/provider-detection` `asn` string | 400 tratado |
| `POST /ingest/provider-detection` válido com `installationHash` | 202, `eligibleForEnrichment=false` (1 install só) |
| `OPTIONS /admin/providers/review-queue` | 204 + headers CORS completos |
| `POST /admin/diagnostic/rulesets` + `/publish` (ruleset customizado v8) | 201 / 200 |
| `POST /diagnostic/evaluate` após publish | `evaluationSource=REMOTE`, `engineVersion=4`, finding `custom_latency` do ruleset publicado (prova que o D1 tem precedência real) |
| `POST /admin/diagnostic/rulesets/8/rollback` | 200 |
| `POST /diagnostic/evaluate` após rollback (sem published) | `evaluationSource=BUNDLED_LOCAL` (volta pro bundled corretamente) |
| `POST /diagnostic/evaluate` (fiber.rxPowerDbm=-30, com ruleset bundled) | `fiber_rx_power_critical` presente, copy em 2ª pessoa ("A leitura da sua fibra..."), score=35 com teto `TETO_FIBRA_RX_CRITICA=35` aplicado (score bruto ponderado 54 → capado em 35) |
| `POST /diagnostic/evaluate` (mobile 5G rsrp=-115 sinr=-2) | `mobile_signal_poor_5g`, score=67 (dimensão sinalMovel=40 "ruim" pesando 30% em conexão MOVEL) |
| `POST /diagnostic/evaluate` (wifi 2.4GHz rssi=-85, download=10) | `wifi_signal_critical_24ghz`, score=57 |
| `GET /admin/providers/review-queue` sem cookie | 401 |

Ambiente derrubado (`Stop-Process`) e `.wrangler/`/`.dev.vars` removidos ao final — não commitados.

## O que precisou de ajuste depois de testar

1. **Score da fixture "saudavel_monitorar"**: o teste original esperava `score >= 90` com a fórmula
   linear antiga (que saturava em 100 sem nenhum finding). Com o score ponderado real
   (`ScoreEngine.kt`), RSSI -57dBm/5GHz e bufferbloat de 8ms caem em "bom" (não "excelente"),
   gerando score ~87 — correto e esperado. Ajustada a fixture pra métricas realmente excelentes
   (RSSI -50, bufferbloat delta <5ms) pra manter a asserção `>=90` válida e continuar testando o
   fluxo `saudavel_monitorar` de forma significativa.
2. **Fila de review de provedores**: o teste original dependia do bug de #956 (MAX(x,3) fabricado)
   pra passar — 5 hits do mesmo device (sem `installationHash`) já enfileiravam. Corrigido pra usar
   3 `installationHash` distintos, provando o comportamento real pós-fix; adicionado teste negativo
   simétrico (mesmo hash repetido nunca enfileira sozinho).
3. **`evaluationSource` ausente no payload público**: durante a implementação percebi que
   `DiagnosticReportPayload` (o que `/diagnostic/evaluate` de fato retorna) nunca expunha
   `evaluationSource` — o campo existia só no `DiagnosticResult` interno, descartado na conversão
   pro payload de resposta. Corrigir só o motor (#954) sem propagar pro payload público deixaria o
   bug "consertado por baixo" mas invisível pro consumidor real (app/Console). Adicionado o campo
   em `DiagnosticReportPayload` e testado via HTTP real (ver seção anterior).
4. **`compatibility_date` incompatível com o `wrangler` local**: bloqueava `wrangler dev --local`
   inteiro (nem o `/health` respondia). Ajustado pro mesmo valor já usado por dois workers irmãos.
5. **`buildDiagnosticReport` precisou de um parâmetro novo (`gameProfiles`)**: pra classificar
   `gameReadiness` contra o catálogo real sem o módulo de report acessar D1 diretamente, o caller
   (`index.ts`) busca os perfis via `listGameProfiles(env)` e passa como argumento — mantém
   `diagnostic-report.ts` puro/testável sem mock de D1.

## Decisões de arquitetura registradas nesta PR

- **CORS (#960)**: aplicado globalmente (não só `/admin/*`), replicando o padrão já usado em
  `signallq-admin-worker` (`ALLOWED_ORIGIN` + `corsHeaders()`), em vez de inventar um padrão
  parcial novo. Ver README.md § CORS.
- **`diagnostic_divergences` (#961 item 4)**: removida da migration 001 — schema morto, nunca
  usado em nenhum código, worker nunca deployado com `database_id` real (sem dado em produção pra
  migrar). Se um dia for necessário registrar divergência local-vs-remoto, recriar com wiring
  completo (endpoint + call site), não só o schema solto.
- **Bufferbloat threshold (#955)**: os valores da regra declarativa (`bundled-ruleset.ts`) foram
  ajustados numericamente (30ms/100ms) comparando `loadedLatencyMs` bruto ao threshold, igual já
  fazia antes — não foi implementado o cálculo de delta (`loadedLatencyMs - latencyMs`) na regra
  declarativa porque o motor de regras só compara campo-vs-valor-estático, não campo-vs-campo. Já o
  **score engine novo** (`score-engine.ts`) usa o delta real, mais fiel ao `MetricClassifier.kt`.
  Documentado inline no código.
- **Dimensões "fibra" e "velocidade" do score engine**: `MetricClassifier.kt`/`ScoreEngine.kt` não
  documentam tabelas de faixa pra saúde óptica (RX) nem pra download/upload — são extrapolações
  documentadas a partir dos thresholds já usados em `bundled-ruleset.ts` (`FIBER_RX_POWER_LOW=-27dBm`,
  `DOWNLOAD_LOW=25Mbps`). Ver comentário no topo de `src/score-engine.ts`.
