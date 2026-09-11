#!/usr/bin/env bash
# Renders public/icons/icon.svg to the PNG set iOS, Android and the PWA manifest need.
# iOS ignores SVG touch icons, so these PNGs are what actually ships to the home screen.
# Uses headless Chromium (no ImageMagick/sharp dependency). Override with CHROMIUM=/path/to/chrome.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SVG="$ROOT/public/icons/icon.svg"
OUT="$ROOT/public/icons"
CH="${CHROMIUM:-$(ls /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell 2>/dev/null | head -1 || command -v chromium || command -v chromium-browser || command -v google-chrome || echo /opt/pw-browsers/chromium)}"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

render() { # size outfile mode(any|maskable)
  local size=$1 out=$2 mode=$3 img
  if [ "$mode" = maskable ]; then
    # Full-bleed: the OS applies its own mask, so scale the tile past the edges and keep
    # the grid inside the 80% safe zone (grid spans 62.5% of the tile; at 125% it lands at 11–89%).
    img="position:absolute;left:-12.5%;top:-12.5%;width:125%;height:125%"
    bg="#0C0E13"
  else
    img="display:block;width:${size}px;height:${size}px"
    bg="transparent"
  fi
  printf '<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:%spx;height:%spx;background:%s;overflow:hidden}img{%s}</style></head><body><img src="file://%s"></body></html>' \
    "$size" "$size" "$bg" "$img" "$SVG" > "$TMP/page.html"
  "$CH" --headless=new --no-sandbox --disable-gpu --hide-scrollbars --default-background-color=00000000 \
    --window-size="${size},${size}" --screenshot="$out" "file://$TMP/page.html" >/dev/null 2>&1
  echo "wrote ${out#$ROOT/}"
}

render 180 "$OUT/icon-180.png" any
render 192 "$OUT/icon-192.png" any
render 512 "$OUT/icon-512.png" any
render 512 "$OUT/icon-512-maskable.png" maskable
