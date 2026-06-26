---
name: github-pwa
description: Use ao preparar, abrir, revisar, atualizar ou mergear PRs do SignallQ PWA no GitHub. Evita bloqueios recorrentes de branch desatualizada, required checks filtrados por path, PR body quebrando automações do board, merge administrativo PWA-only e mistura acidental com Android/Admin.
---

# GitHub PWA — SignallQ

## Objetivo

Conduzir PRs do SignallQ PWA sem repetir os impedimentos recentes do GitHub.

Use junto com `checar-release` quando houver validação de build/preview/deploy.

## Fontes

Consultar quando houver dúvida:

- GitHub docs — troubleshooting required status checks: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/troubleshooting-required-status-checks
- GitHub docs — protected branches: https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches
- GitHub docs — security hardening for GitHub Actions: https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions

## Regras de escopo

- PR PWA deve alterar somente `pwa/**`, salvo autorização explícita.
- Não misturar PWA com Android, Gradle, Admin Worker, migrations ou CI global.
- Se o checkout atual estiver em branch não-PWA ou tiver mudanças fora de `pwa/`, criar worktree separada baseada em `origin/main`.
- Stagear caminhos explicitamente; não usar `git add -A` em worktree mista.

## Antes de abrir PR

1. Verificar branch e sujeira:

```powershell
git status -sb
git branch --show-current
```

2. Se houver mudanças fora de `pwa/`, isolar:

```powershell
git worktree add C:\Projetos\SignallQ-pwa-<slug> origin/main -b codex/pwa/<sig-id>-<slug>
```

3. Validar no diretório `pwa/`:

```powershell
npm ci
npm run typecheck
npm run build
npm test
npm run lint
```

Se `lint` não existir, registrar como pendência. Não fingir sucesso.

4. Confirmar que não há segredo no frontend quando tocar IA/Admin:

```powershell
rg -n "INGEST_KEY|ADMIN_INGEST_KEY|AI_WORKER_URL|sk-" src public dist
```

## Corpo de PR seguro

O workflow `.github/workflows/auto-move-board.yml` lê título/corpo do PR dentro de shell. Até o workflow ser corrigido, escrever corpo de PR sem crases, sem fenced code block e sem `$()`.

Evitar:

- crases Markdown;
- blocos ```powershell;
- textos como `/api/*` dentro de crases;
- `${...}`, `$VAR` ou `$(...)`;
- comandos copiados em bloco.

Preferir:

```text
Resumo

- Altera somente pwa.
- Relacionado a SIG-40 e SIG-41.

Validacao

- npm ci: passou
- npm run typecheck: passou
- npm run build: passou
- npm test: passou
- npm run lint: nao existe

Riscos

- Installability real precisa de preview/browser alvo.
```

Incluir explicitamente IDs Linear, por exemplo `SIG-40 e SIG-41`. O auto-move antigo procura `#123`; Linear usa `SIG-123`, então não depender dele para vincular issue.

## Checks e branch protection

Interpretação operacional:

- `Build & Test` em `PWA CI` deve passar para PR PWA.
- `Cloudflare Pages` deve passar quando existir preview.
- `move-card` deve passar; se falhar por body do PR, remover Markdown perigoso do corpo e reexecutar/atualizar o PR.
- Checks Android filtrados por `android/**` podem não rodar em PR PWA-only. Se a `main` exigir esses checks globalmente, o merge normal pode ser bloqueado mesmo com PWA verde.
- Quando GitHub disser que a branch não está atualizada com a base, rebasear antes de mergear.

Rebase seguro:

```powershell
git fetch origin main
git rebase origin/main
npm run typecheck
npm run build
npm test
git push --force-with-lease origin <branch>
```

Usar `--force-with-lease`, nunca `--force`.

## Merge

Antes de mergear:

```powershell
gh pr view <num> --repo gmmattey/linka-android --json isDraft,mergeable,statusCheckRollup,headRefName,baseRefName
```

Se estiver draft:

```powershell
gh pr ready <num> --repo gmmattey/linka-android
```

Tentar merge normal primeiro:

```powershell
gh pr merge <num> --repo gmmattey/linka-android --merge --delete-branch
```

Usar `--admin` somente quando todos forem verdadeiros:

- PR altera apenas `pwa/**`;
- PWA CI passou;
- Cloudflare Pages passou quando aplicável;
- `move-card` passou ou a falha foi comprovadamente operacional e documentada;
- bloqueio restante vem de proteção global da `main` para checks fora do escopo PWA;
- usuário pediu merge ou autorizou seguir.

Comando:

```powershell
gh pr merge <num> --repo gmmattey/linka-android --merge --delete-branch --admin
```

## Depois do merge

Confirmar:

```powershell
gh pr view <num> --repo gmmattey/linka-android --json state,mergedAt,mergeCommit,statusCheckRollup
git fetch origin main --prune
```

Atualizar Linear:

- comentar issues envolvidas;
- registrar merge commit;
- listar checks finais;
- explicar se houve merge administrativo;
- não mover issue para Done se ainda faltar validação de preview, installability, mobile ou secrets.

## Aprendizado recente

PR #281 (`Codex PWA — consolidar instalabilidade e tokens M0`) exigiu:

- remover Markdown com crases do corpo do PR porque `auto-move-board` executou trechos como shell;
- rebase em `origin/main` porque GitHub bloqueou branch desatualizada;
- validação local pós-rebase;
- merge administrativo porque a política global da `main` bloqueou PR PWA-only apesar de PWA CI e Cloudflare Pages verdes;
- registro no Linear de `SIG-40`, `SIG-41` e status do projeto.

Use esse caso como padrão para PRs PWA-only até a proteção de branch e o workflow do board serem ajustados.

## Saída esperada

Ao usar esta skill, informar:

- PR/branch alvo;
- escopo tocado;
- checks executados e resultado;
- checks pendentes ou bloqueios;
- decisão de merge normal, aguardar, rebasear ou merge administrativo;
- atualizações feitas no Linear;
- se tocou ou não fora de `pwa/`.
