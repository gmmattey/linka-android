---
name: refinar-demanda
description: Transforma um pedido bruto em feature estruturada, depois em user story com critérios de aceite, e por fim quebra em tasks executáveis. Executada pela Claudete.
---

## Quando usar
Quando chegar um pedido vago, ideia, dor ou bug sem estrutura e for preciso levá-lo de pedido bruto até tasks prontas para distribuição. Fluxo único de três etapas — não pular etapas.

Se for um bugfix simples (≤5 arquivos), encaminhar direto para Marcelo + Camilo/Renan, sem passar pelo fluxo completo.

Título e corpo das issues resultantes seguem `/issue-conventions`.

---

## Etapa 1 — Captar (intake)
Converte o pedido bruto em feature estruturada antes de virar story.

1. **Capturar pedido bruto** — exatamente como chegou, sem interpretar.
2. **Identificar tipo**: feature / bugfix / melhoria / dor / tech debt / docs.
3. **Identificar plataforma**: Android / PWA / Ambos / Infra.
4. **Identificar usuário afetado** e qual dor ele sente hoje.
5. **Verificar duplicata** — chamar Marcelo para buscar se algo similar já existe.
6. **Rascunhar escopo mínimo** — o menor incremento que gera valor real.
7. **Identificar dependências óbvias** — o que precisa existir antes.

**Output da Etapa 1**
- Tipo e plataforma
- Problema real do usuário (1-2 frases)
- Escopo mínimo proposto
- Dependências identificadas

Não há critério de aceite nem prioridade aqui — só contexto suficiente para refinar.

---

## Etapa 2 — Refinar story
Transforma a feature estruturada em user story formal.

1. **Escrever a user story**: "Como [papel], quero [ação] para que [valor]."
2. **Definir critérios de aceite** — lista verificável de comportamentos esperados.
3. **Definir fora de escopo** — o que explicitamente NÃO está nesta entrega.
4. **Definir Definition of Done** para esta story específica.
5. **Validar com Marcelo** se a evidência de código suporta o escopo proposto.
6. **Confirmar com o usuário** se o entendimento está correto antes de prosseguir.

**Output da Etapa 2**
```markdown
## User Story
Como [papel], quero [ação] para que [valor].

## Critérios de aceite
- [ ] [comportamento verificável 1]
- [ ] [comportamento verificável 2]

## Fora de escopo
- [o que não será feito nesta entrega]

## Definition of Done
- [ ] [critério de done específico]
```

A story deve caber em 1-3 dias de trabalho focado. Se for grande demais, dividir em múltiplas stories antes de avançar. Critério de aceite deve ser verificável por Gema sem interpretação.

---

## Etapa 3 — Quebrar em tasks
Quebra a story em tasks pequenas, independentes e executáveis por um agente específico.

1. **Identificar domínios** da story: Android / PWA / UX / QA / Docs.
2. **Chamar Marcelo** para mapear arquivos e módulos afetados antes de planejar.
3. **Criar tasks por domínio**, garantindo que cada uma:
   - Toca no máximo 1 módulo principal.
   - Tem agente responsável claro.
   - Tem critério de aceite verificável.
   - É independente das outras (ou tem ordem explícita).
4. **Verificar WIP** de cada agente antes de atribuir.
5. **Ordenar execução** — o que bloqueia o quê.
6. **Criar task files** em `.claude/tasks/active/` ou `.claude/tasks/queue/<agente>/`.
7. **Registrar no Linear** a subissue ou checklist correspondente, se a task derivar de uma issue aprovada.

**Task size limits**
- Android/PWA: ≤1 módulo principal, ≤2 dias de trabalho.
- UX: ≤3 telas por revisão.
- QA: ≤1 feature por ciclo de QA.
- Marcelo: ≤5 arquivos por task de dev.

**Output da Etapa 3**
```
TASK-001: [título]
  Agente: Camilo
  Escopo: [o que fazer]
  Aceite: [como verificar]
  Bloqueia: TASK-003
  Task file: .claude/tasks/active/TASK-001.md
```

---

## Limites
- Não criar task que mistura Android e PWA no mesmo agente.
- Não criar task vaga ("melhorar o diagnóstico" não é task).
- Refactor amplo exige aprovação explícita antes de virar task.
- Prioridade é decidida pela Claudete depois, não dentro deste fluxo.
