# Auditoria — App Android SignallQ × Spec To-Be (Fluxo de Telas)

**Data:** 2026-07-13
**Referência de design:** `SignallQ App - Fluxo de Telas.dc.html` (Claude Design, projeto "SignallQ Design System")
**Código auditado:** `android/app/src/main/kotlin/io/veloo/app/kotlin/` (app Android nativo, Kotlin/Compose) — branch `design-system/fase-2-bottom-sheets`
**Método:** 7 agentes paralelos, cada um cobrindo um bloco de telas, comparando hex/tipografia/espaçamento/estrutura de componente contra a spec extraída, com citação de arquivo:linha. Auditoria somente leitura — nenhum código foi alterado.
**Telas cobertas:** 0, 1, 1a, 1b, 2, 2a, 2b, 2b-i, 2b-ii, 2b-iii, 2c, 2d, 2e, 3, 3a–3f, 4, 4a, 4b, 5, 5a–5g, 6, 6a–6f, 7.

---

## Resumo executivo

A spec To-Be define um design system MD3 completo (paleta violeta `primary=#5B21D6`, 5 níveis de `surfaceContainer`, escala tipográfica de 11 tokens, componentes base nomeados — Card/Button/SheetFrame/Segmented/etc.). O app real implementa sua **própria** paleta e tokens (`LkColors`/`LkTokens` em `SignallQTheme.kt`), estruturalmente diferentes da spec — isso não é um desvio pontual de uma tela, é a fundação de tema inteira. Por isso quase toda tela auditada carrega a mesma divergência de cor/tipografia; ela é reportada uma vez aqui e não repetida em cada seção.

Além da divergência sistêmica de tema, 3 achados são estruturais/de produto e merecem atenção antes de qualquer decisão de correção visual:

1. **Hub "Ferramentas" (tela 5) não existe.** A 5ª aba do app é "Ajustes", não "Ferramentas" — condizente com o que o `CLAUDE.md` do projeto já documenta como estado atual (5 abas: Início/Velocidade/Sinal/Histórico/Ajustes). Os destinos 5a–5g estão espalhados sem grade central, alguns atrás de feature flags.
2. **5b "Equipamento de internet" (tela única universal GPON/ONT + roteador Wi-Fi) não existe.** O código tem `FibraModemScreen.kt`, que é **só fibra** — exatamente o padrão que a spec pede para substituir. Sem enum único de "Acesso ao equipamento", sem diálogo de confirmação de reinício, sem topologia/Double NAT.
3. **Tela 7 (SignallQ AI) — remoção incompleta e um flag de release incorreto.** Nenhuma rota leva o usuário até as telas de chat/IA (isso está correto), mas as 5 telas, 12+ componentes, entidades Room de chat e os ViewModels continuam no código, **instanciados e conectados em `MainActivity.kt` a cada abertura do app**, mesmo sem UI. Mais grave: `app/build.gradle.kts:191` define `FEATURE_DIAGNOSTICO_CHAT = true` no flavor de **release**, com um comentário no próprio código dizendo que deveria estar desligado. Recomendo tratar este item como prioridade técnica separada da auditoria de design — impacta build de produção.

Outros achados recorrentes de menor severidade, mas repetidos em várias telas:
- **Grabber duplicado** em vários `ModalBottomSheet` (`HomeScreen.kt`, `GatewayConnectionSheet.kt`, `GatewayCredentialsGuideSheet.kt`) — falta `dragHandle = {}`, causando dois indicadores de arraste empilhados. Bug visual real, não só divergência de spec (outras sheets do app já usam o padrão correto).
- **5g (Jogos)** tem 0% de UI implementada — só existe a spec funcional (`docs_ai/functional/JOGOS_TESTE_CONEXAO_SPEC.md`) e um classificador de domínio isolado (`GameReadinessClassifier`), sem nenhuma tela conectada.
- **5f (Monitoramento)** só existe como sheet dentro de Ajustes, atrás de feature flag — não é uma tela própria.
- **Regra de negócio violada em 3e/3f (permissões):** os sheets de permissão de localização/telefonia reabrem a cada sessão mesmo após negação permanente do usuário — a spec exige não repetir o prompt nesse caso; o estado de dismissal é só de sessão (`SinalScreen.kt`).
- **Regra de negócio violada em 2b-i (conectar ao roteador):** não há validação de formato de IP nem checagem de alcançabilidade antes de tentar autenticar, como a spec exige.
- **2b-iii (Modelos compatíveis)** não tem UI — só o modelo de dados (`PublicCompatibilityCatalog.kt`) existe, sem Composable consumidor.

---

## Achados transversais (aplicam-se a praticamente todas as telas)

### Paleta de cores — hex não bate com a spec MD3

| Token | Spec (claro) | Spec (escuro) | App (`LkColors`) |
|---|---|---|---|
| primary / accent | `#5B21D6` | `#D0BCFF` | `#6C2BFF` |
| success | `#146C2E` | `#83DA99` | `#22C55E` |
| warning | `#8A5000` | `#FFB870` | `#F5A623` |
| error | `#BA1A1A` | `#FFB4AB` | `#FF4D4F` |
| secondary | `#2851B8` | `#AAC7FF` | não existe token equivalente (`bgSecondary` é neutro) |
| surfaceContainer (5 níveis) | `#F8F5FB`…`#E6DDF2` | `#1D1B20`…`#36343B` | só 2–3 níveis (`bgPrimary`/`bgCard`/`bgSecondary`), sem granularidade de 5 |

`MaterialTheme.colorScheme.error/errorContainer/surfaceContainer/tertiary` não são sobrescritos em `SignallQTheme.kt:138-160` — continuam no roxo MD3 baseline do Compose, então qualquer código que use esses tokens diretamente (em vez de `LkColors`) sai com cor diferente tanto da spec quanto do `LkColors` do app.

### Tipografia — escala não bate e uso inconsistente até dos próprios tokens do app

`signallQTypography` (`SignallQTheme.kt:213-228`) tem tamanhos/pesos que não batem ponto a ponto com a escala MD3 da spec (ex.: `headlineLarge` spec=26/32/700 vs app=24sp/SemiBold; `titleLarge` spec=20/26/600 vs app=16sp/Medium; `headlineSmall` spec=22/28/600 vs app=18sp/SemiBold). Além disso, muitas telas (Privacidade, Novidades, CellularInfoSheet, MedicaoTipoSheet, sheets de operadora) usam `fontSize`/`fontWeight` **hardcoded** em vez de `MaterialTheme.typography.*`, quebrando a aderência mesmo à escala própria do app, não só à da spec.

### Grabber duplicado em ModalBottomSheet

Sheets em `HomeScreen.kt`, `GatewayConnectionSheet.kt`, `GatewayCredentialsGuideSheet.kt` não passam `dragHandle = {}` ao `ModalBottomSheet`, então o handle padrão do M3 é desenhado **junto** com o `SheetDragHandle()` customizado do app — dois indicadores de arraste empilhados. Padrão correto já existe em outras sheets (`AjustesScreen.kt`, `HistoricoScreen.kt`, `MinhaConexaoScreen.kt`, `PingScreen.kt`, `SinalScreen.kt`) — é inconsistência de implementação, corrigível célula a célula.

---

## Por tela

### 0 · Onboarding
`OnboardingScreen.kt`
- ✅ CTA desabilitado até termos aceitos; cartão de termos com radius 16dp; fundo full-bleed sem chrome.
- ⚠️ 3 slides em vez de 2 (spec pede boas-vindas+termos / permissões); círculo do passo 1 é 180dp com mockup de velocímetro, não 120dp com logo; permissões mostradas como 2 `PermissaoCard` com botão "Permitir" em vez de 4 linhas com `Switch` + estado Permitido/Não permitido.
- ❌ Ícone shield 48px; checkbox "Permitir todas"; CTA final rotulado "Concluir" (app usa "Começar").

### 1 · Velocidade (Speed Test)
`SpeedTestScreen.kt`, `VelocidadeScreen.kt`, `ResultadoVelocidadeScreen.kt`, `GaugeCircular.kt`
- ✅ Cores de fase (latência/download/upload) mapeadas corretamente; Segmented Rápido/Completo/Triplo presente; cartão "Último resultado" com 3 colunas.
- ⚠️ Botão idle 210dp real (spec pede 230px); anel running com `strokeWidth=8dp` (spec pede 14); valor central do gauge em 72sp hardcoded (comentado no código como "exceção intencional"); Segmented sem borda `outline`; 3 pílulas de fase em vez de 4; bloco "Experiência de uso" virou chips horizontais em vez de 3 linhas verticais (decisão documentada em issue #833); botões finais são 2 (filled+outlined), spec pede 3 (+text).
- ❌ `NativeAd` no estado idle; toggle "Ver métricas detalhadas" na própria tela de Resultado (as métricas extras só existem dentro do sheet 1a).

### 1a · Análise detalhada
Embutido em `ResultadoVelocidadeScreen.kt` (`DiagnosticoDetalhadoSheet`) — não é arquivo/tela própria.
- ✅ Cabeçalho com ícone `AutoAwesome`; seção "Recomendações"; rodapé com cartão de operadora + "Falar com a operadora"; acordeão "Detalhes técnicos".
- ⚠️ Título "Diagnóstico detalhado" (spec pede "Análise detalhada"); container do sheet é branco puro, sem tingimento de `surfaceContainerLow`; botões de feedback são `TextButton` retos, não pílulas.
- ❌ Banner de veredito colorido (`successContainer`/`errorContainer`); estado loading com skeleton; timeout com fallback de erro; seção "Configurações" separada de "Recomendações".

### 1b · Falar com a operadora
`OperadoraBottomSheet.kt`
- ✅ Botão WhatsApp `#25D366` peso 700 — bate exatamente com a spec; botões outlined lado a lado; lista nacional/regional com selo correto.
- ⚠️ Título 20sp/700 hardcoded (nem bate com a spec nem com o `headlineSmall` do próprio tema); overlines em 10–10.5sp (fora de qualquer degrau da escala).
- ❌ Nenhum componente `SheetTitle`/`Overline` reutilizável — tudo reimplementado ad-hoc por sheet.

### 2 · Início
`HomeScreen.kt`
- ✅ Padding/gap 16dp; nós clicáveis abrem os sheets corretos; "Medir agora" delega ao mesmo motor de teste da tela 1; card "Última medição" com sparkline.
- ⚠️ Card "Caminho da sua internet" sem fundo/borda/Overline/legenda (renderizado solto na lista); nós da trilha sem preenchimento colorido (só ícone); Download/Upload com cores trocadas em relação à spec (Download=accent roxo, Upload=success verde — spec pede o oposto); valor usa `displayLarge` (34sp) em vez de `headlineLarge` (26px); cartão "Chip móvel" sem placeholder de listras diagonais.
- ❌ Texto/legenda "Caminho da sua internet" visível; gradiente success→primary na linha de conexão (usa cor sólida).

### 2a · Meu dispositivo
`HomeScreen.kt:2434-2460`
- ✅ 4 campos na ordem certa; não depende do gateway.
- ⚠️ Valor em `bodyMedium`+W600 em vez de `titleSmall`; grabber duplicado (bug real); "Sistema" hardcoded como `"Android"` em vez de vir de `Build.VERSION`.

### 2b · Roteador (Gateway)
`HomeScreen.kt:2485-2523`
- ✅ 9 campos na ordem certa; reaproveita conceito de tipo de nó (WifiRouter/Mesh/Extensor).
- ⚠️ Título dinâmico (`gateway.name`) em vez do texto fixo "Roteador da casa"; mesmos problemas de tema/grabber.
- **Achado de higiene:** existe uma segunda função `SignalQualitySheet` (`HomeScreen.kt:2583-2626`) com campos quase duplicados que não parece ser chamada de lugar nenhum visível — candidata a código morto, verificar com Camilo antes de remover.

### 2b-i · Conectar ao roteador
`GatewayConnectionSheet.kt`
- ✅ 3 estados internos com label de botão dinâmico; campo Senha com toggle de visibilidade; 2 ToggleRow com a regra "Manter conectado força Lembrar senha"; **senha via `EncryptedSharedPreferences`/AndroidKeyStore — não texto puro, conforme exigido**.
- ⚠️ Nenhum `Segmented` visual de estado renderizado (só estado interno); banner de erro por alpha, não container dedicado.
- ❌ **Validação de formato de IP e alcançabilidade antes de autenticar — ausente** (regra de negócio explícita da spec, violada); botão "Ver modelos compatíveis" não existe.

### 2b-ii · Guia de credenciais
`GatewayCredentialsGuideSheet.kt`
- ✅ Título exato; 4 passos com círculo 44dp + ícone + "Passo N"; conteúdo estático sem dependência de rede.
- ⚠️ Gap de 16dp entre passos (spec pede 24px); título do passo em `bodyLarge`+W600 em vez de `titleSmall`.
- ❌ Conteúdo diferenciado por fabricante (só existe o fallback genérico).

### 2b-iii · Modelos compatíveis
- ❌ **Tela inteira ausente.** Só existe o modelo de dados (`PublicCompatibilityCatalog.kt`, em `core/network`), sem nenhum Composable consumidor. O botão que deveria abrir essa tela (em 2b-i) também não existe.

### 2c · Internet / Provedor
`HomeScreen.kt:2527-2579`
- ✅ 5 campos na ordem certa; "DNS Privado" corretamente colorido quando ativo; detecção de CGNAT (RFC 6598) implementada de fato, não decorativa.

### 2d · Rede móvel (chip)
`HomeScreen.kt:2697-2837`
- ✅ 8 campos completos; ASU calculado corretamente (RSRP+140); SINR colorido por faixa; nota de consumo de dados.
- ⚠️ Vários textos com `fontSize` hardcoded em vez dos tokens do tema.
- ❌ **Sem fluxo de redirecionamento para permissão de telefonia ausente** — a sheet só mostra "Sem dados" em texto, não direciona ao fluxo de permissão (tela 3f) como a spec exige.

### 2e · Medir agora
`HomeScreen.kt:3377-3473`
- ✅ 3 opções com badge "Recomendado"/"Só Wi-Fi"; regra de negócio correta (Triplo só habilitado em Wi-Fi); botão Cancelar.
- ⚠️ Ícone em bloco quadrado arredondado (10dp), não círculo; título em `titleLarge` do tema (16sp) em vez de `headlineSmall`.

### 3 · Sinal
`SinalScreen.kt`
- ⚠️ 4ª tab "Dispositivos" não prevista na spec (só Wi-Fi/Canal/Móvel); Segmented de banda implementado como chips soltos sem container/borda; Badges com `radius 4dp` em vez de pílula 999px; SignalBars com 4dp de largura (spec pede 3px).
- ❌ Aba Móvel sem botão "Falar com a operadora" por chip, exigido pela spec.
- **Regra de negócio violada:** sheets de permissão (3e/3f) usam estado de dismissal só de sessão — reabrem a cada nova sessão mesmo após negação permanente, contrariando a spec explicitamente.

### 3a · Rede vizinha
`SinalScreen.kt:1781-1921`
- ✅ Estrutura de 6 linhas + divisores; não dispara novo scan ao abrir.
- ⚠️ **Os cartões de alerta/dica (canal congestionado / trocar de canal) só aparecem para a própria rede conectada, nunca para uma rede de terceiros** — contradiz o propósito da tela, que é justamente mostrar detalhe de "rede vizinha".

### 3b · Canal Wi-Fi
`SinalScreen.kt:2913-3120`
- ✅ Estrutura completa (Badge, Status, Análise, Detalhes Técnicos) bate bem com a spec; reaproveita o mesmo engine de diagnóstico da aba Canal.
- ⚠️ Título em `headlineMedium` em vez de `headlineLarge`; espaçamento de divisores 16px em vez de 20px.

### 3c · Ponto de acesso / mesh
`DispositivosScreen.kt:797-941`
- ✅ Estrutura completa (cabeçalho, aviso, campo de apelido, seção Rede) bate bem com a spec.

### 3d · Dispositivo cliente
`DispositivosScreen.kt:629-791`
- ✅ Estrutura completa, incluindo "Descoberto via" com cor `primary` condicional — bate exatamente com a spec.

### 3e · Permissão de localização / 3f · Permissão de telefonia
`PermissaoLocalizacaoContextoSheet.kt`, `PermissaoTelefoniaContextoSheet.kt`
- ✅ Ícones e CTAs corretos; 3f corretamente sem estado "bloqueada" alternável.
- ⚠️ Título em `titleLarge` em vez de `headlineSmall`; corpo em `bodyMedium` em vez de `bodyLarge`; botões lado a lado em vez de empilhados (decisão intencional de acessibilidade documentada no código, referência a issue própria).
- ❌ **Regra "não repetir se negado permanentemente" violada** (ver achado transversal acima).

### 4 · Histórico
`HistoricoScreen.kt`
- ✅ Persistência local via Room; radius/espaçamento de card conforme.
- ⚠️ Segmented Todos/Wi-Fi/Celular implementado como `FilterChip`s sem largura fixa de 220px; cards de lista muito mais ricos que o especificado (gráfico de linha, médias, tendência — superset funcional, não previsto na spec).
- ❌ `NativeAd` no topo da lista; overline "Medições recentes".

### 4a · Detalhe de teste
`HistoricoScreen.kt:1110-1367`
- ✅ Lista de linhas rotuladas completa com cor condicional; bloco "Diagnóstico" com rótulo "Gerado por IA".
- ⚠️ Título em `bodyLarge`+W600 em vez de `titleLarge`; valor da métrica primária em `displaySmall` (34px) em vez de `headlineLarge` (26px); grabber 36×4 (spec pede 32×4).

### 4b · Exportar histórico
`ExportHistoricoBottomSheet.kt`
- ✅ **Exportação real** — CSV/PDF gerados localmente (`PdfDocument`/`WebView`), share sheet nativo acionado via `Intent.ACTION_SEND`+`FileProvider`; filtro de período aplicado de fato, não decorativo.
- ⚠️ Chips de período/formato usam cor `accent` em vez de `secondary`/`secondaryContainer` (família de cor errada, não só hex); Segmented de estado "Seleção/Exportando" ausente como componente visual (só texto do botão muda).

### 5 · Ferramentas (hub)
- ❌ **Não existe.** 5ª aba é "Ajustes". Destinos 5a–5g acessados de forma dispersa (cards em Home/Sinal, itens dentro de Ajustes, alguns atrás de feature flag) — sem grade central de 7 atalhos.

### 5a · Dispositivos
`DispositivosScreen.kt`
- ✅ Estrutura de cabeçalho, seções por grupo, estados vazio/erro bem alinhados com a spec.
- ⚠️ Badge com `radius 4dp` em vez de pílula; cards sem fundo/radius por item.
- ❌ `NativeAd` no meio da lista.

### 5b · Equipamento de internet
`FibraModemScreen.kt` — **achado estrutural mais relevante da auditoria de Ferramentas**
- ❌ Tela é **só fibra**, não a versão universal (fibra+Wi-Fi) que a spec pede. Sem `DeviceSelector`, sem `WifiModule`, sem enum único de 6 estados de "Acesso ao equipamento" (só 4 estados de fibra), sem ação "Reiniciar equipamento" com diálogo de confirmação, sem `Topology`/alerta de Double NAT.
- ✅ O que existe (cards de sinal/ruído/conexão, acordeão de detalhes técnicos) está estruturado de forma razoável, mas é um subconjunto do escopo pedido.

### 5c · Ping
`PingScreen.kt`
- ✅ Estrutura completa, incluindo ~20 amostras conforme a nota de implementação.

### 5d · DNS
`DnsScreen.kt` (`DnsSheetContent`)
- ✅ Estrutura muito próxima da spec (comparativo, grade A-D, guia com tabs Dispositivo/Roteador).
- ⚠️ Existe atrás de feature flag (`FeatureFlags.DNS_SCREEN`) e como sheet, não como tela própria navegável de um hub; usa `TabRow` M3 padrão em vez do componente `Tabs` customizado da spec.

### 5e · Laudo
`LaudoScreen.kt`
- ✅ Estrutura de TopBar/banner/metadados/seções presente e funcional; PDF real com seção extra de conformidade ANATEL (fora do escopo da spec, mas extensão de produto válida).
- ⚠️ Grade de métricas é 3 pares empilhados, não grid 2×3 solto como a spec pede.
- ❌ Botão "Compartilhar laudo em PDF" no rodapé — ação só existe no ícone da TopBar.

### 5f · Monitoramento
`AjustesScreen.kt:1799-1991` (`DiagnosticoSheet`)
- ❌ Não é tela própria — existe só como sheet dentro de Ajustes, atrás de `BuildConfig.FEATURE_LINKPULSE_ATIVO`.
- ⚠️ Exige diálogo de confirmação antes de ativar (regra extra não prevista na spec, mas não necessariamente ruim); nota de bateria condicionada a fabricante de risco, não incondicional como a spec sugere.

### 5g · Jogos
- ❌ **0% de UI implementada.** Só existe a spec funcional (`docs_ai/functional/JOGOS_TESTE_CONEXAO_SPEC.md`) e o classificador de domínio isolado `GameReadinessClassifier` (com testes), sem nenhum dos 5 passos de fluxo conectados a uma tela.

### 6 · Perfil / Ajustes
`AjustesScreen.kt`
- ⚠️ Estrutura real tem 7 seções (Minha conexão/Aparência/Notificações/Histórico e dados/Avançado/Informações) em vez das 4 da spec — mais granular, com itens extras (Comprovante Anatel, Fale conosco, Diagnóstico do app) não previstos.
- ⚠️ Avatar 56dp (spec pede 52px); rótulo "Ver perfil" ausente (card leva direto ao editor).

### 6a · Meu perfil
`AjustesScreen.kt:1182-1312` (sheet, não tela própria)
- ✅ Avatar editável 80dp correto; campo de nome; botão "Salvar perfil".
- ❌ Botão de câmera sobreposto ao avatar — ausente (clique é direto no avatar inteiro).

### 6b · Minha conexão
`MinhaConexaoScreen.kt`
- ✅ Estrutura completa (3 SectionCard + botão Salvar) bate bem com a spec.
- ⚠️ Botão "Salvar" com 48dp de altura (spec pede 40px).

### 6c · Dados e privacidade
`AjustesScreen.kt:2002-2125` (`DadosLocaisSheet`)
- ✅ **Estrutura e regra de negócio corretas** — 3 ActionButton na gravidade certa (warning outline / error outline / error preenchido), cada ação passa por diálogo de confirmação, e **efeito real confirmado**: liga a `viewModel.limparHistorico()`/`apagarDadosLocais()`/`resetarApp()` em `MainActivity.kt`, não é decorativo.

### 6d · Privacidade
`PrivacidadeScreen.kt`
- ✅ Estrutura completa (TopBar, bloco de destaque, 3 seções de texto, linha final de gerenciar dados) bate bem com a spec; textos parecem refletir o comportamento real (localização para Wi-Fi scan, telefonia para 4G/5G).

### 6e · Novidades
`NovidadesScreen.kt`
- ✅ Estrutura completa (cabeçalho, lista com selos NOVO/MELHORIA/CORREÇÃO, separadores).
- ❌ **Fonte de dados é asset local embarcado no APK (`changelog.json`), não CMS/JSON remoto versionado** como a nota de implementação da spec pede — mudar o changelog exige novo release do app.

### 6f · Sobre o SignallQ
`AjustesScreen.kt:701-715` (`SimpleInfoSheet`, reaproveitado)
- ⚠️ 4 linhas em vez das 3 pedidas (inclui "Plataforma" extra).
- ⚠️ **Duplicação de conteúdo:** existe uma segunda sheet "Diagnóstico do app" (`AjustesScreen.kt:2131-2203`) com informação sobreposta de versão/plataforma — candidato a consolidação.

### 7 · SignallQ AI (descontinuada)
- ✅ **Nenhuma rota de navegação leva à funcionalidade** — confirmado por grep completo em `AppShell.kt`: nenhuma das 5 telas de chat/IA é chamada a partir de navegação real.
- ⚠️ **Código morto extenso ainda no repo:** 5 telas (`SignallQScreen.kt`, `SignallQPulseScreen.kt`, `ChatScreen.kt`, `LLMChatScreen.kt`, `ChatDiagnosticoIaScreen.kt`), 12+ componentes de UI, entidades Room de chat (`ChatMessageEntity`, `ChatSessionEntity`/`Dao`), e as classes de domínio (`SignallQOrchestrator`, `SignallQState`, `ChatDiagnosticoIaRepository`).
- ❌ **A spec exige remoção total ("nenhuma rota, componente ou dado deve existir") — não cumprida.** O `ChatDiagnosticoIaViewModel` é instanciado em `MainActivity.kt:52` e conectado com handlers completos (`MainActivity.kt:348-381`) a cada abertura do app, mesmo sem UI que os consuma — potencial I/O real (Room, chamada de rede via `AI_WORKER_URL`) sem que a feature seja jamais vista pelo usuário.
- **🔴 Achado crítico separado de design:** `app/build.gradle.kts:191` define `FEATURE_DIAGNOSTICO_CHAT = true` no flavor de **release**, com comentário no código indicando que deveria estar `false` (padrão correto já usado em `FEATURE_LINKPULSE_CHAT`, linha 197). Precisa de correção e verificação antes do próximo release candidate — risco de a IA conversacional descontinuada reaparecer em produção se algum gate condicional depender desse flag.

---

## Recomendação

Este documento é só o registro da auditoria (nenhum código foi alterado). Próximo passo natural: decidir prioridade de correção — separaria em 3 frentes:
1. **Risco técnico/release** (flag `FEATURE_DIAGNOSTICO_CHAT` em release, remoção de código morto da IA) — Camilo, antes do próximo release candidate.
2. **Regras de negócio violadas** (permissão reabrindo sempre, validação de IP ausente em 2b-i, alerta de canal só na própria rede em 3a) — bugs funcionais, não só visuais.
3. **Divergência de design system** (paleta/tipografia/componentes) — decisão de produto: alinhar o app à spec To-Be (retrofit de tema) ou atualizar a spec para refletir o `LkColors` já em produção. Isso é decisão de escopo maior, não uma correção pontual.
