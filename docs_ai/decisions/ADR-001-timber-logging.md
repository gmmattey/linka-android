# ADR-001: Usar Timber como biblioteca de logging

**Data:** 2026-05-24  
**Status:** Accepted

## Contexto

O projeto Android herdou uso inconsistente de `Log.*` (Android logging nativo) espalhado pelo codebase. A biblioteca `Log.d()`, `Log.e()` etc. oferece pouca flexibilidade para:
- Redirecionamento de logs em diferentes ambientes (debug vs. release)
- Integração com ferramentas de crash reporting (Firebase Crashlytics, etc.)
- Formatação uniforme de mensagens
- Supressão de logs em release sem refactoring

## Decisão

Migrar todo logging do projeto para usar **Timber** (biblioteca mantida por Jake Wharton, depêndência padrão em arquitetura moderna Android).

**Implementação:**
- Adicionar `com.jakewharton.timber:timber` em `libs.versions.toml`
- Inicializar em `LinkaApplication.onCreate()` com plant de debug
- Remover todas as ocorrências de `Log.d()`, `Log.e()`, `Log.w()`, `Log.i()`, `Log.v()`
- Usar `Timber.d()`, `Timber.e()`, etc. em lugar

**Benefícios:**
- Logs automaticamente suprimidos em release (via BuildConfig.DEBUG)
- Stack trace rastreável em relatório de crashes
- Formatação consistente com tag automática (classe + linha)
- Integração futura com Crashlytics sem mudança de código

## Consequências

- **Impacto:** ~70 ocorrências de `Log.*` refatoradas (PR #28)
- **Dependência nova:** Timber (leve, sem maiores dependências)
- **Performance:** Negligenciável (Timber é otimizado para zero-overhead quando desabilitado)
- **Reversão:** Improvável; Timber é padrão de ouro em Android moderno

## Referências

- PR #28: Refactor Log.* para Timber (70 ocorrências)
- Issue #6: Logger
- Site: https://github.com/JakeWharton/timber
