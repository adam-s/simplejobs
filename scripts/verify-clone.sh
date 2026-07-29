#!/usr/bin/env bash
#
# Proves a fresh clone runs.
#
# The rule that makes this a test rather than a second, divergent set of
# instructions: everything between the BEGIN/END markers below must appear
# verbatim in README.md's Quickstart. If this script needs a step the README
# does not have, the README is wrong — fix the README, not the script.
#
# This repo is the reason the rule exists. server/config/environment/development.js
# was tracked but empty, because the real one was held out of git with
# `git update-index --assume-unchanged`. A fresh clone had never been able to
# boot, and nobody noticed for eight years.
#
#   ./scripts/verify-clone.sh                       # clone this working copy
#   ./scripts/verify-clone.sh https://github.com/adam-s/simplejobs.git
#
# Cloning the local repo already catches the big one — git only carries
# committed files, so anything untracked is absent. Passing the remote is the
# stronger check: it also catches "works because of something on my machine".

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REMOTE="${1:-file://$REPO_ROOT}"
TMP="$(mktemp -d)"
MONGO_NAME="simplejobs-verify-$$"
PORT=3456

cleanup() {
  local status=$?
  [[ -n "${SERVER_PID:-}" ]] && kill "$SERVER_PID" 2>/dev/null || true
  docker rm -f "$MONGO_NAME" >/dev/null 2>&1 || true
  rm -rf "$TMP"
  exit $status
}
trap cleanup EXIT

fail() { echo "❌ $1"; exit 1; }

echo "verify-clone"
echo "  source: $REMOTE"
echo "  temp:   $TMP"
echo

echo "==> cloning"
git clone --quiet "$REMOTE" "$TMP/repo"
cd "$TMP/repo"

echo "==> mongo"
docker run -d --name "$MONGO_NAME" -p 27018:27017 mongo:4.4 >/dev/null
for _ in $(seq 1 30); do
  docker exec "$MONGO_NAME" mongo --quiet --eval 'db.version()' >/dev/null 2>&1 && break
  sleep 1
done

# nvm is a shell function, not a binary, so it has to be sourced before use.
# Its own scripts reference unset variables, so `set -u` has to come off around
# anything that calls into it.
set +u
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
# shellcheck disable=SC1091
. "$NVM_DIR/nvm.sh"

export MONGODB_URI="mongodb://127.0.0.1:27018/simplejobs-verify"
export PORT="$PORT"

# ---------- BEGIN verbatim from README.md § Quickstart ----------
nvm install && nvm use
npm install
npm run build
npm run seed
npm start &
# ----------------- END verbatim from Quickstart -----------------

SERVER_PID=$!
set -u

# The whole point of the nvm line above is that this code runs on the Node it
# was written for. Assert it, so a broken .nvmrc surfaces here rather than as a
# baffling syntax error three steps later.
ACTIVE_NODE="$(node --version | sed 's/^v//')"
PINNED_NODE="$(tr -d '[:space:]' < .nvmrc)"
[[ "$ACTIVE_NODE" == "$PINNED_NODE" ]] \
  || fail "expected Node $PINNED_NODE from .nvmrc, got $ACTIVE_NODE"
echo "  ✓ running on Node $ACTIVE_NODE, as .nvmrc pins" 

echo
echo "==> waiting for the API"
for _ in $(seq 1 40); do
  if curl -fsS "http://localhost:$PORT/api/job-listings" >/dev/null 2>&1; then break; fi
  sleep 1
done


echo "==> checking"

# Read the expected count from the fixtures rather than hardcoding it. A
# literal here drifted once already — the fixture set was trimmed and this
# check kept asserting the old number, so the gate that exists to catch drift
# was itself broken.
EXPECTED="$(node -e "console.log(require('./server/lib/fixtures.js').JOB_LISTINGS.length)")"
COUNT="$(curl -fsS "http://localhost:$PORT/api/job-listings" \
  | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>console.log(JSON.parse(s).metadata.totalCount))")"
[[ "$COUNT" == "$EXPECTED" ]] || fail "expected $EXPECTED seeded job listings, got '$COUNT'"
echo "  ✓ API serves $EXPECTED seeded job listings"

curl -fsS "http://localhost:$PORT/api/crew-listings" >/dev/null || fail "crew listings endpoint failed"
echo "  ✓ API serves crew listings"

HTML="$(curl -fsS "http://localhost:$PORT/")"
grep -q 'ng-app="simplejobs"' <<<"$HTML" || fail "the client shell did not render"
echo "  ✓ client shell renders"

CSS_STATUS="$(curl -o /dev/null -s -w '%{http_code}' "http://localhost:$PORT/css/sass/app.css")"
[[ "$CSS_STATUS" == "200" ]] || fail "stylesheets missing — did npm run build run?"
echo "  ✓ stylesheets built and served"

VENDOR_STATUS="$(curl -o /dev/null -s -w '%{http_code}' "http://localhost:$PORT/bower_components/angular/angular.min.js")"
[[ "$VENDOR_STATUS" == "200" ]] || fail "vendor scripts missing — did npm run build run?"
echo "  ✓ vendor scripts installed and served"

echo
echo "✅ a fresh clone runs"
