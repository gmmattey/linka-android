# Modelo de Laudo Local

## Decisão inicial

O laudo compartilhável do MVP é local-only.

A rota `/laudo/:id` usa o `id` da entrada salva no histórico local. Ela não consulta backend e não sincroniza entre dispositivos.

## Implementação atual

- `src/features/report/ReportPage.tsx`
- `src/features/report/reportRepository.ts`
- `src/features/report/reportTypes.ts`
- `src/shared/storage/historyRepository.ts`

## Contrato

```ts
type Report = {
  id: string;
  historyEntryId: string;
  timestampEpochMs: number;
  title: string;
  summary: string;
  status: 'good' | 'attention' | 'critical' | 'inconclusive';
  sections: Array<{ title: string; body: string }>;
  sourceDataRefs: string[];
  localOnly: true;
};
```

## Estados

- carregando: lendo IndexedDB;
- encontrado: renderiza resumo, métricas, ações e limitações;
- não encontrado: explica que os dados ficam neste navegador;
- erro: informa falha de leitura local.

## Limite do MVP

Abrir o mesmo link em outro navegador, outro aparelho ou depois de limpar dados locais deve exibir “Laudo não encontrado neste navegador”.

Compartilhamento remoto real depende de storage backend futuro.
