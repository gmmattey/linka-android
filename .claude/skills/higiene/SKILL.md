---
name: higiene
description: higiene periódica do repositório e do workspace — docs desatualizadas, arquivos órfãos, branches/worktrees mortas, retenção de tasks e desperdício de tokens. Executada pela Gema.
---

## Quando usar
Gema executa periodicamente: docs quinzenalmente ou após mudança de arquitetura; workspace/tasks semanalmente; branches/worktrees quando Agent Teams com worktrees foram usadas; tokens quando a sessão parecer cara ou lenta.

---

## Docs

Escopo:

```
docs_ai/
pwa/docs/  (se existir)
.claude/agents/*.md
.claude/skills/*/SKILL.md
CLAUDE.md (raiz)
```

### Checklist

Documentação técnica:
- [ ] `ANDROID_TECNICO.md` — módulos listados batem com `settings.gradle`?
- [ ] `ANDROID_FUNCIONAL.md` — fluxos descritos batem com a navegação atual?
- [ ] Referências a agentes aposentados removidas?
- [ ] Skills listadas no CLAUDE.md batem com as existentes em `.claude/skills/`?

Agentes:
- [ ] Agentes em `.claude/agents/` batem com os listados no CLAUDE.md?
- [ ] Nenhum agent referencia agente aposentado como obrigatório?
- [ ] Modelos declarados no frontmatter batem com a política atual?

Skills:
- [ ] Toda skill tem frontmatter com `description:`?
- [ ] Nenhuma skill referencia agente que não existe mais?
- [ ] Skills duplicadas? (duas skills cobrindo o mesmo domínio)

### Ação por problema

| Problema | Ação |
|---|---|
| Doc desatualizado | Atualizar ou marcar `[DESATUALIZADO]` no topo |
| Referência quebrada | Remover ou corrigir |
| Skill duplicada | Consolidar, manter a mais completa |
| Doc órfão (sem referência) | Mover para `docs_ai/_archive/` |

Gema corrige inconsistências simples. Reescritas completas de documentação → Taisa (on-demand).

---

## Workspace/tasks

### Checklist de workspace

Arquivos temporários:
- [ ] Remover `*.tmp`, `*.bak` gerados acidentalmente em `.claude/`
- [ ] Remover arquivos de sessão antigos

Improvements:
- [ ] Propostas em `.claude/improvements/proposals/` com mais de 30 dias → revisar ou rejeitar
- [ ] Propostas aprovadas já aplicadas → mover para `rejected/applied/`

Estado geral:
- [ ] MEMORY.md (auto-memory) com entradas stale → atualizar ou remover
- [ ] Scripts em `.claude/scripts/` ainda relevantes?

### Política de retenção de tasks

| Status | Tempo | Ação |
|---|---|---|
| BACKLOG | Ilimitado | Manter |
| QUEUED | > 14 dias sem IN_PROGRESS | Verificar relevância com Claudete |
| IN_PROGRESS | Ilimitado | Manter (nunca auto-arquivar) |
| BLOCKED | > 7 dias | Verificar se o bloqueio foi resolvido |
| REVIEW | > 3 dias | Cobrar QA pendente |
| DONE | > 7 dias | Arquivar para `.claude/tasks/archive/YYYY-MM/` |
| STALE | Sem update em 7 dias | Marcar. Após 14 dias total → sugerir cleanup |
| CANCELLED | > 3 dias | Arquivar |

Detecção de STALE — a task entra em STALE quando:
1. Está em QUEUED, BACKLOG ou BLOCKED há mais de 7 dias sem atualização no arquivo.
2. Está em REVIEW há mais de 3 dias sem ação de Gema.

Gema atualiza o arquivo da task com:
```markdown
**Status:** STALE
**Stale desde:** AAAA-MM-DD
**Motivo:** Sem atualização por X dias
```

Arquivamento:
```powershell
Move-Item .claude/tasks/active/task-xxx.md .claude/tasks/archive/YYYY-MM/task-xxx.md
```

```
.claude/tasks/active/task-xxx.md
  → (7+ dias em DONE)         → .claude/tasks/archive/YYYY-MM/task-xxx.md
  → (14+ dias sem update)     → .claude/tasks/stale/task-xxx.md
```

Limites:
- Nunca deletar task IN_PROGRESS sem aprovação explícita do usuário.
- Dúvida sobre relevância de task STALE → perguntar antes de arquivar.

---

## Branches e worktrees

### Comandos de auditoria

```powershell
git branch -v          # branches locais
git branch -r          # branches remotas
git worktree list      # worktrees ativas

# Branches sem commits recentes
git for-each-ref --sort=committerdate refs/heads/ --format='%(refname:short) %(committerdate:relative)'
```

### Critérios de cleanup

| Item | Critério | Ação |
|---|---|---|
| Branch local | Sem commits há > 30 dias e sem PR aberta | Candidata a deleção — confirmar com usuário |
| Branch local | Mergeada em main/master | Deletar (`git branch -d`) |
| Worktree | Sem task ativa correspondente | Remover (`git worktree remove`) |
| Branch remota | Deletada no remote, ainda local | Limpar (`git remote prune origin`) |

Limites:
- Não deletar branches sem confirmação explícita do usuário.
- Worktrees órfãs: confirmar que não há trabalho em andamento antes de remover.

---

## Tokens/custo

Audite desperdício de tokens na sessão ou contexto fornecido.

### O que detectar

Desperdício de leitura:

| Padrão | Impacto |
|---|---|
| Arquivo lido inteiro quando apenas uma função era necessária | Alto |
| Módulo aberto sem uso posterior no plano | Médio |
| Mesmo arquivo lido múltiplas vezes na sessão | Médio |
| `Glob **/*.kt` em módulo grande quando arquivo específico bastava | Alto |
| Read de CLAUDE.md a cada subtask em vez de uma vez por sessão | Baixo |

Desperdício de geração:

| Padrão | Impacto |
|---|---|
| Agente repete contexto completo que o anterior já entregou | Alto |
| Formato de 8 seções para task simples de 2 linhas | Médio |
| Justificativa de cada microdecisão quando "implementei X" bastava | Baixo |
| Raciocínio filosófico ou chain-of-thought completo visível | Alto |
| Explicar o que o código faz em vez de o que faz diferente | Baixo |

Desperdício de planejamento:

| Padrão | Impacto |
|---|---|
| Agente opus planeja task trivial que um dev poderia resolver direto | Alto |
| Mapeamento de impacto manual para bugfix de 5 linhas | Médio |
| revisar-ux acionado para mudança de token de cor existente | Médio |
| QA especializado consultado para task sem domínio crítico | Baixo |

### Regras de leitura incremental

- Use `Grep` por símbolo/classe antes de `Read` do arquivo.
- Se Grep encontrar o arquivo, `Read` apenas as linhas relevantes (offset + limit).
- Não abra módulo inteiro para encontrar uma função.
- Leia CLAUDE.md uma vez por sessão, não a cada subtask.
- Prefira `Grep -A 10` ao redor do match a `Read` do arquivo inteiro.

### Entregue
1. Padrão de desperdício identificado — onde e como.
2. Impacto estimado — baixo / médio / alto por ocorrência.
3. Como corrigir — mudança específica no prompt, agente ou skill.
4. Ganho esperado — redução estimada de custo/contexto por sessão.

---

## Output consolidado

Relatório para Claudete:

```
## Relatório de Higiene — [DATA]

### Docs
- X docs atualizados / marcados, X referências corrigidas, X skills consolidadas

### Workspace/tasks
- X tasks arquivadas (DONE > 7 dias)
- X tasks marcadas STALE
- X tasks em BLOCKED sem resolução (> 7 dias)
- X proposals expiradas (> 30 dias)

### Branches e worktrees
- Candidatas a cleanup: [lista]
- Worktrees órfãs: [lista]

### Tokens/custo
- Padrões de desperdício: [lista com impacto e correção]

### Ação necessária / pendências
- [lista se houver]
```

## Limites gerais
- Gema não deleta tasks ativas, branches ou worktrees sem aprovação do usuário.
- Dúvida sobre relevância → perguntar antes de remover.
