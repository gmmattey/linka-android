# Decisão — Container padrão para logos/badges de marca de terceiros

- **Status:** ativo
- **Última validação:** 2026-07-17
- **Fonte de verdade:** este arquivo
- **Escopo:** `OperadoraBadge.kt` (logo de operadora, quando `logoRes`/`logoUrl` bundled ou remoto)
  e `GameArtworkBadge` em `JogosScreen.kt` (arte de jogo, quando `GameArtworkCatalog` tiver asset)
- **Responsável:** Lia (decisão), Camilo (implementação)
- **Issue:** [#1106](https://github.com/gmmattey/linka-android/issues/1106)

## Problema

Logo de operadora bundled (`OperadoraBadge.kt`, linhas 46-56 e 81-91) fica dentro de um `Box` sem
background — exposto direto ao fundo do card/tela por trás, que muda de cor entre tema claro e
escuro. Logo de marca de terceiro normalmente assume fundo claro/branco no próprio arquivo (não é
asset que a SignallQ desenhou); no tema escuro, elementos escuros/finos do logo somem contra o
fundo escuro do app.

`GameArtworkBadge` (fallback sem arte, `JogosScreen.kt` linhas 939-953) já usa fundo `c.primary
@12%` + texto `c.primary` — funciona, mas reportado como "ainda ruim" (contraste baixo,
provavelmente no tema claro, onde `primary @12%` sobre `surface` branco quase não aparece).

## Decisão

### 1. Container fixo, opaco, independente do tema — não deriva de token de superfície

Todo logo/arte real de marca de terceiro (bundled ou remoto) passa a ficar dentro de um
**container com fundo branco fixo** (`Color(0xFFFFFFFF)`, hardcoded — não `LkColors.surface`,
que muda entre temas), igual ao padrão de app de pagamento mostrando logo de banco/parceiro:
não dá pra controlar como o parceiro desenhou o asset, então o fundo do container nunca muda.

Justificativa pra não usar anel/borda sozinho: um anel sem fundo sólido não resolve o problema
raiz (o logo continua caindo sobre o fundo do tema, só ganha uma borda ao redor). Fundo fixo
branco resolve na origem — o logo sempre vê o mesmo fundo pra qual foi desenhado.

**Anel de contraste, adicional (não substitui o fundo):** borda de **1dp**, cor
`LocalLkTokens.current.border` (= `outlineVariant`, token já existente — light `#CAC4D0` / dark
`#49454F`). Necessário porque em tema claro um container branco fixo dentro de um card branco
(`surface`/`surface-container` claro) fica sem separação visual nenhuma — o anel garante que o
badge sempre tenha um contorno legível nos dois temas, mesmo quando o fundo ao redor já é claro.

### 2. Forma e dimensão — não muda o tamanho do badge existente, só adiciona camada por trás

- **Operadora (`OperadoraBadge.kt`):** container **circular** (`CircleShape`), mesmo `size` já
  recebido pelo composable (`40.dp` default) — não altera a API nem o tamanho visual do badge.
  Logo continua com o mesmo padding interno (`size * 0.08f`, já existente — não mexer).
- **Jogos (`GameArtworkBadge`):** container com **`RoundedCornerShape(cornerRadius)`**, usando o
  mesmo `cornerRadius` já recebido como parâmetro (10.dp / 14.dp conforme o call site) — não
  altera a API nem introduz raio novo. `size` do container = `size` já recebido.

Em ambos os casos: fundo branco + borda ficam **atrás** da `Image` existente (mesmo `Box`/
`Modifier.background`, aplicado antes do `clip`/`Image`), sem alterar `ContentScale`,
`contentDescription` ou o próprio recorte da imagem.

### 3. Fallback de monograma (operadora) e sigla (jogos) — convergem pro mesmo padrão

Os dois fallbacks devem seguir o **mesmo padrão visual** entre si (não há razão de domínio pra
operadora e jogo terem fallbacks diferentes — os dois são "badge de identidade sem asset real"):

- **Cor de fundo:** cor de marca quando existir (`corMarca` na operadora), senão
  `LkColors.primary` (`#5B21D6` claro / `#D0BCFF` escuro) — já é o padrão do `MonogramaBadge`
  (`corMarca ?: LkColors.accent`, mantém `accent` = `primary`).
- **Opacidade do fundo: 100% (sólido), não translúcido.** É a mudança em relação ao estado atual
  de jogos — o `c.primary.copy(alpha = 0.12f)` (linha 944 de `JogosScreen.kt`) sai; passa a usar
  fundo sólido igual ao `MonogramaBadge` de operadora.
  - Motivo: `alpha=0.12f` sobre `surface` claro (branco) resulta em contraste quase nulo — é
    exatamente o "ainda fica ruim" relatado pelo Luiz. Fundo sólido + texto branco garante
    contraste ≥ 4.5:1 nos dois temas, sem depender da cor de fundo por trás.
- **Cor do texto: sempre branco (`Color.White`), nunca `c.primary`.** Consistente com o
  `MonogramaBadge` de operadora — texto colorido sobre fundo tingido é o padrão que causou o
  problema de contraste relatado.
- **Forma:** mantém a forma própria de cada contexto — círculo pra operadora
  (`CircleShape`, já é assim), cantos arredondados pra jogos (`RoundedCornerShape(cornerRadius)`,
  já é assim). Não força os dois pra círculo — a forma de jogos já reflete capa/artwork
  retangular, mudar isso não faz parte deste escopo.
- **Sigla/monograma:** mantém a lógica de geração de texto de cada um (`identidade.monograma` na
  operadora, `jogoSigla(jogo.nome)` em jogos) — não muda.

Fallback (sem asset) **não** recebe o anel de `outlineVariant` do item 1 — já tem contraste
suficiente por conta própria (fundo sólido de cor de marca/primary). O anel é só pro caso de logo
real (fundo branco fixo, que precisa de definição contra card claro).

## Instruções fechadas para o Camilo

### `OperadoraBadge.kt`

Nos dois `Box` que hoje envolvem `Image(painter = painterResource(logoRes...))` (linhas 46-56 e
81-91) e no branch equivalente do `when` (linha 81 do segundo overload):

```kotlin
Box(
    modifier = modifier
        .size(size)
        .background(Color.White, CircleShape)
        .border(1.dp, LocalLkTokens.current.border, CircleShape),
    contentAlignment = Alignment.Center,
) {
    Image(
        painter = painterResource(logoRes),
        contentDescription = operadora.nome,
        modifier = Modifier.padding(size * 0.08f),
    )
}
```

(mesma mudança nos dois overloads de `OperadoraBadge` — `ContatoOperadora` e
`ResolvedOperadoraIdentity` — e no branch `logoRes != null` do `when`). Import necessário:
`androidx.compose.foundation.border`, `androidx.compose.ui.platform.LocalDensity` não é
necessário (já usa `.dp`/`Dp` direto). `LocalLkTokens` já é usado no resto do app — se ainda não
importado neste arquivo, adicionar `io.signallq.app.ui.LocalLkTokens` (conferir o import real
usado em outros arquivos do pacote `ui/component`, ex. `JogosScreen.kt`).

**`MonogramaBadge` (linhas 126-147):** trocar `color = Color.White` — já está correto, não mexer.
Não precisa de anel (fallback não leva borda, item 1 acima).

### `GameArtworkBadge` em `JogosScreen.kt`

No branch `if (artwork != null)` (linhas 926-936), envolver a `Image` existente com o mesmo
container branco + borda, preservando `clip(RoundedCornerShape(cornerRadius))` na imagem:

```kotlin
if (artwork != null) {
    Box(
        modifier = Modifier
            .size(size)
            .background(Color.White, RoundedCornerShape(cornerRadius))
            .border(1.dp, c.border, RoundedCornerShape(cornerRadius)),
        contentAlignment = Alignment.Center,
    ) {
        Image(
            painter = painterResource(id = artwork.drawableRes),
            contentDescription = jogo.nome,
            modifier = Modifier
                .size(size)
                .clip(RoundedCornerShape(cornerRadius)),
            contentScale = ContentScale.Crop,
        )
    }
    return
}
```

No fallback (linhas 939-953), trocar só a opacidade e a cor do texto — mantém forma e `size`:

```kotlin
Box(
    modifier = Modifier
        .size(size)
        .clip(RoundedCornerShape(cornerRadius))
        .background(c.primary), // era c.primary.copy(alpha = 0.12f)
    contentAlignment = Alignment.Center,
) {
    Text(
        text = jogoSigla(jogo.nome),
        style = if (size > 40.dp) MaterialTheme.typography.titleSmall else MaterialTheme.typography.labelMedium,
        color = Color.White, // era c.primary
        fontWeight = FontWeight.W700,
    )
}
```

`c` já existe no escopo (`LocalLkTokens.current`, linha 923) — usar `c.border` em vez de
`LocalLkTokens.current.border` neste arquivo específico, por consistência com o resto do
composable.

### Checklist de implementação

- [ ] Não alterar `size`, `cornerRadius`, `contentDescription`, `ContentScale` ou parâmetros
      públicos dos composables — só a camada de fundo/borda por trás da `Image` e a cor/opacidade
      do fallback.
- [ ] `Color.White` é hardcode intencional (fundo de logo de marca, não de superfície do app) —
      não substituir por token de tema.
- [ ] Borda usa token existente (`LocalLkTokens.current.border` / `c.border`), não hardcode.
- [ ] Validar visualmente nos dois temas (claro/escuro) contra pelo menos 1 operadora com logo
      bundled real e 1 jogo com artwork real, se houver asset disponível — caso contrário, validar
      via preview do Compose com override de tema.
- [ ] `ktlintCheck` / `detekt` / build do módulo `:app` depois da mudança.

## Alternativas consideradas e descartadas

- **Anel de contraste sem fundo sólido:** não resolve a causa raiz (logo continua caindo sobre
  fundo do tema atrás dele) — só adiciona um contorno. Descartado como solução única, mantido
  como complemento (item 1).
- **Fundo = `LkColors.surface` (token de tema) em vez de branco fixo:** resolveria o contraste do
  container contra o card, mas não resolve o logo em si — em tema escuro, `surface` também é
  escuro (`#131217`), reproduzindo o problema original. Descartado.
- **Forçar todos os fallbacks (operadora + jogos) para a mesma forma (círculo):** fora de escopo —
  jogos usam cantos arredondados propositalmente (arte de capa/artwork, não ícone de marca
  redondo). Mantidas as formas atuais, só convergindo cor/opacidade/contraste.
