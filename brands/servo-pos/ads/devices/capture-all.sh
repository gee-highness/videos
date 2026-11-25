#!/usr/bin/env bash
# Captures every role's device shots ONE AT A TIME (five at once starve a 4-core machine and the sign-in never finishes).
# Usage: ads/devices/capture-all.sh [baseUrl] [FAKE_NOW]
#   baseUrl   default http://localhost:3000 (the local stack, started with NEXT_PUBLIC_DEMO_URL=http://localhost:3000)
#   FAKE_NOW  ISO UTC time for the browser clock, default 2026-10-20T11:43:00Z. Use the time you ticked the demo to
#             (Eswatini is UTC+2: demo_tick.py --now 13:43 local = 11:43Z) so ticket ages and clocks look live.
# Needs: NODE_PATH=$(npm root), the stack running, the demo seeded, ticked and dressed (see WORKFLOW.md).
set -u
cd "$(dirname "$0")/../.."
BASE="${1:-http://localhost:3000}"
export FAKE_NOW="${2:-2026-10-20T11:43:00Z}"
export NODE_PATH="$(npm root)"
for role in waiter kitchen cashier guest manager; do
  echo "== $role"
  node ads/devices/capture.js "$BASE" "$role" || echo "   $role failed, re-run it alone: node ads/devices/capture.js $BASE $role"
done
