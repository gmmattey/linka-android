# SignallQ Site — redesign dos componentes PWA (PR #1186)

- **Status:** proposto — aguardando aprovação do Luiz antes de handoff pro Camilo
- **Origem:** Luiz julgou a tela real ruim após ver o preview da PR #1186 (`feat/site-pwa-instalavel`).
  A PR foi implementada só por Camilo e revisada só por Rhodolfo (QA por código) — sem passagem de
  design. Decisão da Claudete registrada como aprendizado: qualquer superfície nova visível ao
  usuário passa pela Lia antes de subir, mesmo pequena.
- **Protótipo:** `index.html` nesta mesma pasta — HTML autônomo, sem build, usa os tokens reais de
  `packages/design-system/styles/tokens.css`. Abrir direto no navegador. Botões no topo alternam
  tema claro/escuro e os dois toasts (instalar / atualizar) pra testar colisão.
- **Nota de harness:** a tool `DesignSync` (Claude Design online) não propagou nesta sessão de
  subagente — limitação já conhecida (ver memória `project_designsync_bridge_e_estrutura`). Por
  isso o protótipo ficou local em HTML, não no projeto "SignallQ — Protótipos" (`e77ea465-…`).
  Claudete precisa subir este conteúdo lá quando tiver a tool disponível, ou aprovar direto pelo
  HTML mesmo.

## Diagnóstico — o que estava errado (por componente)

### 1. `AdSlot.tsx` — pior ofensor
O placeholder "sem AdSense configurado" deixou de ser um aviso honesto e discreto (borda
tracejada + texto neutro) e virou um **card falso de anúncio**: ícone de imagem quebrada dentro de
uma caixa cinza, título "Conteúdo patrocinado", descrição em tom de marketing futuro
("Anúncios relevantes aparecem aqui.") e um **botão desabilitado com aparência clicável**
("Saiba mais" — borda arredondada, mesma forma dos botões reais do site). Isso contraria o próprio
propósito documentado do componente ("placeholder honesto") e cria affordance quebrada: usuário vai
tentar clicar num botão morto. Também é card-dentro-de-card (o wrapper do AdSlot já tem
border+overline "Publicidade"; o conteúdo interno reintroduz outro card com fundo).

**Fix:** volta a ser aviso simples — borda tracejada, sem preenchimento, overline "Publicidade" +
uma linha de texto secundário. Sem ícone, sem botão fantasma, sem copy que promete algo que não
existe ainda.

### 2. `PwaUpdatePrompt.tsx` / `.css`
- Cor sólida `--accent` preenchendo o pill inteiro com texto branco hardcoded (`#fff`, não usa
  token `--on-accent`) — peso visual muito mais pesado que qualquer outro elemento do site,
  que usa cards brancos/tema com accent só em texto e ícone (ver `ConfirmDialog`,
  `DownloadAppCallout`). Quebra a regra "flat, elevação tonal, sem bloco de cor saturada".
- Botão de fechar usa o caractere `×` cru — o resto do site usa `material-symbols-outlined` em
  100% dos lugares (`InstallPwaPrompt` inclusive). Dois sistemas de ícone na mesma tela.
- **Nenhum padrão de toast/snackbar existe no design system** (`packages/design-system` não tem
  nada do tipo) — o dev inventou um do zero sem checar se já havia algo, e sem coordenar com o
  `InstallPwaPrompt`, que é outro toast fixo independente.
- `App.tsx` monta os dois (`PwaUpdatePrompt` + `InstallPwaPrompt`) incondicionalmente, sempre
  visíveis juntos quando ambos os gatilhos disparam — sem pilha, sem gap definido, risco real de
  sobreposição em telas estreitas (instalar fica `bottom-4 left-4`, atualizar fica
  `bottom-center` quase full-width).

**Fix:** os dois toasts passam a usar a mesma casca visual (card branco/`bg-card`, borda fina,
pill), texto e ação em `--accent` (nunca bloco sólido), ícone Material Symbol único em todos os
casos, e vivem numa pilha vertical coordenada (`gap: 8dp`), não dois elementos `fixed`
independentes brigando pelo mesmo canto da tela.

### 3. `RecommendationsCard.tsx`
O componente em si segue os tokens corretamente (overline, `label-large`, `body-small`,
border+`bg-card`) — o problema é **onde ele foi encaixado**. Hoje ele renderiza dentro do
`ResultPanel`, no meio do hero com fundo em gradiente, onde todo o resto (tira de métricas, ícones
de caso de uso, detalhes técnicos) é *flat* — sem card, sem fundo sólido. O card branco do
Recommendations aparece como uma caixa isolada flutuando sobre o gradiente, único elemento com
essa linguagem ali dentro.

**Fix:** mover o card pra fora do hero, pra seção inferior (`py-10`, fundo `bg-primary` sólido)
onde já existem outros cards (`DownloadAppCallout`) — mesma linguagem visual, mesma seção
("o que vem a seguir" depois do resultado). Ordem proposta: Recomendações (valor pro usuário)
→ Download do app (CTA comercial) → diferenciais → AdSlot.

### 4. `InstallPwaPrompt.tsx`
Sozinho, o componente já segue os tokens corretamente (ícone Material Symbol, `bg-card`, borda).
O problema dele é só a falta de coordenação com o `PwaUpdatePrompt` (item 2) — resolvido pela pilha
única.

## Decisões de design

1. **AdSlot volta a ser honesto por padrão** — nunca simular conteúdo real quando não há anúncio
   real configurado. Placeholder = aviso, não teatro.
2. **Toasts do PWA usam a mesma casca visual dos cards do site** (`bg-card` + borda fina + pill),
   nunca bloco de cor sólida — consistente com a regra "flat, elevação tonal, sem sombra dura" já
   praticada em `ConfirmDialog`/`DownloadAppCallout`.
3. **Um único sistema de ícone** (Material Symbols Outlined) em 100% dos elementos novos — sem
   glifo ASCII de fechar.
4. **Toasts coordenados numa pilha única**, não dois `fixed` independentes.
5. **RecommendationsCard sai do hero flat e entra na seção de cards** — consistência de linguagem
   visual por zona da tela, não por componente isolado.

## Handoff pro Camilo

Arquivos a alterar (ele implementa, não eu):
- `SignallQ Site/src/components/AdSlot.tsx` — simplificar o placeholder (remover ícone, botão
  desabilitado, e copy de card falso).
- `SignallQ Site/src/components/InstallPwaPrompt.tsx` + `PwaUpdatePrompt.tsx` + `.css` — unificar
  como toasts na mesma casca (`bg-card`, ação em texto `--accent`, ícone Material Symbol único) e
  compor num container de pilha único (`gap: var(--space-sm)`, `flex-direction: column-reverse`).
- `SignallQ Site/src/App.tsx` — trocar os dois componentes soltos por um container de pilha comum.
- `SignallQ Site/src/components/speedtest/ResultPanel.tsx` — remover `<RecommendationsCard>` do
  meio do hero.
- `SignallQ Site/src/pages/HomePage.tsx` — receber `<RecommendationsCard>` na seção inferior,
  antes do `<DownloadAppCallout>`, com as `recommendations` subindo do `ResultPanel`/`useSpeedTest`
  (Camilo decide o caminho de prop/estado mais limpo — não é decisão de design).

Não mudei nenhum arquivo `.tsx`/`.css` real do Site — só o protótipo em
`.claude/design-specs/2026-07-19-site-pwa-redesign/`.
