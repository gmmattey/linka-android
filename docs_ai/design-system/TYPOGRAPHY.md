# Tipografia — SignallQ

**Fonte de verdade (documentação, To-Be):** "SignallQ App - Fluxo de Telas.dc.html" (Claude
Design, projeto `e77ea465-291f-4bf5-930c-a267680da04e`) — ver
`docs_ai/design-system/DECISAO_ALINHAMENTO_TOBE_2026-07-13.md`.
**Fonte Android (código, AINDA NÃO atualizada para a escala abaixo):** `SignallQTheme.kt`
(`signallQTypography`)
**Escopo:** Android v0.23.0
**Última atualização:** 2026-07-13

---

## Família de fonte

Fonte única do app: **Google Sans Flex** (fallback `Google Sans` → `Roboto` → `system-ui`), pesos
400/500/600/700, em **todos** os estilos — não há mais split display/body por família. Implementada
em PR #939 (arquivos TTF embutidos no APK, licença SIL OFL 1.1).

## Material Design 3 — Escala do Fluxo de Telas (12 estilos)

Todos os tamanhos em `sp` para respeitar `fontScale` do sistema (acessibilidade).

| Estilo | Tamanho/Altura de linha | Peso | Tracking | Uso |
| --- | --- | --- | --- | --- |
| `displaySmall` | 34/40 sp | 700 | 0px | Heading de destaque (único display usado) |
| `headlineLarge` | 26/32 sp | 700 | 0px | Títulos principais de seção |
| `headlineSmall` | 22/28 sp | 600 | 0px | Headings menores, títulos de sheet |
| `titleLarge` | 20/26 sp | 600 | 0px | Títulos de tela/feature |
| `titleMedium` | 16/22 sp | 500 | .1px | Títulos secundários |
| `titleSmall` | 14/20 sp | 500 | .1px | Labels de componentes |
| `bodyLarge` | 16/24 sp | 400 | .15px | Texto principal, descrições longas |
| `bodyMedium` | 14/20 sp | 400 | .2px | Corpo padrão |
| `bodySmall` | 12/16 sp | 400 | .25px | Texto menor, suplementar |
| `labelLarge` | 14/20 sp | 500 | .1px | Labels de botões/chips |
| `labelMedium` | 12/16 sp | 500 | .3px | Hints, captions |
| `labelSmall` | 11/16 sp | 500 | .4px | Footnotes, overline |

> `displayLarge`, `displayMedium` e `headlineMedium` foram **removidos** desta escala — nenhuma
> tela do Fluxo de Telas usa estilo maior que `displaySmall`. Se necessidade real surgir, validar
> valor com a Lia antes de reintroduzir (não extrapolar).

---

## Componentes de Animação Tipográfica

SignallQ inclui dois componentes especiais para animação de texto:

### TypewriterText
Anima texto entrando caractere por caractere, criando efeito de digitação.

**Uso:** Respostas da IA no SignallQ (tela DESCONTINUADA no Fluxo de Telas — componente só
relevante enquanto a rota existir no As-Is).
**Arquivo:** `app/src/main/kotlin/io/veloo/app/kotlin/ui/component/TypewriterText.kt`

### RotatingMessageText
Rotaciona entre múltiplas mensagens em loop, com fade in/out.

**Uso:** Perguntas contextuais, hints dinâmicos no SignallQ Pulse.
**Arquivo:** `app/src/main/kotlin/io/veloo/app/kotlin/ui/component/RotatingMessageText.kt`

---

## Uso em Composables

```kotlin
Text("Seu texto", style = MaterialTheme.typography.bodyMedium)
Text("Headline", style = MaterialTheme.typography.headlineSmall)
```

---

## Acessibilidade

- **Mínimo para corpo:** `bodyMedium` (14 sp) atende WCAG AA.
- **Respeito ao sistema:** Todos os tamanhos usam `sp`, não `dp`, para adaptar à configuração de zoom do usuário.
- **Contrast:** Material Design 3 garante contraste 4.5:1 em cores padrão.

---

## Implementação Android pendente

`SignallQTheme.kt` (`signallQTypography`) ainda usa a escala anterior (valores e pesos
diferentes dos acima) — atualização de código é fase separada, fora do escopo desta correção de
documentação (2026-07-13).
