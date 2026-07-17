---
name: SignallQ
description: Diagnóstico de conectividade Android que traduz jargão de rede em veredito humano.
colors:
  primary: "#5B21D6"
  primary-container: "#EAE0FF"
  secondary: "#2851B8"
  accent-blue: "#2563EB"
  success: "#146C2E"
  warning: "#8A5000"
  error: "#BA1A1A"
  phase-latencia: "#2563EB"
  phase-download: "#146C2E"
  phase-upload: "#8A5000"
  bg-primary: "#FFFFFF"
  bg-secondary: "#F8F5FB"
  bg-card: "#F3EEFA"
  text-primary: "#1C1B1F"
  text-secondary: "#49454F"
  text-tertiary: "#49454F"
  border: "#CAC4D0"
  warning-container: "#FFDDB3"
  on-warning-container: "#2B1700"
  amber-surface: "#FFF3CD"
  success-container: "#B6F2BE"
  on-success-container: "#04210D"
  signallq-black: "#0D0D1A"
  signallq-dark-surface: "#1A0B2E"
  signallq-dark-card: "#1E1130"
  signallq-text-on-dark: "#F3F4F6"
  signallq-text-secondary-on-dark: "#B9B2C4"
typography:
  display:
    fontFamily: "'Google Sans Flex', 'Google Sans', 'Roboto', system-ui, sans-serif"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: 1.18
  headline:
    fontFamily: "'Google Sans Flex', 'Google Sans', 'Roboto', system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.23
  title:
    fontFamily: "'Google Sans Flex', 'Google Sans', 'Roboto', system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.375
  body:
    fontFamily: "'Google Sans Flex', 'Google Sans', 'Roboto', system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'Google Sans Flex', 'Google Sans', 'Roboto', system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.43
  overline:
    fontFamily: "'Google Sans Flex', 'Google Sans', 'Roboto', system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.45
    letterSpacing: "0.3px"
rounded:
  card: "16px"
  button: "20px"
  input: "12px"
  sheet: "28px"
  dialog: "24px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  lg: "20px"
  xl: "24px"
  xxl: "32px"
  xxxl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.button}"
    padding: "16px 24px"
  chip-idle:
    backgroundColor: "{colors.bg-secondary}"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  chip-selected:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  card-default:
    backgroundColor: "{colors.bg-card}"
    rounded: "{rounded.card}"
    padding: "16px"
---

# Design System: SignallQ

## 1. Overview

**Creative North Star: "The Calm Translator"**

SignallQ pega o vocabulário técnico de uma conexão de internet — RSSI, jitter, dBm, bufferbloat — e traduz em um veredito que qualquer pessoa entende: Excelente, Bom, Regular, Fraco, Forte. A superfície é Material 3 clara, branca e neutra; nada visual disputa atenção com o dado. Um único violeta marca ação e identidade; o resto do significado é carregado pela semântica de trânsito (verde/âmbar/vermelho). O sistema rejeita o visual cru de apps de speedtest genéricos (números soltos, sem contexto humano) e o visual denso de dashboards técnicos de rede — o objetivo é sempre "jargão, depois tradução", nunca jargão sozinho.

**Key Characteristics:**
- Superfícies claras, planas, sem imagem/textura/gradiente decorativo (exceto avatar de perfil)
- Uma cor de marca (violeta), usada com parcimônia
- Verde/âmbar/vermelho carregam significado de qualidade — nunca decoração
- Métrica crua sempre ao lado do veredito humano

## 2. Colors

Paleta majoritariamente branco e tons neutros de superfície; violeta satura só onde há ação ou identidade; cores de status fazem o trabalho pesado de significado. Secondary é um azul fixo, não mais derivado do primary (migração MD3 estrito de 2026-07-11/13 — ver `docs_ai/design-system/DECISAO_ALINHAMENTO_TOBE_2026-07-13.md`).

### Primary
- **Primary** (`#5B21D6` claro / `#D0BCFF` escuro): CTA primário, tab de navegação ativa, seleção, botão de speedtest (disco sólido com glow suave da mesma cor).

### Secondary
- **Secondary** (`#2851B8` claro / `#AAC7FF` escuro): chip de dado "Móvel", DNS privado, links — azul fixo, não deriva do primary.

### Tertiary
- **Phase Latência** (`#2563EB` claro / `#AAC7FF` escuro), **Phase Download** (`#146C2E` claro / `#83DA99` escuro), **Phase Upload** (`#8A5000` claro / `#FFB870` escuro): cores dedicadas às três fases do speedtest, usadas só no gráfico/gauge de progresso.

### Neutral
- **Bg Primary** (`#FFFFFF` claro / `#131217` escuro): fundo principal de tela.
- **Bg Secondary** (`#F8F5FB` claro / `#1D1B20` escuro): superfícies secundárias, chips idle.
- **Bg Card** (`#F3EEFA` claro / `#211F26` escuro): cards e superfícies de conteúdo.
- **Text Primary** (`#1C1B1F` claro / `#E6E0E9` escuro): título e corpo.
- **Text Secondary** (`#49454F` claro / `#CAC4D0` escuro): descrições.
- **Text Tertiary** (`#49454F` claro / `#CAC4D0` escuro): labels, captions, overlines — mesmo valor de Text Secondary (não há um segundo degrau de neutro no Fluxo de Telas To-Be).
- **Border** (`#CAC4D0` claro / `#49454F` escuro): divisores, bordas leves.

### Status
- **Success** (`#146C2E` claro / `#83DA99` escuro): conexão boa, teste OK. Container: `#B6F2BE` / on-container `#04210D`.
- **Warning** (`#8A5000` claro / `#FFB870` escuro): alertas moderados. Container: `#FFDDB3` / on-container `#2B1700`. Surface âmbar dedicada (alias legado): `#FFF3CD`.
- **Error** (`#BA1A1A` claro / `#FFB4AB` escuro): falhas críticas de conexão.

### SignallQ (IA) — descontinuada no To-Be
- **SignallQ Black** (`#0D0D1A`), **SignallQ Dark Surface** (`#1A0B2E`), **SignallQ Dark Card** (`#1E1130`): paleta escura fixa da antiga superfície de IA, que não seguia o tema claro/escuro do sistema. Essa superfície está **descontinuada** no Fluxo de Telas To-Be — não implementar rota ou componente novo para ela. Tokens mantidos no código só por legado/compatibilidade.

### Named Rules
**The One Accent Rule.** Violeta aparece só em CTA, seleção e nav ativa — nunca como cor de fundo geral ou decoração. Se a tela precisa de mais destaque, o destaque é semântico (status), não de marca.

## 3. Typography

**Display Font:** 'Google Sans Flex', 'Google Sans', 'Roboto', system-ui, sans-serif (Google Sans Flex embutido no APK, licença SIL OFL — PR #939; Roboto como fallback do sistema)
**Body Font:** mesma família — fonte única em todos os estilos, sem split display/body
**Label Font:** mesma família, com tracking positivo (+0.3px) e uppercase nos overlines

**Character:** Uma única família tipográfica carrega toda a hierarquia — a distinção vem de peso e tamanho, não de mistura de fontes. Números grandes e em negrito com unidade pequena e secundária ao lado (`87 Mbps`) é o tratamento assinatura de métrica.

### Hierarchy
- **Display** (700, 34px/40px, small — único display usado no Fluxo de Telas; display-large/display-medium não existem em nenhuma tela): resultado de teste, número hero de velocidade.
- **Headline** (700, 26px/32px large · 600, 22px/28px small): títulos de tela e seção.
- **Title** (600, 16px/22px large · 500, 16px/22px medium · 500, 14px/20px small): subtítulos, títulos de card.
- **Body** (400, 16px/24px large · 14px/20px medium · 12px/16px small; medium/small usam text-secondary): texto corrido.
- **Label** (500, 14px/20px large · 12px/16px medium · 11px/16px small): labels de UI, captions, valores de chip.
- **Overline** (500, 11px/16px, letter-spacing 0.3px, UPPERCASE, cor text-secondary): rótulos de seção (`SUA CONEXÃO`, `ÚLTIMO RESULTADO`).

### Named Rules
**The Verdict-Beside-Metric Rule.** Nenhum número técnico aparece sozinho; o veredito humano (Excelente/Bom/Regular/Fraco/Forte) sempre está a um olhar de distância, geralmente na mesma linha ou logo abaixo.

## 4. Elevation

Sistema flat por padrão: profundidade vem de superfície tonal (bg-card sobre bg-secondary) e borda `1px solid var(--border)`, não de sombra. Sombra é reservada para dois elementos que precisam se destacar fisicamente: o botão de iniciar speedtest (disco violeta com glow suave da mesma cor) e o segmento ativo do seletor Rápido/Completo/Triplo (pill branco com elevação sutil sobre trilho neutro).

### Shadow Vocabulary
- **cta-glow**: glow suave na cor do próprio elemento (ex.: violeta ao redor do botão de speedtest) — nunca cinza/preto genérico.
- **active-segment**: sombra leve sob o pill branco ativo do seletor segmentado, para separá-lo do trilho.

### Named Rules
**The Flat-By-Default Rule.** Cards e superfícies não têm sombra. Se algo parece precisar de sombra para se destacar, primeiro tente tonal fill + borda; sombra é exceção, não hábito.

## 5. Components

### Buttons
- **Shape:** radius 20px (`--md-sys-shape-corner-button`) — não cabe nos 7 degraus herdados da escala de forma (none/xs/sm/md/lg/xl/full), token de componente dedicado.
- **Primary:** fill `--md-sys-color-primary` (`#5B21D6` claro / `#D0BCFF` escuro), texto branco (claro) / `#38137E` (escuro), padding 16px 24px.
- **Hover / Focus:** ripple M3 + state-layer tint (primary/onSurface em baixa opacidade); sem hover de web, é app touch.
- **Segmented selector:** trilho em `--bg-secondary`; segmento ativo é pill branco com leve elevação — deliberadamente neutro, não colorido de primary.

### Chips
- **Filter chips idle:** fully-rounded (`--radius-pill`, 999px), fill `--bg-secondary`, texto `--text-secondary`.
- **Filter chips selected:** fill primary-container em tint claro, texto primary.
- **Status chips:** fill da cor semântica a ~12% de alpha, borda a ~25–30% de alpha.

### Cards / Containers
- **Corner Style:** 16px (`--radius-card`).
- **Background:** `--bg-card`, sentado sobre `--bg-secondary` quando precisa de separação de página.
- **Shadow Strategy:** nenhuma — ver Elevation.
- **Border:** `1px solid var(--border)` quando precisa de separação sem tint.
- **Internal Padding:** 16px padrão.

### Sheets / Dialogs
- **Bottom sheet:** radius 28px nos cantos superiores (`--md-comp-sheet-shape`), drag handle 32×4dp centralizado.
- **Dialog:** radius 24px (`--md-comp-dialog-shape`) — token próprio, fora da escala de 7 degraus (ex.: RestartDialog).

### Inputs / Fields
- **Style:** radius 12px, borda `1px solid var(--border)`.
- **Focus:** borda muda para primary.

### Navigation
- **Bottom nav:** 5 abas (Início · Velocidade · Sinal · Histórico · Ajustes), ícone Material Symbols Outlined + label, tab ativa em violeta. Some ao rolar para baixo, reaparece ao rolar para cima, oculta totalmente durante teste em execução.
- **Top bar:** `CenterAlignedTopAppBar`, título centralizado, avatar de perfil à esquerda, ação contextual à direita.

### Signal Bars (componente assinatura)
Glifo customizado de 4 barras verticais (alturas 6/9/12/16dp, largura 3dp, radius 1dp); barras preenchidas assumem a cor de qualidade (verde=Forte, âmbar=Regular, vermelho=Fraco), barras vazias usam `--border`.

### Native Ad Components (anúncio nativo, `…/ui/component/ads/`)
Três variantes por contexto de tela — nunca escolhidas por preferência: **`NativeAdCard`** (card cheio, dispensável — Resultado do teste, Histórico), **`NativeAdRow`** (linha compacta, não dispensável — Velocidade em estado idle), **`NativeAdListRow`** (linha dentro de uma lista orgânica já existente — dentro da lista de dispositivos conectados, nunca na seção Infraestrutura). Toda variante é omitida por completo (não vira placeholder/caixa vazia) quando não há criativo carregado.
- **Border:** tracejada (`Modifier.dashedBorder`), nunca sólida — único uso de borda tracejada no app, reservado para diferenciar anúncio de conteúdo orgânico.
- **CTA:** outline violeta (`accent @35%` de borda, texto accent), nunca sólido — violeta sólido é exclusivo de CTA primário orgânico.
- **Ícone do anunciante:** chip **quadrado** (raio ~27% do tamanho), nunca círculo — distingue do padrão circular de avatares/ícones orgânicos.
- **Disclosure (`AdBadge`):** sempre visível, nunca atrás de tap/expand. "Patrocinado" (tom neutro `textTertiary`) para `NativeAdSource.ADMOB`; "Parceiro" (tom `accentBlue`) para `NativeAdSource.PARTNER`, reservado a afiliados/parceiros curados (catálogo ainda não existe).
- **Nunca** foto/hero, headline/body/CTA hardcoded — sempre vêm do `NativeAd` real carregado pelo AdMob.

## 6. Do's and Don'ts

### Do:
- **Do** parear todo dado técnico com veredito humano (Excelente/Bom/Regular/Fraco/Forte).
- **Do** usar violeta primary (`#5B21D6` claro / `#D0BCFF` escuro) só em CTA, seleção e nav ativa.
- **Do** usar Material Symbols Outlined como único sistema de ícone; nunca emoji.
- **Do** manter cards flat — tonal fill + borda 1px, sem sombra.
- **Do** deixar todo anúncio nativo com borda tracejada + disclosure (`AdBadge`) sempre visível — nunca disfarçado de card orgânico.

### Don't:
- **Don't** parecer um app genérico de speedtest (tipo Ookla/Speedtest.net): números soltos sem contexto humano, sem veredito.
- **Don't** parecer um dashboard técnico/enterprise de rede (tipo Wireshark): jargão não traduzido, denso, feito para quem já entende de rede.
- **Don't** usar emoji como substituto de ícone ou cor semântica.
- **Don't** aplicar gradiente decorativo em superfícies — o único lugar permitido é o avatar de perfil.
- **Don't** adicionar sombra pesada em cards; se precisa de destaque, use tint de cor semântica antes de sombra.
- **Don't** implementar rota ou componente novo para a superfície SignallQ (IA) — descontinuada no Fluxo de Telas To-Be.
