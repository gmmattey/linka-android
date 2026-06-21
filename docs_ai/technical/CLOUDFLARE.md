# Cloudflare Integration — Android SignallQ

**Última atualização:** 2026-06-21 (v0.16.0)
**Fonte:** `integrations/cloudflare/ai-diagnosis-worker/wrangler.toml`, `src/index.ts`, `featureDiagnostico/ai/`

---

## 1. Worker: linka-ai-diagnosis-worker

**Name (wrangler.toml):** `linka-ai-diagnosis-worker`

**URL de produção:** `https://linka-ai-diagnosis-worker.giammattey-luiz.workers.dev`

**Endpoint consumido pelo app:** `POST /api/ai/diagnostico-conexao`

**Plataforma:** Cloudflare Workers (edge serverless)

---

## 2. Configuração (wrangler.toml)

| Variável de ambiente | Valor | Descrição |
|---|---|---|
| `AI_MODEL` | `@cf/qwen/qwen3-30b-a3b-fp8` | Modelo padrão (Qwen3 30B MoE FP8) |

O modelo pode ser sobrescrito por variável de ambiente em deploy — o worker lê `env.AI_MODEL ?? DEFAULT_MODEL`.

---

## 3. Modelo Padrão

**Qwen3 30B MoE FP8** (`@cf/qwen/qwen3-30b-a3b-fp8`) via Cloudflare AI.

Histórico de modelos testados:
- Gemma 7B-IT (`@cf/google/gemma-7b-it`): fraco para prompt complexo, deprecation planejado
- Gemma 2 9B (`@hf/google/gemma-2-9b-it`): formato `@hf/` incompatível com messages API
- Gemma 4 26B (`@cf/google/gemma-4-26b-a4b-it`): gerava 2500+ tokens de reasoning, timeout > 30s — descartado
- Qwen3 30B MoE FP8: modelo atual, sem timeouts, qualidade adequada

O README do worker ainda menciona Gemma como padrão — está desatualizado. A fonte de verdade é `wrangler.toml` e `DEFAULT_MODEL` em `src/index.ts`.

---

## 4. Integração no App Android

**Módulo responsável:** `:featureDiagnostico`

**Classe cliente:** `AiDiagnosisRepository` (`featureDiagnostico/ai/`)

**Factory de payload:** `DiagnosisAiContextFactory` — monta o JSON schema v3 (`diagnostico_v3_raw`)

**Schema aceito pelo worker:** v1, v2, v3 (retrocompatível)

**Transporte:** OkHttp 4.12.0 — POST JSON

---

## 5. Fluxo de Chamada

```
DiagnosticOrchestrator.executar()
    → DiagnosisAiContextFactory.fromRaw(snapshotRede, resultadosLocais, preferencias)
    → AiDiagnosisRepository.diagnosticar(contexto)
        → POST https://linka-ai-diagnosis-worker.giammattey-luiz.workers.dev/api/ai/diagnostico-conexao
        → Response JSON → AiDiagnosisResult
    → Fallback: AiFallbackFactory.fromLocal() se timeout ou erro
```

---

## 6. Deploy

Para atualizar o worker:

```bash
# No diretório integrations/cloudflare/ai-diagnosis-worker/
npx wrangler deploy
```

**Regra do processo de release (CLAUDE.md):** quando houver mudanças em `integrations/cloudflare/ai-diagnosis-worker/src/`, executar `npx wrangler deploy` ANTES do commit Android.

---

## 7. Arquivos do Worker

| Arquivo | Propósito |
|---|---|
| `wrangler.toml` | Configuração do worker — name, compatibility_date, AI_MODEL |
| `src/index.ts` | Lógica principal: roteamento, montagem do prompt, chamada ao modelo, parser de resposta |
| `package.json` | Dependências Node (wrangler) |
