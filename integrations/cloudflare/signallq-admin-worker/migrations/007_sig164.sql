-- SIG-164: gaps medium/low — campos adicionais em ai_usage e diagnostic_sessions
-- Aplicar: npx wrangler d1 execute signallq-admin-db --file=migrations/007_sig164.sql --remote
--
-- NOTA: D1 (SQLite) não suporta "IF NOT EXISTS" em ALTER TABLE.
-- Execute cada comando separadamente para tolerar falhas em colunas já existentes.
-- Ignorar erros "table already has column" — são esperados em D1 existente.
--
-- Alternativa linha a linha:
--   npx wrangler d1 execute signallq-admin-db --remote --command="ALTER TABLE ai_usage ADD COLUMN dist_channel TEXT DEFAULT ''"
--   npx wrangler d1 execute signallq-admin-db --remote --command="ALTER TABLE ai_usage ADD COLUMN build_type TEXT DEFAULT 'release'"
--   npx wrangler d1 execute signallq-admin-db --remote --command="ALTER TABLE ai_usage ADD COLUMN device_id TEXT DEFAULT ''"
--   npx wrangler d1 execute signallq-admin-db --remote --command="ALTER TABLE diagnostic_sessions ADD COLUMN rssi INTEGER DEFAULT NULL"
--   npx wrangler d1 execute signallq-admin-db --remote --command="ALTER TABLE diagnostic_sessions ADD COLUMN banda_wifi TEXT DEFAULT NULL"
--   npx wrangler d1 execute signallq-admin-db --remote --command="ALTER TABLE diagnostic_sessions ADD COLUMN padrao_wifi TEXT DEFAULT NULL"

-- Gap 2: contexto de build em ai_usage (enviados pelo Android mas descartados até agora)
ALTER TABLE ai_usage ADD COLUMN dist_channel TEXT DEFAULT '';
ALTER TABLE ai_usage ADD COLUMN build_type   TEXT DEFAULT 'release';
ALTER TABLE ai_usage ADD COLUMN device_id    TEXT DEFAULT '';

-- Gap 3: métricas de sinal WiFi em diagnostic_sessions (enviadas ao AI Worker mas não persistidas)
ALTER TABLE diagnostic_sessions ADD COLUMN rssi        INTEGER DEFAULT NULL;
ALTER TABLE diagnostic_sessions ADD COLUMN banda_wifi  TEXT    DEFAULT NULL;
ALTER TABLE diagnostic_sessions ADD COLUMN padrao_wifi TEXT    DEFAULT NULL;
