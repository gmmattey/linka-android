# Changelog — SignallQ PWA

## Nao lancado

### Changed
- **Reconstrucao das telas de Velocidade, Historico e Ajustes (sem reaproveitar as telas anteriores).**
  Landing e Home antigos foram removidos: a tela inicial do app agora e a
  propria medicao de velocidade (`VelocidadeIdleScreen`), com arco de medir,
  seletor de modo (Rapido/Completo) e ultimo resultado — sem tela de
  boas-vindas separada. `SpeedTestScreen` (medindo) e `ResultScreen` tambem
  foram refeitas: anel de progresso por fase com cronometro real (nao um
  numero de velocidade fabricado — o navegador so sabe o valor real quando a
  fase termina) e, no resultado, veredito por caso de uso (streaming/jogos/
  chamada de video) so quando download, upload, latencia e jitter foram
  efetivamente medidos (ver `docs/parity.md`).

  **Sem navbar e sem titulo de tela no header** nessas telas — decisao de
  produto. Navegacao por acao de conteudo em vez de chrome fixo (ver
  `DESIGN.md`, secao Navigation). `TopAppBar`/`AppShell` continuam so nas
  telas ainda nao redesenhadas (Sobre, Detalhe de teste, Laudo).

  Removido por falta de uso: `HomeScreen`, `LandingScreen`, componentes
  `ProgressRing` e `StepTracker` (e CSS/keyframes associados).

  Modo **"Rapido"** usa a opcao `skipUpload` do runner (ja existia, nunca
  tinha sido ligada a nada); modo **"Triplo"** do mockup de design nao foi
  implementado nesta rodada (exigiria rodar a medicao 3x e agregar
  resultados — feature nova, nao so troca de tela) e ficou fora do escopo
  desta entrega.

### Fix
- **Motor de velocidade podia fabricar numero em vez de reportar falha.**
  `speedTestRunner.ts` confiava demais na resposta dos endpoints de
  download/upload: se a resposta nao fosse exatamente o formato esperado
  (ex: rodando so `vite dev`, sem o backend de Functions — cenario real de
  alguem testando localmente com o comando errado), o codigo assumia sucesso
  e usava o proprio payload enviado como se fosse o dado medido. Corrigido
  para validar a resposta antes de contar como sucesso: download exige o
  header `X-SignallQ-Speedtest-Bytes` (exclusivo do endpoint real, ver
  `functions/_modules/speedtest.ts`), upload exige JSON valido com
  `receivedBytes` numerico. Sem isso, a requisicao conta como falha e a UI
  mostra "nao foi possivel medir" em vez de um numero inventado (principio
  de honestidade do `PRODUCT.md`). Testado nos dois cenarios (backend real e
  backend ausente) antes e depois da correcao.

- **Icones nao renderizam no Safari/iOS (GitHub #365).** O componente `Icon`
  (`src/design-system/components/Icon/`) usava ligadura tipografica do
  Material Symbols (`<span class="material-symbols-outlined">nome</span>`),
  dependente de `font-feature-settings: 'liga'`. O WebKit/Safari nao aplica
  essa ligadura de forma confiavel — o nome literal do icone (ex: `arrow_back`)
  aparecia como texto em vez do glifo. Tentativas anteriores (forcar `liga` via
  CSS, liberar Google Fonts no CSP) nao resolveram porque o problema e de
  suporte do motor de renderizacao, nao de carregamento de fonte.

  **Solucao:** migrado para SVG inline. Os paths dos 33 icones usados no app
  (conjunto fechado, todos vindos de literais no codigo — nenhum vem cru do
  worker de IA) foram extraidos do pacote `@material-symbols/svg-400` v0.45.5
  (outlined, weight 400) e do catalogo oficial `fonts.google.com/icons`
  (para `auto_awesome` e `install_mobile`, ausentes desse pacote especifico) e
  bundled em `src/design-system/components/Icon/iconPaths.ts`. Sem fetch
  externo em runtime, sem CDN, sem dependencia de fonte — funciona offline e
  em qualquer navegador. A API do componente (`name`, `size`, `className`,
  `style`, `aria-hidden`) nao mudou; os 46 pontos de uso existentes (incluindo
  os mapas `VERDICT_ICON`/`LEVEL_ICON`) continuam funcionando sem alteracao.

  Removido: regra `.material-symbols-outlined` (`src/styles/tokens.css`),
  regra duplicada em `src/design-system/styles.css`, `<link>` da fonte
  Material Symbols Outlined no `index.html`, e a dependencia de dev
  `@material-symbols/svg-400` (usada so para extrair os paths, nao roda em
  producao). Adicionada regra base `.sq-icon` para alinhamento vertical do
  SVG. Fonte Roboto (texto) mantida — nao relacionada ao bug.
