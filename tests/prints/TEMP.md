# Plano Técnico — Issue #95: Histórico — gráfico + cards de média + filtros

Branch a criar: `feat/95-historico-grafico-filtros`
Data: 2026-05-26

---

## Agentes invocados

Nenhum subagente Marcelo foi acionado nesta interação. Justificativa: os caminhos absolutos dos
arquivos-chave foram fornecidos diretamente no enunciado da tarefa, e a exceção da regra se aplica
quando o caminho já é conhecido. Leituras adicionais (feature/history, AppShell, schema) foram
feitas a partir de caminhos descobertos via Bash find nos arquivos inicialmente lidos.

---

## Estado atual do código (lido em 2026-05-26)

### MedicaoEntity — campos relevantes

```kotlin
// coreDatabase/src/main/kotlin/io/linka/app/kotlin/core/database/MedicaoEntity.kt
@Entity(tableName = "medicao")
data class MedicaoEntity(
    val connectionType: String,          // "wifi" | "cellular" | "ethernet"
    val downloadMbps: Double?,
    val uploadMbps: Double?,
    val operadoraMovel: String? = null,  // JA EXISTE — adicionado anteriormente
    // ... demais campos
)
```

**Conclusão crítica: campo `operadoraMovel` já existe na entidade e no schema v9. Sem migration necessária.**

### LinkaDatabase — versão atual

```kotlin
// coreDatabase/.../LinkaDatabase.kt
@Database(entities = [...], version = 9, exportSchema = true)
```

Schema v9 já contém coluna `operadoraMovel TEXT`. **Não há trabalho de DB aqui.**

### MedicaoDao — queries existentes

- `observarTodas(): Flow<List<MedicaoEntity>>` — sem filtro
- `observarUltimas(limite)` — por quantidade
- `observarFiltrado(timestampMin, modo, apenasContaminado, limite)` — tem `modo` mas não `connectionType`/`operadoraMovel`

**Falta:** query que filtre por `connectionType` e opcionalmente por `operadoraMovel`.

### HistoryPoint — estrutura atual

```kotlin
// app/src/main/kotlin/io/linka/app/kotlin/ui/HomeScreenTypes.kt
data class HistoryPoint(
    val timestampEpochMs: Long,
    val downloadMbps: Double?,
    val uploadMbps: Double?,
)
```

Não carrega `connectionType` nem `operadoraMovel`. Para o gráfico no Histórico, vamos trabalhar
diretamente com `List<MedicaoEntity>` (já passada para HistoricoScreen) — sem necessidade de
novo tipo de dado.

### Gráfico Canvas — padrão existente (HomeScreen.kt, linhas 1152–1210)

```kotlin
@Composable
private fun MiniLineChart(history: List<HistoryPoint>, modifier: Modifier, c: LkTokens) {
    Canvas(modifier = modifier) {
        // duas séries: dl (LkColors.accent) e ul (LkColors.success)
        // curva bezier cúbica via smoothPath()
        // fill com alpha 0.1f / 0.07f
        // stroke 2.dp, StrokeCap.Round, StrokeJoin.Round
    }
}
```

Padrão a reutilizar literalmente no Histórico — mesma lógica, entrada diferente (`List<MedicaoEntity>`).

### HistoricoScreen — estado atual

```
@Composable
fun HistoricoScreen(
    historico: List<MedicaoEntity>,          // lista completa — filtros serão aplicados na UI
    blocoUptime: List<BlocoUptime>,
    narrativaUptime: String,
    resumoHistorico: ResumoHistorico?,
    nomeUsuario: String,
    fotoUri: String?,
    onAbrirPerfil: () -> Unit,
    onIniciarTeste: () -> Unit,
)
```

LazyColumn atual:
```
item: botão "Medir agora"
item: TendenciaCard (condicional: >= 2 medições)
items: HistoricoCard (lista)
```

Parâmetros a ADICIONAR:
```kotlin
filtroConexao: FiltroConexaoHistorico = FiltroConexaoHistorico.TODOS,
onFiltroConexaoChange: (FiltroConexaoHistorico) -> Unit = {},
filtroOperadora: String? = null,
onFiltroOperadoraChange: (String?) -> Unit = {},
operadorasDisponiveis: List<String> = emptyList(),
```

### MainViewModel — flows relevantes

```kotlin
val historico = MutableStateFlow<List<MedicaoEntity>>(emptyList())  // observarUltimas(100)
val resumoHistorico: StateFlow<ResumoHistorico?>                     // observarTodas() via ObservadorHistoricoRoom
```

`resumoHistorico` calcula médias sobre as últimas 5 medições de TODAS as medições.
Com filtros, os cards de média precisam refletir apenas as medições filtradas — logo,
o cálculo de média precisa ser feito na própria `HistoricoScreen` (ou em um novo flow
derivado do `historico` filtrado).

### ResumoHistorico — estrutura

```kotlin
data class ResumoHistorico(
    val mediaDownloadMbps5: Double?,
    val mediaUploadMbps5: Double?,
    // ...
)
```

Campos `mediaDownloadMbps5` / `mediaUploadMbps5` são calculados sobre últimas 5 — independente
de filtro. Para os **cards de média filtrada** da issue, o cálculo será feito na UI sobre
`historicoFiltrado` (toda a lista filtrada, não só 5).

---

## Arquivos afetados

| Arquivo | Módulo | Tipo de mudança |
|---|---|---|
| `HistoricoScreen.kt` | `app` | Principal — gráfico + cards média + filtros |
| `MainViewModel.kt` | `app` | Novo StateFlow `filtroConexaoHistorico` + `filtroOperadoraHistorico` |
| `AppShell.kt` | `app` | Passar novos parâmetros de filtro ao call site do HistoricoScreen |
| `MedicaoDao.kt` | `coreDatabase` | Nova query com filtro `connectionType` + `operadoraMovel` (opcional) |
| `HomeScreenTypes.kt` | `app` | Novo enum `FiltroConexaoHistorico` |

**Sem migration de banco. Sem nova entidade. Sem nova dependência externa.**

Total: 5 arquivos. 1 domínio: Android.

---

## Novo enum de filtro

```kotlin
// app/src/main/kotlin/io/linka/app/kotlin/ui/HomeScreenTypes.kt
enum class FiltroConexaoHistorico {
    TODOS,
    WIFI,
    MOVEL,
}
```

---

## Detalhamento por componente

### 1. Gráfico de linha — `HistoricoLineChart`

**Localização:** novo composable privado em `HistoricoScreen.kt`

**Entrada:** `List<MedicaoEntity>` (já filtrada)

**Padrão:** idêntico ao `MiniLineChart` de HomeScreen:
- Canvas Compose puro
- Duas séries: `downloadMbps` (LkColors.accentBlue) e `uploadMbps` (LkColors.accent)
- Curva bezier cúbica via `smoothPath()`
- Fill com alpha + linha de stroke 2.dp
- Eixo X = índice temporal (mais antigo à esquerda — inverter lista de DESC para ASC)
- Altura: 120–160dp (maior que o mini-chart da Home)
- Sem eixo Y explícito (mesmo padrão da Home)

**Posição na LazyColumn:** item acima do botão "Medir agora".

**Nota:** a lista do ViewModel vem ordenada DESC (mais recente primeiro). Para o gráfico,
inverter para ASC via `.reversed()` no momento de uso.

### 2. Cards de média — `MediaDownloadUploadRow`

**Localização:** novo composable privado em `HistoricoScreen.kt`

**Estrutura:** Row com dois cards side-by-side

```
[ ↓ Download médio  ]  [ ↑ Upload médio  ]
[ XX.X Mbps         ]  [ XX.X Mbps       ]
[ N testes          ]  [ N testes        ]
```

**Cálculo:** média de todos os `downloadMbps`/`uploadMbps` não-nulos da lista filtrada.
Feito com `remember(historicoFiltrado) { ... }` no composable.

**Posição:** entre o gráfico e o botão "Medir agora" (ou entre gráfico e TendenciaCard).

### 3. Filtros — `FiltroConexaoRow`

**Localização:** novo composable privado em `HistoricoScreen.kt`

**Toggle horizontal (Wi-Fi / Todos / Móvel):**
- Três botões segmentados com estado selecionado destacado
- Usar `FilterChip` do Material3 ou `OutlinedButton`/`Button` com toggle manual
- Posição: acima do gráfico (topo do conteúdo, após topBar)

**Dropdown de operadora (condicional):**
- Aparece APENAS quando `filtroConexao == FiltroConexaoHistorico.MOVEL`
- Lista de operadoras: extraída das medições com `connectionType == "cellular"`,
  campo `operadoraMovel`, distintas e não-nulas
- "Todas as operadoras" como opção default (filtroOperadora == null)
- Implementar com `ExposedDropdownMenuBox` do Material3

**State do filtro:**
- Mantido no ViewModel (`_filtroConexaoHistorico`, `_filtroOperadoraHistorico`) como
  `MutableStateFlow` — persiste ao navegar entre tabs
- Passado via parâmetro para `HistoricoScreen`

### 4. Aplicação dos filtros

**Onde filtrar:** no ViewModel, via `combine` sobre `historico` + estado dos filtros.
Não filtrar no DAO (evita nova coroutine e facilita reatividade dos filtros).

```kotlin
// MainViewModel
private val _filtroConexaoHistorico = MutableStateFlow(FiltroConexaoHistorico.TODOS)
val filtroConexaoHistorico: StateFlow<FiltroConexaoHistorico> = _filtroConexaoHistorico

private val _filtroOperadoraHistorico = MutableStateFlow<String?>(null)
val filtroOperadoraHistorico: StateFlow<String?> = _filtroOperadoraHistorico

val historicoFiltrado: StateFlow<List<MedicaoEntity>> = combine(
    historico,
    _filtroConexaoHistorico,
    _filtroOperadoraHistorico,
) { lista, filtroConexao, filtroOp ->
    lista
        .filter { m ->
            when (filtroConexao) {
                FiltroConexaoHistorico.TODOS -> true
                FiltroConexaoHistorico.WIFI -> m.connectionType == "wifi"
                FiltroConexaoHistorico.MOVEL -> m.connectionType == "cellular"
            }
        }
        .filter { m ->
            filtroOp == null || m.operadoraMovel == filtroOp
        }
}.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

val operadorasDisponiveisHistorico: StateFlow<List<String>> =
    historico.map { lista ->
        lista.filter { it.connectionType == "cellular" }
            .mapNotNull { it.operadoraMovel?.trim()?.ifBlank { null } }
            .distinct()
            .sorted()
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())

fun setFiltroConexaoHistorico(filtro: FiltroConexaoHistorico) {
    _filtroConexaoHistorico.value = filtro
    if (filtro != FiltroConexaoHistorico.MOVEL) _filtroOperadoraHistorico.value = null
}

fun setFiltroOperadoraHistorico(operadora: String?) {
    _filtroOperadoraHistorico.value = operadora
}
```

**`HistoricoScreen` receberá `historicoFiltrado` no lugar do `historico` atual.**
O parâmetro de assinatura será renomeado (ou adicionado) para clareza.

---

## Impacto técnico

### Contrato de `HistoricoScreen` — mudanças de assinatura

Parâmetros a ADICIONAR:
```kotlin
filtroConexao: FiltroConexaoHistorico = FiltroConexaoHistorico.TODOS,
onFiltroConexaoChange: (FiltroConexaoHistorico) -> Unit = {},
filtroOperadora: String? = null,
onFiltroOperadoraChange: (String?) -> Unit = {},
operadorasDisponiveis: List<String> = emptyList(),
```

O parâmetro `historico` existente passa a receber `historicoFiltrado` no call site (AppShell).

### Impacto em AppShell.kt

No call site do `HistoricoScreen` (linha ~411), adicionar:
```kotlin
historico = historicoFiltrado,
filtroConexao = filtroConexaoHistorico,
onFiltroConexaoChange = { viewModel.setFiltroConexaoHistorico(it) },
filtroOperadora = filtroOperadoraHistorico,
onFiltroOperadoraChange = { viewModel.setFiltroOperadoraHistorico(it) },
operadorasDisponiveis = operadorasDisponiveisHistorico,
```

Estados coletados via `collectAsStateWithLifecycle()`.

### Impacto em MedicaoDao

Nenhuma query nova é estritamente necessária (filtro no ViewModel via `combine`).
Opcional de baixa prioridade: adicionar query otimizada se performance for problema
com lista de 100+ registros (improvável, mas documentado).

### Impacto em ObservadorHistoricoRoom / ResumoHistorico

Nenhum. `resumoHistorico` (TendenciaCard) continua calculando sobre todas as medições.
Os novos **cards de média filtrada** calculam inline no composable via `remember`.

---

## Riscos

| Risco | Impacto | Mitigação |
|---|---|---|
| `operadoraMovel` nula em medições antigas (antes da feature de telefonia) | Dropdown vazio ou options "null" | Filtrar com `mapNotNull` + `.ifBlank { null }` |
| `connectionType` usa string `"cellular"` no DB mas exibição é "Móvel" | Filtro não bate | Hardcodar mapeamento: `"cellular"` → MOVEL, `"wifi"` → WIFI |
| Lista DESC do ViewModel → gráfico invertido | Eixo X mostrando mais recente à esquerda | Aplicar `.reversed()` antes de passar para `HistoricoLineChart` |
| Gráfico com 1 ponto só | Curva bezier mal definida | Guard: se `<2` pontos com dados, não renderizar gráfico |
| Dropdown de operadora em lista longa | UX ruim no scroll | `ExposedDropdownMenuBox` com `maxHeight` limitado |
| `historicoFiltrado` emite lista vazia quando filtro sem resultados | Tela aparece em EmptyState | Exibir estado "Nenhum resultado para este filtro" diferente do EmptyState real (zero medições) |
| StateFlow `historicoFiltrado` — recomposição em cascata | Performance | `combine` com `distinctUntilChanged()` + `SharingStarted.WhileSubscribed(5_000)` |

---

## Plano de execução

### Task 1 — HomeScreenTypes: enum `FiltroConexaoHistorico` [Camilo]

**Arquivo:** `app/src/main/kotlin/io/linka/app/kotlin/ui/HomeScreenTypes.kt`

Adicionar:
```kotlin
enum class FiltroConexaoHistorico { TODOS, WIFI, MOVEL }
```

**Critério de aceite:** compilação sem erros. Enum acessível em `:app`.

**Independente** de todas as outras tasks.

---

### Task 2 — MainViewModel: flows de filtro + historicoFiltrado [Camilo]

**Arquivo:** `app/src/main/kotlin/io/linka/app/kotlin/MainViewModel.kt`

**Depende de:** Task 1.

Adicionar:
- `_filtroConexaoHistorico: MutableStateFlow<FiltroConexaoHistorico>`
- `filtroConexaoHistorico: StateFlow<FiltroConexaoHistorico>`
- `_filtroOperadoraHistorico: MutableStateFlow<String?>`
- `filtroOperadoraHistorico: StateFlow<String?>`
- `historicoFiltrado: StateFlow<List<MedicaoEntity>>` via `combine`
- `operadorasDisponiveisHistorico: StateFlow<List<String>>`
- `fun setFiltroConexaoHistorico(filtro)`
- `fun setFiltroOperadoraHistorico(operadora)`

Ver contratos exatos na seção "Aplicação dos filtros" acima.

**Critério de aceite:** compilação. `historicoFiltrado` com filtro TODOS emite idêntico ao `historico`.

---

### Task 3 — HistoricoScreen: gráfico + cards de média + filtros [Camilo + Lia]

**Arquivo:** `app/src/main/kotlin/io/linka/app/kotlin/ui/screen/HistoricoScreen.kt`

**Depende de:** Tasks 1, 2.

**3a. Atualizar assinatura de `HistoricoScreen`** (5 novos parâmetros com defaults).

**3b. Novo composable `HistoricoLineChart`:**
- Entrada: `List<MedicaoEntity>` (já em ordem ASC para o gráfico)
- Canvas Compose puro — replicar exatamente o padrão de `MiniLineChart` de HomeScreen
- Duas séries: dl (LkColors.accentBlue) e ul (LkColors.accent)
- Altura: 140dp
- Guard: não renderizar se `< 2` medições com dados

**3c. Novo composable `MediaDownloadUploadRow`:**
- Calcular médias com `remember(historicoFiltrado) { ... }`
- Dois cards lado a lado com `Row + weight(1f)`
- Exibir "-- Mbps" quando sem dados

**3d. Novo composable `FiltroConexaoRow`:**
- Toggle Wi-Fi / Todos / Móvel (usar `FilterChip` do Material3)
- Dropdown operadora condicional (`ExposedDropdownMenuBox`)

**3e. Reorganizar LazyColumn:**
Nova ordem:
```
item: FiltroConexaoRow     ← NOVO (topo do conteúdo)
item: HistoricoLineChart   ← NOVO (condicional: >= 2 medições com dados)
item: MediaDownloadUploadRow  ← NOVO (condicional: >= 1 medição com dados)
item: botão "Medir agora"  ← existente
item: TendenciaCard        ← existente (condicional)
items: HistoricoCard       ← existente
```

**3f. Estado "filtro sem resultados":**
Quando `historicoFiltrado.isEmpty()` mas `filtroConexao != TODOS`, exibir mensagem
"Nenhum teste encontrado para este filtro" (inline, não EmptyState completo).

**Critério de aceite:** gráfico, cards de média e filtros renderizam corretamente.
Trocar filtro atualiza gráfico + cards + lista simultaneamente.
Dropdown de operadora aparece apenas quando "Móvel" selecionado.

---

### Task 4 — AppShell: wiring dos novos parâmetros [Camilo]

**Arquivo:** `app/src/main/kotlin/io/linka/app/kotlin/ui/screen/AppShell.kt`

**Depende de:** Tasks 2, 3.

No call site do `HistoricoScreen` (~linha 411):
- Trocar `historico = historico` por `historico = historicoFiltrado`
- Adicionar os 5 novos parâmetros de filtro
- Coletar `historicoFiltrado`, `filtroConexaoHistorico`, `filtroOperadoraHistorico`,
  `operadorasDisponiveisHistorico` via `collectAsStateWithLifecycle()`

**Critério de aceite:** build completo sem erros. Filtros funcionam end-to-end.

---

## Ordem de execução segura

```
Task 1 (enum)    ──────── Task 2 (ViewModel) ─────────────────────────────┐
                                                                            ├── Task 3 (HistoricoScreen) ── Task 4 (AppShell)
```

Tasks 1 é independente.
Task 2 depende de Task 1 (enum).
Task 3 depende de Tasks 1 e 2.
Task 4 depende de Tasks 2 e 3.

---

## Critérios de aceite da issue

- [ ] Gráfico de linha com Download + Upload aparece acima do botão "Medir agora"
- [ ] Cards "Download médio" e "Upload médio" exibem média das medições filtradas
- [ ] Toggle Wi-Fi / Todos / Móvel filtra gráfico + cards + lista simultaneamente
- [ ] Dropdown de operadora aparece apenas quando "Móvel" selecionado
- [ ] Dropdown lista apenas operadoras presentes nas medições existentes
- [ ] Trocar filtro com zero resultados exibe mensagem inline (não EmptyState)
- [ ] Gráfico não renderiza com < 2 medições com dados
- [ ] Build sem erros; nenhuma regressão na tela Histórico existente
- [ ] Nenhuma nova dependência de biblioteca introduzida

---

## Testes necessários

| Tipo | Escopo |
|---|---|
| Unit | `historicoFiltrado` — WIFI filtra apenas `connectionType == "wifi"` |
| Unit | `historicoFiltrado` — MOVEL + operadora filtra corretamente |
| Unit | `operadorasDisponiveisHistorico` — exclui nulos e brancos, deduplica, ordena |
| Unit | `setFiltroConexaoHistorico(WIFI)` zera `filtroOperadoraHistorico` |
| Manual (device) | Gráfico com 1 medição → não renderiza |
| Manual (device) | Gráfico com 10 medições → curvas bezier corretas, sem crash |
| Manual (device) | Filtro Móvel sem medições → mensagem inline |
| Manual (device) | Dropdown operadora → lista correta de operadoras |

---

## Gatilhos da Lia

**Lia é obrigatória — múltiplos estados visuais novos.**

**Momento 1 (pré-implementação):**
- Validar layout do `FiltroConexaoRow`: espaçamento, estilo do toggle, posição do dropdown
- Validar layout do `HistoricoLineChart`: altura, cores das séries, comportamento com 0/1/N pontos
- Validar `MediaDownloadUploadRow`: microcopy ("Download médio" / "Upload médio"), formato de valor
- Validar estado inline "Nenhum resultado para este filtro": microcopy e posicionamento
- Validar que dropdown de operadora não quebra layout em telas menores

**Momento 2 (pós-implementação):**
- Junto com Gema: confirmar visual em device real (light + dark theme)
- Confirmar que gráfico + cards + filtros ficam coesos visualmente acima da lista
