# Espaçamento — SignallQ

**Fonte de verdade (documentação, To-Be):** "SignallQ App - Fluxo de Telas.dc.html" (Claude
Design, projeto `e77ea465-291f-4bf5-930c-a267680da04e`) — ver
`docs_ai/design-system/DECISAO_ALINHAMENTO_TOBE_2026-07-13.md`.
**Fonte Android (código, AINDA NÃO atualizada):** `SignallQTheme.kt` (`LkSpacing`) | Padrão grid 8 dp
**Escopo:** Android v0.23.0
**Última atualização:** 2026-07-13

---

## Token de Espaçamento (8 degraus)

SignallQ segue grid 8 dp do Material Design 3. O Fluxo de Telas amplia a escala anterior de 6 para
8 degraus:

| Token | Valor | Uso |
| --- | --- | --- |
| `xs` | 4 dp | Ajustes finos, pequenos gaps |
| `sm` | 8 dp | Unidade fundamental (padding interno, gaps) |
| `md` | 12 dp | Espaçamento padrão interno |
| `base` | 16 dp | Padding de telas, cardContent (era chamado `lg` na escala antiga de 6 degraus) |
| `lg` | 20 dp | **Novo degrau** |
| `xl` | 24 dp | Divisões significativas entre áreas |
| `xxl` | 32 dp | Espaçamento entre grandes seções |
| `xxxl` | 40 dp | **Novo degrau** — CTA de onboarding, rodapés |

> **Atenção na migração:** quem lia `lg` esperando 16 dp precisa passar a ler `base`. `lg` agora
> vale 20 dp.

---

## Raios de Borda (por componente, specs literais do Fluxo de Telas)

| Componente | Valor | Uso |
| --- | --- | --- |
| Card | 16 dp | Cards, superfícies principais |
| SheetFrame (cantos superiores) | 28 dp | Bottom sheets |
| Button | 20 dp (altura 40 dp) | Botões |
| Field (input) | 12 dp | Campos de entrada |
| Chip / Badge | 999 dp (pill) | Chips, badges, selos |
| Dialog (ex. RestartDialog) | 24 dp | Diálogos modais |

---

## Validação em Código

Não há token centralizado de espaçamento em `dimens.xml`. Valores são aplicados diretamente via `Modifier.padding()` em composables.

Para validar espaçamento em uso, execute:

```bash
grep -r "padding(" \
  signallq-android-kotlin/app/src/main/kotlin/io/signallq/app/kotlin/ui/component/ \
  signallq-android-kotlin/app/src/main/kotlin/io/signallq/app/kotlin/ \
  | grep -E "(4|8|12|16|20|24|32|40)\.dp"
```

---

## Aplicação

Preferir `LkSpacing` ao invés de hardcoding valores:

```kotlin
// Correto
Box(modifier = Modifier.padding(LkSpacing.base))

// Evitar
Box(modifier = Modifier.padding(16.dp))
```

---

## Material Design 3 — Princípios

- Espaçamento cria ritmo vertical e harmonia visual.
- Grid 8 dp reduz decisões arbitrárias.
- Acessibilidade: 44 dp mínimo para hit targets (toque) — Button tem 40 dp de altura.

---

## Implementação Android pendente

`SignallQTheme.kt` (`LkSpacing`) ainda usa a escala anterior de 6 degraus (`lg` = 16 dp, sem `base`
nem `xxxl`) — atualização de código é fase separada, fora do escopo desta correção de
documentação (2026-07-13).
