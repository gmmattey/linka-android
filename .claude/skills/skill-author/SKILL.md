---
description: Nina cria, atualiza ou depreca um arquivo de skill seguindo o padrão do projeto — conforme instrução explícita da Claudete via /skill-steward.
---

## Quando usar

Nina recebe instrução direta da Claudete (via `/skill-steward`) para:
- Criar nova skill do zero
- Atualizar seção específica de skill existente
- Marcar skill como deprecated (soft-delete)

## Quem usa

Nina — exclusivamente. Nina não decide o que criar ou remover, só executa o que Claudete determinou.

## Passos — Criar nova skill

1. Verificar se o slug já existe:
   ```bash
   Test-Path ".claude/skills/[slug]/SKILL.md"
   ```
   Se existir → reportar para Claudete, não duplicar.

2. Criar o diretório:
   ```bash
   New-Item -ItemType Directory ".claude/skills/[slug]"
   ```

3. Escrever `.claude/skills/[slug]/SKILL.md` com o template obrigatório:

```markdown
---
description: [verbo + objeto + quem + quando. Máx 120 chars]
---

## Quando usar
[condição de trigger — específica, não genérica]

## Quem usa
[agente responsável por invocar]

## Passos
[lista numerada de ações concretas]

## Output esperado
[o que o agente deve produzir ao final]

## Limites
[mínimo 2 itens — o que esta skill NÃO faz]
```

4. Postar para Gema revisar antes de confirmar entrega.

## Passos — Atualizar skill existente

1. Ler `.claude/skills/[skill-name]/SKILL.md` completo.
2. Localizar a seção a ser atualizada (ou identificar onde inserir nova subseção).
3. Editar apenas a parte especificada pela Claudete — não reescrever o arquivo inteiro.
4. Manter estilo de escrita consistente com o restante do arquivo.
5. Postar diff para Gema revisar.

## Passos — Soft-delete (deprecação)

1. Verificar se a skill está referenciada em algum agent `.md`:
   ```bash
   Select-String -Path ".claude/agents/*.md" -Pattern "[skill-name]"
   ```
   Se encontrada → remover a referência do agent file antes de prosseguir. Informar Claudete sobre a remoção.

2. Adicionar no topo do `SKILL.md` existente:
   ```markdown
   > [DEPRECATED] — [DATA] — Motivo: [razão da remoção]
   > Evidências: [obs-file-1, obs-file-2]
   > Aprovado por: Claudete
   ```

3. Renomear o arquivo:
   ```bash
   Rename-Item ".claude/skills/[skill-name]/SKILL.md" "SKILL.md.deprecated"
   ```
   Skills com extensão `.deprecated` não são carregadas pelo runtime do Claude Code.

4. Registrar em `.claude/skill-observations/deprecated-log.md`:
   | [data] | [skill-name] | [motivo] | [evidências] | Claudete |

5. Postar confirmação para Claudete.

## Regras de escrita de skill

- `description:` no frontmatter é obrigatório. Uma linha. Máx 120 chars.
- Description: verbo + objeto + quem + quando.
- Seção **Limites** é obrigatória — define escopo negativo da skill.
- Nenhuma skill pode referenciar agente que não existe em `.claude/agents/`.
- Linguagem: português. Termos técnicos em inglês onde necessário.
- Sem filosofia. Sem romantização. Passos concretos.
- Não escrever comentários explicando o quê — só escrever o porquê quando não for óbvio.

## Output esperado

Arquivo de skill criado, atualizado ou renomeado conforme instrução. Confirmação postada para Gema revisar.

## Limites

- Nina não decide o que criar, atualizar ou remover — só executa instrução de Claudete.
- Nina não aprova suas próprias alterações — Gema aprova sempre.
- Nina não reescreve skills existentes por iniciativa própria.
- Hard-delete (remoção física do diretório) somente com confirmação explícita do usuário — nunca por iniciativa de Nina ou Claudete.
