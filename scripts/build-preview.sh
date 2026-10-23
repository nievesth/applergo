#!/usr/bin/env bash
set -euo pipefail

# This script belongs to a dedicated, secret-free Cloudflare Pages preview project.
# Refuse production builds, including the initial main-branch setup build.
if [[ "${CF_PAGES:-}" != "1" || -z "${CF_PAGES_BRANCH:-}" || "${CF_PAGES_BRANCH}" == "main" ]]; then
  echo 'Preview builds require Cloudflare Pages and a non-main branch.' >&2
  exit 1
fi

cd "$(dirname "${BASH_SOURCE[0]}")/.."
npm ci
npm run lint
npm test -- --run
npm run build
