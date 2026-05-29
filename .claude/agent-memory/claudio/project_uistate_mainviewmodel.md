---
name: uistate-mainviewmodel-sub-task-c
description: Plano de migração UiState<T> no MainViewModel (issue #12 sub-task C) — dividida em C1/C2/C3 com ordem obrigatória
metadata:
  type: project
---

Sub-task C da issue #12 foi dividida em C1, C2, C3 por impacto em cascata.

**Why:** AppShell recebe valores primitivos como parâmetros — não flows. Mudar 1 flow = 8 arquivos em cascata. 3 flows = ~20 arquivos. Risco de crash em `coletarContextoAdicionalIa()` se tipo mudar sem atualizar o método.

**How to apply:** Sequência obrigatória C1 → C2 → C3. Não pular etapas.

### C1 — localizacaoServidor (4 telas)
- Arquivos: MainViewModel, MainActivity, AppShell, SpeedTestScreen, VelocidadeScreen, ResultadoVelocidadeScreen
- Serve como template para C2 e C3

### C2 — localIp (4 telas)
- Arquivos: MainViewModel, MainActivity, AppShell, HomeScreen, SinalScreen, LaudoScreen
- OBRIGATÓRIO: atualizar `coletarContextoAdicionalIa()` que usa `localIp.value` diretamente

### C3 — ispInfo + publicIp juntos (6 telas)
- Arquivos: MainViewModel, MainActivity, AppShell, HomeScreen, SpeedTestScreen, VelocidadeScreen, ResultadoVelocidadeScreen, LaudoScreen, PerfilEditSheet
- ispInfo e publicIp coletados juntos em `coletarIspInfo()` — migrar os dois ao mesmo tempo
- catch vazio atual vira UiState.Error — banner ISP ganha retry funcional

### Flows NÃO migrar
- narrativaUptime, resumoHistorico, onboardingConcluido, gemmaAvailable, speedtestPendenteModoMovel, apelidos, movelSnapshot, orbitUiStateFlow

### Risco crítico
`coletarContextoAdicionalIa()` usa `ispInfo.value` e `localIp.value` diretamente — crash se não atualizar junto.

Lia necessária nas três sub-tasks (estados visuais afetados).

Plano postado: https://github.com/gmmattey/linka-android/issues/12#issuecomment-4530295954
