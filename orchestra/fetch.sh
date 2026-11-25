#!/usr/bin/env bash
# Fetches the orchestra: real recorded sections from VSCO 2 Community Edition (CC0, Versilian Studios),
# only the folders the score uses, converted to 44.1 kHz 16-bit stereo WAV (trimmed, max 9 s).
# Output: orchestra/samples/ (not committed). Run once per machine: bash orchestra/fetch.sh
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; OUT="$HERE/samples"; SRC="${VSCO_SRC:-/tmp/vsco}"
DIRS=(
 "Strings/Violin Section/susVib" "Strings/Violin Section/Pizz" "Strings/Violin Section/Spic" "Strings/Violin Section/Trem"
 "Strings/Viola Section/susvib" "Strings/Viola Section/pizz" "Strings/Viola Section/spic"
 "Strings/Cello Section/susvib" "Strings/Cello Section/pizzT" "Strings/Cello Section/spic" "Strings/Cello Section/trem"
 "Strings/Solo Contrabass/SusVib" "Strings/Solo Contrabass/Pizz" "Strings/Harp"
 "Brass/F Horn/sus" "Brass/F Horn/stac" "Brass/Trumpet/sus" "Brass/Trumpet/stac" "Brass/Tenor Trombone/sus" "Brass/Tuba/sus"
 "Woodwinds/Flute/susvib" "Woodwinds/Flute/stac" "Woodwinds/Oboe/Vib" "Woodwinds/Clarinet/susLong" "Woodwinds/Clarinet/stac"
 "Woodwinds/Bassoon/sus" "Woodwinds/Bassoon/stac"
 "Percussion/Timpani" "Percussion/Glock" "Percussion/temp"
 "VSCO 1 Percussion/drums/bass" "VSCO 1 Percussion/varMetal/Cymbals" "VSCO 1 Percussion/varMetal/Gong"
)
if [ ! -d "$SRC/.git" ]; then git clone -q --filter=blob:none --no-checkout --depth 1 https://github.com/sgossner/VSCO-2-CE "$SRC"; fi
cd "$SRC"; git sparse-checkout init --no-cone; printf '/%s/\n' "${DIRS[@]}" > .git/info/sparse-checkout; git checkout -q HEAD
for d in "${DIRS[@]}"; do
  key=$(echo "$d" | sed 's|^VSCO 1 Percussion|Perc|; s| |_|g; s|/|__|g')
  mkdir -p "$OUT/$key"
  for f in "$SRC/$d"/*.wav; do
    [ -f "$f" ] || continue; o="$OUT/$key/$(basename "$f")"; [ -f "$o" ] && continue
    ffmpeg -nostdin -loglevel error -y -i "$f" -t 9 -af "afade=t=out:st=8.6:d=0.4" -ar 44100 -ac 2 -c:a pcm_s16le "$o"
  done
done
echo "orchestra ready: $(find "$OUT" -name '*.wav' | wc -l) samples, $(du -sh "$OUT" | cut -f1)"
