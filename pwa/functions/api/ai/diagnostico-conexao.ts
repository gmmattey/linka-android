import { errorResponse, optionsResponse } from '../../_shared/http';
import { resolveAiWorkerUrl, type AiDiagnosisEnv } from '../../_shared/env';
import { proxyAiDiagnosis } from '../../_modules/diagnosis';

export const onRequestOptions: PagesFunction<AiDiagnosisEnv> = async () => optionsResponse();

export const onRequestPost: PagesFunction<AiDiagnosisEnv> = async ({ request, env }) => {
  const workerUrl = resolveAiWorkerUrl(env);
  if (!workerUrl) {
    return errorResponse('AI_WORKER_URL não configurada no ambiente Pages.', 503);
  }

  return proxyAiDiagnosis(request, workerUrl);
};
