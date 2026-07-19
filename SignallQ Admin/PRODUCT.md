# Product

## Register

product

## Users

Operador técnico interno do squad SignallQ — Camilo (dev), Claudete (PM/Tech Lead), Rhodolfo (QA/
release), Lia (design), e o próprio Luiz (CEO/fundador técnico). Não é usuário final do app; é quem
precisa responder, em minutos, perguntas como "o crash rate subiu depois do último release?", "a
IA está estourando cota?", "quantos diagnósticos rodaram essa semana e onde falharam?". Job to be
done: investigar saúde do produto e custo de operação sem abrir Firebase Console, Play Console e
Cloudflare Dashboard separadamente — um painel único que já cruza os dados relevantes.

## Product Purpose

SignallQ Admin é o console técnico do SignallQ (React 19/Vite/TypeScript/Tailwind, backend
`signallq-admin-worker` em Cloudflare Workers + D1) — painel de operação que consolida uso do app,
diagnósticos, custo/quota de IA, erros e saúde de infraestrutura em um só lugar. Sucesso = o
operador identifica uma anomalia (pico de erro, estouro de cota, queda de retenção) e sabe
exatamente onde investigar em segundos, sem alternar entre 3+ ferramentas externas e sem precisar
confiar em número que pareça bonito mas seja de fonte incerta.

## Brand Personality

Voz: técnica, direta, sóbria — nunca "SaaS de métrica bonita" tentando parecer acolhedor. Fala
**sobre** o sistema, na 3ª pessoa objetiva ("o crash rate está em X%", não "sua conexão está boa").
Três palavras: **sóbrio, confiável, operacional**. Todo dado tem fonte declarada (linha mono
"FONTE(S) · ..." no topo de cada página) — número sem proveniência não é exibido. Sem emoji —
significado vem de ícone + cor semântica, igual ao app, mas aqui a cor carrega saúde de sistema, não
qualidade de conexão do usuário.

## Anti-references

- Dashboards SaaS de métrica genérica (tipo Vercel Analytics decorativo, Mixpanel com ilustração):
  card decorativo, gradiente "hero-metric", ilustração — competem com o dado em vez de servir a ele.
- Apps consumidor "fofos"/acolhedores (inclusive o próprio SignallQ Android): tom, paleta e
  vocabulário do console são deliberadamente mais frios — o operador não precisa ser tranquilizado,
  precisa de dado correto e rápido.
- Enterprise dashboard denso demais sem tradução (tipo Datadog cru sem contexto): números soltos sem
  veredito nem próximo passo também erram — o console herda "sempre um próximo passo" do consumer,
  só que aplicado a decisão operacional, não a instrução de usuário final.

## Design Principles

1. **Fonte declarada, sempre** — todo dado exibido informa de onde vem (D1, Firebase, Play Console,
   Cloudflare) na linha mono do rodapé de cada card/seção; nunca número sem proveniência.
2. **Sempre um próximo passo** — página nunca termina em "isso está errado" sem indicar ação
   concreta (`ActionsRow` é padrão obrigatório, não opcional).
3. **Uma cor de destaque, semântica clara** — violeta `#6C2BFF` (claro) / `#CFBCFF` (escuro) para
   ação/nav; verde/âmbar/vermelho/azul carregam significado de saúde de sistema, nada mais — nunca
   decoração.
4. **Sobriedade tonal em vez de drama visual** — alerta (erro, quota estourada) é informação
   objetiva: ícone + cor + label, nunca alarme visual (sem piscar agressivo, sem vermelho saturado
   fora de contexto de status).
5. **Card-itis é o inimigo, não a ausência de estrutura** — o console tende a envolver tudo em mais
   um card; a regra padrão é achatar quando a hierarquia tipográfica já resolve, e reservar card
   completo para unidade de conteúdo genuinamente navegável/comparável (ver `DESIGN.md`, seção 5).
6. **Nunca dado fabricado** — estado "Não disponível" (Quota Row, KPI sem fonte calculável) é sempre
   preferível a número inventado ou placeholder que pareça real.

## Accessibility & Inclusion

Sem WCAG level formal declarado. Contraste AA calibrado por tema para todo par de cor semântica
(success/attention/error/info sobre `bg-surface` — ver `DESIGN.md`, "The Per-Theme Semantic Rule").
Foco de teclado sempre visível (`shadow-focus-ring`) — prioridade real aqui, diferente do app
mobile, porque o uso majoritário do Console é desktop com teclado/mouse. Nunca depender só de cor
para status: ícone + cor + palavra sempre juntos. TalkBack/leitor de tela mobile não é prioridade
(não há app mobile do Console, uso é desktop/tablet).
