#!/usr/bin/env bash
# Copy the site to Desktop/TjéTjéheimasíða after each save.
set -euo pipefail

SRC="${SRC:-/workspace}"
DEST="${DEST:-$HOME/Desktop/TjéTjéheimasíða}"

mkdir -p "$DEST"

if command -v rsync >/dev/null 2>&1; then
  rsync -a --delete \
    --exclude node_modules \
    --exclude .next \
    --exclude .git \
    --exclude .cursor \
    --exclude "HVAR-ER-ÞETTA.txt" \
    "$SRC/" "$DEST/"
else
  mkdir -p "$DEST"
  cp -a "$SRC/app" "$SRC/components" "$SRC/lib" "$SRC/public" "$DEST/"
  cp -a "$SRC"/package*.json "$SRC"/next.config.ts "$SRC"/tsconfig.json "$SRC"/README.md "$DEST/" 2>/dev/null || true
fi

cat > "$DEST/HVAR-ER-ÞETTA.txt" << 'EOF'
Þetta er afrit af Tjé Tjé heimasíðunni.

Vinnan er vistuð hér á Desktopinu og uppfærist sjálfkrafa við hverja
vistun í verkefninu. Til að keyra síðuna:

  npm install
  npm run dev

Síðan opnast á http://127.0.0.1:4318
EOF

echo "Vistað á $DEST"
