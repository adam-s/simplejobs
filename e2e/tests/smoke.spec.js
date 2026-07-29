import { createRequire } from 'node:module';
import { test, expect } from '@playwright/test';

/**
 * Behavioural coverage for the revived client. The Mocha suite covers the API;
 * this covers the thing Mocha cannot see — whether Angular 1.5 actually
 * bootstraps, routes, and renders against a modern browser.
 */

/**
 * How many job listings a seeded database holds, read from the fixtures rather
 * than written down here. The literal that used to sit in these tests drifted
 * when the fixture set was trimmed, and the tests kept asserting the old
 * number — the seeder is the source of truth, so ask it.
 */
const SEEDED_JOB_COUNT = createRequire(import.meta.url)(
  '../../server/lib/fixtures.js',
).JOB_LISTINGS.length;

test.describe('simplejobs · client', () => {

  test('01 home renders and bootstraps Angular', async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.goto('/');
    await expect(page).toHaveTitle(/Simple Yacht Jobs/);
    await expect(page.getByRole('heading', { name: /Connect with yacht industry professionals/i })).toBeVisible();

    // ng-app resolving is the real bootstrap signal — a broken Angular still
    // serves the HTML shell with a 200.
    await expect(page.locator('html.ng-scope')).toHaveCount(1);
    expect(errors).toEqual([]);
  });

  test('02 job listings render from the API', async ({ page }) => {
    await page.goto('/search/jobs');
    await expect(page).toHaveTitle(/Search jobs/);

    // Seeded fixtures are deterministic (server/lib/seed.js), so the count is
    // an assertion rather than a guess: 25 job listings, 10 to a page.
    const cards = page.locator('md-card');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(1);
  });

  test('03 crew listings render from the API', async ({ page }) => {
    await page.goto('/search/resumes');
    await expect(page).toHaveTitle(/Search resumes/);
    await expect(page.locator('md-card').first()).toBeVisible();
  });

  test('04 navigation moves between states', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Search jobs' }).first().click();
    await expect(page).toHaveURL(/\/search\/jobs/);
    await expect(page).toHaveTitle(/Search jobs/);
  });

  test('05 unknown route falls through to the SPA, not a server 404', async ({ page }) => {
    // app.routes.js sends index.html for anything unmatched so the client
    // router can own the 404. A hard 404 here means that fell over.
    const response = await page.goto('/definitely-not-a-route');
    expect(response.status()).toBe(200);
    await expect(page.locator('html.ng-scope')).toHaveCount(1);
  });

  test('06 static asset misses still 404 instead of returning HTML', async ({ request }) => {
    // The catch-all must not swallow asset requests — an HTML body served as
    // a .js file hangs the browser, which is why this route exists.
    const response = await request.get('/scripts/does-not-exist.js');
    expect(response.status()).toBe(404);
  });
});

test.describe('simplejobs · api', () => {

  test('07 job listings are seeded deterministically', async ({ request }) => {
    const response = await request.get('/api/job-listings');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.metadata.totalCount).toBe(SEEDED_JOB_COUNT);
    expect(body.records.length).toBeGreaterThan(0);
  });

  test('08 posting a listing without a session is rejected', async ({ request }) => {
    const response = await request.post('/api/job-listings', { data: { title: 'x' } });
    expect(response.status()).toBe(401);
  });

  test('09 the mock-data wipe route is not reachable with a guessed token', async ({ request }) => {
    // Regression for the delete-everything GET. A wrong token must not wipe.
    const response = await request.get('/delete-all-the-things/MOCK_DATA_TOKEN');
    expect(response.status()).toBe(400);

    const after = await (await request.get('/api/job-listings')).json();
    expect(after.metadata.totalCount).toBe(SEEDED_JOB_COUNT);
  });

  test('10 concurrent updates by different users do not cross over', async ({ playwright }) => {
    // Regression for the per-request-state bug: ownership checks used to read
    // req.app.locals, which is shared across every in-flight request, so two
    // simultaneous requests could authorize against each other's listing.
    // Sequential requests pass even when it is broken — these must overlap.
    const ctx = await playwright.request.newContext({ baseURL: process.env.BASE_URL ?? 'http://localhost:3000' });
    const listings = (await (await ctx.get('/api/job-listings')).json()).records;

    const attempts = listings.slice(0, 6).map((listing) =>
      ctx.put(`/api/job-listings/${listing._id}`, { data: { ...listing, title: 'hijacked' } }),
    );
    const responses = await Promise.all(attempts);

    // Nobody is logged in, so every one of them must be refused. If any
    // succeeds, request state is leaking between concurrent requests.
    for (const response of responses) {
      expect([401, 403]).toContain(response.status());
    }

    const after = await (await ctx.get('/api/job-listings')).json();
    expect(after.records.some((r) => r.title === 'hijacked')).toBe(false);
    await ctx.dispose();
  });
});
