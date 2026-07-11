# Design Sync — Notas de Sincronização

## Re-sync

Para re-sincronizar após mudanças nos componentes:

```sh
cd packages/design-system
npm run build
node ../../.ds-sync/package-build.mjs
```

O `_ds_sync.json` serve como âncora de diff — componentes sem mudança de hash são pulados.

## Riscos conhecidos

- **Render check ATIVO** (desde a Fase 1, 2026-07-11): Playwright + chromium foram
  instalados em `.ds-sync/` (`npm i playwright && npx playwright install chromium`,
  local ao pacote, não versionado — reinstalar após clone novo). Todos os 26
  componentes passam por `render check` + `package-capture` (grading absoluto via
  screenshot) antes do upload. Não usar mais `--no-render-check` como atalho — ele
  pula a checagem de render em `package-validate.mjs`, mas `package-capture.mjs`
  (grading) exige chromium de qualquer forma, então o atalho só adia o problema.

- **[GRID_OVERFLOW] não-bloqueante em todas as telas full-screen**: `AjustesScreen`,
  `DispositivosScreen`, `DnsScreen`, `FibraModemScreen`, `HistoricoScreen`, `HomeScreen`,
  `LaudoScreen`, `NovidadesScreen`, `OnboardingScreen`, `PrivacidadeScreen`,
  `SignallQScreen`, `SinalScreen`, `SpeedFlow` — todas renderizam mais largas que a
  célula padrão do grid do Claude Design (o card corta a tela no preview de card,
  o conteúdo em si está correto). Não é regressão da Fase 1 — já valia para as 6 telas
  originais. Fix sugerido pelo próprio validator: `cfg.overrides.<Nome> = {"cardMode":
  "column"}` em `.design-sync/config.json`, depois `preview-rebuild.mjs --components
  <lista>`. Não aplicado ainda — cosmético, decisão de prioridade em aberto.

- **sourceKey diverge do anchor remoto mesmo sem mudança real de fonte**: ao re-rodar
  `resync.mjs` contra o `_ds_sync.json` do projeto publicado, os 19 componentes já
  existentes apareceram como `changed` (não `unchanged`) mesmo com os `.tsx` de origem
  intactos — forçando regrading completo (exigiu playwright). Causa raiz não totalmente
  isolada (não é `scriptsSha`, que bateu igual). Efeito prático: qualquer re-sync futuro
  provavelmente vai pedir regrade de tudo, não só do que mudou — grade tudo de novo
  (é rápido com os sheets prontos), não assuma `carried forward` automático.

- **Material Symbols**: As classes de ícone (ex: `wifi`, `signal_cellular_alt`) dependem
  da fonte `Material Symbols Outlined` carregada pelo `styles.css`. Se algum preview
  mostrar texto em vez de ícone, verificar se o CDN do Google Fonts está acessível.

- **ORB surfaces**: Os componentes `SignallQScreen` e `Thinking` usam fundo escuro via
  tokens `ORB` (`#0D0D1A`). O agente de design deve usar esses tokens, não `LK.bgPrimary`,
  nestas superfícies específicas.

- **Tokens CSS vs JS**: `styles/tokens.css` e `src/tokens.ts` devem permanecer em sync
  manual. Alterar um sem alterar o outro quebra paridade entre uso CSS e uso inline.

- **Header próprio por tela (sem componente `TopBar` compartilhado)**: as 7 telas da
  Fase 1 (todas overlays, sem bottom nav) implementam seu próprio cabeçalho inline
  (seta voltar + título) em vez de usar o `TopBar` existente — ele é `CenterAligned`
  com avatar, pensado para as abas principais, não para overlays com botão voltar.
  Decisão da Lia: não criar componente novo, repetir o padrão inline nas 7. Se aparecer
  uma 8ª tela do mesmo tipo, considerar extrair um `OverlayTopBar`.

- **Toggle switch duplicado — candidato a primitive público**: o pill de toggle
  (~40×24, bolinha deslizante) foi reimplementado inline em `GatewayConnectionSheet`
  (Fase 2 lote A, 1×) e `DiagnosticoSheet` (Fase 2 lote C, 5×) — mesmo código copiado.
  Recomendação da Lia: extrair para `src/primitives/Switch.tsx` público antes de crescer
  mais. Flagado como task separada (`task_3bf51fc4`), não bloqueante para o upload.

- **`PingScreenSheet` — célula `InFrame` renderiza vazia**: o sheet é curto (poucas
  linhas de conteúdo) e o wrapper de preview o posiciona em `bottom: 0` de um
  `PhoneFrame` de 820px; a célula `InFrame` do capture harness corta acima de onde o
  sheet começa, então a screenshot mostra só o scrim cinza. A célula `Standalone`
  (view principal) está correta e completa. Grade registrado como `needs-work` para
  `InFrame` — não bloqueante, mas fica marcado (não escondido). Fix possível: dar um
  `minHeight` ao container do sheet no preview wrapper, ou usar `justify-content:
  flex-end` num container de altura fixa em vez de `position: absolute; bottom: 0`.
  Não aplicado ainda.

- **Processos `chrome.exe`/`node.exe` órfãos do Playwright entre re-syncs**: cada
  `resync.mjs` com capture ativo sobe um Chromium via Playwright; em pelo menos uma
  sessão (Windows), dezenas de processos `chrome.exe` ficaram vivos entre execuções e
  travaram `rm -rf ds-bundle` com `EPERM`/`Device or resource busy` (mesmo depois do
  processo Node principal já ter saído). Mitigação usada: `taskkill /F /IM chrome.exe`
  antes de tentar remover `ds-bundle/`; se o lock persistir mesmo assim, usar um
  `--out` alternativo (`ds-bundle2`) para a rodada e limpar os dois ao final. Verificar
  processos órfãos (`tasklist`) antes de cada re-sync em vez de assumir que o anterior
  encerrou tudo sozinho.

## Cobertura por fase

**Fase 1 (2026-07-11) — telas/overlays full-screen que faltavam:** `DispositivosScreen`,
`FibraModemScreen`, `DnsScreen` (no app real é bottom sheet; aqui virou painel full),
`LaudoScreen`, `PrivacidadeScreen`, `NovidadesScreen`, `OnboardingScreen`. Fonte: leitura
direta do Kotlin real em `android/app/src/main/kotlin/io/veloo/app/kotlin/ui/screen/`
(inventário completo, não só a doc antiga de `ui_kits/android/`).

**Fase 2 (2026-07-11) — bottom sheets, completa. 24 sheets + o novo layout primitive
`SheetFrame`** (fundo branco, cantos superiores 24px, alcinha de drag centralizada —
sem título/close embutido, cada sheet renderiza seu próprio conteúdo como children,
fiel ao `ModalBottomSheet` real do Android que é dispensado por swipe/scrim, não por
botão X):

- **Home**: `DeviceInfoSheet`, `GatewayInfoSheet`, `GatewayConnectionSheet` (3 estados:
  Formulário/Conectando/Erro), `GatewayCredentialsGuideSheet`, `InternetInfoSheet`,
  `CellularInfoSheet`, `MedicaoTipoSheet`.
- **Velocidade + Sinal**: `DiagnosticoDetalhadoSheet`, `OperadoraBottomSheet`,
  `PingScreenSheet` (nome real do Kotlin é `PingScreen`, sufixo `Sheet` adicionado pra
  não colidir com a convenção de `screens/`), `NetworkDetailSheet`, `ChannelDetailSheet`,
  `PermissaoLocalizacaoContextoSheet` (2 estados: Solicitar/Bloqueada),
  `PermissaoTelefoniaContextoSheet`.
- **Dispositivos + Histórico + Ajustes**: `DeviceDetailSheet`, `MeshApSheet`,
  `HistoricoDetailSheet`, `ExportHistoricoBottomSheet` (2 estados: Seleção/Exportando),
  `PerfilEditSheet`, `SimpleInfoSheet`, `DiagnosticoSheet`, `DadosLocaisSheet`,
  `DiagnosticoAppSheet`, `MinhaConexaoSheet` (nome real do Kotlin é
  `MinhaConexaoScreen`, mesmo raciocínio do `PingScreenSheet`).

Helpers internos não exportados no barrel público (`src/sheets/_shared.tsx`):
`SheetInfoRow`, `SheetTitle`, `StatePillSwitcher` (o seletor de pills usado pra
prototipar múltiplos estados dentro de um único componente — mesmo padrão já usado em
`DispositivosScreen`/`FibraModemScreen` na Fase 1).

Total do design system após a Fase 2: **51 componentes publicados** (19 primitivos/
layout/animação + 6 telas antigas + 7 telas da Fase 1 + 24 sheets da Fase 2 - contando
`SheetFrame` como layout).

## Deliberadamente fora de escopo

- **Cluster de chat IA órfão**: `ChatDiagnosticoIaScreen`, `SignallQScreen` (versão
  Android — não confundir com o `SignallQScreen` deste pacote, que é a superfície de
  IA conceitual/genérica), `ChatScreen`, `LLMChatScreen`, `SignallQPulseScreen`. Código
  completo no Android mas **sem call site ativo** no `AppShell.kt` atual — decisão
  2026-07-11: não sincronizar enquanto não houver navegação real até essas telas.
  Reavaliar se a feature for reativada.
- **Componentes confirmados dead code** (não navegáveis, alguns com comentário
  explícito no próprio código Android): `GamerSheet`/`GamerShortcutCard`,
  `SignalQualitySheet`/`QualidadePlaceholderSheet`, `QualidadeShortcutRow`,
  `ExperienciaDeUsoSection`, `WifiFactorsSection` (todos em `HomeScreen.kt`),
  `ProvedorSheet`/`PreferenciasSheet` (em `AjustesScreen.kt`).
- `SpeedGauge` como componente próprio — a animação de gauge já está coberta dentro
  de `SpeedFlow`, não precisa de extração separada por ora.
