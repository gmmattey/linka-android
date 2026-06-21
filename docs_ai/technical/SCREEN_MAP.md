# Screen Map — Android SignallQ

**Última atualização:** 2026-06-21 (v0.16.0)
**Fonte:** código real (`AppShell.kt`)

Todas as telas residem em:
`app/src/main/kotlin/io/veloo/app/kotlin/ui/screen/`

---

## NavigationBar — 5 Abas

Definidas em `AppShell.kt` (`AppBottomNavBar`, índices 0–4):

| Índice | Label | Composable | Arquivo |
|---|---|---|---|
| 0 | Início | `HomeScreen` | `HomeScreen.kt` |
| 1 | Velocidade | `VelocidadeScreen` (tab) | `VelocidadeScreen.kt` |
| 2 | Sinal | `SinalScreen` | `SinalScreen.kt` |
| 3 | Histórico | `HistoricoScreen` | `HistoricoScreen.kt` |
| 4 | Ajustes | `AjustesScreen` | `AjustesScreen.kt` |

> Não existe aba "Mais". `AjustesScreen` é a aba 4. `DispositivosScreen` e o diagnóstico de IA não são abas — são telas sobrepostas (overlays).
>
> ⚠️ `navigation/AppNavGraph.kt` ainda declara constantes legadas (`home`, `diagnostico`, `dispositivos`, `historico`, `ajustes`) que **não** correspondem às abas reais. A navegação viva é baseada em índice (`selectedTab`) + pilha de overlays no `AppShell.kt`, não no `AppNavGraph`.

---

## Telas Sobrepostas (Overlays)

Controladas por `overlayStack` / estado no `AppShell.kt`. Não são rotas do Navigation Component — são sobrepostas via `AnimatedVisibility` (`slideInVertically`).

| Composable | Arquivo | Trigger | Retorno |
|---|---|---|---|
| `ResultadoVelocidadeScreen` | `ResultadoVelocidadeScreen.kt` | Teste concluído | → DiagnosticoScreen / SignallQScreen / voltar |
| `DiagnosticoScreen` | `DiagnosticoScreen.kt` | ResultadoVelocidade ou ações da Home | → SignallQScreen / LLMChatScreen |
| `SignallQScreen` | `SignallQScreen.kt` | "Diagnóstico IA" (assistente SignallQ, superfície escura) | → volta ao chamador |
| `LLMChatScreen` | `LLMChatScreen.kt` | "Conversar com IA" | → volta ao chamador |
| `DispositivosScreen` | `DispositivosScreen.kt` | Ações/atalhos da Home | → volta ao chamador |
| `FibraScreen` | `FibraScreen.kt` | AjustesScreen → seção Fibra | → AjustesScreen |
| `LaudoScreen` | `LaudoScreen.kt` | AjustesScreen → "Gerar Laudo" | → AjustesScreen |
| `PrivacidadeScreen` | `PrivacidadeScreen.kt` | Ajustes → Privacidade (`FEATURE_PRIVACIDADE_TELA`) | → AjustesScreen |
| `NovidadesScreen` | `NovidadesScreen.kt` | Ajustes → Novidades (`FEATURE_NOVIDADES_TELA`) | → AjustesScreen |
| `SignallQPulseScreen` | `SignallQPulseScreen.kt` | Monitoramento contínuo (`FEATURE_LINKPULSE_ATIVO`, off em release) | → volta ao chamador |

---

## Onboarding

| Composable | Arquivo | Acesso |
|---|---|---|
| `OnboardingScreen` | `OnboardingScreen.kt` | Apenas primeira execução (`onboardingConcluido = false` no DataStore) |

---

## Arquivos de Suporte à Navegação

| Arquivo | Papel |
|---|---|
| `AppShell.kt` | Shell do app — `NavigationBar` de 5 abas (índice 0–4) + pilha de overlays (`overlayStack`) para telas sobrepostas |
| `navigation/AppNavGraph.kt` | Constantes legadas (não refletem a navegação atual — ver aviso acima) |
| `MainViewModel.kt` | ViewModel raiz `@HiltViewModel` — expõe os snapshots/estados consumidos pelas telas |

---

## Diagrama de Navegação

```
OnboardingScreen (primeira execução)
    ↓
AppShell  (NavigationBar índice 0–4 + overlays)
├── [0] HomeScreen
│       ├── → DispositivosScreen (overlay)
│       └── → DiagnosticoScreen / SignallQScreen (overlay)
├── [1] VelocidadeScreen
│       └── → ResultadoVelocidadeScreen (overlay)
│               ├── → SignallQScreen / LLMChatScreen (IA SignallQ)
│               └── → DiagnosticoScreen
├── [2] SinalScreen
│       └── → TopologiaBottomSheet (inline)
├── [3] HistoricoScreen
└── [4] AjustesScreen
        ├── → FibraScreen
        ├── → LaudoScreen
        ├── → PrivacidadeScreen
        ├── → NovidadesScreen
        └── → ProfileAvatarButton → PerfilEditSheet
```
