#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if ! command -v node >/dev/null; then
  echo 'Please install Node.js 24 from https://nodejs.org/ and try again.'
  exit 1
fi
if [ ! -d node_modules ]; then npm ci; fi
printf '%s\n' 'Open http://localhost:5173 after the server is ready.'
exec npm run dev
