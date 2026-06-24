---
name: checar-entrega
description: Gate de qualidade antes de marcar uma entrega como Done — critérios de aceite, regressão e release gate. Executado pela Gema.
---

## Quando usar
Gema executa como gate único antes de mover qualquer task para DONE e antes de toda release. Substitui os checklists separados de critérios de aceite, regressão, release e Done/Not Done.

## Processo
1. Ler o arquivo de task em `.claude/tasks/active/` para localizar critérios de aceite.
2. Rodar as três seções abaixo (Critérios de aceite, Regressão, Release gate).
3. Registrar resultado no arquivo de task.
4. Emitir o veredito final Done/Not Done.

Gema não reescreve código — apenas classifica e documenta. Bug crítico → devolver para Camilo/Renan com detalhe do problema.

---

## 1. Critérios de aceite

Para cada critério da user story, verificar se foi atendido (leitura de código ou pergunta ao implementador).

- [ ] Todos os critérios de aceite da user story atendidos
- [ ] Critério ambíguo esclarecido com o implementador antes de decidir
- [ ] Nenhum bug crítico sem resolução
- [ ] Bugs menores registrados como follow-up task

| Situação | Decisão |
|---|---|
| Todos critérios atendidos, sem bug crítico | APROVADO |
| Critério bloqueante não atendido | BLOQUEADO |
| Critérios atendidos, bugs menores | PARCIAL — follow-up task criado |

---

## 2. Regressão

Aplicar após mudança que toque módulos core (`:coreNetwork`, `:coreDatabase`, `:coreDatastore`) ou múltiplas features. Foca no diff — não testa código não tocado.

Método: para cada flow, executar manualmente ou verificar que o código não foi alterado; se foi, confirmar que a mudança não quebra contrato de interface; checar logs de crash.

Flows críticos Android:

| Flow | O que verificar |
|---|---|
| Home → Speedtest | Inicia e conclui sem crash |
| Home → Wi-Fi | Lista redes, exibe RSSI, identifica banda |
| Home → Diagnóstico | Completa diagnóstico, exibe resultado |
| Home → Histórico | Lista medições anteriores corretamente |
| Home → DNS | Consulta DNS, exibe latência e status |
| Speedtest → Resultado | Salva no banco, exibe no histórico |
| Cold start com permissão negada | Não crasha, solicita permissão contextualmente |
| Modo offline | Não crasha, exibe estado offline |

Flows críticos PWA:

| Flow | O que verificar |
|---|---|
| Speedtest completo | Inicia, mede download/upload/ping, exibe resultado |
| Resultado → Histórico | Resultado aparece no histórico local |
| Offline → Online | App se recupera sem refresh manual |
| PWA instalada | Funciona como app standalone |

Severidade:

| Severidade | Critério | Ação |
|---|---|---|
| Crítico | Flow não inicia ou crasha | BLOQUEAR |
| Alto | Flow completo com dado errado | BLOQUEAR |
| Médio | Flow funciona com UX degradada | Registrar, entregar com nota |
| Baixo | Problema cosmético | Registrar como follow-up |

---

## 3. Release gate

Critérios obrigatórios (bloqueantes):

- [ ] TypeScript / Kotlin compilando sem erros
- [ ] Sem regressão detectada nas flows principais
- [ ] Nenhum TODO crítico não resolvido introduzido
- [ ] Testes unitários passando
- [ ] Testes de integração passando (se existem)
- [ ] Fluxo principal testado manualmente (smoke test)
- [ ] Sem crash nos logs
- [ ] Performance aceitável (sem janks ou travamentos óbvios)
- [ ] Sem log de debug excessivo em produção
- [ ] CHANGELOG atualizado (`/checar-release`)
- [ ] versionCode/versionName incrementados (Android) ou manifest version atualizado (PWA), se for release

Desejáveis (não bloqueantes — pendências viram follow-up):

- [ ] Cobertura de testes mantida ou melhorada
- [ ] Lighthouse score PWA ≥ 80
- [ ] Screenshots/docs atualizados se UI mudou

---

## 4. Veredito Done/Not Done

Uma task está **DONE** quando todas as três seções passam e o handoff foi feito:

- [ ] Critérios de aceite APROVADO
- [ ] Regressão sem severidade Crítico/Alto
- [ ] Release gate obrigatório todo atendido
- [ ] Status atualizado para DONE no Linear (issue correspondente)
- [ ] Arquivo de task atualizado com status DONE e data
- [ ] Claudete notificada do fechamento
- [ ] Follow-up tasks criadas no backlog se necessário

Casos **Not Done**:

| Situação | Status correto |
|---|---|
| Código feito, sem smoke test do flow | IN_PROGRESS — testar antes |
| Critério de aceite não atendido | BLOCKED — devolver para implementador |
| CHANGELOG não atualizado | IN_PROGRESS — atualizar primeiro |
| Bug crítico ou regressão Crítico/Alto | BLOCKED |
| Bug menor, flow principal OK | DONE com follow-up task criada |

Resultados possíveis:
- **APROVADO** → DONE, registra data e artefatos.
- **BLOQUEADO** → volta para IN_PROGRESS com lista dos itens não atendidos.
- **PARCIAL** → entrega com itens desejáveis pendentes documentados como follow-up.

Registro no arquivo de task:

```markdown
## Fechamento — [DATA]
**Status:** DONE | BLOQUEADO | PARCIAL
**Fechado por:** Gema
**Critérios de aceite:** X/X
**Regressão:** sem Crítico/Alto | [severidade encontrada]
**Release gate:** atendido | [itens pendentes]
**Follow-up tasks:** [lista ou "nenhuma"]
**CHANGELOG:** atualizado em [arquivo]
```
