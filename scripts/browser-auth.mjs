import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const url = process.env.GAME_URL || 'http://127.0.0.1:4187/';
const output = process.env.EVIDENCE_DIR || 'docs/evidence/browser-auth';
const username = process.env.BB_TEST_USERNAME;
const password = process.env.BB_TEST_PASSWORD;
if (!username || !password) throw new Error('Supply test credentials in the process environment.');
await fs.mkdir(output, { recursive: true });
const report = { date: new Date().toISOString(), url, checks: [], errors: [], limitations: ['Local production container; does not establish an external HTTPS route or Engineering deployment.'] };
const request = (resource, authorization) => fetch(new URL(resource, url), { headers: authorization ? { Authorization: authorization } : {} });
const authorization = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
let browser;
try {
    for (const resource of ['', 'index.html', 'build-info.json', 'assets/characters/nero-production-v2.png']) {
        const response = await request(resource);
        assert.equal(response.status, 401, resource);
        assert.match(response.headers.get('www-authenticate'), /^Basic /);
        await response.arrayBuffer();
    }
    report.checks.push('Anonymous HTML, build identity and assets require browser authentication.');
    const wrong = await request('', `Basic ${Buffer.from(`${username}:invalid-test-password`).toString('base64')}`);
    assert.equal(wrong.status, 401); await wrong.arrayBuffer();
    const health = await request('health.html'); assert.equal(health.status, 200); await health.arrayBuffer();
    const valid = await request('build-info.json', authorization); assert.equal(valid.status, 200);
    report.build = await valid.json();
    report.checks.push('Invalid credentials denied; valid credentials accepted; container health remains usable.');
    browser = await chromium.launch({ ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}), args: ['--no-sandbox'] });
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, httpCredentials: { username, password } });
    const page = await context.newPage();
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400 && response.status() !== 401) report.errors.push(`${response.status()} ${response.url()}`); });
    await page.goto(url);
    await page.waitForFunction(() => window.blackBird?.scene.isActive('MenuScene'));
    await page.screenshot({ path: path.join(output, 'authenticated-menu.png') });
    await page.keyboard.press('Enter', { delay: 80 });
    await page.waitForFunction(() => window.blackBird.scene.isActive('GameScene'));
    await page.waitForTimeout(300);
    const before = await page.evaluate(() => window.blackBird.scene.getScene('GameScene').player.x);
    await page.keyboard.down('d'); await page.waitForTimeout(600); await page.keyboard.up('d');
    const after = await page.evaluate(() => { const scene = window.blackBird.scene.getScene('GameScene'); return { x: scene.player.x, bottom: scene.player.body.bottom, mode: scene.mode }; });
    assert.ok(after.x > before + 40); assert.equal(after.bottom, 318);
    await page.screenshot({ path: path.join(output, 'authenticated-game.png') });
    report.checks.push('Authenticated browser loads menu and all required resources, enters opening and moves Nero on the floor.');
    report.observed = { before, after };
    assert.deepEqual(report.errors, []);
} catch (error) {
    report.failure = error.stack; console.error(error); process.exitCode = 1;
} finally {
    await browser?.close();
    await fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
    console.log(report);
}
