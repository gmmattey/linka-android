# Contrato de Eventos — Firebase Analytics

**Última atualização:** 2026-06-24
**Property ID:** 542463828 (Firebase Analytics — Android)
**Status de implementação:** nenhum evento instrumentado. Contrato define o schema esperado.

---

## Estado atual

Busca realizada em `android/feature/*/src/**/*.kt` e `pwa/src/**/*` pelos
padrões `logEvent`, `FirebaseAnalytics`, `analytics.log` e equivalentes.

- **Android:** dependência `firebase-analytics-ktx` declarada em
  `android/gradle/libs.versions.toml` (linha 71), mas sem nenhuma chamada
  `logEvent` em nenhum módulo feature ou app.
- **PWA:** Firebase não inicializado. Nenhum tracking presente.

O contrato abaixo define os eventos que **devem ser implementados**, derivados
do modelo de domínio atual (v0.21.0). Qualquer evento novo ou alterado exige
atualização deste arquivo no mesmo PR.

---

## Convenções

### Nomenclatura

- Formato: `snake_case`, prefixo da feature + verbo no passado.
- Exemplos: `speedtest_iniciado`, `diagnostico_concluido`, `ia_laudo_gerado`.
- Sem acento, sem espaço, sem hífen.
- Prefixos reservados por feature:

| Prefixo | Feature |
|---|---|
| `speedtest_` | Teste de velocidade |
| `diag_` | Diagnóstico de rede |
| `ia_` | IA / laudo |
| `wifi_` | Tela Sinal / Wi-Fi |
| `historico_` | Histórico |
| `dns_` | DNS benchmark |
| `fibra_` | Modem fibra |
| `dispositivos_` | Scan de dispositivos |
| `ajustes_` | Configurações |
| `app_` | Ciclo de vida do app |

### Parâmetros

- Tipos permitidos: `String`, `Long`, `Double`, `Boolean`.
- Nomes em `snake_case`. Sem PII (sem SSID completo, sem IP público, sem BSSID).
- Enums enviados como String lowercase: `"wifi"`, `"mobile"`, `"ok"`, `"critical"`.
- Valores monetários ou de tamanho em unidade explícita no nome: `_ms`, `_mbps`, `_pct`.
- Parâmetros de versão sempre como String (`"0.21.0"`), não como número.

### Limites Firebase

- Máximo 25 parâmetros por evento.
- Nome do evento: até 40 caracteres.
- Valor de parâmetro String: até 100 caracteres.

---

## Eventos — Ciclo de vida do app

### `app_aberto`

Disparado na primeira abertura de sessão (complementa o automático `app_open`
do Firebase, mas com contexto de versão).

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `versao_app` | String | Sim | Ex.: `"0.21.0"` |
| `version_code` | Long | Sim | Ex.: `52` |
| `tipo_conexao` | String | Sim | `"wifi"` \| `"mobile"` \| `"ethernet"` \| `"desconectado"` \| `"desconhecido"` |
| `primeira_abertura` | Boolean | Não | `true` se for a primeira vez (sem histórico local) |

**Tela:** qualquer (disparado no `MainActivity.onCreate`)
**Plataforma:** Android

---

### `onboarding_concluido`

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `versao_app` | String | Sim | |
| `permissoes_concedidas` | String | Sim | Lista CSV das permissões aceitas: `"localizacao,telefonia"` |

**Tela:** `OnboardingScreen`
**Plataforma:** Android

---

## Eventos — Speedtest

### `speedtest_iniciado`

Disparado quando o usuário toca "Iniciar teste" ou o teste silencioso começa.

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `modo` | String | Sim | `"completo"` \| `"silencioso"` — de `ModoSpeedtest` |
| `tipo_conexao` | String | Sim | `"wifi"` \| `"mobile"` |
| `versao_app` | String | Sim | |

**Tela:** `SpeedTestScreen` / `MonitoramentoWorker`
**Plataforma:** Android

---

### `speedtest_concluido`

Disparado quando `ResultadoSpeedtest` é persistido com sucesso.

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `modo` | String | Sim | `"completo"` \| `"silencioso"` |
| `tipo_conexao_inicio` | String | Sim | Tipo de conexão no início do teste |
| `tipo_conexao_fim` | String | Não | Tipo de conexão ao final (pode ter mudado) |
| `download_mbps` | Double | Sim | Velocidade de download |
| `upload_mbps` | Double | Sim | Velocidade de upload |
| `latencia_ms` | Double | Sim | Latência (ping) |
| `jitter_ms` | Double | Sim | Jitter |
| `perda_pct` | Double | Sim | Perda de pacotes em % |
| `bufferbloat_ms` | Double | Sim | |
| `severidade_bufferbloat` | String | Sim | `"nenhum"` \| `"leve"` \| `"moderado"` \| `"severo"` |
| `stability_score` | Double | Sim | 0–100 |
| `contaminado` | Boolean | Sim | `true` se o teste foi comprometido |
| `duracao_ms` | Long | Não | Duração total do teste em ms |
| `versao_app` | String | Sim | |

**Tela:** `ResultadoVelocidadeScreen`
**Plataforma:** Android

---

### `speedtest_erro`

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `modo` | String | Sim | |
| `fase` | String | Sim | Fase em que falhou: `"ping"` \| `"download"` \| `"upload"` |
| `motivo` | String | Não | Mensagem de erro resumida (sem stack trace) |
| `versao_app` | String | Sim | |

**Tela:** `SpeedTestScreen`
**Plataforma:** Android

---

## Eventos — Diagnóstico de rede

### `diag_iniciado`

Disparado no início de `DiagnosticOrchestrator.executar()`.

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `tipo_conexao` | String | Sim | `"wifi"` \| `"mobile"` \| `"ethernet"` \| `"desconhecido"` |
| `areas_habilitadas` | String | Não | CSV das áreas ativas: `"internet,wifi,dns"` |
| `tem_speedtest` | Boolean | Sim | `true` se o diagnóstico recebeu `InternetDiagnosticInput` |
| `versao_app` | String | Sim | |

**Tela:** `DiagnosticoScreen`
**Plataforma:** Android

---

### `diag_concluido`

Disparado quando `EstadoDiagnostico.concluido` é emitido.

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `tipo_conexao` | String | Sim | |
| `status_geral` | String | Sim | `"ok"` \| `"info"` \| `"attention"` \| `"critical"` \| `"inconclusive"` |
| `decisao_id` | String | Sim | ID da decisão do engine: ex. `"DECISAO-04"` |
| `score_conexao` | Long | Sim | Score 0–100 |
| `confianca` | Double | Sim | 0.0–1.0 |
| `n_resultados_criticos` | Long | Não | Número de findings `critical` |
| `n_resultados_attention` | Long | Não | Número de findings `attention` |
| `versao_app` | String | Sim | |

**Tela:** `DiagnosticoScreen`
**Plataforma:** Android

---

### `diag_erro`

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `tipo_conexao` | String | Sim | |
| `motivo` | String | Não | Mensagem de erro (sem stack trace, sem dados de rede) |
| `versao_app` | String | Sim | |

**Tela:** `DiagnosticoScreen`
**Plataforma:** Android

---

## Eventos — IA / Laudo

### `ia_laudo_solicitado`

Disparado quando o app envia o payload ao Worker (`AiDiagnosisRepository`).

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `schema_version` | String | Sim | Ex.: `"4"` — de `DiagnosisAiContext.schemaVersion` |
| `prompt_version` | String | Sim | Ex.: `"diagnostico_v4_guided"` — de `AI_PROMPT_VERSION` |
| `status_diag_local` | String | Sim | Status do engine local antes de chamar a IA |
| `tem_feedback_usuario` | Boolean | Sim | `true` se o usuário digitou texto livre |
| `versao_app` | String | Sim | |

**Tela:** `DiagnosticoScreen` / `ChatDiagnosticoIaScreen`
**Plataforma:** Android

---

### `ia_laudo_recebido`

Disparado quando `AiDiagnosisResult` é parseado com sucesso.

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `schema_version` | String | Sim | |
| `prompt_version` | String | Sim | |
| `status_ia` | String | Sim | Status retornado pela IA: `"bom"` \| `"regular"` \| `"critico"` \| `"inconclusivo"` |
| `source` | String | Sim | `"cloud"` \| `"local"` (fallback) |
| `modelo_ia` | String | Não | Família do modelo: ex. `"gemma-4"` — sem revelar ID interno completo |
| `prompt_tokens` | Long | Não | Tokens de entrada consumidos |
| `completion_tokens` | Long | Não | Tokens de saída gerados |
| `total_tokens` | Long | Não | Total de tokens da requisição |
| `latencia_ms` | Long | Não | Tempo entre envio e recebimento da resposta |
| `versao_app` | String | Sim | |

**Tela:** `LaudoScreen`
**Plataforma:** Android

---

### `ia_laudo_erro`

Disparado quando a chamada ao Worker falha e o fallback local é ativado.

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `prompt_version` | String | Sim | |
| `tipo_erro` | String | Sim | `"timeout"` \| `"http_error"` \| `"parse_error"` \| `"sem_auth"` \| `"desconhecido"` |
| `http_status` | Long | Não | Código HTTP se disponível |
| `latencia_ms` | Long | Não | Tempo até a falha |
| `versao_app` | String | Sim | |

**Tela:** `DiagnosticoScreen`
**Plataforma:** Android

---

### `ia_chat_mensagem_enviada`

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `n_mensagens_sessao` | Long | Sim | Número de mensagens trocadas na sessão até agora |
| `tem_contexto_diag` | Boolean | Sim | `true` se o chat tem contexto de diagnóstico recente |
| `versao_app` | String | Sim | |

**Tela:** `LLMChatScreen` / `ChatDiagnosticoIaScreen`
**Plataforma:** Android

---

## Eventos — Wi-Fi / Sinal

### `wifi_tela_aberta`

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `tipo_conexao` | String | Sim | `"wifi"` \| `"mobile"` \| `"desconectado"` |
| `versao_app` | String | Sim | |

**Tela:** `SinalScreen`
**Plataforma:** Android

---

### `wifi_scan_concluido`

Disparado quando o scan de canais Wi-Fi retorna resultados.

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `n_redes_encontradas` | Long | Sim | Número de redes vizinhas detectadas |
| `banda` | String | Sim | `"ghz24"` \| `"ghz5"` \| `"desconhecida"` |
| `canal_atual` | Long | Não | Canal do AP conectado |
| `versao_app` | String | Sim | |

**Tela:** `SinalScreen`
**Plataforma:** Android

---

## Eventos — Histórico

### `historico_tela_aberta`

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `n_registros_locais` | Long | Não | Total de testes armazenados |
| `versao_app` | String | Sim | |

**Tela:** `HistoricoScreen`
**Plataforma:** Android

---

### `historico_exportado`

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `formato` | String | Sim | `"csv"` \| `"pdf"` |
| `n_registros` | Long | Sim | Quantidade de registros exportados |
| `versao_app` | String | Sim | |

**Tela:** `ExportHistoricoBottomSheet`
**Plataforma:** Android

---

## Eventos — DNS

### `dns_benchmark_concluido`

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `dns_atual_provider` | String | Não | Nome do provedor DNS atual (ex.: `"Cloudflare"`) |
| `dns_atual_latencia_ms` | Long | Não | |
| `dns_melhor_provider` | String | Não | Melhor DNS encontrado no benchmark |
| `dns_melhor_latencia_ms` | Long | Não | |
| `dns_grade` | String | Não | Classificação local: `"A"` \| `"B"` \| `"C"` \| `"D"` |
| `versao_app` | String | Sim | |

**Tela:** `DnsScreen`
**Plataforma:** Android

---

## Eventos — Fibra

### `fibra_tela_aberta`

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `fibra_detectada` | Boolean | Sim | `true` se o modem foi detectado |
| `versao_app` | String | Sim | |

**Tela:** `FibraModemScreen`
**Plataforma:** Android

---

## Eventos — Dispositivos

### `dispositivos_scan_iniciado`

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `versao_app` | String | Sim | |

**Tela:** `DispositivosScreen`
**Plataforma:** Android

---

### `dispositivos_scan_concluido`

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `n_dispositivos` | Long | Sim | Total de dispositivos encontrados na rede |
| `duracao_ms` | Long | Não | Duração do scan |
| `versao_app` | String | Sim | |

**Tela:** `DispositivosScreen`
**Plataforma:** Android

---

## Eventos — Configurações

### `ajustes_monitoramento_alterado`

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `ativado` | Boolean | Sim | `true` se o monitoramento passivo foi ligado |
| `versao_app` | String | Sim | |

**Tela:** `AjustesScreen`
**Plataforma:** Android

---

## Funil principal

A sequência de eventos abaixo define o funil de engajamento central do SignallQ.
Use esta ordem para análise de drop-off no Firebase:

```
app_aberto
  → speedtest_iniciado
    → speedtest_concluido
      → diag_iniciado
        → diag_concluido
          → ia_laudo_solicitado
            → ia_laudo_recebido
```

Drop entre `speedtest_concluido` e `diag_iniciado`: usuário não quis analisar.
Drop em `ia_laudo_solicitado` sem `ia_laudo_recebido`: falha de rede ou Worker.

---

## Como manter

**Regra obrigatória:** qualquer adição, remoção ou alteração de parâmetro de
evento requer atualização deste arquivo no mesmo PR que altera o código.

Checklist ao implementar um novo evento:

- [ ] Nome segue a convenção `prefixo_verbo_passado` em `snake_case`
- [ ] Sem PII nos parâmetros (sem SSID, IP, BSSID, nome de rede)
- [ ] Parâmetros dentro do limite de 25 por evento
- [ ] Tipos corretos (`String`, `Long`, `Double`, `Boolean`)
- [ ] Este arquivo atualizado com o novo evento e seus parâmetros
- [ ] Se o evento integra o funil principal, a seção "Funil principal" foi revisada

Ponto de implementação no Android: injetar `FirebaseAnalytics` via Hilt no
ViewModel da tela correspondente. Criar um `AnalyticsHelper` em `core/` para
centralizar as chamadas e evitar duplicação. Não chamar `logEvent` diretamente
em Composables.

---

## PWA

Firebase Analytics não inicializado no PWA (`pwa/src/`). Quando for
instrumentado, os eventos equivalentes devem seguir as mesmas convenções
de nome e parâmetros deste documento, adicionando `plataforma: "pwa"` como
parâmetro em todos os eventos.
