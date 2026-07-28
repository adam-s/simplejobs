#!/usr/bin/env node
/**
 * Visual snapshot tool for simplejobs.
 *
 * Walks the app through its named states and captures a PNG at three viewports
 * for each, plus the accessibility tree and a console-error count. Patterned on
 * waypoint/prototypes/iep-assessment/scripts/snapshot-capture.mjs.
 *
 * The aria snapshots are the part worth gating on. Pixel diffs on a resurrected
 * Angular 1.5 app are noise — a font metric shifts and every screenshot
 * "fails". The aria tree says *the heading disappeared*, which is signal.
 *
 * Usage:
 *   node scripts/snapshot-capture.mjs [--label=round1]
 *                                     [--headless=false]
 *                                     [--base=http://localhost:3000]
 *                                     [--no-server]
 *
 * Output:
 *   .snapshots/<label>/
 *     <state>-<viewport>.png
 *     <state>.aria.yaml
 *     summary.json
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const E2E_ROOT = resolve(__dirname, '..');
const REPO = resolve(E2E_ROOT, '..');

const args = Object.fromEntries(
  process.argv
    .slice(2)
    .filter((a) => a.startsWith('--'))
    .map((a) => {
      const [k, v] = a.replace(/^--/, '').split('=');
      return [k, v ?? 'true'];
    }),
);

const LABEL = args.label ?? 'local';
const HEADLESS = args.headless !== 'false';
const START_SERVER = args['no-server'] !== 'true';
const BASE = (args.base ?? 'http://localhost:3000').replace(/\/$/, '');
const OUT = resolve(E2E_ROOT, '.snapshots', LABEL);

mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 },
];

/**
 * The app's ui-router states, by URL. Taken from the .state() definitions in
 * client/public/scripts — not guessed.
 */
const STATES = [
  { name: '01-home', path: '/' },
  { name: '02-search-jobs', path: '/search/jobs' },
  { name: '03-search-resumes', path: '/search/resumes' },
  { name: '04-guide-overview', path: '/guide/overview' },
  { name: '05-guide-faq', path: '/guide/faq' },
  { name: '06-terms', path: '/terms' },
  { name: '07-not-found', path: '/no-such-page-exists' },
];

console.log('\nsnapshot-capture');
console.log(`label:    ${LABEL}`);
console.log(`headless: ${HEADLESS}`);
console.log(`server:   ${START_SERVER ? 'managed' : 'external'}`);
console.log(`base:     ${BASE}`);
console.log(`out:      ${OUT}\n`);

let serverProc = null;

async function ensureServer() {
  if (!START_SERVER) return;
  console.log('starting server …');
  // detached puts the child in its own process group, so one kill takes the
  // whole tree down rather than orphaning node.
  serverProc = spawn('node', ['server.js'], {
    cwd: REPO,
    detached: true,
    stdio: 'ignore',
    env: { ...process.env, NODE_ENV: 'development' },
  });
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`${BASE}/api/job-listings`);
      if (res.ok) {
        console.log('server up\n');
        return;
      }
    } catch {
      /* not listening yet */
    }
    await delay(500);
  }
  throw new Error('server did not come up within 30s');
}

function stopServer() {
  if (serverProc?.pid) {
    try {
      process.kill(-serverProc.pid, 'SIGTERM');
    } catch {
      /* already gone */
    }
  }
}

/**
 * Redact anything that could carry a session out of the run and into a file.
 * The artifacts directory is gitignored, but a token in a committed trace is
 * still a token on disk.
 */
function redact(text) {
  return String(text)
    .replace(/(authorization|cookie|set-cookie)\s*[:=]\s*\S+/gi, '$1: [redacted]')
    .replace(/(token|secret|password)=[^&\s]+/gi, '$1=[redacted]');
}

const summary = { label: LABEL, base: BASE, states: [] };

try {
  await ensureServer();

  const browser = await chromium.launch({ headless: HEADLESS });

  for (const state of STATES) {
    const record = { name: state.name, path: state.path, viewports: [], consoleErrors: [] };

    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await context.newPage();

      page.on('console', (m) => {
        if (m.type() === 'error') record.consoleErrors.push(redact(m.text()));
      });
      page.on('pageerror', (e) => record.consoleErrors.push(redact(`pageerror: ${e.message}`)));

      const response = await page.goto(`${BASE}${state.path}`, {
        waitUntil: 'networkidle',
        timeout: 30_000,
      });

      // Angular bootstraps and then resolves its state; networkidle fires
      // before the digest settles, so give the view a beat to render.
      await page.waitForTimeout(1200);

      const file = `${state.name}-${vp.name}.png`;
      await page.screenshot({ path: resolve(OUT, file), fullPage: false });

      record.viewports.push({
        viewport: vp.name,
        status: response?.status() ?? null,
        file,
      });

      // One aria snapshot per state, from the widest viewport — the layout
      // changes with width but the accessibility tree should not.
      if (vp.name === 'desktop') {
        const aria = await page.locator('body').ariaSnapshot();
        writeFileSync(resolve(OUT, `${state.name}.aria.yaml`), aria + '\n');
        record.title = await page.title();
      }

      await context.close();
    }

    const errCount = record.consoleErrors.length;
    console.log(
      `${errCount === 0 ? '✓' : '✗'} ${state.name.padEnd(20)} ${record.title ?? ''}` +
        (errCount ? `  (${errCount} console errors)` : ''),
    );
    summary.states.push(record);
  }

  await browser.close();
} finally {
  stopServer();
}

summary.totalConsoleErrors = summary.states.reduce((n, s) => n + s.consoleErrors.length, 0);
writeFileSync(resolve(OUT, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');

console.log(`\n${summary.states.length} states, ${summary.totalConsoleErrors} console errors`);
console.log(`artifacts: ${OUT}\n`);

process.exit(summary.totalConsoleErrors === 0 ? 0 : 1);
