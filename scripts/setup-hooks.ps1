# Ativa os git hooks versionados do monorepo. Rodar uma vez por clone.
$ErrorActionPreference = "Stop"
git config core.hooksPath scripts/hooks
Write-Host "OK: core.hooksPath = scripts/hooks (guardrail cross-stack ativo)"
