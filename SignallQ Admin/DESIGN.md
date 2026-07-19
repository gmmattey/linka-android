---
name: SignallQ Admin
description: Console técnico do SignallQ — uso, diagnósticos, IA/custos, erros e saúde do sistema em um só painel.
status: consolidado 2026-07-19 — cobertura completa (tokens, profundidade, catálogo de
  componentes, estados, gráficos, acessibilidade, responsividade, governança, mapeamento
  React) equivalente ao DESIGN.md do app consumer e do Pro. Paleta e navegação seguem o
  protótipo To-Be MD3 confirmado em `signallq-admin-fluxo-tobe-md3` (projeto Claude Design
  "SignallQ — Protótipos", e77ea465-291f-4bf5-930c-a267680da04e) — ver
  docs_ai/design-system/PLANO_APLICACAO_TOBE_CONSOLE_2026-07-17.md e
  docs_ai/design-system/FASE1_TOKENS_CONSOLE_MD3_TOBE_2026-07-16.md (tokens de cor, ainda
  válidos). Código real (`src/index.css`) já está migrado para essa paleta desde antes desta
  consolidação — ver seção 0.
colors:
  primary-light: "#6C2BFF"
  primary-dark: "#CFBCFF"
  on-primary-light: "#FFFFFF"
  on-primary-dark: "#38008C"
  secondary-light: "#1A73E8"
  secondary-dark: "#8AB4F8"
  success-light: "#1E8E3E"
  success-dark: "#7DDB93"
  attention-light: "#8A5300"
  attention-dark: "#FFB955"
  error-light: "#BA1A1A"
  error-dark: "#FFB4AB"
  error-container-light: "#FFDAD6"
  error-container-dark: "#93000A"
  on-error-container-light: "#410002"
  on-error-container-dark: "#FFDAD6"
  bg-base-light: "#FEF7FF"
  bg-base-dark: "#141019"
  bg-sidebar-light: "#F7F2FA"
  bg-sidebar-dark: "#1D1A22"
  bg-surface-light: "#ECE6F0"
  bg-surface-dark: "#2B2831"
  bg-surface-variant-light: "#FFFFFF"
  bg-surface-variant-dark: "#211E27"
  border-light: "#CAC4D0"
  border-dark: "#49454F"
  text-primary-light: "#1D1B20"
  text-primary-dark: "#E6E0E9"
  text-secondary-light: "#49454F"
  text-secondary-dark: "#CAC4D0"
  text-tertiary-light: "#79747E"
  text-tertiary-dark: "#938F99"
  nav-active-bg-light: "#E8DEF8"
  nav-active-bg-dark: "#4A4458"
  nav-active-on-light: "#1E192B"
  nav-active-on-dark: "#E8DEF8"
  phase-latency: "#60A5FA"
  phase-download: "#34D399"
  phase-upload: "#FBBF24"
  provider-cloudflare: "#7C3AED"
  provider-openai: "#2563EB"
  provider-anthropic: "#E040FB"
  provider-local: "#71717A"
typography:
  display:
    fontFamily: "Roboto, ui-sans-serif, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Roboto, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Roboto, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Roboto, ui-sans-serif, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.08em"
  mono:
    fontFamily: "Roboto Mono, ui-monospace, SFMono-Regular, monospace"
    fontSize: "9px"
    fontWeight: 400
    lineHeight: 1.3
rounded:
  card: "12px"
  button: "full"
  input: "12px"
  pill: "999px"
  nav-item-drawer: "23px"
  nav-item-rail: "16px"
  nav-item-bottomnav: "16px"
  segmented-chip: "20px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.button}"
    padding: "8px 14px"
  button-secondary:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.button}"
    padding: "8px 14px"
  card-section:
    backgroundColor: "{colors.bg-surface}"
    rounded: "{rounded.card}"
    padding: "24px"
  card-metric:
    backgroundColor: "{colors.bg-surface}"
    rounded: "{rounded.card}"
    padding: "20px"
  badge-status:
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  nav-drawer:
    width: "300px"
    backgroundColor: "{colors.bg-sidebar}"
  nav-rail:
    width: "88px"
    backgroundColor: "{colors.bg-sidebar}"
  nav-bottom:
    height: "80px"
    backgroundColor: "{colors.bg-sidebar}"
---

# Design System: SignallQ Admin

## 0. Fonte de verdade

Este documento descreve o protótipo Claude Design **`signallq-admin-fluxo-tobe-md3`**
(`Md3Screen00Login`, `Md3Screen01Overview`, `Md3DashboardContent`/`Md3DashboardContentMobile`,
`Md3NavDrawer`, `Md3NavRail`, `Md3BottomNav`) — fonte de verdade de cor, tokens e componentes de
navegação do Console (ver `docs_ai/design-system/DECISAO_CORES_CONSOLE_PROTOTIPO_MD3_TOBE_2026-07-16.md`
e `PLANO_APLICACAO_TOBE_CONSOLE_2026-07-17.md`).

**Correção 2026-07-19:** a versão anterior desta seção afirmava que `src/index.css` ainda usava "a
paleta preta/flat antiga" e tratava isso como bug de implementação pendente. Verificado diretamente
no código nesta consolidação — **isso não é mais verdade**. `src/index.css` já contém a paleta tonal
roxa completa (`--primary: #6C2BFF` claro / `#CFBCFF` escuro, `--bg-base: #FEF7FF`/`#141019` etc.),
idêntica ao frontmatter deste documento. A migração de cor foi concluída antes desta auditoria; a
nota anterior ficou desatualizada e é corrigida aqui — não recriar o registro de "bug pendente" sem
reconferir o código primeiro.

O que ainda é lacuna real (detalhado na seção 6, "Profundidade"): o sistema de sombra/elevação do
Console não tem vocabulário formal — o código usa `box-shadow` em pelo menos 8 lugares diferentes
(hover de card, chip ativo, foco de input, glow de topbar, badge de ambiente), cada um com seu
próprio valor ad-hoc, sem nome nem regra de quando aplicar. Essa consolidação fecha essa lacuna.

## 1. Overview

**Creative North Star: "The Operator's Console"**

O Admin do SignallQ é a sala de operação técnica do produto — modelo Google Play Console e
Cloudflare Dashboard, não SaaS de métrica bonita. A superfície segue a paleta tonal Material 3
baseline roxa: claro sobre `#FEF7FF`, escuro sobre `#141019`. O acento de ação é o violeta `#6C2BFF`
(claro) / `#CFBCFF` (escuro, tone 80) — o mesmo eixo de cor do app SignallQ Android, mantido
deliberadamente como ponte de identidade (distinto do azul `#0B6CFF` do SignallQ Pro — nunca
misturar as duas paletas). Cor de status (verde/âmbar/vermelho/azul) carrega significado real de
saúde do sistema, nunca decoração.

O sistema rejeita explicitamente o dashboard SaaS genérico — cards decorativos, gradiente
"hero-metric", ilustração — e qualquer tom "fofo" de app consumidor. Aqui a confiança vem da
sobriedade tonal: hierarquia tipográfica rígida, superfícies com fill tonal (`bg-surface`/
`bg-sidebar`) + borda 1px, e alerta tratado como informação objetiva, nunca como alarme visual.

**Key Characteristics:**
- Paleta tonal M3 baseline roxa por tema — claro (`#FEF7FF`/`#ECE6F0`) e escuro (`#141019`/
  `#2B2831`), ambos com a mesma sobriedade — nenhum dos dois é "mais casual".
- Acento de ação (`primary`) muda de tom por tema — `#6C2BFF` claro, `#CFBCFF` escuro (tone 80).
- Semântica de status (verde/âmbar/vermelho/azul) recalibrada por tema para manter contraste AA.
- Cards com fill tonal (`bg-surface`) + borda 1px; sombra reservada a interação/sobreposição, nunca
  decoração estática (ver seção 6, Profundidade).
- Tipografia mono (Roboto Mono) reservada a metadados técnicos (fonte de dado, timestamps).

## 2. Colors

Paleta tonal Material 3 baseline roxa (claro sobre `#FEF7FF`, escuro sobre `#141019`); o acento
`primary` satura em CTA e nav ativa, e a semântica de status faz o trabalho pesado de significado —
com valores próprios por tema para preservar contraste AA.

### Primary
- **Signal Violet claro** (`#6C2BFF`) / **Signal Violet escuro** (`#CFBCFF`, tone 80): CTA
  primário, nav ativa, foco de input. `on-primary` é `#FFFFFF` no claro e `#38008C` no escuro —
  texto do botão "Entrar" sempre em contraste AA sobre o tom do tema.

### Secondary
- **Rede & Operadora** (`#1A73E8` claro / `#8AB4F8` escuro): dot/série ligada à categoria "Rede &
  Operadora" no dashboard.

### Tertiary
- **Phase Latency** (`#60A5FA`), **Phase Download** (`#34D399`), **Phase Upload** (`#FBBF24`):
  cores dedicadas às três fases do SpeedTest, usadas só em gráficos de performance de rede.
- **Provider Cloudflare** (`#7C3AED`), **Provider OpenAI** (`#2563EB`), **Provider Anthropic**
  (`#E040FB`), **Provider Local** (`#71717A`): série de cor fixa por provedor de IA nos gráficos de
  custo. **Divergência confirmada:** `src/config/designTokens.ts` mantém uma segunda cópia dessas
  cores para uso em SVG/Recharts (`SQ_TOKENS`), e ela diverge do CSS em `success`/`warning`/`error`
  (ver seção 13, Governança, item de débito).

### Neutral
- **Bg Base** (`#FEF7FF` claro / `#141019` escuro): fundo de página — nível 0 de profundidade.
- **Bg Sidebar** (`#F7F2FA` claro / `#1D1A22` escuro): superfície de navegação (drawer/rail/bottom
  nav).
- **Bg Surface** (`#ECE6F0` claro / `#2B2831` escuro): cards e superfícies de conteúdo — nível 1.
- **Bg Surface Variant** (`#FFFFFF` claro / `#211E27` escuro, com borda `#CAC4D0`/`#49454F`): fundo
  contrastante de chip/menu (ex.: chip segmentado PROD/STG do TopAppBar, input do Login).
- **Text Primary** (`#1D1B20` claro / `#E6E0E9` escuro): título, valor de métrica.
- **Text Secondary** (`#49454F` claro / `#CAC4D0` escuro): descrição, corpo.
- **Text Tertiary** (`#79747E` claro / `#938F99` escuro): labels, timestamps, fonte de dado.
- **Border** (`#CAC4D0` claro / `#49454F` escuro): toda separação de superfície onde sombra não é
  necessária.

### Status
- **Success** (`#1E8E3E` claro / `#7DDB93` escuro): saudável, estável, OK.
- **Attention** (`#8A5300` claro / `#FFB955` escuro): atenção, beta, cache.
- **Error** (`#BA1A1A` claro / `#FFB4AB` escuro): crítico, falha, pausado.
- **Error Container** (`#FFDAD6` claro / `#93000A` escuro, com `on-error-container` `#410002` /
  `#FFDAD6`): badge de contagem em item de nav (ex.: "Problemas & Incidentes").
- **Info** (`var(--info)`, azul — usado em `StatusBadge` status `"info"`): série neutro-informativa
  sem urgência.

### Named Rules
**The One Accent Rule.** O acento `primary` aparece só em CTA, nav ativa e foco — nunca como fundo
geral. Se uma tela pede mais destaque visual, o destaque é semântico (status), nunca de marca.

**The Per-Theme Semantic Rule.** Success/Attention/Error/Info e o próprio `primary` têm valores
diferentes em dark e light — nunca reutilizar o hex de um tema no outro; cada par foi calibrado
para contraste AA sobre a superfície daquele tema.

**Verde/âmbar/vermelho só carregam significado real** (saúde do sistema) — nunca decoração. Não usar
essas três cores fora de contexto de status.

## 3. Typography

**Display Font:** Roboto (com fallback `ui-sans-serif, system-ui, sans-serif`).
**Mono Font:** Roboto Mono — reservado a metadados técnicos (fonte do dado, timestamps, IDs).

**Character:** Uma família sans carrega toda a hierarquia funcional; o mono aparece só como marcador
técnico discreto, nunca como corpo de texto. Números grandes com tracking negativo (`-0.03em`) são o
tratamento assinatura de métrica — mesma lógica do app Android, aplicada ao contexto denso do
console.

### Hierarchy
- **Display** (700, 24–28px, tracking `-0.03em`): valor hero de métrica (`MetricCard`). Uso: 1 por
  card, nunca corpo de texto.
- **Headline** (600, 14px, tracking `-0.01em`): título de card/seção (`SectionCard`, `ChartCard`).
  Máx. 1 linha — truncar com `title` HTML se necessário, não deixar quebrar em 2 linhas.
- **Body** (400, 13px, 1.5): descrição de seção, texto corrido (`InsightBlock`, descrição de
  `SectionCard`). Máx. 2–3 linhas em bloco de card; texto mais longo pertence a modal/página
  dedicada, não a card compacto.
- **Label** (600, 11px, tracking `0.08em`, UPPERCASE): label de métrica, label de filtro, overline
  de `SectionIntro`. Nunca em frase completa — só substantivo/rótulo curto.
- **Mono** (400, 9–11px): fonte de dado, timestamp — sempre `text-tertiary`. Nunca como valor
  principal de métrica (isso é papel do Display).

### Named Rules
**The Verdict-Beside-Metric Rule.** KPI de qualidade (crash rate, retenção, latência) nunca aparece
sem o veredito humano (Excelente/Bom/Regular/Fraco/Forte) ao lado — herdado do app Android; KPI de
volume puro pode dispensar veredito quando a tendência já comunica direção.

## 4. Spacing & Grid

Grid de 4px com 6 degraus nomeados (mais compacto que o grid de 8dp do app Android/Pro — o Console
é denso por natureza, tela de operação técnica, não superfície de consumo):

| Token | Valor |
|---|---|
| `xs` | 4px |
| `sm` | 8px |
| `md` | 12px |
| `lg` | 16px |
| `xl` | 24px |
| `xxl` | 32px |

### Regras de aplicação
- **Padding interno de card:** `SectionCard` usa `24px` (`xl`) no header e no body; `MetricCard`
  usa `20px` (entre `lg` e `xl`, valor próprio documentado — não arredondar para `xl` sem checar o
  componente real).
- **Gap entre cards de uma mesma seção/grid:** `16px` (`lg`) é o padrão observado nos grids de
  `MetricCard`/`ChartCard`; `12px` (`md`) em listas mais densas (`AlertList`, `Quota Row`).
- **Margem de página:** o conteúdo da página vive dentro do padding do `AppLayout` — não duplicar
  margem extra por `Page`/`Screen` individual.
- **Separação de seção para seção (vertical):** `24–32px` (`xl`/`xxl`) — nunca menor que o padding
  interno do card acima dela, para a hierarquia de agrupamento ficar clara.

## 5. Shape & Radius

| Componente | Radius |
|---|---|
| Card (`SectionCard`, `MetricCard`, `ChartCard`, `EmptyState`, `InsightBlock`) | `12px` |
| Button (primary/secondary) | full/pill (altura ÷ 2 — ex.: botão "Entrar" `height:54px` → `radius:27px`, não um valor fixo) |
| Input / Select | `12px` |
| Badge / Chip (`StatusBadge`, pill) | `999px` |
| Segmented chip (PROD/STG, período) | `20px` |
| Nav item — drawer | `23px` |
| Nav item — rail / bottom nav | `16px` |

### Quando usar card vs. borda vs. "flat"
O Console tem histórico real de **card-itis** — envolver qualquer bloco de conteúdo em mais um card
aninhado só por hábito, mesmo quando ele já vive dentro de um card pai. Regra:
- Use **card completo** (`bg-surface` + borda 1px + radius `12px`) para uma unidade de conteúdo que
  é navegável, comparável a outras unidades da mesma grade, ou precisa se destacar do fundo da
  página (nível 1 de profundidade — ver seção 6).
- Use **só borda ou separador** (sem novo `bg-surface`) para subdividir conteúdo *dentro* de um card
  que já existe — ex.: linha de `DataTable`, linha de `Quota Row`, item de `AlertList`. Um card
  dentro de um card é o sintoma clássico de card-itis.
- Use **flat** (nenhuma borda, só espaçamento) quando a separação visual já é óbvia por hierarquia
  tipográfica ou por já estar dentro de um container com padding — ex.: header + body de
  `SectionCard` não precisam de mais uma borda interna além do `border-bottom` que já existe entre
  eles.
- **Regra dura de aninhamento:** no máximo 2 níveis visuais de card empilhado (ex.: `SectionCard` >
  `Quota Row` linha). Um terceiro nível de card dentro de card é sinal de que o conteúdo devia ser
  uma seção própria, não mais aninhamento.

## 6. Profundidade (Depth & Elevation)

Sistema de 4 níveis — a mesma regra aplicada no design system do app consumer e do SignallQ Pro,
adaptada aos tokens do Console. Profundidade comunica **hierarquia e interação**, nunca decoração.
Esta seção formaliza o que hoje é comportamento real do código (`.sq-card-hover`, `shadow-sm` de
chip, `box-shadow` inline de 6 componentes), sem inventar valor novo — só nomeia e documenta onde
cada nível se aplica.

### Nível 0 — Fundo da tela
Plano base, sem sombra. Token: `--bg-base` (`#FEF7FF` claro / `#141019` escuro).

### Nível 1 — Conteúdo agrupado
Cards comuns, métricas, tabelas, seções. Diferença tonal sutil (`--bg-surface` sobre `--bg-base`),
**sem sombra estática** — mantém a regra Flat-By-Default. Borda 1px `--border` só quando necessário
para separar do fundo. É o estado de repouso de `SectionCard`, `MetricCard`, `ChartCard`,
`InsightBlock`, `EmptyState`, `AlertList`.

### Nível 2 — Interativo/destacado
Card com hover, chip/filtro selecionado, linha de tabela em foco. Contraste tonal maior, sombra
discreta permitida — é exatamente o que já existe hoje, sem nome oficial até esta consolidação:
- **Hover de card** (`sq-card-hover:hover`, classe usada por `SectionCard`/`ChartCard`):
  `box-shadow: 0 14px 32px -14px rgba(20,20,45,.18)` claro / `0 16px 36px -12px rgba(0,0,0,.6), 0 0
  0 1px rgba(255,255,255,.05)` escuro. Nome oficial: **`shadow-level-2-hover`**.
- **Chip/badge ativo** (`shadow-sm` em `DiagnosticsFilters.tsx`): sombra utilitária Tailwind padrão,
  reservada a estado selecionado de chip de filtro. Nome oficial: **`shadow-level-2-selected`**.
- **Token de superfície-alvo:** `--sq-bg-elevated`. Hoje (`src/index.css`) aponta pro mesmo valor de
  `--bg-surface` (nível 1) — **isso é débito de implementação, não decisão de design** (ver seção
  13). O valor-alvo deveria ser um passo tonal acima de `--bg-surface` no mesmo tema (mais claro no
  light, mais claro/mais saturado no dark), para que nível 1 e nível 2 sejam visualmente
  distinguíveis mesmo sem hover ativo (ex.: card já marcado como "selecionado" permanente).

### Nível 3 — Sobreposto
Modais, dropdowns, tooltips, dialogs. Separação clara do conteúdo abaixo — sombra mais pronunciada
e/ou scrim.
- **Token de superfície-alvo:** `--sq-bg-overlay`. Hoje aponta pro mesmo valor de
  `--bg-surface-hover` — precisa de valor próprio, mais destacado que nível 1 e nível 2 (débito, ver
  seção 13).
- **Scrim (novo — não implementado hoje):** o Console **não tem nenhum overlay/scrim implementado**
  em modal ou dropdown atualmente. Especificação-alvo, reaproveitando os valores já usados no app
  consumer/Pro para consistência entre produtos: `--sq-scrim: rgba(0,0,0,.5)` claro /
  `rgba(0,0,0,.6)` escuro, aplicado atrás de todo modal/dialog/dropdown que cubra conteúdo abaixo.
- **Sombra de elemento flutuante isolado** (ex.: glow do botão ativo do `Topbar`,
  `box-shadow: 0 4px 12px rgba(primary, 20%)`): nome oficial **`shadow-level-3-floating`** — reservado
  a elemento que já é ele mesmo uma ação flutuante (botão de ambiente ativo), não card comum.

### Vocabulário de sombra nomeado (consolidado)
| Nome | Uso | Valor light | Valor dark |
|---|---|---|---|
| `shadow-focus-ring` | Foco funcional de input/select | `0 0 0 2px` acento a 40% alpha | idem |
| `shadow-level-2-hover` | Hover de `SectionCard`/`ChartCard` | `0 14px 32px -14px rgba(20,20,45,.18)` | `0 16px 36px -12px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.05)` |
| `shadow-level-2-selected` | Chip/filtro selecionado (`DiagnosticsFilters`) | `shadow-sm` (Tailwind) | idem |
| `shadow-level-3-floating` | Elemento de ação flutuante isolado (badge de ambiente, glow de topbar) | `0 4px 12px rgba(primary,.2)` / `0 12px 28px -8px rgba(0,0,0,.35)` (NavRail) | idem, mais pronunciado |
| `scrim` (novo, alvo) | Fundo de modal/dropdown/dialog | `rgba(0,0,0,.5)` | `rgba(0,0,0,.6)` |

### Named Rules (regras de aplicação obrigatórias)
- Profundidade comunica hierarquia/interação, nunca decoração.
- Card não deve parecer elevado se não for interativo ou prioritário — a Flat-By-Default Rule segue
  valendo para o estado de repouso (nível 1); só nível 2/3 ganham sombra.
- Evitar sombra forte no tema escuro — priorizar elevação tonal; o hover dark de `.sq-card-hover` já
  segue essa regra (sombra mais opaca, mas com borda de luz de 1px em vez de sombra colorida
  agressiva) — manter esse padrão em qualquer sombra nova.
- Sem glow permanente — o `blur(20px)` decorativo de `MetricCard` é aceitável como acento pontual de
  card específico (não generalizar para todo card).
- Sem glassmorphism como linguagem principal — não existe hoje, continua proibido.
- Sem gradiente em todo componente — os gradientes hoje (barra de progresso, avatar, área de
  gráfico) já são pontuais; devem continuar restritos a ação principal, estado especial, marca,
  visualização de dado.
- Nunca misturar borda + sombra + glow + gradiente no mesmo elemento.
- Profundidade igual para componentes equivalentes — todos os cards de `SectionCard`/`MetricCard`/
  `ChartCard` seguem o mesmo nível a menos que um seja genuinamente mais interativo que os outros na
  mesma tela.
- Seleção usa diferença de superfície + cor, não só sombra (ver `shadow-level-2-selected`, sempre
  acompanhado de mudança de `background`/`color`, nunca sombra isolada).
- Cards aninhados no máximo 2 níveis visuais (ver seção 5).
- Navegação (`Sidebar`/`NavRail`/`BottomNav`) é superfície acima do conteúdo sem sombra pesada — usa
  `--bg-sidebar` (diferença tonal), não sombra, para se separar do conteúdo.

**Tema escuro:** superfícies mais elevadas ligeiramente mais claras que o fundo, nunca preto
absoluto em toda camada, contraste tonal progressivo, bordas com baixa opacidade. Este é o critério
de aceite mais importante do Console — histórico real de "vários retângulos cinza idênticos" no
dark quando `--sq-bg-elevated`/`--sq-bg-overlay` não têm valor próprio (ver débito, seção 13).

**Tema claro:** diferença de branco/cinza-claro entre planos, sombras leves/difusas/pouco opacas,
bordas sutis quando sombra não for necessária.

### Critérios de aceite
- Usuário percebe claramente fundo / conteúdo / seleção / sobreposição.
- Card comum não parece modal.
- Modal/dropdown se destaca do conteúdo abaixo (hoje não se destaca — não há scrim, ver débito).
- Elemento interativo é identificável sem depender só de sombra.
- Profundidade consistente entre todas as telas do Console.
- Tema escuro não pode parecer uma coleção de retângulos cinza no mesmo plano.

## 7. Components

Catálogo completo — os componentes já documentados em versões anteriores mais os que existem em
`src/components/ui/` e `src/components/charts/` e ainda não tinham entrada formal aqui.

### Buttons
- **Shape:** radius full/pill — botão "Entrar" do Login usa `height:54px` + `border-radius:27px`
  (radius = altura/2), não um valor fixo tipo 12/16/20px.
- **Primary:** fill `{colors.primary}`, texto `{colors.on-primary}`, padding `8px 14px`.
- **Secondary:** fill `bg-surface`, borda 1px `border`, texto `text-secondary`.
- **Segmented chip** (ex.: PROD/STG, período no TopAppBar): radius fixo `20px` (não pill) —
  container com múltiplas abas, aba ativa em `nav-active-bg`/`nav-active-on`, aba inativa sem
  fundo.
- **Hover / Focus:** transição de cor via `transition-all`; foco funcional usa o anel de 2px na cor
  do acento (`shadow-focus-ring`).

### Badges / Status (`StatusBadge`)
- **Style:** fully-rounded (`rounded-full`), fill da cor semântica a 10% de alpha, borda a 20% de
  alpha, texto na cor sólida, dot indicador à esquerda (pulsa quando `ok`/`stable`/`success`).
- **Badge de contagem** (ex.: item de nav "Problemas & Incidentes"): círculo com fill
  `error-container` / texto `on-error-container`.
- **Semântica:** verde=saudável, âmbar=atenção, vermelho=crítico, cinza=obsoleto/neutro, azul=info —
  nunca cor sozinha, sempre dot + texto + label. Ver catálogo completo de estados na seção 8.

### Cards / Containers
- **`SectionCard`** (`src/components/ui/SectionCard.tsx`): container padrão de seção — header
  (título + descrição opcional + ações) com `border-bottom`, body com `children`. `12px` radius,
  `bg-surface`, borda 1px, `sq-card-hover` (nível 2 no hover). Finalidade: agrupar um bloco de
  conteúdo nomeado dentro de uma página.
- **`MetricCard`** (`src/components/ui/MetricCard.tsx`): card de KPI único — label, valor formatado
  (número/percentual/ms/mbps/usd), trend opcional (seta up/down/neutro), veredito humano opcional
  (`MetricVerdict`: excelente/bom/regular/fraco/forte — obrigatório em KPI de qualidade, ver "The
  Verdict-Beside-Metric Rule"), fonte opcional. Padding `20px`.
- **`ChartCard`** (`src/components/ui/ChartCard.tsx`): mesmo shell visual de `SectionCard` (`12px`
  radius, `bg-surface`, borda, `sq-card-hover`), especializado para envolver um dos 3 componentes de
  gráfico (ver seção 9) — título uppercase 11px + descrição + slot de ações no header.
- **`InsightBlock`** (`src/components/ui/InsightBlock.tsx`): bloco de "tradução" entre gráfico e
  tabela — ícone `Lightbulb` + texto corrido derivado de dado real já carregado na tela (nunca
  reinventa métrica). Card `12px`, `bg-surface`, borda 1px, sem `sq-card-hover` (não é interativo).
  Padrão obrigatório do wireframe GH#552 Fase 2.
- **`EmptyState`** (`src/components/ui/EmptyState.tsx`): estado vazio — ícone `Inbox` em círculo,
  título + descrição, ação opcional. Borda **tracejada** (`1px dashed border`) + `bg-surface` — é o
  único container do sistema com borda dashed, sinaliza "ausência de dado" visualmente distinto de
  card com conteúdo real.
- **`FeatureComingSoon`** (`src/components/ui/FeatureComingSoon.tsx`): placeholder de feature ainda
  não implementada — variante `compact` (linha com ícone `Construction` + badge "Em breve") e
  variante completa. `bg-surface`, borda 1px, radius padrão de botão (`lg`, não `card`) na variante
  compact.
- **`ErrorBoundary`** (`src/components/ui/ErrorBoundary.tsx`): boundary de erro de render React —
  evita que exceção numa aba derrube o painel inteiro. Não é visual de conteúdo normal, é
  fallback de falha — usar estilo de estado de erro (ícone + mensagem + ação de reset).

### Inputs / Fields (Filtros)
- **Style:** radius `12px`, borda 1px `border`, fill `bg-sidebar`/`bg-surface`, label uppercase
  10px tracking largo à esquerda do valor.
- **Focus:** anel de 2px na cor do acento a 40% de alpha (`shadow-focus-ring`).
- **`GlobalFilters`** (`src/components/ui/GlobalFilters.tsx`): container de filtros globais
  compartilhado — cada tela monta seu próprio array de `GlobalFilterConfig`. Ainda não conectado a
  nenhuma tela em produção (aguardando migração de conteúdo Fase 2/3, conforme comentário no próprio
  arquivo).
- **`FilterBar`** (`src/components/ui/FilterBar.tsx`): busca + ambiente + período + ações
  (atualizar/exportar) — usado hoje nas telas já migradas, distinto de `GlobalFilters` (que é o
  padrão-alvo ainda não adotado universalmente).

### Navigation

Três padrões de navegação por breakpoint (implementados em `AppLayout.tsx` — ver seção 12,
Responsividade, para os valores reais):

- **Nav Drawer** (desktop, ≥1024px): largura `300px`. Fundo `bg-sidebar`. Item ativo em pill
  `height:46px`/`radius:23px` (full/pill). Rodapé com avatar circular, nome do operador + "Squad
  técnico", botão de tema circular 30px.
- **Nav Rail** (tablet, 768–1024px, ícone-only): largura `88px` exatos. Logo/avatar de projeto no
  topo (32px, sem menu de troca de projeto). Lista vertical só de ícone, sem label de texto sob o
  ícone. Divisor fino (1px) entre grupos. Avatar de conta (36px) fixo embaixo com popover lateral
  (`left:76px`). Item ativo: pill `56px × 32px`, `radius:16px`, ícone 22px; badge de contagem
  (quando houver) é círculo `16px` sobreposto no canto superior direito.
- **Bottom Nav** (mobile, <768px): altura `80px`, `padding:12px 8px`, `justify-content:space-around`.
  5 itens fixos (Início/App/Diagnóstico/Redes/Mais). Item ativo: pill `64px × 32px`, `radius:16px`,
  ícone 22px + label 12px abaixo do ícone. Substitui o drawer no mobile (não coexiste).
- **Topbar:** altura fixa 56px, fundo `bg-topbar`.

### Filter Chip / Select (componente assinatura)
Select nativo estilizado como pill discreta: fundo `bg-sidebar`/`bg-surface`, borda 1px, label
uppercase tertiary à esquerda, chevron à direita, anel de foco na cor do acento — usado em
`GlobalFilters`, compartilhado por todas as telas do painel.

### Quota Row
Padrão para "uso vs. teto de recurso limitado" (free tier, cota de API) — usado em duas telas:
IA & Custos (`GeminiQuotaCard`, GH#884) e Saúde do Sistema (`CloudflareUsagePanel`, GH#883).
Card `bg-surface` + borda 1px (mesmo card padrão), com N linhas empilhadas (`gap:12px`), cada linha:
- Header: label à esquerda (`text-primary`, 12px, peso 500) + `usado / limite` em mono
  (`text-secondary`) + percentual em negrito na cor semântica à direita.
- Barra de progresso fina: `height:6px`, `border-radius:3px`, trilho `bg-surface-variant`,
  preenchimento na cor semântica — mais fina que a barra de 10px do card "Orçamento mensal de IA",
  deliberado: sinaliza que é métrica secundária/nested dentro da tela, não o KPI principal.
- Cor semântica por faixa: `success` abaixo de 80%, `attention` de 80% a 99%, `error` a partir de
  100%.
- Estado "Não disponível": quando o teto não está configurado, a linha troca a barra por um texto
  `text-tertiary` de 1-2 linhas explicando o motivo — nunca número fabricado.

Ver `docs_ai/design-system/DECISAO_TRES_SECOES_REAIS_CONSOLE_2026-07-18.md` para o racional
completo.

### Tabelas e listas
- **`DataTable`** (`src/components/ui/DataTable.tsx`): tabela genérica tipada (`columns` +
  `keyExtractor`), radius `card`, `rowClassName` fixo ou por linha (ex.: destacar versão em foco),
  `onRowClick` opcional com `box-shadow: inset 0 0 0 2px acento` no foco por teclado. Mensagem vazia
  configurável (`emptyMessage`).
- **`AlertList`** (`src/components/ui/AlertList.tsx`): lista de alertas críticos/atenção com botão
  de resolver — ícone `AlertOctagon`/`AlertCircle` por severidade, borda tonal por severidade.
  **Nota de débito:** usa classes Tailwind hardcoded (`border-red-950/70`, `bg-amber-950/10`) em vez
  de `var(--error)`/`var(--attention)` — mesma categoria de problema do débito já registrado para
  `product-analytics/` (ver seção 13); registrar junto na mesma issue de reconciliação de cor.

### Composição de página (`SectionIntro`, `ActionsRow`, `LoadingState`)
- **`SectionIntro`** (`src/components/ui/SectionIntro.tsx`): abertura obrigatória de cada página —
  overline uppercase > H1 em forma de pergunta > parágrafo descritivo > linha mono "FONTE(S) · ...".
  Copy é literal do mockup de referência, não parafrasear.
- **`ActionsRow`** (`src/components/ui/ActionsRow.tsx`): lista curta de próximos passos concretos ao
  fim de uma página/seção — "nunca tela sem ação" (padrão GH#552 Fase 2). Botões primary/secondary
  com radius `xl` (Tailwind `rounded-xl`, não o token `card`/`button` — checar se deveria ser
  padronizado ao token `button` full/pill em vez de radius próprio; registrar como observação, não
  corrigir agora).
- **`LoadingState`** (`src/components/ui/LoadingState.tsx`): estado de carregamento com spinner +
  mensagem + skeleton de linhas. **Nota de débito:** usa cores hardcoded (`indigo-500`,
  `zinc-700`, `zinc-800/80`) em vez de `var(--primary)`/`var(--border)`/`var(--bg-surface)` —
  mesma categoria do débito de `AlertList`/`product-analytics`.

## 8. Estados e Variantes

Catálogo formal dos estados semânticos de `StatusBadge` (`src/components/ui/StatusBadge.tsx`),
aplicados ao contexto de métricas/analytics administrativo:

| Estado (`status`) | Label padrão | Cor | Uso |
|---|---|---|---|
| `ok` | "OK" | `success` | Recurso saudável, dentro do esperado |
| `stable` | "Estável" | `success` | Métrica sem variação anômala |
| `success` | "Sucesso" | `success` | Operação concluída sem erro |
| `attention` | "Atenção" | `attention` | Fora do ideal, mas não crítico |
| `beta` | "Beta" | `attention` | Feature/dado em fase experimental |
| `cached` | "Cached" | `attention` | Dado servido de cache, não em tempo real |
| `critical` | "Crítico" | `error` | Falha ativa que exige ação |
| `failed` | "Erro" | `error` | Operação não concluída |
| `halted` | "Pausado" | `error` | Processo interrompido deliberadamente |
| `deprecated` | "Obsoleto" | neutro (`bg-surface`/`text-tertiary`) | Dado/feature descontinuada, sem cor de status (não é erro nem sucesso) |
| `info` | (sem label fixo) | `info` (azul) | Série neutro-informativa, sem urgência |

Regra: dot indicador pulsa (`animate-pulse`) somente nos estados de sucesso (`ok`/`stable`/
`success`) — sinaliza "ativo e saudável agora", não usar pulso em atenção/erro (evita ansiedade
visual desnecessária, alinhado com "alerta tratado como informação objetiva, nunca alarme").

## 9. Gráficos (`src/components/charts/`)

Três componentes — `BarChart.tsx`, `DonutChart.tsx`, `LineChart.tsx`, todos sobre Recharts:

- **Cor:** série usa os tokens de `SQ_TOKENS` (`designTokens.ts`) quando o valor precisa ser SVG
  puro (Recharts não aceita `var(--*)` em todo contexto) — ver débito de dessincronia na seção 13.
  Categorias fixas (tipo de rede, provedor de IA) usam cor semântica por categoria, não por posição/
  percentual — evita cor quase invisível na fatia majoritária de um donut.
- **Legenda:** obrigatória quando há mais de 1 série; label + swatch de cor, nunca só cor.
- **Eixos/Grid:** linha de grid discreta em `--border` a baixa opacidade; nunca eixo decorativo sem
  valor.
- **Tooltip:** fundo `bg-surface-variant` + borda 1px, texto no padrão de tipografia `body`/`label`
  — nunca tooltip nativo do browser.
- **Estado vazio:** usar `EmptyState` no lugar do gráfico quando não há dado, nunca renderizar
  gráfico com série zerada sem contexto.
- **Fases de SpeedTest e provedores de IA** têm cor fixa por identidade (ver seção 2, Tertiary) —
  nunca reatribuir essas cores a outra categoria.

## 10. Conteúdo simulado

**Não aplicável.** O Console é painel administrativo que consome dado real de produção (D1,
Firebase, Play Console) — não há tela de app simulando conteúdo de usuário fictício como no
consumer (ex.: preview de card de recomendação). Estados vazios usam `EmptyState` com mensagem
honesta sobre ausência de dado real, nunca dado fabricado (mesmo princípio de honestidade do padrão
"Não disponível" da Quota Row).

## 11. Acessibilidade

O Console é ferramenta interna de operação — não precisa de TalkBack/leitor de tela mobile como
prioridade (não há app mobile do Console), mas mantém as práticas essenciais:
- **Contraste:** todos os pares de cor semântica (success/attention/error/info sobre `bg-surface`)
  foram calibrados para AA por tema — ver "The Per-Theme Semantic Rule" (seção 2). Nunca reduzir
  opacidade de texto sobre superfície sem checar contraste recalculado.
- **Foco de teclado:** `shadow-focus-ring` (anel de 2px, acento a 40% alpha) é o único indicador de
  foco funcional do sistema — todo elemento interativo (input, select, linha de `DataTable`
  clicável, item de nav) precisa expor esse anel visível ao navegar por Tab, não só ao clicar.
- **Nunca cor sozinha:** todo estado semântico (`StatusBadge`) combina cor + ícone/dot + texto —
  nunca cor isolada como único portador de significado.
- **Touch target:** menos crítico que no app mobile (uso majoritário é desktop/tablet com mouse),
  mas itens de `NavRail`/`BottomNav` mantêm alvo mínimo de 44×44px (pill `56×32` ou `64×32` mais
  padding de toque implícito do container).

## 12. Responsividade

Breakpoints reais implementados em `AppLayout.tsx` (Tailwind `md`/`lg`), confirmados no código
nesta consolidação — não é lacuna, era só ausência de registro formal aqui:

| Faixa | Navegação | Largura/altura |
|---|---|---|
| Desktop (`≥1024px`, `lg:`) | Nav Drawer completo | `300px` |
| Tablet (`768–1024px`, `md:` até `lg:`) | Nav Rail colapsado, ícone-only | `88px` |
| Mobile (`<768px`) | Bottom Nav (substitui o drawer, não coexiste) | `80px` de altura |

O Console roda majoritariamente em desktop/tablet (uso administrativo) — o suporte mobile existe
(Bottom Nav) mas não é o alvo primário de design; qualquer tela nova deve ser desenhada
desktop-first e depois verificada nos dois breakpoints menores.

## 13. Governança

- **Nenhum componente novo sem checar equivalente** em `src/components/ui/`/`src/components/charts/`
  — este catálogo (seções 7–9) é a lista completa vigente; antes de criar um componente, confira se
  `SectionCard`/`MetricCard`/`ChartCard`/`DataTable`/`AlertList`/etc. já resolve o caso com props
  novas.
- **Nenhum valor hardcoded em tela** — sempre `var(--*)`, nunca cor Tailwind literal
  (`zinc-*`/`emerald-*`/`red-*`/`amber-*`/`indigo-*`) fora dos tokens do sistema.
- **DS é fonte única da verdade** — este documento + `src/index.css` (tokens reais) + protótipo
  Claude Design `signallq-admin-fluxo-tobe-md3`. Divergência entre eles é bug de doc ou de código, a
  resolver, nunca ambos "certos ao mesmo tempo".

### Débitos confirmados nesta consolidação (não corrigidos aqui — fora do escopo de doc)
1. **`--sq-bg-elevated`/`--sq-bg-overlay` sem valor próprio** (`src/index.css`, linhas ~99-101,
   ~199-201, ~247-249) — hoje idênticos ao nível 1 (`--bg-surface`)/hover (`--bg-surface-hover`);
   precisam de valor tonal diferenciado real para os níveis 2/3 funcionarem visualmente (ver seção
   6).
2. **`--sq-scrim` não existe** — nenhum modal/dropdown do Console tem scrim implementado hoje;
   precisa ser criado e aplicado (ver especificação-alvo na seção 6).
3. **`src/config/designTokens.ts` dessincronizado de `src/index.css`** nos valores de
   `success`/`warning`/`error` (`#22C55E`/`#F5A623`/`#FF4D4F` no TS vs. `#1E8E3E`/`#8A5300`/
   `#BA1A1A` no CSS) — o próprio comentário do arquivo diz que deveria estar em sincronia; precisa
   de reconciliação.
4. **Cor Tailwind hardcoded** em componentes de `src/features/product-analytics/components/`
   (`MostUsedFeaturesTable.tsx`, `ScreenNavigationPanel.tsx`, `FeatureCrashTable.tsx`,
   `RetentionPanel.tsx`, `BatteryImpactPanel.tsx`, `AdsOpportunityPanel.tsx`) — já documentado em
   `docs_ai/design-system/DECISAO_TRES_SECOES_REAIS_CONSOLE_2026-07-18.md`, não duplicar issue, só
   referenciar.
5. **Cor Tailwind hardcoded adicional encontrada nesta consolidação** (achado novo, mesma categoria
   do item 4, ainda não coberto pela decisão de 2026-07-18): `AlertList.tsx` (`border-red-950/70`,
   `bg-amber-950/10` etc.), `EmptyState.tsx` (`text-white`, `text-neutral-500`), `LoadingState.tsx`
   (`indigo-500`, `zinc-700`, `zinc-800/80`, `neutral-400`) — todos em `src/components/ui/`. Deve
   entrar na mesma issue de reconciliação de cor hardcoded, não uma nova.

## 14. Mapeamento para React/TSX

| Nome oficial | Finalidade | Variantes | Token(s) CSS | Arquivo real |
|---|---|---|---|---|
| SectionCard | Container de seção nomeada | header com/sem ações | `--bg-surface`, `--border`, `--radius-card` | `src/components/ui/SectionCard.tsx` |
| MetricCard | KPI único com trend/veredito | com/sem veredito, 5 formatos de valor | `--bg-surface`, `--text-primary` | `src/components/ui/MetricCard.tsx` |
| ChartCard | Shell de gráfico | com/sem ações no header | `--bg-surface`, `--border` | `src/components/ui/ChartCard.tsx` |
| InsightBlock | Tradução gráfico→texto | única | `--bg-surface`, `--primary` (ícone) | `src/components/ui/InsightBlock.tsx` |
| EmptyState | Estado vazio | com/sem ação | `--border` (dashed), `--bg-surface` | `src/components/ui/EmptyState.tsx` |
| FeatureComingSoon | Placeholder de feature | compact / completa | `--bg-surface`, `--border` | `src/components/ui/FeatureComingSoon.tsx` |
| ErrorBoundary | Fallback de erro de render | única | `--error` (esperado no fallback) | `src/components/ui/ErrorBoundary.tsx` |
| StatusBadge | Estado semântico | 11 status (seção 8) | `--success`/`--attention`/`--error`/`--info` | `src/components/ui/StatusBadge.tsx` |
| AlertList | Lista de alertas com ação | crítico/atenção | `--error`/`--attention` (débito: hoje Tailwind hardcoded) | `src/components/ui/AlertList.tsx` |
| DataTable | Tabela genérica tipada | com/sem clique de linha | `--radius-card`, `--primary` (foco) | `src/components/ui/DataTable.tsx` |
| GlobalFilters | Filtros globais (padrão-alvo) | N filtros configuráveis | `--sq-border` | `src/components/ui/GlobalFilters.tsx` |
| FilterBar | Busca + ambiente + período + ações | com/sem export | — | `src/components/ui/FilterBar.tsx` |
| SectionIntro | Abertura de página | com/sem fonte | `--text-tertiary`, `--text-primary` | `src/components/ui/SectionIntro.tsx` |
| ActionsRow | Próximos passos da página | primary/secondary | `--primary`, `--bg-surface` | `src/components/ui/ActionsRow.tsx` |
| LoadingState | Estado de carregamento | N linhas de skeleton | `--primary` (débito: hoje indigo hardcoded) | `src/components/ui/LoadingState.tsx` |
| BarChart / DonutChart / LineChart | Visualização de dado | por tipo de gráfico | `SQ_TOKENS` (designTokens.ts) | `src/components/charts/*.tsx` |
| Nav Drawer / Nav Rail / Bottom Nav | Navegação por breakpoint | 3 padrões (seção 7/12) | `--bg-sidebar`, `--nav-active-bg` | `src/components/layout/{Sidebar,NavRail,BottomNav}.tsx` |

## 15. Do's and Don'ts

### Do:
- **Do** manter o acento `primary` restrito a CTA, nav ativa e foco — igual ao app Android.
- **Do** usar o valor de `primary` correto por tema (`#6C2BFF` claro / `#CFBCFF` escuro) — não
  reutilizar o hex de um tema no outro.
- **Do** recalibrar success/attention/error por tema (dark ≠ light) para manter contraste AA sobre
  `bg-surface`.
- **Do** parear todo KPI de qualidade com veredito humano (Excelente/Bom/Regular/Fraco/Forte).
- **Do** manter cards em repouso (nível 1) com fill tonal + borda 1px, sem sombra estática — sombra
  só em nível 2/3 (ver seção 6).
- **Do** tratar alerta (erro/quota/limite) como informação objetiva — ícone + cor + label, nunca
  drama visual.
- **Do** usar radius `12px` em card/input e radius full/pill em botão.
- **Do** usar sempre `var(--*)` para cor — nunca classe Tailwind de cor literal.

### Don't:
- **Don't** parecer um dashboard SaaS genérico: sem cards decorativos, sem gradiente
  "hero-metric", sem ilustração.
- **Don't** usar tom "fofo" ou empolgado de app consumidor — isso é papel do app SignallQ, não do
  Admin.
- **Don't** adicionar sombra decorativa em card no estado de repouso (nível 1); sombra é reservada
  a nível 2 (interativo) e nível 3 (sobreposto).
- **Don't** reutilizar o hex de status ou de `primary` de um tema no outro — cada par foi calibrado
  para AA.
- **Don't** usar emoji como substituto de ícone ou cor semântica — Lucide/Material são o único
  sistema de ícone.
- **Don't** empilhar card dentro de card além de 2 níveis visuais (card-itis).
- **Don't** misturar borda + sombra + glow + gradiente no mesmo elemento.
- **Don't** tratar divergência entre `index.css`/`designTokens.ts`/protótipo como "está tudo certo"
  sem checar o código real primeiro — ver seção 13 para os débitos confirmados nesta consolidação.
