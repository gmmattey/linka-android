---
name: revisar-ux
description: Revisão de UI/UX cobrindo Material Design 3, hierarquia visual, estados vazios, acessibilidade (TalkBack/WCAG/ARIA) e microcopy. Android e PWA.
---

Revisa UI/UX de telas e componentes do SignallQ (Android Compose e PWA React) em uma única passada: Material 3, hierarquia visual, estados vazios, acessibilidade e microcopy.

Alvo da revisão:

$ARGUMENTS

## Fonte de verdade

O design system é a fonte. Consulte `.claude/skills/linka-design/` antes de qualquer decisão visual — NÃO copie tokens aqui.
- Tokens (cores, tipografia): `colors_and_type.css` e `SignallQTheme.kt`.
- Equivalência CSS → Compose: `HANDOFF_README.md`.
- Componentes de referência: `ui_kits/android/`.

## Quando usar

Após implementação de tela nova ou modificação visual, ou antes de implementar quando há UI obrigatória. Pré-requisito para fechar Done em qualquer feature com UI ou conteúdo dinâmico.

---

## 1. Material 3 e hierarquia visual

Cores e tema
- [ ] Usa tokens do `MaterialTheme` / `LocalLkTokens` (Android) ou tokens CSS/Tailwind (PWA) — sem hardcode de cor.
- [ ] Cores seguem role MD3: primary, secondary, surface, on-surface, etc.
- [ ] Dark mode funciona sem quebrar contraste.

Tipografia
- [ ] Usa `MaterialTheme.typography.*` — sem `fontSize` avulso.
- [ ] Hierarquia legível: headline > title > body > label.

Componentes
- [ ] Usa componentes MD3 nativos quando existem (Button, Card, TextField, etc).
- [ ] Não cria componente custom quando o nativo resolve.
- [ ] Elevation correta por nível de superfície.

Layout e espaçamento
- [ ] Margens e paddings seguem grid de 4dp/8dp.
- [ ] Nenhum elemento colado na borda sem padding mínimo de 16dp.

Hierarquia e clareza
- [ ] Hierarquia visual clara — o que o olho vê em 1º, 2º e 3º.
- [ ] Hierarquia de ações: botões primários e secundários bem definidos.
- [ ] Usuário entende o que está acontecendo na tela.
- [ ] Sem excesso de informação — corta o que polui sem agregar valor.
- [ ] Consistência entre Android e PWA — sem divergências injustificadas.

---

## 2. Estados vazios

Para cada tela/componente com conteúdo dinâmico:
- [ ] Estado vazio existe — não mostra lista vazia sem mensagem.
- [ ] Microcopy do estado vazio explica o que fazer, não só "Nenhum resultado".
- [ ] Ícone ou ilustração quando aplicável.
- [ ] Estado de loading definido (antes dos dados chegarem).
- [ ] Estado de erro definido (quando a busca falha).
- [ ] Botão de ação no estado vazio quando aplicável (ex: "Executar diagnóstico").

Todos os estados — loading, erro, sucesso e vazio — devem estar cobertos e ter microcopy.

---

## 3. Acessibilidade

Android (Compose / TalkBack)
- [ ] Todos os elementos interativos têm `contentDescription` ou `semantics`.
- [ ] Ícones decorativos têm `contentDescription = null`.
- [ ] Tamanho mínimo de toque: 48dp x 48dp.
- [ ] Contraste de texto: mínimo 4.5:1 (normal), 3:1 (grande).
- [ ] TalkBack funciona sem elementos invisíveis sendo lidos.
- [ ] Ordem de foco lógica, com `traversalOrder` se necessário.

PWA (WCAG / ARIA)
- [ ] Elementos interativos têm `aria-label` ou texto visível.
- [ ] Contraste WCAG AA: 4.5:1 (texto normal), 3:1 (texto grande).
- [ ] Foco visível em todos os elementos interativos.
- [ ] Imagens têm `alt` text.
- [ ] Formulários têm `label` associado.

---

## 4. Microcopy

- [ ] Sem jargão técnico que o usuário comum não entende.
- [ ] Frases curtas (máximo 2 linhas em estado de erro/loading).
- [ ] Tom consistente: direto, humano, não robótico.
- [ ] Botões: verbo + objeto. Ex: "Testar velocidade" não "OK".
- [ ] Erros explicam o que aconteceu E o que fazer. Não só "Erro".
- [ ] Loading states comunicam o que está acontecendo. Não só "Carregando...".
- [ ] Respostas de IA não usam "Olá!" ou "Claro!" como abertura.
- [ ] Nomes próprios do produto corretos: "SignallQ", "SignallQ SpeedTest".

---

## Output

Veredito visual: **Aprovado / Aprovado com ressalvas / Reprovado**.

Por seção, lista de itens: ✅ OK | ❌ Problema | ⚠️ Atenção — com arquivo, linha e sugestão de correção. Agrupe os achados por severidade:
- **Críticos** — bloqueiam UX, exigem correção imediata.
- **Médios** — afetam qualidade, resolver antes do release.
- **Ajustes rápidos** — melhorias pontuais, baixo risco.

## Limites

- Esta skill identifica e revisa — não implementa. Correções vão para Camilo (Android) ou Renan (PWA).
- Decisões de fluxo, produto ou experiência → escalar Lia em modo Sonnet.
