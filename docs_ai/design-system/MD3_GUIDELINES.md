# Material Design 3

App uses Jetpack Compose Material 3.

## Principles

- **Aesthetics**: Modern, updated components
- **Cor fixa da marca**: Esquemas `lightColorScheme`/`darkColorScheme` fixos com acento `#6C2BFF` — não usa dynamic color do sistema
- **Meaningful Motion**: Animations follow MD3 standards
- **Accessibility**: Contrast, usability standards

## Implementation

- **Components**: See `COMPONENTS_ANDROID.md` (doc canônico Android; `COMPONENTS.md` foi arquivado)
- **Colors**: See `COLORS.md` (esquema estático da marca)
- **Typography**: See `TYPOGRAPHY.md`
- **Spacing**: See `SPACING.md`
- **Design Tokens**: See `DESIGN_TOKENS.md`

## Theme File

- Location: `app/src/main/kotlin/io/veloo/app/kotlin/ui/SignallQTheme.kt`
- Antigo nome: `LinkaTheme.kt` (renomeado no rebranding v0.15.0)
- Aplica MD3 via `MaterialTheme`
- Usa `androidx.compose.material3`
- Tokens de cores: `LkColors`, espaçamento: `LkSpacing`, tipografia: `signallQTypography`

**Última atualização:** 2026-07-05 (v0.23.0)

## Deps

- `androidx.compose.material3:material3`
- See `build.gradle.kts` files

## Validação (v0.23.0)

- **Variantes MD3 custom**: nenhuma. `SignallQTheme` usa `MaterialTheme` padrão com `Typography` (`signallQTypography`) de escala ajustada; não há sobrescrita de shapes/componentes MD3.
- **Dynamic color**: não implementado. O tema aplica `lightColorScheme`/`darkColorScheme` fixos com acento da marca (`#6C2BFF`), independente do wallpaper/sistema.
- **Superfícies IA**: paleta escura fixa (`signallQBlack`/`signallQDarkSurface`/`signallQDarkCard`), não segue o tema claro/escuro do sistema.
