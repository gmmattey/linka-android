#!/usr/bin/env bash
# Ativa os git hooks versionados do monorepo. Rodar uma vez por clone.
set -euo pipefail
root=$(git rev-parse --show-toplevel)
git config core.hooksPath scripts/hooks
chmod +x "$root/scripts/hooks/"* 2>/dev/null || true
echo "OK: core.hooksPath = scripts/hooks (guardrail cross-stack ativo)"
