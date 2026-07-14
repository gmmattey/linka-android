# Design Tokens — Android

**Escopo:** SignallQ v0.23.0 | Android
**Última atualização:** 2026-07-13 (alinhamento ao Fluxo de Telas To-Be — ver
`docs_ai/design-system/DECISAO_ALINHAMENTO_TOBE_2026-07-13.md`)
**Fonte de verdade (documentação):** "SignallQ App - Fluxo de Telas.dc.html" (Claude Design,
projeto `e77ea465-291f-4bf5-930c-a267680da04e`)
**Fonte Android (código, AINDA NÃO atualizada para estes valores):** `SignallQTheme.kt` (era
`LinkaTheme.kt`, renomeado em v0.15.0) — atualização de código é fase separada.

---

## Cores — Brand & Status

| Conceito | Valor |
| --- | --- |
| Brand primário | `#5B21D6` (primary) |
| Brand secundário | `#2851B8` (secondary — azul fixo, não deriva mais do primário) |
| Sucesso | `#146C2E` |
| Aviso | `#8A5000` |
| Erro | `#BA1A1A` |

### Superfícies

| Token | Claro | Escuro |
| --- | --- | --- |
| Bg primário / surface | `#FFFFFF` | `#131217` |
| Surface container low | `#F8F5FB` | `#1D1B20` |
| Card / surface container | `#F3EEFA` | `#211F26` |
| Texto primário (onSurface) | `#1C1B1F` | `#E6E0E9` |
| Texto secundário (onSurfaceVariant) | `#49454F` | `#CAC4D0` |
| Borda (outline) | `#79747E` | `#948F99` |

### SignallQ (DESCONTINUADA — registro histórico do As-Is)

| Token | Valor |
| --- | --- |
| Bg | `#0D0D1A` |
| Surface | `#1A0B2E` |
| Card | `#1E1130` |
| Texto | `#F3F4F6` |

---

## SpeedTest — Phase Colors

| Fase | Valor |
| --- | --- |
| Latência/Resposta | `#2563EB` |
| Download | `#146C2E` |
| Upload | `#8A5000` |

---

## Tipografia

### Família de Fonte

Fonte única do app: **Google Sans Flex** (fallback `Google Sans` → `Roboto` → `system-ui`),
pesos 400/500/600/700, em todos os estilos (não mais split display/body por família). Implementada
em PR #939 (arquivos TTF embutidos no APK, licença SIL OFL). Escala em `signallQTypography` no
`SignallQTheme.kt` (código ainda não atualizado para a escala abaixo).

### Escala (12 estilos — Fluxo de Telas)

| Estilo | Tamanho/Altura de linha | Peso |
| --- | --- | --- |
| Display Small | 34/40 | 700 |
| Headline Large | 26/32 | 700 |
| Headline Small | 22/28 | 600 |
| Title Large | 20/26 | 600 |
| Title Medium | 16/22 | 500 |
| Title Small | 14/20 | 500 |
| Body Large | 16/24 | 400 |
| Body Medium | 14/20 | 400 |
| Body Small | 12/16 | 400 |
| Label Large | 14/20 | 500 |
| Label Medium | 12/16 | 500 |
| Label Small | 11/16 | 500 |

> `display-large`, `display-medium` e `headline-medium` foram removidos — nenhuma tela do Fluxo
> de Telas usa estilo maior que Display Small.

---

## Espaçamento

Grid 8 dp, 8 degraus (Fluxo de Telas):

```
xs: 4px, sm: 8px, md: 12px, base: 16px, lg: 20px, xl: 24px, xxl: 32px, xxxl: 40px
```

> `base` (16px) é o padding padrão de tela/card — era chamado `lg` na escala antiga de 6 degraus.
> `lg` (20px) e `xxxl` (40px) são degraus novos.

---

## Raios de Borda (por componente, specs literais do Fluxo de Telas)

| Contexto | Valor |
| --- | --- |
| Card | 16px |
| SheetFrame (cantos superiores) | 28px |
| Button | 20px (altura 40px) |
| Field (input) | 12px |
| Chip / Badge | 999px (pill) |
| Dialog (ex. RestartDialog) | 24px |

---

## Animação & Transição

Sem transições explícitas documentadas pelo Fluxo de Telas. Motion tokenizado (easing
`emphasized`/`standard` = `cubic-bezier(.2,0,0,1)`, durações 100/200/300/400ms) mantido da
migração MD3 de 2026-07-11 — não redefinido por este documento. Favor usar `animateAsState()` ou
`transition()` conforme necessário.
