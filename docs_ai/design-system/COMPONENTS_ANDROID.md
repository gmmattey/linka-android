# Componentes Android — SignallQ

**Versão:** v0.23.0 | **Localização:** `app/src/main/kotlin/io/veloo/app/kotlin/ui/component/`  
**Última atualização:** 2026-07-05

25+ componentes custom agrupados por domínio.

> Nota de rebranding (v0.15.0): componentes `Orbit*` foram renomeados para `SignallQ*`. Qualquer referência a `OrbitTopBar`, `OrbitInputArea`, etc. deve ser lida como `SignallQTopBar`, `SignallQInputArea`, etc.

---

## SignallQ — Chat IA (10)

Componentes exclusivos da superfície de IA. Mantêm paleta escura (`#0D0D1A`/`#1A0B2E`/`#1E1130`) independente do tema do app.

| Componente | Arquivo | Propósito |
| --- | --- | --- |
| `SignallQTopBar` | `SignallQTopBar.kt` | Header tela IA, título + ações (ex-OrbitTopBar) |
| `SignallQInputArea` | `SignallQInputArea.kt` | Campo entrada texto + botão enviar (ex-OrbitInputArea) |
| `SignallQUserMessageBubble` | `SignallQUserMessageBubble.kt` | Bolha mensagem usuário (ex-OrbitUserMessageBubble) |
| `SignallQAiMessageBubble` | `SignallQAiMessageBubble.kt` | Bolha mensagem IA em markdown (ex-OrbitAiMessageBubble) |
| `SignallQThinkingBubble` | `SignallQThinkingBubble.kt` | Indicador "IA pensando" (ex-OrbitThinkingBubble) |
| `SignallQWelcomeState` | `SignallQWelcomeState.kt` | Tela inicial vazia + prompt (ex-OrbitWelcomeState) |
| `SignallQInlineQuestion` | `SignallQInlineQuestion.kt` | Pergunta inline, resposta rápida (ex-OrbitInlineQuestion) |
| `SignallQActionsCard` | `SignallQActionsCard.kt` | Botões ação sugeridos (ex-OrbitActionsCard) |
| `SignallQTechnicalResultBubble` | `SignallQTechnicalResultBubble.kt` | Card resultados técnicos dentro do chat |
| `SignallQIaHeader` | `SignallQIaHeader.kt` | Header padrão telas IA |

---

## SpeedTest & Pulse (6)

| Componente | Arquivo | Propósito |
| --- | --- | --- |
| `GaugeCircular` | `GaugeCircular.kt` | Gauge circular animado (velocidade) |
| `MiniGrafico` | `MiniGrafico.kt` | Gráfico pequeno histórico/mini-trend |
| `PulseResultCard` | `PulseResultCard.kt` | Card resultado monitoramento passivo |
| `SilentSpeedtestIndicator` | `SilentSpeedtestIndicator.kt` | Indicador speedtest background |
| `SignallQSymbol` | `SignallQSymbol.kt` | Logo/marca SignallQ Pulse |
| `SignallQPulseIcon` | `SignallQPulseIcon.kt` | Ícone monitor passivo |

---

## Visual & Animação (3)

| Componente | Arquivo | Propósito |
| --- | --- | --- |
| `AppBorderGlowEffect` | `AppBorderGlowEffect.kt` | Efeito glow borda (cards destaque) |
| `TypewriterText` | `TypewriterText.kt` | Texto digita caractere-por-caractere |
| `RotatingMessageText` | `RotatingMessageText.kt` | Texto rotaciona entre mensagens |

---

## Layout & Utilitários (5+)

| Componente | Arquivo | Propósito |
| --- | --- | --- |
| `AiModelFooter` | `AiModelFooter.kt` | Footer com info do modelo IA (nome + versão) |
| `DiagnosisChipsRow` | `DiagnosisChipsRow.kt` | Row de chips de diagnóstico (tags) |
| `ContextualQuestionCard` | `ContextualQuestionCard.kt` | Card de pergunta contextual |
| `SheetDragHandle` | `SheetDragHandle.kt` | Handle drag de bottom sheet |
| `WifiChannelGuide` | `WifiChannelGuide.kt` | Guia visual de canais Wi-Fi |
| `OnDevicePill` | `OnDevicePill.kt` | Indicador "processado no dispositivo" |

---

## Total: 25+ componentes (v0.23.0)

- **Reutilizáveis:** Todos suportam slots e customização via Composable lambdas.
- **Tipados:** TypeScript-like - tudo com @Composable, Modifier, etc.
- **Testáveis:** Sem efeitos colaterais; prévia via @Preview.

---

## Convenção de Nomenclatura

- **SignallQ***: Componentes exclusivos da superfície de IA (chat diagnóstico). Ex.: `SignallQTopBar`, `SignallQInputArea`. Renomeados de `Orbit*` no rebranding v0.15.0.
- **Pulse / SignallQ Pulse**: Componentes do monitoramento passivo.
- **Diag***: Componentes do Diagnóstico IA v0.14.0+ (ex.: `DiagVerdictHeroCard`, `DiagRootCauseCard`, `DiagActionFooter`).
- Sem prefixo genérico (Lk-, App-) — nome direto descreve propósito.

---

## Relacionamentos

```
SignallQScreen usa: SignallQTopBar, SignallQInputArea, SignallQUserMessageBubble,
                   SignallQAiMessageBubble, SignallQWelcomeState, SignallQThinkingBubble,
                   SignallQInlineQuestion, AiModelFooter, AppBorderGlowEffect

LLMChatScreen usa: LLMAssistantMessage, AiModelFooter, (componentes de bolha LLM)

DiagnosticoScreen usa: DiagVerdictHeroCard, DiagRootCauseCard, DiagImpactCard,
                       DiagMetricsGrid, DiagRecommendationCard, DiagActionFooter

SpeedTestScreen usa: GaugeCircular, MiniGrafico, DiagnosisChipsRow

SignallQPulseScreen usa: PulseResultCard, SignallQSymbol, MiniGrafico
```
