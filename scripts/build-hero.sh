#!/usr/bin/env bash
#
# Rebuilds docs/media/hero.png from the most recent snapshot capture.
#
# The README's image is not a mockup. `npm run snapshot` walks the app through
# seven states at three viewports against a live server; this tiles two of those
# frames. If a page regresses, the next capture's hero shows it.
#
#   npm run snapshot -- --label=readme && ./scripts/build-hero.sh
#
# Requires ffmpeg (brew install ffmpeg).

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

SHOTS="e2e/.snapshots/readme"
DESKTOP="$SHOTS/02-search-jobs-desktop.png"
MOBILE="$SHOTS/01-home-mobile.png"

for f in "$DESKTOP" "$MOBILE"; do
  [[ -f "$f" ]] || { echo "missing: $f — run npm run snapshot -- --label=readme first" >&2; exit 1; }
done

mkdir -p docs/media

# The mobile frame is scaled to the desktop frame's height so hstack lines them
# up; 788 is the desktop capture's height once it is 1120 wide.
ffmpeg -y -loglevel error \
  -i "$DESKTOP" \
  -i "$MOBILE" \
  -filter_complex "\
[0]scale=1120:-2,pad=iw+28:ih+28:14:14:color=0x0B2027[a];\
[1]scale=-2:788,pad=iw+28:ih+28:14:14:color=0x0B2027[b];\
[a][b]hstack=inputs=2,pad=iw+72:ih+72:36:36:color=0x0B2027" \
  docs/media/hero.png

echo "docs/media/hero.png  <-  $SHOTS"
