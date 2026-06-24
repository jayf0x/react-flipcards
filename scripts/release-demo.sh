#!/usr/bin/env bash
set -euo pipefail

# Manually (re)deploy the GitHub Pages demo without cutting a new npm release.
#
# Version tags (v*) already deploy the demo automatically via
# .github/workflows/deploy-demo.yml. Use this script when you only changed the
# demo and want to push it live now.
#
# Requires: gh CLI, authenticated, with the repo as origin.

WORKFLOW="deploy-demo.yml"

command -v gh >/dev/null 2>&1 || { echo "✗ gh CLI not found — https://cli.github.com"; exit 1; }

# Build locally first so a broken demo never reaches Pages.
echo "→ Building demo locally…"
( cd "$(dirname "$0")/../demo" && bun install && bun run build:gh )

echo "→ Triggering '$WORKFLOW' on GitHub…"
gh workflow run "$WORKFLOW"

echo "✓ Deploy dispatched. Track it with:  gh run watch"
