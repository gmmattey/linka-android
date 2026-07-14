# Tokens de Cores — SignallQ

**Fonte de verdade (documentação):** "SignallQ App - Fluxo de Telas.dc.html" (Claude Design,
projeto `e77ea465-291f-4bf5-930c-a267680da04e`) — ver
`docs_ai/design-system/DECISAO_ALINHAMENTO_TOBE_2026-07-13.md`.
**Fonte de verdade (código, AINDA NÃO atualizada):** `SignallQTheme.kt` (`LkColors`) — os valores
abaixo são o alvo To-Be; a implementação em `android/` é uma fase separada, fora do escopo desta
correção de documentação.
**Escopo:** Android v0.23.0
**Última atualização:** 2026-07-13 (correção de contradição entre dois documentos do mesmo
projeto Claude Design — ver decisão linkada acima)

---

## Primary / Secondary

`secondary` deixa de ser derivado do `primary` (tríade tonal HCT) e vira um **azul fixo**.

| Token | Valor | Uso |
|---|---|---|
| `primary` | `#5B21D6` | CTA primário, highlights, seleção, navegação ativa |
| `onPrimary` | `#FFFFFF` | Texto/ícone sobre primary |
| `primaryContainer` | `#EAE0FF` | Fill de destaque suave |
| `onPrimaryContainer` | `#210A5C` | Texto sobre primaryContainer |
| `secondary` | `#2851B8` | Chip móvel, DNS privado, links secundários (azul fixo) |
| `onSecondary` | `#FFFFFF` | Texto/ícone sobre secondary |
| `secondaryContainer` | `#DCE6FF` | Segmented/Chip ativo |
| `onSecondaryContainer` | `#001A41` | Texto sobre secondaryContainer |

`tertiary` **não é definido** pelo Fluxo de Telas — não usar em tela nova.

---

## Status

| Token | Valor | Uso |
|---|---|---|
| `success` | `#146C2E` | Conexão boa, testes concluídos, ações bem-sucedidas |
| `warning` | `#8A5000` | Alertas moderados, condições a monitorar |
| `error` | `#BA1A1A` | Erros críticos, falhas de conexão |
| `successContainer` / `onSuccessContainer` | `#B6F2BE` / `#04210D` | Banners de sucesso |
| `warningContainer` / `onWarningContainer` | `#FFDDB3` / `#2B1700` | Banners de atenção |
| `errorContainer` / `onErrorContainer` | `#FFDAD6` / `#410002` | Banners de erro |

---

## SpeedTest Phases

| Token | Valor | Uso |
|---|---|---|
| `phaseLatencia` | `#2563EB` | Fase de teste de latência/resposta |
| `phaseDownload` | `#146C2E` | Fase de teste de download |
| `phaseUpload` | `#8A5000` | Fase de teste de upload |

---

## Surface — Tema Claro

| Token | Valor | Uso |
|---|---|---|
| `surface` / `Light.bgPrimary` | `#FFFFFF` | Fundo principal de telas |
| `surfaceDim` | `#DED8E1` | Nível mais recessado |
| `surfaceContainerLowest` | `#FFFFFF` | — |
| `surfaceContainerLow` | `#F8F5FB` | — |
| `surfaceContainer` / `Light.bgCard` | `#F3EEFA` | Cards, superfícies de conteúdo |
| `surfaceContainerHigh` | `#ECE5F5` | — |
| `surfaceContainerHighest` | `#E6DDF2` | — |
| `onSurface` / `Light.textPrimary` | `#1C1B1F` | Texto principal (título, corpo) |
| `onSurfaceVariant` / `Light.textSecondary` | `#49454F` | Texto secundário, descrições, labels |
| `outline` / `Light.border` | `#79747E` | Divisores, bordas |
| `outlineVariant` | `#CAC4D0` | Divisores decorativos, mais fraco que `outline` |

> `Light.textTertiary` foi **removido** — o Fluxo de Telas só define um `onSurfaceVariant` (não
> há mais 2º degrau de neutro).

---

## Surface — Tema Escuro

| Token | Valor | Uso |
|---|---|---|
| `surface` / `Dark.bgPrimary` | `#131217` | Fundo principal |
| `surfaceContainerLow` | `#1D1B20` | Backgrounds secundários |
| `surfaceContainer` / `Dark.bgCard` | `#211F26` | Cards em tema escuro |
| `onSurface` / `Dark.textPrimary` | `#E6E0E9` | Texto principal (contraste alto) |
| `onSurfaceVariant` / `Dark.textSecondary` | `#CAC4D0` | Texto secundário |
| `outline` / `Dark.border` | `#948F99` | Divisores, bordas |

---

## Superfícies SignallQ IA (DESCONTINUADA)

O Fluxo de Telas marca a tela 7 (SignallQ AI) como **descontinuada** — remover rota, tab e
qualquer referência de navegação; a tabela abaixo é mantida só como registro histórico do As-Is,
não deve orientar nenhuma tela nova.

| Token | Valor | Uso |
|---|---|---|
| `signallQBlack` | `#0D0D1A` | Background principal da superfície SignallQ (As-Is) |
| `signallQDarkSurface` | `#1A0B2E` | Superfícies secundárias dentro do SignallQ (As-Is) |
| `signallQDarkCard` | `#1E1130` | Cards de bolhas de IA (As-Is) |
| `signallQTextOnDark` | `#F3F4F6` | Texto primário sobre escuro (As-Is) |
| `signallQTextSecondaryOnDark` | `#B9B2C4` | Texto secundário sobre escuro (As-Is) |

---

## Notas

- **SignallQ IA descontinuada:** ver acima — não implementar em tela nova.
- **Phase colors:** Mostram progresso visual durante o speedtest nos indicadores de fase e na
  animação do `GaugeCircular`.
- **Acessibilidade:** Todas as combinações de texto+fundo atendem WCAG AA.
- **Implementação Android pendente:** `SignallQTheme.kt` ainda usa os valores anteriores
  (`accent=#6C2BFF`, `secondary` derivado do primary etc.) — atualização de código é fase
  separada, fora do escopo desta correção de documentação (2026-07-13).
