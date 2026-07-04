-- SIG-13: feature flags remotas para controle de telas/funcionalidades do app
-- Aplicar: npx wrangler d1 execute signallq-admin-db --remote --file=migrations/005_sig13.sql

CREATE TABLE IF NOT EXISTS feature_flags (
  key         TEXT    PRIMARY KEY,
  enabled     INTEGER NOT NULL DEFAULT 0,
  description TEXT    NOT NULL DEFAULT '',
  updated_at  INTEGER NOT NULL,
  updated_by  TEXT    NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS feature_flag_audit (
  id          TEXT    PRIMARY KEY,
  flag_key    TEXT    NOT NULL,
  old_enabled INTEGER,
  new_enabled INTEGER NOT NULL,
  changed_at  INTEGER NOT NULL,
  changed_by  TEXT    NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_ffa_flag_key ON feature_flag_audit(flag_key);
CREATE INDEX IF NOT EXISTS idx_ffa_changed_at ON feature_flag_audit(changed_at);

-- Flags iniciais (todas ativas por padrão)
INSERT OR IGNORE INTO feature_flags (key, enabled, description, updated_at, updated_by)
VALUES
  ('feature_speedtest',     1, 'Tela de Teste de Velocidade', unixepoch(), 'system'),
  ('feature_wifi',          1, 'Tela de Análise de WiFi',     unixepoch(), 'system'),
  ('feature_fibra',         1, 'Tela de Diagnóstico Fibra',   unixepoch(), 'system'),
  ('feature_diagnostico_ia',1, 'Overlay Diagnóstico IA',      unixepoch(), 'system'),
  ('feature_devices',       1, 'Overlay Dispositivos Rede',   unixepoch(), 'system'),
  ('feature_dns',           1, 'Análise DNS',                 unixepoch(), 'system');
