# Decisões Operacionais

## ADR-001 — SignallQ PWA como projeto separado

Data: 25/06/2026

### Decisão

Criar documentação e operação próprias para o SignallQ PWA, separadas da documentação geral do Android.

### Motivo

O PWA tem stack, limitações, backlog e entrega próprios.

### Consequência

O SignallQ continua como guarda-chuva, mas o PWA tem documentação operacional própria.

## ADR-002 — Custo zero como regra

### Decisão

A versão inicial deve priorizar Cloudflare Pages, Workers e D1 dentro do free tier sempre que possível.

### Motivo

Validar produto e acelerar entrega sem abrir custo fixo cedo.

## ADR-003 — Sem chat livre no diagnóstico

### Decisão

O PWA seguirá diagnóstico guiado e acionável, sem chat aberto como experiência principal.

### Motivo

Chat livre aumenta custo, reduz previsibilidade e pode deixar usuário comum perdido.

## ADR-004 — Repositório compartilhado Android + PWA

Data: 25/06/2026

### Decisão

Android e PWA continuam no mesmo repositório Git:

```text
gmmattey/linka-android
```

Android e PWA têm áreas de trabalho separadas por pasta, branch e PR.

### Regras

- PWA trabalha principalmente em `pwa/`.
- Android não deve alterar `pwa/` sem alinhamento.
- PWA não deve alterar Android sem alinhamento.
- Mudanças compartilhadas exigem revisão explícita.
- PRs devem ser pequenos, focados e rastreados.

## ADR-005 — Padrão Codex para branches, PRs e docs

Data: 25/06/2026

### Decisão

Branches e PRs do fluxo PWA/Codex devem começar com `codex`.

Formato preferido:

```text
codex/pwa/<sig-id>-<descricao-curta>
```

Fallback:

```text
codex-pwa-<sig-id>-<descricao-curta>
```

PRs devem começar com:

```text
Codex PWA —
```

### Motivo

Como o repositório é compartilhado com Android, o prefixo deixa claro que o fluxo pertence ao PWA/Codex.

### Documentação

Notion guarda contexto e decisões.

`pwa/docs` guarda instruções operacionais versionadas.

Quando uma regra do Notion impactar execução, ela deve ser transposta para `pwa/docs`.
