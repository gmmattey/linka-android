# SignallQ PWA — Docs

Documentação operacional do SignallQ PWA.

O Notion guarda contexto, decisões e alinhamento. Esta pasta guarda instruções versionadas junto do código.

## Documentos

- `m0-definition-of-done.md` — fundação M0.
- `architecture.md` — arquitetura operacional.
- `functional-spec.md` — telas e fluxos.
- `speedtest-contract.md` — contrato do teste de conexão web.
- `diagnosis-contract.md` — contrato do diagnóstico.
- `history-model.md` — histórico local.
- `design-system.md` — design system operacional.
- `release-checklist.md` — checklist de PR e release.
- `decisions.md` — decisões relevantes.

## Ordem sugerida

1. `m0-definition-of-done.md`
2. `architecture.md`
3. `functional-spec.md`
4. `speedtest-contract.md`
5. `diagnosis-contract.md`
6. `design-system.md`
7. `release-checklist.md`
8. `history-model.md`
9. `decisions.md`

## Padrão de branch

Preferido:

```text
codex/pwa/<sig-id>-<descricao-curta>
```

Fallback:

```text
codex-pwa-<sig-id>-<descricao-curta>
```

## Padrão de PR

```text
Codex PWA — <descrição>
```

## Escopo

O trabalho do PWA deve ficar dentro de `pwa/`, salvo aprovação explícita.
