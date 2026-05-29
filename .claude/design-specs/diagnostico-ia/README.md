# Handoff: Diagnóstico IA (fluxo de laudo, sem chat) + Assistente

## Overview
Substituição da antiga tela de "Diagnóstico IA" (que era um chat) por um **fluxo de laudo gerado pela IA**: o usuário escolhe quais sinais analisar, a IA processa **no aparelho** e entrega um diagnóstico interpretado — veredito em linguagem simples, causa-raiz, recomendações priorizadas e a evidência técnica. Inclui também a tela do **Assistente (chat LLM)** que serve de tira-dúvidas.

Faz parte do app **Linka** (Android, Jetpack Compose / Material 3). Estas telas são abertas a partir do mini-card "Diagnóstico IA" da Home (`HomeScreen.MiniCardsRow`).

## About the Design Files
Os arquivos deste bundle são **referências de design feitas em HTML/React (JSX via Babel no navegador)** — protótipos que mostram a aparência e o comportamento pretendidos, **não** código de produção para copiar literalmente. A tarefa é **recriar estes designs no codebase real** (o app Android em Jetpack Compose / Material 3), usando os componentes, tema e padrões já existentes lá (`LinkaTheme.kt`, `LinkaCard`, `CenterAlignedTopAppBar`, etc.). Os valores de cor/tipografia/spacing abaixo foram extraídos de `LinkaTheme.kt` e devem casar com os tokens já presentes no projeto.

## Fidelity
**Alta fidelidade (hi-fi).** Cores, tipografia, espaçamentos, raios e estados finais estão definidos. Recrie pixel a pixel usando o design system existente do app. Onde houver divergência entre o mock e os tokens reais do `LinkaTheme.kt`, **prevalecem os tokens reais**.

---

## Screens / Views

O fluxo tem **5 telas**. As 4 primeiras são o diagnóstico; a 5ª é o assistente (chat) acessório.

Frame base de todas: largura útil **360 px**, conteúdo Material 3 edge-to-edge, fundo branco (`#FFFFFF`), fonte Roboto. Top bar no padrão `CenterAlignedTopAppBar` (ícone de voltar à esquerda 22 px, título 16/600 centralizado, ação opcional à direita).

### 1 · `DiagSetup` — Escolher sinais
- **Purpose**: usuário seleciona o que analisar e dispara o diagnóstico.
- **Layout** (coluna, flex): TopBar ("Diagnóstico IA", só voltar) → corpo com `padding: 4px 16px 0`, `gap: 14` → rodapé fixo com botão.
- **Components**:
  - **Intro**: linha flex `gap:12`. Ícone `insights` 30 px na cor accent `#6C2BFF`. Título 14.5/600 `#0D0D1A`: "A IA lê os sinais da sua conexão e entrega um diagnóstico pronto." Subtítulo 12 `#6B7280`: "Sem conversa: você escolhe o que medir, ela interpreta e aponta a causa."
  - **Rótulo de seção** 10/700, `letter-spacing:0.5`, `#9CA3AF`: "O QUE ANALISAR".
  - **Lista de sinais** (5 linhas, `gap:8`). Cada linha = card `border-radius:16`, `padding:11px 14px`, flex `gap:12`: ícone 20 px + (título 13/600 + sub 11 `#6B7280`) + indicador circular 22 px à direita.
    - **Ligado**: fundo `#6C2BFF0D`, borda `#6C2BFF40`, ícone accent, círculo preenchido accent com check branco (path `M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z`).
    - **Desligado**: fundo branco, borda `#E5E7EB`, ícone `#9CA3AF`, círculo só com borda 1.5 px `#E5E7EB`.
    - Itens: `Velocidade` (insights, on) · `Wi-Fi & Sinal` (wifi, on) · `Latência & Bufferbloat` (ping, on) · `Modem / Fibra (GPON)` (tower, on) · `DNS` (language, **off**).
  - **Rodapé**: borda superior `#E5E7EB`, `padding:16`. Botão full-width `#6C2BFF`, texto branco 14.5/700, `border-radius:12`, `padding:13px 0`, ícone "spark" + "Diagnosticar conexão". Abaixo, pill de confiança centralizada (ver "OnDevicePill").

### 2 · `DiagAnalyzing` — Analisando
- **Purpose**: estado de carregamento enquanto a IA cruza os sinais.
- **Layout**: TopBar → centro vertical (flex column, center) → rodapé com pill on-device.
- **Components**:
  - **Glyph animado** 96 px (no mock é o "Orbit": 3 círculos concêntricos âmbar `#FBBF24` pulsando). **No app, substitua por um indicador de progresso de marca** (ex.: um `CircularProgressIndicator` estilizado ou animação Lottie). Não é obrigatório manter o glyph do mock.
  - Título 18/700: "Analisando sua conexão". Subtítulo 12.5 `#6B7280`, centralizado: "A IA está cruzando os sinais para encontrar o que está limitando você."
  - **Barra de progresso**: trilho `#F3F4F6` h:5 `border-radius:3`; preenchimento 62% `#6C2BFF`.
  - **Checklist** (`gap:12`): cada item = círculo 20 px + label 13/500.
    - `done` → círculo verde `#22C55E` com check branco. ("Velocidade medida", "Wi-Fi e canais lidos")
    - `run` → spinner accent girando (`#6C2BFF` sobre `#E5E7EB`). ("Latência sob carga")
    - `wait` → círculo só com borda `#E5E7EB`, label `#9CA3AF`. ("Modem / fibra")

### 3 · `DiagResultTop` — Veredito + causa-raiz
- **Purpose**: a conclusão da IA em linguagem humana + os culpados.
- **Layout**: TopBar ("Diagnóstico IA", voltar + ação compartilhar à direita) → corpo `padding:4px 16px`, `gap:12`.
- **Components**:
  - **Herói (a "voz da IA")**: card escuro, `background: linear-gradient(160deg, #1A0B2E, #0D0D1A)`, `border-radius:20`, `padding:18`, texto `#F3F4F6`.
    - Topo: glyph 22 px + rótulo "DIAGNÓSTICO IA" 10.5/700 `rgba(255,255,255,.6)` + pill "ATENÇÃO" à direita (texto `#F5A623` sobre `#F5A62326`, `border-radius:999`).
    - Veredito 16/600, `line-height:1.42`: "Seu Wi-Fi chega fraco neste cômodo e a fila de download entope a conexão. É por isso que chamadas travam e páginas demoram — o plano em si está ok."
    - Rodapé do card (borda `rgba(255,255,255,.1)`): "● Confiança alta" (verde `#22C55E`) + pill on-device à direita (claro sobre escuro).
  - **Causa-raiz**: rótulo "CAUSA-RAIZ IDENTIFICADA" 10/700 `#9CA3AF`. Duas linhas `CulpritRow`: card fundo `#FF4D4F0D`, borda `#FF4D4F33`, `border-radius:16`, `padding:11px 14px`; ícone em quadrado 36 px `#FF4D4F1A` (cor `#FF4D4F`) + título 13/600 + sub 11.5 `#6B7280`.
    - "Sinal Wi-Fi fraco" — "−74 dBm a 5 GHz · 2 cômodos de distância" (ícone wifi).
    - "Bufferbloat sob carga" — "latência salta de 22 ms → 182 ms ao baixar" (ícone ping).
  - **Impacto no uso**: rótulo "IMPACTO NO USO" + card `#F3F4F6` `border-radius:16` com 3 linhas `UseRow` (ícone + label flex:1 + badge): Streaming/vídeo = **Ok** (`#22C55E`), Chamadas de vídeo = **Travando** (`#FF4D4F`), Jogos online = **Ruim** (`#FF4D4F`). Badge = texto na cor `c` sobre `c26`, `padding:3px 8px`, `border-radius:4`.

### 4 · `DiagResultDetail` — Recomendações + sinais
- **Purpose**: o que fazer (priorizado) + a evidência técnica + ações.
- **Layout**: TopBar (voltar + compartilhar) → corpo `padding:4px 16px`, `gap:14` → rodapé fixo de ações.
- **Components**:
  - **O que fazer · em ordem**: rótulo 10/700 `#9CA3AF`. Cards (`gap:8`) brancos, borda `#E5E7EB`, `border-radius:16`, `padding:13`:
    - Linha topo: badge numérico circular 22 px accent (branco) + título 13/600 (flex:1) + pill de prioridade (texto `pc` sobre `pc1A`, 9.5/700).
    - Descrição 11.5 `#6B7280` `padding-left:32`. Link "Ver passo a passo ›" 12/600 accent, `padding-left:32`.
    - Itens: **1 ALTA** (`#FF4D4F`) "Aproxime o aparelho do roteador ou use 5 GHz" — "A −74 dBm o sinal está no limite. A poucos metros o download mais que dobra." · **2 ALTA** "Ative o SQM / \"Smart Queue\" no roteador" — "Corta o bufferbloat de 182 ms para ~20 ms — fim das travadas em chamadas." · **3 MÉDIA** (`#F5A623`) "Mude o Wi-Fi 2.4 GHz do canal 6 para o 1 ou 11" — "Há 6 redes vizinhas no canal 6 disputando espaço."
  - **Sinais analisados** (evidência, recolhível): header com rótulo + "recolher ▾" à direita. Grid 2 colunas `gap:8`. Cada célula `#F3F4F6` `border-radius:10` `padding:9px 11px`: ponto de status 7 px + label 10 `#6B7280` + valor 14/700 + nota opcional na cor do status.
    - Status: ok=`#22C55E`, warn=`#F5A623`, bad=`#FF4D4F`.
    - Download `38.2 Mbps` (bad, nota "19% do plano (200)") · Upload `41.8 Mbps` (ok) · Latência ociosa `22 ms` (ok) · Bufferbloat `+182 ms` (bad) · Wi-Fi RSSI `−74 dBm` (bad) · Perda de pacotes `1.4 %` (warn).
  - **Ações (rodapé fixo)**: borda superior. Linha: botão primário accent "Compartilhar laudo" (ícone share) `flex:1` + botão quadrado 46 px outline (ícone refazer/`refresh`). Abaixo, "Falar com a operadora" 13/600 `#6B7280` centralizado.

### 5 · `LLMChat` — Chat com a IA (assistente)
- **Purpose**: tira-dúvidas em linguagem natural; padrão LLM moderno. (Substituiu a versão antiga com glyph "Orbit" — **não** usar Orbit aqui.)
- **Layout**: header próprio (não CenterAligned) → mensagens → chips → input.
- **Components**:
  - **Header**: voltar + (título "Linka" 16/700 + linha de status "● Assistente de conexão", ponto `#22C55E`) + ícone "novo chat" (lápis) `#9CA3AF`. Borda inferior `#E5E7EB`.
  - **Mensagens** `padding:18px 16px`, `gap:20`:
    - **Usuário** (bolha, à direita): `max-width:82%`, fundo `#F3F4F6`, `#0D0D1A`, `padding:11px 14px`, `border-radius:18px 18px 5px 18px`, 14/1.45. Texto: "Minha internet fica lenta toda noite. O que pode ser?"
    - **Assistente** (largura total, **sem balão**): rótulo "● LINKA" (ponto accent + 11/700 `#9CA3AF`). Prosa 14/1.6 `#0D0D1A`. Lista numerada (badge circular 20 px `#6C2BFF14` accent + texto 13.5): "Horário de pico", "Wi-Fi 2.4 GHz cheio", "Atualizações em segundo plano" (cada um com explicação em `#6B7280`). Encerramento + botão pill outline accent "↻ Rodar teste rápido".
  - **Chips de follow-up**: pills `#F3F4F6` borda `#E5E7EB`, texto 12 `#6B7280`: "Como troco o canal do Wi-Fi?", "Vale a pena 5 GHz?".
  - **Input**: container `#F3F4F6` `border-radius:24` com placeholder "Pergunte qualquer coisa…" + botão de envio circular 38 px accent. Disclaimer 10.5 `#9CA3AF` centralizado: "A Linka roda no aparelho e pode errar. Confira dados importantes."

### Componentes compartilhados
- **OnDevicePill**: ícone escudo 12 px + "Processado no aparelho · Gemma 4", 10.5/500. Variante clara (`#9CA3AF`) e sobre fundo escuro (`rgba(255,255,255,.55)`). Comunica que tudo roda **on-device** — é um diferencial de privacidade, manter.

---

## Interactions & Behavior
- **Entrada**: Home → mini-card "Diagnóstico IA" → `DiagSetup`.
- `DiagSetup`: tocar nos cards alterna o sinal (on/off). "Diagnosticar conexão" → `DiagAnalyzing`.
- `DiagAnalyzing`: roda as medições selecionadas (auto). Ao concluir → `DiagResultTop`. Checklist reflete o progresso real de cada sinal (done/run/wait).
- `DiagResultTop` ⇄ `DiagResultDetail`: a mesma tela de resultado, rolável; o handoff separa em duas para documentar topo e continuação. No app é **uma tela com scroll**.
- "Ver passo a passo ›": abre um guia da correção (telas fora deste escopo).
- "Compartilhar laudo": gera/compartilha o laudo (PDF/sheet do sistema). "Refazer": volta a `DiagSetup`/`DiagAnalyzing`. "Falar com a operadora": ação de suporte.
- `LLMChat`: chips e botões preenchem/enviam o prompt; "Rodar teste rápido" dispara um speedtest curto e devolve o resultado na conversa.

## State Management
- `sinaisSelecionados: Set<Sinal>` — quais medir (default: tudo menos DNS).
- `estadoDiagnostico: Setup | Analisando | Concluido` + `progresso` por sinal (`done|run|wait`).
- `laudo` (resultado): veredito, confiança, lista de causas-raiz, recomendações (com prioridade), métricas (valor + status), impacto por atividade.
- `chat: List<Mensagem>` (role user/assistant; assistant pode conter blocos: texto, lista, ação inline, card de métrica).
- Processamento **on-device** (modelo local). Sem chamadas a servidor externo sem ação explícita do usuário.

## Design Tokens (de `LinkaTheme.kt`)
- **Brand**: accent `#6C2BFF` · accentBlue `#2563EB`
- **Status**: success `#22C55E` · warning `#F5A623` · error `#FF4D4F`
- **Fases speedtest**: latência `#60A5FA` · download `#34D399` · upload `#FBBF24`
- **Superfície clara**: bgPrimary `#FFFFFF` · bgSecondary `#F3F4F6` · textPrimary `#0D0D1A` · textSecondary `#6B7280` · textTertiary `#9CA3AF` · border `#E5E7EB`
- **Escuro (herói/IA)**: linkaBlack `#0D0D1A` · linkaDarkSurface `#1A0B2E` · linkaDarkCard `#1E1130` · texto on-dark `#F3F4F6` / secundário `#9CA3AF`
- **Raios**: card 16 · botão 12 · input 12 · pills 999
- **Tipografia**: Roboto. Escala usada: 18/16/14.5/14/13.5/13/12/11.5/11/10.5/10/9.5. Pesos 700/600/500/400. Rótulos de seção em 700 com `letter-spacing ~0.5`.
- **Opacidades de tint** muito usadas: cor + `0D`/`14`/`1A`/`26`/`33`/`40` (hex alpha) para fundos e bordas suaves.

## Assets
- **Ícones**: SVG inline (paths em `tokens.jsx`/`home.jsx`). Subconjunto usado: `insights, wifi, ping, tower, language` + check/share/spark/refresh/send/edit. No app, mapear para os ícones de marca / Material equivalentes.
- **Glyph "Orbit"** (círculos âmbar): aparece só no estado `DiagAnalyzing` do mock. **Opcional** — pode trocar por um indicador de progresso de marca. **Não** usar no chat.
- Sem imagens raster.

## Files
- `Diagnostico IA.html` — protótipo standalone que renderiza **apenas as 5 telas** lado a lado (abra no navegador).
- `screenshots/01..05-screen.png` — capturas hi-fi das 5 telas, na ordem do fluxo.
- `src/diagnostico.jsx` — componentes das telas (`DiagSetup`, `DiagAnalyzing`, `DiagResultTop`, `DiagResultDetail`, `LLMChat`).
- `src/tokens.jsx` — tokens (`LK`), `PhoneFrame`, `TopBar`, `Card`, `Icon`, `Avatar`, `BottomNav`.
- `src/deps.jsx` — `ICONS` (subconjunto) e `UseRow`, dependências das telas extraídas dos demais screens.
