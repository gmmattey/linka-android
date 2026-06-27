# CI/CD Cloudflare Pages

## Objetivo

Definir o caminho tecnico para validar, gerar preview e publicar o SignallQ PWA no Cloudflare Pages sem alterar arquivos globais do monorepo.

## Escopo atual

Esta configuracao cobre apenas `pwa/`:

- build local com Vite;
- validacao TypeScript e testes;
- Cloudflare Pages Functions em `functions/`;
- deploy manual via Wrangler;
- documentacao das variaveis server-side.

A automacao GitHub Actions depende de arquivo fora de `pwa/` e deve ser feita somente com autorizacao explicita para alterar CI/CD global.

## Projeto Pages

Configuracao local:

- arquivo: `pwa/wrangler.jsonc`;
- projeto: `signallq-pwa`;
- output: `dist`;
- build command: `npm run build`;
- compatibility date: `2026-06-25`.

## Scripts

```bash
npm run typecheck
npm test
npm run build
npm run verify
npm run pages:dev
npm run pages:deploy
```

`npm run verify` executa typecheck, testes e build. O projeto ainda nao possui script `lint`; se um workflow global exigir lint, ele deve tratar a ausencia do script explicitamente ou o script deve ser criado em uma issue propria.

## Variaveis e secrets

Variaveis server-side esperadas no Cloudflare Pages:

- `AI_WORKER_URL`
- `ADMIN_INGEST_URL` ou `ADMIN_WORKER_URL`
- `ADMIN_INGEST_KEY`

Para desenvolvimento local com `wrangler pages dev`, use `.dev.vars`. Esse arquivo nao deve ser versionado.

Variaveis com prefixo `VITE_` sao publicas por definicao e nao devem receber segredo, token, ingest key ou URL privada que dependa de autenticacao.

## Deploy manual

1. Instalar dependencias:

```bash
npm ci
```

2. Validar:

```bash
npm run verify
```

3. Testar Pages Functions localmente:

```bash
npm run pages:dev
```

4. Publicar:

```bash
npm run pages:deploy
```

O deploy exige autenticacao Wrangler/Cloudflare no ambiente local ou token configurado no CI.

## Workflow GitHub pendente

Quando houver autorizacao para tocar CI/CD global, criar workflow em `.github/workflows/` com estes passos restritos ao path `pwa/**`:

- checkout;
- setup Node;
- `cd pwa`;
- `npm ci`;
- `npm run typecheck`;
- `npm test`;
- `npm run build`;
- deploy preview/production via Cloudflare Pages quando `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` existirem.

O workflow nao deve injetar `ADMIN_INGEST_KEY` no bundle client e nao deve usar variaveis `VITE_*` para secrets.

## Criterios de aceite locais

- `npm run typecheck` passa;
- `npm test` passa;
- `npm run build` passa;
- `npm run pages:dev` sobe as Pages Functions localmente quando necessario;
- secrets documentados e fora do bundle;
- nenhuma alteracao fora de `pwa/`.
