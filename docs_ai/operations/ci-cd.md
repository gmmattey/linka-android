# CI/CD Pipeline — SignallQ

Documentação do pipeline de integração contínua automatizado para SignallQ.

## Overview

O projeto possui dois workflows independentes de CI:

1. **Android CI** (`android-ci.yml`) — testes, lint, análise e build do app Android
2. **PWA CI** (`pwa-ci.yml`) — build e testes do web app (quando inicializado)

Ambos são disparados automaticamente em:
- `push` para `main`
- `pull_request` contra `main`

E respeitam filtros de caminho para evitar rodadas desnecessárias.

## Android CI — `android-ci.yml`

### Triggers

Workflow só roda se houve mudança em `android/` ou no próprio workflow.

### Jobs

#### 1. Unit Tests
- Timeout: 30 minutos
- Roda `./gradlew test` em todos os módulos Android
- Outputs: Relatório de testes em `android/**/build/reports/tests/`
- Artefato: `unit-test-reports`

#### 2. Ktlint Check
- Timeout: 15 minutos
- Verifica formatação e estilo Kotlin
- Falha em desvios do padrão de estilo

#### 3. Detekt Analysis
- Timeout: 20 minutos
- Análise de complexidade, bugs potenciais e anti-patterns
- Falha em violações críticas de qualidade

#### 4. Build Debug APK
- Timeout: 30 minutos
- Compila APK debug para validar compilação
- NÃO roda `assembleRelease` pois não há acesso às signing keys em CI
- Outputs: APK em `android/app/build/outputs/apk/debug/`
- Artefato: `debug-apk`

### Gradle Cache

Todos os jobs usam cache gradle para accelerar builds. Cache é automático entre runs na mesma branch.

### JDK

Versão fixa: **JDK 17** (Temurin).

## PWA CI — `pwa-ci.yml`

### Triggers

Filtra mudanças em `pwa/**`.

### Jobs

#### Build & Test
- Timeout: 20 minutos
- Pré-check: verifica se `pwa/package.json` existe
- Se SIM: roda `npm ci && npm run build && npm run test`
- Se NÃO: pula com aviso "PWA não inicializado"
- Outputs: Build em `pwa/dist/`
- Artefato: `pwa-build`
- PWA não inicializado não é falha — é aviso

### Node.js

Versão: **Node.js 20** (LTS).

## Histórico de Runs

Acessar em https://github.com/gmmattey/linka-android/actions

Artefatos disponibilizados por 30 dias.

## Interpretando Falhas

### Unit Tests falham

Possíveis causas:

1. **Teste quebrado** — código novo não passou nos testes existentes
   - Solução: revisar o diff e corrigir lógica ou teste
   
2. **Dependência de teste ausente**
   - Solução: verificar `build.gradle.kts` do módulo
   
3. **Flakiness** — teste passa/falha aleatoriamente
   - Solução: investigar concorrência, timeouts ou estado compartilhado

### Ktlint falha

Solução automática:

```bash
cd android && ./gradlew ktlintFormat
```

Depois commit.

### Detekt falha

Revisar arquivo flagged, considerar refatoração ou suprimir se falso positivo:

```kotlin
@Suppress("ComplexMethod")
fun complexFunction() { ... }
```

### Build Debug falha

Causas comuns:

- **Erro de compilação Kotlin** — import faltando, tipo incorreto
- **Recurso não encontrado** — arquivo XML ou imagem deletado
- **Dependência duplicada** — conflito de versões

Solução: rodar localmente `./gradlew clean assembleDebug`.

## Adicionando Novos Checks

### Android

1. Adicione a dependência no módulo `build.gradle.kts`
2. Configure em `.gradle/` ou no próprio `build.gradle.kts`
3. Adicione novo job ao `android-ci.yml`
4. Commit e teste em branch

### PWA

1. Adicione script a `pwa/package.json`:
   ```json
   "scripts": {
     "lint": "eslint src/",
     "type-check": "tsc --noEmit"
   }
   ```
2. Atualize job no `pwa-ci.yml`
3. Commit e teste

## Troubleshooting

### Cache Gradle corrompido

Solução: limpar cache em Settings → Actions → Clear all caches.

### Node ou JDK versão errada

Verificar versões em CI vs local. Se diferenças, atualizar `.github/workflows/*.yml`.

### Artefatos não aparecem

Se o job passou e nenhum arquivo foi gerado, o upload silenciosamente ignora com `if-no-files-found: ignore`.

Para debug, rodar localmente e verificar output.

## Performance

| Job | Tempo esperado |
|---|---|
| Unit Tests | 8-12 min |
| Ktlint | 2-3 min |
| Detekt | 3-5 min |
| Build Debug | 5-10 min |
| PWA Build | 4-6 min (quando inicializado) |

Total por run: ~20-35 minutos (Android) + PWA (se modificado).

## Próximos Passos

- E2E / UI tests em emulador
- Performance profiling automatizado
- Upload de resultados para dashboard externo
- Notificação automática em Slack/Discord via GitHub App
- Release workflow (deploy automatizado em tag)

