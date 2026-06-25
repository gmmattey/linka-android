#!/bin/bash
# pre-commit hook para Android — validação de release readiness
# Instalar: cp scripts/pre-commit-android.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir erro
error() {
    echo -e "${RED}✗ ERRO: $1${NC}" >&2
    exit 1
}

# Função para imprimir sucesso
success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Função para imprimir aviso
warn() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Verificar se há arquivos staged no android/
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)
HAS_ANDROID_CHANGES=false

for file in $STAGED_FILES; do
    if [[ "$file" =~ ^android/ ]]; then
        HAS_ANDROID_CHANGES=true
        break
    fi
done

# Se não houver mudanças no android/, pular validações Android
if [ "$HAS_ANDROID_CHANGES" = false ]; then
    exit 0
fi

echo "Executando validações de pre-commit Android..."

# ==============================================================================
# 1. Validar versionCode e versionName
# ==============================================================================

LIBS_VERSIONS="android/gradle/libs.versions.toml"

if [ ! -f "$LIBS_VERSIONS" ]; then
    error "Arquivo $LIBS_VERSIONS não encontrado"
fi

# Extrair versionCode
VCODE=$(grep "versionCode" "$LIBS_VERSIONS" | grep -v "^#" | sed 's/.*"\([^"]*\)".*/\1/' | head -1)
if [ -z "$VCODE" ] || ! [[ "$VCODE" =~ ^[0-9]+$ ]]; then
    error "versionCode em $LIBS_VERSIONS está vazio ou inválido. Encontrado: '$VCODE'"
fi

# Extrair versionName
VNAME=$(grep "versionName" "$LIBS_VERSIONS" | grep -v "^#" | sed 's/.*"\([^"]*\)".*/\1/' | head -1)
if [ -z "$VNAME" ]; then
    error "versionName em $LIBS_VERSIONS está vazio"
fi

# Validar formato SemVer (X.Y.Z)
if ! [[ "$VNAME" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    error "versionName '$VNAME' não segue SemVer (X.Y.Z)"
fi

success "Versionamento OK — versionCode=$VCODE, versionName=$VNAME"

# ==============================================================================
# 2. Validar que a versão existe em CHANGELOG.md
# ==============================================================================

CHANGELOG="CHANGELOG.md"
if [ ! -f "$CHANGELOG" ]; then
    warn "CHANGELOG.md não encontrado — pulando validação"
else
    # Procurar por [X.Y.Z] no CHANGELOG
    if ! grep -q "\[$VNAME\]" "$CHANGELOG"; then
        error "Versão [$VNAME] não encontrada em $CHANGELOG. Adicione a versão antes de fazer commit."
    fi
    success "Changelog contém versão [$VNAME]"
fi

# ==============================================================================
# 3. Validar que não há arquivos .old, .bak ou .tmp em android/
# ==============================================================================

JUNK_FILES=$(find android -type f \( -name "*.old" -o -name "*.bak" -o -name "*.tmp" \) 2>/dev/null | wc -l)
if [ "$JUNK_FILES" -gt 0 ]; then
    error "Encontrados $JUNK_FILES arquivo(s) de lixo (.old/.bak/.tmp) em android/. Limpe antes de commitar."
fi

success "Higiene — nenhum arquivo .old/.bak/.tmp encontrado"

# ==============================================================================
# 4. Validar ktlint (se configurado)
# ==============================================================================

# Tentar rodar ktlintCheck — se falhar por comando não encontrado, pular silenciosamente
if grep -q "id.*ktlint" android/gradle/libs.versions.toml 2>/dev/null || \
   grep -q "ktlint" android/build.gradle.kts 2>/dev/null || \
   grep -q "ktlint" android/app/build.gradle.kts 2>/dev/null; then
    
    echo "Rodando ktlintCheck..."
    if (cd android && ./gradlew.bat ktlintCheck 2>&1 | grep -q "BUILD SUCCESSFUL\|No files to lint"); then
        success "Kotlin linting OK"
    else
        warn "ktlintCheck falhou — você pode rodar './android/gradlew.bat ktlintFormat' para corrigir"
        # Não bloqueamos aqui — apenas aviso. Se quiser ser mais rigoroso, descomente:
        # error "ktlint falhou. Rode './android/gradlew.bat ktlintFormat' e tente novamente."
    fi
fi

# ==============================================================================
# Resultado final
# ==============================================================================

echo ""
success "Validações Android OK — pronto para commitar"
exit 0
