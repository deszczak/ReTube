#!/bin/bash
# Build browser-specific extension directories from shared source

set -e

BROWSERS=("chrome" "firefox" "safari")

for browser in "${BROWSERS[@]}"; do
  dist="dist/$browser"
  rm -rf "$dist"
  mkdir -p "$dist/icons"

  # Copy shared source files
  cp src/content.js "$dist/"
  cp src/background.js "$dist/"
  cp src/styles.css "$dist/"

  # Copy icons: Chrome uses PNGs, others use SVGs
  if [ "$browser" = "chrome" ]; then
    cp src/icons/*.png "$dist/icons/"
  else
    cp src/icons/*.svg "$dist/icons/"
  fi

  # Copy browser-specific manifest
  cp "manifests/$browser.json" "$dist/manifest.json"

  echo "Built $dist"
done

echo "Done. Load extensions from dist/<browser>/"