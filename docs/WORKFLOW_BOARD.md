# Workflow do Board — Como os agentes movimentam as issues

O Project **LINKA Android — Roadmap** (https://github.com/users/gmmattey/projects/8) é atualizado automaticamente conforme os agentes do squad trabalham. Existem **3 camadas** de automação:

## 1. Agente chama `scripts/agent-handoff.sh` em cada handoff

É a forma canônica. Substitui (na verdade, encapsula) o `scripts/notify.sh` que cada agente já chamava.

```bash
scripts/agent-handoff.sh <agente> <evento> <issue#> "<msg>" [--para <outroAgente>]
```

| Evento | Coluna destino | Quando usar |
|---|---|---|
| `start` | Em andamento | Agente puxou a issue da fila e começou |
| `handoff` | Em andamento | Passou bastão para outro agente que vai continuar implementação |
| `review` | Em review | Implementação pronta, Gema revisa |
| `docs` | Docs & Higiene | Gema aprovou, Nina/Taisa atualizam changelog/docs |
| `done` | Done | Higiene fechada — issue é fechada no GitHub |
| `block` | (mantém) | Bloqueado por dependência ou decisão pendente |
| `refine` | Triagem | Devolve para Claudete porque tarefa está mal definida |
| `ready` | Pronta para dev | Refinamento concluído, dev pode pegar |

### Exemplos reais (alinhados às specs dos agentes)

```bash
# Camilo iniciando implementação de Hilt (#3)
scripts/agent-handoff.sh camilo start 3 "Hilt: começando setup do plugin + module Network"

# Marcelo entregando mapeamento para o Camilo
scripts/agent-handoff.sh marcelo handoff 3 "DI manual mapeado em 7 arquivos" --para camilo

# Camilo terminou — Gema revisa
scripts/agent-handoff.sh camilo review 3 "implementação pronta, build verde"

# Gema aprovou — Nina entra
scripts/agent-handoff.sh gema docs 3 "aprovado sem ressalvas" --para nina

# Nina fechou a entrega
scripts/agent-handoff.sh nina done 3 "v0.9.2 publicado, changelog atualizado"

# Refactor virou monstro — Claudete redivide
scripts/agent-handoff.sh camilo refine 4 "task gigante demais, precisa quebrar em 3" --para claudete
```

Cada chamada faz **três coisas**:
1. Move o card no Project board para a coluna certa
2. Ajusta labels (`agent:*`, `status:*`)
3. Notifica Discord + Slack com link clicável da issue

## 2. Comando manual `scripts/issue-move.sh`

Para mover uma issue sem notificar (ex: ajuste de housekeeping):

```bash
scripts/issue-move.sh <issue#> <coluna> [agente]
```

Aceita aliases: `ready`, `wip`, `doing`, `review`, `docs`, `done`, `triagem`, `backlog`.

## 3. GitHub Actions — `auto-move-board.yml` (safety net)

Roda no GitHub e cobre os casos em que algo muda **fora** do controle do agente local:

| Evento externo | Coluna automática |
|---|---|
| Issue aberta com label `status:agent-ready` | Pronta para dev |
| Issue aberta sem essa label | Triagem |
| Label `status:in-progress` adicionada | Em andamento |
| Label `status:waiting-review` adicionada | Em review |
| Label `status:blocked` adicionada | Triagem |
| PR aberto que referencia `#N` | issue #N → Em review |
| PR mergeado que referencia `#N` | issue #N → Docs & Higiene |
| Issue fechada | Done |

### Pré-requisito do workflow

A Action precisa de um **Personal Access Token** com scope `project` armazenado como secret `PROJECT_PAT` no repo. O `GITHUB_TOKEN` default **não** dá acesso a Projects v2.

Setup:
1. https://github.com/settings/tokens?type=beta → Generate new token (fine-grained)
2. Scope: `Projects: Read and write` no perfil do usuário `gmmattey`
3. Repo settings → Secrets and variables → Actions → New repository secret → `PROJECT_PAT` = `<token>`

Sem isso, o workflow vira no-op (`if: secrets.PROJECT_PAT != ''`).

## Cadeia típica de uma issue P0

```
Triagem (Claudete refina)
  └─ ready  → Pronta para dev (agent:claudete + status:agent-ready)
     └─ start (Camilo)  → Em andamento (agent:camilo + status:in-progress)
        └─ review  → Em review (agent:gema + status:waiting-review)
           └─ docs  → Docs & Higiene (agent:nina)
              └─ done  → Done (issue fechada)
```

## Variáveis de ambiente (para os scripts)

Os scripts já têm os IDs do projeto atual hardcoded como default. Se mover de projeto, sobrescreva:

```bash
PROJ_NUM=8
PROJ_ID=PVT_kwHOD83n7c4BYmdL
FIELD_COLUNA=PVTSSF_lAHOD83n7c4BYmdLzhTrIt4
REPO=gmmattey/linka-android
```
